<template>
  <div class='Manage-Physical-bar' v-bar>
    <div class="Manage-Physical-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="infolist">
          <div class="panel panel-Q">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
              <el-button type="primary" size="mini" @click="openSearchDialog" data-id="querySet-btn">{{$t('vicenter.common.set')}}</el-button>
            </panelTitle>
            <div class="form-bar" v-bar>
              <ComForm ref="searchFormRef" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
            </div>
          </div>
          <div class="panel panel-L">
            <panelTitle :panelTitleInit="panelTitle.listTitle">
              <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
              <el-button type="primary" size="mini" @click="openListDialog" data-id="tableSet-btn">{{$t('vicenter.common.set')}}</el-button>
            </panelTitle>
            <div class="form-bar" v-bar>
              <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
            </div>
          </div>
        </div>
        <div class="assign_task">
          <Dialog :modalData="assginTaskmodal">
            <div class="form-bar" v-bar>
              <ComTable ref="personTable" @listenCurrentChange='listenCurrentChange' @listenToSelectDataEvent='selectRow' :tableData='assignTaskTable.tableData' :tableGroup='assignTaskTable.tableGroup'></ComTable>
            </div>
            <div class="resultbutton">
              <el-button @click="assignTask()" type="primary" size="mini" >{{$t('vicenter.common.sure')}}</el-button>
              <el-button @click="closeModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
            </div>
          </Dialog>
        </div>
        <el-dialog :title="searchTransfer.title" :visible.sync="searchTransfer.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag' class='searchTransfer'>
          <div class="transfer-box" v-loading="isSavingSearch" element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-transfer v-if="isOpenSearch" v-model="searchTransfer.transfer.model" :data="searchTransfer.transfer.data" :titles="searchTransfer.transfer.title" :button-texts="searchTransfer.transfer.button" target-order="push" :right-default-checked="transferDefaultS" data-id="search-transfer"></el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="searchTransfer.transfer.model.length === 0 || isSavingSearch" @click="saveSearchTranfer" data-id="searchTransferSave-btn">{{this.$t('vicenter.common.save')}}</el-button>
            <el-button :disabled="isSavingSearch" @click="dontSaveSearchTranfer" data-id="searchTransferBack-btn">{{this.$t('vicenter.common.back')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="listTransfer.title" :visible.sync="listTransfer.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag' class='searchTransfer'>
          <div class="transfer-box" v-loading="isSavingList" element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-transfer v-if="isOpenList" v-model="listTransfer.transfer.model" :data="listTransfer.transfer.data" :titles="listTransfer.transfer.title" :button-texts="listTransfer.transfer.button" target-order="push" :right-default-checked="transferDefaultL" data-id="list-transfer"></el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="listTransfer.transfer.model.length === 0 || isSavingList" @click="saveListTranfer" data-id="listTransferSave-btn">{{this.$t('vicenter.common.save')}}</el-button>
            <el-button :disabled="isSavingList" @click="dontSaveListTranfer" data-id="listTransferBack-btn">{{this.$t('vicenter.common.back')}}</el-button>
          </div>
        </el-dialog>
     </div>
  </div>
</template>
<script>
import breadCrumb from '../../components/breadCrumb'
import ComForm from '../../components/form'
import panelTitle from '../../components/title'
import ComTable from '../../components/table'
import ajax from '../../api/inspection/Manage-Physical.js'
import commonAjax from '../../api/common/common.js'
import Dialog from '@/components/dialog'
export default {
  name: 'Assessment-settings',
  data () {
    return {
      exportButton: false,
      sysMenu: 'PHYSICAL_INSPECTION_CASE_MANAGEMENT',
      titleBread: { // 面包屑导航组件初始化
        // data: [
        //   {
        //     label: this.$t(this.$route.matched[0].meta.title),
        //     path: '/Inspection/index' // 跳转路径
        //   },
        //   {
        //     label: this.$t(this.$route.name)
        //   }
        // ]
      },
      panelTitle: { // title组件数据
        // queryTitle: {
        //   title: this.$t('vicenter.common.query')
        // },
        // listTitle: {
        //   title: this.$t('vicenter.common.list')
        // }
      },
      inputItemRes: [
        {
          // getLabel: this.$t('vicenter.inspection.common.office'),
          type: 'treeInput',
          // placeHolder: this.$t('vicenter.inspection.common.enterOffice'),
          models: '',
          ruleProp: 'siteId',
          treedata: [],
          treeView: false,
          treeIptId: 'treeInput',
          treeDataId: 'treeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.siteIdCheckChange,
          treeRefName: 'siteIdtreeIptRef'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.scannerID'),
          type: 'treeInput',
          // placeHolder: this.$t('vicenter.inspection.common.enterScannerID'),
          models: '',
          ruleProp: 'deviceId',
          treedata: [],
          treeView: false,
          treeIptId: 'deviceIdtreeInput',
          treeDataId: 'deviceIdtreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.deviceIdCheckChange,
          treeRefName: 'deviceIdtreeIptRef'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.taskID'),
          type: 'text',
          models: '',
          ruleProp: 'scanSerialNumber'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.LPN'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.common.enterLPN'),
          models: '',
          ruleProp: 'lpnFront'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.declarationNo'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.common.enterDeclarationNo'),
          models: '',
          ruleProp: 'decNumCvs'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.containerNo'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.common.enterContainerNo'),
          models: '',
          ruleProp: 'containerNumCsv'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.checkInTime'),
          type: 'datetimerange',
          // startPlace: this.$t('vicenter.common.startTime'),
          // endPlace: this.$t('vicenter.common.endTime'),
          models: [],
          ruleProp: 'checkinTime'
          // format: this.$t('vicenter.common.pickerFmt')
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.status'),
          type: 'select',
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: '',
          ruleProp: 'status',
          clearable: true,
          option: [
            // {
            //   value: 'WAITING_MANUAL_CHECK',
            //   label: this.$t('vicenter.DIC.T_TASK_STATUS.C_WAITING_MANUAL_CHECK')
            // },
            // {
            //   value: 'MANUAL_CHECK_LOCKED',
            //   label: this.$t('vicenter.DIC.T_TASK_STATUS.C_MANUAL_CHECK_LOCKED')
            // }
          ]
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.physicalInspector'),
          type: 'select2',
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: [],
          ruleProp: 'phyInspectorId',
          roleCode: 'PHYSICAL-INSPECTOR',
          option: []
        }
      ],
      queryFn: { // 页面表单查询方法
        // query: this.query,
        // queryText: this.$t('vicenter.common.query'),
        // resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        model: {
          siteId: '',
          deviceId: '',
          lpnFront: '',
          containerNumCsv: '',
          decNumCvs: '',
          analystId: '',
          checkinTime: [],
          scanSerialNumber: '',
          phyInspectorId: []
        }
      },
      tableGroupRes: [
        // {
        //   // label: this.$t('vicenter.common.No'),
        //   type: 'index'
        // },
        {
          // label: this.$t('vicenter.inspection.common.XRayImage'),
          type: 'imgoperation',
          height: '50px',
          model: 'lastScanImage'
        },
        {
          // label: this.$t('vicenter.inspection.common.taskID'),
          type: 'text',
          model: 'scanSerialNumber',
          width: '180px'
        },
        {
          // label: this.$t('vicenter.inspection.common.office'),
          type: 'text',
          model: 'siteName'
        },
        {
          // label: this.$t('vicenter.inspection.common.scannerID'),
          type: 'text',
          model: 'deviceCode'
        },
        {
          // label: this.$t('vicenter.inspection.common.LPN'),
          type: 'text',
          model: 'lpnFront'
        },
        {
          // label: this.$t('vicenter.inspection.common.declarationNo'),
          type: 'text',
          model: 'decNumCvs',
          width: '160px'
        },
        {
          // label: this.$t('vicenter.inspection.common.containerNo'),
          type: 'text',
          model: 'containerNumCsv'
        },
        {
          // label: this.$t('vicenter.inspection.common.checkInTime'),
          type: 'text',
          model: 'checkinTime',
          width: '140px'
        },
        {
          // label: this.$t('vicenter.inspection.common.status'),
          type: 'text',
          model: 'status',
          width: '160px'
        },
        {
          type: 'text',
          model: 'phyInspectorId',
          width: '140px'
        }
        // {
        //   label: this.$t('vicenter.inspection.common.analystID'),
        //   type: 'text',
        //   model: 'analystAccount'
        // },
        // {
        //   // label: this.$t('vicenter.common.operation'),
        //   type: 'operation',
        //   model: 'operation'
        // }
      ],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'multipleTable',
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        }
      },
      assginTaskmodal: {
        title: '',
        flag: false,
        resetModal: this.resetModal
      },
      assignTaskTable: {
        tableGroup: [
          {
            type: 'selection'
          },
          {
            // label: '账号',
            type: 'text',
            model: 'account'
          },
          {
            // label: '机构名称',
            type: 'text',
            model: 'orgName'
          }
        ],
        tableData: {
          MaxHeight: 350, // 最大高度
          data: [],
          isBorder: true,
          isStripe: true,
          isPage: false,
          refName: 'assignTaskTable',
          sortMethod: this.getSort,
          page: {
            CurrentPage: 0,
            pagesize: 10,
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
            Allpage: 0
          }
        }
      },
      selRow: {},
      assginTaskData: {
        id: '',
        userId: '',
        userAccount: '',
        userName: ''
      },
      const: {
        roleCode: {
          manual: 'PHYSICAL-INSPECTOR'
        }
      },
      inputItemOrigin: [],
      inputItem: [],
      tableGroupOrigin: [],
      tableOper: {
        type: 'operation',
        model: 'operation',
        fixed: 'right'
      },
      tableGroup: [],
      userDefine: [],
      isSavingSearch: false,
      isSavingList: false,
      transferDefaultS: [],
      transferDefaultL: [],
      isOpenSearch: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      isOpenList: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      showInput: false,
      falseFlag: true,
      searchTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: []
        }
      },
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
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.tempIndex = 1
    this.searchTransfer.flag = false
    this.listTransfer.flag = false
    this.setI18n()
  },
  mounted () {
    // this.getList()
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      this.orgAjaxTree()
      this.deviceAjaxTree()
      // 获取人员信息
      this.getPersonInfo('PHYSICAL-INSPECTOR')
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Inspection/index' // 跳转路径
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
      this.queryFn = {
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      }
      // 操作列
      this.tableOper.label = this.$t('vicenter.common.operation')
      // 自定义查询条件弹框
      this.searchTransfer.title = this.$t('vicenter.common.definedQuery')
      this.searchTransfer.transfer.title = [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')]
      this.searchTransfer.transfer.button = [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
      // 自定义列表弹框
      this.listTransfer.title = this.$t('vicenter.common.definedList')
      this.listTransfer.transfer.title = [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')]
      this.listTransfer.transfer.button = [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
      // 查询条件
      this.inputItemRes.forEach((e) => {
        if (e.ruleProp === 'siteId') {
          e.getLabel = this.$t('vicenter.inspection.common.office')
          e.placeHolder = this.$t('vicenter.inspection.common.enterOffice')
        } else if (e.ruleProp === 'deviceId') {
          e.getLabel = this.$t('vicenter.inspection.common.scannerID')
          e.placeHolder = this.$t('vicenter.inspection.common.enterScannerID')
        } else if (e.ruleProp === 'scanSerialNumber') {
          e.getLabel = this.$t('vicenter.inspection.common.taskID')
          e.placeHolder = this.$t('vicenter.inspection.common.entertaskID')
        } else if (e.ruleProp === 'lpnFront') {
          e.getLabel = this.$t('vicenter.inspection.common.LPN')
          e.placeHolder = this.$t('vicenter.inspection.common.enterLPN')
        } else if (e.ruleProp === 'containerNumCsv') {
          e.getLabel = this.$t('vicenter.inspection.common.containerNo')
          e.placeHolder = this.$t('vicenter.inspection.common.enterContainerNo')
        } else if (e.ruleProp === 'decNumCvs') {
          e.getLabel = this.$t('vicenter.inspection.common.declarationNo')
          e.placeHolder = this.$t('vicenter.inspection.common.enterDeclarationNo')
        } else if (e.ruleProp === 'checkinTime') {
          e.getLabel = this.$t('vicenter.inspection.common.checkInTime')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        } else if (e.ruleProp === 'status') {
          e.getLabel = this.$t('vicenter.inspection.common.status')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.common.status')})
          e.option = [
            {
              value: 'WAITING_MANUAL_CHECK',
              label: this.$t('vicenter.DIC.T_TASK_STATUS.C_WAITING_MANUAL_CHECK')
            },
            {
              value: 'MANUAL_CHECK_LOCKED',
              label: this.$t('vicenter.DIC.T_TASK_STATUS.C_MANUAL_CHECK_LOCKED')
            }
          ]
        } else if (e.ruleProp === 'phyInspectorId') {
          e.getLabel = this.$t('vicenter.inspection.common.physicalInspector')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.common.physicalInspector')})
        }
      })
      // 查询列
      this.tableGroupRes.forEach((e) => {
        if (e.model === 'lastScanImage') {
          e.label = this.$t('vicenter.inspection.common.XRayImage')
        } else if (e.model === 'scanSerialNumber') {
          e.label = this.$t('vicenter.inspection.common.taskID')
        } else if (e.model === 'siteName') {
          e.label = this.$t('vicenter.inspection.common.office')
        } else if (e.model === 'deviceCode') {
          e.label = this.$t('vicenter.inspection.common.scannerID')
        } else if (e.model === 'lpnFront') {
          e.label = this.$t('vicenter.inspection.common.LPN')
        } else if (e.model === 'decNumCvs') {
          e.label = this.$t('vicenter.inspection.common.declarationNo')
        } else if (e.model === 'containerNumCsv') {
          e.label = this.$t('vicenter.inspection.common.containerNo')
        } else if (e.model === 'checkinTime') {
          e.label = this.$t('vicenter.inspection.common.checkInTime')
        } else if (e.model === 'status') {
          e.label = this.$t('vicenter.inspection.common.status')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        } else if (e.type === 'index') {
          e.label = this.$t('vicenter.common.No')
        } else if (e.model === 'phyInspectorId') {
          e.label = this.$t('vicenter.inspection.common.physicalInspector')
        }
      })
      // 分配任务弹出框
      this.assginTaskmodal.title = this.$t('vicenter.inspection.common.assignTask')
      // 分配任务弹出框表格
      this.assignTaskTable.tableGroup.forEach((e) => {
        if (e.model === 'account') {
          e.label = this.$t('vicenter.inspection.common.account')
        } else if (e.model === 'orgName') {
          e.label = this.$t('vicenter.inspection.common.orgName')
        }
      })
      // this.query()
      this.getSearchTransferOrigin()
    },
    closeModal () { // 关闭分配任务弹出框
      this.$refs.personTable.$refs['assignTaskTable'].clearSelection()
      this.selRow = {}
      this.assginTaskmodal.flag = false
    },
    getAssignTaskData (scope) { // 获取分配任务数据
      let {id, siteId} = scope.row
      let roleCode = this.const.roleCode.manual
      commonAjax.listPortAndPersionByRoleCode({roleCode: roleCode}).then(res => {
        if (res.data.flag) {
          let result = res.data.result
          let sameSitePerson = result.filter(r => { return siteId === r.orgId })
          if (sameSitePerson.length === 0) {
            this.$NotifPrompt(this.$t('vicenter.inspection.common.assignTaskNoPerson'))
            return
          }
          this.assignTaskTable.tableData.data = sameSitePerson
          this.assginTaskData.id = id
          this.assginTaskmodal.flag = true
        }
      }).catch(() => {})
    },
    listenCurrentChange (val) { // 选中当前行就可选中
      this.$refs.personTable.$refs['assignTaskTable'].toggleRowSelection(val)
      this.selRow = val
    },
    selectRow (data) { // 控制多选框只能单选
      if (data.length > 1) {
        this.$refs.personTable.$refs['assignTaskTable'].clearSelection()
        this.$refs.personTable.$refs['assignTaskTable'].toggleRowSelection(data[data.length - 1])
      }
      this.selRow = data[data.length - 1]
    },
    assignTask () { // 分配任务操作
      if (this.selRow === null || this.selRow === undefined || this.selRow.id === null || this.selRow.id === undefined) {
        this.$NotifPrompt(this.$t('vicenter.inspection.common.assignTaskSelectPerson'))
        return
      }
      let {id, name, account, orgName, orgId} = this.selRow
      let data = {}
      data.id = this.assginTaskData.id
      data.userId = id
      data.userName = name
      data.userAccount = account
      ajax.assignTask(data).then(res => {
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.inspection.common.assignTaskSuccess'))
          this.closeModal()
          this.query()
        }
      }).catch(() => {})
    },
    getList (params = {}) {
      this.tableData.data = []
      this.tableData.isPage = false
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getList(params).then((res) => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$data.tableData.data = data.result.content
            this.$data.tableData.data.forEach(obj => {
              obj.checkinTime = this.$options.filters['formatDate'](obj.checkinTime)
              // obj.status = this.$options.filters['taskStatus'](obj.status)
              // 只有锁定状态的时候才会有解锁操作
              let statusVal = obj.status.split('.').pop()
              if (statusVal === 'C_IMAGE_CHECK_LOCKED' || statusVal === 'C_MANUAL_CHECK_LOCKED') {
                obj.operation = [
                  {
                    func: this.getDetail,
                    label: `<span class='iconfont editTable'>&#xe610;</span>`,
                    title: this.$t('vicenter.common.detail'),
                    show: true
                  },
                  {
                    func: this.unlocktask,
                    label: `<span class='iconfont editTable'>&#xe60c;</span>`,
                    title: this.$t('vicenter.common.unlock'),
                    show: true
                  }
                ]
              } else {
                obj.operation = [
                  {
                    func: this.getDetail,
                    label: `<span class='iconfont editTable'>&#xe610;</span>`,
                    title: this.$t('vicenter.common.detail'),
                    show: true
                  },
                  {
                    func: this.getAssignTaskData,
                    label: `<span class='iconfont editTable'>&#xe678;</span>`,
                    title: this.$t('vicenter.inspection.common.assignTask'),
                    show: true
                  }
                ]
              }
              obj.status = this.$t(obj.status)
              obj.lastScanImage = {
                src: obj.lastScanImage,
                func: this.getDetail
              }
              obj.phyInspectorId = obj.phyInspectorAccount
            })
            this.tableData.page.Allpage = data.result.totalElements
            if (this.tableData.data.length > 0) {
              this.tableData.isPage = true
            }
          } else {
            // this.$ConfirmMsgBox(data.message)
          }
        }
      }).catch(() => {})
    },
    getSort () {
      // console.log(this.formRule)
    },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.setParams()
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/inspection/manualtaskmgmt/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.checkinTime
      let checkinTime = this.formRule.model.checkinTime
      if (checkinTime != null && checkinTime.length === 2) {
        params.checkinTimeStart = checkinTime[0].getTime()
        params.checkinTimeEnd = checkinTime[1].getTime()
      }
      params.phyInspectorId = params.phyInspectorId.length > 0 ? params.phyInspectorId.join(',') : ''
      return params
    },
    query (isPage = true) { // 页面查询
      let params = this.setParams()
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      this.getList(params)
    },
    handleSizeChange (value) { // 修改一页显示多少
      this.$set(this.tableData.page, 'pagesize', value)
      this.query(false)
    },
    handleCurrentChange (value) { // 翻页
      this.$set(this.tableData.page, 'CurrentPage', value - 1)
      this.query(false)
    },
    getDetail (scope) { // 列表按钮详情
      this.$router.push({
        path: '/Inspection/Manage-Physical-detail'
      })
      let detailId = scope.row.id
      sessionStorage.setItem('detailId', JSON.stringify(detailId))
    },
    unlocktask (scope) { // 列表按钮解锁
      let data = {}
      data.ids = scope.row.id
      this.$ConfirmBox(this.$t('vicenter.inspection.common.unlockManualTask'), () => {
        ajax.unlocktasks(data).then(res => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.unlockSuccess'))
            this.query()
          }
        }).catch(() => {})
      })
    },
    getPersonInfo (code) {
      commonAjax.listPortAndPersionByRoleCode({roleCode: code}).then(res => {
        if (res.data.flag) {
          if (res.data.result && res.data.result.length > 0) {
            this.inputItemRes.forEach(item => {
              if (code === item.roleCode) {
                item.option = res.data.result.map(role => {
                  return {
                    label: role.account,
                    value: role.id
                  }
                })
              }
            })
          }
        }
      }).catch(() => {})
    },
    /**
     * 获取机构树方法
     */
    orgAjaxTree () {
      commonAjax.orgNodesTree({all: true}).then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.$data.inputItemRes.forEach(e => {
            if (e.ruleProp === 'siteId') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    /**
     * 获取设备树方法
     */
    deviceAjaxTree () {
      commonAjax.deviceNodesTree().then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pid')
          this.$data.inputItemRes.forEach(e => {
            if (e.ruleProp === 'deviceId') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    treeClick (data) {
      // console.log(this.inputItem[0].models)
    },
    /**
     * 机构树点击节点
     */
    siteIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'siteId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['siteId'] = checkedValue.ids
      }
    },
    /**
     * 设备树点击节点
     */
    deviceIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkNodeChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'deviceId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['deviceId'] = checkedValue.ids
      }
    },
    openSearchDialog () {
      this.searchTransfer.flag = true
      this.isOpenSearch = true
    },
    openListDialog () {
      this.listTransfer.flag = true
      this.isOpenList = true
    },
    // 针对检入时间增加默认值增加了flag参数，表示保存查询条件之前是否有检入时间项
    getSearchTransferOrigin (flag = true) {
      this.userDefine = []
      this.$data.inputItemOrigin = []
      this.$data.inputItem = []
      let params = {
        ufType: 1,
        sysMenu: this.sysMenu
      }
      commonAjax.getSearchCondition(params).then((res) => {
        if (res.data.flag) {
          res.data.result.allEnableSc.forEach(e => {
            this.$data.inputItemRes.forEach(orgin => {
              if (orgin.ruleProp === e.taskField) {
                orgin.id = e.id
                this.$data.inputItemOrigin.push(orgin)
              }
            })
          })
          this.formRule.rule = {}
          res.data.result.userDefineSc.forEach(e => {
            this.$data.inputItemOrigin.forEach(orgin => {
              if (orgin.ruleProp === e.taskField) {
                this.$data.inputItem.push(orgin)
                this.userDefine.push(e.taskField)
              }
            })
            // 添加查询条件校验规则
            let rules = this.$allRules()
            let allRulesKeys = Object.keys(rules)
            if (allRulesKeys.length > 0 && allRulesKeys.includes(e.taskField)) {
              this.formRule.rule[e.taskField] = rules[e.taskField]
            }
          })
          // 如果用户自定义的查询条件中没有检入时间，就删除检入时间默认值
          let searchArr = res.data.result.userDefineSc.map(obj => { return obj.taskField })
          if (searchArr.indexOf('checkinTime') === -1) {
            this.formRule.model.checkinTime = []
            this.$data.inputItem.forEach(obj => {
              if (obj.ruleProp === 'checkinTime') {
                obj.models = []
              }
            })
          } else {
            if (this.formRule.model.checkinTime.length === 0 && !flag) {
              this.formRule.model.checkinTime = [
                new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).toLocaleDateString()),
                new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
              ]
              this.$data.inputItem.forEach(obj => {
                if (obj.ruleProp === 'checkinTime') {
                  obj.models = obj.defaultValue
                }
              })
            }
          }
          this.showInput = true
          this.getSearchTransfer()
        }
        this.getListTransferOrigin()
      }).catch(() => {})
    },
    getListTransferOrigin () {
      this.$data.tableGroupOrigin = []
      this.$data.tableGroup = []
      let params = {
        ufType: 2,
        sysMenu: this.sysMenu
      }
      commonAjax.getSearchCondition(params).then((res) => {
        if (res.data.flag) {
          res.data.result.allEnableSc.forEach(e => {
            this.tableGroupRes.forEach(orgin => {
              if (orgin.model === e.taskField) {
                orgin.id = e.id
                this.$data.tableGroupOrigin.push(orgin)
              }
            })
          })
          res.data.result.userDefineSc.forEach(e => {
            this.$data.tableGroupOrigin.forEach(orgin => {
              if (orgin.model === e.taskField) {
                this.$data.tableGroup.push(orgin)
              }
            })
          })
          this.$data.tableGroup.unshift({
            label: this.$t('vicenter.common.No'),
            type: 'index'
          })
          this.getListTransfer()
        }
      }).catch(() => {})
    },
    saveSearchcondation (ufType) {
      this.isSavingSearch = true
      this.isSavingList = true
      let params = {}
      params.ufType = ufType
      params.sysMenu = this.sysMenu
      let arr = []
      if (ufType === '1') {
        arr = this.searchTransfer.transfer.model
      } else if (ufType === '2') {
        arr = this.listTransfer.transfer.model
      }
      params.strSearchCondations = arr.join(',')
      commonAjax.updateSearchCondition(params).then((res) => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
            let isHasCheckinTime = false
            this.inputItem.forEach(e => {
              if (e.ruleProp === 'checkinTime') {
                isHasCheckinTime = true
              }
            })
            this.getSearchTransferOrigin(isHasCheckinTime)
            this.listTransfer.flag = false
            this.searchTransfer.flag = false
          }
          this.isOpenSearch = false
          this.isOpenList = false
          this.isSavingSearch = false
          this.isSavingList = false
        }
      }).catch(() => {})
    },
    saveSearchTranfer () {
      this.saveSearchcondation('1')
    },
    dontSaveSearchTranfer () {
      this.searchTransfer.flag = false
      this.isOpenSearch = false
      this.searchTransfer.transfer.model = []
      this.inputItem.forEach(ele => {
        this.searchTransfer.transfer.model.push(ele.id)
      })
    },
    getSearchTransfer () {
      this.searchTransfer.transfer.data = []
      this.searchTransfer.transfer.model = []
      this.inputItemOrigin.forEach(ele => {
        this.searchTransfer.transfer.data.push({
          key: ele.id,
          label: ele.getLabel
        })
        if (this.userDefine.indexOf(ele.ruleProp) === -1) {
          ele.models = ''
          this.formRule.model[ele.ruleProp] = ''
        }
      })
      this.inputItem.forEach(e => {
        this.searchTransfer.transfer.model.push(e.id)
        if (e.type === 'treeInput') {
          e.checkedOption = this.formRule.model[e.ruleProp].split(',')
        }
      })
      this.query()
    },
    dontSaveListTranfer () {
      this.listTransfer.flag = false
      this.isOpenList = false
      this.listTransfer.transfer.model = []
      this.tableGroup.forEach(ele => {
        if (ele.type !== 'operation' && ele.type !== 'index') {
          this.listTransfer.transfer.model.push(ele.id)
        }
      })
    },
    getListTransfer () {
      this.listTransfer.transfer.data = []
      this.listTransfer.transfer.model = []
      this.tableGroupOrigin.forEach(ele => {
        this.listTransfer.transfer.data.push({
          key: ele.id,
          label: ele.label
        })
      })
      this.tableGroup.forEach(e => {
        if (e.type !== 'index') {
          this.listTransfer.transfer.model.push(e.id)
        }
      })
      this.tableGroup.push(this.tableOper)
    },
    saveListTranfer () {
      this.saveSearchcondation('2')
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Inspection/Manage-Physical-detail') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        siteId: '',
        deviceId: '',
        lpnFront: '',
        containerNumCsv: '',
        decNumCvs: '',
        analystId: '',
        checkinTime: [],
        scanSerialNumber: '',
        phyInspectorId: []
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable, Dialog }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.Manage-Physical-bar {
  @extend .extend-bar;
  .Manage-Physical-M {
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
          @include layout(2);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
      }
    }
    .assign_task{
      thead {
        .el-table-column--selection {
          .cell {
            display: none;
          }
        }
      }
    }
  }
}
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
</style>
