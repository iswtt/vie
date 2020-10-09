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
import chartStatistic from './common/chartStatistic'
export default {
  name: 'personnelTrendReport',
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
        title: this.$t('vicenter.reports.title.personnelTrendDetail'),
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
                value: this.$t('vicenter.reports.common.imgAnalyst'),
                ruleProp: 'person'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'person'
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
          getLabel: this.$t('vicenter.reports.common.imgAnalyst'),
          type: 'select',
          // filterable: true,
          // allowCreate: true,
          clearable: true,
          placeHolder: this.$t('vicenter.reports.validator.imgAnalystSelect'),
          models: '',
          ruleProp: 'analystIds',
          roleCode: 'INSPECTOR',
          option: [],
          hiden: false,
          change: this.changePerson,
          tip: this.$t('vicenter.reports.validator.imgAnalystSelect')
        },
        {
          getLabel: this.$t('vicenter.reports.common.recheckor'),
          type: 'select',
          // filterable: true,
          // allowCreate: true,
          clearable: true,
          placeHolder: this.$t('vicenter.reports.validator.recheckorSelect'),
          models: '',
          ruleProp: 'recheckorIds',
          roleCode: 'RECHECK-INSPECTOR',
          option: [],
          hiden: true,
          change: this.changePerson,
          tip: this.$t('vicenter.reports.validator.recheckorSelect')
        },
        {
          getLabel: this.$t('vicenter.reports.common.physicalInspector'),
          type: 'select',
          // filterable: true,
          // allowCreate: true,
          clearable: true,
          placeHolder: this.$t('vicenter.reports.validator.physicalInspectorSelect'),
          models: '',
          ruleProp: 'manualIds',
          roleCode: 'PHYSICAL-INSPECTOR',
          option: [],
          hiden: true,
          change: this.changePerson,
          tip: this.$t('vicenter.reports.validator.physicalInspectorSelect')
        },
        {
          getLabel: this.$t('vicenter.reports.common.auditor'),
          type: 'select',
          // filterable: true,
          // allowCreate: true,
          clearable: true,
          placeHolder: this.$t('vicenter.reports.validator.auditorSelect'),
          models: '',
          ruleProp: 'auditorIds',
          roleCode: 'AUDITOR',
          option: [],
          hiden: true,
          change: this.changePerson,
          tip: this.$t('vicenter.reports.validator.auditorSelect')
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
          type: 'INSPECTOR',
          analystIds: '',
          recheckorIds: '',
          manualIds: '',
          auditorIds: '',
          trendType: 'DEFINED',
          customizeDate: [
            new Date(new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString()).getTime(),
            new Date(new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()).getTime()
          ],
          yearDate: '',
          monthDate: ''
        },
        refName: 'personnelTrendQueryForm',
        rule: {
          customizeDate: [
            { validator: checkCustomizeDate, trigger: 'blur' }
          ],
          analystIds: [
            { required: true, message: this.$t('vicenter.reports.validator.imgAnalystSelect'), trigger: 'blur' }
          ],
          recheckorIds: [],
          manualIds: [],
          auditorIds: []
        }
      },
      checkCustomizeDate: checkCustomizeDate,
      barChartStatisticData: [
        {
          title: '',
          id: 'personnelTrendBar',
          chartType: 'barAndLine',
          width: '100%',
          height: '580px',
          colors: ['#98d97d', '#ffd96e'],
          xAxisData: [],
          data: [],
          noData: true
        }
      ],
      lineChartStatisticData: [
        {
          title: '',
          id: 'personnelTrendLine',
          chartType: 'line',
          width: '100%',
          height: '580px',
          colors: ['#48a9ee', '#98d97d', '#ffd96e'],
          xAxisData: [],
          data: [],
          noData: true
        }
      ],
      allPeople: { // 全部人员
        'INSPECTOR': [],
        'RECHECK-INSPECTOR': [],
        'PHYSICAL-INSPECTOR': [],
        'AUDITOR': []
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
      tableData: {
        refName: 'personnelTrendTable',
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
      dimensionSearchObj: {
        'INSPECTOR': {
          show: 'analystIds',
          hiden: ['recheckorIds', 'manualIds', 'auditorIds'],
          chartInfo: this.$t('vicenter.reports.common.imageCheckTrendChart'),
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
          dimensionInfo: this.$t('vicenter.reports.common.auditor'),
          barLegend: [
            {
              model: 'nNum',
              name: this.$t('vicenter.reports.common.auditPassQty')
            },
            {
              model: 'yNum',
              name: this.$t('vicenter.reports.common.auditNotPassQty')
            }
            // {
            //   model: 'rate',
            //   name: this.$t('vicenter.reports.common.auditedRate'),
            //   type: 'line',
            //   yAxisIndex: 1
            // }
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
      isInitPage: true,
      exportExcelParams: {}
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.getPersonInfo()
  },
  mounted () {},
  methods: {
    handlePrint () {
      this.$getPrintReportInfo(this, 4)
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$getPrintReportInfo(this, 4)
      this.$refs.printTableRef.handleExport()
    },
    // 获取人员信息
    getPersonInfo () {
      for (let i in this.dimensionSearchObj) {
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
                  }).catch(() => {})
                }
              })
              // 默认选中审图员下拉列表第一个
              this.searchIpt[1].models = this.searchIpt[1].option[0].value
              this.formRule.model.analystIds = this.searchIpt[1].option[0].value
              this.query()
            }
          }
        }).catch(() => {})
      }
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
      params.accountStr = params.analystIds || params.recheckorIds || params.manualIds || params.auditorIds || ''
      delete params.analystIds
      delete params.recheckorIds
      delete params.manualIds
      delete params.auditorIds
      delete params.trendType
      delete params.customizeDate
      delete params.yearDate
      delete params.monthDate
      // 打印信息处理
      this.printTable.infoData[1].data[1].value = this.dimensionSearchObj[params.type].dimensionInfo
      this.printTable.infoData[1].data[2].value = this.dimensionSearchObj[params.type].dimensionInfo
      this.printTable.infoData[1].data[3].value = params.accountStr
      if (params.dayTime) {
        this.printTable.infoData[2].data[3].value = this.$options.filters['formatDate'](params.dayTime, this.typeSearchObj[params.dateType].format)
      } else {
        this.printTable.infoData[2].data[3].value = this.$options.filters['formatDate'](params.startTime, this.typeSearchObj[params.dateType].format) + ' ~ ' + this.$options.filters['formatDate'](params.endTime, this.typeSearchObj[params.dateType].format)
      }
      this.printTable.infoData[2].data[1].value = this.typeSearchObj[params.dateType].typeInfo
      this.exportExcelParams = params
      if (params.type === 'INSPECTOR' || params.type === 'RECHECK-INSPECTOR') {
        // 获取无嫌疑量
        ajax.getNoSuspectNumOfUserTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.type, params.dateType, 0)
            }
          }
        }).catch(() => {})
        // 获取有嫌疑量
        ajax.getSuspectNumOfUserTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.type, params.dateType, 1)
            }
          }
        }).catch(() => {})
      } else if (params.type === 'PHYSICAL-INSPECTOR') {
        // 获取无查获量
        ajax.getNoSeizedNumOfUserTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.type, params.dateType, 0)
            }
          }
        }).catch(() => {})
        // 获取有查获量
        ajax.getSeizedNumOfUserTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.type, params.dateType, 1)
            }
          }
        }).catch(() => {})
      } else if (params.type === 'AUDITOR') {
        // 获取稽核通过量
        ajax.getRecheckPassNumOfUserTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.type, params.dateType, 0)
            }
          }
        }).catch(() => {})
        // 获取稽核不通过量
        ajax.getRecheckNotPassNumOfUserTrend(params).then((res) => {
          if (res.data.flag) {
            let result = res.data.result
            if (result && result.items && result.items.length > 0) {
              this.commonCode(result.items, params.type, params.dateType, 1)
            }
          }
        }).catch(() => {})
      }
    },
    commonCode (items, dimensionType, dateType, dataType) {
      // 更新图表标题内容
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
      for (var i in this.dimensionSearchObj) {
        // 清零
        this.dimensionSearchObj[i].barLegend[dataType].seriesData = []
        this.dimensionSearchObj[i].barLegend[dataType].seriesData.length = len
        this.dimensionSearchObj[i].barLegend[dataType].seriesData.fill(0)
        this.dimensionSearchObj[i].lineLegend[dataType + 1].seriesData = []
        this.dimensionSearchObj[i].lineLegend[dataType + 1].seriesData.length = len
        this.dimensionSearchObj[i].lineLegend[dataType + 1].seriesData.fill(0)
        this.dimensionSearchObj[i].lineLegend[0].seriesData = []
        this.dimensionSearchObj[i].lineLegend[0].seriesData.length = len
        this.dimensionSearchObj[i].lineLegend[0].seriesData.fill(0)
        if (dimensionType === i) {
          this.dimensionSearchObj[i].barLegend[dataType].seriesData = barSeriesData
          this.dimensionSearchObj[i].lineLegend[dataType + 1].seriesData = lineSeriesData
          this.dimensionSearchObj[i].lineLegend[0].seriesData = this.dimensionSearchObj[i].lineLegend[1].seriesData.map((s, index) => {
            if (this.dimensionSearchObj[i].lineLegend[2].seriesData) {
              return s + this.dimensionSearchObj[i].lineLegend[2].seriesData[index]
            } else {
              return s
            }
          })
          this.barChartStatisticData[0].data = this.dimensionSearchObj[i].barLegend.map(item => {
            return {
              name: item.name,
              model: item.model,
              stack: item.yAxisIndex ? '' : 'Qty',
              type: item.type,
              yAxisIndex: item.yAxisIndex,
              seriesData: item.seriesData
            }
          })
          this.lineChartStatisticData[0].data = this.dimensionSearchObj[i].lineLegend.map(item => {
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
      this.tableGroup = this.tableGroupDefault.filter(item => item.dimensionType === this.formRule.model.type || item.dimensionType === 'common')
      if (date && date.length > 0) {
        let tableData = []
        let tmpArr = []
        date.forEach((item, index) => {
          let tableObj = {
            date: item,
            taskNum: 0,
            nNum: 0,
            yNum: 0
          }
          tableData.push(tableObj)
        })
        data.forEach(da => {
          tmpArr.push(da.seriesData)
        })
        tableData.forEach((item, tIndex) => {
          item.nNum = tmpArr[0] ? tmpArr[0][tIndex] : 0
          item.yNum = tmpArr[1] ? tmpArr[1][tIndex] : 0
          item.taskNum = item.nNum + item.yNum
        })
        this.tableData.data = tableData.concat(this.getAverage(tableData))
      }
    },
    getAverage (tableData) {
      let len = tableData.length
      let totalObj = {
        date: this.$t('vicenter.common.totalQty'),
        taskNum: 0,
        nNum: 0,
        yNum: 0
      }
      let aveObj = {}
      tableData.forEach(item => {
        totalObj.taskNum += item.taskNum
        totalObj.nNum += item.nNum
        totalObj.yNum += item.yNum
      })
      aveObj = {
        date: this.$t('vicenter.common.averageQty'),
        taskNum: parseFloat(Number(totalObj.taskNum / len).toFixed(2)),
        nNum: parseFloat(Number(totalObj.nNum / len).toFixed(2)),
        yNum: parseFloat(Number(totalObj.yNum / len).toFixed(2))
      }
      return [aveObj]
    },
    // 更新图表标题
    updateChartTitle () {
      let chartTitle = ''
      let titleArr = []
      titleArr.length = 3
      titleArr.fill('')
      for (let i in this.dimensionSearchObj) {
        if (this.formRule.model.type === i) {
          titleArr[0] = this.dimensionSearchObj[i].dimensionInfo
          titleArr[2] = this.dimensionSearchObj[i].chartInfo
        }
      }
      for (let i in this.typeSearchObj) {
        if (this.formRule.model.trendType === i) {
          titleArr[1] = this.typeSearchObj[i].typeInfo
        }
      }
      chartTitle = titleArr.join(this.chartTitle.symbol)
      return chartTitle
    },
    // 统计维度切换
    changeDimension () {
      // 控制查询条件是否显示
      this.searchIpt.forEach(item => {
        for (let i in this.dimensionSearchObj) {
          if (this.searchIpt[0].models === i) {
            if (item.ruleProp === this.dimensionSearchObj[i].show) {
              item.hiden = false
              item.models = item.option[0] ? item.option[0].value : ''
              this.formRule.rule[item.ruleProp] = [{ required: true, message: item.tip, trigger: 'blur' }]
            }
            if (this.dimensionSearchObj[i].hiden.indexOf(item.ruleProp) > -1) {
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
          if (this.searchIpt[5].models === i) {
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
          if (this.searchIpt[5].models === 'DEFINED') {
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
        url: '/supervise/usrTaskTrendRep/exportExcel'
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
    changePerson () {
      for (let i in this.dimensionSearchObj) {
        if (this.searchIpt[0].models === i) {
          this.$changeSelectValidateField('searchFormRef', this, this.dimensionSearchObj[i].show)
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
