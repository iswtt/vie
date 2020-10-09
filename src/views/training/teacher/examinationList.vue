<template>
  <div class='examinationList-bar' v-bar>
    <div class="examinationList-M">
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
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button data-id="add-btn" type="primary" size="mini" @click='handleCreate'>{{$t('vicenter.training.common.add')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="examinationListTable" @listenToSelectDataEvent='selectRow' :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog class="formDialog" :modalData="modalData">
        <ComForm :searchIpt="addInputItem" :searchFunc="{}" :formRule="addFormRule" ref="addForm"></ComForm>
        <div class="transfer-box" v-loading="isSavingList" element-loading-background="rgba(255, 255, 255, 0.8)">
          <el-transfer data-id="studentListTransfer" v-model="listTransfer.transfer.model" :data="listTransfer.transfer.data" :titles="listTransfer.transfer.title" :button-texts="listTransfer.transfer.button" target-order="push"></el-transfer>
        </div>
        <div class="resultbutton" v-if="showBtns">
          <el-button data-id="temporary-btn" type="warning" size="medium" @click="temporary">{{$t('vicenter.training.common.temporary')}}</el-button>
          <el-button data-id="release-btn" type="primary" size="medium" @click="release">{{$t('vicenter.training.common.release')}}</el-button>
        </div>
        <div class="resultbutton" v-if="switchBtns">
          <el-button data-id="temporary-btn" type="warning" size="medium" @click="submit(2)">{{$t('vicenter.training.common.temporary')}}</el-button>
          <el-button data-id="release-btn" type="primary" size="medium" @click="submit(0)">{{$t('vicenter.training.common.release')}}</el-button>
        </div>
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
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajax from '@/api/training/teacher.js'
import { resolve, reject } from 'q'
export default {
  name: 'demo',
  data () {
    var validateExamStartTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.examStartTime')))
      } else if (value <= Date.now()) {
        callback(new Error(this.$t('vicenter.training.common.selcetCurrentTimeError')))
      } else {
        callback()
      }
    }
    var validateExamEndTime = (rule, value, callback) => {
      console.log(value, this.addFormRule.model.examStartTime)
      if (value === '') {
        callback(new Error(this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.examEndTime')))
      } else if (value <= Date.now()) {
        callback(new Error(this.$t('vicenter.training.common.selcetCurrentTimeError')))
      } else if (value <= this.addFormRule.model.examStartTime) {
        callback(new Error(this.$t('vicenter.training.common.selcetEndTimeError')))
      } else {
        callback()
      }
    }
    return {
      modalData: {
        flag: false,
        resetModal: this.customReset,
        title: this.$t('vicenter.training.common.add')
      },
      showBtns: true,
      switchBtns: false,
      titleBread: {}, // 面包屑
      panelTitle: {}, // 标题栏
      searchIpt: [ // 查询表单
        {
          type: 'text',
          clearable: true,
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
        },
        {
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'createTime',
          editable: false,
          clearable: true
        },
        {
          type: 'text',
          models: '',
          maxlength: this.$globalData.threshold,
          ruleProp: 'examCreateUser'
        }
      ],
      formRule: { // 查询表单规则
        model: {
          examName: '',
          examTime: [],
          examStatus: '',
          createTime: [],
          examCreateUser: ''
        },
        refName: 'queryForm',
        rule: {}
      },
      addInputItem: [ // 查询表单
        {
          getLabel: this.$t('vicenter.training.common.testName'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testName'),
          type: 'text',
          clearable: true,
          models: '',
          ruleProp: 'examName'
        },
        {
          getLabel: this.$t('vicenter.training.common.selectTestPaper'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.testPaper'),
          // type: 'select',
          type: 'select2',
          clearable: true,
          multiple: false,
          filterable: true,
          models: '',
          option: [],
          change: () => { this.changeDeviceType('addForm', 'testListId') },
          ruleProp: 'testListId'
        },
        // {
        //   getLabel: this.$t('vicenter.training.common.selectTestPaper'),
        //   placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.testPaper'),
        //   type: 'autocomplete',
        //   clearable: true,
        //   models: '',
        //   allData: [],
        //   filterKey: 'label',
        //   valueKey: 'label',
        //   // option: [],
        //   // change: () => { this.changeDeviceType('addForm', 'testListId') },
        //   select: this.examSelect,
        //   ruleProp: 'testListId'
        // },
        {
          getLabel: this.$t('vicenter.training.common.examStartTime'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.examStartTime'),
          type: 'datetime',
          models: '',
          valueFormat: 'timestamp',
          clearable: true,
          pickerOptions: {
            disabledDate: (time) => {
              // 今天之前禁用
              return time.getTime() < new Date(new Date().toLocaleString().split(' ')[0]).getTime()
            }
          },
          change: this.validateExamEnd,
          ruleProp: 'examStartTime'
        },
        {
          getLabel: this.$t('vicenter.training.common.examEndTime'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.examEndTime'),
          type: 'datetime',
          models: '',
          valueFormat: 'timestamp',
          clearable: true,
          pickerOptions: {
            disabledDate: (time) => {
              // 今天之前禁用
              return time.getTime() < new Date(new Date().toLocaleString().split(' ')[0]).getTime()
            }
          },
          ruleProp: 'examEndTime'
        },
        {
          getLabel: this.$t('vicenter.training.common.examinationVenue'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.examinationVenue'),
          type: 'text',
          models: '',
          ruleProp: 'examAddr'
        },
        {
          getLabel: this.$t('vicenter.training.common.examNotes'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.examNotes'),
          type: 'textarea',
          minSize: 1,
          maxlength: 100,
          models: '',
          ruleProp: 'examDesc'
        },
        {
          getLabel: this.$t('vicenter.training.common.chooseTraining'),
          placeHolder: this.$t('vicenter.training.common.checkChooseTraining'),
          type: 'select',
          clearable: true,
          models: '',
          change: this.changeTraId,
          option: [],
          ruleProp: 'traId'
        }
      ],
      addFormRule: {
        model: {
          examName: '',
          testListId: '',
          examStartTime: '',
          examEndTime: '',
          examAddr: '',
          examDesc: '',
          traId: ''
        },
        refName: 'addForm',
        rule: {
          examName: [
            { required: true, message: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testName'), trigger: 'blur' }
          ],
          testListId: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.testPaper'), trigger: ['blur', 'change'] }
          ],
          examStartTime: [
            { required: true, validator: validateExamStartTime, trigger: ['blur', 'change'] }
          ],
          examEndTime: [
            { required: true, validator: validateExamEndTime, trigger: ['blur', 'change'] }
          ]
        }
      },
      watchTraId: false,
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
          model: 'examStatus'
        },
        {
          type: 'text',
          model: 'pcName'
        },
        {
          type: 'text',
          model: 'examCreateTime'
        },
        {
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      operationA: [
        {
          func: this.getDetail, // 查看
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          show: true
        },
        {
          func: this.toEdit, // 修改
          label: `<span class='iconfont editTable'>&#xe650;</span>`,
          show: true
        },
        {
          func: this.handleRelease, // 发布
          label: `<span class='iconfont editTable'>&#xe702;</span>`,
          show: true
        },
        {
          func: this.handleDelete, // 删除
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          show: true
        }
      ],
      operationB: [
        {
          title: this.$t('vicenter.training.common.statistics'),
          func: this.getStatistics, // 统计
          label: `<span class='iconfont editTable'>&#xe673;</span>`,
          show: true
        }
      ],
      operationC: [
        {
          title: this.$t('vicenter.common.detail'),
          func: this.getDetail, // 查看
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          show: true
        }
      ],
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
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
      selRowId: '',
      isSavingList: false,
      listTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: []
        }
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
  watch: {
    'addFormRule.model.traId': function (newVal, oldVal) {
      // console.log(newVal)
      if (this.watchTraId) {
        this.listTransfer.transfer.model = []
        if (newVal) {
          this.getUsersInfo(1, newVal)
        } else {
          this.getUsersInfo(0)
        }
      }
    }
  },
  methods: {
    // 校验
    validateExamEnd () {
      if (this.addFormRule.model.examEndTime) {
        this.$changeSelectValidateField('addForm', this, 'examEndTime')
      }
    },
    setI18n () {
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
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        },
        dialogTitleOne: {
          title: this.$t('vicenter.training.common.basicInformation')
        }
      }
      // 查询和重置按钮
      this.SearchFunc.queryText = this.$t('vicenter.common.query')
      this.SearchFunc.resetText = this.$t('vicenter.common.reset')
      // 操作列按钮提示
      let operateTitle = [
        this.$t('vicenter.common.detail'),
        this.$t('vicenter.common.fix'),
        this.$t('vicenter.training.common.release'),
        this.$t('vicenter.common.delete')
      ]
      operateTitle.forEach((e, index) => {
        this.operationA[index].title = e
      })
      // 自定义列表弹框
      this.listTransfer.title = this.$t('vicenter.common.definedList')
      this.listTransfer.transfer.title = [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')]
      this.listTransfer.transfer.button = [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
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
          e.option = []
          for (let i in this.$t('vicenter.training.common.examinationStatusList')) {
            let obj = {}
            obj.value = Number(i)
            obj.label = this.$t('vicenter.training.common.examinationStatusList')[i]
            e.option.push(obj)
          }
        } else if (e.ruleProp === 'examCreateUser') {
          e.getLabel = this.$t('vicenter.training.common.founder')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.founder')
        } else if (e.ruleProp === 'createTime') {
          e.getLabel = this.$t('vicenter.training.common.createTime')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.createTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
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
        } else if (e.model === 'examStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        } else if (e.model === 'pcName') {
          e.label = this.$t('vicenter.training.common.founder')
        } else if (e.model === 'examCreateTime') {
          e.label = this.$t('vicenter.training.common.createTime')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.query()
    },
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let { createTime, examTime } = this.formRule.model
      if (createTime != null && createTime.length === 2) {
        params.examCreateTimeStart = this.$options.filters['formatDate'](createTime[0], this.$t('vicenter.common.formatDate'))
        params.examCreateTimeEnd = this.$options.filters['formatDate'](createTime[1], this.$t('vicenter.common.formatDate'))
      }
      if (examTime != null && examTime.length === 2) {
        params.examStartTime = this.$options.filters['formatDate'](examTime[0], this.$t('vicenter.common.formatDate'))
        params.examEndTime = this.$options.filters['formatDate'](examTime[1], this.$t('vicenter.common.formatDate'))
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      this.getList(params)
    },
    getList (params) {
      this.openLoading()
      ajax.getExam(params).then((res) => {
        console.log(res, '列表返回')
        this.closeLoading()
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          // console.log(content)
          this.tableData.data = content
          this.tableData.data.forEach((item, index) => {
            // console.log(item)
            // 操作
            if (item.examStatus === 2) {
              if (item.examCreateUser === sessionStorage.getItem('userId')) {
                item.operation = this.operationA
              } else {
                item.operation = this.operationC
              }
            } else {
              item.operation = this.operationB
            }
            // table值格式化
            item.startTime = item.examStartTime // 解决英文状态不回显时间
            item.endTime = item.examEndTime // 解决英文状态不回显时间
            item.examStartTime = this.$options.filters['formatDate'](new Date(item.examStartTime).getTime(), this.$t('vicenter.common.formatDate'))
            item.examEndTime = this.$options.filters['formatDate'](new Date(item.examEndTime).getTime(), this.$t('vicenter.common.formatDate'))
            item.examCreateTime = this.$options.filters['formatDate'](item.examCreateTime, this.$t('vicenter.common.formatDate'))
            item.examStatus = this.$t(`vicenter.training.common.examinationStatusList.${item.examStatus}`)
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
    // 新增选择试卷回调
    examSelect (item) {
      console.log(item)
    },
    // 获取试卷名称列表
    getTestPapers () {
      this.addInputItem[1].option = []
      return new Promise((resolve, reject) => {
        ajax.getTestPapers({}).then((res) => {
          // console.log(res)
          if (res.data.flag) {
            let data = res.data.result
            console.log(data)
            for (let tmp of data) {
              let obj = {}
              obj.value = tmp.testListId
              obj.label = tmp.testListName
              this.addInputItem[1].option.push(obj)
              // this.addInputItem[1].allData.push(obj)
            }
            resolve(res.data.result)
          } else {
            reject(res.data.result)
          }
        })
      })
    },
    // 获取培训班信息
    getTrainingInfo () { // modalFlag：是否点击新增打开弹框
      this.addInputItem[this.addInputItem.length - 1].option = []
      return new Promise((resolve, reject) => {
        ajax.getUsersInfo({}).then((res) => {
          if (res.data.flag) {
            let data = res.data.result
            for (let tmp of data) {
              let obj = {}
              obj.value = tmp.traId
              obj.label = tmp.traName
              this.addInputItem[this.addInputItem.length - 1].option.push(obj)
            }
            resolve(res.data.result)
          } else {
            reject(res.data.result)
          }
        })
      })
    },
    // 获取学员信息
    /**
     * flag：0 学员所有信息 1 根据traId查询的学员
     * traId: 培训主键(为空时查询培训信息,反之查询学员信息)
     */
    getUsersInfo (flag, traId) { // modalFlag：是否点击新增打开弹框
      let params = {}
      params.flag = flag
      if (traId) {
        params.traId = traId
      }
      this.listTransfer.transfer.data = []
      return new Promise((resolve, reject) => {
        ajax.getUsersInfo(params).then((res) => {
          console.log(res, '获取学员信息返回')
          if (res.data.flag) {
            let data = res.data.result
            for (let tmp of data) {
              let obj = {}
              obj.key = tmp.pcUserId
              obj.label = tmp.pcUserName
              obj.disabled = false
              this.listTransfer.transfer.data.push(obj)
            }
            resolve(res.data.result)
          } else {
            reject(res.data.result)
          }
        })
      })
    },
    // 新增
    handleCreate () {
      this.openLoading()
      Promise.all([
        this.getTestPapers(),
        this.getTrainingInfo(),
        this.getUsersInfo(0)
      ]).then(res => {
        console.log(res)
        this.closeLoading()
        this.$initSearchIpt(this.addInputItem, {}, false)
        // 修改testListId字段赋值
        this.addFormRule.model.testListId = ''
        this.addInputItem[1].models = ''
        for (var tmp of this.listTransfer.transfer.data) {
          tmp.disabled = false
        }
        this.modalData.title = this.$t('vicenter.training.common.add')
        this.modalData.flag = true
        this.showBtns = true
        this.switchBtns = false
      }).catch(() => {
        this.closeLoading()
      })
    },
    // 表单进行校验
    validate (num, submitType = null) {
      this.$refs['addForm'].$refs[this.addFormRule.refName].validate((valid) => {
        // console.log(valid)
        if (valid) {
          if (this.listTransfer.transfer.model.length === 0) {
            this.$NotifPrompt(this.$t('vicenter.training.common.addSelection'))
          } else {
            if (num === 3) {
              this.updateExam(submitType)
            } else {
              this.saveExam(num)
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存考试信息
    saveExam (num) {
      let params = JSON.parse(JSON.stringify(this.addFormRule.model))
      params.examStatus = num // 暂存还是发布
      params.pcUserId = sessionStorage.getItem('userId')
      params.users = this.listTransfer.transfer.model.join(',')
      params.examStartTime = this.$options.filters['formatDate'](this.addFormRule.model.examStartTime, this.$t('vicenter.common.formatDate'))
      params.examEndTime = this.$options.filters['formatDate'](this.addFormRule.model.examEndTime, this.$t('vicenter.common.formatDate'))
      console.log('this.addFormRule.model', this.addFormRule.model)
      console.log(this.listTransfer)
      this.openLoading()
      ajax.saveExam(params).then((res) => {
        this.closeLoading()
        if (res.data.flag) {
          if (res.data.result !== 900004) {
            this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
            this.query()
            setTimeout(() => {
              this.modalData.flag = false
            }, 2000)
          } else {
            this.$NotifError(this.$t('vicenter.training.common.examNameRepeating'))
          }
        }
      })
    },
    // 新增暂存
    temporary () {
      // console.log(this.listTransfer)
      this.validate(2)
    },
    // 新增发布
    release () {
      this.validate(0)
    },
    // 修改提交
    submit (submitType) {
      this.validate(3, submitType)
    },
    // 列表选中行
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
    },
    // 发布
    handleRelease (scope) {
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toRelease'), () => {
        let params = {}
        params.examId = scope.row.examId
        params.examStatus = 0
        this.updateExamStatus(params)
      })
    },
    // 删除
    handleDelete (scope) {
      // console.log(scope)
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toDelete'), () => {
        let params = {}
        params.examId = scope.row.examId
        params.examStatus = 1
        this.updateExamStatus(params)
      })
    },
    // 更改试题状态
    updateExamStatus (params) {
      ajax.updateExamStatus(params).then((res) => {
        if (res.data.flag) {
          if (params.examStatus === 0) {
            this.$NotifSuccess(this.$t('vicenter.training.common.releaseSuccess'))
          } else {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
          }
          this.query()
        }
      })
    },
    // 选择器校验
    changeDeviceType (ref, param) {
      this.$changeSelectValidateField(ref, this, param)
    },
    // 选择培训
    changeTraId () {
      this.watchTraId = true
    },
    // 统计
    getStatistics (scope) {
      sessionStorage.setItem('examId', scope.row.examId)
      this.$router.push({
        path: '/Training/teacher/examinationMsg'
      })
    },
    // 详情
    getDetail (scope) {
      this.openLoading()
      this.examInfo(scope.row.examId, data => {
        let {exam, userExam, traId} = data
        let flag = null
        if (traId) {
          flag = 1
        } else {
          flag = 0
        }
        Promise.all([
          this.getTestPapers(),
          this.getTrainingInfo(),
          this.getUsersInfo(flag, traId)
        ]).then(res => {
          // console.log(res)
          this.closeLoading()
          this.modalData.title = this.$t('vicenter.training.common.msg')
          this.modalData.flag = true
          this.showBtns = false
          this.switchBtns = false
          let _row = {...scope.row}
          this.rowData = _row
          // console.log(this.rowData)
          _row.traId = traId
          for (let _key in _row) {
            if (_key === 'examStartTime') {
              _row.examStartTime = _row.startTime
            } else if (_key === 'examEndTime') {
              _row.examEndTime = _row.endTime
            }
          }
          this.$initSearchIpt(this.addInputItem, _row, true)
          for (var tmp of this.listTransfer.transfer.data) {
            tmp.disabled = true
          }
          for (tmp of userExam) {
            // console.log(tmp)
            this.listTransfer.transfer.model.push(tmp.pcUserId)
          }
        }).catch(() => {
          this.closeLoading()
        })
      })
    },
    // 考试信息详情
    examInfo (examId, callback = Function) {
      let params = {}
      params.examId = examId
      ajax.examInfo(params).then((res) => {
        console.log(res, '考试信息详情返回')
        if (res.data.flag) {
          callback(res.data.result)
        } else {
          this.closeLoading()
        }
      })
    },
    toEdit (scope) {
      this.addFormRule.model.examId = scope.row.examId
      this.openLoading()
      this.examInfo(scope.row.examId, data => {
        let {exam, userExam, traId} = data
        let flag = null
        if (traId) {
          flag = 1
        } else {
          flag = 0
        }
        Promise.all([
          this.getTestPapers(),
          this.getTrainingInfo(),
          this.getUsersInfo(flag, traId)
        ]).then(res => {
          console.log(res)
          this.closeLoading()
          this.modalData.title = this.$t('vicenter.training.common.edit')
          this.modalData.flag = true
          this.showBtns = false
          this.switchBtns = true
          let _row = { ...scope.row }
          this.rowData = _row
          // console.log(this.rowData)
          this.$nextTick(() => {
            _row.traId = traId
            for (let _key in _row) {
              if (_key === 'examStartTime') {
                _row.examStartTime = _row.startTime
              } else if (_key === 'examEndTime') {
                _row.examEndTime = _row.endTime
              }
            }
            this.$initSearchIpt(this.addInputItem, _row)
            for (var tmp of this.listTransfer.transfer.data) {
              tmp.disabled = false
            }
            for (tmp of userExam) {
              // console.log(tmp)
              this.listTransfer.transfer.model.push(tmp.pcUserId)
            }
            console.log(this.listTransfer.transfer)
          })
        }).catch(() => {
          console.log('失败')
          this.closeLoading()
        })
      })
    },
    // 更新考试信息
    updateExam (submitType) {
      this.addFormRule.model.users = this.listTransfer.transfer.model.join(',')
      this.addFormRule.model.examStartTime = this.$options.filters['formatDate'](this.addFormRule.model.examStartTime, this.$t('vicenter.common.formatDate'))
      this.addFormRule.model.examEndTime = this.$options.filters['formatDate'](this.addFormRule.model.examEndTime, this.$t('vicenter.common.formatDate'))
      this.addFormRule.model.examStatus = submitType
      // console.log(this.addFormRule.model)
      // console.log(this.listTransfer)
      ajax.updateExam(this.addFormRule.model).then((res) => {
        if (res.data.flag) {
          if (res.data.result !== 900004) {
            this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
            this.query()
            setTimeout(() => {
              this.modalData.flag = false
            }, 2000)
          } else {
            this.$NotifError(this.$t('vicenter.training.common.examNameRepeating'))
          }
        }
      })
    },
    cancel () {
      this.modalData.flag = false
    },
    resetForm () {
      // this.query()
    },
    // 自定义重置
    customReset () {
      this.$refs['addForm'].reset()
      this.watchTraId = false
      this.listTransfer.transfer.data = []
      this.listTransfer.transfer.model = []
      this.addInputItem.forEach(e => {
        if (e.ruleProp === 'testListId' || e.ruleProp === 'traId') {
          e.models = ''
        }
      })
    },
    handleReview (scope) {},
    toRelease (id) {},
    toUnRelease (id) {},
    toReject (scope) {},
    toDelete (id) {},
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
      let createTime = {}
      if (this.formRule.model.createTime === null || this.formRule.model.createTime.length === 0) {
        createTime = {}
      } else {
        createTime = {
          examCreateTimeStart: this.$options.filters['formatDate'](this.formRule.model.createTime[0], this.$t('vicenter.common.formatDate')),
          examCreateTimeEnd: this.$options.filters['formatDate'](this.formRule.model.createTime[1], this.$t('vicenter.common.formatDate'))
        }
      }
      let examTime = {}
      if (this.formRule.model.examTime === null || this.formRule.model.examTime.length === 0) {
        examTime = {}
      } else {
        examTime = {
          examStartTime: this.$options.filters['formatDate'](this.formRule.model.examTime[0], this.$t('vicenter.common.formatDate')),
          examEndTime: this.$options.filters['formatDate'](this.formRule.model.examTime[1], this.$t('vicenter.common.formatDate'))
        }
      }
      var value = {
        examName: this.formRule.model.examName,
        examStatus: this.formRule.model.examStatus,
        examCreateUser: this.formRule.model.examCreateUser,
        page: page,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value, createTime, examTime)
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
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Training/teacher/examinationMsg') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        examName: '',
        examStatus: '',
        examCreateUser: '',
        createTime: [],
        examTime: []
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { bread, ComForm, panelTitle, ComTable, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.examinationList-bar {
  @extend .extend-bar;
  .examinationList-M {
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
      .el-dialog {
        width: 55% !important;
      }
      .search-form {
        @include layout(2);
      }
      .search-form-btn .el-form-item__content {
        display: none;
      }
      .resultbutton {
        padding-top: 10px;
        text-align: right;
      }
    }
  }
}
</style>
