<template>
  <div class='Image-Analysis-bar' v-bar>
    <div class="Image-Analysis-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div v-if='showView' class="infolist">
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
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import ajax from '@/api/inspection/Tampering-record.js'
import commonAjax from '@/api/common/common.js'
export default {
  name: 'Tampering-record',
  data () {
    return {
      exportButton: false,
      sysMenu: 'IMAGE_TAMPERING_LIST',
      showView: false,
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Inspection/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: { // title组件数据
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      inputItemRes: [
        {
          getLabel: this.$t('vicenter.inspection.tamperingRecord.scanSerialNumber'), // 任务号
          placeHolder: this.$t('vicenter.inspection.tamperingRecord.enterScanSerialNumber'), // 请输入任务号
          models: '',
          ruleProp: 'scanSerialNumber',
          type: 'text'
        },
        {
          getLabel: this.$t('vicenter.inspection.common.office'),
          type: 'treeInput',
          placeHolder: this.$t('vicenter.inspection.common.enterOffice'),
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
          getLabel: this.$t('vicenter.inspection.common.scannerID'),
          type: 'treeInput',
          placeHolder: this.$t('vicenter.inspection.common.enterScannerID'),
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
          getLabel: this.$t('vicenter.inspection.tamperingRecord.tamperedPosition'), // 篡改位置
          placeHolder: this.$t('vicenter.inspection.tamperingRecord.enterTamperedPosition'), // 请输入篡改位置
          type: 'select',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'tamperedPosition',
          option: [
            {
              value: 1,
              label: this.$t('vicenter.inspection.tamperingRecord.center') // 中心
            },
            {
              value: 2,
              label: this.$t('vicenter.inspection.tamperingRecord.locale') // 现场
            },
            {
              value: 3,
              label: this.$t('vicenter.inspection.tamperingRecord.all') // 现场、中心
            },
            {
              value: 4,
              label: this.$t('vicenter.inspection.tamperingRecord.notVerified') // 未校验
            }
          ]
        },
        {
          getLabel: this.$t('vicenter.inspection.tamperingRecord.createTime'), // 时间
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          // format: this.$t('vicenter.common.pickerFmt'),
          type: 'datetimerange',
          models: [],
          ruleProp: 'createTime'
        }
      ],
      queryFn: { // 页面表单查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        model: {
          scanSerialNumber: '',
          siteId: '',
          deviceId: '',
          tamperedPosition: '',
          createTime: []
        }
      },
      tableGroupRes: [
        // {
        //   label: this.$t('vicenter.common.No'),
        //   type: 'index'
        // },
        {
          label: this.$t('vicenter.inspection.tamperingRecord.scanSerialNumber'), // 任务号
          type: 'text',
          model: 'scanSerialNumber'
        },
        {
          label: this.$t('vicenter.inspection.common.office'),
          type: 'text',
          model: 'siteName'
        },
        {
          label: this.$t('vicenter.inspection.common.scannerID'),
          type: 'text',
          model: 'deviceCode'
        },
        {
          label: this.$t('vicenter.inspection.common.XRayImage'),
          type: 'img',
          height: '50px',
          model: 'lastScanImage'
        },
        {
          // 审图员
          type: 'text',
          model: 'analystAccount',
          label: this.$t('vicenter.inspection.checkStatistics.imgAnalyst') // 审图员
        },
        {
          // 篡改位置,
          type: 'text',
          model: 'tamperedPosition',
          label: this.$t('vicenter.inspection.tamperingRecord.tamperedPosition')
        },
        {
          // 通知管理员状态
          type: 'text',
          model: 'noticeStatus',
          label: this.$t('vicenter.inspection.tamperingRecord.noticeStatus')
        },
        {
          // 篡改时间
          type: 'text',
          model: 'createTime',
          label: this.$t('vicenter.inspection.tamperingRecord.createTime')
        }
      ],
      tableData: {
        data: [
        ],
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
        },
        searchData: {
          examinee: '',
          startTimeUpper: '',
          startTimeLower: '',
          size: 10,
          page: 0
        }
      },
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
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.orgAjaxTree()
    this.deviceAjaxTree()
    this.getSearchTransferOrigin()
    // this.getList()
  },
  methods: {
    getList (params = {}) {
      this.tableData.data = []
      this.tableData.isPage = false
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      ajax.getList(params).then((res) => {
        // this.showView = true
        if (res.data.flag) {
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(obj => {
            obj.tamperedPosition = this.$options.filters['tamperedPosition'](obj.tamperedPosition)
            obj.noticeStatus = this.$options.filters['noticeStatus'](obj.noticeStatus)
            obj.createTime = this.$options.filters['formatDate'](obj.createTime)
          })
          this.tableData.page.Allpage = res.data.result.totalElements
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
          this.showView = true
        }
      }).catch(() => {})
    },
    treeClick (data) {
      // console.log(this.inputItem[0].models)
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
        url: '/inspection/tampered/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.createTime
      let createTime = this.formRule.model.createTime
      if (createTime != null && createTime.length === 2) {
        params.timeStart = createTime[0].getTime()
        params.timeEnd = createTime[1].getTime()
      }
      return params
    },
    query (isPage = true) { // 页面查询
      let params = this.setParams()
      if (isPage) { // isPage为true，设置CurrentPage为第一页
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
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
      // this.tableGroup.push(this.tableOper)
    },
    saveListTranfer () {
      this.saveSearchcondation('2')
    }
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.Image-Analysis-bar {
  @extend .extend-bar;
  .Image-Analysis-M {
    .breadCrumb {
      position: relative;
    }
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
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
</style>
