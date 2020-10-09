<template>
  <div id='reports-bar' v-bar>
    <div id="compare-report">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-top">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar">
            <ComForm ref="searchFormRef" :searchIpt="searchIpt" :searchFunc="searchFunc" :formRule='formRule'></ComForm>
            <ComForm ref="compareSearchFormRef" :searchIpt="compareSearchIpt" :searchFunc="compareSearchFunc" :formRule='compareFormRule'></ComForm>
            <div class="form-btn-group">
              <el-button data-id="queryForm-btn" type="primary" size="large" @click='queryCompare'>{{$t('vicenter.common.compared')}}</el-button>
              <el-button data-id="resetForm-btn" size="large" @click='resetFormCompare'>{{$t('vicenter.common.reset')}}</el-button>
            </div>
          </div>
        </div>
        <div class="panel panel-bottom">
          <panelTitle :panelTitleInit="panelTitle.chartTitle">
            <el-button data-id="print-btn" v-if="printButton && switchChartList.list" type="text"  :title="$t('vicenter.common.print')" @click="handlePrint"><span class='iconfont editTable btnClass'>&#xe68b;</span></el-button>
            <el-button data-id="barChart-btn" type="text" :title="$t('vicenter.common.barChart')" @click='tabChartTable("bar")' :disabled="switchChartList.bar"><span class='iconfont editTable btnClass' :class="{notActive: switchChartList.bar}">&#xe69d;</span></el-button>
            <el-button data-id="list-btn" type="text" :title="$t('vicenter.common.list')" @click='tabChartTable("list")' :disabled="switchChartList.list"><span class='iconfont editTable btnClass' :class="{notActive: switchChartList.list}">&#xe661;</span></el-button>
            <el-dropdown @command="exportData">
              <el-button v-show="exportButton" data-id="export-btn" type="text" class='transQuery' :title="$t('vicenter.common.exportData')"><span class='iconfont editTable btnClass'>&#xe60b;</span></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item data-id="exportImage-btn" v-if="switchChartList.bar" command="image">{{$t('vicenter.ImageLibrary.common.exportJPG')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportExcel-btn" v-if="switchChartList.list" command="excel">{{$t('vicenter.ImageLibrary.common.exportEXCEL')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfChart-btn" v-if="switchChartList.bar" command="pdfChart">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
                <el-dropdown-item data-id="exportPdfTable-btn" v-if="switchChartList.list" command="pdfTable">{{$t('vicenter.ImageLibrary.common.exportPDF')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </panelTitle>
          <div class="chartBox" v-bar>
            <div class="chartBox-content">
              <div id="export-container">
                <div v-if="!switchChartList.list" class="chart-title-center">{{chartTitle.text}}</div>
                <chartStatistic v-if="switchChartList.bar" ref="barChartRef" :chartStatisticData="barChartStatisticData"></chartStatistic>
                <tableStatistic v-if="switchChartList.list" data-id="comparedTable" :showTable="showTable" :tableStatisticData="tableStatisticData"></tableStatistic>
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
import exportExcel from '@/lib/exportExcel/export2Excel.js'
import chartStatistic from './chartStatistic'
import tableStatistic from './tableStatistic'
export default {
  name: 'comparedReport',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 8,
        title: '',
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 8,
            infoType: 'statisticConditionInfo',
            label: this.$t('vicenter.reports.common.statisticCondition')
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.dimension'),
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
              },
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.type'),
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
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.comparedDimension'),
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
              },
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.comparedType'),
                ruleProp: 'trendType'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'trendType'
              },
              {
                type: 'label',
                value: this.$t('vicenter.reports.common.comparedDate'),
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
            colspan: 8,
            infoType: 'statisticDetailsInfo',
            label: this.$t('vicenter.reports.common.statisticDetails')
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
      searchIpt: [
        {
          getLabel: this.$t('vicenter.reports.common.dimension'),
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
          change: this.handleChangeDimension,
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
          getLabel: this.$t('vicenter.reports.common.type'),
          type: 'select',
          placeHolder: '',
          models: 'YEAR',
          ruleProp: 'trendType',
          clearable: false,
          option: [
            {
              value: 'YEAR',
              label: this.$t('vicenter.reports.common.year')
            },
            {
              value: 'MONTH',
              label: this.$t('vicenter.reports.common.month')
            },
            {
              value: 'DAY',
              label: this.$t('vicenter.reports.common.day')
            }
          ],
          change: this.changeCompareType,
          KeepDefault: true, // 保留默认值
          defaultValue: 'YEAR'
        },
        {
          getLabel: this.$t('vicenter.reports.common.date'),
          type: 'year',
          models: new Date().getTime(),
          ruleProp: 'yearDate',
          clearable: false,
          valueFormat: 'timestamp',
          format: this.$t('vicenter.common.yearFormat'),
          hiden: false,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          },
          KeepDefault: true, // 保留默认值
          defaultValue: new Date().getTime()
        },
        {
          getLabel: this.$t('vicenter.reports.common.date'),
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
        },
        {
          getLabel: this.$t('vicenter.reports.common.date'),
          type: 'date',
          models: '',
          ruleProp: 'dayDate',
          clearable: false,
          valueFormat: 'timestamp',
          format: this.$t('vicenter.common.dayFormat'),
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
      compareSearchIpt: [
        {
          getLabel: this.$t('vicenter.reports.common.comparedDimension'),
          type: 'select',
          models: 'CUSTOM',
          ruleProp: 'type',
          disabled: true,
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
          change: this.handleChangeDimensionCompare,
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
          change: this.changeCompareArea,
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
          change: this.changeCompareArea,
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
          change: this.changeCompareArea,
          tip: this.$t('vicenter.reports.validator.deviceSelect')
        },
        {
          getLabel: this.$t('vicenter.reports.common.comparedType'),
          type: 'select',
          placeHolder: '',
          models: 'YEAR',
          ruleProp: 'trendType',
          clearable: false,
          option: [
            {
              value: 'YEAR',
              label: this.$t('vicenter.reports.common.year')
            },
            {
              value: 'MONTH',
              label: this.$t('vicenter.reports.common.month')
            },
            {
              value: 'DAY',
              label: this.$t('vicenter.reports.common.day')
            }
          ],
          change: this.changeCompareTypeCompare,
          KeepDefault: true, // 保留默认值
          defaultValue: 'YEAR'
        },
        {
          getLabel: this.$t('vicenter.reports.common.comparedDate'),
          type: 'year',
          models: new Date().getTime(),
          ruleProp: 'yearDate',
          clearable: false,
          valueFormat: 'timestamp',
          format: this.$t('vicenter.common.yearFormat'),
          hiden: false,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          },
          KeepDefault: true, // 保留默认值
          defaultValue: new Date().getTime()
        },
        {
          getLabel: this.$t('vicenter.reports.common.comparedDate'),
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
        },
        {
          getLabel: this.$t('vicenter.reports.common.comparedDate'),
          type: 'date',
          models: '',
          ruleProp: 'dayDate',
          clearable: false,
          valueFormat: 'timestamp',
          format: this.$t('vicenter.common.dayFormat'),
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
      compareSearchFunc: {
        query: this.query,
        close: this.resetForm,
        queryText: this.$t('vicenter.common.compared'),
        resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        model: {
          type: 'CUSTOM',
          regionId: '',
          siteId: '',
          deviceId: '',
          trendType: 'YEAR',
          yearDate: new Date().getTime(),
          monthDate: '',
          dayDate: ''
        },
        refName: 'comparedQueryForm',
        rule: {
          regionId: [
            { required: true, message: this.$t('vicenter.reports.validator.regionSelect'), trigger: 'blur' }
          ],
          siteId: [],
          deviceId: []
        }
      },
      compareFormRule: {
        model: {
          type: 'CUSTOM',
          regionId: '',
          siteId: '',
          deviceId: '',
          trendType: 'YEAR',
          yearDate: new Date().getTime(),
          monthDate: '',
          dayDate: ''
        },
        refName: 'comparedQueryFormCompare',
        rule: {
          regionId: [
            { required: true, message: this.$t('vicenter.reports.validator.regionSelect'), trigger: 'blur' }
          ],
          siteId: [],
          deviceId: []
        }
      },
      selectedAreaName: '',
      currentRole: '',
      allRole: [
        {
          code: 'INSPECTOR',
          path: '/Reports/imageCheck-task-compared'
        },
        {
          code: 'RECHECK-INSPECTOR',
          path: '/Reports/recheck-task-compared'
        },
        {
          code: 'PHYSICAL-INSPECTOR',
          path: '/Reports/manual-task-compared'
        },
        {
          code: 'AUDITOR',
          path: '/Reports/audit-task-compared'
        }
      ],
      barChartStatisticData: [
        {
          title: '',
          id: 'personnelComparedBar',
          chartType: 'barAndLine',
          width: '100%',
          height: '500px',
          colors: ['#98d97d', '#ffd96e'],
          isLegendChange: true,
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
      showTable: false,
      tableStatisticData: [],
      tableAllData: [{}, {}],
      tableGroupDefault: [
        {
          label: this.$t('vicenter.reports.common.date'),
          type: 'text',
          model: 'date',
          width: '',
          dimensionType: 'common'
        },
        {
          label: '',
          type: 'text',
          model: 'area',
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
        }
      ],
      switchChartList: {
        bar: true,
        list: false
      },
      exportFileName: '',
      tableHeader: [],
      tableFields: [],
      userRoleObj: {
        'INSPECTOR': {
          show: 'analystIds',
          hiden: ['recheckorIds', 'manualIds', 'auditorIds'],
          chartInfo: this.$t('vicenter.reports.common.imageCheckCompareChart'),
          printTitle: this.$t('vicenter.reports.title.imageCheckComparedDetail'),
          barLegend: [
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
          chartInfo: this.$t('vicenter.reports.common.recheckCompareChart'),
          printTitle: this.$t('vicenter.reports.title.recheckComparedDetail'),
          barLegend: [
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
          chartInfo: this.$t('vicenter.reports.common.manualCompareChart'),
          printTitle: this.$t('vicenter.reports.title.manualComparedDetail'),
          barLegend: [
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
          chartInfo: this.$t('vicenter.reports.common.auditCompareChart'),
          printTitle: this.$t('vicenter.reports.title.auditComparedDetail'),
          barLegend: [
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
        'DAY': {
          show: 'dayDate',
          format: this.$t('vicenter.common.dayFormat'),
          hiden: ['yearDate', 'monthDate'],
          typeInfo: this.$t('vicenter.reports.common.day')
        },
        'YEAR': {
          show: 'yearDate',
          format: this.$t('vicenter.common.yearFormat'),
          hiden: ['dayDate', 'monthDate'],
          typeInfo: this.$t('vicenter.reports.common.year')
        },
        'MONTH': {
          show: 'monthDate',
          format: this.$t('vicenter.common.monthFormat'),
          hiden: ['dayDate', 'yearDate'],
          typeInfo: this.$t('vicenter.reports.common.month')
        }
      },
      searchObj: {
        'CUSTOM': {
          show: 'regionId',
          hiden: ['siteId', 'deviceId'],
          name: this.$t('vicenter.reports.common.region'),
          label: this.$t('vicenter.reports.common.region')
        },
        'SITE': {
          show: 'siteId',
          hiden: ['regionId', 'deviceId'],
          name: this.$t('vicenter.reports.common.port'),
          label: this.$t('vicenter.reports.common.port')
        },
        'DEVICE': {
          show: 'deviceId',
          hiden: ['siteId', 'regionId'],
          name: this.$t('vicenter.reports.common.device'),
          label: this.$t('vicenter.reports.common.deviceNo')
        }
      },
      xAxisData: ['', ''],
      isInitPage: true,
      exportExcelParams: []
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.getAreaInfo()
    // 判断当前页面
    this.allRole.forEach(item => {
      if (this.$route.path === item.path) {
        this.currentRole = item.code
      }
    })
  },
  mounted () {
  },
  methods: {
    getPrintReportInfo () {
      this.printTable.infoData.splice(4)
      if (this.tableStatisticData.length > 0) {
        this.tableStatisticData.forEach(item => {
          this.printTable.infoData.push({
            type: 'content',
            infoType: 'statisticDetailsInfo',
            data: [
              {
                type: 'text',
                colspan: 2,
                value: item.label,
                ruleProp: ''
              },
              {
                type: 'text',
                colspan: 3,
                value: item.value,
                ruleProp: ''
              },
              {
                type: 'text',
                colspan: 3,
                value: item.compareValue,
                ruleProp: ''
              }
            ]
          })
        })
      } else {
        this.printTable.infoData.push({
          type: 'content',
          infoType: 'statisticDetailsInfo',
          data: [
            {
              type: 'text',
              colspan: 8,
              value: this.$t('vicenter.common.nodata'),
              ruleProp: 'noData'
            }
          ]
        })
      }
    },
    handlePrint () {
      this.getPrintReportInfo()
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.getPrintReportInfo()
      this.$refs.printTableRef.handleExport()
    },
    queryCompare () {
      // 同时校验两个表单
      let flag = 0
      this.$refs.searchFormRef.$refs[this.formRule.refName].validate((valid) => {
        if (valid) {
          flag += 1
        }
      })
      this.$refs.compareSearchFormRef.$refs[this.compareFormRule.refName].validate((valid) => {
        if (valid) {
          flag += 1
        }
      })
      if (flag !== 2) {
        return
      }
      // 处理请求参数
      let params = {}
      let paramsCompare = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      params.dateType = params.trendType
      params.dayTime = params.yearDate || params.monthDate || params.dayDate || ''
      params.idStr = params.regionId || params.siteId || params.deviceId || ''
      delete params.regionId
      delete params.siteId
      delete params.deviceId
      delete params.trendType
      delete params.yearDate
      delete params.monthDate
      delete params.dayDate
      paramsCompare = JSON.parse(JSON.stringify(this.compareFormRule.model))
      paramsCompare.dateType = paramsCompare.trendType
      paramsCompare.dayTime = paramsCompare.yearDate || paramsCompare.monthDate || paramsCompare.dayDate || ''
      paramsCompare.idStr = paramsCompare.regionId || paramsCompare.siteId || paramsCompare.deviceId || ''
      delete paramsCompare.regionId
      delete paramsCompare.siteId
      delete paramsCompare.deviceId
      delete paramsCompare.trendType
      delete paramsCompare.yearDate
      delete paramsCompare.monthDate
      delete paramsCompare.dayDate
      for (var i in this.userRoleObj) {
        this.userRoleObj[i].barLegend.forEach(item => {
          item.seriesData = []
          item.seriesData.length = 2
          item.seriesData.fill(0)
        })
      }
      this.tableStatisticData = []
      this.tableGroupDefault[1].label = this.searchObj[this.searchIpt[0].models].name
      this.tableGroupDefault.forEach(item => {
        if (item.dimensionType === this.currentRole || item.dimensionType === 'common') {
          this.tableStatisticData.push({
            label: item.label,
            model: item.model,
            value: 0,
            compareValue: 0
          })
        }
      })
      let area = ''
      let areaCompare = ''
      this.searchIpt.forEach(item => {
        if (item.code === this.searchIpt[0].models) {
          item.option.forEach(o => {
            if (o.value === params.idStr) {
              area = o.label
            }
          })
        }
      })
      this.compareSearchIpt.forEach(item => {
        if (item.code === this.compareSearchIpt[0].models) {
          item.option.forEach(o => {
            if (o.value === paramsCompare.idStr) {
              areaCompare = o.label
            }
          })
        }
      })
      // 打印信息处理
      this.printTable.title = this.userRoleObj[this.currentRole].printTitle
      this.printTable.infoData[1].data[1].value = this.searchObj[params.type].label
      this.printTable.infoData[1].data[2].value = this.searchObj[params.type].label
      this.printTable.infoData[1].data[3].value = area
      this.printTable.infoData[1].data[5].value = this.typeSearchObj[params.dateType].typeInfo
      if (params.dayTime) {
        this.printTable.infoData[1].data[7].value = this.$options.filters['formatDate'](params.dayTime, this.typeSearchObj[params.dateType].format)
      } else {
        this.printTable.infoData[1].data[7].value = this.$options.filters['formatDate'](params.startTime, this.typeSearchObj[params.dateType].format) + ' ~ ' + this.$options.filters['formatDate'](params.endTime, this.typeSearchObj[params.dateType].format)
      }
      this.printTable.infoData[2].data[1].value = this.searchObj[paramsCompare.type].label
      this.printTable.infoData[2].data[2].value = this.searchObj[paramsCompare.type].label
      this.printTable.infoData[2].data[3].value = areaCompare
      this.printTable.infoData[2].data[5].value = this.typeSearchObj[paramsCompare.dateType].typeInfo
      if (paramsCompare.dayTime) {
        this.printTable.infoData[2].data[7].value = this.$options.filters['formatDate'](paramsCompare.dayTime, this.typeSearchObj[paramsCompare.dateType].format)
      } else {
        this.printTable.infoData[2].data[7].value = this.$options.filters['formatDate'](paramsCompare.startTime, this.typeSearchObj[paramsCompare.dateType].format) + ' ~ ' + this.$options.filters['formatDate'](paramsCompare.endTime, this.typeSearchObj[paramsCompare.dateType].format)
      }
      this.exportExcelParams = [params, paramsCompare]
      if (this.currentRole === 'INSPECTOR') {
        ajax.getImgCheckComparedData(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, params.type, area, params.dateType, params.dayTime, 0)
          }
        }).catch(() => {})
        ajax.getImgCheckComparedData(paramsCompare).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, paramsCompare.type, areaCompare, paramsCompare.dateType, paramsCompare.dayTime, 1)
          }
        }).catch(() => {})
      } else if (this.currentRole === 'RECHECK-INSPECTOR') {
        ajax.getRecheckComparedData(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, params.type, area, params.dateType, params.dayTime, 0)
          }
        }).catch(() => {})
        ajax.getRecheckComparedData(paramsCompare).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, paramsCompare.type, areaCompare, paramsCompare.dateType, paramsCompare.dayTime, 1)
          }
        }).catch(() => {})
      } else if (this.currentRole === 'PHYSICAL-INSPECTOR') {
        ajax.getManualComparedData(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, params.type, area, params.dateType, params.dayTime, 0)
          }
        }).catch(() => {})
        ajax.getManualComparedData(paramsCompare).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, paramsCompare.type, areaCompare, paramsCompare.dateType, paramsCompare.dayTime, 1)
          }
        }).catch(() => {})
      } else if (this.currentRole === 'AUDITOR') {
        ajax.getAuditComparedData(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, params.type, area, params.dateType, params.dayTime, 0)
          }
        }).catch(() => {})
        ajax.getAuditComparedData(paramsCompare).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            this.commonCode(result, paramsCompare.type, areaCompare, paramsCompare.dateType, paramsCompare.dayTime, 1)
          }
        }).catch(() => {})
      }
    },
    commonCode (result, type, area, dateType, dayTime, dataType) {
      // 更新图表标题内容
      this.chartTitle.text = this.userRoleObj[this.currentRole].chartInfo
      // 加载图表数据
      let date = ''
      if (dateType === 'YEAR') {
        date = dayTime ? `(${this.$options.filters['formatDate'](dayTime, this.$t('vicenter.common.yearFormat'))})` : ''
      } else if (dateType === 'MONTH') {
        date = dayTime ? `(${this.$options.filters['formatDate'](dayTime, this.$t('vicenter.common.monthFormat'))})` : ''
      } else if (dateType === 'DAY') {
        date = dayTime ? `(${this.$options.filters['formatDate'](dayTime, this.$t('vicenter.common.dayFormat'))})` : ''
      }
      this.xAxisData[dataType] = `${area} ${date}`
      this.barChartStatisticData[0].xAxisData = this.xAxisData
      for (var i in this.userRoleObj) {
        if (this.currentRole === i) {
          if (this.currentRole === 'INSPECTOR' || this.currentRole === 'RECHECK-INSPECTOR') {
            this.userRoleObj[i].barLegend[0].seriesData[dataType] = result.noSuspectNum || 0
            this.userRoleObj[i].barLegend[1].seriesData[dataType] = result.suspectNum || 0
          } else if (this.currentRole === 'PHYSICAL-INSPECTOR') {
            this.userRoleObj[i].barLegend[0].seriesData[dataType] = result.noSeizedNum || 0
            this.userRoleObj[i].barLegend[1].seriesData[dataType] = result.seizedNum || 0
          } else if (this.currentRole === 'AUDITOR') {
            this.userRoleObj[i].barLegend[0].seriesData[dataType] = result.recheckPassNum || 0
            this.userRoleObj[i].barLegend[1].seriesData[dataType] = result.recheckNotPassNum || 0
          }
          this.barChartStatisticData[0].data = this.userRoleObj[i].barLegend.map(item => {
            return {
              name: item.name,
              model: item.model,
              type: item.type,
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
      this.tableAllData[dataType] = result
      this.tableAllData[dataType].date = date.substring(1, date.length - 1)
      this.tableAllData[dataType].area = area
      // 加载列表数据
      this.getTableData()
      this.isInitPage = false
    },
    resetFormCompare () {
      this.$refs.compareSearchFormRef.reset()
      this.$refs.searchFormRef.reset()
      // 默认值重置
      this.handleChangeDimensionCompare()
      this.changeCompareTypeCompare()
      this.searchIpt[4].models = this.compareSearchIpt[4].models
      this.changeCompareType()
    },
    getTableData () {
      let nNum = 0
      let yNum = 0
      let compareNNum = 0
      let compareYNum = 0
      let taskNum = 0
      let compareTaskNum = 0
      let area = this.tableAllData[0].area
      let compareArea = this.tableAllData[1].area
      let date = this.tableAllData[0].date
      let compareDate = this.tableAllData[1].date
      if (this.currentRole === 'INSPECTOR' || this.currentRole === 'RECHECK-INSPECTOR') {
        nNum = this.tableAllData[0].noSuspectNum || 0
        yNum = this.tableAllData[0].suspectNum || 0
        compareNNum = this.tableAllData[1].noSuspectNum || 0
        compareYNum = this.tableAllData[1].suspectNum || 0
      } else if (this.currentRole === 'PHYSICAL-INSPECTOR') {
        nNum = this.tableAllData[0].noSeizedNum || 0
        yNum = this.tableAllData[0].seizedNum || 0
        compareNNum = this.tableAllData[1].noSeizedNum || 0
        compareYNum = this.tableAllData[1].seizedNum || 0
      } else if (this.currentRole === 'AUDITOR') {
        nNum = this.tableAllData[0].recheckPassNum || 0
        yNum = this.tableAllData[0].recheckNotPassNum || 0
        compareNNum = this.tableAllData[1].recheckPassNum || 0
        compareYNum = this.tableAllData[1].recheckNotPassNum || 0
      }
      taskNum = nNum + yNum
      compareTaskNum = compareNNum + compareYNum
      this.tableStatisticData.forEach(item => {
        if (item.model === 'date') {
          item.value = date
          item.compareValue = compareDate
        } else if (item.model === 'area') {
          item.value = area
          item.compareValue = compareArea
        } else if (item.model === 'taskNum') {
          item.value = taskNum
          item.compareValue = compareTaskNum
        } else if (item.model === 'nNum') {
          item.value = nNum
          item.compareValue = compareNNum
        } else if (item.model === 'yNum') {
          item.value = yNum
          item.compareValue = compareYNum
        }
      })
      this.showTable = true
    },
    handleChangeDimension () {
      this.changeDimension()
      this.compareSearchIpt[0].models = this.searchIpt[0].models
      this.changeDimensionCompare()
    },
    handleChangeDimensionCompare () {
      this.changeDimensionCompare()
      this.searchIpt[0].models = this.compareSearchIpt[0].models
      this.changeDimension()
    },
    // 统计维度切换
    changeDimension () {
      // 控制查询条件是否显示
      this.searchIpt.forEach(item => {
        for (let i in this.searchObj) {
          if (this.searchIpt[0].models === i) {
            if (item.ruleProp === this.searchObj[i].show) {
              item.hiden = false
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
      this.compareSearchIpt[0].models = this.searchIpt[0].models
    },
    // 对比统计维度切换
    changeDimensionCompare () {
      // 控制查询条件是否显示
      this.compareSearchIpt.forEach(item => {
        for (let i in this.searchObj) {
          if (this.compareSearchIpt[0].models === i) {
            if (item.ruleProp === this.searchObj[i].show) {
              item.hiden = false
              this.compareFormRule.rule[item.ruleProp] = [{ required: true, message: item.tip, trigger: 'blur' }]
            }
            if (this.searchObj[i].hiden.indexOf(item.ruleProp) > -1) {
              item.hiden = true
              item.models = ''
              this.compareFormRule.model[item.ruleProp] = ''
              this.compareFormRule.rule[item.ruleProp] = []
            }
          }
        }
      })
    },
    // 类型切换
    changeCompareType () {
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
        }
      })
    },
    // 对比类型切换
    changeCompareTypeCompare () {
      // 控制查询条件是否显示
      this.compareSearchIpt.forEach(item => {
        for (let i in this.typeSearchObj) {
          if (this.compareSearchIpt[4].models === i) {
            if (item.ruleProp === this.typeSearchObj[i].show) {
              item.hiden = false
              item.models = item.defaultValue
              this.compareFormRule.model[item.ruleProp] = item.defaultValue
            }
            if (this.typeSearchObj[i].hiden.indexOf(item.ruleProp) > -1) {
              item.hiden = true
              item.models = ''
              this.compareFormRule.model[item.ruleProp] = ''
            }
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
        case 'list': {
          this.switchChartList = {
            bar: false,
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
          this.compareSearchIpt.forEach(e => {
            if (e.code) {
              e.option = this.allArea[e.code]
            }
          })
        }
      }).catch(() => {})
    },
    // 导出
    exportData (command) {
      // 导出文件名称
      this.exportFileName = this.$t(this.$route.name)
      // 导出excel相关数据
      this.tableHeader = []
      this.tableFields = ['label', 'value', 'compareValue']
      let exportArray = []
      this.tableStatisticData.forEach((item) => {
        if (item.model === 'date') {
          this.tableHeader = [item.label, item.value, item.compareValue]
        } else {
          exportArray.push(item)
        }
      })
      if (command === 'excel') {
        if (this.exportExcelParams.length === 2) {
          this.handleExportExcel()
        } else {
          return
        }
        // exportExcel({exportArray: exportArray, tHeader: this.tableHeader, filterFields: this.tableFields, fileName: this.exportFileName})
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
        url = '/supervise/taskCompareRep/exportImgChkCompare'
      } else if (this.currentRole === 'RECHECK-INSPECTOR') {
        url = '/supervise/taskCompareRep/exportReviewCompare'
      } else if (this.currentRole === 'PHYSICAL-INSPECTOR') {
        url = '/supervise/taskCompareRep/exportManualCompare'
      } else if (this.currentRole === 'AUDITOR') {
        url = '/supervise/taskCompareRep/exportRecheckCompare'
      }
      let params = {
        lang: lang,
        model: { conditionJsonStr: JSON.stringify(this.exportExcelParams) },
        sysMenu: '',
        allDataNum: 2,
        url: url
      }
      this.$commonExportExcel(params, false)
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
    changeCompareArea () {
      for (let i in this.searchObj) {
        if (this.searchIpt[0].models === i) {
          this.$changeSelectValidateField('compareSearchFormRef', this, this.searchObj[i].show)
        }
      }
    },
    resetForm () {},
    treeClick () {},
    getSort () {}
  },
  components: { bread, panelTitle, ComForm, chartStatistic, tableStatistic }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#reports-bar {
  @extend .extend-bar;
  #compare-report {
    padding:$margin;
    @include box-sizing;
    .infolist {
      @include flex(column, flex-start, flex-start);
      .panel {
        @extend .extend-panel;
      }
      .panel-top {
        width: $all;
        height: 224px;
        overflow: visible!important;
        @include flex(column, flex-start, flex-start);
        .form-bar {
          width: $all;
          position: relative;
          .search-form {
            padding: 10px 20px 22px 20px;
            height: 45%;
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
            }
            .el-form-iten-hiden {
              display: none;
            }
            .search-form-btn {
              display: none;
            }
          }
          .form-btn-group {
            position: absolute;
            bottom: 40px;
            right: 20px;
            .el-button {
              padding: 8px 20px;
            }
          }
        }
      }
      .panel-bottom {
        width: $all;
        height: calc(100% - 210px);
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
