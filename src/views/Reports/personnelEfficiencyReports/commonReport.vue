<template>
  <div id='reports-bar' v-bar>
    <div id="reports-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar">
            <ComForm ref="searchFormRef" :searchIpt="searchIpt" :searchFunc="searchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L"  v-loading="uploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
          <panelTitle :panelTitleInit="panelTitle.chartTitle">
            <el-button data-id="print-btn" v-if="printButton && !isChart" type="text"  :title="$t('vicenter.common.print')" @click="handlePrint"><span class='iconfont editTable btnClass'>&#xe68b;</span></el-button>
            <el-button data-id="chart-btn" type="text" :title="$t('vicenter.common.chart')" @click='tabChartTable' :disabled="isChart"><span class='iconfont editTable btnClass' :class="{notActive: isChart}">&#xe6d4;</span></el-button>
            <el-button data-id="list-btn" type="text" :title="$t('vicenter.common.list')" @click='tabChartTable' :disabled="!isChart"><span class='iconfont editTable btnClass' :class="{notActive: !isChart}">&#xe661;</span></el-button>
            <el-dropdown @command="exportData">
              <el-button v-show="exportButton" data-id="export-btn" type="text" class='transQuery' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item data-id="exportImage-btn" v-if="isChart" command="image">{{$t('vicenter.ImageLibrary.common.exportJPG')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportExcel-btn" v-if="!isChart" command="excel">{{$t('vicenter.ImageLibrary.common.exportEXCEL')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfChart-btn" v-if="isChart" command="pdfChart">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfTable-btn" v-if="!isChart" command="pdfTable">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </panelTitle>
          <div class="chartBox" v-bar>
            <div class="chartBox-content">
              <div id="export-container">
                <textStatistic :textStatisticData="textStatisticData"></textStatistic>
                <chartStatistic ref="chartRef" v-if="isChart" :chartStatisticData="chartStatisticData"></chartStatistic>
                <ComTable v-if="!isChart" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <printTable ref="printTableRef" :printTable="printTable"></printTable>
  </div>
</template>

<script>
import ajax from '@/api/reports/reports.js'
import commonAjax from '@/api/common/common.js'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
import exportExcel from '@/lib/exportExcel/export2Excel.js'
import textStatistic from '../common/textStatistic'
import chartStatistic from '../common/chartStatistic'
export default {
  name: 'personnelEfficiencyReport',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 5,
        title: this.$t(this.$route.name),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 5,
            infoType: 'statisticConditionInfo',
            label: this.$t('vicenter.reports.common.statisticCondition')
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.statisticTime'),
                ruleProp: 'statisticTime'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'statisticTime'
              },
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.imgAnalyst'),
                ruleProp: 'person'
              },
              {
                type: 'text',
                colspan: 3,
                value: '',
                ruleProp: 'person'
              }
            ]
          },
          {
            type: 'title',
            colspan: 5,
            infoType: 'statisticDetailsInfo',
            label: this.$t('vicenter.reports.common.statisticDetails')
          },
          {
            type: 'content',
            infoType: 'statisticDetailsInfo',
            data: []
          }
        ]
      },
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Reports/index'
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.reports.common.statisticCondition')
        },
        chartTitle: {
          title: this.$t('vicenter.reports.common.statisticDetails')
        }
      },
      searchIpt: [
        {
          getLabel: this.$t('vicenter.reports.common.statisticDimension'),
          type: 'select',
          models: 'INSPECTOR',
          ruleProp: 'type',
          placeHolder: '',
          option: [
            {
              value: 'INSPECTOR', // 审图员
              label: this.$t('vicenter.reports.common.imgAnalyst')
            },
            {
              value: 'RECHECK-INSPECTOR', // 复审员
              label: this.$t('vicenter.reports.common.recheckor')
            },
            {
              value: 'AUDITOR', // 监管稽核员
              label: this.$t('vicenter.reports.common.auditor')
            }
          ],
          change: this.changeDimension,
          KeepDefault: true, // 保留默认值
          defaultValue: 'INSPECTOR', // 默认值
          hiden: true
        },
        {
          getLabel: this.$t('vicenter.reports.common.imgAnalyst'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.imgAnalyst')}),
          type: 'select2',
          // filterable: true,
          // allowCreate: true,
          // uncollapse: true,
          models: [],
          ruleProp: 'analystIds',
          roleCode: 'INSPECTOR',
          option: [],
          hiden: false,
          change: this.changePerson
        },
        {
          getLabel: this.$t('vicenter.reports.common.recheckor'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.recheckor')}),
          type: 'select2',
          // filterable: true,
          // allowCreate: true,
          // uncollapse: true,
          models: [],
          ruleProp: 'recheckorIds',
          roleCode: 'RECHECK-INSPECTOR',
          option: [],
          hiden: true,
          change: this.changePerson
        },
        {
          getLabel: this.$t('vicenter.reports.common.auditor'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.auditor')}),
          type: 'select2',
          // filterable: true,
          // allowCreate: true,
          // uncollapse: true,
          models: [],
          ruleProp: 'auditorIds',
          roleCode: 'AUDITOR',
          option: [],
          hiden: true,
          change: this.changePerson
        },
        {
          getLabel: this.$t('vicenter.reports.common.statisticTime'),
          type: 'daterange',
          models: [
            new Date(new Date(new Date().setDate(1)).toLocaleDateString()).getTime(),
            new Date(new Date().toLocaleDateString()).getTime()
          ],
          ruleProp: 'statisticTime',
          valueFormat: 'timestamp',
          editable: false,
          blur: this.blur,
          focus: this.focus,
          change: this.changeTime,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          },
          KeepDefault: true, // 保留默认值
          defaultValue: [ // 默认值
            new Date(new Date(new Date().setDate(1)).toLocaleDateString()).getTime(),
            new Date(new Date().toLocaleDateString()).getTime()
          ]
        }
      ],
      searchFunc: {
        query: this.query,
        close: this.resetForm,
        queryText: this.$t('vicenter.common.statistics'),
        resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        model: {
          type: 'INSPECTOR',
          statisticTime: [
            new Date(new Date(new Date().setDate(1)).toLocaleDateString()).getTime(),
            new Date(new Date().toLocaleDateString()).getTime()
          ],
          analystIds: [],
          recheckorIds: [],
          auditorIds: []
        },
        refName: 'personnelEfficiencyQueryForm',
        rule: {
          statisticTime: [ // 统计时间校验
            { required: true, message: this.$t('vicenter.reports.common.enterStatisticTime'), trigger: 'change' }
          ],
          analystIds: [],
          recheckorIds: [],
          auditorIds: []
        }
      },
      textStatisticData: [],
      textStatisticDataDefault: [
        {
          label: this.$t('vicenter.reports.common.imageCheckTaskQty'),
          value: 0,
          model: 'taskNum',
          width: '20%',
          bgColor: '#48a9ee',
          icon: '&#xe701;'
        },
        {
          label: this.$t('vicenter.reports.common.openToSubmit'),
          value: 0,
          model: 'openToSubmitTimeAvgLen',
          width: '20%',
          bgColor: '#97d87c',
          icon: '&#xe6a7;'
        },
        {
          label: this.$t('vicenter.reports.common.assignToSubmit'),
          value: 0,
          model: 'assignToSubmitTimeAvgLen',
          width: '20%',
          bgColor: '#ffd96e',
          icon: '&#xe6ab;'
        }
      ],
      chartStatisticData: [],
      chartStatisticDataDefault: [
        {
          title: this.$t('vicenter.reports.common.openToSubmit'),
          id: 'openToSubmit',
          chartType: 'bar',
          width: '100%',
          height: '270px',
          colors: ['#97d87c'],
          yAxisData: [],
          hideLegend: true,
          dataZoom: true,
          column: true,
          data: [
            {
              name: this.$t('vicenter.reports.common.openToSubmit'),
              model: 'openToSubmitTimeAvgLen',
              stack: 'Qty',
              seriesData: []
            }
          ],
          noData: true
        },
        {
          title: this.$t('vicenter.reports.common.assignToSubmit'),
          id: 'assignToSubmit',
          chartType: 'bar',
          width: '100%',
          height: '270px',
          colors: ['#ffd96e'],
          yAxisData: [],
          hideLegend: true,
          dataZoom: true,
          column: true,
          data: [
            {
              name: this.$t('vicenter.reports.common.assignToSubmit'),
              model: 'assignToSubmitTimeAvgLen',
              stack: 'Qty',
              seriesData: []
            }
          ],
          noData: true
        }
      ],
      allPeople: { // 全部人员
        'INSPECTOR': [],
        'RECHECK-INSPECTOR': [],
        'AUDITOR': []
      },
      queryPeople: [], // 查询的全部人员
      sortPeople: [], // 排序完成的全部人员（从小到大）
      tableGroup: [],
      tableGroupDefault: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index',
          width: '50px'
        },
        {
          label: this.$t('vicenter.reports.common.imgAnalyst'),
          type: 'text',
          model: 'account',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.imageCheckTaskQty'),
          type: 'text',
          model: 'taskNum',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.openToSubmit'),
          type: 'text',
          model: 'openToSubmitTimeAvgLen',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.assignToSubmit'),
          type: 'text',
          model: 'assignToSubmitTimeAvgLen',
          width: ''
        }
      ],
      tableData: {
        refName: 'personnelEfficiencyTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort
      },
      uploading: false,
      uploadingTxt: this.$t('vicenter.common.loading'),
      isChart: true,
      exportFileName: '',
      tableHeader: [],
      tableFields: [],
      searchObj: {
        'INSPECTOR': {
          show: 'analystIds',
          hiden: ['recheckorIds', 'auditorIds'],
          textInfo: this.$t('vicenter.reports.common.imageCheckTaskQty'),
          personInfo: this.$t('vicenter.reports.common.imgAnalyst')
        },
        'RECHECK-INSPECTOR': {
          show: 'recheckorIds',
          hiden: ['analystIds', 'auditorIds'],
          textInfo: this.$t('vicenter.reports.common.recheckTaskQty'),
          personInfo: this.$t('vicenter.reports.common.recheckor')
        },
        'AUDITOR': {
          show: 'auditorIds',
          hiden: ['analystIds', 'recheckorIds'],
          textInfo: this.$t('vicenter.reports.common.auditTaskQty'),
          personInfo: this.$t('vicenter.reports.common.auditor')
        }
      },
      exportExcelParams: {}
    }
  },
  created () {
    this.routeChange()
    this.changeDimension()
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.getPersonInfo()
    this.updateLabel()
  },
  mounted () {
  },
  methods: {
    routeChange () {
      switch (this.$route.path) {
        case '/Reports/personnel-analysis-efficiency': {
          this.printTable.allColsNum = 5
          this.printTable.infoData[0].colspan = 5
          this.printTable.infoData[1].data[3].colspan = 2
          this.printTable.infoData[2].colspan = 5
          this.searchIpt[0].models = 'INSPECTOR'
          this.searchIpt[0].defaultValue = 'INSPECTOR'
          this.formRule.model.type = 'INSPECTOR'
          break
        }
        case '/Reports/personnel-recheck-efficiency': {
          this.printTable.allColsNum = 5
          this.printTable.infoData[0].colspan = 5
          this.printTable.infoData[1].data[3].colspan = 2
          this.printTable.infoData[2].colspan = 5
          this.searchIpt[0].models = 'RECHECK-INSPECTOR'
          this.searchIpt[0].defaultValue = 'RECHECK-INSPECTOR'
          this.formRule.model.type = 'RECHECK-INSPECTOR'
          break
        }
        case '/Reports/personnel-audit-efficiency': {
          this.printTable.allColsNum = 4
          this.printTable.infoData[0].colspan = 4
          this.printTable.infoData[1].data[3].colspan = 1
          this.printTable.infoData[2].colspan = 4
          this.searchIpt[0].models = 'AUDITOR'
          this.searchIpt[0].defaultValue = 'AUDITOR'
          this.formRule.model.type = 'AUDITOR'
        }
      }
    },
    handlePrint () {
      this.$getPrintReportInfo(this, 3)
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$getPrintReportInfo(this, 3)
      this.$refs.printTableRef.handleExport()
    },
    // 获取人员信息
    getPersonInfo () {
      for (let i in this.searchObj) {
        if (this.formRule.model.type !== i) {
          continue
        }
        commonAjax.listPortAndPersionByRoleCode({roleCode: i}).then(res => {
          if (res.data.flag) {
            if (res.data.result && res.data.result.length > 0) {
              this.searchIpt.forEach(item => {
                if (i === item.roleCode) {
                  item.option = res.data.result.map(role => {
                    return {
                      label: role.account,
                      value: role.account
                    }
                  })
                  this.allPeople[i] = res.data.result.map(role => {
                    return role.account
                  })
                  // 获取历史人员
                  ajax.getHistoryUser({type: i}).then((res) => {
                    if (res.data.flag) {
                      if (res.data.result && res.data.result.items && res.data.result.items.length > 0) {
                        let hisUser = res.data.result.items.map(userItem => { return userItem.account })
                        this.allPeople[i] = [...new Set([...this.allPeople[i], ...hisUser])]
                        item.option = this.allPeople[i].map(item => {
                          return {
                            label: item,
                            value: item
                          }
                        })
                      }
                    }
                    this.query()
                  }).catch(() => {})
                }
              })
            }
          }
        }).catch(() => {})
      }
    },
    query () {
      // 处理请求参数
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let statisticTime = this.formRule.model.statisticTime
      if (statisticTime != null && statisticTime.length === 2) {
        params.startTime = statisticTime[0]
        params.endTime = statisticTime[1] + 24 * 60 * 60 * 1000 - 1
      }
      params.accountStr = params.analystIds.join(',') || params.recheckorIds.join(',') || params.auditorIds.join(',') || ''
      this.queryPeople = params.accountStr.split(',')
      delete params.analystIds
      delete params.recheckorIds
      delete params.auditorIds
      delete params.statisticTime
      console.log(params)
      this.updateLabel()
      let taskNum = {
        'type': 'taskNum',
        'items': []
      }
      let openToSubmitTimeAvgLen = {
        'type': 'openToSubmitTimeAvgLen',
        'items': []
      }
      let assignToSubmitTimeAvgLen = {
        'type': 'assignToSubmitTimeAvgLen',
        'items': []
      }
      if (this.queryPeople.join(',') !== '') {
        // 如果查询条件选择或输入了人员
        this.chartStatisticData.forEach(item => {
          item.yAxisData = this.queryPeople
          item.data.forEach(chr => {
            chr.seriesData.length = this.queryPeople.length
            chr.seriesData.fill(0)
          })
        })
      } else {
        // 默认加载当前统计维度的全部人员
        this.chartStatisticData.forEach(item => {
          item.yAxisData = this.allPeople[this.searchIpt[0].models]
          item.data.forEach(chr => {
            chr.seriesData.length = this.allPeople[this.searchIpt[0].models].length
            chr.seriesData.fill(0)
          })
        })
      }
      // 打印信息处理
      this.printTable.infoData[1].data[1].value = this.$options.filters['formatDate'](params.startTime, this.$t('vicenter.common.dayFormat')) + ' ~ ' + this.$options.filters['formatDate'](params.endTime, this.$t('vicenter.common.dayFormat'))
      this.printTable.infoData[1].data[2].value = this.searchObj[params.type].personInfo
      this.printTable.infoData[1].data[3].value = this.chartStatisticData[0].yAxisData.join(', ')
      this.exportExcelParams = params
      // 获取已完成审图、复审、稽核任务量
      ajax.getCompetedTaskQtyData(params).then((res) => {
        if (res.data.flag) {
          taskNum = {
            'type': 'taskNum',
            'items': res.data.result.items
          }
          this.textStatisticData[0].value = 0
          if (taskNum.items && taskNum.items.length > 0) {
            taskNum.items.forEach(item => {
              this.textStatisticData[0].value += item.taskNum || 0
            })
          }
          // 列表数据
          this.getTableData(taskNum, openToSubmitTimeAvgLen, assignToSubmitTimeAvgLen)
        } else {
        }
      }).catch(() => {})
      // 获取任务打开到提交时间（均值）数据
      ajax.getOpenToSubmitTimeData(params).then((res) => {
        if (res.data.flag) {
          openToSubmitTimeAvgLen = {
            'type': 'openToSubmitTimeAvgLen',
            'items': res.data.result.items
          }
          this.textStatisticData[1].value = this.getTextStatisticData(openToSubmitTimeAvgLen)
          // 获取排序后的人员信息
          this.chartStatisticData[0].yAxisData = this.getSortPeople(openToSubmitTimeAvgLen)
          // 整理柱状图显示所需数据
          this.getChartStatisticData(openToSubmitTimeAvgLen, this.chartStatisticData[0])
          this.chartStatisticData.forEach(item => {
            item.noData = false
          })
          // 列表数据
          this.getTableData(taskNum, openToSubmitTimeAvgLen, assignToSubmitTimeAvgLen)
          if (this.isChart) {
            this.$nextTick(() => {
              this.$refs.chartRef.getData()
            })
          }
        } else {
        }
      }).catch(() => {})
      if (params.type !== 'AUDITOR') {
        // 获取任务分配到提交时间（均值）数据
        ajax.getAssignToSubmitTimeData(params).then((res) => {
          if (res.data.flag) {
            assignToSubmitTimeAvgLen = {
              'type': 'assignToSubmitTimeAvgLen',
              'items': res.data.result.items
            }
            this.textStatisticData[2].value = this.getTextStatisticData(assignToSubmitTimeAvgLen)
            // 获取排序后的人员信息
            this.chartStatisticData[1].yAxisData = this.getSortPeople(assignToSubmitTimeAvgLen)
            // 整理柱状图显示所需数据
            this.getChartStatisticData(assignToSubmitTimeAvgLen, this.chartStatisticData[1])
            this.chartStatisticData.forEach(item => {
              item.noData = false
            })
            // 列表数据
            this.getTableData(taskNum, openToSubmitTimeAvgLen, assignToSubmitTimeAvgLen)
            if (this.isChart) {
              this.$nextTick(() => {
                this.$refs.chartRef.getData()
              })
            }
          } else {
          }
        }).catch(() => {})
      }
    },
    getTextStatisticData (data, val) {
      let total = 0
      let average = 0
      let len = 0
      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          total += item.timeAvgLen
        })
      }
      if (this.queryPeople.join(',') !== '') {
        // 如果查询条件选择或输入了人员
        len = this.queryPeople.length
      } else {
        // 默认加载当前统计维度的全部人员
        len = this.allPeople[this.searchIpt[0].models].length
      }
      if (total) {
        average = parseInt(total / len)
      }
      average = average ? `${parseInt(average / 60)}'${parseInt(average % 60)}"` : `0'0"`
      return average
    },
    getSortPeople (data) {
      let sortPeople = []
      if (data.items && data.items.length > 0) {
        data.items.sort(this.handleSort('timeAvgLen'))
        data.items.map(item => {
          sortPeople.push(item.account)
        })
      }
      if (this.queryPeople.join(',') !== '') {
        if (sortPeople.length < this.queryPeople.length) {
          this.queryPeople.forEach(item => {
            if (sortPeople.indexOf(item) === -1) {
              sortPeople.unshift(item)
            }
          })
        }
      } else {
        if (sortPeople.length < this.allPeople[this.searchIpt[0].models].length) {
          this.allPeople[this.searchIpt[0].models].forEach(item => {
            if (sortPeople.indexOf(item) === -1) {
              sortPeople.unshift(item)
            }
          })
        }
      }
      return sortPeople
    },
    getChartStatisticData (data, val) {
      if (data.items && data.items.length > 0) {
        data.items.sort(this.handleSort('timeAvgLen'))
        val.data.forEach(v => {
          if (data.type === v.model) {
            data.items.map(item => {
              let index = val.yAxisData.findIndex(s => { return s === item.account })
              v.seriesData[index] = (item.timeAvgLen / 60).toFixed(2)
            })
          }
        })
      }
    },
    getTableData (taskNum, openToSubmitTimeAvgLen, assignToSubmitTimeAvgLen) {
      this.tableData.data = []
      this.chartStatisticData[0].yAxisData.forEach(item => {
        this.tableData.data.unshift({
          account: item,
          taskNum: 0,
          openToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`,
          assignToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
        })
      })
      this.tableData.data.push({
        account: this.$t('vicenter.common.averageQty'),
        taskNum: 0,
        openToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`,
        assignToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
      })
      if (taskNum.items.length > 0) {
        let persons = []
        this.tableData.data = []
        // 按任务量排序
        taskNum.items.sort(this.handleSort('taskNum'))
        taskNum.items.map(item => {
          this.tableData.data.unshift({
            account: item.account,
            taskNum: item.taskNum,
            openToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`,
            assignToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
          })
          persons.push(item.account)
        })
        if (this.queryPeople.join(',') !== '') {
          this.queryPeople.forEach(p => {
            if (persons.indexOf(p) === -1) {
              this.tableData.data.push({
                account: p,
                taskNum: 0,
                openToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`,
                assignToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
              })
            }
          })
        } else {
          this.allPeople[this.searchIpt[0].models].forEach(p => {
            if (persons.indexOf(p) === -1) {
              this.tableData.data.push({
                account: p,
                taskNum: 0,
                openToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`,
                assignToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
              })
            }
          })
        }
        // 平均值
        let aveObj = {
          account: this.$t('vicenter.common.averageQty'),
          taskNum: 0,
          openToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`,
          assignToSubmitTimeAvgLen: `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
        }
        let len = this.tableData.data.length
        let total = 0
        this.tableData.data.forEach(item => {
          total += item.taskNum
        })
        aveObj.taskNum = (total / len).toFixed(2)
        this.tableData.data.push(aveObj)
      }
      if (openToSubmitTimeAvgLen.items.length > 0) {
        let len = this.tableData.data.length - 1
        let total = 0
        let ave = 0
        openToSubmitTimeAvgLen.items.map(item => {
          this.tableData.data.forEach(t => {
            if (t.account === item.account) {
              t.openToSubmitTimeAvgLen = item.timeAvgLen ? `${parseInt(item.timeAvgLen / 60)}${this.$t('vicenter.common.dashboard.minute')}${parseInt(item.timeAvgLen % 60)}${this.$t('vicenter.common.dashboard.second')}` : `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
              total += item.timeAvgLen
            }
          })
        })
        ave = parseInt(total / len)
        this.tableData.data[len].openToSubmitTimeAvgLen = ave ? `${parseInt(ave / 60)}${this.$t('vicenter.common.dashboard.minute')}${parseInt(ave % 60)}${this.$t('vicenter.common.dashboard.second')}` : `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
      }
      if (assignToSubmitTimeAvgLen.items.length > 0) {
        let len = this.tableData.data.length - 1
        let total = 0
        let ave = 0
        assignToSubmitTimeAvgLen.items.map(item => {
          this.tableData.data.forEach(t => {
            if (t.account === item.account) {
              t.assignToSubmitTimeAvgLen = item.timeAvgLen ? `${parseInt(item.timeAvgLen / 60)}${this.$t('vicenter.common.dashboard.minute')}${parseInt(item.timeAvgLen % 60)}${this.$t('vicenter.common.dashboard.second')}` : `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
              total += item.timeAvgLen
            }
          })
        })
        ave = parseInt(total / len)
        this.tableData.data[len].assignToSubmitTimeAvgLen = ave ? `${parseInt(ave / 60)}${this.$t('vicenter.common.dashboard.minute')}${parseInt(ave % 60)}${this.$t('vicenter.common.dashboard.second')}` : `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
      }
    },
    handleSort (property) {
      return function (a, b) {
        let value1 = a[property]
        let value2 = b[property]
        return value1 - value2 // 从小到大的顺序，适应图表的展示
      }
    },
    updateLabel () {
      for (let i in this.searchObj) {
        if (this.searchIpt[0].models === i) {
          if (i === 'AUDITOR') {
            this.textStatisticData = this.textStatisticDataDefault.slice(0, this.textStatisticDataDefault.length - 1)
            this.chartStatisticData = this.chartStatisticDataDefault.slice(0, this.chartStatisticDataDefault.length - 1)
            this.tableGroup = this.tableGroupDefault.slice(0, this.tableGroupDefault.length - 1)
            // 动态加载校验
            this.formRule.rule.analystIds = []
            this.formRule.rule.recheckorIds = []
            this.formRule.rule.auditorIds = [
              // { pattern: /^[a-zA-Z0-9]{0,50}$/, message: this.$t('vicenter.reports.common.enterUserRule'), trigger: 'change' }
            ]
          } else {
            this.textStatisticData = this.textStatisticDataDefault
            this.chartStatisticData = this.chartStatisticDataDefault
            this.tableGroup = this.tableGroupDefault
            if (i === 'ANALYST') {
              // 动态加载校验
              this.formRule.rule.analystIds = [
                // { pattern: /^[a-zA-Z0-9]{0,50}$/, message: this.$t('vicenter.reports.common.enterUserRule'), trigger: 'change' }
              ]
              this.formRule.rule.recheckorIds = []
              this.formRule.rule.auditorIds = []
            } else if (i === 'REVIEW') {
              // 动态加载校验
              this.formRule.rule.analystIds = []
              this.formRule.rule.recheckorIds = [
                // { pattern: /^[a-zA-Z0-9]{0,50}$/, message: this.$t('vicenter.reports.common.enterUserRule'), trigger: 'change' }
              ]
              this.formRule.rule.auditorIds = []
            }
          }
          this.textStatisticData[0].label = this.searchObj[i].textInfo
          this.tableGroup[1].label = this.searchObj[i].personInfo
          this.tableGroup[2].label = this.searchObj[i].textInfo
        }
      }
    },
    // 统计维度切换
    changeDimension () {
      // 控制查询条件是否显示
      this.searchIpt.forEach(item => {
        for (let i in this.searchObj) {
          if (this.searchIpt[0].models === i) {
            if (item.ruleProp === this.searchObj[i].show) {
              item.hiden = false
            }
            if (this.searchObj[i].hiden.indexOf(item.ruleProp) > -1) {
              item.hiden = true
              item.models = []
              this.formRule.model[item.ruleProp] = []
            }
          }
        }
      })
    },
    // 图表列表切换
    tabChartTable () {
      this.isChart = !this.isChart
      if (this.isChart) {
        this.$nextTick(() => {
          this.$refs.chartRef.getData()
        })
      }
    },
    // 导出
    exportData (command) {
      // 导出文件名称
      this.exportFileName = this.$t(this.$route.name)
      // 导出excel相关数据
      this.tableHeader = []
      this.tableFields = []
      this.tableGroup.forEach((item) => {
        if (item.type !== 'index') {
          this.tableHeader.push(item.label)
          this.tableFields.push(item.model)
        }
      })
      if (command === 'excel') {
        this.handleExportExcel()
        // exportExcel({exportArray: this.tableData.data, tHeader: this.tableHeader, filterFields: this.tableFields, fileName: this.exportFileName})
      } else if (command === 'pdfChart') {
        this.getPdf(document.getElementById('export-container'), this.exportFileName, false)
      } else if (command === 'pdfTable') {
        this.handleExport()
        // this.getPdf(document.getElementById('export-container'), this.exportFileName, false)
      } else if (command === 'image') {
        this.getPdf(document.getElementById('export-container'), this.exportFileName, true)
      }
      let logParams = {
        appCode: '  REP',
        appName: 'rep',
        operateObject: this.$route.name
      }
      this.$exportLog(logParams)
    },
    handleExportExcel () {
      const {lang} = this.$store.state
      let params = {
        lang: lang,
        model: this.exportExcelParams,
        sysMenu: '',
        allDataNum: this.tableData.data.length,
        url: '/supervise/usrEfficiencyRep/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    // 日期查询条件获得焦点
    focus () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      if (picker) {
        picker.addEventListener('click', function () {
          for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
            picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
          }
        })
      }
    },
    // 日期查询条件失去焦点
    blur () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      picker.addEventListener('click', function () {
        for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
          picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
        }
      })
    },
    changeTime () {
      // 触发校验
      this.$changeSelectValidateField('searchFormRef', this, 'statisticTime')
    },
    changePerson () {
      if (this.searchIpt[0].models === 'INSPECTOR') {
        this.$changeSelectValidateField('searchFormRef', this, 'analystIds')
      }
      if (this.searchIpt[0].models === 'RECHECK-INSPECTOR') {
        this.$changeSelectValidateField('searchFormRef', this, 'recheckorIds')
      }
      if (this.searchIpt[0].models === 'AUDITOR') {
        this.$changeSelectValidateField('searchFormRef', this, 'auditorIds')
      }
    },
    resetForm () {
      setTimeout(() => {
        this.changeDimension()
      }, 100)
    },
    treeClick () {},
    getSort () {}
  },
  components: { bread, panelTitle, ComForm, ComTable, textStatistic, chartStatistic }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#reports-bar {
  @extend .extend-bar;
  #reports-M {
    padding:$margin;
    @include box-sizing;
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
      }
      .search-form {
        .el-form-item {
          margin-bottom: 16px;
          .el-form-item__label {
            line-height: 32px;
          }
          .el-input__inner {
            height: 32px!important;
          }
          .el-button {
            padding: 8px 20px;
          }
          .el-input__icon {
            line-height: 26px;
          }
          .el-date-editor {
            .el-range__icon,.el-range-separator,.el-range__close-icon {
              line-height: 26px;
            }
          }
        }
      }
    }
    .infolist {
      .panel {
        @extend .extend-panel;
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
        .chartBox {
          width: $all;
          height: calc(100% - 35px);
          overflow: hidden;
          .chartBox-content {
            height: $all;
            overflow: hidden;
          }
        }
        .notActive {
          color: #ccc!important;
          cursor: not-allowed;
        }
        .operate-menu {
          button {
            margin: 0!important;
          }
        }
      }
    }
  }
}
</style>
