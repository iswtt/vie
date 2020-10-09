<template>
  <div id="ic-iu" v-bar>
    <div class="iu-m">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread"/>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="inputItem" :searchFunc="queryFn" :formRule="formRule"></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button size="mini" type="primary" @click="addVehicle">{{$t('ViBorder.common.add')}}</el-button>
            <el-button size="mini" type="danger" @click="deleteVehicle">{{$t('ViBorder.common.delete')}}</el-button>
            <!-- <i class="iconfont exportIcon pdfIcon" @click="exportPDF" :title="$t('ViBorder.IC.common.exportPDF')">&#xeacd;</i>
            <i class="iconfont exportIcon" @click="exportExcel" :title="$t('ViBorder.IC.common.exportExcel')">&#xe679;</i> -->
            <div class="exportIcon pdfIcon" @click="exportPDF" :title="$t('ViBorder.IC.common.exportPDF')"></div>
            <div class="exportIcon excelIcon" @click="exportExcel" :title="$t('ViBorder.IC.common.exportExcel')"></div>
          </panelTitle>
          <div class="table-bar" v-bar>
            <ComTable :tableData="tableData" :tableGroup="tableGroup" @listenToSelectDataEvent="tableSelect"></ComTable>
          </div>
        </div>
      </div>
      <Dialog class="formDialog" :modalData="addModalData">
        <ComForm :searchIpt="addInputItem" :searchFunc="addQueryFn" :formRule="addFormRule" ref="addForm"></ComForm>
      </Dialog>
      <Dialog class="formDialog" :modalData="editModalData">
        <ComForm :searchIpt="editInputItem" :searchFunc="editQueryFn" :formRule="editFormRule" ref="editForm"></ComForm>
      </Dialog>
      <Dialog :modalData="tableModalData">
        <ComTable :tableData="editTableData" :tableGroup="editTableGroup"></ComTable>
      </Dialog>
    </div>
  </div>
</template>

