<template>
  <div class='examinationMsg-bar' v-bar>
    <div class="examinationMsg-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button data-id="close-btn" size="mini" @click='handleClose'>{{$t('vicenter.common.back')}}</el-button>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.basicTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <div class="exercise">
              <table class="exercise-top" data-id="basicInformation-table">
                <tr v-for="(tmpA, i) in exameData" :key="i">
                  <td v-for="(tmpB, ii) in tmpA" :key="ii">
                    <table class="exercise-top-table" :data-id="tmpB.ruleProp + '-table'">
                      <tr>
                        <td>{{tmpB.label}}</td>
                        <td>{{tmpB.models}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.statisticsTitle"></panelTitle>
          <div class="form-bar">
            <div class="charts">
              <div class="chartbox">
                <div class="chart-border">
                  <div class="chartTop">
                    <div class="chartTitle">{{chartTitle.ChartOne}}</div>
                  </div>
                  <div v-show="!noDataChartOne" id="ChartOne"></div>
                  <div v-show="noDataChartOne" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
                </div>
              </div>
              <div class="chartbox">
                <div class="chart-border">
                  <div class="chartTop">
                    <div class="chartTitle">{{chartTitle.ChartTwo}}</div>
                  </div>
                  <div v-show="!noDataChartTwo" id="ChartTwo"></div>
                  <div v-show="noDataChartTwo" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
                </div>
              </div>
            </div>
            <div class="charts">
              <div class="chartbox barChart">
                <div class="chart-border">
                  <div class="chartTop">
                    <div class="chartTitle">{{chartTitle.barchart}}</div>
                  </div>
                  <div v-show="!noDataBarChart" id="barChart" @click="changeTable"></div>
                  <div v-show="noDataBarChart" class="chartNoData">{{$t('vicenter.common.nodata')}}</div>
                </div>
              </div>
            </div>
            <div class="charts">
              <div class="chartbox barTable">
                <div class="chart-border">
                  <div class="chartTop">
                    <div class="chartTitle">{{chartTitle.ChartFour}}</div>
                  </div>
                  <ComTable ref="studentExamTable" @listenToSelectDataEvent='selectRow' :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData" v-if="modalData.flag" class="formDialog">
        <Exercise data-id="detailExercise" :testListData="testList" :testImgData="testImg" :params="exerciseParams"></Exercise>
      </Dialog>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import Exercise from '@/components/training/exercise'
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajax from '@/api/training/teacher.js'
export default {
  name: 'demo',
  data () {
    return {
      titleBread: {}, // 面包屑
      modalData: {
        flag: false,
        width: '65%',
        title: this.$t('vicenter.training.common.answerPreview')
      },
      noDataChartOne: false,
      noDataChartTwo: false,
      noDataBarChart: false,
      loading: false,
      timer: null,
      chartTitle: {
        ChartOne: this.$t('vicenter.training.teacher.examNumberStatistics'),
        ChartTwo: this.$t('vicenter.training.teacher.examinationPassRateStatistics'),
        barchart: this.$t('vicenter.training.teacher.testScoreStatistics'),
        ChartFour: this.$t('vicenter.training.teacher.studentExamDetails')
      },
      panelTitle: {}, // 标题栏
      exameIpt: [ // 基础信息
        {
          models: '',
          ruleProp: 'examName'
        },
        {
          models: '',
          ruleProp: 'testListName'
        },
        {
          models: '',
          ruleProp: 'testListCount'
        },
        {
          models: '',
          ruleProp: 'testListPassCount'
        },
        {
          // valueFormat: 'yyyy-MM-dd hh:mm:ss',
          type: 'datetime',
          models: '',
          ruleProp: 'examStartTime'
        },
        {
          // valueFormat: 'yyyy-MM-dd hh:mm:ss',
          type: 'datetime',
          models: '',
          ruleProp: 'examEndTime'
        },
        {
          models: '',
          ruleProp: 'examStatus'
        },
        {
          models: '',
          ruleProp: 'examAddr'
        },
        {
          models: '',
          ruleProp: 'examDesc'
        },
        {
          models: '',
          ruleProp: 'traName'
        },
        {
          models: '',
          ruleProp: 'pcName'
        },
        {
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
          type: 'datetime',
          models: '',
          ruleProp: 'examCreateTime'
        }
      ],
      exameData: [],
      testList: [
        {
          models: '',
          ruleProp: 'pcName'
        },
        {
          models: '',
          ruleProp: 'account'
        },
        {
          models: '',
          ruleProp: 'userExamTrueCount'
        },
        {
          models: '',
          ruleProp: 'userExamCorrectPercentage'
        },
        {
          models: '',
          ruleProp: 'userExamTime'
        },
        {
          models: '',
          ruleProp: 'userExamStatus'
        }
      ], // 考试数据
      testImg: [], // 试题数据
      tableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.training.common.name'),
          type: 'text',
          model: 'pcName'
        },
        {
          label: this.$t('vicenter.training.common.account'),
          type: 'text',
          model: 'account'
        },
        {
          label: this.$t('vicenter.training.common.examStartTime'),
          type: 'text',
          model: 'userExamStartTime'
        },
        {
          label: this.$t('vicenter.training.common.examEndTime'),
          type: 'text',
          model: 'userExamEndTime'
        },
        {
          label: this.$t('vicenter.training.common.examinationTimes'),
          type: 'text',
          model: 'userExamTime'
        },
        {
          label: this.$t('vicenter.training.common.answerNumberOfQuestions'),
          type: 'text',
          model: 'userExamTrueCount'
        },
        {
          label: this.$t('vicenter.training.common.correctRate'),
          type: 'text',
          model: 'userExamCorrectPercentage'
        },
        {
          label: this.$t('vicenter.training.common.examinationStatus'),
          type: 'text',
          model: 'userExamStatus'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false
      },
      operationA: [
        {
          func: this.getDetail, // 详情
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          title: this.$t('vicenter.common.detail'),
          show: true
        }
      ],
      operationB: [
        {
          label: `<span class='iconfont editTable'>-</span>`,
          title: '',
          show: true
        }
      ],
      exerciseParams: { // exercise子组件参数
        colSpan: 2, // 图像分几列
        exerciseType: 2, // Exercise组件类型1：老师答案 2：学员答题结果
        isExerciseRight: false, // 是否有计时
        isAnswer: false, // 是否答题
        isExamRecord: true // 是否显示考试结果
      },
      examId: '', // 考试主键
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {
    this.loadPage()
    // 页面数据定时刷新
    // this.timer = setInterval(() => {
    //   this.loadPage()
    // }, window.config.boardRefreshTime)
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      // console.log(this.$route)
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            // path: '/Training/teacher/index' // 跳转路径
            path: '/Training/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      }
      // 查询条件和列表title
      this.panelTitle = {
        basicTitle: {
          title: this.$t('vicenter.training.common.basicInformation')
        },
        statisticsTitle: {
          title: this.$t('vicenter.training.common.statisticsTitle')
        }
      }
      // 基础信息
      this.exameIpt.forEach((e) => {
        if (e.ruleProp === 'examName') {
          e.label = this.$t('vicenter.training.common.testName')
        } else if (e.ruleProp === 'testListName') {
          e.label = this.$t('vicenter.training.common.testPaperName')
        } else if (e.ruleProp === 'testListCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.ruleProp === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        } else if (e.ruleProp === 'examStartTime') {
          e.label = this.$t('vicenter.training.common.examStartTime')
        } else if (e.ruleProp === 'examEndTime') {
          e.label = this.$t('vicenter.training.common.examEndTime')
        } else if (e.ruleProp === 'examStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        } else if (e.ruleProp === 'examAddr') {
          e.label = this.$t('vicenter.training.common.examinationVenue')
        } else if (e.ruleProp === 'examDesc') {
          e.label = this.$t('vicenter.training.common.examNotes')
        } else if (e.ruleProp === 'traName') {
          e.label = this.$t('vicenter.training.common.associatedTraining')
        } else if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.ruleProp === 'examCreateTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        } else if (e.ruleProp === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.testList.forEach((e) => {
        if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'account') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'userExamTrueCount') {
          e.label = this.$t('vicenter.training.common.answerNumberOfQuestions')
        } else if (e.ruleProp === 'userExamCorrectPercentage') {
          e.label = this.$t('vicenter.training.common.correctRate')
        } else if (e.ruleProp === 'userExamTime') {
          e.label = this.$t('vicenter.training.common.examinationTimes')
        } else if (e.ruleProp === 'userExamStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        }
      })
    },
    // 根据不同路由路径加载对应页面和数据
    loadPage () {
      this.loading = false
      let examId = sessionStorage.getItem('examId')
      this.examId = examId
      this.countExam()
    },
    // 考试统计
    countExam () {
      if (this.examId) {
        this.openLoading()
        ajax.countExam({examId: this.examId}).then(res => {
          console.log(res.data.result, '考试统计返回')
          this.closeLoading()
          if (res.data.flag) {
            let {exam, failed, pass, processing, unprocessed, traName, testListInfo, userExamInfo} = res.data.result
            // console.log(userExamInfo)
            if (String(exam.examStatus)) {
              exam.examStatus = this.$t(`vicenter.training.common.examinationStatusList.${exam.examStatus}`)
            }
            let exameIpt = {} // 总信息
            exameIpt.traName = traName
            let testList
            if (testListInfo) {
              testList = testListInfo[0]
            }
            Object.assign(exameIpt, testList, exam) // testList：试卷， exam：考试
            // 基本信息
            this.$initSearchIpt(this.exameIpt, exameIpt)
            let _time = ['examStartTime', 'examEndTime', 'examCreateTime']
            this.exameIpt.forEach(item => {
              if (_time.indexOf(item.ruleProp) !== -1) {
                item.models = this.$options.filters['formatDate'](new Date(item.models).getTime(), this.$t('vicenter.common.formatDate'))
              }
            })
            this.exameData = this.twoDimensionalArray(this.exameIpt, 2)
            // 学员考试明细表格
            this.tableData.data = userExamInfo
            this.tableData.data.forEach(item => {
              item.userExamCorrectPercentage = item.userExamCorrectPercentage + '%'
              if (item.userExamStatus === 0) {
                item.operation = this.operationB
              } else {
                item.operation = this.operationA
              }
              // table值格式化
              // item.userExamTime = Math.ceil(item.userExamTime / 1000 / 60)
              item.userExamStatus = this.$t(`vicenter.training.common.examinationStatusList2.${item.userExamStatus}`)
              item.userExamStartTime = this.$options.filters['formatDate'](item.userExamStartTime, this.$t('vicenter.common.formatDate'))
              item.userExamEndTime = this.$options.filters['formatDate'](item.userExamEndTime, this.$t('vicenter.common.formatDate'))
            })
            // 加载图表数据
            if (exam.examStatus === 0) {
              this.noDataChartOne = true
            }
            this.initChartOne('ChartOne', processing, unprocessed)
            if (exam.examStatus === 0) {
              this.noDataChartTwo = true
            }
            this.initChartTwo('ChartTwo', pass, failed)
            let xAxis = []
            let data = []
            for (let tmp of userExamInfo) {
              xAxis.push(tmp.pcName)
              data.push(tmp.userExamTrueCount)
            }
            if (exam.examStatus === 0) {
              this.noDataBarChart = true
            }
            this.initBarChart('barChart', xAxis, data)
          }
        })
      }
    },
    initChartOne (chartId, processing, unprocessed) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        title: {
          text: this.$t('vicenter.training.teacher.numberOfCandidates'),
          subtext: processing + unprocessed,
          textStyle: {
            color: '#c7c7c7',
            fontSize: 12,
            fontWeight: 'lighter'
          },
          subtextStyle: {
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold'
          },
          x: 'center',
          y: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          align: 'left',
          x: 'right',
          y: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          data: [this.$t('vicenter.training.teacher.numberOfPeopleTested'), this.$t('vicenter.training.teacher.numberOfUntested')]
        },
        color: ['#2f8ed2', '#2fa9fe'],
        series: [
          {
            name: this.$t('vicenter.training.teacher.examNumberStatistics'),
            type: 'pie',
            radius: ['50%', '90%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inner',
                // formatter: '{per|{d}%}',
                formatter: function (data) {
                  return data.percent.toFixed(0) + '%'
                },
                rich: {
                  per: {
                    color: '#fff',
                    borderRadius: 2
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: processing, name: this.$t('vicenter.training.teacher.numberOfPeopleTested')},
              {value: unprocessed, name: this.$t('vicenter.training.teacher.numberOfUntested')}
            ]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initChartTwo (chartId, pass, failed) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        title: {
          text: this.$t('vicenter.training.teacher.numberOfExams'),
          subtext: pass + failed,
          textStyle: {
            color: '#c7c7c7',
            fontSize: 12,
            fontWeight: 'lighter'
          },
          subtextStyle: {
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold'
          },
          x: 'center',
          y: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          align: 'left',
          x: 'right',
          y: 'center',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          data: [this.$t('vicenter.training.teacher.passNumber'), this.$t('vicenter.training.teacher.numberOfPeopleFiling')]
        },
        color: ['#2f8ed2', '#2fa9fe'],
        series: [
          {
            name: this.$t('vicenter.training.teacher.examinationPassRateStatistics'),
            type: 'pie',
            radius: ['50%', '90%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inner',
                // formatter: '{per|{d}%}',
                formatter: function (data) {
                  return data.percent.toFixed(0) + '%'
                },
                rich: {
                  per: {
                    color: '#fff',
                    borderRadius: 2
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: pass, name: this.$t('vicenter.training.teacher.passNumber')},
              {value: failed, name: this.$t('vicenter.training.teacher.numberOfPeopleFiling')}
            ]
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    initBarChart (chartId, xAxis, data) {
      let myChart = this.$echarts.init(document.getElementById(chartId))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('vicenter.training.common.answerNumberOfQuestions'),
            nameTextStyle: {
              padding: 20
            },
            nameLocation: 'center',
            min: 0,
            max: 100
          }
        ],
        series: [
          {
            name: this.$t('vicenter.training.teacher.testScoreStatistics'),
            type: 'bar',
            barWidth: '50%',
            data: data
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    changeTable () {},
    handleSave () {},
    goBack () {},
    // 关闭
    handleClose () {
      this.$router.push({path: '/Training/teacher/examinationList'})
    },
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
    },
    query () {
      let params = {}
      // this.getList(params)
    },
    getDetail (scope) {
      // console.log(scope.row)
      this.exerciseParams.examId = scope.row.examId
      this.$initSearchIpt(this.testList, scope.row)
      this.practiceDate(scope.row.userExamId)
    },
    // 查看考试详情
    practiceDate (userExamId) {
      this.openLoading()
      ajax.practiceDate({userExamId: userExamId}).then(res => {
        // console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let {record} = res.data.result
          record.forEach((item, index) => {
            item.serialNumber = index + 1
          })
          this.testImg = record
          this.modalData.flag = true
        }
      })
    },
    handleSizeChange (val) {
      this.formRule.model.size = val
      this.formRule.model.page = 0
      this.$set(this.tableData.page, 'pagesize', val)
      this.SetpageQuery(0)
    },
    handleCurrentChange (val) {
      this.formRule.model.page = val - 1
      this.SetpageQuery(this.formRule.model.page)
    },
    SetpageQuery (page) { // 查询设置页
      var times = {}
      if (this.formRule.model.createTime === null || this.formRule.model.createTime.length === 0) {
        times = {}
      } else {
        times = {
          createTimeFrom: this.formRule.model.createTime[0],
          createTimeTo: this.formRule.model.createTime[1]
        }
      }
      var value = {
        imageName: this.formRule.model.imageName,
        imageDesc: this.formRule.model.imageDesc,
        scanSerialNumber: this.formRule.model.scanSerialNumber,
        seizedLocation: this.formRule.model.seizedLocation,
        seizedType: this.formRule.model.seizedType,
        imageType: this.formRule.model.imageType,
        imageCollectMode: this.formRule.model.imageCollectMode,
        hsCodes: this.formRule.model.hsCodes,
        siteId: this.selectObj.siteId,
        deviceId: this.selectObj.deviceId,
        imageStatus: this.formRule.model.imageStatus,
        page: page,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value, times)
      // this.getList(val)
    },
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
    blur () {
      let picker = document.getElementsByClassName('el-picker-panel__body')[0]
      picker.addEventListener('click', function () {
        for (let m = 0; m < picker.getElementsByClassName('el-input__inner').length; m++) {
          picker.getElementsByClassName('el-input__inner')[m].setAttribute('readonly', 'readonly')
        }
      })
    },
    getSort () {},
    // 二维数组
    twoDimensionalArray (oldArr, num) {
      let newArr = []
      let arr = []
      oldArr.map((val, key) => {
        arr.push(val)
        if ((key + 1) % num === 0) {
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        } else if (oldArr.length < num && oldArr.length === arr.length) { // 当传入数据的长度小于td列数时，条件：二位数组的长度等于传入数据的长度
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        } else if ((oldArr.length - 1) === key && arr.length < num) { // 当传入数据的长度除以td列数有余数时，条件：传入数据的长度-1等于遍历完成的key且二位数组的长度小于td列数
          newArr.push(JSON.parse(JSON.stringify(arr)))
          arr.length = []
        }
      })
      return newArr
    },
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    }
  },
  components: { bread, ComForm, panelTitle, ComTable, Dialog, Exercise }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.examinationMsg-bar {
  @extend .extend-bar;
  .examinationMsg-M {
    padding:$margin;
    @include box-sizing;
    .operation-group {
        @include flex(row, flex-end, center);
        margin-bottom: $dis10;
    }
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .infolist {
      .panel {
        @extend .extend-panel;
        .exercise{
          padding:$margin;
          @include box-sizing;
          .exercise-top{
            width: $all;
            @include tableBorder($all, separate, 1px, #d7d7d7);
            &>tr{
              &>td{
                width: 50%;
                padding: 0;
                height: 0;
                .exercise-top-table{
                  width: $all;
                  height: $all;
                  tr{
                    td{
                      line-height: 32px;
                      &:first-child{
                        width: 35%;
                        background: #f2f2f2;
                        border-right: 1px solid #d7d7d7;
                      }
                      &:last-child{
                        width: 60%;
                        word-break:break-word;
                        text-align: left;
                        padding: 0 5%;
                        background: #ffffff;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .charts {
          @include flex(row, space-between, center);
          .chartbox {
            width: calc(100%/2 - 10px);
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
            width: calc(100% - 10px);
            height: 450px;
            @include box-sizing();
          }
          .barTable {
            width: calc(100% - 10px);
            height: auto;
            @include box-sizing();
          }
        }
      }
      .operation-group {
          @include flex(row, flex-end, center);
          margin-top: $margin;
      }
    }
    @media screen and (min-width: 1640px) {
      .infolist {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: -webkit-box;
        display: -ms-flexbox;
        display: block;
      }
    }
  }
}
</style>
