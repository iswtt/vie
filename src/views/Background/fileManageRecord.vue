<template>
  <div id='background-fileManageRecord-bar' v-bar>
    <div class="background-fileManageRecord-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button type="primary" size="mini" @click="openSearchDialog" data-id="querySet-btn">{{$t('vicenter.common.set')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="inputItem" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
         <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
            <el-button type="primary" size="mini" @click="openListDialog" data-id="tableSet-btn">{{$t('vicenter.common.set')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
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
import ajax from '@/api/background/fileManage.js' // 接口文件
import commonAjax from '@/api/common/common.js'
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
export default {
  name: 'fileManageRecord',
  data () {
    return {
      exportButton: false,
      sysMenu: 'ARCHIVING_RECORD_QUERY',
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Background/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      formRule: { // 查询表单规则
        model: {
          archiveTime: '',
          scanTime: '',
          siteId: '',
          decNumCvs: '',
          lpnFront: '',
          containerNumCsv: '',
          deviceId: '',
          scanSerialNumber: '',
          arcPath: ''
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      inputItemRes: [ // 查询表单初始化
        {
          // 归档时间
          getLabel: this.$t('vicenter.Background.fileManage.archiveTime'),
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          type: 'datetimerange',
          // 默认当天
          models: [
            // new Date(new Date().toLocaleDateString()).getTime(),
            // new Date(new Date().toLocaleDateString()).getTime() + ((24 * 60 * 60 * 1000) - 1)
          ],
          valueFormat: 'timestamp',
          editable: false,
          ruleProp: 'archiveTime'
        },
        {
          // 扫描时间
          getLabel: this.$t('vicenter.Background.fileManage.scanTime'),
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          editable: false,
          ruleProp: 'scanTime'
        },
        {
          // 口岸名称
          getLabel: this.$t('vicenter.Background.fileManage.siteName'),
          placeHolder: this.$t('vicenter.Background.fileManage.enterSiteName'),
          models: '',
          ruleProp: 'siteId',
          type: 'treeInput',
          treedata: [],
          checkedOption: [],
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
          // 报关单号
          getLabel: this.$t('vicenter.Background.fileManage.declarationNo'),
          placeHolder: this.$t('vicenter.Background.fileManage.enterDeclarationNo'),
          type: 'text',
          models: '',
          ruleProp: 'decNumCvs'
        },
        {
          // 车牌号
          getLabel: this.$t('vicenter.Background.fileManage.lpnNum'),
          placeHolder: this.$t('vicenter.Background.fileManage.enterLpnNum'),
          type: 'text',
          models: '',
          ruleProp: 'lpnFront'
        },
        {
          // 集装箱号
          getLabel: this.$t('vicenter.Background.fileManage.containerNo'),
          placeHolder: this.$t('vicenter.Background.fileManage.enterContainerNo'),
          type: 'text',
          models: '',
          ruleProp: 'containerNumCsv'
        },
        {
          // 设备编号
          getLabel: this.$t('vicenter.Background.fileManage.scannerID'),
          placeHolder: this.$t('vicenter.Background.fileManage.enterScannerID'),
          type: 'treeInput',
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
          // 任务编号
          getLabel: this.$t('vicenter.Background.fileManage.taskId'),
          placeHolder: this.$t('vicenter.Background.fileManage.enterTaskId'),
          type: 'text',
          models: '',
          ruleProp: 'scanSerialNumber'
        },
        {
          // 归档路径
          getLabel: this.$t('vicenter.Background.fileManage.arcPath'),
          placeHolder: this.$t('vicenter.Background.fileManage.enterArcPath'),
          type: 'text',
          models: '',
          ruleProp: 'arcPath'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        }
      },
      tableGroupRes: [ // 表格数据列
        // {
        //   label: this.$t('vicenter.common.No'),
        //   type: 'index'
        // },
        {
          // 归档时间
          label: this.$t('vicenter.Background.fileManage.archiveTime'),
          type: 'text',
          model: 'archiveTime',
          width: '140px'
        },
        {
          // 扫描时间
          label: this.$t('vicenter.Background.fileManage.scanTime'),
          model: 'scanTime',
          type: 'text',
          width: '140px'
        },
        {
          // 口岸名称
          label: this.$t('vicenter.Background.fileManage.siteName'),
          type: 'text',
          model: 'siteName'
        },
        {
          // 报关单号
          label: this.$t('vicenter.Background.fileManage.declarationNo'),
          type: 'text',
          model: 'decNumCvs'
        },
        {
          // 前车牌号
          label: this.$t('vicenter.Background.fileManage.lpnFront'),
          type: 'text',
          model: 'lpnFront'
        },
        {
          // 后车牌号
          label: this.$t('vicenter.Background.fileManage.lpnBackCsv'),
          type: 'text',
          model: 'lpnBackCsv'
        },
        {
          // 集装箱号
          label: this.$t('vicenter.Background.fileManage.containerNo'),
          type: 'text',
          model: 'containerNumCsv'
        },
        {
          // 设备编号
          label: this.$t('vicenter.Background.fileManage.scannerID'),
          type: 'text',
          model: 'deviceCode'
        },
        {
          // 任务编号
          label: this.$t('vicenter.Background.fileManage.taskId'),
          type: 'text',
          model: 'scanSerialNumber',
          width: '180px'
        },
        {
          // 归档路径
          label: this.$t('vicenter.Background.fileManage.arcPath'),
          type: 'text',
          model: 'arcPath'
        }
      ],
      inputItemOrigin: [],
      inputItem: [],
      tableGroupOrigin: [],
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
          data: [],
          title: [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')],
          button: [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
        },
        title: this.$t('vicenter.common.definedQuery')
      },
      listTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: [],
          title: [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')],
          button: [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
        },
        title: this.$t('vicenter.common.definedList')
      }
    }
  },
  mounted () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.setinputItem()
    // this.query()
    this.getSearchTransferOrigin()
  },
  methods: {
    query (isPage = true) { // 用于form表单查询方法
      let params = this.setParams()
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getList(params).then((res) => {
        if (res.data.flag) {
          this.tableData.isPage = false
          this.tableData.page = {
            pageGroup: [10, 20, 50, 100], // 分页数据
            CurrentPage: res.data.result.pageable.pageNumber, // 当前页码
            pagesize: res.data.result.pageable.pageSize, // 当前分页条数
            Allpage: res.data.result.totalElements, // 总数据
            handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
            handleCurrentChange: this.handleCurrentChange // 当前页码改变触发改函数
          }
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(e => {
            e.archiveTime = this.$options.filters['formatDate'](e.archiveTime, this.$t('vicenter.common.formatDate'))
            e.scanTime = this.$options.filters['formatDate'](e.scanTime, this.$t('vicenter.common.formatDate'))
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.setParams()
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/management/archive/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.archiveTime
      delete params.scanTime
      let keys = Object.keys(params)
      keys.forEach(e => {
        if (this.userDefine.indexOf(e) < 0) {
          delete params[e]
        }
      })
      if (this.userDefine.indexOf('archiveTime') > -1) {
        let archiveTime = this.formRule.model.archiveTime
        if (archiveTime != null && archiveTime.length === 2) {
          params.archiveTimeStart = archiveTime[0]
          params.archiveTimeEnd = archiveTime[1]
        }
      }
      if (this.userDefine.indexOf('scanTime') > -1) {
        let scanTime = this.formRule.model.scanTime
        if (scanTime != null && scanTime.length === 2) {
          params.scanTimeStart = scanTime[0]
          params.scanTimeEnd = scanTime[1]
        }
      }
      return params
    },
    handleSizeChange (val) { // 表格分页
      this.$set(this.tableData.page, 'pagesize', val)
      this.query(false)
    },
    handleCurrentChange (val) { // 表格分页
      this.$set(this.tableData.page, 'CurrentPage', val - 1)
      this.query(false)
    },
    getSort () {
      console.log(this.formRule)
    },
    ajaxTree () { // 获取机构树方法
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
    setinputItem () {
      this.ajaxTree()
      this.deviceAjaxTree()
    },
    treeClick (data) {
    },
    /**
     * 设备树点击节点
     */
    deviceIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkNodeChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItemRes.forEach(e => {
          if (e.ruleProp === 'deviceId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['deviceId'] = checkedValue.ids
      }
    },
    siteIdCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItemRes.forEach(e => {
          if (e.ruleProp === 'siteId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['siteId'] = checkedValue.ids
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
          // console.log(e.getLabel + '+' + this.formRule.model[e.ruleProp])
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
      // this.tableGroup.push(this.tableOper)
    },
    saveListTranfer () {
      this.saveSearchcondation('2')
    }
  },
  components: {bread, ComForm, panelTitle, ComTable}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#background-fileManageRecord-bar {
  @extend .extend-bar;
  .background-fileManageRecord-M {
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
  }
}
</style>
