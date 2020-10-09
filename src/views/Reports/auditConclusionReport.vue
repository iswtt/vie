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
                colspan: 2,
                value: '',
                ruleProp: 'statisticTime'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.region'),
                ruleProp: 'area'
              },
              {
                type: 'text',
                colspan: 4,
                value: '',
                ruleProp: 'area'
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
          models: 'CUSTOM',
          ruleProp: 'type',
          placeHolder: '',
          option: [
            {
              value: 'CUSTOM', // 关区
              label: this.$t('vicenter.reports.common.region')
            },
            {
              value: 'SITE', // 口岸
              label: this.$t('vicenter.reports.common.port')
            },
            {
              value: 'DEVICE', // 设备
              label: this.$t('vicenter.reports.common.deviceNo')
            }
          ],
          change: this.changeDimension,
          KeepDefault: true, // 保留默认值
          defaultValue: 'CUSTOM' // 默认值
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
          getLabel: this.$t('vicenter.reports.common.region'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.region')}),
          type: 'treeInput',
          models: '',
          ruleProp: 'regionId',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'regionCodeTreeInput',
          treeDataId: 'regionCodeTreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.regionCodeCheckChange,
          treeRefName: 'regionCodeTreeIptRef',
          hiden: false
        },
        {
          getLabel: this.$t('vicenter.reports.common.port'),
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.port')}),
          type: 'treeInput',
          models: '',
          ruleProp: 'siteId',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'siteCodeTreeInput',
          treeDataId: 'siteCodeTreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.siteCodeCheckChange,
          treeRefName: 'siteCodeTreeIptRef',
          hiden: true
        },
        {
          getLabel: this.$t('vicenter.reports.common.deviceNo'),
          placeHolder: this.$t('vicenter.reports.validator.deviceSelect'),
          // placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.reports.common.deviceNo')}),
          type: 'treeInput',
          models: '',
          ruleProp: 'deviceId',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'deviceCodeTreeInput',
          treeDataId: 'deviceCodeTreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.deviceCodeCheckChange,
          treeRefName: 'deviceCodeTreeIptRef',
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
          type: 'CUSTOM',
          statisticTime: [
            new Date(new Date(new Date().setDate(1)).toLocaleDateString()).getTime(),
            new Date(new Date().toLocaleDateString()).getTime()
          ],
          regionId: '',
          siteId: '',
          deviceId: ''
        },
        refName: 'auditConclusionQueryForm',
        rule: {
          statisticTime: [ // 统计时间校验
            { required: true, message: this.$t('vicenter.reports.common.enterStatisticTime'), trigger: 'change' }
          ]
        }
      },
      textStatisticData: [
        {
          label: this.$t('vicenter.reports.common.taskQty'),
          value: 0,
          model: 'auditedQty',
          width: '20%',
          bgColor: '#48a9ee',
          icon: '&#xe701;'
        },
        {
          label: this.$t('vicenter.reports.common.notAuditedQty'),
          value: 0,
          model: 'notAuditedQty',
          width: '20%',
          bgColor: '#ffd96e',
          icon: '&#xe6a9;'
        },
        {
          label: this.$t('vicenter.reports.common.auditPassQty'),
          value: 0,
          model: 'auditPassQty',
          width: '20%',
          bgColor: '#97d87c',
          icon: '&#xe6ac;'
        },
        {
          label: this.$t('vicenter.reports.common.auditNotPassQty'),
          value: 0,
          model: 'auditNotPassQty',
          width: '20%',
          bgColor: '#f4857c',
          icon: '&#xe6af;'
        }
      ],
      chartStatisticData: [
        {
          title: this.$t('vicenter.reports.common.region') + ' - ' + this.$t('vicenter.reports.common.auditConcStatistics'),
          baseTitle: this.$t('vicenter.reports.common.auditConcStatistics'),
          id: 'auditConcStatistics',
          chartType: 'bar',
          width: '100%',
          height: '300px',
          colors: ['#48a9ee', '#ffd96e', '#97d87c', '#f4857c'],
          yAxisData: [],
          yAxisIds: [],
          data: [
            {
              name: this.$t('vicenter.reports.common.auditedQty'),
              model: 'auditedQty',
              stack: 'auditQty',
              seriesData: []
            },
            {
              name: this.$t('vicenter.reports.common.notAuditedQty'),
              model: 'notAuditedQty',
              stack: 'auditQty',
              seriesData: []
            },
            {
              name: this.$t('vicenter.reports.common.auditPassQty'),
              model: 'auditPassQty',
              stack: 'auditConclusion',
              seriesData: []
            },
            {
              name: this.$t('vicenter.reports.common.auditNotPassQty'),
              model: 'auditNotPassQty',
              stack: 'auditConclusion',
              seriesData: []
            }
          ],
          noData: true
        },
        {
          title: this.$t('vicenter.reports.common.auditConcRatioStatistics'),
          baseTitle: this.$t('vicenter.reports.common.auditConcRatioStatistics'),
          multiple: true,
          width: '100%',
          height: '250px',
          multipleData: [
            {
              chartType: 'ring',
              id: 'auditedRate',
              width: '33%',
              colors: '#48a9ee',
              data: {
                name: this.$t('vicenter.reports.common.auditedRate'),
                model: 'recheckRate',
                value: 25
              }
            },
            {
              chartType: 'ring',
              id: 'auditPassRate',
              width: '33%',
              colors: '#97d87c',
              data: {
                name: this.$t('vicenter.reports.common.auditPassRate'),
                model: 'recheckPassRate',
                value: 70
              }
            }
          ],
          noData: true
        }
      ],
      allArea: { // 全部地区
        CUSTOM: [],
        SITE: [],
        DEVICE: []
      },
      queryArea: [], // 查询的全部地区
      tableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index',
          width: '50px'
        },
        {
          label: this.$t('vicenter.reports.common.region'),
          type: 'text',
          model: 'name',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.notAuditedQty'),
          type: 'text',
          model: 'notAuditedQty',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.auditPassQty'),
          type: 'text',
          model: 'auditPassQty',
          width: ''
        },
        {
          label: this.$t('vicenter.reports.common.auditNotPassQty'),
          type: 'text',
          model: 'auditNotPassQty',
          width: ''
        }
      ],
      tableData: {
        refName: 'auditConclusionTable',
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
        'CUSTOM': {
          show: 'regionId',
          hiden: ['siteId', 'deviceId'],
          tableHeaderLabel: this.$t('vicenter.reports.common.region'),
          chartTitle: this.$t('vicenter.reports.common.region')
        },
        'SITE': {
          show: 'siteId',
          hiden: ['regionId', 'deviceId'],
          tableHeaderLabel: this.$t('vicenter.reports.common.port'),
          chartTitle: this.$t('vicenter.reports.common.port')
        },
        'DEVICE': {
          show: 'deviceId',
          hiden: ['siteId', 'regionId'],
          tableHeaderLabel: this.$t('vicenter.reports.common.deviceNo'),
          chartTitle: this.$t('vicenter.reports.common.device')
        }
      },
      exportExcelParams: {}
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.orgAjaxTree()
    this.deviceAjaxTree()
  },
  mounted () {
  },
  methods: {
    handlePrint () {
      this.$getPrintReportInfo(this, 4)
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$getPrintReportInfo(this, 4)
      this.$refs.printTableRef.handleExport()
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
      params.idStr = params.regionId || params.siteId || params.deviceId || ''
      delete params.regionId
      delete params.siteId
      delete params.deviceId
      delete params.statisticTime
      console.log(params)
      this.updateLabel()
      let auditedQty = {
        'type': 'auditedQty',
        'items': []
      }
      let notAuditedQty = {
        'type': 'notAuditedQty',
        'items': []
      }
      let auditPassQty = {
        'type': 'auditPassQty',
        'items': []
      }
      let auditNotPassQty = {
        'type': 'auditNotPassQty',
        'items': []
      }
      if (this.queryArea.length > 0) {
        // 如果查询条件选择了地区
        this.chartStatisticData[0].yAxisData = this.queryArea.map(item => { return item.name })
        this.chartStatisticData[0].yAxisIds = this.queryArea.map(item => { return item.id })
        this.chartStatisticData[0].data.forEach(chr => {
          chr.seriesData.length = this.queryArea.length
          chr.seriesData.fill(0)
        })
      } else {
        // 默认加载当前统计维度的全部地区
        this.chartStatisticData[0].yAxisData = this.allArea[this.searchIpt[0].models].map(item => { return item.name })
        this.chartStatisticData[0].yAxisIds = this.allArea[this.searchIpt[0].models].map(item => { return item.id })
        this.chartStatisticData[0].data.forEach(chr => {
          chr.seriesData.length = this.allArea[this.searchIpt[0].models].length
          chr.seriesData.fill(0)
        })
      }
      // 打印信息处理
      this.printTable.infoData[1].data[1].value = this.searchObj[params.type].tableHeaderLabel
      this.printTable.infoData[1].data[3].value = this.$options.filters['formatDate'](params.startTime, this.$t('vicenter.common.dayFormat')) + ' ~ ' + this.$options.filters['formatDate'](params.endTime, this.$t('vicenter.common.dayFormat'))
      this.printTable.infoData[2].data[0].value = this.searchObj[params.type].tableHeaderLabel
      this.printTable.infoData[2].data[1].value = this.chartStatisticData[0].yAxisData.join(', ')
      this.exportExcelParams = params
      // 已稽核量查询
      ajax.getAuditedQtyData(params).then((res) => {
        if (res.data.flag) {
          auditedQty = {
            'type': 'auditedQty',
            'items': res.data.result.items
          }
          this.commonCode(auditedQty, notAuditedQty, auditPassQty, auditNotPassQty)
        } else {
        }
      }).catch(() => {})
      // 未稽核量查询
      ajax.getNotAuditedQtyData(params).then((res) => {
        if (res.data.flag) {
          notAuditedQty = {
            'type': 'notAuditedQty',
            'items': res.data.result.items
          }
          this.commonCode(auditedQty, notAuditedQty, auditPassQty, auditNotPassQty)
        } else {
        }
      }).catch(() => {})
      // 已稽核通过量查询
      ajax.getAuditPassQtyData(params).then((res) => {
        if (res.data.flag) {
          auditPassQty = {
            'type': 'auditPassQty',
            'items': res.data.result.items
          }
          this.commonCode(auditedQty, notAuditedQty, auditPassQty, auditNotPassQty)
        } else {
        }
      }).catch(() => {})
      // 已稽核不通过量查询
      ajax.getAuditNotPassQtyData(params).then((res) => {
        if (res.data.flag) {
          auditNotPassQty = {
            'type': 'auditNotPassQty',
            'items': res.data.result.items
          }
          this.commonCode(auditedQty, notAuditedQty, auditPassQty, auditNotPassQty)
        } else {
        }
      }).catch(() => {})
    },
    commonCode (auditedQty, notAuditedQty, auditPassQty, auditNotPassQty) {
      // 统计数据
      this.getTextStatisticData(auditedQty, this.textStatisticData)
      this.getTextStatisticData(notAuditedQty, this.textStatisticData)
      this.getTextStatisticData(auditPassQty, this.textStatisticData)
      this.getTextStatisticData(auditNotPassQty, this.textStatisticData)
      // 排序
      let sortArea = this.getSortArea([auditedQty.items, notAuditedQty.items])
      if (sortArea.length > 0) {
        this.chartStatisticData[0].yAxisData = sortArea.map(item => { return item.name })
        this.chartStatisticData[0].yAxisIds = sortArea.map(item => { return item.id })
      }
      // 柱状图数据
      this.getChartStatisticData(auditedQty, this.chartStatisticData[0])
      this.getChartStatisticData(notAuditedQty, this.chartStatisticData[0])
      this.getChartStatisticData(auditPassQty, this.chartStatisticData[0])
      this.getChartStatisticData(auditNotPassQty, this.chartStatisticData[0])
      // 环状图数据
      let allAuditQty = this.textStatisticData[0].value + this.textStatisticData[1].value
      let radioObj = {
        recheckRate: allAuditQty && this.textStatisticData[0].value ? (this.textStatisticData[0].value / allAuditQty).toFixed(2) : 0,
        recheckPassRate: this.textStatisticData[0].value && this.textStatisticData[2].value ? (this.textStatisticData[2].value / this.textStatisticData[0].value).toFixed(2) : 0
      }
      this.chartStatisticData[1].multipleData.forEach(item => {
        item.data.value = radioObj[item.data.model]
      })
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
    flattenArr (arr) {
      return [].concat(...arr.map(x => Array.isArray(x) ? this.flattenArr(x) : x))
    },
    getSortArea (arr) {
      let dataArr = JSON.parse(JSON.stringify(arr))
      let oldArr = this.flattenArr(dataArr)
      let newArr = []
      let tmpIdArr = []
      // 去重
      oldArr.forEach(item => {
        if (tmpIdArr.indexOf(item.id) === -1) {
          tmpIdArr.push(item.id)
          newArr.push(item)
        } else {
          newArr.forEach(t => {
            if (t.id === item.id) {
              t.taskNum += item.taskNum
            }
          })
        }
      })
      // 排序
      newArr.sort(this.handleSort('taskNum'))
      if (this.queryArea.length > 0) {
        if (newArr.length < this.queryArea.length) {
          let idsArr = newArr.map(item => { return item.id })
          this.queryArea.forEach(item => {
            if (idsArr.indexOf(item.id) === -1) {
              newArr.unshift(item)
            }
          })
        }
      } else {
        if (newArr.length < this.allArea[this.searchIpt[0].models].length) {
          let idsArr = newArr.map(item => { return item.id })
          this.allArea[this.searchIpt[0].models].forEach(item => {
            if (idsArr.indexOf(item.id) === -1) {
              newArr.unshift(item)
            }
          })
        }
      }
      return newArr
    },
    getChartStatisticData (data, val) {
      if (data.items && data.items.length > 0) {
        val.data.forEach(v => {
          if (data.type === v.model) {
            v.seriesData.fill(0)
            data.items.map(item => {
              let index = val.yAxisIds.findIndex(s => { return s === item.id })
              v.seriesData[index] = item.taskNum
            })
          }
        })
      }
    },
    getTableData (data, area) {
      if (area && area.length > 0) {
        let tableData = []
        let tmpArr = []
        area.forEach((item, index) => {
          let tableObj = {
            name: item,
            auditedQty: 0,
            notAuditedQty: 0,
            auditPassQty: 0,
            auditNotPassQty: 0
          }
          tableData.unshift(tableObj)
        })
        data.forEach(da => {
          tmpArr.push(da.seriesData)
        })
        tableData.forEach((item, tIndex) => {
          item.auditedQty = tmpArr[0][tmpArr[0].length - tIndex - 1]
          item.notAuditedQty = tmpArr[1][tmpArr[1].length - tIndex - 1]
          item.auditPassQty = tmpArr[2][tmpArr[2].length - tIndex - 1]
          item.auditNotPassQty = tmpArr[3][tmpArr[3].length - tIndex - 1]
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
        name: this.$t('vicenter.common.totalQty'),
        auditedQty: 0,
        notAuditedQty: 0,
        auditPassQty: 0,
        auditNotPassQty: 0
      }
      let aveObj = {}
      tableData.forEach(item => {
        totalObj.auditedQty += item.auditedQty
        totalObj.notAuditedQty += item.notAuditedQty
        totalObj.auditPassQty += item.auditPassQty
        totalObj.auditNotPassQty += item.auditNotPassQty
      })
      aveObj = {
        name: this.$t('vicenter.common.averageQty'),
        auditedQty: (totalObj.auditedQty / len).toFixed(2),
        notAuditedQty: (totalObj.notAuditedQty / len).toFixed(2),
        auditPassQty: (totalObj.auditPassQty / len).toFixed(2),
        auditNotPassQty: (totalObj.auditNotPassQty / len).toFixed(2)
      }
      return [totalObj, aveObj]
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
      this.chartStatisticData.forEach((item, index) => {
        if (index === 0) {
          item.title = this.searchObj[this.searchIpt[0].models].chartTitle + ' - ' + item.baseTitle
        }
      })
      // 控制列表表头切换
      this.tableGroup[1].label = this.searchObj[this.searchIpt[0].models].tableHeaderLabel
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
              item.models = ''
              this.formRule.model[item.ruleProp] = ''
            }
          }
        }
      })
    },
    // 获取口岸树和关区树
    orgAjaxTree () {
      commonAjax.orgNodesTree({all: true}).then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.$data.searchIpt.forEach(e => {
            if (e.ruleProp === 'siteId') {
              e.treedata = res.data.result
            }
            if (e.ruleProp === 'regionId') {
              let tmp = JSON.parse(JSON.stringify(res.data.result))
              this.getRegionData(tmp)
              e.treedata = tmp
            }
          })
        }
      }).catch(() => {})
    },
    getAllArea (data, val) {
      data.forEach(item => {
        let obj = {
          name: item.name,
          id: item.id
        }
        if (item.orgType === 'customs') {
          val.CUSTOM.push(obj)
        } else if (item.orgType === 'port') {
          val.SITE.push(obj)
        } else if (item.type === 'device') {
          val.DEVICE.push(obj)
        }
        if (item.children && item.children.length > 0) {
          this.getAllArea(item.children, val)
        }
      })
    },
    getRegionData (val) {
      if (!val) {
        return
      }
      val.forEach(data => {
        if (data['children'] && data['children'].length > 0) {
          data['children'].forEach(item => {
            if (item.typeName.indexOf('customs') > -1) {
              item['children'] = []
            } else {
              this.getRegionData(item['children'])
            }
          })
        }
      })
    },
    // 获取设备树
    deviceAjaxTree () {
      commonAjax.deviceNodesTree().then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pid')
          this.allArea = {
            CUSTOM: [],
            SITE: [],
            DEVICE: []
          }
          this.getAllArea(res.data.result, this.allArea)
          this.query()
          this.$data.searchIpt.forEach(e => {
            if (e.ruleProp === 'deviceId') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    // 关区树勾选
    regionCodeCheckChange (nodeObj, checkedObj) {
      this.queryArea = []
      let checkedValue = this.checkRegionChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.searchIpt.forEach(e => {
          if (e.ruleProp === 'regionId') {
            e.models = checkedValue.name
          }
        })
        // 保存选中的地区
        let ids = checkedValue.ids.split(',')
        let names = checkedValue.name.split(',')
        if (ids && ids.length > 0) {
          ids.forEach((i, index) => {
            this.queryArea.push({
              id: i,
              name: names[index]
            })
          })
        }
        this.formRule.model['regionId'] = checkedValue.ids
      }
    },
    checkRegionChange (nodeObj, checkedObj) {
      let checkedName = []
      let checkedId = []
      let checkedCode = []
      checkedObj.checkedNodes.forEach(e => {
        if (e.pid !== null && e.typeName && e.typeName === 'dynamic.asv.customs') {
          if (checkedId.indexOf(e.id) === -1) {
            checkedName.push(e.name)
            checkedId.push(e.id)
            checkedCode.push(e.code)
          }
        }
      })
      let checkedVal = {}
      checkedVal.name = checkedName.join(',')
      checkedVal.ids = checkedId.join(',')
      checkedVal.codes = checkedCode.join(',')
      return checkedVal
    },
    // 口岸树勾选
    siteCodeCheckChange (nodeObj, checkedObj) {
      this.queryArea = []
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.searchIpt.forEach(e => {
          if (e.ruleProp === 'siteId') {
            e.models = checkedValue.name
          }
        })
        // 保存选中的地区
        let ids = checkedValue.ids.split(',')
        let names = checkedValue.name.split(',')
        if (ids && ids.length > 0) {
          ids.forEach((i, index) => {
            this.queryArea.push({
              id: i,
              name: names[index]
            })
          })
        }
        this.formRule.model['siteId'] = checkedValue.ids
      }
    },
    // 设备树勾选
    deviceCodeCheckChange (nodeObj, checkedObj) {
      this.queryArea = []
      let checkedValue = this.$checkNodeChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.searchIpt.forEach(e => {
          if (e.ruleProp === 'deviceId') {
            e.models = checkedValue.name
          }
        })
        // 保存选中的地区
        let ids = checkedValue.ids.split(',')
        let names = checkedValue.name.split(',')
        if (ids && ids.length > 0) {
          ids.forEach((i, index) => {
            this.queryArea.push({
              id: i,
              name: names[index]
            })
          })
        }
        this.formRule.model['deviceId'] = checkedValue.ids
      }
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
        url: '/supervise/recheckRep/exportExcel'
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
      this.queryArea = []
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
