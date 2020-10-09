<template>
  <div id='reports-bar' v-bar>
    <div id="reports-TB">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-top">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar">
            <ComForm ref="searchFormRef" :searchIpt="searchIpt" :searchFunc="searchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-bottom">
          <panelTitle :panelTitleInit="panelTitle.chartTitle">
            <el-button data-id="print-btn" v-if="printButton && switchChartList.list" type="text"  :title="$t('vicenter.common.print')" @click="handlePrint"><span class='iconfont editTable btnClass'>&#xe68b;</span></el-button>
            <el-button data-id="barChart-btn" type="text" :title="$t('vicenter.common.barChart')" @click='tabChartTable("bar")' :disabled="switchChartList.bar"><span class='iconfont editTable btnClass' :class="{notActive: switchChartList.bar}">&#xe69d;</span></el-button>
            <el-button data-id="lineChart-btn" type="text" :title="$t('vicenter.common.lineChart')" @click='tabChartTable("line")' :disabled="switchChartList.line"><span class='iconfont editTable btnClass' :class="{notActive: switchChartList.line}">&#xe699;</span></el-button>
            <el-button data-id="list-btn" type="text" :title="$t('vicenter.common.list')" @click='tabChartTable("list")' :disabled="switchChartList.list"><span class='iconfont editTable btnClass' :class="{notActive: switchChartList.list}">&#xe661;</span></el-button>
            <el-dropdown @command="exportData">
              <el-button v-show="exportButton" data-id="export-btn" type="text" class='transQuery' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item data-id="exportImage-btn" v-if="switchChartList.bar || switchChartList.line" command="image">{{$t('vicenter.ImageLibrary.common.exportJPG')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportExcel-btn" v-if="switchChartList.list" command="excel">{{$t('vicenter.ImageLibrary.common.exportEXCEL')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfChart-btn" v-if="switchChartList.bar || switchChartList.line" command="pdfChart">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfTable-btn" v-if="switchChartList.list" command="pdfTable">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </panelTitle>
          <div class="chartBox" v-bar>
            <div class="chartBox-content">
              <div id="export-container">
                <div v-if="!switchChartList.list" class="chart-title-center">{{chartTitle.text}}</div>
                <chartStatistic v-if="switchChartList.bar" ref="barChartRef" :chartStatisticData="barChartStatisticData"></chartStatistic>
                <chartStatistic v-if="switchChartList.line" ref="lineChartRef" :chartStatisticData="lineChartStatisticData"></chartStatistic>
                <ComTable v-if="switchChartList.list" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
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
import chartStatistic from './chartStatistic'
export default {
  name: 'trendReport',
  data () {
    var checkCustomizeDate = (rule, value, callback) => {
      let minDays = 5
      let minDateNum = 1000 * 3600 * 24 * (minDays - 1)
      if (value && value.length === 2) {
        let diffrenceValue = value[1] - value[0]
        setTimeout(() => {
          if (diffrenceValue < minDateNum) {
            callback(new Error(this.$t('vicenter.reports.validator.minSelectedDateRange', {msg: minDays})))
          } else {
            callback()
          }
        }, 100)
      }
    }
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 4,
        title: '',
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 4,
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
                value: this.$t('vicenter.reports.common.region'),
                ruleProp: 'area'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'area'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.trendType'),
                ruleProp: 'trendType'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'trendType'
              },
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.date'),
                ruleProp: 'statisticTime'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'statisticTime'
              }
            ]
          },
          {
            type: 'title',
            colspan: 4,
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
      chartTitle: {
        symbol: '-',
        text: ''
      },
      dateOptionRange: null,
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
          getLabel: this.$t('vicenter.reports.common.region'),
          type: 'select',
          clearable: true,
          placeHolder: this.$t('vicenter.reports.validator.regionSelect'),
          models: '',
          ruleProp: 'regionId',
          code: 'CUSTOM',
          option: [],
          hiden: false,
          change: this.changeArea,
          tip: this.$t('vicenter.reports.validator.regionSelect')
        },
        {
          getLabel: this.$t('vicenter.reports.common.port'),
          type: 'select',
          clearable: true,
          placeHolder: this.$t('vicenter.reports.validator.portSelect'),
          models: '',
          ruleProp: 'siteId',
          code: 'SITE',
          option: [],
          hiden: true,
          change: this.changeArea,
          tip: this.$t('vicenter.reports.validator.portSelect')
        },
        {
          getLabel: this.$t('vicenter.reports.common.deviceNo'),
          type: 'select',
          clearable: true,
          placeHolder: this.$t('vicenter.reports.validator.deviceSelect'),
          models: '',
          ruleProp: 'deviceId',
          code: 'DEVICE',
          option: [],
          hiden: true,
          change: this.changeArea,
          tip: this.$t('vicenter.reports.validator.deviceSelect')
        },
        {
          getLabel: this.$t('vicenter.reports.common.trendType'),
          type: 'select',
          placeHolder: '',
          models: 'DEFINED',
          ruleProp: 'trendType',
          clearable: false,
          option: [
            {
              value: 'DEFINED',
              label: this.$t('vicenter.reports.common.customize')
            },
            {
              value: 'YEAR',
              label: this.$t('vicenter.reports.common.year')
            },
            {
              value: 'MONTH',
              label: this.$t('vicenter.reports.common.month')
            }
          ],
          change: this.changeTrendType,
          KeepDefault: true, // 保留默认值
          defaultValue: 'DEFINED'
        },
        {
          getLabel: this.$t('vicenter.reports.common.date'),
          type: 'daterange',
          models: [
            new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString()).getTime(),
            new Date(new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()).getTime()
          ],
          ruleProp: 'customizeDate',
          clearable: false,
          valueFormat: 'timestamp',
          editable: false,
          blur: this.blur,
          focus: this.focus,
          change: this.changeCustomizeDate,
          pickerOptions: {
            onPick: time => {
              this.dateOptionRange = time.minDate
            },
            disabledDate: time => {
              let dateOptionRange = this.dateOptionRange
              let maxDateNum = 1000 * 3600 * 24 * (30 - 1)
              let commonDisabledDate = time.getTime() > Date.now() - 1000 * 3600 * 24 * 1
              if (dateOptionRange) {
                // 选择的日期与当前日期小于30天
                let current = new Date(new Date().toLocaleDateString()) - dateOptionRange.getTime()
                return (time.getTime() > dateOptionRange.getTime() + (current < maxDateNum ? current : maxDateNum) ||
                  time.getTime() < dateOptionRange.getTime() - maxDateNum || commonDisabledDate)
              } else {
                // 默认当天及当天之后的日期不可选
                return commonDisabledDate
              }
            }
          },
          hiden: false,
          KeepDefault: true, // 保留默认值
          defaultValue: [ // 默认值
            new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString()).getTime(),
            new Date(new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()).getTime()
          ]
        },
        {
          getLabel: this.$t('vicenter.reports.common.year'),
          type: 'year',
          models: '',
          ruleProp: 'yearDate',
          clearable: false,
          valueFormat: 'timestamp',
          format: this.$t('vicenter.common.yearFormat'),
          hiden: true,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          },
          KeepDefault: true, // 保留默认值
          defaultValue: new Date().getTime()
        },
        {
          getLabel: this.$t('vicenter.reports.common.month'),
          type: 'month',
          models: '',
          ruleProp: 'monthDate',
          clearable: false,
          valueFormat: 'timestamp',
          format: this.$t('vicenter.common.monthFormat'),
          hiden: true,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          },
          KeepDefault: true, // 保留默认值
          defaultValue: new Date().getTime()
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
          regionId: '',
          siteId: '',
          deviceId: '',
          trendType: 'DEFINED',
          customizeDate: [
            new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString()).getTime(),
            new Date(new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()).getTime()
          ],
          yearDate: '',
          monthDate: ''
        },
        refName: 'trendQueryForm',
        rule: {
          customizeDate: [
            { validator: checkCustomizeDate, trigger: 'blur' }
          ],
          regionId: [
            { required: true, message: this.$t('vicenter.reports.validator.regionSelect'), trigger: 'blur' }
          ],
          siteId: [],
          deviceId: []
        }
      },
      checkCustomizeDate: checkCustomizeDate,
      selectedAreaName: '',
      currentRole: '',
      allRole: [
        {
          code: 'INSPECTOR',
          path: '/Reports/imageCheck-task-trend'
        },
        {
          code: 'RECHECK-INSPECTOR',
          path: '/Reports/recheck-task-trend'
        },
        {
          code: 'PHYSICAL-INSPECTOR',
          path: '/Reports/manual-task-trend'
        },
        {
          code: 'AUDITOR',
          path: '/Reports/audit-task-trend'
        }
      ],
      barChartStatisticData: [
        {
          title: '',
          id: 'trendBar',
          chartType: 'barAndLine',
          width: '100%',
          height: '580px',
          colors: ['#98d97d', '#ffd96e'],
          xAxisData: [],
          isHasLine: false,
          data: [],
          noData: true
        }
      ],
      lineChartStatisticData: [
        {
          title: '',
          id: 'trendLine',
          chartType: 'line',
          width: '100%',
          height: '580px',
          colors: ['#48a9ee', '#98d97d', '#ffd96e'],
          xAxisData: [],
          data: [],
          noData: true
        }
      ],
      allArea: { // 全部地区信息
        CUSTOM: [],
        SITE: [],
        DEVICE: []
      },
      tableGroup: [],
      tableGroupDefault: [
        {
          label: this.$t('vicenter.reports.common.date'),
          type: 'text',
          model: 'date',
          width: '',
          dimensionType: 'common'
        },
        {
          label: this.$t('vicenter.reports.common.imageCheckTaskQty'),
          type: 'text',
          model: 'taskNum',
          width: '',
          dimensionType: 'INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.noSuspectQty'),
          type: 'text',
          model: 'nNum',
          width: '',
          dimensionType: 'INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.suspectQty'),
          type: 'text',
          model: 'yNum',
          width: '',
          dimensionType: 'INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.recheckTaskQty'),
          type: 'text',
          model: 'taskNum',
          width: '',
          dimensionType: 'RECHECK-INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.noSuspectQty'),
          type: 'text',
          model: 'nNum',
          width: '',
          dimensionType: 'RECHECK-INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.suspectQty'),
          type: 'text',
          model: 'yNum',
          width: '',
          dimensionType: 'RECHECK-INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.manualTaskQty'),
          type: 'text',
          model: 'taskNum',
          width: '',
          dimensionType: 'PHYSICAL-INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.noSeizedQty'),
          type: 'text',
          model: 'nNum',
          width: '',
          dimensionType: 'PHYSICAL-INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.seizedQty'),
          type: 'text',
          model: 'yNum',
          width: '',
          dimensionType: 'PHYSICAL-INSPECTOR'
        },
        {
          label: this.$t('vicenter.reports.common.notAuditedQty'),
          type: 'text',
          model: 'noCompletedNum',
          width: '',
          dimensionType: 'AUDITOR'
        },
        {
          label: this.$t('vicenter.reports.common.auditedQty'),
          type: 'text',
          model: 'taskNum',
          width: '',
          dimensionType: 'AUDITOR'
        },
        {
          label: this.$t('vicenter.reports.common.auditPassQty'),
          type: 'text',
          model: 'nNum',
          width: '',
          dimensionType: 'AUDITOR'
        },
        {
          label: this.$t('vicenter.reports.common.auditNotPassQty'),
          type: 'text',
          model: 'yNum',
          width: '',
          dimensionType: 'AUDITOR'
        },
        {
          label: this.$t('vicenter.reports.common.auditedRate'),
          type: 'text',
          model: 'completedRate',
          width: '',
          dimensionType: 'AUDITOR'
        }
      ],
      tableData: {
        refName: 'trendTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort
      },
      switchChartList: {
        bar: true,
        line: false,
        list: false
      },
      exportFileName: '',
      tableHeader: [],
      tableFields: [],
      userRoleObj: {
        'INSPECTOR': {
          show: 'analystIds',
          hiden: ['recheckorIds', 'manualIds', 'auditorIds'],
          chartInfo: this.$t('vicenter.reports.common.imageCheckTrendChart'),
          printTitle: this.$t('vicenter.reports.title.imageCheckTrendDetail'),
          dimensionInfo: this.$t('vicenter.reports.common.imgAnalyst'),
          barLegend: [
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.noSuspectQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.suspectQty')
            }
          ],
          lineLegend: [
            {
              model: 'taskNum',
              name: this.$t('vicenter.reports.common.imageCheckTaskQty')
            },
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.noSuspectQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.suspectQty')
            }
          ]
        },
        'RECHECK-INSPECTOR': {
          show: 'recheckorIds',
          hiden: ['analystIds', 'manualIds', 'auditorIds'],
          chartInfo: this.$t('vicenter.reports.common.recheckTrendChart'),
          printTitle: this.$t('vicenter.reports.title.recheckTrendDetail'),
          dimensionInfo: this.$t('vicenter.reports.common.recheckor'),
          barLegend: [
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.noSuspectQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.suspectQty')
            }
          ],
          lineLegend: [
            {
              model: 'taskNum',
              name: this.$t('vicenter.reports.common.recheckTaskQty')
            },
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.noSuspectQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.suspectQty')
            }
          ]
        },
        'PHYSICAL-INSPECTOR': {
          show: 'manualIds',
          hiden: ['analystIds', 'recheckorIds', 'auditorIds'],
          chartInfo: this.$t('vicenter.reports.common.manualTrendChart'),
          printTitle: this.$t('vicenter.reports.title.manualTrendDetail'),
          dimensionInfo: this.$t('vicenter.reports.common.physicalInspector'),
          barLegend: [
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.noSeizedQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.seizedQty')
            }
          ],
          lineLegend: [
            {
              model: 'taskNum',
              name: this.$t('vicenter.reports.common.manualTaskQty')
            },
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.noSeizedQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.seizedQty')
            }
          ]
        },
        'AUDITOR': {
          show: 'auditorIds',
          hiden: ['analystIds', 'recheckorIds', 'manualIds'],
          chartInfo: this.$t('vicenter.reports.common.auditTrendChart'),
          printTitle: this.$t('vicenter.reports.title.auditTrendDetail'),
          dimensionInfo: this.$t('vicenter.reports.common.auditor'),
          barLegend: [
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.auditPassQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.auditNotPassQty')
            },
            {
              model: 'rate',
              name: this.$t('vicenter.reports.common.auditedRate'),
              type: 'line',
              yAxisIndex: 1
            }
          ],
          lineLegend: [
            {
              model: 'taskNum',
              name: this.$t('vicenter.reports.common.auditedQty')
            },
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.auditPassQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.auditNotPassQty')
            }
          ]
        }
      },
      typeSearchObj: {
        'DEFINED': {
          show: 'customizeDate',
          format: this.$t('vicenter.common.dayFormat'),
          hiden: ['yearDate', 'monthDate'],
          typeInfo: this.$t('vicenter.reports.common.customize')
        },
        'YEAR': {
          show: 'yearDate',
          format: this.$t('vicenter.common.yearFormat'),
          hiden: ['customizeDate', 'monthDate'],
          typeInfo: this.$t('vicenter.reports.common.year')
        },
        'MONTH': {
          show: 'monthDate',
          format: this.$t('vicenter.common.monthFormat'),
          hiden: ['customizeDate', 'yearDate'],
          typeInfo: this.$t('vicenter.reports.common.month')
        }
      },
      searchObj: {
        'CUSTOM': {
          show: 'regionId',
          hiden: ['siteId', 'deviceId'],
          label: this.$t('vicenter.reports.common.region')
        },
        'SITE': {
          show: 'siteId',
          hiden: ['regionId', 'deviceId'],
          label: this.$t('vicenter.reports.common.port')
        },
        'DEVICE': {
          show: 'deviceId',
          hiden: ['siteId', 'regionId'],
          label: this.$t('vicenter.reports.common.deviceNo')
        }
      },
      isInitPage: true,
      notAuditNum: [],
      exportExcelParams: []
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    // 判断当前页面
    this.allRole.forEach(item => {
      if (this.$route.path === item.path) {
        this.currentRole = item.code
      }
    })
    this.getAreaInfo()
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
      params.dateType = params.trendType
      if (params.dateType !== 'DEFINED') {
        params.dayTime = params.yearDate || params.monthDate || ''
      } else {
        let customizeDate = this.formRule.model.customizeDate
        if (customizeDate != null && customizeDate.length === 2) {
          params.startTime = customizeDate[0]
          params.endTime = customizeDate[1] + 24 * 60 * 60 * 1000 - 1
        }
      }
      params.idStr = params.regionId || params.siteId || params.deviceId || ''
      delete params.regionId
      delete params.siteId
      delete params.deviceId
      delete params.trendType
      delete params.customizeDate
      delete params.yearDate
      delete params.monthDate
      // 打印信息处理
      this.printTable.infoData[1].data.splice(4)
      this.printTable.infoData[2].data.splice(4)
      if (this.currentRole === 'AUDITOR') {
        this.printTable.allColsNum = 6
        this.printTable.infoData[0].colspan = 6
        this.printTable.infoData[3].colspan = 6
        if (this.printTable.infoData[1].data.length === 4) {
          let obj = {
            type: 'text',
            colspan: 2,
            value: '',
            ruleProp: 'empty'
          }
          this.printTable.infoData[1].data.push(obj)
          this.printTable.infoData[2].data.push(obj)
        }
      } else {
        this.printTable.allColsNum = 4
        this.printTable.infoData[0].colspan = 4
        this.printTable.infoData[3].colspan = 4
      }
      this.printTable.title = this.userRoleObj[this.currentRole].printTitle
      this.printTable.infoData[1].data[1].value = this.searchObj[params.type].label
      this.printTable.infoData[1].data[2].value = this.searchObj[params.type].label
      this.searchIpt.forEach(item => {
        if (item.code === params.type) {
          let area = item.option.filter(e => e.value === params.idStr)
          this.printTable.infoData[1].data[3].value = area[0].label
        }
      })
      if (params.dayTime) {
        this.printTable.infoData[2].data[3].value = this.$options.filters['formatDate'](params.dayTime, this.typeSearchObj[params.dateType].format)
      } else {
        this.printTable.infoData[2].data[3].value = this.$options.filters['formatDate'](params.startTime, this.typeSearchObj[params.dateType].format) + ' ~ ' + this.$options.filters['formatDate'](params.endTime, this.typeSearchObj[params.dateType].format)
      }
      this.printTable.infoData[2].data[1].value = this.typeSearchObj[params.dateType].typeInfo
      this.exportExcelParams = params
      if (this.currentRole === 'INSPECTOR') {
        // 获取无嫌疑量
        ajax.getNoSuspectNumOfImgCheckTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 0)
            }
          }
        }).catch(() => {})
        // 获取有嫌疑量
        ajax.getSuspectNumOfImgCheckTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 1)
            }
          }
        }).catch(() => {})
      } else if (this.currentRole === 'RECHECK-INSPECTOR') {
        // 获取无嫌疑量
        ajax.getNoSuspectNumOfRecheckTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 0)
            }
          }
        }).catch(() => {})
        // 获取有嫌疑量
        ajax.getSuspectNumOfRecheckTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 1)
            }
          }
        }).catch(() => {})
      } else if (this.currentRole === 'PHYSICAL-INSPECTOR') {
        // 获取无查获量
        ajax.getNoSeizedNumOfManualTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 0)
            }
          }
        }).catch(() => {})
        // 获取有查获量
        ajax.getSeizedNumOfManualTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 1)
            }
          }
        }).catch(() => {})
      } else if (this.currentRole === 'AUDITOR') {
        // 获取稽核通过量
        ajax.getRecheckPassNumOfAuditTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 0)
            }
          }
        }).catch(() => {})
        // 获取稽核不通过量
        ajax.getRecheckNotPassNumOfAuditTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, 1)
            }
          }
        }).catch(() => {})
        // 获取未稽核量
        ajax.getNotRecheckNumOfAuditTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.idStr, params.type, params.dateType, null)
            }
          }
        }).catch(() => {})
      }
    },
    commonCode (items, idStr, dimensionType, dateType, dataType) {
      // 更新图表标题内容
      this.searchIpt.forEach(item => {
        if (item.code === this.searchIpt[0].models) {
          item.option.forEach(o => {
            if (o.value === idStr) {
              this.selectedAreaName = o.label
            }
          })
        }
      })
      this.chartTitle.text = this.updateChartTitle()
      // 加载图表数据
      let format = ''
      if (dateType === 'YEAR') {
        format = this.$t('vicenter.common.monthFormat')
      } else {
        format = this.$t('vicenter.common.dayFormat')
      }
      let xAxisData = items.map(item => {
        return item.longTime ? this.$options.filters['formatDate'](item.longTime, format) : ''
      })
      let barSeriesData = items.map(item => {
        return item.taskNum || 0
      })
      let lineSeriesData = items.map(item => {
        return item.taskNum || 0
      })
      let len = xAxisData.length
      this.barChartStatisticData[0].xAxisData = xAxisData
      this.lineChartStatisticData[0].xAxisData = xAxisData
      for (var i in this.userRoleObj) {
        // 清零
        if (dataType !== null) {
          this.userRoleObj[i].barLegend[dataType].seriesData = []
          this.userRoleObj[i].barLegend[dataType].seriesData.length = len
          this.userRoleObj[i].barLegend[dataType].seriesData.fill(0)
          this.userRoleObj[i].lineLegend[dataType + 1].seriesData = []
          this.userRoleObj[i].lineLegend[dataType + 1].seriesData.length = len
          this.userRoleObj[i].lineLegend[dataType + 1].seriesData.fill(0)
          this.userRoleObj[i].lineLegend[0].seriesData = []
          this.userRoleObj[i].lineLegend[0].seriesData.length = len
          this.userRoleObj[i].lineLegend[0].seriesData.fill(0)
        }
        if (this.currentRole === i) {
          if (i === 'AUDITOR') {
            this.barChartStatisticData[0].isHasLine = true
            if (dataType === null) {
              this.userRoleObj[i].barLegend[2].seriesData = []
              this.userRoleObj[i].barLegend[2].seriesData.length = len
              this.userRoleObj[i].barLegend[2].seriesData.fill(0)
            }
          } else {
            this.barChartStatisticData[0].isHasLine = false
          }
          if (dataType !== null) {
            this.userRoleObj[i].barLegend[dataType].seriesData = barSeriesData
            this.userRoleObj[i].lineLegend[dataType + 1].seriesData = lineSeriesData
            this.userRoleObj[i].lineLegend[0].seriesData = this.userRoleObj[i].lineLegend[1].seriesData.map((s, index) => {
              if (this.userRoleObj[i].lineLegend[2].seriesData) {
                return s + this.userRoleObj[i].lineLegend[2].seriesData[index]
              } else {
                return s
              }
            })
          } else {
            this.notAuditNum = barSeriesData
            this.userRoleObj[i].barLegend[2].seriesData = this.userRoleObj[i].lineLegend[0].seriesData.map((s, index) => {
              return s + this.notAuditNum[index] !== 0 ? (s / (s + this.notAuditNum[index]) * 100).toFixed(2) : 0
            })
          }
          this.barChartStatisticData[0].data = this.userRoleObj[i].barLegend.map(item => {
            return {
              name: item.name,
              model: item.model,
              stack: item.yAxisIndex ? '' : 'Qty',
              type: item.type,
              yAxisIndex: item.yAxisIndex,
              seriesData: item.seriesData
            }
          })
          this.lineChartStatisticData[0].data = this.userRoleObj[i].lineLegend.map(item => {
            return {
              name: item.name,
              model: item.model,
              seriesData: item.seriesData
            }
          })
        }
      }
      if (this.switchChartList.bar) {
        this.barChartStatisticData[0].noData = false
        this.$nextTick(() => {
          this.$refs.barChartRef.getData()
        })
      }
      if (this.switchChartList.line) {
        this.lineChartStatisticData[0].noData = false
        this.$nextTick(() => {
          this.$refs.lineChartRef.getData()
        })
      }
      // 加载列表数据
      this.getTableData(this.barChartStatisticData[0].data, this.barChartStatisticData[0].xAxisData, dateType)
      this.isInitPage = false
    },
    getTableData (data, date, dateType) {
      this.tableGroup = []
      this.tableData.data = []
      if (dateType === 'YEAR') {
        this.tableGroupDefault[0].label = this.$t('vicenter.reports.common.month')
      } else {
        this.tableGroupDefault[0].label = this.$t('vicenter.reports.common.date')
      }
      this.tableGroup = this.tableGroupDefault.filter(item => item.dimensionType === this.currentRole || item.dimensionType === 'common')
      if (date && date.length > 0) {
        let tableData = []
        let tmpArr = []
        date.forEach((item, index) => {
          let tableObj = {
            date: item,
            noCompletedNum: 0,
            taskNum: 0,
            nNum: 0,
            yNum: 0,
            completedRate: 0
          }
          tableData.push(tableObj)
        })
        data.forEach(da => {
          tmpArr.push(da.seriesData)
        })
        tableData.forEach((item, tIndex) => {
          item.noCompletedNum = this.notAuditNum.length > 0 ? this.notAuditNum[tIndex] : 0
          item.nNum = tmpArr[0] ? tmpArr[0][tIndex] : 0
          item.yNum = tmpArr[1] ? tmpArr[1][tIndex] : 0
          item.taskNum = item.nNum + item.yNum
          item.completedRate = item.noCompletedNum + item.taskNum ? (item.taskNum / (item.noCompletedNum + item.taskNum) * 100).toFixed(2) + '%' : '0.00%'
        })
        this.tableData.data = tableData.concat(this.getAverage(tableData))
      }
    },
    getAverage (tableData) {
      let len = tableData.length
      let totalObj = {
        date: this.$t('vicenter.common.totalQty'),
        noCompletedNum: 0,
        taskNum: 0,
        nNum: 0,
        yNum: 0,
        completedRate: 0
      }
      let aveObj = {}
      tableData.forEach(item => {
        totalObj.noCompletedNum += item.noCompletedNum
        totalObj.taskNum += item.taskNum
        totalObj.nNum += item.nNum
        totalObj.yNum += item.yNum
      })
      aveObj = {
        date: this.$t('vicenter.common.averageQty'),
        noCompletedNum: parseFloat((totalObj.noCompletedNum / len).toFixed(2)),
        taskNum: parseFloat(Number(totalObj.taskNum / len).toFixed(2)),
        nNum: parseFloat(Number(totalObj.nNum / len).toFixed(2)),
        yNum: parseFloat(Number(totalObj.yNum / len).toFixed(2))
      }
      aveObj.completedRate = Number(aveObj.noCompletedNum + aveObj.taskNum) ? (aveObj.taskNum / (aveObj.noCompletedNum + aveObj.taskNum) * 100).toFixed(2) + '%' : '0.00%'
      return [aveObj]
    },
    // 更新图表标题
    updateChartTitle () {
      let chartTitle = ''
      let titleArr = []
      titleArr.length = 3
      titleArr.fill('')
      titleArr[0] = this.selectedAreaName
      for (let i in this.typeSearchObj) {
        if (this.formRule.model.trendType === i) {
          titleArr[1] = this.typeSearchObj[i].typeInfo
        }
      }
      titleArr[2] = this.userRoleObj[this.currentRole].chartInfo
      chartTitle = titleArr.join(this.chartTitle.symbol)
      return chartTitle
    },
    // 统计维度切换
    changeDimension () {
      // 控制查询条件是否显示
      this.searchIpt.forEach(item => {
        for (let i in this.searchObj) {
          if (this.searchIpt[0].models === i) {
            if (item.ruleProp === this.searchObj[i].show) {
              item.hiden = false
              item.models = item.option[0] ? item.option[0].value : ''
              this.formRule.rule[item.ruleProp] = [{ required: true, message: item.tip, trigger: 'blur' }]
            }
            if (this.searchObj[i].hiden.indexOf(item.ruleProp) > -1) {
              item.hiden = true
              item.models = ''
              this.formRule.model[item.ruleProp] = ''
              this.formRule.rule[item.ruleProp] = []
            }
          }
        }
      })
    },
    // 趋势类型切换
    changeTrendType () {
      // 控制查询条件是否显示
      this.searchIpt.forEach(item => {
        for (let i in this.typeSearchObj) {
          if (this.searchIpt[4].models === i) {
            if (item.ruleProp === this.typeSearchObj[i].show) {
              item.hiden = false
              item.models = item.defaultValue
              this.formRule.model[item.ruleProp] = item.defaultValue
            }
            if (this.typeSearchObj[i].hiden.indexOf(item.ruleProp) > -1) {
              item.hiden = true
              item.models = ''
              this.formRule.model[item.ruleProp] = ''
            }
          }
          if (this.searchIpt[4].models === 'DEFINED') {
            this.formRule.rule.customizeDate = [{ validator: this.checkCustomizeDate, trigger: 'blur' }]
          } else {
            this.formRule.rule.customizeDate = []
          }
        }
      })
    },
    // 图表列表切换
    tabChartTable (type) {
      switch (type) {
        case 'bar': {
          this.switchChartList = {
            bar: true,
            line: false,
            list: false
          }
          if (!this.isInitPage) {
            this.barChartStatisticData[0].noData = false
            this.$nextTick(() => {
              this.$refs.barChartRef.getData()
            })
          }
          break
        }
        case 'line': {
          this.switchChartList = {
            bar: false,
            line: true,
            list: false
          }
          if (!this.isInitPage) {
            this.lineChartStatisticData[0].noData = false
            this.$nextTick(() => {
              this.$refs.lineChartRef.getData()
            })
          }
          break
        }
        case 'list': {
          this.switchChartList = {
            bar: false,
            line: false,
            list: true
          }
        }
      }
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
          label: item.name,
          value: item.id
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
    // 获取地区信息
    getAreaInfo () {
      commonAjax.deviceNodesTree().then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pid')
          this.allArea = {
            CUSTOM: [],
            SITE: [],
            DEVICE: []
          }
          this.getAllArea(res.data.result, this.allArea)
          this.searchIpt.forEach(e => {
            if (e.code) {
              e.option = this.allArea[e.code]
            }
          })
          // 默认选中地区下拉列表第一个
          this.searchIpt[1].models = this.searchIpt[1].option[0].value
          this.formRule.model.regionId = this.searchIpt[1].option[0].value
          this.query()
        }
      }).catch(() => {})
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
      let url = ''
      if (this.currentRole === 'INSPECTOR') {
        url = '/supervise/imgChkTaskTrendRep/exportExcel'
      } else if (this.currentRole === 'RECHECK-INSPECTOR') {
        url = '/supervise/reviewTaskTrendRep/exportExcel'
      } else if (this.currentRole === 'PHYSICAL-INSPECTOR') {
        url = '/supervise/manualTaskTrendRep/exportExcel'
      } else if (this.currentRole === 'AUDITOR') {
        url = '/supervise/recheckTaskTrendRep/exportExcel'
      }
      let params = {
        lang: lang,
        model: this.exportExcelParams,
        sysMenu: '',
        allDataNum: this.tableData.data.length,
        url: url
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
    changeArea () {
      for (let i in this.searchObj) {
        if (this.searchIpt[0].models === i) {
          this.$changeSelectValidateField('searchFormRef', this, this.searchObj[i].show)
        }
      }
    },
    changeCustomizeDate () {
      // 触发校验
      this.$changeSelectValidateField('searchFormRef', this, 'customizeDate')
    },
    resetForm () {
      setTimeout(() => {
        this.changeDimension()
        this.changeTrendType()
      }, 100)
    },
    treeClick () {},
    getSort () {}
  },
  components: { bread, panelTitle, ComForm, ComTable, chartStatistic }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#reports-bar {
  @extend .extend-bar;
  #reports-TB {
    padding:$margin;
    @include box-sizing;
    .infolist {
      @include flex(column, flex-start, flex-start);
      .panel {
        @extend .extend-panel;
      }
      .panel-top {
        width: $all;
        height: 130px;
        overflow: visible!important;
        @include flex(column, flex-start, flex-start);
        .form-bar {
          width: $all;
          .search-form {
            @include flex(row, flex-start, center);
            .el-form-item {
              width: 18%!important;
              margin-right: 15px!important;
              margin-bottom: 0;
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
              .el-form-item__error {
                top: 90%;
              }
            }
            .el-form-iten-hiden {
              display: none;
            }
            .search-form-btn {
              align-self: flex-end;
            }
          }
        }
      }
      .panel-bottom {
        width: $all;
        height: calc(100% - 130px);
        margin-bottom: 0;
        .chartBox {
          width: $all;
          height: calc(100% - 35px);
          overflow: hidden;
          .chartBox-content {
            height: $all;
            overflow: hidden;
            #export-container {
              .chart-title-center {
                width: $all;
                height: 40px;
                font-size: 14px;
                line-height: 40px;
                text-align: center;
              }
              .chart-container {
                border: none;
                .chart-title {
                  display: none;
                }
              }
              .tableComp {
                table {
                  tbody {
                    tr:last-child {
                      font-weight: bold;
                    }
                  }
                }
              }
            }
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
