<template>
  <div class='testPaperMsg-bar'>
    <div class="testPaperMsg-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group" v-if="!testListId">
        <el-button data-id="back-btn" size="mini" @click='back'>{{$t('vicenter.training.common.back')}}</el-button>
        <el-button data-id="temporary-btn" type="warning" size="mini" @click='handleSave(2)'>{{$t('vicenter.training.common.temporary')}}</el-button>
        <el-button data-id="release-btn" type="primary" size="mini" @click='handleSave(0)'>{{$t('vicenter.training.common.release')}}</el-button>
      </div>
      <div class="operation-group" v-else>
        <el-button data-id="back-btn" size="mini" @click='back'>{{$t('vicenter.training.common.back')}}</el-button>
        <el-button data-id="temporary-btn" type="warning" size="mini" @click='submit(2)'>{{$t('vicenter.training.common.temporary')}}</el-button>
        <el-button data-id="release-btn" type="primary" size="mini" @click='submit(0)'>{{$t('vicenter.training.common.release')}}</el-button>
      </div>
      <!-- 表格内容 -->
      <div class="info-container">
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.basicTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <div>
              <ComForm ref="searchFormRef" :fromClass="firstFormClass" :searchIpt="searchIpt" :searchFunc="{}" :formRule='formRule'>
                <template v-slot:soltTable>
                  <div class="operation-group">
                    <el-button data-id="add-btn" type="primary" size="mini" @click='handleCreate'>{{$t('vicenter.training.common.add')}}</el-button>
                  </div>
                  <ComTable class="soltTable" ref="addTestQuestionsTable" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
                </template>
                <template v-slot:soltTestListCount>
                  <p class="soltTestListCount">{{$t('vicenter.training.common.availableTestListCount')}}：{{searchIpt[searchIpt.length-2].max}}</p>
                </template>
              </ComForm>
            </div>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData" v-if="modalData.flag" class="formDialog">
        <ComForm ref="addSearchFormRef" :searchIpt="addInputItem" :searchFunc="addSearchFunc" :formRule='addFormRule'></ComForm>
        <div class="operation-group">
          <el-button data-id="import-btn" type="primary" size="mini" @click='handleImport'>{{$t('vicenter.training.common.add')}}</el-button>
        </div>
        <ComTable class="soltTable" ref="searchTestQuestionsTable" @listenToSelectDataEvent='selectRow' :tableData="addTableData" :tableGroup="addTableGroup" ></ComTable>
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
import ajaxManager from '@/api/training/manager.js'
export default {
  name: 'demo',
  data () {
    let self = this
    return {
      modalData: {
        flag: false,
        resetModal: this.resetManualHscodeIpt,
        title: this.$t('vicenter.training.common.selectQuestions'),
        top: '100px'
      },
      firstFormClass: {
        form: 'search-form',
        formItem: 'search-form-item',
        label: 'search-form-label',
        iptClass: 'search-form-input',
        buttonClass: 'search-form-btn'
      },
      titleBread: {}, // 面包屑
      panelTitle: {}, // 标题栏
      hsCode: false,
      searchIpt: [ // 新增表单
        {
          getLabel: this.$t('vicenter.training.common.testPaperClassification'),
          type: 'select',
          clearable: true,
          models: 0,
          change: this.change,
          option: [
            {
              key: 0,
              value: 0,
              label: this.$t('vicenter.training.common.testPaperClassificationList.0')
            },
            {
              key: 1,
              value: 1,
              label: this.$t('vicenter.training.common.testPaperClassificationList.1')
            }
          ],
          ruleProp: 'testListClass'
        },
        {
          getLabel: this.$t('vicenter.training.common.testPaperName'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testPaperName'),
          ruleProp: 'testListName'
        },
        {
          getLabel: this.$t('vicenter.training.common.testPaperDescription'),
          type: 'textarea',
          models: '',
          minSize: 1,
          maxlength: 100,
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testPaperDescription'),
          ruleProp: 'testListDesc',
          isSolt: false,
          soltName: 'soltTable'
        },
        {
          getLabel: this.$t('vicenter.training.common.imageClassification'),
          type: 'checkbox',
          models: [0, 1],
          change: this.changeTestImgClass,
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
        //   ruleProp: 'testListHashCodes',
        //   clearable: true,
        //   option: [],
        //   reserveKeyword: true,
        //   loading: false,
        //   change: this.addHscodeChange,
        //   remoteMethod: this.addGetRemoteHscode,
        //   focus: this.addFocus,
        //   iptClass: 'traicSelect',
        //   multiple: true
        // },
        {
          getLabel: this.$t('vicenter.training.common.hsCodes'),
          placeHolder: ' ',
          models: '',
          options: [],
          ruleProp: 'testListHashCodes',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'hsCodesInput',
          treeDataId: 'hsCodesData',
          readonly: true,
          disabled: false,
          change: () => { this.changeDeviceType('searchFormRef', 'testListHashCodes') },
          check: this.hsCodesCheckChange,
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
            treeClick: this.treeClick,
            maxLimit: null // 标准图最多选择一个，违规图可以多个
          },
          hiden: false
        },
        {
          type: 'inputNum',
          models: '',
          min: 0,
          max: 0,
          precision: 0,
          getLabel: this.$t('vicenter.training.common.numberOfQuestions'),
          ruleProp: 'testListCount',
          isSolt: true,
          soltName: 'soltTestListCount'
        },
        {
          type: 'inputNum',
          models: '',
          min: 0,
          max: 0,
          precision: 0,
          getLabel: this.$t('vicenter.training.common.passNumber'),
          ruleProp: 'testListPassCount'
        }
      ],
      formRule: { // 查询表单规则
        model: {
          testListClass: 0,
          testListName: '',
          testListDesc: '',
          testImgClass: '',
          testListHashCodes: '',
          testListCount: '',
          testListPassCount: ''
        },
        refName: 'queryForm',
        rule: {
          testListClass: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.testPaperClassification'), trigger: 'change' }
          ],
          testListName: [
            { required: true, message: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testPaperName'), trigger: 'blur' }
          ],
          testImgClass: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.imageClassification'), trigger: 'change' }
          ],
          testListHashCodes: [
            { required: true, message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.hsCodes'), trigger: 'change' }
          ],
          testListCount: [
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
          ],
          testListPassCount: [
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
      testListId: '', // 试卷主键
      tableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.training.common.serialNumber'),
          type: 'index',
          model: 'index'
        },
        {
          label: this.$t('vicenter.training.common.imagePath'),
          type: 'img',
          height: '50px',
          model: 'listEntities'
        },
        {
          label: this.$t('vicenter.training.common.imageClassification'),
          type: 'text',
          model: 'testImgClass'
        },
        {
          label: this.$t('vicenter.training.common.imageName'),
          type: 'text',
          model: 'testImgName'
        },
        {
          label: this.$t('vicenter.training.common.hsCodes'),
          type: 'text',
          model: 'testImgHashCodes'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      operation: [
        {
          func: this.handleDel, // 删除
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          title: this.$t('vicenter.common.delete'),
          show: true
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false
      },
      addInputItem: [ // 新增表单
        {
          getLabel: this.$t('vicenter.training.common.imageClassification'),
          type: 'select',
          clearable: true,
          models: '',
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
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.imageClassification'),
          ruleProp: 'testImgClass'
        },
        {
          getLabel: this.$t('vicenter.training.common.imageName'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.imageName'),
          ruleProp: 'testImgName'
        },
        // {
        //   getLabel: this.$t('vicenter.training.common.hsCodes'),
        //   type: 'selectRemote',
        //   models: [],
        //   ruleProp: 'testListHashCodes',
        //   clearable: true,
        //   option: [],
        //   reserveKeyword: true,
        //   loading: false,
        //   change: this.serachHscodeChange,
        //   remoteMethod: this.serachGetRemoteHscode,
        //   focus: this.serachFocus,
        //   iptClass: 'addtraicSelect',
        //   multiple: true
        // }
        {
          getLabel: this.$t('vicenter.training.common.hsCodes'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.hsCodes'),
          models: [],
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
        }
      ],
      addFormRule: { // 查询表单规则
        model: {
          testImgClass: '',
          imageName: '',
          testImgHashCodes: ''
        },
        refName: 'addForm',
        rule: {}
      },
      addSearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      addTableGroup: [ // 新增表格数据列
        {
          type: 'selection',
          width: '40px'
        },
        {
          label: this.$t('vicenter.training.common.imagePath'),
          type: 'img',
          height: '50px',
          width: '160px',
          model: 'listEntities'
        },
        {
          label: this.$t('vicenter.training.common.imageClassification'),
          type: 'text',
          model: 'testImgClass'
        },
        {
          label: this.$t('vicenter.training.common.imageName'),
          type: 'text',
          model: 'testImgName'
        },
        {
          label: this.$t('vicenter.training.common.hsCodes'),
          type: 'text',
          model: 'testImgHashCodes'
        }
      ],
      addTableData: { // 新增表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: true,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        sortMethod: this.getSort,
        MaxHeight: 550
      },
      selRow: [],
      tempIndex: 0, // 解决查询条件和列表项重复的问题
      addHscodeData: {
        queryTxt: '',
        selectHscode: [],
        checkedNodes: []
      },
      // hscode参数补充
      addHsNameData: [],
      hscodeData: {
        queryTxt: '',
        selectHscode: [],
        checkedNodes: []
      },
      // 查询hscode参数补充
      serachHsNameData: [],
      loadDetail: false // 是否加载了详情信息
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
    let testListId = sessionStorage.getItem('testListId')
    this.testListId = testListId
    this.getDetail()
  },
  mounted () {},
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  watch: {
    'formRule.model.testListHashCodes': function (newVal, oldVal) {
      if (this.loadDetail) {
        return
      }
      console.log('HashCodes监听', newVal)
      if (newVal && newVal.length > 0 && this.hsCode) {
        this.getQuestionInfo()
      } else if (this.hsCode) {
        this.resetCount()
      }
    },
    'formRule.model.testListClass': function (newVal, oldVal) { // 试卷分类切换
      // console.log(oldVal)
      // console.log(newVal)
      if (newVal === 0) {
        this.searchIpt[3].hiden = false
        this.searchIpt[4].hiden = false
        this.searchIpt[2].isSolt = false
        this.searchIpt[this.searchIpt.length - 2].isSolt = true
        this.searchIpt[this.searchIpt.length - 2].type = 'inputNum'
        this.searchIpt[this.searchIpt.length - 2].disabled = false
        this.formRule.rule.testImgClass[0].required = true
        this.formRule.rule.testListHashCodes[0].required = true
        this.searchIpt[this.searchIpt.length - 2].max = 0
      } else {
        this.searchIpt[3].hiden = true
        this.searchIpt[4].hiden = true
        this.searchIpt[2].isSolt = true
        this.searchIpt[this.searchIpt.length - 2].isSolt = false
        this.searchIpt[this.searchIpt.length - 2].type = 'text'
        this.searchIpt[this.searchIpt.length - 2].disabled = true
        this.formRule.rule.testImgClass[0].required = false
        this.formRule.rule.testListHashCodes[0].required = false
      }
    },
    'tableData.data': function (newVal, oldVal) {
      // console.log(newVal, '表格数据监听')
      // this.searchIpt[this.searchIpt.length - 2].max = Number(this.tableData.data.length)
      if (this.hsCode) {
        this.searchIpt[this.searchIpt.length - 1].max = Number(this.tableData.data.length)
        this.searchIpt[this.searchIpt.length - 1].models = Math.ceil(Number(this.tableData.data.length) * 0.6)
        this.searchIpt[this.searchIpt.length - 2].models = Number(this.tableData.data.length)
      }
    }
  },
  methods: {
    resetCount () {
      this.searchIpt[5].models = 0
      this.searchIpt[6].models = 0
      this.formRule.model.testListCount = 0
      this.formRule.model.testListPassCount = 0
      this.searchIpt[this.searchIpt.length - 2].max = 0
      this.searchIpt[this.searchIpt.length - 1].max = 0
    },
    addFocus () {
      this.$trainHsCodeFocus(this.searchIpt[4], this.addHscodeData)
    },
    addHscodeChange () {
      this.loadDetail = false
      let hscodeItem = this.searchIpt[4]
      let selectNode = this.$trainHsCodeChange(hscodeItem, this.addHscodeData)
      this.addHsNameData = selectNode
      this.changeDeviceType('searchFormRef', 'testListHashCodes')
    },
    addGetRemoteHscode (query) {
      let hscodeItem = this.searchIpt[4]
      this.$trainGetRemoteHscode(query, hscodeItem, this.addHscodeData)
    },
    serachFocus () {
      this.$trainHsCodeFocus(this.addInputItem[2], this.hscodeData)
    },
    serachHscodeChange () {
      let hscodeItem = this.addInputItem[2]
      let selectNode = this.$trainHsCodeChange(hscodeItem, this.hscodeData)
      this.serachHsNameData = selectNode
    },
    serachGetRemoteHscode (query) {
      let hscodeItem = this.addInputItem[2]
      this.$trainGetRemoteHscode(query, hscodeItem, this.hscodeData)
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
      // 查询和重置按钮
      this.addSearchFunc.queryText = this.$t('vicenter.common.query')
      this.addSearchFunc.resetText = this.$t('vicenter.common.reset')
      // 查询条件和列表title
      this.panelTitle = {
        basicTitle: {
          title: this.$t('vicenter.training.common.basicInformation')
        },
        coursewareTitle: {
          title: this.$t('vicenter.training.common.coursewareInformation')
        },
        studentTitle: {
          title: this.$t('vicenter.training.common.studentInformation')
        }
      }
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'courseware') {
          e.label = this.$t('vicenter.training.common.courseware')
        } else if (e.model === 'coursewarePermissions') {
          e.label = this.$t('vicenter.training.common.coursewarePermissions')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
    },
    // 暂存和发布
    handleSave (num) {
      this.$refs['searchFormRef'].$refs[this.formRule.refName].validate((valid) => {
        let params = JSON.parse(JSON.stringify(this.formRule.model))
        params.pcUserId = sessionStorage.getItem('userId')
        params.testImgClass = params.testImgClass.join(',') // 图像类型
        params.testListStatus = num // 暂存还是发布
        params.testListClass = this.formRule.model.testListClass === 0 ? 0 : 1 // 试卷分类
        // let hscodeArr = {
        //   id: [],
        //   code: [],
        //   name: []
        // }
        // this.addHscodeData.selectHscode.forEach(e => {
        //   hscodeArr.code.push(e.hsCode)
        //   hscodeArr.id.push(e.id)
        //   hscodeArr.name.push(e.name)
        // })
        // params.testListHashCodes = hscodeArr.code.join(',')
        // params.hsIds = hscodeArr.id.join(',')
        // params.hsNames = hscodeArr.name.join(',')
        console.log(params)
        if (valid) {
          if (params.testListPassCount > params.testListCount) { // 2020-07-25 及格数大总数数
            return this.$NotifError(this.$t('vicenter.training.common.quantityMismatch'))
          }
          if (this.formRule.model.testListClass === 0) {
            this.andomSave(params)
          } else {
            this.manualSave(params)
          }
        }
      })
    },
    // 取消
    cancel () {
      this.$router.go(-1)
    },
    // 提交
    submit (submitType) {
      this.$refs['searchFormRef'].$refs[this.formRule.refName].validate((valid) => {
        let params = JSON.parse(JSON.stringify(this.formRule.model))
        params.testListStatus = submitType // 暂存还是发布
        params.testListId = this.testListId // 试卷主键
        if (params.testImgClass) {
          params.testImgClass = params.testImgClass.join(',') // 图像类型
        }
        params.testListClass = this.formRule.model.testListClass === 0 ? 0 : 1 // 试卷分类
        if (valid) {
          if (params.testListPassCount > params.testListCount) { // 2020-07-25 及格数大总数数
            return this.$NotifError(this.$t('vicenter.training.common.quantityMismatch'))
          }
          console.log(params, '更新参数')
          this.updateTestPaperBySave(params)
        }
      })
    },
    // 更改试卷数据
    updateTestPaperBySave (params) {
      // let hscodeArr = {
      //   id: [],
      //   code: [],
      //   name: []
      // }
      // this.addHscodeData.selectHscode.forEach(e => {
      //   hscodeArr.code.push(e.hsCode)
      //   hscodeArr.id.push(e.id)
      //   hscodeArr.name.push(e.name)
      // })
      // params.testListHashCodes = hscodeArr.code.join(',')
      // params.hsIds = hscodeArr.id.join(',')
      // params.hsNames = hscodeArr.name.join(',')
      this.openLoading()
      ajax.updateTestPaperBySave(params).then((res) => {
        this.closeLoading()
        console.log(res)
        if (res.data.flag) {
          if (res.data.result !== 900004) {
            this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
            setTimeout(() => {
              this.$router.push({
                path: '/Training/teacher/testPaperList'
              })
            }, 2000)
          } else {
            this.$NotifError(this.$t('vicenter.training.common.testPaperNameRepeating'))
          }
        }
      })
    },
    // 随机保存(生成试卷)
    andomSave (params) {
      this.openLoading()
      ajax.andomSave(params).then((res) => {
        this.closeLoading()
        console.log(res)
        if (res.data.flag) {
          if (res.data.result !== 900004) {
            this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
            setTimeout(() => {
              this.$router.push({
                path: '/Training/teacher/testPaperList'
              })
            }, 2000)
          } else {
            this.$NotifError(this.$t('vicenter.training.common.testPaperNameRepeating'))
          }
        }
      })
    },
    // 手动保存(生成试卷)
    manualSave (params) {
      this.openLoading()
      ajax.manualSave(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          if (res.data.result !== 900004) {
            this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
            setTimeout(() => {
              this.$router.push({
                path: '/Training/teacher/testPaperList'
              })
            }, 2000)
          } else {
            this.$NotifError(this.$t('vicenter.training.common.testPaperNameRepeating'))
          }
        }
      })
    },
    // 手选组卷新增
    handleCreate () {
      this.setAddFormData()
      this.query(() => {
        this.modalData.flag = true
        this.selRow = []
      })
    },
    // 查询题库
    query (callBack = Function) {
      let params = {}
      params = JSON.parse(JSON.stringify(this.addFormRule.model))
      params.testImgStatus = 0
      params.testImgForWhat = '0,2'
      params.imgIds = this.tableData.data.map(item => {
        return item.testImgId
      }).join(',')
      params.page = this.addTableData.page.CurrentPage
      params.size = this.addTableData.page.pagesize
      // console.log(this.addInputItem)
      this.getList(params, callBack)
    },
    // 获取题库信息(分页)
    getList (params, callBack = Function) {
      if (params.testListHashCodes && params.testListHashCodes !== '' && params.testListHashCodes.length > 0) {
        params.hsIds = params.testListHashCodes.join(',')
        let testImgHashCodes = []
        let hsNames = []
        this.serachHsNameData.forEach(e => {
          testImgHashCodes.push(e.hsCode)
          hsNames.push(e.name)
        })
        params.testImgHashCodes = testImgHashCodes.join(',')
        params.hsNames = hsNames.join(',')
      }
      this.openLoading()
      ajaxManager.getQuestionBank(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          this.addTableData.data = content
          this.addTableData.data.forEach(item => {
            item.id = item.testImgId
            // 图像
            // item.listEntities = item.testImgClass === '0' ? window.config.trainingUI.fileUrl + item.listEntities[0].originalThumbnail : window.config.trainingUI.fileUrl + item.listEntities[0].suspectThumbnail
            item.listEntities = window.config.trainingUI.fileUrl + item.listEntities[0].originalThumbnail
            // 图像分类
            item.testImgClass = this.$t(`vicenter.training.common.imageClassificationList.${item.testImgClass}`)
          })
          if (this.addTableData.data.length > 0) {
            this.addTableData.isPage = true
          }
          this.addTableData.page.CurrentPage = pageable.pageNumber
          this.addTableData.page.pagesize = pageable.pageSize
          this.addTableData.page.Allpage = totalElements
          // 查询条件
          this.addFormRule.model.page = pageable.pageNumber
          this.addFormRule.model.size = pageable.pageSize
          callBack()
        }
      })
    },
    setEditHscode (formItem, testPaperInfo) {
      formItem.option = this.$trainSetHscodeEdit(testPaperInfo, 'testListHashCodes')
      this.addHscodeData.selectHscode = this.$trainGetSelectHscode(formItem.option)
      this.$nextTick(() => {
        formItem.models = testPaperInfo.hsIds.split(',')
      })
    },
    // 获取详情
    getDetail () {
      if (this.testListId) {
        this.openLoading()
        ajax.getTestPaperInfo({testListId: this.testListId}).then(res => {
          console.log(res)
          this.closeLoading()
          if (res.data.flag) {
            this.loadDetail = true
            let {imgInfoEntityList, testPaperInfo} = res.data.result
            // console.log(testPaperInfo)
            // 手选组卷
            if (testPaperInfo.testListClass === 1) {
              this.hsCode = false
              this.searchIpt[this.searchIpt.length - 2].max = Number(imgInfoEntityList.length)
              this.searchIpt[this.searchIpt.length - 1].max = Number(imgInfoEntityList.length)
              this.searchIpt[this.searchIpt.length - 1].models = Number(testPaperInfo.testListCount)
              this.searchIpt[this.searchIpt.length - 1].models = Number(testPaperInfo.testListPassCount)
              this.tableData.data = imgInfoEntityList
              this.tableData.data.forEach(item => {
                console.log(item)
                // 图像
                // item.listEntities = item.testImgClass === '0' ? window.config.trainingUI.fileUrl + item.listEntities[0].originalThumbnail : window.config.trainingUI.fileUrl + item.listEntities[0].suspectThumbnail
                item.listEntities = window.config.trainingUI.fileUrl + item.listEntities[0].originalThumbnail
                // 图像分类
                item.testImgClass = this.$t(`vicenter.training.common.imageClassificationList.${item.testImgClass}`)
                item.operation = this.operation
              })
              this.$initSearchIpt(this.searchIpt, testPaperInfo)
              this.searchIpt[0].disabled = true
            } else {
              this.hsCode = true
              if (testPaperInfo.testListType === '0') {
                testPaperInfo.testImgClass = [1]
              } else if (testPaperInfo.testListType === '1') {
                testPaperInfo.testImgClass = [0]
              } else if (testPaperInfo.testListType === '2') {
                testPaperInfo.testImgClass = [0, 1]
              }
              let params = {}
              params.testImgName = testPaperInfo.testImgName
              params.testImgClass = testPaperInfo.testImgClass.join(',')
              params.testImgHashCodes = testPaperInfo.testListHashCodes
              this.getQuestionInfo2(params, () => {
                this.$initSearchIpt(this.searchIpt, testPaperInfo)
                this.setEditHscode(this.searchIpt[4], testPaperInfo)
                this.searchIpt[0].disabled = true
              })
            }
            // 参数
            this.formRule.model.testImgId = imgInfoEntityList.map(item => item.testImgId).join(',')
            console.log(this.searchIpt, '基础信息表单')
            if (testPaperInfo.testListHashCodes) {
              this.formRule.model.testListHashCodes = testPaperInfo.testListHashCodes
              this.formRule.model.hsIds = testPaperInfo.hsIds
              this.formRule.model.hsNames = testPaperInfo.hsNames
            }
          }
        })
      }
    },
    // 根据条件查询试题条数
    getQuestionInfo () {
      // console.log(this.testListId)
      this.searchIpt[this.searchIpt.length - 2].models = 0
      this.searchIpt[this.searchIpt.length - 1].models = 0
      let params = {}
      params.testImgName = this.formRule.model.testImgName
      params.testImgClass = this.formRule.model.testImgClass.join(',')
      params.testImgHashCodes = this.formRule.model.testListHashCodes
      // params.testImgHashCodes = this.formRule.model.testListHashCodes.join(',')
      // params.testImgHashCodes = ''
      // let hscodeArr = []
      // this.addHscodeData.selectHscode.forEach(e => {
      //   hscodeArr.push(e.hsCode)
      // })
      // params.testImgHashCodes = hscodeArr.join(',')
      if (params.testImgHashCodes === '') {
        return
      }
      this.openLoading()
      ajax.getQuestionInfo(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          this.formRule.model.testImgId = res.data.result.ids.join(',')
          this.searchIpt[this.searchIpt.length - 2].max = Number(res.data.result.count)
          this.searchIpt[this.searchIpt.length - 1].max = Number(res.data.result.count)
          this.searchIpt[this.searchIpt.length - 2].models = Number(res.data.result.count)
          this.searchIpt[this.searchIpt.length - 1].models = Math.ceil(Number(res.data.result.count) * 0.6)
        }
      })
    },
    // 初始化回显时根据条件查询试题条数
    getQuestionInfo2 (params, callBack) {
      this.openLoading()
      ajax.getQuestionInfo(params).then((res) => {
        // console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          this.searchIpt[this.searchIpt.length - 2].max = Number(res.data.result.count)
          this.searchIpt[this.searchIpt.length - 1].max = Number(res.data.result.count)
          callBack()
        }
      })
    },
    // 图像分类切换
    changeTestImgClass () {
      if (this.formRule.model.testListHashCodes && this.formRule.model.testImgClass.length > 0) {
        this.getQuestionInfo()
      }
    },
    // 试卷分类切换
    change () {
      this.searchIpt[0].KeepDefault = true
      if (this.formRule.model.testListClass === 0) {
        this.searchIpt[0].defaultValue = 1
      } else {
        this.searchIpt[0].defaultValue = 0
      }
      this.$refs['searchFormRef'].reset()
      if (this.formRule.model.testListClass === 0) {
        this.searchIpt[3].models = [0, 1]
      } else {
        this.searchIpt[3].models = []
      }
      this.tableData.data = []
      // 重置testListCount、testListPassCount
      this.setAddFormData()
      this.resetManualHscodeIpt()
      this.resetRandomHscodeIpt()
    },
    setAddFormData () {
      this.addHscodeData.selectHscode = []
      this.hscodeData.selectHscode = []
      console.log(this.addInputItem)
      this.addInputItem[2].models = []
      this.addInputItem[2].option = []
      this.addFormRule.model.testImgHashCodes = ''
      this.addFormRule.model.testListHashCodes = []
    },
    resetForm () {
      this.setAddFormData()
      this.query()
    },
    // 新增导入
    handleImport () {
      console.log(this.selRow)
      this.hsCode = true
      this.tableData.data = this.tableData.data.concat(this.selRow)
      this.tableData.data.forEach(item => {
        item.operation = this.operation
      })
      // 试题主键参数
      let testImgIdArr = this.tableData.data.map(item => {
        return item.testImgId
      })
      this.formRule.model.testImgId = testImgIdArr.join(',')
      this.modalData.flag = false
      this.resetManualHscodeIpt()
    },
    // 列表选中行
    selectRow (data) {
      console.log(data)
      let idArr = data.map(el => {
        return el
      })
      this.$data.selRow = JSON.parse(JSON.stringify(idArr))
    },
    // 列表删除
    handleDel (scope) {
      // console.log(scope)
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        this.tableData.data.forEach((item, index) => {
          if (item.testImgId === scope.row.testImgId) {
            this.tableData.data.splice(index, 1)
            let testImgIdArr = this.formRule.model.testImgId.split(',')
            let testImgIdIndex = testImgIdArr.indexOf(scope.row.testImgId)
            testImgIdArr.splice(testImgIdIndex, 1)
            this.formRule.model.testImgId = testImgIdArr.join(',')
            this.hsCode = true
          }
        })
        // console.log(this.tableData.data)
        this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteSuccess'))
      })
    },
    // 选择器校验
    changeDeviceType (ref, param) {
      this.loadDetail = false
      console.log('select')
      this.$changeSelectValidateField(ref, this, param)
      this.hsCode = true
    },
    handleSizeChange (val) {
      this.addFormRule.model.size = val
      this.addFormRule.model.page = 0
      this.$set(this.addTableData.page, 'pagesize', val)
      this.SetpageQuery(0)
    },
    handleCurrentChange (val) {
      this.addFormRule.model.page = val - 1
      this.SetpageQuery(this.addFormRule.model.page)
    },
    SetpageQuery (page) { // 查询设置页
      var value = {
        testImgClass: this.addFormRule.model.testImgClass,
        imageName: this.addFormRule.model.imageName,
        testImgHashCodes: this.addFormRule.model.testImgHashCodes,
        testImgStatus: 0,
        testImgForWhat: '0,2',
        page: page,
        size: this.addTableData.page.pagesize
      }
      value.imgIds = this.tableData.data.map(item => {
        return item.testImgId
      }).join(',')
      var val = Object.assign({}, value)
      this.getList(val)
    },
    // 返回
    back () {
      this.$router.push({path: '/Training/teacher/testPaperList'})
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
    // 点击名称
    treeClick (data) {},
    hsCodesCheckChange (data) {
      console.log(data)
    },
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    },
    resetManualHscodeIpt () {
      console.log('重置手选组卷的hscode选择框')
      this.addInputItem.forEach(e => {
        if (e.ruleProp === 'testImgHashCodes') {
          e.models = []
          e.options = []
          e.checkedOption = []
          e.goodsOption.checkedKeys = []
        }
      })
      this.addFormRule.model.hsIds = ''
      this.addFormRule.model.hsNames = ''
    },
    resetRandomHscodeIpt () {
      console.log('重置随机组卷的hscode选择框')
      this.searchIpt.forEach(e => {
        if (e.ruleProp === 'testImgHashCodes') {
          e.models = []
          e.options = []
          e.checkedOption = []
          e.goodsOption.checkedKeys = []
        }
      })
      this.formRule.model.hsIds = ''
      this.formRule.model.hsNames = ''
    }
  },
  beforeRouteLeave (to, from, next) {
    sessionStorage.removeItem('testListId')
    next()
  },
  components: { bread, ComForm, panelTitle, ComTable, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.testPaperMsg-bar {
  @extend .extend-bar;
  .testPaperMsg-M {
    padding:$margin;
    @include box-sizing;
    height: $all;
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
    .info-container {
      height: calc(100% - 70px);
      .panel {
        width: $all;
        height: $all;
        @extend .extend-panel;
        @include flex(column, flex-start, flex-start);
        .search-form {
          @include layout(3);
          align-items: flex-start;
          padding: 20px;
          .search-form-item{
            text-align: left;
            position: relative;
            .tableComp{
              padding: 0;
              margin-top: $margin;
            }
          }
          .search-form-item:nth-child(3) {
            .soltTable {
              width: calc(100vw - 150px);
              margin-left:calc(-100vw + 150px + 100%);
            }
          }
          .search-form-item:nth-child(4),
          .search-form-item:nth-child(5),
          .search-form-item:nth-child(6),
          .search-form-item:nth-child(7) {
            width: 100%!important;
          }
          .search-form-item:nth-child(5), .search-form-item:nth-child(6) {
            .el-form-item__content {
              width: 32%;
            }
          }
          .el-tag__close,.search-form-btn{
            display: none;
          }
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
      .operation-group {
        @include flex(row, flex-end, center);
        margin-top: $margin;
      }
      .soltTestListCount{
        margin-left: $margin;
      }
    }
    .formDialog{
      .el-dialog {
        width: 60% !important;
      }
      .operation-group {
        @include flex(row, flex-start, center);
      }

      .search-form-btn .el-form-item__content {
        display: block;
      }
      .search-form {
        @include layout(3);
        .search-form-item{
          text-align: left;
        }
        .el-input__inner{
          height: 32px;
          line-height: 32px;
        }
      }
      .tableComp{
        padding: 0;
      }
    }
    .addtraicSelect, .traicSelect {
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
    .addtraicSelect {
      min-width: unset;
      .el-select-dropdown{
        width: 18%;
      }
    }
  }
}
</style>
