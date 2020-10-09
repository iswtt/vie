<template>
  <div class='imageLearningList-bar' v-bar>
    <div class="imageLearningList-M">
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
            <el-button data-id="learn-btn" type="primary" size="mini" @click='handleCreate'>{{$t('vicenter.training.common.learn')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="imageLearningListTable" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="addModalData" v-if="addModalData.flag" class="formDialog">
        <ComForm ref="addForm" id="addForm" :searchIpt="addInputItem" :searchFunc="{}" :formRule='addFormRule'>
          <template v-slot:soltTestListCount>
            <p class="soltTestListCount">{{$t('vicenter.training.common.availableImgListCount')}}：{{addInputItem[addInputItem.length-1].max}}</p>
          </template>
        </ComForm>
        <div class="resultbutton">
          <el-button data-id="submit-btn" type="primary" size="medium" @click="submit">{{$t('vicenter.training.common.submit')}}</el-button>
          <el-button data-id="cancel-btn" size="medium" @click="cancel">{{$t('vicenter.training.common.cancel')}}</el-button>
        </div>
      </Dialog>
      <Dialog :modalData="examModalData" v-if="examModalData.flag" class="exerciseDialog">
        <Exercise data-id="detailExercise" ref="childs" :testListData="examTestList" :testImgData="examTestImg" :params="examParams"></Exercise>
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
export default {
  name: 'demo',
  data () {
    let self = this
    return {
      addModalData: {
        flag: false,
        resetModal: this.customReset,
        title: this.$t('vicenter.training.common.add')
      },
      watch: false,
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
        {
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'learningTime',
          editable: false,
          clearable: true
        }
      ],
      formRule: { // 查询表单规则
        model: {
          learningTime: []
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      addInputItem: [ // 基础表单
        {
          getLabel: this.$t('vicenter.training.common.imageClassification'),
          type: 'checkbox',
          models: [0, 1],
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.imageClassification'),
          option: [
            {
              value: 0,
              label: this.$t('vicenter.training.common.imageClassificationList.0')
            },
            {
              value: 1,
              label: this.$t('vicenter.training.common.imageClassificationList.1')
            }
          ],
          hiden: false,
          ruleProp: 'testImgClass'
        },
        // {
        //   getLabel: this.$t('vicenter.training.common.hsCodes'),
        //   type: 'selectRemote',
        //   models: [],
        //   ruleProp: 'testImgHashCodes',
        //   clearable: true,
        //   option: [],
        //   reserveKeyword: true,
        //   loading: false,
        //   change: this.addHscodeChange,
        //   remoteMethod: this.addGetRemoteHscode,
        //   focus: this.addFocus,
        //   iptClass: 'addtraicSelect',
        //   multiple: true
        // },
        {
          getLabel: this.$t('vicenter.training.common.hsCodes'),
          placeHolder: ' ',
          models: '',
          options: [],
          ruleProp: 'testImgHashCodes',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'hsCodesInput',
          treeDataId: 'hsCodesData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.hsCodesCheckChange,
          change: () => { this.changeDeviceType('addForm', 'testImgHashCodes') },
          treeRefName: 'hsCodesIptRef',
          treeIptComName: 'hsCodesTree',
          TreeProps: {
            children: 'children',
            label: function (data) {
              // 重写节点的label显示内容
              return `(${data.code}) ${data.name}`
            }
          },
          goodsOption: {
            hscodeTreeQuery: false,
            hscodePosition: true,
            isShowCheckbox: true,
            checkedKeys: [],
            maxLimit: null // 标准图最多选择一个，违规图可以多个
          }
        },
        {
          getLabel: this.$t('vicenter.training.common.learningMethod'),
          type: 'radio',
          models: 0,
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.imageClassification'),
          option: [
            {
              value: 0,
              label: this.$t('vicenter.training.common.learningMethodList.0')
            },
            {
              value: 1,
              label: this.$t('vicenter.training.common.learningMethodList.1')
            }
          ],
          hiden: false,
          ruleProp: 'methodStatus'
        },
        {
          type: 'inputNum',
          models: '',
          min: 0,
          max: 0,
          precision: 0,
          getLabel: this.$t('vicenter.training.common.numberOfLearning'),
          ruleProp: 'num',
          isSolt: true,
          soltName: 'soltTestListCount'
        }
      ],
      addFormRule: { // 查询表单规则
        model: {
          testImgClass: [],
          testImgHashCodes: '',
          methodStatus: '',
          num: ''
        },
        refName: 'addForm',
        rule: {
          testImgClass: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.imageClassification'), trigger: 'change' }
          ],
          testImgHashCodes: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.hsCodes'), trigger: 'change' }
          ],
          methodStatus: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.imageClassification'), trigger: 'change' }
          ],
          num: [
            {
              required: true,
              trigger: 'change',
              validator (rule, value, callback) {
                if (value === 0 || !value) {
                  callback(new Error(self.$t('vicenter.training.common.numWarning')))
                } else {
                  callback()
                }
              }
            }
          ]
        }
      },
      tableGroup: [ // 表格数据列
        {
          type: 'index',
          model: 'index',
          width: '80px'
        },
        {
          type: 'text',
          model: 'userExamStartTime'
        },
        {
          type: 'text',
          model: 'userExamEndTime'
        },
        {
          type: 'text',
          model: 'userExamTime'
        },
        {
          type: 'text',
          model: 'review'
        },
        {
          type: 'progress',
          strokeWidth: 15,
          inside: false,
          model: 'userExamCumulativeProgress'
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
      examParams: { // 考试exercise子组件参数
        toFatherClose: this.closeExamModalData,
        colSpan: 1, // 图像分几列
        tdPadding: 20, // td的内边距
        exerciseType: 5, // Exercise组件类型1：老师答案 2：学员答题结果 3：考试，4：审图练习，5：图像学习
        isExerciseRight: true, // 是否有计时
        isAnswer: false, // 是否答题
        isExamRecord: false, // 是否显示考试结果
        recordActived: true // 是否显示已学或者已答
      },
      examModalData: { // 练习弹出层
        flag: false,
        width: '75%',
        resetModal: this.examResetModal,
        title: this.$t('vicenter.training.common.learn')
      },
      examTestList: [
        {
          models: '',
          ruleProp: 'testImgClass'
        },
        {
          models: '',
          ruleProp: 'testImgDesc'
        },
        {
          models: '',
          ruleProp: 'testImgHashCodes'
        }
      ],
      examTestImg: [],
      tempIndex: 0, // 解决查询条件和列表项重复的问题
      addHscodeData: {
        queryTxt: '',
        selectHscode: [],
        checkedNodes: []
      },
      // 查询hscode参数补充
      addHsNameData: []
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
    'addFormRule.model.testImgClass': function (newVal, oldVal) {
      console.log(newVal)
      if (String(newVal)) {
        this.getPracticeNum()
      }
    },
    'addFormRule.model.testImgHashCodes': function (newVal, oldVal) {
      console.log(newVal)
      if (String(newVal)) {
        this.getPracticeNum()
      }
    },
    'addFormRule.model.methodStatus': function (newVal, oldVal) {
      console.log(newVal)
      if (String(newVal)) {
        this.getPracticeNum()
      }
    }
  },
  methods: {
    addFocus () {
      this.$trainHsCodeFocus(this.addInputItem[1], this.addHscodeData)
    },
    addHscodeChange () {
      let hscodeItem = this.addInputItem[1]
      let selectNode = this.$trainHsCodeChange(hscodeItem, this.addHscodeData)
      this.addHsNameData = selectNode
      this.changeDeviceType('addForm', 'testImgHashCodes')
    },
    addGetRemoteHscode (query) {
      let hscodeItem = this.addInputItem[1]
      this.$trainGetRemoteHscode(query, hscodeItem, this.addHscodeData)
    },
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
        if (e.ruleProp === 'learningTime') {
          e.getLabel = this.$t('vicenter.training.common.learningTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'userExamStartTime') {
          e.label = this.$t('vicenter.training.common.startLearningTime')
        } else if (e.model === 'userExamEndTime') {
          e.label = this.$t('vicenter.training.common.lastLearningTime')
        } else if (e.model === 'userExamTime') {
          e.label = this.$t('vicenter.training.common.learningTimes')
        } else if (e.model === 'review') {
          e.label = this.$t('vicenter.training.common.numberOfLearning')
        } else if (e.model === 'userExamCumulativeProgress') {
          e.label = this.$t('vicenter.training.common.learningProgress')
        }
      })
      // 图像学习
      this.examTestList.forEach((e) => {
        if (e.ruleProp === 'testImgClass') {
          e.label = this.$t('vicenter.training.common.imageClassification')
        } else if (e.ruleProp === 'testImgHashCodes') {
          e.label = this.$t('vicenter.training.common.hsCodes')
        } else if (e.ruleProp === 'testImgDesc') {
          e.label = this.$t('vicenter.training.common.imageDesc')
        }
      })
      this.query()
    },
    query () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let { learningTime } = this.formRule.model
      if (learningTime != null && learningTime.length === 2) {
        params.startTime = this.$options.filters['formatDate'](learningTime[0], this.$t('vicenter.common.formatDate'))
        params.endTime = this.$options.filters['formatDate'](learningTime[1], this.$t('vicenter.common.formatDate'))
      }
      params.userExamSource = 1
      params.pcUserId = sessionStorage.getItem('userId')
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      this.getList(params)
    },
    getList (params) {
      // console.log(params)
      this.openLoading()
      ajax.getPractice(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          this.tableData.data = content
          this.tableData.data.forEach(item => {
            item.operation = this.operation
            // table值格式化
            item.userExamCumulativeProgress = Number(item.userExamCumulativeProgress)
            item.userExamStartTime = this.$options.filters['formatDate'](item.userExamStartTime, this.$t('vicenter.common.formatDate'))
            item.userExamEndTime = this.$options.filters['formatDate'](item.userExamEndTime, this.$t('vicenter.common.formatDate'))
            // item.userExamTime = Math.ceil(item.userExamTime / 1000 / 60)
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
      this.tableData.isPage = true
      this.tableData.data.forEach(item => {
        item.operation = this.operation
      })
    },
    // 获取学习(练习)的数量
    getPracticeNum () {
      if (!this.addFormRule.model.testImgHashCodes) {
        return
      }
      this.addInputItem[this.addInputItem.length - 1].models = 0
      this.addInputItem[this.addInputItem.length - 1].max = 0
      let params = JSON.parse(JSON.stringify(this.addFormRule.model))
      delete params.num
      params.testImgClass = params.testImgClass.join(',')
      params.pcUserId = sessionStorage.getItem('userId')
      if (params.testImgHashCodes && params.testImgHashCodes !== '' && params.testImgHashCodes.length > 0) {
        // params.hsIds = params.testImgHashCodes.join(',')
        // let testImgHashCodes = []
        // let hsNames = []
        // this.addHsNameData.forEach(e => {
        //   testImgHashCodes.push(e.hsCode)
        //   hsNames.push(e.name)
        // })
        // params.testImgHashCodes = testImgHashCodes.join(',')
        // params.hsNames = hsNames.join(',')
      } else {
        params.testImgHashCodes = ''
        params.hsNames = ''
        params.hsIds = ''
      }
      console.log(params)
      this.openLoading()
      ajax.getPracticeNum(params).then((res) => {
        // console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          this.addInputItem[this.addInputItem.length - 1].models = Number(res.data.result)
          this.addInputItem[this.addInputItem.length - 1].max = Number(res.data.result)
        }
      })
    },
    // 提交
    submit () {
      console.log(this.addFormRule)
      this.$refs['addForm'].$refs[this.addFormRule.refName].validate((valid) => {
        if (valid) {
          this.addPractice()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 生成学习(练习)的数据
    addPractice () {
      let params = JSON.parse(JSON.stringify(this.addFormRule.model))
      params.sourceStatus = 1 // 1 图像学习 2 审图练习
      params.testImgClass = params.testImgClass.join(',')
      params.pcUserId = sessionStorage.getItem('userId')
      if (params.testImgHashCodes && params.testImgHashCodes !== '' && params.testImgHashCodes.length > 0) {
        // params.hsIds = params.testImgHashCodes.join(',')
        // let testImgHashCodes = []
        // let hsNames = []
        // this.addHsNameData.forEach(e => {
        //   testImgHashCodes.push(e.hsCode)
        //   hsNames.push(e.name)
        // })
        // params.testImgHashCodes = testImgHashCodes.join(',')
        // params.hsNames = hsNames.join(',')
      } else {
        params.testImgHashCodes = ''
        params.hsNames = ''
        params.hsIds = ''
      }
      this.openLoading()
      ajax.addPractice(params).then((res) => {
        console.log(res, '生成学习(练习)的数据')
        if (res.data.flag) {
          let {count, userExamId, userInfo} = res.data.result
          // Exercise组件传参
          this.examParams.userExamId = userExamId
          Promise.all([
            this.practiceDate(userExamId)
          ]).then(result => {
            this.closeLoading()
            console.log(result, '获取题目集合')
            this.addModalData.flag = false // 关闭新增
            this.customReset()
            console.log(result[0])
            this.examTestImg = result[0]
            this.examModalData.flag = true
          }).catch(() => {
            this.closeLoading()
          })
        } else {
          this.closeLoading()
        }
      })
    },
    // 获取题目集合
    practiceDate (userExamId) {
      let params = {}
      params.userExamId = userExamId
      params.pcUserId = sessionStorage.getItem('userId')
      return new Promise(resolve => {
        ajaxTeacher.practiceDate(params).then(res => {
          // console.log(res.data.result, '获取题目集合')
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
    // 取消
    cancel () {
      this.addModalData.flag = false
      this.customReset()
    },
    // 学习
    handleCreate () {
      this.addFormRule.testImgHashCodes = ''
      this.addInputItem[1].models = []
      this.addHscodeData.selectHscode = []
      this.addModalData.flag = true
    },
    // 关闭练习弹出层
    closeExamModalData () {
      this.examModalData.flag = false
      this.query()
    },
    // 练习窗口点击关闭
    examResetModal () {
      this.$refs.childs.endPractice()
    },
    // 选择器校验
    changeDeviceType (ref, param) {
      this.$changeSelectValidateField(ref, this, param)
    },
    // 自定义重置
    customReset () {
      console.log(111)
      this.$refs['addForm'].reset()
      this.addInputItem[0].models = [0, 1]
      this.addInputItem[2].models = 0
      this.addInputItem[this.addInputItem.length - 1].max = 0
    },
    resetForm () {
      // this.query()
    },
    getDetail (scope) {},
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
      if (this.formRule.model.learningTime === null || this.formRule.model.learningTime.length === 0) {
        times = {}
      } else {
        times = {
          startTime: this.formRule.model.learningTime[0],
          endTime: this.formRule.model.learningTime[1]
        }
      }
      var value = {
        userExamSource: 1,
        pcUserId: sessionStorage.getItem('userId'),
        page: page,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value, times)
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
  components: { bread, ComForm, panelTitle, ComTable, upload, Dialog, Exercise }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.imageLearningList-bar {
  @extend .extend-bar;
  .imageLearningList-M {
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
        width: 35% !important;
      }
      .search-form {
        @include layout(1);
        .search-form-item{
          text-align: left;
        }
      }
      .search-form-btn .el-form-item__content {
        display: none;
      }
      .soltTestListCount{
        margin-left: $margin;
      }
      .resultbutton {
        padding-top: 5px;
        text-align: right;
      }
      .addtraicSelect {
        min-width: 260px;
        width: $all;
        .el-select__tags {
          flex-wrap: nowrap;
          .el-tag--info {
            white-space: nowrap!important;
          }
          .el-tag--info:first-child {
            position: relative;
            // max-width: 60%;
            padding-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            .el-icon-close {
              position: absolute;
              top: 5px;
              right: 0;
            }
          }
        }
        .reset-option-width{
          max-width: unset;
        }
        .el-select-dropdown{
          width: 47%;
        }
      }
    }
    .exerciseDialog {
      .exercise-top-left {
        .table-hs-code {
          .table-hs-code-label {
            width: 19.3%;
            @include flex(row, center, center);
          }
        }
      }
    }
  }

}
</style>
