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
import textStatistic from './common/textStatistic'
import chartStatistic from './common/chartStatistic'
export default {
  name: 'taskConclusionReport',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 7,
        title: this.$t('vicenter.reports.title.personnelTaskDetail'),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 7,
            infoType: 'statisticConditionInfo',
            label: this.$t('vicenter.reports.common.statisticCondition')
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.statisticDimension'),
                ruleProp: 'type'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'type'
              },
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
                colspan: 2,
                value: '',
                ruleProp: 'person'
              }
            ]
          },
          {
            type: 'title',
            colspan: 7,
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
              value: 'PHYSICAL-INSPECTOR', // 手检员
              label: this.$t('vicenter.reports.common.physicalInspector')
            },
            {
              value: 'AUDITOR', // 监管稽核员
              label: this.$t('vicenter.reports.common.auditor')
            }
          ],
          change: this.changeDimension,
          KeepDefault: true, // 保留默认值
          defaultValue: 'INSPECTOR' // 默认值
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
        },
        {
          getLabel: this.$t('vicenter.reports.common.imgAnalyst'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.imgAnalyst')}),
          type: 'select2',
          // filterable: true,
          // allowCreate: true,
          models: [],
          ruleProp: 'analystIds',
          roleCode: 'INSPECTOR',
          option: [],
          hiden: false
        },
        {
          getLabel: this.$t('vicenter.reports.common.recheckor'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.recheckor')}),
          type: 'select2',
          // filterable: true,
          // allowCreate: true,
          models: [],
          ruleProp: 'recheckorIds',
          roleCode: 'RECHECK-INSPECTOR',
          option: [],
          hiden: true
        },
        {
          getLabel: this.$t('vicenter.reports.common.physicalInspector'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.physicalInspector')}),
          type: 'select2',
          // filterable: true,
          // allowCreate: true,
          models: [],
          ruleProp: 'manualIds',
          roleCode: 'PHYSICAL-INSPECTOR',
          option: [],
          hiden: true
        },
        {
          getLabel: this.$t('vicenter.reports.common.auditor'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.auditor')}),
          type: 'select2',
          // filterable: true,
          // allowCreate: true,
          models: [],
          ruleProp: 'auditorIds',
          roleCode: 'AUDITOR',
          option: [],
          hiden: true
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
          manualIds: [],
          auditorIds: []
        },
        refName: 'personnelTaskQueryForm',
        rule: {
          statisticTime: [ // 统计时间校验
            { required: true, message: this.$t('vicenter.reports.common.enterStatisticTime'), trigger: 'change' }
          ]
        }
      },
      textStatisticData: [
        {
          label: this.$t('vicenter.reports.common.imageCheckTaskQty'),
          value: 0,
          model: 'taskNum',
          width: '20%',
          bgColor: '#48a9ee',
          icon: '&#xe701;'
        },
        {
          label: this.$t('vicenter.reports.common.noSuspectQty'),
          value: 0,
          model: 'nNum',
          width: '20%',
          bgColor: '#97d87c',
          icon: '&#xe7f9;'
        },
        {
          label: this.$t('vicenter.reports.common.suspectQty'),
          value: 0,
          model: 'yNum',
          width: '20%',
          bgColor: '#ffd96e',
          icon: '&#xe6aa;'
        }
      ],
      chartStatisticData: [
        {
          title: this.$t('vicenter.reports.common.imgAnalyst') + ' - ' + this.$t('vicenter.reports.common.taskQtyStatistics'),
          baseTitle: this.$t('vicenter.reports.common.taskQtyStatistics'),
          id: 'taskQtyStatistics',
          chartType: 'bar',
          width: '100%',
          height: '500px',
          colors: ['#97d87c', '#ffd96e'],
          yAxisData: [],
          dataZoom: true,
          data: [
            {
              name: this.$t('vicenter.reports.common.noSuspectQty'),
              model: 'nNum',
              stack: 'Qty',
              seriesData: []
            },
            {
              name: this.$t('vicenter.reports.common.suspectQty'),
              model: 'yNum',
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
        'PHYSICAL-INSPECTOR': [],
        'AUDITOR': []
      },
      queryPeople: [], // 查询的全部人员
      tableGroup: [
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
          label: this.$t('vicenter.reports.common.suspectQty'),
          type: 'text',
          model: 'yNum',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.noSuspectQty'),
          type: 'text',
          model: 'nNum',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.suspectRate'),
          type: 'text',
          model: 'yNumRate',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.noSuspectRate'),
          type: 'text',
          model: 'nNumRate',
          width: ''
        }
      ],
      tableData: {
        refName: 'personnelTaskTable',
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
          hiden: ['recheckorIds', 'manualIds', 'auditorIds'],
          chartTitle: this.$t('vicenter.reports.common.imgAnalyst'),
          textInfo: [
            {
              label: this.$t('vicenter.reports.common.imageCheckTaskQty'),
              model: 'taskNum',
              icon: '&#xe701;'
            },
            {
              label: this.$t('vicenter.reports.common.noSuspectQty'),
              model: 'nNum',
              icon: '&#xe7f9;'
            },
            {
              label: this.$t('vicenter.reports.common.suspectQty'),
              model: 'yNum',
              icon: '&#xe6aa;'
            }
          ],
          chartInfo: [
            {
              name: this.$t('vicenter.reports.common.noSuspectQty'),
              model: 'nNum'
            },
            {
              name: this.$t('vicenter.reports.common.suspectQty'),
              model: 'yNum'
            }
          ],
          tableInfo: [
            {
              label: this.$t('vicenter.common.No')
            },
            {
              label: this.$t('vicenter.reports.common.imgAnalyst'),
              model: 'account'
            },
            {
              label: this.$t('vicenter.reports.common.imageCheckTaskQty'),
              model: 'taskNum'
            },
            {
              label: this.$t('vicenter.reports.common.suspectQty'),
              model: 'yNum'
            },
            {
              label: this.$t('vicenter.reports.common.noSuspectQty'),
              model: 'nNum'
            },
            {
              label: this.$t('vicenter.reports.common.suspectRate'),
              model: 'yNumRate'
            },
            {
              label: this.$t('vicenter.reports.common.noSuspectRate'),
              model: 'nNumRate'
            }
          ]
        },
        'RECHECK-INSPECTOR': {
          show: 'recheckorIds',
          hiden: ['analystIds', 'manualIds', 'auditorIds'],
          chartTitle: this.$t('vicenter.reports.common.recheckor'),
          textInfo: [
            {
              label: this.$t('vicenter.reports.common.recheckTaskQty'),
              model: 'taskNum',
              icon: '&#xe701;'
            },
            {
              label: this.$t('vicenter.reports.common.noSuspectQty'),
              model: 'nNum',
              icon: '&#xe7f9;'
            },
            {
              label: this.$t('vicenter.reports.common.suspectQty'),
              model: 'yNum',
              icon: '&#xe6aa;'
            }
          ],
          chartInfo: [
            {
              name: this.$t('vicenter.reports.common.noSuspectQty'),
              model: 'nNum'
            },
            {
              name: this.$t('vicenter.reports.common.suspectQty'),
              model: 'yNum'
            }
          ],
          tableInfo: [
            {
              label: this.$t('vicenter.common.No')
            },
            {
              label: this.$t('vicenter.reports.common.recheckor'),
              model: 'account'
            },
            {
              label: this.$t('vicenter.reports.common.recheckTaskQty'),
              model: 'taskNum'
            },
            {
              label: this.$t('vicenter.reports.common.suspectQty'),
              model: 'yNum'
            },
            {
              label: this.$t('vicenter.reports.common.noSuspectQty'),
              model: 'nNum'
            },
            {
              label: this.$t('vicenter.reports.common.suspectRate'),
              model: 'yNumRate'
            },
            {
              label: this.$t('vicenter.reports.common.noSuspectRate'),
              model: 'nNumRate'
            }
          ]
        },
        'PHYSICAL-INSPECTOR': {
          show: 'manualIds',
          hiden: ['analystIds', 'recheckorIds', 'auditorIds'],
          chartTitle: this.$t('vicenter.reports.common.physicalInspector'),
          textInfo: [
            {
              label: this.$t('vicenter.reports.common.manualTaskQty'),
              model: 'taskNum',
              icon: '&#xe701;'
            },
            {
              label: this.$t('vicenter.reports.common.noSeizedQty'),
              model: 'nNum',
              icon: '&#xe7f9;'
            },
            {
              label: this.$t('vicenter.reports.common.seizedQty'),
              model: 'yNum',
              icon: '&#xe6aa;'
            }
          ],
          chartInfo: [
            {
              name: this.$t('vicenter.reports.common.noSeizedQty'),
              model: 'nNum'
            },
            {
              name: this.$t('vicenter.reports.common.seizedQty'),
              model: 'yNum'
            }
          ],
          tableInfo: [
            {
              label: this.$t('vicenter.common.No')
            },
            {
              label: this.$t('vicenter.reports.common.physicalInspector'),
              model: 'account'
            },
            {
              label: this.$t('vicenter.reports.common.manualTaskQty'),
              model: 'taskNum'
            },
            {
              label: this.$t('vicenter.reports.common.seizedQty'),
              model: 'yNum'
            },
            {
              label: this.$t('vicenter.reports.common.noSeizedQty'),
              model: 'nNum'
            },
            {
              label: this.$t('vicenter.reports.common.seizedRate'),
              model: 'yNumRate'
            },
            {
              label: this.$t('vicenter.reports.common.noSeizedRate'),
              model: 'nNumRate'
            }
          ]
        },
        'AUDITOR': {
          show: 'auditorIds',
          hiden: ['analystIds', 'recheckorIds', 'manualIds'],
          chartTitle: this.$t('vicenter.reports.common.auditor'),
          textInfo: [
            {
              label: this.$t('vicenter.reports.common.auditTaskQty'),
              model: 'taskNum',
              icon: '&#xe701;'
            },
            {
              label: this.$t('vicenter.reports.common.auditPassQty'),
              model: 'nNum',
              icon: '&#xe6ac;'
            },
            {
              label: this.$t('vicenter.reports.common.auditNotPassQty'),
              model: 'yNum',
              icon: '&#xe6af;'
            }
          ],
          chartInfo: [
            {
              name: this.$t('vicenter.reports.common.auditPassQty'),
              model: 'nNum'
            },
            {
              name: this.$t('vicenter.reports.common.auditNotPassQty'),
              model: 'yNum'
            }
          ],
          tableInfo: [
            {
              label: this.$t('vicenter.common.No')
            },
            {
              label: this.$t('vicenter.reports.common.auditor'),
              model: 'account'
            },
            {
              label: this.$t('vicenter.reports.common.auditTaskQty'),
              model: 'taskNum'
            },
            {
              label: this.$t('vicenter.reports.common.auditPassQty'),
              model: 'yNum'
            },
            {
              label: this.$t('vicenter.reports.common.auditNotPassQty'),
              model: 'nNum'
            },
            {
              label: this.$t('vicenter.reports.common.auditPassRate'),
              model: 'yNumRate'
            },
            {
              label: this.$t('vicenter.reports.common.auditNotPassRate'),
              model: 'nNumRate'
            }
          ]
        }
      },
      exportExcelParams: {}
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.getPersonInfo()
  },
  mounted () {
  },
  methods: {
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
                    if (i === 'INSPECTOR') {
                      this.query()
                    }
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
      params.accountStr = params.analystIds.join(',') || params.recheckorIds.join(',') || params.manualIds.join(',') || params.auditorIds.join(',') || ''
      this.queryPeople = params.accountStr.split(',')
      delete params.analystIds
      delete params.recheckorIds
      delete params.manualIds
      delete params.auditorIds
      delete params.statisticTime
      console.log(params)
      this.updateLabel()
      let nNum = {
        'type': 'nNum',
        'items': []
      }
      let yNum = {
        'type': 'yNum',
        'items': []
      }
      if (this.queryPeople.join(',') !== '') {
        // 如果查询条件选择或输入了人员
        this.chartStatisticData[0].yAxisData = this.queryPeople
        this.chartStatisticData[0].data.forEach(chr => {
          chr.seriesData.length = this.queryPeople.length
          chr.seriesData.fill(0)
        })
      } else {
        // 默认加载当前统计维度的全部人员
        this.chartStatisticData[0].yAxisData = this.allPeople[this.searchIpt[0].models]
        this.chartStatisticData[0].data.forEach(chr => {
          chr.seriesData.length = this.allPeople[this.searchIpt[0].models].length
          chr.seriesData.fill(0)
        })
      }
      // 打印信息处理
      this.printTable.infoData[1].data[1].value = this.searchObj[params.type].chartTitle
      this.printTable.infoData[1].data[3].value = this.$options.filters['formatDate'](params.startTime, this.$t('vicenter.common.dayFormat')) + ' ~ ' + this.$options.filters['formatDate'](params.endTime, this.$t('vicenter.common.dayFormat'))
      this.printTable.infoData[1].data[4].value = this.searchObj[params.type].chartTitle
      this.printTable.infoData[1].data[5].value = this.chartStatisticData[0].yAxisData.join(', ')
      this.exportExcelParams = params
      // 获取审图无嫌疑、复审无嫌疑、手检无查获、稽核通过量
      ajax.getPassQtyData(params).then((res) => {
        if (res.data.flag) {
          nNum = {
            'type': 'nNum',
            'items': res.data.result.items
          }
          this.commonCode(nNum, yNum)
        } else {
        }
      }).catch(() => {})
      // 获取审图有嫌疑、复审有嫌疑、手检有查获、稽核不通过量
      ajax.getNotPassQtyData(params).then((res) => {
        if (res.data.flag) {
          yNum = {
            'type': 'yNum',
            'items': res.data.result.items
          }
          this.commonCode(nNum, yNum)
        } else {
        }
      }).catch(() => {})
    },
    commonCode (nNum, yNum) {
      // 统计数据
      this.getTextStatisticData(nNum, this.textStatisticData)
      this.getTextStatisticData(yNum, this.textStatisticData)
      this.textStatisticData[0].value = this.textStatisticData[1].value + this.textStatisticData[2].value
      // 获取排序后的人员信息
      let sortArr = this.getSortArr([nNum.items, yNum.items])
      if (sortArr.length > 0) {
        this.chartStatisticData[0].yAxisData = sortArr.map(s => { return s.account })
      }
      // 整理柱状图显示所需数据
      this.getChartStatisticData(nNum, this.chartStatisticData[0])
      this.getChartStatisticData(yNum, this.chartStatisticData[0])
      this.chartStatisticData.forEach(item => {
        item.noData = false
      })
      // 列表数据
      this.tableData.data = this.getTableData(this.chartStatisticData[0].data, this.chartStatisticData[0].yAxisData)
      if (this.isChart) {
        this.$nextTick(() => {
          this.$refs.chartRef.getData()
        })
      }
    },
    flattenArr (arr) {
      return [].concat(...arr.map(x => Array.isArray(x) ? this.flattenArr(x) : x))
    },
    getSortArr (arr) {
      let dataArr = JSON.parse(JSON.stringify(arr))
      let oldArr = this.flattenArr(dataArr)
      let newArr = []
      let tmpAccountArr = []
      // 去重
      oldArr.forEach(item => {
        if (tmpAccountArr.indexOf(item.account) === -1) {
          tmpAccountArr.push(item.account)
          newArr.push(item)
        } else {
          newArr.forEach(t => {
            if (t.account === item.account) {
              t.taskNum += item.taskNum
            }
          })
        }
      })
      // 排序
      newArr.sort(this.handleSort('taskNum'))
      if (this.queryPeople.join(',') !== '') {
        if (newArr.length < this.queryPeople.length) {
          this.queryPeople.forEach(item => {
            if (tmpAccountArr.indexOf(item) === -1) {
              newArr.unshift({
                account: item,
                taskNum: 0
              })
            }
          })
        }
      } else {
        if (newArr.length < this.allPeople[this.searchIpt[0].models].length) {
          this.allPeople[this.searchIpt[0].models].forEach(item => {
            if (tmpAccountArr.indexOf(item) === -1) {
              newArr.unshift({
                account: item,
                taskNum: 0
              })
            }
          })
        }
      }
      return newArr
    },
    getTextStatisticData (data, val) {
      let total = 0
      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          total += item.taskNum
        })
      }
      val.forEach(v => {
        if (data.type === v.model) {
          v.value = total
        }
      })
    },
    getChartStatisticData (data, val) {
      if (data.items && data.items.length > 0) {
        val.data.forEach(v => {
          if (data.type === v.model) {
            v.seriesData.fill(0)
            data.items.map(item => {
              let index = val.yAxisData.findIndex(s => { return s === item.account })
              v.seriesData[index] = item.taskNum
            })
          }
        })
      }
    },
    getTableData (data, people) {
      if (people && people.length > 0) {
        let tableData = []
        let tmpArr = []
        people.forEach((item, index) => {
          let tableObj = {
            account: item,
            taskNum: 0,
            yNum: 0,
            nNum: 0,
            yNumRate: 0,
            nNumRate: 0
          }
          tableData.unshift(tableObj)
        })
        data.forEach(da => {
          tmpArr.push(da.seriesData)
        })
        tableData.forEach((item, tIndex) => {
          item.nNum = tmpArr[0][tmpArr[0].length - tIndex - 1]
          item.yNum = tmpArr[1][tmpArr[1].length - tIndex - 1]
          item.taskNum = item.yNum + item.nNum
          item.yNumRate = item.taskNum ? (item.yNum / item.taskNum * 100).toFixed(2) + '%' : '0.00%'
          item.nNumRate = item.taskNum ? (item.nNum / item.taskNum * 100).toFixed(2) + '%' : '0.00%'
        })
        tableData = tableData.concat(this.getAverageAndTotal(tableData))
        return tableData
      } else {
        return []
      }
    },
    getAverageAndTotal (tableData) {
      let len = tableData.length
      let totalObj = {
        account: this.$t('vicenter.common.totalQty'),
        taskNum: 0,
        yNum: 0,
        nNum: 0,
        yNumRate: 0,
        nNumRate: 0
      }
      let aveObj = {}
      tableData.forEach(item => {
        totalObj.yNum += item.yNum
        totalObj.nNum += item.nNum
        totalObj.taskNum += item.taskNum
      })
      aveObj = {
        account: this.$t('vicenter.common.averageQty'),
        taskNum: (totalObj.taskNum / len).toFixed(2),
        yNum: (totalObj.yNum / len).toFixed(2),
        nNum: (totalObj.nNum / len).toFixed(2)
      }
      aveObj.yNumRate = Number(aveObj.taskNum) ? (aveObj.yNum / aveObj.taskNum * 100).toFixed(2) + '%' : '0.00%'
      aveObj.nNumRate = Number(aveObj.taskNum) ? (aveObj.nNum / aveObj.taskNum * 100).toFixed(2) + '%' : '0.00%'
      return [aveObj]
    },
    handleSort (property) {
      return function (a, b) {
        let value1 = a[property]
        let value2 = b[property]
        return value1 - value2 // 从小到大的顺序，适应图表的展示
      }
    },
    updateLabel () {
      // 控制图表标题切换
      this.chartStatisticData.forEach(item => {
        item.title = this.searchObj[this.searchIpt[0].models].chartTitle + ' - ' + item.baseTitle
        item.data.forEach((da, index) => {
          da.name = this.searchObj[this.searchIpt[0].models].chartInfo[index].name
        })
      })
      // 控制统计总量的文字切换
      this.textStatisticData.forEach((item, index) => {
        item.label = this.searchObj[this.searchIpt[0].models].textInfo[index].label
        item.icon = this.searchObj[this.searchIpt[0].models].textInfo[index].icon
      })
      // 控制列表表头切换
      this.tableGroup.forEach((item, index) => {
        item.label = this.searchObj[this.searchIpt[0].models].tableInfo[index].label
      })
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
        url: '/supervise/usrTaskRep/exportExcel'
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
