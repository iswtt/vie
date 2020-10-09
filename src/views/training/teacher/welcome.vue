<template>
  <div class="teacher-welcome" v-loading="loading" >
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread"/>
    </div>
    <div class="statistic-container">
      <div class="charts">
        <div class="chartbox" @click="getTrain()">
          <div class="chart-border">
            <div class="chartTop">
              <div class="chartTitle">{{chartTitle.ChartOne}}</div>
              <el-select data-id="studentTrainingProgressTable-select" @change="trainChange" v-model="trainVal" :placeholder="$t('vicenter.common.pleaseSelcet')" size="mini" class="chartSelect">
                <el-option
                  v-for="item in trainOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div v-show="!noDataChartOne" id="ChartOne"></div>
            <div v-show="noDataChartOne" class="chartNoData">{{$t('vicenter.training.teacher.noTraining')}}</div>
          </div>
        </div>
        <div class="chartbox barChart" @click="getTest()">
          <div class="chart-border">
            <div class="chartTop">
              <div class="chartTitle">{{chartTitle.barchart}}</div>
              <el-select data-id="examinationOfStudents-select" @change="testChange" v-model="testVal" :placeholder="$t('vicenter.common.pleaseSelcet')" size="mini" class="chartSelect">
                <el-option
                  v-for="item in testOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="chartBottom">
              <div>
                <div v-show="!noDataChartTwo" id="ChartTwo"></div>
                <div v-show="noDataChartTwo" class="chartNoData">{{$t('vicenter.training.teacher.noExamination')}}</div>
              </div>
              <div>
                <div v-show="!noDataBarChart" id="barChart" @click="changeTable"></div>
                <div v-show="noDataBarChart" class="chartNoData">{{$t('vicenter.training.teacher.noExamination')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
        <div class="list" v-show="isTrain">
          <ComTable ref="studentTrainingProgressTable" :tableData='tableData' :tableGroup='tableGroup'></ComTable>
        </div>
        <div class="list" v-show="!isTrain">
          <ComTable ref="examinationOfStudentsTable" :tableData='testTableData' :tableGroup='testTableGroup'></ComTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import req from '@/api/training/teacher'
import ajaxIndex from '@/api/training/index.js'
export default {
  name: 'dashboard',
  data () {
    return {
      users: {
        'd9027755-e31d-475a-9098-276b67737f7d': [],
        '1a2dd46e-a547-4e82-b258-201bc6987a68': [],
        '402e8f51-7394-4e08-9b3c-7f27355beed7': []
      }, // upms
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Training/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {}, // 标题栏
      value: '',
      noDataChartOne: false,
      noDataChartTwo: false,
      noDataBarChart: false,
      loading: false,
      timer: null,
      chartTitle: {
        ChartOne: this.$t('vicenter.training.teacher.teacherChartOne'),
        barchart: this.$t('vicenter.training.teacher.teacherbarchart')
      },
      trainOptions: [], // 学员培训进度统计 下拉
      trainVal: '',
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        refName: 'dashboardTable',
        sortMethod: this.sort
      },
      tableGroup: [ // 表格数据列
        {
          type: 'text',
          label: this.$t('vicenter.training.common.name'),
          model: 'pcTyueName'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.account'),
          model: 'pcUserName'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.startTrainingTime'),
          model: 'traStartTime'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.lastTrainingTime'),
          model: 'traEndTime'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.trainingTimes'),
          model: 'traTime'
        },
        {
          type: 'progress',
          strokeWidth: 15,
          label: this.$t('vicenter.training.common.trainingProgress'),
          inside: false,
          model: 'traPercent'
        }
      ],
      testOptions: [], // 学员培训进度统计 下拉
      testVal: '',
      testTableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.testHandleSizeChange,
          handleCurrentChange: this.testHandleCurrentChange
        },
        refName: 'dashboardTable',
        sortMethod: this.sort
      },
      testTableGroup: [ // 表格数据列
        {
          type: 'text',
          label: this.$t('vicenter.training.common.name'),
          model: 'pcName'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.account'),
          model: 'account'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.examStartTime'),
          model: 'userExamStartTime'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.examEndTime'),
          model: 'userExamEndTime'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.examinationTimes'),
          model: 'userExamTime'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.answerNumberOfQuestions'),
          model: 'userExamTrueCount'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.correctRate'),
          model: 'userExamCorrectPercentage'
        },
        {
          type: 'text',
          label: this.$t('vicenter.training.common.examinationStatus'),
          model: 'userExamStatus'
        }
      ],
      testId: '',
      isTrain: true // true: 培训表格 false: 考试表格
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {
    // // 获取用户接口
    // Promise.all([
    //   this.findUsersByRole('d9027755-e31d-475a-9098-276b67737f7d'),
    //   this.findUsersByRole('1a2dd46e-a547-4e82-b258-201bc6987a68'),
    //   this.findUsersByRole('402e8f51-7394-4e08-9b3c-7f27355beed7')
    // ]).then(res => {
    //   let users = []
    //   users.push(this.users)
    //   this.saveUsers(users, () => {})
    // })
    // 培训数据
    this.getStatCadetProgress('', '')
    // 考试数据
    this.getTestOption()
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      // 查询条件和列表title
      this.panelTitle = {
        queryTitle: {
          title: this.chartTitle.ChartOne
        }
      }
    },
    // 根据角色获取拥有角色的用户
    findUsersByRole (roleCode) {
      // console.log(roleCode)
      let params = {}
      params.roleId = roleCode
      params.appCode = 'VICENTER'
      return new Promise(resolve => {
        ajaxIndex.findUsersByRole(params).then(res => {
          // console.log(res, roleCode)
          if (res.data.flag) {
            if (roleCode === 'd9027755-e31d-475a-9098-276b67737f7d') {
              this.users[roleCode] = res.data.result
            } else if (roleCode === '1a2dd46e-a547-4e82-b258-201bc6987a68') {
              this.users[roleCode] = res.data.result
            } else if (roleCode === '402e8f51-7394-4e08-9b3c-7f27355beed7') {
              this.users[roleCode] = res.data.result
            }
            resolve()
          }
        })
      })
    },
    // 保存用户数据
    saveUsers (strJson, callBack = Function) {
      let params = {}
      params.strJson = JSON.stringify(strJson)
      ajaxIndex.saveUsers(params).then(res => {
        console.log(res, '保存用户数据返回')
        if (res.data.flag) {
          callBack()
        }
      })
    },
    // 切换到培训
    getTrain () {
      this.isTrain = true
      this.panelTitle = {
        queryTitle: {
          title: this.chartTitle.ChartOne
        }
      }
      this.getStatCadetProgress(this.trainVal, 2)
    },
    /**
     * 学员培训进度统计
     * @param traId
     * @param type ''：图表和表格 1：图表 2：表格
     * @desc 初次加载不传traId 返回值有traInfoList 之后传traId返回值没有traInfoList
     */
    getStatCadetProgress (traId, type) {
      req.statCadetProgress({ traId, tarCreateUser: sessionStorage.getItem('userId'), page: this.tableData.page.CurrentPage, size: this.tableData.page.pagesize })
        .then(res => {
          console.log(res)
          let info = res.data.result
          // 没有traId 渲染培训下拉
          if (!traId && info.traInfoList && info.traInfoList.length) {
            this.initStatCadetProgressOption(info.traInfoList)
          }
          // 没有图表数据 只渲染表格
          if (info.progressInfoList && info.progressInfoList.length) {
            this.noDataChartOne = false
            this.$nextTick(() => {
              let yData = []
              let xData = []
              info.progressInfoList.reverse().forEach(item => {
                // yData.push(item.TRA_PERCENT)
                // xData.push(item.PC_USER_NAME)
                yData.push(item.traPercent)
                xData.push(item.pcUserName)
              })
              switch (type) {
                case 1:
                  this.initChartOne('ChartOne', xData, yData)
                  break
                case 2:
                  this.initStatCadetProgressTable(info.userConInfoList)
                  break
                case 3:
                  this.initChartOne('ChartOne', xData, yData)
                  this.initStatCadetProgressTable(info.userConInfoList)
                  break
                default:
                  this.initChartOne('ChartOne', xData, yData)
                  this.initStatCadetProgressTable(info.userConInfoList)
              }
            })
          } else {
            this.noDataChartOne = true
            this.initStatCadetProgressTable(info.userConInfoList)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 渲染学员威视考培系统 下拉
     * @param data
     */
    initStatCadetProgressOption (data) {
      this.trainVal = data[0].traId
      this.trainOptions = data.map(e => {
        return {
          value: e.traId,
          label: e.traName
        }
      })
    },
    /**
     * 渲染学员威视考培系统 table
     * @param data
     */
    initStatCadetProgressTable (data) {
      let tableData = data || {content: [], totalElements: 0}
      tableData.content.forEach(item => {
        item.traEndTime = this.$options.filters['formatDate'](item.traEndTime, this.$t('vicenter.common.formatDate'))
        item.traStartTime = this.$options.filters['formatDate'](item.traStartTime, this.$t('vicenter.common.formatDate'))
      })
      this.tableData.data = tableData.content
      if (this.tableData.data.length > 0) {
        this.tableData.isPage = true
      }
      this.tableData.page.Allpage = tableData.totalElements
    },
    /**
     * 学员培训进度统计 下拉change
     * @param e)
     */
    trainChange (e) {
      this.getStatCadetProgress(e, 3)
    },
    // 切换到考试
    getTest () {
      this.isTrain = false
      this.panelTitle = {
        queryTitle: {
          title: this.chartTitle.barchart
        }
      }
      this.getTestOption(1)
    },
    /**
     * 学员考试情况统计 table
     */
    getTestTable () {
      req.trainingDetail({ examId: this.testId, page: this.tableData.page.CurrentPage, size: this.tableData.page.pagesize })
        .then(res => {
          console.log(res)
          let tableData = res.data.result
          tableData.content.forEach(item => {
            item.userExamStartTime = this.$options.filters['formatDate'](item.userExamStartTime, this.$t('vicenter.common.formatDate')) || '-'
            item.userExamEndTime = this.$options.filters['formatDate'](item.userExamEndTime, this.$t('vicenter.common.formatDate')) || '-'
            // item.userExamStatus = ['未开始', '未及格', '及格', '缺考', '进行中'][item.userExamStatus]
            item.userExamStatus = this.$t(`vicenter.training.common.examinationStatusList2.${item.userExamStatus}`)
            item.userExamPercent = item.userExamPercent + '%'
            item.userExamCorrectPercentage = item.userExamCorrectPercentage + '%'
          })
          this.testTableData.data = tableData.content
          if (this.testTableData.data.length > 0) {
            this.testTableData.isPage = true
          }
          this.testTableData.page.Allpage = tableData.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 学员考试情况统计 option
     * @param type 有值则为点击title 不修改下拉选中值
     */
    getTestOption (type) {
      req.examListByTeacher({ pcUserId: sessionStorage.getItem('userId') })
        .then(res => {
          console.log(res)
          let info = res.data.result.examNameList
          if (info.length) {
            this.noDataChartTwo = false
            this.noDataBarChart = false
            if (!type) {
              this.testVal = info[0].examId
              this.testOptions = info.map(e => {
                return {
                  value: e.examId,
                  label: e.examName
                }
              })
              this.testId = this.testVal
            }
            this.getTestPie()
            this.getTestTable()
          } else {
            this.noDataChartTwo = true
            this.noDataBarChart = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 学员考试情况统计 line
     */
    getTestPie () {
      req.examinationCountByTeacher({ examId: this.testId, pcUserId: sessionStorage.getItem('userId') })
        .then(res => {
          console.log(res)
          let info = res.data.result
          if (!info.latestExam.length) {
            // 第三个图表没有数据
            this.noDataBarChart = true
          } else {
            this.noDataBarChart = false
            this.$nextTick(() => {
              let bar = {one: [], two: [], three: [], four: [], five: []}
              info.latestExam.reverse()
              info.latestExam.forEach(item => {
                bar.one.push(item.examName)
                bar.two.push(item.pass)
                bar.three.push(item.noPass)
                bar.four.push(item.missingExam)
                bar.five.push(parseInt(item.passingRate))
              })
              this.initBarChart('barChart', bar)
            })
          }
          if (!info.pass && !info.noPass && !info.tested && !info.notTested) {
            // 第二个图表没有数据
            this.noDataChartTwo = true
          } else {
            this.noDataChartTwo = false
            this.$nextTick(() => {
              let pAll = (info.pass + info.noPass) / 100
              let tAll = (info.tested + info.notTested) / 100
              // this.initPieChart('ChartTwo', info.noPass / pAll, info.pass / pAll, info.tested / tAll, info.notTested / tAll)
              this.initPieChart('ChartTwo', info.noPass, info.pass, info.tested, info.notTested)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 学员考试进度统计 下拉change
     * @param e
     */
    testChange (e) {
      this.testId = e
      this.getTestTable()
      this.getTestPie()
    },
    initChartOne (chartId, xData, yData) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b} <br/>{c}%'
        },
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          containLabel: true
        },
        color: ['#3aa1ff'],
        xAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
          min: 0,
          max: 100
        },
        yAxis: {
          type: 'category',
          // data: ['学员7', '学员6']
          data: xData
        },
        series: [
          {
            type: 'bar',
            // data: [20, 10]
            data: yData
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initPieChart (chartId, w1, w2, n1, n2) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: -5,
          data: [this.$t('vicenter.training.teacher.tested'), this.$t('vicenter.training.teacher.missingTest')]
        },
        color: ['#37a2da', '#ffd85c', '#fd7b5f', '#37a2da'],
        series: [
          {
            name: '',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '40%'],
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
            data: [
              // {value: w1, name: this.$t('vicenter.training.teacher.failed'), selected: true},
              {value: w1, name: this.$t('vicenter.training.teacher.failed')},
              {value: w2, name: this.$t('vicenter.training.teacher.pass')}
            ]
          },
          {
            name: '',
            type: 'pie',
            radius: ['60%', '80%'],
            label: {
              show: false
            },
            data: [
              {value: n1, name: this.$t('vicenter.training.teacher.tested')},
              {value: n2, name: this.$t('vicenter.training.teacher.missingTest')}
            ]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initBarChart (chartId, bar) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        legend: {
          data: [
            this.$t('vicenter.training.teacher.numberOfPeoplePassing'),
            this.$t('vicenter.training.teacher.numberOfPeopleNotPassing'),
            this.$t('vicenter.training.teacher.numberOfStudentsMissing'),
            this.$t('vicenter.training.teacher.passingRate')
          ],
          itemHeight: 10,
          type: 'scroll',
          bottom: -5
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b0}</br>{a0}:{c0}</br>{a1}:{c1}</br>{a2}:{c2}</br>{a3}:{c3}%'
        },
        grid: {
          top: '3%',
          bottom: '10%',
          left: '5%',
          right: 0,
          containLabel: true
        },
        color: ['#4472c4', '#ed7d31', '#a5a5a5', '#ffc000'],
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            formatter: function (value) {
              console.log('formatter -> value', value)
              return value.length > 4 ? `${value.substring(0, 4)}...` : value
            }
          },
          // data: [
          //   this.$t('vicenter.training.teacher.reviewExam'),
          //   this.$t('vicenter.training.teacher.politicalExamination'),
          //   this.$t('vicenter.training.teacher.manualExamination'),
          //   this.$t('vicenter.training.teacher.monthlyExam'),
          //   this.$t('vicenter.training.teacher.qarterlyExam'),
          //   this.$t('vicenter.training.teacher.annualExam')
          // ]
          data: bar.one
        },
        yAxis: [
          {
            type: 'value'
          },
          {
            type: 'value',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: this.$t('vicenter.training.teacher.numberOfPeoplePassing'),
            type: 'bar',
            stack: 'people',
            data: bar.two
          },
          {
            name: this.$t('vicenter.training.teacher.numberOfPeopleNotPassing'),
            type: 'bar',
            stack: 'people',
            data: bar.three
          },
          {
            name: this.$t('vicenter.training.teacher.numberOfStudentsMissing'),
            type: 'bar',
            stack: 'people',
            barGap: 50,
            barWidth: 20,
            data: bar.four
          },
          {
            name: this.$t('vicenter.training.teacher.passingRate'),
            type: 'line',
            yAxisIndex: 1,
            data: bar.five
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    // 培训table size变化
    handleSizeChange (val) {
      this.tableData.page.pagesize = val
      this.getStatCadetProgress(this.trainVal)
    },
    // 培训table 切换分页
    handleCurrentChange (val) {
      this.tableData.page.CurrentPage = val - 1
      this.getStatCadetProgress(this.trainVal)
    },
    // 考试table size变化
    testHandleSizeChange (val) {
      this.testTableData.page.pagesize = val
      this.getTestTable()
    },
    // 考试table 切换分页
    testHandleCurrentChange (val) {
      this.testTableData.page.CurrentPage = val - 1
      this.getTestTable()
    },
    // 管理员角色下点击折线图和柱状图，切换列表显示列及数据
    changeTable (flag) {}
  },
  beforeRouteLeave (to, from, next) {
    this.loading = false
    clearInterval(this.timer)
    next()
  },
  components: { ComTable, breadCrumb, panelTitle }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.teacher-welcome {
  width: $all;
  height: $all;
  padding: 15px;
  @include box-sizing();
  .statistic-container {
    height: calc(100% - 35px);
    overflow-y: scroll;
    .panel {
      @extend .extend-panel;
      margin-top:$margin
    }
    .charts {
      @include flex(row, space-between, center);
      .chartbox {
        width: calc(100%*2/6 - 10px);
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
          .chartTop {
            font-size: 14px;
            font-weight: bold;
            height: 40px;
            line-height: 40px;
            text-align: left;
            border-bottom: 1px solid #e9edf5;
            @include flex(row, space-between, center);
            @include box-sizing();
            .chartSelect{
              width: 110px;
            }
          }
          .chartBottom{
            width: $all;
            height: calc(100% - 40px);
            padding: $margin 0;
            @include box-sizing();
            @include flex(row, space-between, center);
            &>div{
              width: 40%;
              height: $all;
              border-right: 1px solid #cccccc;
              &:last-child{
                width: 60%;
                border-right: none
              }
            }
          }
          #ChartOne{
            width: $all;
            height: calc(100% - 40px);
            padding: $margin 0;
            @include box-sizing();
            canvas {
              width: $all!important;
            }
          }
          #ChartTwo,#barChart {
            width: $all;
            height: $all;
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
        width: calc(100%*4/6 - 10px);
        @include box-sizing();
      }
    }
    .list {
      width: $all;
      height: calc(100% - 420px);
      /*overflow: hidden;*/
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