<script>
import handleData from '../../api/IC/iuManagement'
import {saveFile} from '../../lib/index.js'
export default {
  name: 'ic-iu',
  data () {
    return {
      titleBread: {
        font: '/',
        data: [
          {
            label: this.$t('ViBorder.systemModule.IC.headTitle'),
            path: '/'
          },
          {
            label: this.$t('ViBorder.IC.pageTitle.iuManagement')
          }
        ]
      },
      panelTitle: {
        queryTitle: {
          title: this.$t('ViBorder.common.query')
        },
        listTitle: {
          title: this.$t('ViBorder.common.list')
        }
      },
      queryFn: {
        query: this.query,
        queryText: this.$t('ViBorder.common.query'),
        resetText: this.$t('ViBorder.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        model: {},
        rule: {}
      },
      inputItem: [
        {
          getLabel: this.$t('ViBorder.IC.common.addLpnTime'),
          models: '',
          type: 'datetimerange',
          startPlace: this.$t('ViBorder.IC.common.startTime'),
          rangeSeparator: '...',
          endPlace: this.$t('ViBorder.IC.common.endTime'),
          ruleProp: 'time',
          placeHolder: this.$t('ViBorder.IC.common.enterTime'),
          format: this.$t('ViBorder.common.formatDate'), // 显示的日期格式
          valueFormat: 'yyyy-MM-dd HH:mm:ss', // 存入日期格式
          clearable: false
        },
        {
          getLabel: this.$t('ViBorder.IC.common.lpn'),
          type: 'text',
          placeHolder: this.$t('ViBorder.IC.common.enterLpn'),
          models: '',
          ruleProp: 'lpn'
        },
        {
          getLabel: this.$t('ViBorder.IC.common.iu'),
          type: 'text',
          placeHolder: this.$t('ViBorder.IC.common.enterIu'),
          models: '',
          ruleProp: 'iu'
        },
        {
          getLabel: this.$t('ViBorder.IC.common.isBlackVehicle'),
          type: 'select',
          placeHolder: this.$t('ViBorder.common.pleaseSelect'),
          models: '',
          option: [
            {
              label: this.$t('ViBorder.common.yes'),
              value: true
            },
            {
              label: this.$t('ViBorder.common.error'),
              value: false
            }
          ],
          ruleProp: 'flag',
          clearable: true
        }
      ],
      addQueryFn: {
        query: this.addQuery,
        close: this.close,
        queryText: this.$t('ViBorder.common.sure'),
        resetText: this.$t('ViBorder.common.cancel')
      },
      addFormRule: {
        refName: 'addqueryForm',
        model: {},
        rule: {
          lpn: [
            { required: true, message: this.$t('ViBorder.IC.common.enterLpn') },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: this.$t('ViBorder.PCBRAS.lprRule') },
            { min: 1, max: 20, message: this.$t('ViBorder.PCBRAS.lprLength') }
          ],
          iu: [
            { required: true, message: this.$t('ViBorder.IC.common.enterIu') },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: this.$t('ViBorder.PCBRAS.iuRule') },
            { min: 1, max: 20, message: this.$t('ViBorder.PCBRAS.iuLength') }
          ]
        }
      },
      addInputItem: [
        {
          getLabel: this.$t('ViBorder.IC.common.lpn'),
          type: 'text',
          placeHolder: this.$t('ViBorder.IC.common.enterLpn'),
          models: '',
          ruleProp: 'lpn'
        },
        {
          getLabel: this.$t('ViBorder.IC.common.iu'),
          type: 'text',
          placeHolder: this.$t('ViBorder.IC.common.enterIu'),
          models: '',
          ruleProp: 'iu'
        }
      ],
      queryFnAdd: { // 页面表单查询方法
        query: this.formAdd,
        close: this.formClose,
        queryText: this.$t('ViBorder.common.save'),
        resetText: this.$t('ViBorder.common.back')
      },
      formRuleAdd: { // 表单验证和存放数据 model=> post到后台的数据
        refName: 'addqueryForm',
        model: {},
        rule: {
          vehicleType: [
            { required: true, message: this.$t('ViBorder.CHECKIN.vehicleTypeWarn'), trigger: 'blur' }
          ],
          measureType: [
            { required: true, message: this.$t('ViBorder.IC.selectMeasureType'), trigger: 'blur' }
          ],
          validateValue: [
            { required: true, message: this.$t('ViBorder.IC.inputValidateValue'), trigger: 'blur' },
            { pattern: /^[0-9]+$/, message: this.$t('ViBorder.businessLogicCommon.onlyNumber') },
            { min: 1, max: 2, message: this.$t('ViBorder.businessLogicCommon.onlyTwoNumbers'), trigger: 'blur' }
          ]
        }
      },
      inputItemAdd: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('ViBorder.IC.measurementType'),
          type: 'text',
          placeHolder: this.$t('ViBorder.businessLogicCommon.checkMeasurementType'),
          models: '',
          ruleProp: 'measureType'
        },
        {
          getLabel: this.$t('ViBorder.IC.validationValue'),
          models: '',
          placeHolder: this.$t('ViBorder.businessLogicCommon.inputVerificationValue'),
          type: 'text',
          ruleProp: 'validateValue',
          clearable: true
        }
      ],
      ceshimodel: {
        lpn: '',
        iu: ''
      },
      editQueryFn: {
        query: this.editQuery,
        close: this.close,
        queryText: this.$t('ViBorder.common.sure'),
        resetText: this.$t('ViBorder.common.cancel')
      },
      editFormRule: {
        refName: 'editqueryForm',
        model: {},
        rule: {
          lpn: [
            { required: true, message: this.$t('ViBorder.IC.common.enterLpn') },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: this.$t('ViBorder.PCBRAS.lprRule') },
            { min: 1, max: 20, message: this.$t('ViBorder.PCBRAS.lprLength') }
          ],
          iu: [
            { required: true, message: this.$t('ViBorder.IC.common.enterIu') },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: this.$t('ViBorder.PCBRAS.iuRule') },
            { min: 1, max: 20, message: this.$t('ViBorder.PCBRAS.iuLength') }
          ]
        }
      },
      editInputItem: [
        {
          getLabel: this.$t('ViBorder.IC.common.lpn'),
          type: 'text',
          placeHolder: this.$t('ViBorder.IC.common.enterLpn'),
          models: '',
          ruleProp: 'lpn'
        },
        {
          getLabel: this.$t('ViBorder.IC.common.iu'),
          type: 'text',
          placeHolder: this.$t('ViBorder.IC.common.enterIu'),
          models: '',
          ruleProp: 'iu'
        }
      ],
      tableData: {
        data: [],
        isBorder: false,
        isStripe: true,
        isPage: false,
        refname: 'multipleTable',
        sortMethod: this.getSortTable
      },
      tableGroup: [
        {
          type: 'selection'
        },
        {
          label: this.$t('ViBorder.IC.common.lpn'),
          type: 'text',
          model: 'licensePlateNumber',
          color: 'red'
        },
        {
          label: this.$t('ViBorder.IC.common.iu'),
          type: 'text',
          model: 'iu'
        },
        {
          label: this.$t('ViBorder.IC.common.addLpnTime'),
          type: 'text',
          model: 'creationTime'
        },
        {
          label: this.$t('ViBorder.IC.common.isBlackVehicle'),
          type: 'colorText',
          model: 'blackVehicle'
        },
        {
          label: this.$t('ViBorder.IC.common.operation'),
          type: 'operation',
          model: 'operation'
        }
      ],
      operation1: [
        {
          func: this.clearBlack,
          label: `<span class='editTable'><i class="iconfont">&#xe664;</i></span>`,
          title: this.$t('ViBorder.IC.common.deleteBlack'),
          show: true
        },
        {
          func: this.tableEdit,
          label: `<span class='editTable'><i class="iconfont">&#xe63b;</i></span>`,
          title: this.$t('ViBorder.common.fix'),
          show: true
        },
        {
          func: this.changeLog,
          label: `<span class='editTable'><i class="iconfont">&#xe671;</i></span>`,
          title: this.$t('ViBorder.IC.common.fixRecord'),
          show: true
        }
      ],
      operation2: [
        {
          func: this.addBlack,
          label: `<span class='editTable'><i class="iconfont">&#xe659;</i></span>`,
          title: this.$t('ViBorder.IC.common.addBlack'),
          show: true
        },
        {
          func: this.tableEdit,
          label: `<span class='editTable'><i class="iconfont">&#xe63b;</i></span>`,
          title: this.$t('ViBorder.common.fix'),
          show: true
        },
        {
          func: this.changeLog,
          label: `<span class='editTable'><i class="iconfont">&#xe671;</i></span>`,
          title: this.$t('ViBorder.IC.common.fixRecord'),
          show: true
        }
      ],
      editTableData: {
        data: [],
        isBorder: false,
        isStripe: true,
        isPage: false,
        refname: 'multipleTable',
        sortMethod: this.getSortTable
      },
      editTableGroup: [
        {
          label: this.$t('ViBorder.IC.common.operationTime'),
          type: 'text',
          model: 'operationTime'
        },
        {
          label: this.$t('ViBorder.IC.common.operationer'),
          type: 'text',
          model: 'operationUserName'
        },
        {
          label: this.$t('ViBorder.IC.common.operationSystem'),
          type: 'text',
          model: 'operationSystem'
        },
        {
          label: this.$t('ViBorder.IC.common.operationType'),
          type: 'text',
          model: 'operationType.key'
        }
      ],
      pageOptions: {
        currentChageFlag: false
      },
      addModalData: {
        resetModal: this.addresetModal,
        title: this.$t('ViBorder.IC.common.addVehicle'),
        flag: false
      },
      editModalData: {
        resetModal: this.editresetModal,
        title: this.$t('ViBorder.IC.common.editVehicle'),
        flag: false
      },
      tableModalData: {
        resetModal: this.resetModal,
        title: this.$t('ViBorder.IC.common.fixRecord'),
        flag: false
      },
      tableSelectData: [],
      editId: '',
      exportData: '',
      baseUrl: window.config.baseUrl,
      sort: {} // 表格排序
    }
  },
  mounted () {
    this.initPageData()
  },
  methods: {
    formAdd () {
      this.formRuleAdd.model.vehicleType = 'TRUCK'
      handleData._initAdd(this.formRuleAdd.model).then(res => {
        if (res.data.flag) {
          this.$refs.addForm.reset()
          this.dialogAdd = false
          this.getTableData(this.formRule.model)
          this.$notify({
            title: this.$t('ViBorder.common.successfuly'),
            message: this.$t('ViBorder.common.addSuccess'),
            type: 'success',
            offset: this.notifyOffset
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    formClose () {
      this.dialogAdd = false
      this.dialogModify = false
    },
    getQueryParam (value) { // 获取页面查询框中的查询条件
      let {model} = this.formRule
      let options = {}
      for (const key in model) {
        if (key === 'time') {
          continue
        } else {
          Object.assign(options, {[key]: model[key]})
        }
        delete model.CurrentPage
      }
      let creationTime
      if (Array.isArray(model.time) && model.time.length) {
        if (!model.time[1].includes('999')) {
          model.time[1] = `${model.time[1]}.999`
        }
        creationTime = {
          creationTime: new Date(model.time[0]).getTime(),
          creationTime2: new Date(model.time[1]).getTime()
        }
      }
      let param = Object.assign({}, creationTime, options, value, this.sort)
      return this.$filterNullFields(param)
    },
    query (value) {
      let data = this.getQueryParam(value)
      this.getTableData(data)
    },
    initPageData () {
      setTimeout(() => {
        let {model} = this.formRule
        let creationTime = {
          creationTime: new Date(model.time[0]).getTime(),
          creationTime2: new Date(model.time[1]).getTime()
        }
        let initTableParm = {...creationTime, ...{page: 0, size: 10}}
        Promise.all([this.getTableData(initTableParm)]).then(res => {
        }).catch(err => {
          console.log('err', err)
        })
      })
    },
    getTableData (data) {
      handleData.list(data).then(res => {
        if (res.data.flag) {
          this.exportData = data
          if (res.data.result.totalElements) { // 总数存在的话 加分页
            this.tableData.isPage = true
          } else {
            this.tableData.isPage = false
          }
          this.tableData.page = {
            CurrentPage: parseInt(res.data.result.number + 1, 10),
            pagesize: res.data.result.size,
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
            Allpage: res.data.result.totalElements
          }
          this.pageOptions.currentChageFlag = false // 防止点击分页条数时多次触发提交请求
          this.tableData.data = this.unifiedFormData(res.data.result.content)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    unifiedFormData (option) {
      if (Array.isArray(option)) {
        let arr = option.slice()
        arr.forEach(element => {
          element.operation = this.operation
          for (const oKey in element) {
            switch (oKey) {
              case 'creationTime': case 'operationTime':
                element[oKey] = element[oKey] && this.$formatDateTime(element[oKey], this.$t('ViBorder.common.formatDate')) // 分页查询时间格式化
                break
              case 'site': case 'operationType':
                element[oKey].key = element[oKey] ? this.$t((element[oKey]).key) : '' // 国际化
                break
              case 'blackVehicle':
                if (element[oKey]) {
                  element[oKey] = {}
                  element[oKey].model = this.$t('ViBorder.common.yes')
                  element[oKey].color = 'red'
                  element.operation = this.operation1
                } else {
                  element[oKey] = {}
                  element[oKey].model = this.$t('ViBorder.common.error')
                  element.operation = this.operation2
                }
                break
            }
          }
        })
        return arr
      }
    },
    handleSizeChange (val) { // 分页条数改变触发该函数
      this.pageOptions.currentChageFlag = true
      // let handlesize = this.getQueryParam()
      this.formRule.model.page = 0
      this.query({...{size: val, page: 0}})
    },
    handleCurrentChange (val) { // 当前页码改变触发改函数
      if (!this.pageOptions.currentChageFlag) {
        const pagesize = this.tableData.page.pagesize
        // let handlesize = this.getQueryParam({...{page: parseInt(val - 1), size: pagesize}})
        this.formRule.model.page = parseInt(val - 1)
        this.query({...{page: parseInt(val - 1), size: pagesize}})
      }
    },
    addVehicle () {
      this.addModalData.flag = true
    },
    tableEdit (scope) {
      this.editModalData.flag = true
      let self = this
      setTimeout(() => {
        for (let i in self.editInputItem) {
          self.editInputItem[i].models = scope.row[self.editInputItem[i].ruleProp]
          if (self.editInputItem[i].ruleProp === 'lpn') {
            self.editInputItem[i].models = scope.row.licensePlateNumber
          }
        }
      })
      // for (let i in this.editInputItem) {
      //   this.editInputItem[i].models = scope.row[this.editInputItem[i].ruleProp]
      //   if (this.editInputItem[i].ruleProp === 'lpn') {
      //     this.editInputItem[i].models = scope.row.licensePlateNumber
      //   }
      // }
      this.editFormRule.model.id = scope.row.id
    },
    clearBlack (scope) { // 移除黑名单
      handleData.delBlack({id: scope.row.id}).then(res => {
        if (res.data.flag) {
          this.$notify({
            title: this.$t('ViBorder.common.successfuly'),
            message: this.$t('ViBorder.IC.common.deleteBlackSuccess'),
            type: 'success'
          })
          this.query()
        } else {
          this.$notify({
            title: this.$t('ViBorder.common.fail'),
            message: this.$t('ViBorder.IC.common.deleteBlackFail'),
            type: 'error'
          })
        }
      })
    },
    addBlack (scope) { // 添加黑名单
      handleData.addBlack({id: scope.row.id}).then(res => {
        if (res.data.flag) {
          this.$notify({
            title: this.$t('ViBorder.common.successfuly'),
            message: this.$t('ViBorder.IC.common.addBlackSuccess'),
            type: 'success'
          })
          this.query()
        } else {
          this.$notify({
            title: this.$t('ViBorder.common.fail'),
            message: this.$t('ViBorder.IC.common.addBlackFail'),
            type: 'error'
          })
        }
      })
    },
    deleteVehicle () { // 删除车辆
      this.$confirm(this.$t('ViBorder.IC.common.isDeleteVehicle'), this.$t('ViBorder.common.prompt'), {
        confirmButtonText: this.$t('ViBorder.common.sure'),
        cancelButtonText: this.$t('ViBorder.common.cancel'),
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        if (this.tableSelectData.length === 0) {
          this.$notify({
            title: this.$t('ViBorder.common.warning'),
            message: this.$t('ViBorder.IC.common.selectVehicle'),
            type: 'warning'
          })
        } else {
          let arr = []
          for (let i in this.tableSelectData) {
            arr.push(this.tableSelectData[i].id)
          }
          let data = {ids: arr.join(',')}
          handleData.delete(data).then(res => {
            if (res.data.flag) {
              this.$notify({
                title: this.$t('ViBorder.common.successfuly'),
                message: this.$t('ViBorder.common.deleteSuccess'),
                type: 'success'
              })
              this.query()
            }
          })
        }
      }).catch(() => {})
    },
    editQuery (scope) { // 修改车辆
      handleData.edit(this.editFormRule.model).then(res => {
        if (res.data.flag) {
          this.$notify({
            title: this.$t('ViBorder.common.successfuly'),
            message: this.$t('ViBorder.IC.common.editVehicleSuccess'),
            type: 'success'
          })
          this.$refs.editForm.reset(this.close())
          this.query()
        }
      })
    },
    addQuery () { // 添加车辆
      let data = this.addFormRule.model
      handleData.add(data).then(res => {
        if (res.data.flag) {
          this.$notify({
            title: this.$t('ViBorder.common.successfuly'),
            message: this.$t('ViBorder.IC.common.addVehicleSuccess'),
            type: 'success'
          })
          this.$refs.addForm.reset(this.close())
          this.query()
        }
      })
    },
    close () {
      this.addModalData.flag = false
      this.editModalData.flag = false
    },
    addresetModal () {
      this.$refs.addForm.reset()
    },
    editresetModal () {
      this.$refs.editForm.reset()
    },
    tableSelect (data) {
      this.tableSelectData = data
    },
    changeLog (scope) {
      this.editId = scope.row.id
      this.getchangeLog({id: scope.row.id})
    },
    getchangeLog (data) {
      handleData.changeLog(data).then(res => {
        if (res.data.flag) {
          if (res.data.result.totalElements) { // 总数存在的话 加分页
            this.editTableData.isPage = true
          } else {
            this.editTableData.isPage = false
          }
          this.editTableData.page = {
            CurrentPage: parseInt(res.data.result.number + 1, 10),
            pagesize: res.data.result.size,
            handleSizeChange: this.asideHandleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.asideHandleCurrentChange, // 当前页码改变触发改函数
            Allpage: res.data.result.totalElements
          }
          this.pageOptions.currentChageFlag = false // 防止点击分页条数时多次触发提交请求
          this.editTableData.data = this.unifiedFormData(res.data.result.content)
          this.tableModalData.flag = true
        }
      })
    },
    asideHandleSizeChange (val) { // 分页条数改变触发该函数
      this.pageOptions.currentChageFlag = true
      // let handlesize = this.getQueryParam()
      // this.formRule.model.page = 0
      this.getchangeLog({...{size: val, page: 0, id: this.editId}})
    },
    asideHandleCurrentChange (val) { // 当前页码改变触发改函数
      if (!this.pageOptions.currentChageFlag) {
        const pagesize = this.tableData.page.pagesize
        // let handlesize = this.getQueryParam({...{page: parseInt(val - 1), size: pagesize}})
        // this.formRule.model.page = parseInt(val - 1)
        this.getchangeLog({...{page: parseInt(val - 1), size: pagesize, id: this.editId}})
      }
    },
    exportPDF () {
      let obj = this.exportData
      let arr = []
      for (let oKey in obj) {
        arr.push(oKey + '=' + obj[oKey])
      }
      let str = arr.join('&')
      let aSrc = this.baseUrl + handleData.exportPdf + '?' + str + '&language=' + this.$store.state.lang
      saveFile(aSrc)
    },
    exportExcel () {
      let obj = this.exportData
      let arr = []
      for (let oKey in obj) {
        arr.push(oKey + '=' + obj[oKey])
      }
      let str = arr.join('&')
      let aSrc = this.baseUrl + handleData.exportExcel + '?' + str + '&language=' + this.$store.state.lang
      saveFile(aSrc)
    },
    getSortTable () {}
  },
  computed: {},
  watch: {},
  props: [ ],
  components: {}
}
</script>

<style lang="scss">
@import '../../styles/index.scss';
#ic-iu {
  @extend .extend-bar;
  .iu-m {
    padding: $margin;
    box-sizing: border-box !important;
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .table-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .infolist {
      // height: 100%;
      .panel {
        @extend .extend-panel;
        .search-form {
          @include layout(4);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
        @media screen and (min-width: 1640px) {
          width: calc(80% - 10px) !important;
        }
      }
      .exportIcon {
        color: $primary;
        margin-right: 10px;
        width: 24px;
        height: 26px;
      }
      .pdfIcon {
        margin-left: 10px;
        background: $pdfIcon no-repeat center;
      }
      .excelIcon {
        margin-left: 10px;
        background: $excelIcon no-repeat center;
      }
    }
     
  }
}
</style>
