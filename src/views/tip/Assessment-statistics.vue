<template>
  <div id='Assessment-statistics-bar' v-bar>
    <div id="Assessment-statistics-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar">
            <ComForm ref="searchFormRef" :searchIpt="searchIpt" :searchFunc="searchFunc" :formRule='formRule'>
              <i class="el-icon-error clear-select2" slot="assessorSlot" @click="clearAssessor"></i>
              <i class="el-icon-error clear-select2" slot="assessmentSlot" @click="clearAssessment"></i>
            </ComForm>
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
                <div v-if="currentType === 'EXAMNAME' && isChart" :id="barChartObj.id" :style="{width: '100%', height: barChartObj.height}" :key="Math.random()"></div>
                <div v-if="currentType === 'EXAMINEE' && isChart" :id="lineChartObj.id" :style="{width: '100%', height: lineChartObj.height}" :key="Math.random()"></div>
                <ComTable v-if="currentType === 'EXAMNAME' && !isChart" :tableData="examNameTable.tableData" :tableGroup="examNameTable.tableGroup" :key="Math.random()"></ComTable>
                <ComTable v-if="currentType === 'EXAMINEE' && !isChart" :tableData="examineeTable.tableData" :tableGroup="examineeTable.tableGroup" :key="Math.random()"></ComTable>
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
import ajax from '@/api/tip/Statistics.js'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
export default {
  name: 'AssessmentStatistics',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 0,
        title: this.$t(this.$route.name),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 0,
            infoType: 'statisticConditionInfo',
            label: this.$t('vicenter.reports.common.statisticCondition')
          },
          {
            type: 'content',
            infoType: 'statisticConditionInfo',
            data: []
          },
          {
            type: 'title',
            colspan: 0,
            infoType: 'statisticDetailsInfo',
            label: this.$t('vicenter.reports.common.statisticDetails')
          },
          {
            type: 'content',
            infoType: 'statisticDetailsTitleInfo',
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
      currentType: 'EXAMNAME',
      searchIpt: [
        {
          getLabel: this.$t('vicenter.reports.common.statisticDimension'),
          type: 'select',
          models: 'EXAMNAME',
          ruleProp: 'type',
          placeHolder: '',
          option: [
            {
              value: 'EXAMNAME', // 考核名称
              label: this.$t('vicenter.tip.assessmentStatistics.examName')
            },
            {
              value: 'EXAMINEE', // 考核人员
              label: this.$t('vicenter.tip.assessmentStatistics.examinee')
            }
          ],
          change: this.changeDimension,
          KeepDefault: true, // 保留默认值
          defaultValue: 'EXAMNAME', // 默认值
          hiden: false
        },
        {
          getLabel: this.$t('vicenter.tip.assessmentStatistics.examName'),
          placeHolder: '',
          type: 'select',
          filterable: true,
          models: '',
          ruleProp: 'examParamId',
          option: [],
          KeepDefault: true,
          defaultValue: '',
          hiden: false
        },
        {
          getLabel: this.$t('vicenter.tip.assessmentStatistics.examinee'),
          placeHolder: this.$t('vicenter.tip.assessmentStatistics.examineeSelect'),
          type: 'select2',
          filterable: true,
          models: [],
          ruleProp: 'examineeId',
          option: [],
          KeepDefault: true,
          defaultValue: [],
          change: this.changeExamineeId,
          hiden: true,
          isSolt: true,
          soltName: 'assessorSlot'
        },
        {
          getLabel: this.$t('vicenter.tip.assessmentStatistics.examName'),
          placeHolder: this.$t('vicenter.tip.assessmentStatistics.examNameSelect'),
          type: 'select2',
          filterable: true,
          models: [],
          ruleProp: 'examParamIds',
          option: [],
          KeepDefault: true,
          defaultValue: [],
          change: this.changeExamParamIds,
          hiden: true,
          isSolt: true,
          soltName: 'assessmentSlot'
        },
        {
          getLabel: this.$t('vicenter.tip.assessmentStatistics.examStartTime'),
          type: 'datetimerange',
          models: [
            new Date(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString()).getTime(),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
          ],
          ruleProp: 'examStartTime',
          valueFormat: 'timestamp',
          editable: false,
          blur: this.blur,
          focus: this.focus,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          },
          KeepDefault: true,
          defaultValue: [
            new Date(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString()).getTime(),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
          ],
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
          type: 'EXAMNAME',
          examParamId: '',
          examineeId: [],
          examParamIds: [],
          examStartTime: [
            new Date(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString()).getTime(),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
          ]
        },
        refName: 'examStatisticQueryForm',
        rule: {}
      },
      defaultRule: {
        examineeId: [
          { required: true, message: this.$t('vicenter.tip.assessmentStatistics.examineeSelect'), trigger: 'change' }
        ],
        examParamIds: [
          { required: true, message: this.$t('vicenter.tip.assessmentStatistics.examNameSelect'), trigger: 'change' }
        ]
      },
      colors: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa'],
      barChartObj: {
        id: 'examNameBarChart',
        height: '500px',
        avgLineColor: '#43bdf3',
        data: {
          avgScore: '',
          items: []
        }
      },
      lineChartObj: {
        id: 'examineeLineChart',
        height: '500px'
      },
      examNameTable: {
        tableGroup: [
          {
            label: this.$t('vicenter.common.No'),
            type: 'index',
            width: ''
          },
          {
            label: this.$t('vicenter.tip.assessmentStatistics.examinee'),
            type: 'text',
            model: 'examineeAccount',
            width: ''
          },
          {
            label: this.$t('vicenter.tip.assessmentStatistics.examScore'),
            type: 'text',
            model: 'score',
            width: ''
          }
        ],
        tableData: {
          refName: 'examNameTableRef',
          data: [],
          isBorder: true,
          isStripe: true,
          isPage: false
        }
      },
      examineeTable: {
        defaultTableGroup: [
          {
            label: this.$t('vicenter.tip.assessmentStatistics.examinee'),
            type: 'text',
            model: 'examineeAccount',
            width: ''
          }
        ],
        tableGroup: [],
        tableData: {
          refName: 'examineeTableRef',
          data: [],
          isBorder: true,
          isStripe: true,
          isPage: false
        }
      },
      uploading: false,
      uploadingTxt: this.$t('vicenter.common.loading'),
      isChart: true,
      exportFileName: '',
      exportExcelParams: {},
      examAvgScore: '',
      examNameData: [],
      examineeData: []
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    // 获取考核名称、考核人员信息
    this.getOptionsInfo()
  },
  mounted () {
  },
  methods: {
    handlePrint () {
      this.initPrintInfo(true)
      let _this = this
      setTimeout(() => {
        _this.$refs.printTableRef.handlePrint()
      }, 1000)
    },
    handleExport () {
      this.initPrintInfo(false)
      this.$refs.printTableRef.handleExport()
    },
    clearAssessor () {
      this.searchIpt.forEach(item => {
        if (item.ruleProp === 'examineeId') {
          item.models = []
          this.formRule.model[item.ruleProp] = []
        }
      })
    },
    clearAssessment () {
      this.searchIpt.forEach(item => {
        if (item.ruleProp === 'examParamIds') {
          item.models = []
          this.formRule.model[item.ruleProp] = []
        }
      })
    },
    getOptionsInfo () {
      ajax.getExamName().then(res => {
        if (res.data.flag) {
          if (res.data.result && res.data.result.length > 0) {
            this.searchIpt.forEach(item => {
              if (item.ruleProp === 'examParamId' || item.ruleProp === 'examParamIds') {
                item.option = res.data.result.map(e => {
                  return {
                    label: e.examParamName,
                    value: e.examParamId
                  }
                })
                if (item.ruleProp === 'examParamId') {
                  item.models = item.option[0].value
                  item.defaultValue = item.option[0].value
                } else {
                  item.models = item.option.map(e => e.value)
                  item.defaultValue = item.option.map(e => e.value)
                }
                this.formRule.model[item.ruleProp] = item.models
              }
            })
            this.query()
          }
        }
      }).catch(() => {})
      ajax.getExaminee().then(res => {
        if (res.data.flag) {
          if (res.data.result && res.data.result.length > 0) {
            this.searchIpt.forEach(item => {
              if (item.ruleProp === 'examineeId') {
                item.option = res.data.result.map(e => {
                  return {
                    label: e.account,
                    value: e.id
                  }
                })
                item.models = item.option.map(e => e.value)
                item.defaultValue = item.option.map(e => e.value)
                this.formRule.model[item.ruleProp] = item.models
              }
            })
          }
        }
      }).catch(() => {})
    },
    query () {
      this.uploading = true
      // 处理请求参数
      let params = {}
      let {type, examParamId, examineeId, examParamIds, examStartTime} = this.formRule.model
      this.currentType = type
      if (this.currentType === 'EXAMNAME') {
        params.examParamId = examParamId
        this.exportExcelParams = params
        ajax.statisticsByExamName(params).then(res => {
          if (res.data.flag && res.data.result) {
            let { avgScore, items } = res.data.result
            if (avgScore && items && items.length > 0) {
              this.examAvgScore = avgScore
              this.examNameData = items
            } else {
              this.examAvgScore = ''
              this.examNameData = []
            }
            this.tabChartTable(false)
            this.uploading = false
          }
        }).catch(() => {})
      } else if (this.currentType === 'EXAMINEE') {
        params.examineeId = examineeId.join(',')
        params.examParamId = examParamIds.join(',')
        if (examStartTime != null && examStartTime.length === 2) {
          params.startTime = examStartTime[0]
          params.endTime = examStartTime[1]
        }
        this.exportExcelParams = params
        ajax.statisticsByExaminee(params).then(res => {
          if (res.data.flag) {
            if (res.data.result && res.data.result.length > 0) {
              this.examineeData = res.data.result
            } else {
              this.examineeData = []
            }
            this.tabChartTable(false)
            this.uploading = false
          }
        }).catch(() => {})
      }
    },
    initBar (avg, data) {
      let chartDom = document.getElementById(this.barChartObj.id)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initBar(avg, data)
        })
        return
      }
      let legendData = []
      let seriesData = []
      if (data.length > 0) {
        legendData = data.map(item => item.examineeAccount)
        seriesData = data.map((item, index) => {
          let obj = {
            name: item.examineeAccount,
            type: 'bar',
            barMaxWidth: 80,
            barGap: '100%',
            data: [item.score]
          }
          if (index === 0) {
            obj.markLine = {
              lineStyle: {
                color: this.barChartObj.avgLineColor
              },
              data: [
                {
                  yAxis: avg
                }
              ]
            }
          }
          return obj
        })
      }
      let myChart = this.$echarts.init(chartDom)
      let option = {
        title: {
          text: this.$t('vicenter.tip.assessmentStatistics.statisticByExamName'),
          textStyle: {
            fontSize: 16
          },
          top: '5%',
          left: '2%'
        },
        tooltip: {
          trigger: 'item',
          extraCssText: 'text-align: left'
        },
        legend: {
          type: 'scroll',
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: this.colors,
        xAxis: [
          {
            type: 'category'
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          top: '15%',
          bottom: '10%',
          left: '2%',
          right: '2%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initLine (data) {
      let chartDom = document.getElementById(this.lineChartObj.id)
      if (!chartDom) {
        let _this = this
        setTimeout(() => {
          _this.initLine(data)
        })
        return
      }
      let legendData = data.map(item => item.examineeAccount)
      let xAxisData = data[0].items.map(item => item.examParamName)
      let seriesData = data.map((item, index) => {
        let obj = {
          name: item.examineeAccount,
          type: 'line',
          data: item.items.map(i => i.score || null)
        }
        return obj
      })
      let myChart = this.$echarts.init(chartDom)
      let option = {
        title: {
          text: this.$t('vicenter.tip.assessmentStatistics.statisticByExaminee'),
          textStyle: {
            fontSize: 16
          },
          top: '5%',
          left: '2%'
        },
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left'
        },
        legend: {
          type: 'scroll',
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: this.colors,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: xAxisData,
            axisLabel: {
              rotate: -30
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          top: '15%',
          bottom: '10%',
          left: '2%',
          right: '2%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initExamNameTable (avg, data) {
      this.examNameTable.tableData.data = []
      if (data.length === 0) {
        return
      }
      let avgInfo = [{
        examineeAccount: this.$t('vicenter.tip.assessmentStatistics.examAvgScore'),
        score: avg
      }]
      this.examNameTable.tableData.data = data.concat(avgInfo)
    },
    initExamineeTable (data) {
      if (data.length === 0 && data[0].items.length === 0) {
        return
      }
      this.examineeTable.tableGroup = data[0].items.map((item, index) => {
        return {
          label: item.examParamName,
          type: 'text',
          model: 'examName' + index,
          width: ''
        }
      })
      this.examineeTable.tableGroup.unshift(this.examineeTable.defaultTableGroup[0])
      this.examineeTable.tableData.data = data.map((item, index) => {
        let obj = {
          examineeAccount: item.examineeAccount
        }
        item.items.forEach((item, index) => {
          obj['examName' + index] = item.score || '-'
        })
        return obj
      })
    },
    // 统计维度切换
    changeDimension () {
      this.searchIpt.forEach((item, index) => {
        if (this.searchIpt[0].models === 'EXAMNAME' && index !== 0) {
          if (index === 1) {
            item.hiden = false
          } else {
            item.hiden = true
            item.models = item.defaultValue
            this.formRule.model[item.ruleProp] = item.defaultValue
          }
          this.formRule.rule = {}
        }
        if (this.searchIpt[0].models === 'EXAMINEE' && index !== 0) {
          if (index !== 1) {
            item.hiden = false
          } else {
            item.hiden = true
            item.models = item.defaultValue
            this.formRule.model[item.ruleProp] = item.defaultValue
          }
          this.formRule.rule = this.defaultRule
        }
      })
    },
    // 图表列表切换
    tabChartTable (flag = true) {
      if (flag) {
        this.isChart = !this.isChart
      }
      let type = this.currentType
      this.currentType = ''
      this.$nextTick(() => {
        this.currentType = type
        if (this.currentType === 'EXAMNAME') {
          this.$nextTick(() => {
            this.initBar(this.examAvgScore, this.examNameData)
            this.initExamNameTable(this.examAvgScore, this.examNameData)
          })
        } else if (this.currentType === 'EXAMINEE') {
          this.$nextTick(() => {
            this.initLine(this.examineeData)
            this.initExamineeTable(this.examineeData)
          })
        }
      })
    },
    // 导出
    exportData (command) {
      // 导出文件名称
      this.exportFileName = this.$t(this.$route.name)
      if (command === 'excel') {
        this.handleExportExcel()
      } else if (command === 'pdfChart') {
        this.getPdf(document.getElementById('export-container'), this.exportFileName, false)
      } else if (command === 'pdfTable') {
        this.handleExport()
      } else if (command === 'image') {
        this.getPdf(document.getElementById('export-container'), this.exportFileName, true)
      }
    },
    handleExportExcel () {
      const {lang} = this.$store.state
      let params = {
        lang: lang,
        model: this.exportExcelParams,
        sysMenu: '',
        allDataNum: 0,
        url: ''
      }
      if (this.currentType === 'EXAMNAME') {
        params.allDataNum = this.examNameTable.tableData.data.length
        params.url = '/tip/examstatistics/exportExcelByExamParamName'
      } else {
        params.allDataNum = this.examineeTable.tableData.data.length
        params.url = '/tip/examstatistics/exportExcelByExaminee'
      }
      this.$commonExportExcel(params)
    },
    initPrintInfo (flag) {
      let infoObj = {}
      if (this.currentType === 'EXAMNAME') {
        infoObj.allColsNum = 4
        infoObj.conditionInfo = [
          {
            type: 'label',
            value: this.$t('vicenter.reports.common.statisticDimension'),
            ruleProp: 'type'
          },
          {
            type: 'text',
            value: this.$t('vicenter.tip.assessmentStatistics.examName'),
            ruleProp: 'type'
          },
          {
            type: 'label',
            value: this.$t('vicenter.tip.assessmentStatistics.examName'),
            ruleProp: 'examParamId'
          },
          {
            type: 'text',
            value: '',
            ruleProp: 'examParamId'
          }
        ]
        infoObj.detailsTitleInfo = this.examNameTable.tableGroup.map((item, index) => {
          return {
            type: 'label',
            colspan: index === 1 ? 2 : 1,
            value: item.label,
            ruleProp: item.model
          }
        })
        infoObj.detailsInfo = this.examNameTable.tableData.data.map((item, index) => {
          let rowsInfo = [
            {
              type: 'value',
              value: index + 1,
              ruleProp: ''
            },
            {
              type: 'value',
              colspan: 2,
              value: item.examineeAccount,
              ruleProp: ''
            },
            {
              type: 'value',
              value: item.score,
              ruleProp: ''
            }
          ]
          return rowsInfo
        })
      } else {
        let baseNum = 8
        let maxLen = this.examineeTable.tableGroup.length
        if (maxLen > baseNum) {
          if (flag) {
            this.$NotifPrompt(this.$t('vicenter.tip.assessmentStatistics.printLimit', {msg: 7}))
          } else {
            this.$NotifPrompt(this.$t('vicenter.tip.assessmentStatistics.exportLimit', {msg: 7}))
          }
        }
        infoObj.allColsNum = baseNum
        let titleColspan = 1
        let contentColspan = 1
        if (maxLen < baseNum) {
          // 当列表列数少于baseNum时
          contentColspan = baseNum - (maxLen - 1)
        } else if (maxLen > baseNum) {
          titleColspan = 1
        }
        infoObj.conditionInfo = [
          {
            type: 'label',
            value: this.$t('vicenter.reports.common.statisticDimension'),
            ruleProp: 'type'
          },
          {
            type: 'text',
            value: this.$t('vicenter.tip.assessmentStatistics.examinee'),
            ruleProp: 'type'
          },
          {
            type: 'label',
            value: this.$t('vicenter.tip.assessmentStatistics.examinee'),
            ruleProp: 'examineeId'
          },
          {
            type: 'text',
            value: '',
            ruleProp: 'examineeId'
          },
          {
            type: 'label',
            value: this.$t('vicenter.tip.assessmentStatistics.examName'),
            ruleProp: 'examParamIds'
          },
          {
            type: 'text',
            value: '',
            ruleProp: 'examParamIds'
          },
          {
            type: 'label',
            value: this.$t('vicenter.tip.assessmentStatistics.examStartTime'),
            ruleProp: 'examStartTime'
          },
          {
            type: 'text',
            value: '',
            colspan: titleColspan,
            ruleProp: 'examStartTime'
          }
        ]
        let tmpTableModel = []
        infoObj.detailsTitleInfo = []
        this.examineeTable.tableGroup.forEach((item, index) => {
          let obj = {}
          if (index < infoObj.allColsNum) {
            obj = {
              type: 'label',
              colspan: 1,
              value: item.label,
              ruleProp: item.model
            }
            if (item.model === 'examineeAccount') {
              obj.colspan = contentColspan
            }
            infoObj.detailsTitleInfo.push(obj)
            tmpTableModel.push(item.model)
          }
        })
        infoObj.detailsInfo = this.examineeTable.tableData.data.map((item, index) => {
          let rowsInfo = []
          for (let e in item) {
            if (e === 'examineeAccount') {
              rowsInfo.push({
                type: 'value',
                colspan: contentColspan,
                value: item[e],
                ruleProp: ''
              })
            } else {
              if (tmpTableModel.includes(e)) {
                rowsInfo.push({
                  type: 'value',
                  colspan: 1,
                  value: item[e],
                  ruleProp: ''
                })
              }
            }
          }
          return rowsInfo
        })
      }
      this.getPrintInfo(infoObj, 4)
    },
    getPrintInfo (infoObj, n) {
      let { allColsNum, conditionInfo, detailsTitleInfo, detailsInfo } = infoObj
      this.printTable.allColsNum = allColsNum
      // 前n-1行的数据是保持不变的
      this.printTable.infoData.splice(n)
      this.printTable.infoData.forEach(item => {
        if (item.type === 'title') {
          item.colspan = allColsNum
        }
        if (item.infoType === 'statisticConditionInfo' && item.type === 'content') {
          item.data = conditionInfo
        }
        if (item.infoType === 'statisticDetailsTitleInfo') {
          item.data = detailsTitleInfo
        }
      })
      detailsInfo.forEach(itemArr => {
        this.printTable.infoData.push({
          type: 'content',
          infoType: 'statisticDetailsInfo',
          data: itemArr
        })
      })
      if (this.currentType === 'EXAMNAME') {
        this.printTable.infoData[1].data[3].value = this.getSelectedLabel(this.searchIpt[1].option, this.exportExcelParams.examParamId)
      } else {
        this.printTable.infoData[1].data[3].value = this.getSelectedLabel(this.searchIpt[2].option, this.exportExcelParams.examineeId)
        this.printTable.infoData[1].data[5].value = this.getSelectedLabel(this.searchIpt[1].option, this.exportExcelParams.examParamId)
        this.printTable.infoData[1].data[7].value = this.$options.filters['formatDate'](this.exportExcelParams.startTime, this.$t('vicenter.common.formatDate')) + ' ~ ' + this.$options.filters['formatDate'](this.exportExcelParams.endTime, this.$t('vicenter.common.formatDate'))
      }
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
    changeExamineeId () {
      this.$changeSelectValidateField('searchFormRef', this, 'examineeId')
    },
    changeExamParamIds () {
      this.$changeSelectValidateField('searchFormRef', this, 'examParamIds')
    },
    resetForm () {
      setTimeout(() => {
        this.changeDimension()
      }, 100)
    },
    getSelectedLabel (option, selectedOption) {
      let labelsArr = []
      option.forEach(o => {
        if (selectedOption.split(',').indexOf(o.value) > -1) {
          labelsArr.push(o.label)
        }
      })
      return labelsArr.join(', ')
    },
    treeClick () {},
    getSort () {}
  },
  components: { bread, panelTitle, ComForm, ComTable }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#Assessment-statistics-bar {
  @extend .extend-bar;
  #Assessment-statistics-M {
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
      .clear-select2 {
        width: 12px;
        height: 12px;
        position: absolute;
        bottom: 12px;
        right: 10px;
        z-index: 100;
        color: #c1c4cc;
        background: #fff;
        cursor: pointer;
      }
      .clear-select2:hover {
        color: #909399;
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
