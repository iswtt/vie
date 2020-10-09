<template>
  <div class='myExamList-bar' v-bar>
    <div class="myExamList-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm ref="searchFormRef"  :searchIpt="searchIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="myExamListTable" @listenToSelectDataEvent='selectRow' :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="detailModalData" v-if="detailModalData.flag" class="formDialog">
        <table class="exercise-top-left-table" data-id="detail-table">
          <tr v-for="(tmpA, i) in testList" :key="i">
            <td v-for="(tmpB, ii) in tmpA" :key="ii">
              <table class="exercise-top-left-table-table" :data-id="tmpB.ruleProp + '-table'">
                <tr>
                  <td>{{tmpB.label}}</td>
                  <td>{{tmpB.models}}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </Dialog>
      <Dialog :modalData="examModalData" v-if="examModalData.flag" class="formDialog">
        <Exercise data-id="examExercise" :testListData="examTestList" :testImgData="examTestImg" :params="examParams"></Exercise>
      </Dialog>
      <!-- 关闭考试提示 -->
      <Dialog :modalData="promptModalData" class="formDialog">
<!--        <p class="prompt-p">关闭考试页面将保存答卷，下次打开继续答题，超过考试时间则自动交卷。</p>-->
        <p class="prompt-p">{{$t('vicenter.training.common.examClose')}}</p>
        <el-button data-id="iknow-btn" type="primary" size="small" @click="closePromptModal">{{$t('vicenter.training.common.iknow')}}</el-button>
      </Dialog>
      <Dialog :modalData="resultModalData" v-if="resultModalData.flag" class="formDialog">
        <Exercise data-id="detailExercise" :testListData="resultTestList" :testImgData="resultTestImg" :params="resultParams"></Exercise>
      </Dialog>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import upload from '@/components/uploadPreview'
