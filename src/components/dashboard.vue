<template>
  <div class="dashboard" v-loading="loading">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread"/>
    </div>
    <div class="statistic-container">
      <div class="todayStatistics">
        <div v-for="(item, index) in todayStatistics" :key="index">{{item.label}}: <span :class="{linkPage: item.linkPath}" :data-id="'todayStatistics'+index+'-span'" @click="handleLinkPage(item.linkPath)">{{item.value}}</span></div>
      </div>
      <div class="charts" :class="{adminCharts: isAdmin}">
        <div class="chartbox">
          <div class="chart-border">
            <div class="chartTitle">{{chartTitle.ChartOne}}</div>
            <div v-show="!noDataChartOne" id="ChartOne"></div>
            <div v-show="noDataChartOne" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
          </div>
        </div>
        <div class="chartbox" :class="{barChart: isAdmin}">
          <div class="chart-border">
            <div class="chartTitle">{{chartTitle.ChartTwo}}</div>
            <div v-show="!noDataChartTwo" id="ChartTwo"></div>
            <div v-show="noDataChartTwo" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
          </div>
        </div>
        <div class="chartbox barChart">
          <div class="chart-border">
            <div class="chartTitle">{{chartTitle.barchart}}</div>
            <div v-show="!noDataBarChart" id="barChart" @click="changeTable"></div>
            <div v-show="noDataBarChart" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
          </div>
        </div>
      </div>
      <div class="list" v-bar>
        <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import ComTable from '@/components/table'