import Dialog from '@/components/dialog'
import Exercise from '@/components/training/exercise'
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajax from '@/api/training/student.js'
import ajaxTeacher from '@/api/training/teacher.js'
import { resolve } from 'q'
export default {
  name: 'demo',
  data () {
    return {
      detailModalData: { // 详情弹出层
        flag: false,
        width: '70%',
        title: this.$t('vicenter.training.common.msg')
      },
      testList: [],
      detailTestList: [
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
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
          models: '',
          ruleProp: 'examStartTime'
        },
        {
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
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
          ruleProp: 'pcName'
        },
        {
          valueFormat: 'yyyy-MM-dd hh:mm:ss',
          type: 'datetime',
          models: '',
          ruleProp: 'examCreateTime'
        }
      ],
      examParams: { // 考试exercise子组件参数
        toFatherClose: this.closeExamModalData,
        colSpan: 1, // 图像分几列
        tdPadding: 20, // td的内边距
        exerciseType: 3, // Exercise组件类型1：老师答案 2：学员答题结果 3：考试
        isExerciseRight: true, // 是否有计时
        isAnswer: true, // 是否答题
        isExamRecord: false, // 是否显示考试结果
        recordActived: true // 是否显示已学或者已答
      },
      examModalData: { // 考试弹出层
        flag: false,
        width: '75%',
        resetModal: this.examResetModal,
        title: this.$t('vicenter.training.common.examination')
      },
      promptModalData: { // 提示信息弹出层
        flag: false,
        title: this.$t('vicenter.training.common.promptMessage')
      },
      examTestList: [
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
          ruleProp: 'testListCount'
        },
        {
          models: '',
          ruleProp: 'testListPassCount'
        }
      ],
      examTestImg: [],
      resultParams: { // 结果exercise子组件参数
        colSpan: 2, // 图像分几列
        exerciseType: 2, // Exercise组件类型1：老师答案 2：学员答题结果
        isExerciseRight: false, // 是否有计时
        isAnswer: false, // 是否答题
        isExamRecord: true // 是否显示考试结果
      },
      resultModalData: { // 结果弹出层
        flag: false,
        width: '65%',
        title: this.$t('vicenter.training.common.answerPreview')
      },
      resultTestList: [
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
          ruleProp: 'examStatus'
        }
      ],
      resultTestImg: [],
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
        {
          type: 'text',
          models: '',
          ruleProp: 'examName'
        },
        {
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'examTime',
          editable: false,
          clearable: true
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'examStatus'
        }
      ],
      formRule: { // 查询表单规则
        model: {
          examName: '',
          examTime: [],
          examStatus: ''
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      operation: [
        {
          func: this.getDetail,
          title: this.$t('vicenter.common.detail'),
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          show: true
        },
        {
          func: this.getExam, // 考试
          title: this.$t('vicenter.training.common.examination'),
          label: `<span class='iconfont editTable'>&#xe6a0;</span>`,
          show: true
        },
        {
          func: this.getResult, // 结果
          title: this.$t('vicenter.training.common.result'),
          label: `<span class='iconfont editTable'>&#xe6a4;</span>`,
          show: true
        }
      ],
      tableGroup: [ // 表格数据列
        {
          type: 'index',
          model: 'serialNumber'
        },
        {
          type: 'text',
          model: 'examName'
        },
        {
          type: 'text',
          model: 'examStartTime'
        },
        {
          type: 'text',
          model: 'examEndTime'
        },
        {
          type: 'text',
          model: 'testListCount'
        },
        {
          type: 'text',
          model: 'testListPassCount'
        },
        {
          type: 'text',
          model: 'examStatus'
        },
        {
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      tableData: { // 表格数据
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
        sortMethod: this.getSort
      },
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {},
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            // path: '/Training/student/index' // 跳转路径
            path: '/Training/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      }
      // 查询条件和列表title
      this.panelTitle = {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      }
      // 查询和重置按钮
      this.SearchFunc.queryText = this.$t('vicenter.common.query')
      this.SearchFunc.resetText = this.$t('vicenter.common.reset')
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'examName') {
          e.getLabel = this.$t('vicenter.training.common.testName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testName')
        } else if (e.ruleProp === 'examTime') {
          e.getLabel = this.$t('vicenter.training.common.examinationTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        } else if (e.ruleProp === 'examStatus') {
          e.getLabel = this.$t('vicenter.training.common.examinationStatus')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.examinationStatus')
          for (let i in this.$t('vicenter.training.common.examinationStatusList2')) {
            let obj = {}
            obj.value = Number(i)
            obj.label = this.$t('vicenter.training.common.examinationStatusList2')[i]
            e.option.push(obj)
          }
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'serialNumber') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'examName') {
          e.label = this.$t('vicenter.training.common.testName')
        } else if (e.model === 'examStartTime') {
          e.label = this.$t('vicenter.training.common.examStartTime')
        } else if (e.model === 'examEndTime') {
          e.label = this.$t('vicenter.training.common.examEndTime')
        } else if (e.model === 'testListCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.model === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        } else if (e.model === 'examStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // 详情
      this.detailTestList.forEach((e) => {
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
        } else if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.ruleProp === 'examCreateTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        } else if (e.ruleProp === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      // 考试
      this.examTestList.forEach((e) => {
        if (e.ruleProp === 'pcName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'account') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'testListCount') {
          e.label = this.$t('vicenter.training.common.totalNumberOfQuestions')
        } else if (e.ruleProp === 'testListPassCount') {
          e.label = this.$t('vicenter.training.common.passNumber')
        }
      })
      // 结果
      this.resultTestList.forEach((e) => {
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
        } else if (e.ruleProp === 'examStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        }
      })
      this.query()
    },
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let { examTime } = this.formRule.model
      if (examTime != null && examTime.length === 2) {
        params.startTime = this.$options.filters['formatDate'](examTime[0], this.$t('vicenter.common.formatDate'))
        params.endTime = this.$options.filters['formatDate'](examTime[1], this.$t('vicenter.common.formatDate'))
      }
      params.pcUserId = sessionStorage.getItem('userId')
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      this.getList(params)
    },
    getList (params) {
      this.openLoading()
      ajax.getMyExamApi(params).then((res) => {
        console.log(res.data.result)
        this.closeLoading()
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result.examInfoEntities
          let testImgList = res.data.result.testImgList
          // for (let [key, val] of content.entries()) {
          //   // console.log(val, key)
          //   val.testListName = testImgList[key].testListName
          //   val.testListCount = testImgList[key].testListCount
          //   val.testListPassCount = testImgList[key].testListPassCount
          // }
          this.tableData.data = content
          this.tableData.data.forEach((item, index) => {
            // console.log(item)
            // 操作
            let operation = this.operation.map(c => ({...c}))
            if (item.examStatus === 1 || item.examStatus === 2) {
              operation[1].show = false
            } else if (item.examStatus === 4 || item.status === 4) {
              operation[2].show = false
            } else if ((item.examStatus === 0 && item.status !== 4) || item.examStatus === 3) {
              operation[1].show = false
              operation[2].show = false
            }
            item.operation = operation
            // table值格式化
            item.examStartTime = this.$options.filters['formatDate'](item.examStartTime, this.$t('vicenter.common.formatDate'))
            // exercise 组件 examEndTime 在英文状态下 无法被new Date 解析 所以新增一个字段
            item.examEndTimeForExercise = item.examEndTime
            item.examEndTime = this.$options.filters['formatDate'](item.examEndTime, this.$t('vicenter.common.formatDate'))
            item.examStatus = this.$t(`vicenter.training.common.examinationStatusList2.${item.examStatus}`)
          })
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
          this.tableData.page.CurrentPage = pageable.pageNumber
          this.tableData.page.pagesize = pageable.pageSize
          this.tableData.page.Allpage = totalElements
          // 查询条件
          this.formRule.model.page = pageable.pageNumber
          this.formRule.model.size = pageable.pageSize
        }
      })
    },
    // 暂存
    next () {
      console.log(this.addIpt)
      console.log(this.addFormRule)
      this.$refs['addForm'].$refs[this.addFormRule.refName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 发布
    release () {},
    handleCreate () {
      this.$router.push({
        path: '/Training/student/myTrainingMsg'
      })
    },
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
    },
    resetForm () {
      // this.query()
    },
    // 详情
    getDetail (scope) {
      console.log(scope.row, '当前row')
      this.$initSearchIpt(this.detailTestList, scope.row)
      let _time = ['examStartTime', 'examEndTime', 'examCreateTime']
      this.detailTestList.forEach(item => {
        if (_time.indexOf(item.ruleProp) !== -1) {
          let _t = item.models.split(' ')[0].split('.')
          if (_t[0].length === 2) { // 时间格式为英文格式
            item.models = this.timeToChina(item.models)
          }
          item.models = this.$options.filters['formatDate'](new Date(item.models).getTime(), this.$t('vicenter.common.formatDate'))
        }
      })
      this.testList = this.twoDimensionalArray(this.detailTestList, 2)
      this.detailModalData.flag = true
    },
    timeToChina (e) {
      console.log(e)
      let _t = e.split(' ')
      let _date = _t[0].split('.').reverse().join('-')
      return _date + ' ' + _t[1]
    },
    // 考试
    getExam (scope) {
      console.log(scope.row, '当前row')
      this.examParams.examId = scope.row.examId
      // start 需求为 账号和姓名取当前登录人 2020-07-25 添加
      scope.row.pcName = sessionStorage.getItem('userName')
      scope.row.account = sessionStorage.getItem('account')
      // end
      this.$initSearchIpt(this.examTestList, scope.row)
      this.generateTestData(scope)
    },
    // 开始考试
    generateTestData (scope) {
      console.log(scope)
      let params = {}
      params.examId = scope.row.examId
      params.pcUserId = sessionStorage.getItem('userId')
      this.openLoading()
      ajax.generateTestData(params).then((res) => {
        console.log(res.data, '开始考试')
        if (res.data.flag) {
          if (res.data.result.error) {
            this.$NotifError(this.$t('vicenter.training.common.examIsOver'))
            this.query()
          } else {
            // 考试已开考时间
            this.examParams.examUseTime = res.data.result.consumeTime
            this.examParams.examDuration = new Date(scope.row.examEndTimeForExercise).getTime() - res.data.result.date
            Promise.all([
              this.practiceDate(scope.row.examId)
            ]).then(result => {
              this.closeLoading()
              this.examTestImg = result[0]
              this.examModalData.flag = true
            })
          }
        } else {
          this.closeLoading()
        }
      })
    },
    // 获取题目集合
    practiceDate (examId) {
      let params = {}
      params.examId = examId
      params.pcUserId = sessionStorage.getItem('userId')
      return new Promise(resolve => {
        ajaxTeacher.practiceDate(params).then(res => {
          console.log(res.data.result, '获取题目集合')
          if (res.data.flag) {
            let {record} = res.data.result
            record.forEach((item, index) => {
              item.serialNumber = index + 1
            })
            resolve(record)
          }
        })
      })
    },
    // 考试窗口点击关闭
    examResetModal () {
      this.promptModalData.flag = true
    },
    // 我知道了
    closePromptModal () {
      this.promptModalData.flag = false
    },
    // 关闭考试弹出层
    closeExamModalData () {
      this.query()
      this.examModalData.flag = false
    },
    // 结果
    getResult (scope) {
      console.log(scope.row, '当前row')
      this.resultParams.examId = scope.row.examId
      this.openLoading()
      Promise.all([
        this.getMyExamResult(scope.row),
        this.practiceDate(scope.row.examId)
      ]).then(result => {
        this.closeLoading()
        this.resultTestImg = result[1]
        this.resultModalData.flag = true
      }).catch(() => {
        this.closeLoading()
      })
    },
    // 考试结果信息
    getMyExamResult (row) {
      let params = {}
      params.examId = row.examId
      params.pcUserId = sessionStorage.getItem('userId')
      return new Promise(resolve => {
        ajax.getMyExamResult(params).then((res) => {
          console.log(res, '考试结果返回')
          if (res.data.flag) {
            let {userExamInfo} = res.data.result
            let obj = {}
            Object.assign(obj, userExamInfo[0], row)
            obj.pcName = userExamInfo[0].pcName
            obj.account = userExamInfo[0].account
            obj.userExamCorrectPercentage = obj.userExamCorrectPercentage + '%'
            obj.userExamStatus = this.$t(`vicenter.training.common.examinationStatusList.${obj.userExamStatus}`)
            // obj.userExamTime = Math.ceil(obj.userExamTime / 1000 / 60)
            this.$initSearchIpt(this.resultTestList, obj)
            resolve()
          }
        })
      })
    },
    getDownload (scope) {},
    toEdit (scope) {},
    handleReview (scope) {},
    toRelease (id) {},
    toUnRelease (id) {},
    toReject (scope) {},
    toDelete (id) {
      let params = {
        id: id
      }
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteSuccess'))
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
      if (this.formRule.model.examTime === null || this.formRule.model.examTime.length === 0) {
        times = {}
      } else {
        times = {
          startTime: this.formRule.model.examTime[0],
          endTime: this.formRule.model.examTime[1]
        }
      }
      var value = {
        examName: this.formRule.model.examName,
        examStatus: this.formRule.model.examStatus,
        pcUserId: sessionStorage.getItem('userId'),
        page: page,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value, times)
      console.log(val)
      this.getList(val)
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
    treeClick (data) {
    },
    // 转换成二维数组
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
  components: { bread, ComForm, panelTitle, ComTable, upload, Exercise, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.myExamList-bar {
  @extend .extend-bar;
  .myExamList-M {
    padding:$margin;
    @include box-sizing;
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
        .search-form {
          @include layout(3);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
        .editTable {
          margin: 0 5px;
        }
      }
    }
    .formDialog {
      .search-form {
        @include layout(1);
      }
      .search-form-btn .el-form-item__content {
        display: none;
      }
      .tableComp{
        padding: 0
      }
      .prompt-p{
        margin-bottom: $margin * 2;
        font-size: 16px;
      }
      .exercise-top-left-table{
        @include tableBorder($all, separate, 1px, #d7d7d7);
        &>tr{
          &>td{
            width: 50%;
            padding: 0;
            height: 0;
            .exercise-top-left-table-table{
              width: $all;
              height: $all;
              tr{
                td{
                  line-height: 32px;
                  &:first-child{
                    width: 35%;
                    padding: 10px 0;
                    background: #f2f2f2;
                    border-right: 1px solid #d7d7d7;
                  }
                  &:last-child{
                    width: 60%;
                    text-align: left;
                    padding: 0 5%;
                    background: #ffffff;
                    word-break: break-word;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

}
</style>