import ajax from '@/api/common/dashboard.js'
export default {
  name: 'dashboard',
  data () {
    return {
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title)
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      isAdmin: false, // 是否为管理员
      noDataChartOne: false,
      noDataChartTwo: false,
      noDataBarChart: false,
      loading: false,
      timer: null,
      roleCode: {
        INSPECTORADMIN: 'INSPECTOR-ADMIN',
        PHYSICALADMIN: 'PHYSICAL-INSPECTOR-ADMIN',
        INSPECTOR: 'INSPECTOR',
        RECHECK: 'RECHECK-INSPECTOR',
        PHYSICAL: 'PHYSICAL-INSPECTOR',
        AUDITORADMIN: 'SUPERVISE-ADMIN',
        AUDITOR: 'AUDITOR'
      },
      todayStatistics: [],
      analysisTodayStatistics: {
        linkPath: '/Inspection/Image-Analysis',
        completeNum: this.$t('vicenter.common.dashboard.analysisQtyDay'),
        inCompleteNum: this.$t('vicenter.common.dashboard.noAnalysisQtyDay')
      },
      recheckTodayStatistics: {
        linkPath: '/Inspection/Recheck',
        completeNum: this.$t('vicenter.common.dashboard.recheckQtyDay'),
        inCompleteNum: this.$t('vicenter.common.dashboard.noRecheckQtyDay')
      },
      manualTodayStatistics: {
        linkPath: '/Inspection/Physical-Inspection',
        completeNum: this.$t('vicenter.common.dashboard.manualQtyDay'),
        inCompleteNum: this.$t('vicenter.common.dashboard.noManualQtyDay')
      },
      auditTodayStatistics: {
        linkPath: '/Supervise/Task-inspection',
        completeNum: this.$t('vicenter.common.dashboard.auditQtyDay'),
        inCompleteNum: this.$t('vicenter.common.dashboard.noAuditQtyDay')
      },
      auditAdminTodayStatistics: {
        linkPath: '/Supervise/Task-inspection',
        completeNum: this.$t('vicenter.common.dashboard.auditQtyDay'),
        inCompleteNum: this.$t('vicenter.common.dashboard.noAuditQtyDay'),
        yesterdayInCompleteNum: this.$t('vicenter.common.dashboard.noAuditQtyYestoday'),
        yesterdayCompleteNum: this.$t('vicenter.common.dashboard.auditQtyYestoday')
      },
      chartTitle: {
        ChartOne: '',
        ChartTwo: '',
        barchart: ''
      },
      analysisChartTitle: {
        ChartOne: this.$t('vicenter.common.dashboard.personalAnalysisStatisticDay'),
        ChartTwo: this.$t('vicenter.common.dashboard.totalAnalysisStatisticDay'),
        barchart: this.$t('vicenter.common.dashboard.personalAnalysisStatistic')
      },
      analysisAdminChartTitle: {
        ChartOne: this.$t('vicenter.common.dashboard.totalAnalysisStatisticDay'),
        ChartTwo: this.$t('vicenter.common.dashboard.analystTaskQtyStatistic'),
        barchart: this.$t('vicenter.common.dashboard.totalAnalysisStatistic')
      },
      recheckChartTitle: {
        ChartOne: this.$t('vicenter.common.dashboard.personalRecheckStatisticDay'),
        ChartTwo: this.$t('vicenter.common.dashboard.totalRecheckStatisticDay'),
        barchart: this.$t('vicenter.common.dashboard.personalRecheckStatistic')
      },
      manualChartTitle: {
        ChartOne: this.$t('vicenter.common.dashboard.personalManualStatisticDay'),
        ChartTwo: this.$t('vicenter.common.dashboard.totalManualStatisticDay'),
        barchart: this.$t('vicenter.common.dashboard.personalManualStatistic')
      },
      manualAdminChartTitle: {
        ChartOne: this.$t('vicenter.common.dashboard.totalManualStatisticDay'),
        ChartTwo: this.$t('vicenter.common.dashboard.inspectorTaskQtyStatistic'),
        barchart: this.$t('vicenter.common.dashboard.totalManualStatistic')
      },
      auditChartTitle: {
        ChartOne: this.$t('vicenter.common.dashboard.personalAuditStatisticDay'),
        ChartTwo: this.$t('vicenter.common.dashboard.totalAuditStatisticDay'),
        barchart: this.$t('vicenter.common.dashboard.personalAuditStatistic')
      },
      auditAdminChartTitle: {
        ChartOne: this.$t('vicenter.common.dashboard.totalAuditTaskStatisticDay'),
        ChartTwo: this.$t('vicenter.common.dashboard.auditorTaskQtyStatistic'),
        barchart: this.$t('vicenter.common.dashboard.totalAuditStatistic')
      },
      legend: [
        this.$t('vicenter.DIC.T_IMG_CHECK_CONC.C_CONC001'), // 有嫌疑 0
        this.$t('vicenter.DIC.T_IMG_CHECK_CONC.C_CONC002'), // 无嫌疑 1
        this.$t('vicenter.DIC.T_MANUAL_CHECK_CONC.C_MC001'), // 查获 2
        this.$t('vicenter.DIC.T_MANUAL_CHECK_CONC.C_MC002'), // 无查获 3
        this.$t('vicenter.common.dashboard.taskQty'), // 任务数 4
        this.$t('vicenter.common.dashboard.analysis'), // 已审图 5
        this.$t('vicenter.common.dashboard.noAnalysis'), // 未审图 6
        this.$t('vicenter.DIC.T_RECHECK_CONC.C_RC002'), // 不通过 7
        this.$t('vicenter.DIC.T_RECHECK_CONC.C_RC001'), // 通过 8
        this.$t('vicenter.common.dashboard.audit'), // 已稽核 9
        this.$t('vicenter.common.dashboard.noAudit'), // 未稽核 10
        this.$t('vicenter.common.dashboard.auditTaskQty') // 稽核任务总数 11
      ],
      color: ['#f5487a', '#52c3d1', '#56aefc', '#f79600'],
      adminColor: ['#f5497a', '#52c2d0', '#4fa9fa', '#e3e3e3', '#f79600'],
      seizedColor: ['#6fd9ff', '#375dbe', '#2190f3', '#4684d7', '#3d6cbe'],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'dashboardTable',
        sortMethod: this.sort
      },
      tableGroup: [],
      analysisTableGroup: [
        {
          label: this.$t('vicenter.common.dashboard.date'),
          type: 'text',
          model: 'date',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.analysisQty'),
          type: 'text',
          model: 'totalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.suspectQty'),
          type: 'text',
          model: 'incorrectNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSuspectQty'),
          type: 'text',
          model: 'correctNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.suspectRate'),
          type: 'text',
          model: 'incorrectRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSuspectRate'),
          type: 'text',
          model: 'correctRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.analysisAveTime'),
          type: 'text',
          model: 'timeLengthVal',
          width: ''
        }
      ],
      analysisAdminTableGroup: [
        {
          label: this.$t('vicenter.common.dashboard.date'),
          type: 'text',
          model: 'date',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.analyst'),
          type: 'text',
          model: 'user',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.analysisQty'),
          type: 'text',
          model: 'totalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.suspectQty'),
          type: 'text',
          model: 'incorrectNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSuspectQty'),
          type: 'text',
          model: 'correctNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.suspectRate'),
          type: 'text',
          model: 'incorrectRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSuspectRate'),
          type: 'text',
          model: 'correctRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.analysisAveTime'),
          type: 'text',
          model: 'timeLengthVal',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.analysisLinkAveTime'),
          type: 'text',
          model: 'linkTimeLengthVal',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.analysisQtyWeek'),
          type: 'text',
          model: 'imageNum',
          width: ''
        }
      ],
      recheckTableGroup: [
        {
          label: this.$t('vicenter.common.dashboard.date'),
          type: 'text',
          model: 'date',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.recheckQty'),
          type: 'text',
          model: 'totalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.suspectQty'),
          type: 'text',
          model: 'incorrectNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSuspectQty'),
          type: 'text',
          model: 'correctNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.suspectRate'),
          type: 'text',
          model: 'incorrectRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSuspectRate'),
          type: 'text',
          model: 'correctRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.recheckAveTime'),
          type: 'text',
          model: 'timeLengthVal',
          width: ''
        }
      ],
      manualTableGroup: [
        {
          label: this.$t('vicenter.common.dashboard.date'),
          type: 'text',
          model: 'date',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.manualQty'),
          type: 'text',
          model: 'totalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.seizedQty'),
          type: 'text',
          model: 'incorrectNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSeizedQty'),
          type: 'text',
          model: 'correctNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.seizedRate'),
          type: 'text',
          model: 'incorrectRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSeizedRate'),
          type: 'text',
          model: 'correctRate',
          width: ''
        }
      ],
      manualAdminTableGroup: [
        {
          label: this.$t('vicenter.common.dashboard.date'),
          type: 'text',
          model: 'date',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.inspector'),
          type: 'text',
          model: 'user',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.manualQty'),
          type: 'text',
          model: 'totalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.seizedQty'),
          type: 'text',
          model: 'incorrectNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSeizedQty'),
          type: 'text',
          model: 'correctNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.seizedRate'),
          type: 'text',
          model: 'incorrectRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noSeizedRate'),
          type: 'text',
          model: 'correctRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.manualQtyWeek'),
          type: 'text',
          model: 'imageNum',
          width: ''
        }
      ],
      auditTableGroup: [
        {
          label: this.$t('vicenter.common.dashboard.date'),
          type: 'text',
          model: 'date',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.auditQty'),
          type: 'text',
          model: 'totalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noPassQty'),
          type: 'text',
          model: 'incorrectNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.passQty'),
          type: 'text',
          model: 'correctNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noPassRate'),
          type: 'text',
          model: 'incorrectRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.passRate'),
          type: 'text',
          model: 'correctRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.auditAveTime'),
          type: 'text',
          model: 'timeLengthVal',
          width: ''
        }
      ],
      auditAdminTableGroup: [
        {
          label: this.$t('vicenter.common.dashboard.date'),
          type: 'text',
          model: 'date',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.auditTaskQty'),
          type: 'text',
          model: 'auditTotalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.auditor'),
          type: 'text',
          model: 'user',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.auditQty'),
          type: 'text',
          model: 'totalNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noPassQty'),
          type: 'text',
          model: 'incorrectNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.passQty'),
          type: 'text',
          model: 'correctNum',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.noPassRate'),
          type: 'text',
          model: 'incorrectRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.passRate'),
          type: 'text',
          model: 'correctRate',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.auditAveTime'),
          type: 'text',
          model: 'timeLengthVal',
          width: ''
        },
        {
          label: this.$t('vicenter.common.dashboard.auditQtyWeek'),
          type: 'text',
          model: 'imageNum',
          width: ''
        }
      ],
      statisticsByUserArr: [],
      statisticsByDayArr: []
    }
  },
  mounted () {
    this.loadPage()
    // 页面数据定时刷新
    // var _this = this
    this.timer = setInterval(() => {
      this.loadPage()
    }, window.config.boardRefreshTime)
  },
  methods: {
    // 根据不同路由路径加载对应页面和数据
    loadPage () {
      this.loading = true
      if (this.$route.path === '/Inspection/analysis-admin') {
        // 审图管理员角色
        this.isAdmin = true
        this.todayStatistics = []
        for (let i in this.analysisTodayStatistics) {
          if (i !== 'linkPath') {
            this.todayStatistics.push({
              label: this.analysisTodayStatistics[i],
              model: i,
              value: 0
            })
          }
        }
        this.chartTitle = this.analysisAdminChartTitle
        this.tableGroup = this.analysisAdminTableGroup.slice(1)
        this.$nextTick(() => {
          this.getStatisticInfo(this.roleCode.INSPECTORADMIN)
        })
        return
      }
      if (this.$route.path === '/Inspection/manual-admin') {
        // 手检管理员角色
        this.isAdmin = true
        this.todayStatistics = []
        for (let i in this.manualTodayStatistics) {
          if (i !== 'linkPath') {
            this.todayStatistics.push({
              label: this.manualTodayStatistics[i],
              model: i,
              value: 0
            })
          }
        }
        this.chartTitle = this.manualAdminChartTitle
        this.tableGroup = this.manualAdminTableGroup.slice(1)
        this.$nextTick(() => {
          this.getStatisticInfo(this.roleCode.PHYSICALADMIN)
        })
        return
      }
      if (this.$route.path === '/Inspection/analysis') {
        // 审图员角色
        this.isAdmin = false
        this.todayStatistics = []
        for (let i in this.analysisTodayStatistics) {
          if (i === 'inCompleteNum') {
            this.todayStatistics.push({
              label: this.analysisTodayStatistics[i],
              model: i,
              value: 0,
              linkPath: this.analysisTodayStatistics.linkPath
            })
          } else if (i !== 'linkPath') {
            this.todayStatistics.push({
              label: this.analysisTodayStatistics[i],
              model: i,
              value: 0
            })
          }
        }
        this.chartTitle = this.analysisChartTitle
        this.tableGroup = this.analysisTableGroup
        this.$nextTick(() => {
          this.getStatisticInfo(this.roleCode.INSPECTOR)
        })
        return
      }
      if (this.$route.path === '/Inspection/rechecks') {
        // 复核员角色
        this.isAdmin = false
        this.todayStatistics = []
        for (let i in this.recheckTodayStatistics) {
          if (i === 'inCompleteNum') {
            this.todayStatistics.push({
              label: this.recheckTodayStatistics[i],
              model: i,
              value: 0,
              linkPath: this.recheckTodayStatistics.linkPath
            })
          } else if (i !== 'linkPath') {
            this.todayStatistics.push({
              label: this.recheckTodayStatistics[i],
              model: i,
              value: 0
            })
          }
        }
        this.chartTitle = this.recheckChartTitle
        this.tableGroup = this.recheckTableGroup
        this.$nextTick(() => {
          this.getStatisticInfo(this.roleCode.RECHECK)
        })
        return
      }
      if (this.$route.path === '/Inspection/manual') {
        // 手检员角色
        this.isAdmin = false
        this.todayStatistics = []
        for (let i in this.manualTodayStatistics) {
          if (i === 'inCompleteNum') {
            this.todayStatistics.push({
              label: this.manualTodayStatistics[i],
              model: i,
              value: 0,
              linkPath: this.manualTodayStatistics.linkPath
            })
          } else if (i !== 'linkPath') {
            this.todayStatistics.push({
              label: this.manualTodayStatistics[i],
              model: i,
              value: 0
            })
          }
        }
        this.chartTitle = this.manualChartTitle
        this.tableGroup = this.manualTableGroup
        this.$nextTick(() => {
          this.getStatisticInfo(this.roleCode.PHYSICAL)
        })
        return
      }
      if (this.$route.path === '/Supervise/auditor-admin') {
        // 稽核管理员角色
        this.isAdmin = true
        this.todayStatistics = []
        for (let i in this.auditAdminTodayStatistics) {
          if (i === 'inCompleteNum') {
            this.todayStatistics.push({
              label: this.auditAdminTodayStatistics[i],
              model: i,
              value: 0,
              linkPath: this.auditAdminTodayStatistics.linkPath
            })
          } else if (i !== 'linkPath') {
            this.todayStatistics.push({
              label: this.auditAdminTodayStatistics[i],
              model: i,
              value: 0
            })
          }
        }
        this.chartTitle = this.auditAdminChartTitle
        this.tableGroup = this.auditAdminTableGroup.slice(2)
        this.$nextTick(() => {
          this.getStatisticInfo(this.roleCode.AUDITORADMIN)
        })
        return
      }
      if (this.$route.path === '/Supervise/auditor') {
        // 稽核员角色
        this.isAdmin = false
        this.todayStatistics = []
        for (let i in this.auditTodayStatistics) {
          if (i === 'inCompleteNum') {
            this.todayStatistics.push({
              label: this.auditTodayStatistics[i],
              model: i,
              value: 0,
              linkPath: this.auditTodayStatistics.linkPath
            })
          } else if (i !== 'linkPath') {
            this.todayStatistics.push({
              label: this.auditTodayStatistics[i],
              model: i,
              value: 0
            })
          }
        }
        this.chartTitle = this.auditChartTitle
        this.tableGroup = this.auditTableGroup
        this.$nextTick(() => {
          this.getStatisticInfo(this.roleCode.AUDITOR)
        })
      }
    },
    // ajax获取统计数据
    getStatisticInfo (role) {
      if (role === this.roleCode.INSPECTORADMIN) {
        ajax.imageCheckAdminBoard().then(res => {
          if (res.data.flag) {
            this.ajaxAdminData(res.data.result, role)
          } else {
            this.noDataChartOne = true
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
          this.loading = false
        }).catch(() => {})
      } else if (role === this.roleCode.PHYSICALADMIN) {
        ajax.physicalInspectionAdminBoard().then(res => {
          if (res.data.flag) {
            this.ajaxAdminData(res.data.result, role)
          } else {
            this.noDataChartOne = true
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
          this.loading = false
        }).catch(() => {})
      } else if (role === this.roleCode.INSPECTOR) {
        ajax.imageAnalystBoard().then(res => {
          if (res.data.flag) {
            this.ajaxData(res.data.result, role)
          } else {
            this.noDataChartOne = true
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
          this.loading = false
        }).catch(() => {})
      } else if (role === this.roleCode.RECHECK) {
        ajax.imageRecheckAnalystBoard().then(res => {
          if (res.data.flag) {
            this.ajaxData(res.data.result, role)
          } else {
            this.noDataChartOne = true
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
          this.loading = false
        }).catch(() => {})
      } else if (role === this.roleCode.PHYSICAL) {
        ajax.physicalInspectorBoard().then(res => {
          if (res.data.flag) {
            this.ajaxData(res.data.result, role)
          } else {
            this.noDataChartOne = true
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
          this.loading = false
        }).catch(() => {})
      } else if (role === this.roleCode.AUDITORADMIN) {
        ajax.auditorAdminBoard().then(res => {
          if (res.data.flag) {
            this.ajaxAdminData(res.data.result, role)
          } else {
            this.noDataChartOne = true
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
          this.loading = false
        }).catch(() => {})
      } else if (role === this.roleCode.AUDITOR) {
        ajax.auditorBoard().then(res => {
          if (res.data.flag) {
            this.ajaxData(res.data.result, role)
          } else {
            this.noDataChartOne = true
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
          this.loading = false
        }).catch(() => {})
      }
    },
    // 根据不同角色处理获取的统计数据
    ajaxData (result, role) {
      if (!result || (!result.todayStatistics && !result.statisticsByDay)) {
        this.noDataChartOne = true
        this.noDataChartTwo = true
        this.noDataBarChart = true
        return
      }
      let { todayStatistics, statisticsByDay } = result
      // 加载当日统计数据
      this.todayStatistics.forEach(e => {
        e.value = todayStatistics[e.model]
      })
      // 处理柱状图统计数据
      let incorrectNumArr = []
      let correctArr = []
      let totalArr = []
      statisticsByDay.forEach((item, index) => {
        incorrectNumArr.unshift(item.incorrectNum)
        correctArr.unshift(item.correctNum)
        totalArr.unshift(item.totalNum)
      })
      // 处理其他图表统计数据
      let pieOneData = []
      let pieTwoData = []
      let barData = []
      if (role === this.roleCode.INSPECTOR) {
        pieOneData = [
          {
            name: this.legend[0],
            value: todayStatistics.incorrectNum
          },
          {
            name: this.legend[1],
            value: todayStatistics.correctNum
          }
        ]
        pieTwoData = [
          {
            name: this.legend[0],
            value: todayStatistics.allIncorrectNum
          },
          {
            name: this.legend[1],
            value: todayStatistics.allCorrectNum
          }
        ]
        barData = [
          {
            name: this.legend[0],
            type: 'bar',
            data: incorrectNumArr
          },
          {
            name: this.legend[1],
            type: 'bar',
            data: correctArr
          },
          {
            name: this.legend[4],
            type: 'line',
            data: totalArr
          }
        ]
      } else if (role === this.roleCode.RECHECK) {
        pieOneData = [
          {
            name: this.legend[0],
            value: todayStatistics.incorrectNum
          },
          {
            name: this.legend[1],
            value: todayStatistics.correctNum
          }
        ]
        pieTwoData = [
          {
            name: this.legend[0],
            value: todayStatistics.allIncorrectNum
          },
          {
            name: this.legend[1],
            value: todayStatistics.allCorrectNum
          }
        ]
        barData = [
          {
            name: this.legend[0],
            type: 'bar',
            data: incorrectNumArr
          },
          {
            name: this.legend[1],
            type: 'bar',
            data: correctArr
          },
          {
            name: this.legend[4],
            type: 'line',
            data: totalArr
          }
        ]
      } else if (role === this.roleCode.PHYSICAL) {
        pieOneData = [
          {
            name: this.legend[2],
            value: todayStatistics.incorrectNum
          },
          {
            name: this.legend[3],
            value: todayStatistics.correctNum
          }
        ]
        pieTwoData = [
          {
            name: this.legend[2],
            value: todayStatistics.allIncorrectNum
          },
          {
            name: this.legend[3],
            value: todayStatistics.allCorrectNum
          }
        ]
        barData = [
          {
            name: this.legend[2],
            type: 'bar',
            data: incorrectNumArr
          },
          {
            name: this.legend[3],
            type: 'bar',
            data: correctArr
          },
          {
            name: this.legend[4],
            type: 'line',
            data: totalArr
          }
        ]
      } else if (role === this.roleCode.AUDITOR) {
        pieOneData = [
          {
            name: this.legend[7],
            value: todayStatistics.incorrectNum
          },
          {
            name: this.legend[8],
            value: todayStatistics.correctNum
          }
        ]
        pieTwoData = [
          {
            name: this.legend[7],
            value: todayStatistics.allIncorrectNum
          },
          {
            name: this.legend[8],
            value: todayStatistics.allCorrectNum
          }
        ]
        barData = [
          {
            name: this.legend[7],
            type: 'bar',
            data: incorrectNumArr
          },
          {
            name: this.legend[8],
            type: 'bar',
            data: correctArr
          },
          {
            name: this.legend[4],
            type: 'line',
            data: totalArr
          }
        ]
      }
      // 加载图表数据
      this.initPieChart('ChartOne', pieOneData)
      this.initPieChart('ChartTwo', pieTwoData)
      this.initBarChart('barChart', barData)
      // 加载表格数据
      this.getList(statisticsByDay)
    },
    // 根据不同管理员角色处理获取的统计数据
    ajaxAdminData (result, role) {
      if (!result || (!result.todayStatistics && !result.statisticsByDay && !result.statisticsByUser)) {
        this.noDataChartOne = true
        this.noDataChartTwo = true
        this.noDataBarChart = true
        return
      }
      if (!result.statisticsByUser) {
        this.noDataChartTwo = true
      }
      let { todayStatistics, statisticsByDay, statisticsByUser } = result
      this.statisticsByDayArr = statisticsByDay
      if (statisticsByUser) {
        this.statisticsByUserArr = statisticsByUser
        this.statisticsByUserArr.reverse()
      } else {
        this.statisticsByUserArr = []
      }
      // 加载当日统计数据
      this.todayStatistics.forEach(e => {
        e.value = todayStatistics[e.model]
      })
      // 处理柱状图统计数据
      let incorrectNumArr = []
      let correctArr = []
      let totalArr = []
      let auditTotalTaskArr = []
      this.statisticsByDayArr.forEach((item, index) => {
        incorrectNumArr.unshift(item.incorrectNum)
        correctArr.unshift(item.correctNum)
        totalArr.unshift(item.totalNum)
        auditTotalTaskArr.unshift(item.auditTotalNum)
      })
      // 处理折线图统计数据
      let lineDataArr = []
      let arr = [] // 按照第0天到第6天的顺序保存所有人员的信息
      let users = [] // 保存所有统计人员
      if (this.statisticsByUserArr.length > 0) {
        this.statisticsByUserArr.forEach(item => {
          arr = arr.concat(item.statistics)
          item.statistics.forEach(e => {
            if (users.indexOf(e.user) === -1) {
              users.push(e.user)
            }
          })
        })
      }
      // 根据不同人员的账号找到对应人员的7天信息
      users.forEach(user => {
        let userInfoobj = {
          name: '',
          value: []
        }
        arr.forEach(item => {
          if (item.user === user) {
            userInfoobj.name = item.user
            userInfoobj.value.push(item.totalNum)
          }
        })
        lineDataArr.push(userInfoobj)
      })
      // 处理其他图表统计数据
      let circleData = []
      let lineData = []
      let barData = []
      let colors = []
      if (role === this.roleCode.INSPECTORADMIN) {
        circleData = [
          {
            name: this.legend[0],
            position: 'inner',
            value: todayStatistics.allIncorrectNum
          },
          {
            name: this.legend[1],
            position: 'inner',
            value: todayStatistics.allCorrectNum
          },
          {
            name: this.legend[5],
            position: 'outer',
            value: todayStatistics.completeNum
          },
          {
            name: this.legend[6],
            position: 'outer',
            value: todayStatistics.inCompleteNum
          }
        ]
        lineData = lineDataArr
        barData = [
          {
            name: this.legend[0],
            type: 'bar',
            data: incorrectNumArr
          },
          {
            name: this.legend[1],
            type: 'bar',
            data: correctArr
          },
          {
            name: this.legend[4],
            type: 'line',
            data: totalArr
          }
        ]
        this.initCircleChart('ChartOne', circleData)
        this.initLineChart('ChartTwo', lineData)
        this.initBarChart('barChart', barData)
      } else if (role === this.roleCode.PHYSICALADMIN) {
        let _colors = []
        colors = ['#f5497a', '#52c2d0']
        circleData = [
          {
            name: this.legend[2],
            position: 'outer',
            value: todayStatistics.allIncorrectNum
          },
          {
            name: this.legend[3],
            position: 'outer',
            value: todayStatistics.allCorrectNum
          }
        ]
        if (todayStatistics.seizedObjects && todayStatistics.seizedObjects.length > 0) {
          todayStatistics.seizedObjects.forEach(e => {
            circleData.unshift({
              name: this.$t(e.seizedType),
              position: 'inner',
              value: e.seizedQty
            })
          })
          // 获取颜色值
          // let randomColor = this.$color16(todayStatistics.seizedObjects.length)
          let randomColor = this.seizedColor.splice(0, todayStatistics.seizedObjects.length)
          _colors = [...randomColor, ...colors]
        } else {
          _colors = [...colors]
        }
        lineData = lineDataArr
        barData = [
          {
            name: this.legend[2],
            type: 'bar',
            data: incorrectNumArr
          },
          {
            name: this.legend[3],
            type: 'bar',
            data: correctArr
          },
          {
            name: this.legend[4],
            type: 'line',
            data: totalArr
          }
        ]
        this.initCircleChart('ChartOne', circleData, _colors)
        this.initLineChart('ChartTwo', lineData)
        this.initBarChart('barChart', barData)
      } else if (role === this.roleCode.AUDITORADMIN) {
        circleData = [
          {
            name: this.legend[7],
            position: 'inner',
            value: todayStatistics.allIncorrectNum
          },
          {
            name: this.legend[8],
            position: 'inner',
            value: todayStatistics.allCorrectNum
          },
          {
            name: this.legend[9],
            position: 'outer',
            value: todayStatistics.completeNum
          },
          {
            name: this.legend[10],
            position: 'outer',
            value: todayStatistics.inCompleteNum
          }
        ]
        lineData = lineDataArr
        barData = [
          {
            name: this.legend[7],
            type: 'bar',
            data: incorrectNumArr
          },
          {
            name: this.legend[8],
            type: 'bar',
            data: correctArr
          },
          {
            name: this.legend[4],
            type: 'line',
            data: totalArr
          },
          {
            name: this.legend[11],
            type: 'line',
            data: auditTotalTaskArr
          }
        ]
        this.initCircleChart('ChartOne', circleData)
        this.initLineChart('ChartTwo', lineData)
        this.initBarChart('barChart', barData)
      }
      // 加载表格数据(默认加载当天的人员统计数据)
      if (this.statisticsByUserArr.length > 0) {
        this.getList(this.statisticsByUserArr[this.statisticsByUserArr.length - 1].statistics)
      }
    },
    // 处理列表数据
    getList (data) {
      let len = data.length
      this.tableData.data = []
      this.tableData.data = [...data]
      let auditTotalTaskNum = 0
      let allTotalNumWeek = 0
      let allTotalNum = 0
      let allIncorrectNum = 0
      let allCorrectNum = 0
      let allTimeLength = 0
      let allLinkTimeLength = 0
      data.forEach(e => {
        auditTotalTaskNum += e.auditTotalNum || 0
        allTotalNumWeek += e.imageNum || 0
        allTotalNum += e.totalNum || 0
        allIncorrectNum += e.incorrectNum || 0
        allCorrectNum += e.correctNum || 0
        allTimeLength += e.timeLength || 0
        allLinkTimeLength += e.linkTimeLength || 0
      })
      // 平均值计算
      this.tableData.data.push({
        date: this.$t('vicenter.common.dashboard.averageQty'),
        user: this.$t('vicenter.common.dashboard.averageQty'),
        auditTotalNum: Math.round(auditTotalTaskNum / len),
        imageNum: Math.round(allTotalNumWeek / len),
        totalNum: Math.round(allTotalNum / len),
        incorrectNum: Math.round(allIncorrectNum / len),
        correctNum: Math.round(allCorrectNum / len),
        timeLength: Math.round(allTimeLength / len),
        linkTimeLength: Math.round(allLinkTimeLength / len)
      })
      this.tableData.data.forEach(e => {
        e.incorrectRate = e.totalNum ? Math.round((e.incorrectNum / e.totalNum) * 100) + '%' : '0%'
        e.correctRate = e.totalNum ? Math.round((e.correctNum / e.totalNum) * 100) + '%' : '0%'
        e.timeLengthVal = e.timeLength ? `${parseInt(e.timeLength / 60)}${this.$t('vicenter.common.dashboard.minute')}${parseInt(e.timeLength % 60)}${this.$t('vicenter.common.dashboard.second')}` : `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
        e.linkTimeLengthVal = e.linkTimeLength ? `${parseInt(e.linkTimeLength / 60)}${this.$t('vicenter.common.dashboard.minute')}${parseInt(e.linkTimeLength % 60)}${this.$t('vicenter.common.dashboard.second')}` : `0${this.$t('vicenter.common.dashboard.minute')}0${this.$t('vicenter.common.dashboard.second')}`
      })
    },
    // 初始化饼图
    initPieChart (chartId, pieData, colors) {
      let legendData = []
      let seriesData = []
      pieData.forEach(e => {
        legendData.push({
          icon: 'circle',
          name: e.name
        })
        seriesData.push(
          {
            name: e.name,
            value: e.value
          }
        )
      })
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          position: function (pos, params, dom, rect, size) { // 设置提示框位置
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
            var obj = {top: 60}
            obj[[ 'left', 'right' ][ +(pos[0] < size.viewSize[0] / 2) ]] = 30
            return obj
          }
        },
        legend: {
          show: true,
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: colors || this.color,
        series: [
          {
            type: 'pie',
            radius: '72%',
            center: ['50%', '45%'],
            selectedMode: 'single',
            data: seriesData
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 初始化柱状图
    initBarChart (chartId, barData, colors) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let legendData = []
      let seriesData = []
      barData.forEach(e => {
        if (e.type === 'bar') {
          legendData.push({
            icon: 'circle',
            name: e.name
          })
          seriesData.push(e)
        } else {
          legendData.push({
            name: e.name
          })
          seriesData.push({
            name: e.name,
            type: e.type,
            label: {
              show: true,
              distance: 2
            },
            data: e.data
          })
        }
      })
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left'
        },
        legend: {
          show: true,
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: colors || this.color,
        xAxis: [
          {
            type: 'category',
            data: this.$get7day(), // 获取一周的日期
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          top: '7%',
          bottom: '12%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 初始化环状图
    initCircleChart (chartId, circleData, colors) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let legendData = []
      let seriesData = [
        {
          data: []
        },
        {
          data: []
        }
      ]
      circleData.forEach(e => {
        if (e.position === 'outer') {
          legendData.push({
            name: e.name,
            icon: 'circle'
          })
          seriesData[1].data.push({
            value: e.value,
            name: e.name
          })
        } else if (e.position === 'inner') {
          seriesData[0].data.push({
            value: e.value ? e.value : null, // 为数据为0时隐藏
            name: e.name,
            label: {
              normal: {
                show: e.value !== 0 && e.value !== null && e.value !== undefined
              }
            }
          })
        }
      })
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          show: true,
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: colors || this.adminColor,
        series: [
          {
            name: '',
            type: 'pie',
            selectedMode: 'single',
            radius: ['0%', '50%'],
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesData[0].data
          },
          {
            name: '',
            type: 'pie',
            radius: ['60%', '77%'],
            label: {
              show: false
            },
            data: seriesData[1].data
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 初始化折线图
    initLineChart (chartId, lineData, colors) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let legendData = []
      let seriesData = []
      lineData.forEach(e => {
        legendData.push(e.name)
        seriesData.push(
          {
            name: e.name,
            type: 'line',
            data: e.value
          }
        )
      })
      let option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'text-align: left'
        },
        legend: {
          selectedMode: false,
          show: true,
          bottom: 5,
          left: 'center',
          data: legendData
        },
        color: colors || this.adminColor,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.$get7day() // 获取一周的日期
          }
        ],
        yAxis: {
          type: 'value'
        },
        grid: {
          top: '7%',
          bottom: '12%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        series: seriesData
      }
      myChart.setOption(option)
      let _this = this
      myChart.getZr().on('click', function (params) {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          // 切换列表显示列
          if (_this.$route.path === '/Inspection/analysis-admin') {
            _this.tableGroup = _this.analysisAdminTableGroup.slice(1)
          }
          if (_this.$route.path === '/Inspection/manual-admin') {
            _this.tableGroup = _this.manualAdminTableGroup.slice(1)
          }
          if (_this.$route.path === '/Supervise/auditor-admin') {
            _this.tableGroup = _this.auditAdminTableGroup.slice(2)
          }
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          // 当前点击的日期序号[0-6]
          var xIndex = pointInGrid[0]
          // 加载所选天的人员统计数据
          _this.getList(_this.statisticsByUserArr[xIndex].statistics)
          // 高亮显示选中数据
          // myChart.dispatchAction({
          //   type: 'highlight',
          //   dataIndex: xIndex
          // })
        }
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 管理员角色下点击折线图和柱状图，切换列表显示列及数据
    changeTable (flag) {
      if (this.$route.path === '/Inspection/analysis-admin') {
        this.tableGroup = this.analysisAdminTableGroup.slice(0, 1).concat(this.analysisAdminTableGroup.slice(2, this.analysisAdminTableGroup.length - 1))
        this.getList(this.statisticsByDayArr)
      }
      if (this.$route.path === '/Inspection/manual-admin') {
        this.tableGroup = this.manualAdminTableGroup.slice(0, 1).concat(this.manualAdminTableGroup.slice(2, this.manualAdminTableGroup.length - 1))
        this.getList(this.statisticsByDayArr)
      }
      if (this.$route.path === '/Supervise/auditor-admin') {
        this.tableGroup = this.auditAdminTableGroup.slice(0, 2).concat(this.auditAdminTableGroup.slice(3, this.auditAdminTableGroup.length - 1))
        this.getList(this.statisticsByDayArr)
      }
    },
    // 跳转页面
    handleLinkPage (linkPath) {
      if (linkPath) {
        this.$router.push({
          path: linkPath
        })
      }
    },
    sort () {}
  },
  destroyed () {
    clearInterval(this.timer)
  },
  beforeRouteLeave (to, from, next) {
    this.loading = false
    next()
  },
  components: { ComTable, breadCrumb }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.dashboard {
  width: $all;
  height: $all;
  padding: 15px;
  @include box-sizing();
  .statistic-container {
    height: calc(100% - 35px);
    .todayStatistics {
      width: $all;
      height: 20px;
      @include flex(row, flex-start, center);
      div {
        margin-right: 20px;
        .linkPage {
          color: blue;
          cursor: pointer;
        }
      }
    }
    .charts {
      @include flex(row, space-between, center);
      .chartbox {
        width: calc(100%*2/7 - 10px);
        margin: 10px 5px 0;
        background-color: #f7fafd;
        height: 320px;
        .chart-border {
          margin: 8px;
          padding: 0 10px;
          width: calc(100% - 16px);
          height: calc(100% - 16px);
          border: 1px solid #e9edf5;
          border-radius: 10px;
          @include box-sizing();
          background-color: $white;
          .chartTitle {
            font-size: 14px;
            font-weight: bold;
            height: 40px;
            line-height: 40px;
            text-align: left;
            border-bottom: 1px solid #e9edf5;
            @include box-sizing();
          }
          #ChartOne,#ChartTwo,#barChart {
            width: $all;
            height: calc(100% - 40px);
            canvas {
              width: $all!important;
            }
          }
          .chartNoData {
            width: $all;
            height: calc(100% - 40px);
            @include flex(row, center, center);
            color: #909399;
            font-size: 14px;
          }
        }
      }
      .barChart {
        width: calc(100%*3/7 - 10px);
        @include box-sizing();
      }
    }
    .adminCharts {
      .chartbox {
        width: calc(100%*1/5 - 10px);
      }
      .barChart {
        width: calc(100%*2/5 - 10px);
      }
    }
    .list {
      width: $all;
      height: calc(100% - 420px);
      overflow: hidden;
      .el-table {
        td,th {
          padding: 10px 0;
        }
      }
    }
    @media screen and (min-height: 1000px) {
      .charts {
        .chartbox {
          height: 380px;
        }
      }
    }
  }
}
</style>
