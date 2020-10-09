<template>
  <div class='History-bar' v-bar>
    <div class="History-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="infolist">
          <div class="panel panel-Q">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
                <el-button type="primary" size="mini" data-id="querySet-btn" @click='openSearchDialog'>{{$t('vicenter.common.set')}}</el-button>
            </panelTitle>
            <div v-if='showInput' class="form-bar" v-bar>
              <ComForm ref="inputRef" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
            </div>
          </div>
          <div class="panel panel-L">
            <panelTitle :panelTitleInit="panelTitle.listTitle">
               <!-- <el-button type="primary" size="mini" @click='excelExport'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button> -->
               <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='historyExportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
               <el-button type="primary" size="mini" data-id="listSet-btn" @click='openListDialog'>{{$t('vicenter.common.set')}}</el-button>
            </panelTitle>
            <div class="form-bar" v-bar>
              <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
            </div>
          </div>
        </div>
     </div>
        <el-dialog :title="searchTransfer.title" :visible.sync="searchTransfer.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag' class='searchTransfer'>
          <div class="transfer-box" v-loading="isSavingSearch" element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-transfer v-if="isOpenSearch" v-model="searchTransfer.transfer.model" :data="searchTransfer.transfer.data" :titles="searchTransfer.transfer.title" :button-texts="searchTransfer.transfer.button" target-order="push" :right-default-checked="transferDefaultS"></el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="searchTransfer.transfer.model.length === 0 || isSavingSearch" @click="saveSearchTranfer">{{this.$t('vicenter.common.save')}}</el-button>
            <el-button :disabled="isSavingSearch" @click="dontSaveSearchTranfer">{{this.$t('vicenter.common.back')}}</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="listTransfer.title" :visible.sync="listTransfer.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag' class='searchTransfer'>
          <div class="transfer-box" v-loading="isSavingList" element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-transfer v-if="isOpenList" v-model="listTransfer.transfer.model" :data="listTransfer.transfer.data" :titles="listTransfer.transfer.title" :button-texts="listTransfer.transfer.button" target-order="push" :right-default-checked="transferDefaultL"></el-transfer>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="listTransfer.transfer.model.length === 0 || isSavingList" @click="saveListTranfer">{{this.$t('vicenter.common.save')}}</el-button>
            <el-button :disabled="isSavingList" @click="dontSaveListTranfer">{{this.$t('vicenter.common.back')}}</el-button>
          </div>
        </el-dialog>
  </div>
</template>
<script>
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import ajax from '@/api/inspection/History.js'
import commonAjax from '@/api/common/common.js'
import exportExcel from '@/lib/exportExcel/export2Excel.js'
export default {
  name: 'History',
  data () {
    return {
      exportButton: false,
      sysMenu: 'HISTORICAL_CASE_LIST',
      transferDefaultS: [],
      transferDefaultL: [],
      isSavingSearch: false,
      isSavingList: false,
      isOpenSearch: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      isOpenList: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      needTreeData: ['siteId', 'originSiteId', 'destinationSiteId'],
      showInput: false,
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
        queryTitle: {
          // title: this.$t('vicenter.common.query')
        },
        listTitle: {
          // title: this.$t('vicenter.common.list')
        }
      },
      inputItemOrigin: [],
      inputItem: [],
      inputItemRes: [
        {
          // getLabel: this.$t('vicenter.inspection.common.taskID'),
          type: 'text',
          models: '',
          ruleProp: 'scanSerialNumber'
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.site'),
          // placeHolder: this.$t('vicenter.inspection.common.enterOffice'),
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
          // getLabel: this.$t('vicenter.inspection.history.LPN'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.history.LPNSelect'),
          models: '',
          ruleProp: 'lpnFront'
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.declarationNo'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.history.declarationNoSelect'),
          models: '',
          ruleProp: 'decNumCvs'
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.containerNo'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.inspection.history.containerNoSelect'),
          models: '',
          ruleProp: 'containerNumCsv'
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.checkInTime'),
          type: 'datetimerange',
          // startPlace: this.$t('vicenter.common.startTime'),
          // endPlace: this.$t('vicenter.common.endTime'),
          models: [
            new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).toLocaleDateString()),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
          ],
          KeepDefault: true, // 保留默认值
          defaultValue: [
            new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).toLocaleDateString()),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
          ],
          clearable: false, // 不允许清空
          editable: false,
          ruleProp: 'checkinTime'
          // format: this.$t('vicenter.common.pickerFmt')
        },
        {
          type: 'datetimerange',
          models: [],
          editable: false,
          ruleProp: 'scanTime'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.analystID'),
          type: 'text',
          // placeHolder: this.$t('vicenter.inspection.common.enterAnalystID'),
          models: '',
          ruleProp: 'analystAccount'
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.conclusion'),
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          type: 'select',
          models: '',
          ruleProp: 'concImgcheck',
          clearable: true, // 可清除
          option: [
          ]
        },
        {
          // getLabel: this.$t('vicenter.supervise.taskInspection.concManual'),
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          type: 'select',
          models: '',
          ruleProp: 'concManual',
          clearable: true, // 可清除
          option: [
          ]
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.conclusionFrom'),
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          type: 'select',
          models: '',
          ruleProp: 'concImgcheckFlag',
          clearable: true, // 可清除
          option: [
            // {
            //   value: '1',
            //   label: this.$t('vicenter.inspection.history.concImgcheckCenter')
            // },
            // {
            //   value: '2',
            //   label: this.$t('vicenter.inspection.history.concImgcheckLocal')
            // }
          ]
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.scanNonConformityCode'),
          type: 'select',
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: '',
          ruleProp: 'contrabandType',
          clearable: true, // 可清除
          option: []
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.businessType'),
          type: 'select',
          // placeHolder: this.$t('vicenter.inspection.history.businessTypeSelect'),
          models: '',
          ruleProp: 'bussinessType',
          clearable: true, // 可清除
          option: [
          ]
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.startSite'),
          // placeHolder: this.$t('vicenter.inspection.history.startSiteSelect'),
          models: '',
          ruleProp: 'originSiteId',
          type: 'treeInput',
          treedata: [],
          treeView: false,
          treeIptId: 'originSitetreeInput',
          treeDataId: 'originSitetreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.originSiteCheckChange,
          treeRefName: 'originSitetreeIptRef'
        },
        {
          // getLabel: this.$t('vicenter.inspection.history.endSite'),
          // placeHolder: this.$t('vicenter.inspection.history.endSiteSelect'),
          models: '',
          ruleProp: 'destinationSiteId',
          type: 'treeInput',
          treedata: [],
          treeView: false,
          treeIptId: 'destinationtreeInput',
          treeDataId: 'destinationtreeData',
          readonly: true,
          disabled: false,
          treeClick: this.treeClick,
          check: this.destinationCheckChange,
          treeRefName: 'destinationtreeIptRef'
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.inspector'),
          type: 'select2',
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: [],
          ruleProp: 'analystId',
          roleCode: 'INSPECTOR',
          option: []
        },
        {
          // getLabel: this.$t('vicenter.inspection.common.recheckInspector'),
          type: 'select2',
          // placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: [],
          ruleProp: 'reviewerId',
          roleCode: 'RECHECK-INSPECTOR',
          option: []
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
      falseFlag: true,
      searchTransfer: {
        // title: this.$t('vicenter.common.definedQuery'),
        flag: false,
        transfer: {
          model: [],
          data: []
          // title: [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')],
          // button: [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
        }
      },
      listTransfer: {
        // title: this.$t('vicenter.common.definedList'),
        flag: false,
        transfer: {
          model: [],
          data: []
          // title: [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')],
          // button: [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
        }
      },
      queryFn: { // 页面表单查询方法
        query: this.query
        // queryText: this.$t('vicenter.common.query'),
        // resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        model: {
          siteId: '',
          deviceId: '',
          lpnFront: '',
          decNumCvs: '',
          containerNumCsv: '',
          checkinTime: [
            new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).toLocaleDateString()),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
          ],
          scanTime: [],
          analystAccount: '',
          concImgcheck: '',
          concImgcheckFlag: '',
          concManual: '',
          contrabandType: '',
          bussinessType: '',
          originSiteId: '',
          destinationSiteId: '',
          scanSerialNumber: '',
          analystId: [],
          reviewerId: [],
          phyInspectorId: []
        }
      },
      tableGroupOrigin: [],
      CheckBox: [
        {
          type: 'selection'
        },
        {
          type: 'index'
        }
      ],
      tableOper: {
        // label: this.$t('vicenter.common.operation'),
        type: 'operation',
        model: 'operation',
        fixed: 'right'
      },
      tableGroupRes: [
        {
          // label: this.$t('vicenter.inspection.history.scanImg'),
          type: 'imgoperation',
          height: '50px',
          model: 'lastScanImage',
          width: '160px'
        },
        {
          // label: this.$t('vicenter.inspection.common.taskID'),
          type: 'text',
          model: 'scanSerialNumber',
          width: '180px'
        },
        {
          // label: this.$t('vicenter.inspection.history.site'),
          type: 'text',
          model: 'siteId',
          width: '90px'
        },
        {
          // label: this.$t('vicenter.inspection.common.scannerID'),
          type: 'text',
          model: 'deviceId',
          width: '100px'
        },
        {
          // label: this.$t('vicenter.inspection.history.LPN'),
          type: 'text',
          model: 'lpnFront',
          width: '100px'
        },
        {
          // label: this.$t('vicenter.inspection.history.declarationNo'),
          type: 'text',
          model: 'decNumCvs',
          width: '160px'
        },
        {
          // label: this.$t('vicenter.inspection.history.containerNo'),
          type: 'text',
          model: 'containerNumCsv',
          width: '120px'
        },
        {
          // label: this.$t('vicenter.inspection.history.checkInTime'),
          type: 'text',
          model: 'checkinTime',
          width: '140px'
        },
        {
          type: 'text',
          model: 'scanTime',
          width: '140px'
        },
        // {
        //   // label: this.$t('vicenter.inspection.common.analystID'),
        //   type: 'text',
        //   model: 'analystAccount'
        // },
        {
          // label: this.$t('vicenter.inspection.history.conclusion'),
          type: 'text',
          model: 'concImgcheck',
          width: '190px'
        },
        {
          // label: this.$t('vicenter.supervise.taskInspection.concManual'),
          type: 'text',
          model: 'concManual',
          width: '220px'
        },
        {
          // label: this.$t('vicenter.inspection.history.conclusionFrom'),
          type: 'text',
          model: 'concImgcheckFlag'
        },
        {
          // label: this.$t('vicenter.inspection.common.scanNonConformityCode'),
          type: 'text',
          model: 'contrabandType'
        },
        {
          // label: this.$t('vicenter.inspection.history.businessType'),
          type: 'text',
          model: 'bussinessType'
        },
        {
          // label: this.$t('vicenter.inspection.history.startSite'),
          type: 'text',
          model: 'originSiteId'
        },
        {
          // label: this.$t('vicenter.inspection.history.endSite'),
          type: 'text',
          model: 'destinationSiteId'
        },
        {
          // label: this.$t('vicenter.inspection.history.endSite'),
          type: 'text',
          model: 'analystId',
          width: '140px'
        },
        {
          // label: this.$t('vicenter.inspection.history.endSite'),
          type: 'text',
          model: 'reviewerId',
          width: '120px'
        },
        {
          // label: this.$t('vicenter.inspection.history.endSite'),
          type: 'text',
          model: 'phyInspectorId',
          width: '140px'
        }
      ],
      tableGroup: [],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        isSort: true,
        refName: 'multipleTable',
        tableCellClassName: this.tableCellClass,
        sortMethod: this.getSortTable,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        }
      },
      exportFileName: '',
      detailId: -1,
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.tempIndex = 1
    this.setI18n()
    // this.$getDataByTypecode(['IMG_CHECK_CONC', 'BUSSINESS_TYPE', 'CONTRABAND_TYPE', 'MANUAL_CHECK_CONC'], ['concImgcheck', 'bussinessType', 'contrabandType', 'concManual'], this.inputItemRes)
  },
  mounted () {
    // this.getList('')
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      this.setinputItemRes()
      this.$getDataByTypecode(['IMG_CHECK_CONC', 'BUSSINESS_TYPE', 'CONTRABAND_TYPE', 'MANUAL_CHECK_CONC'], ['concImgcheck', 'bussinessType', 'contrabandType', 'concManual'], this.inputItemRes)
      // 面包屑
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
      this.panelTitle.queryTitle.title = this.$t('vicenter.common.query')
      this.panelTitle.listTitle.title = this.$t('vicenter.common.list')
      // 查询按钮
      this.queryFn.queryText = this.$t('vicenter.common.query')
      this.queryFn.resetText = this.$t('vicenter.common.reset')
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
        if (e.ruleProp === 'scanSerialNumber') {
          e.getLabel = this.$t('vicenter.inspection.common.taskID')
          e.placeHolder = this.$t('vicenter.inspection.common.entertaskID')
        } else if (e.ruleProp === 'siteId') {
          e.getLabel = this.$t('vicenter.inspection.history.site')
          e.placeHolder = this.$t('vicenter.inspection.common.enterOffice')
        } else if (e.ruleProp === 'deviceId') {
          e.getLabel = this.$t('vicenter.inspection.common.scannerID')
          e.placeHolder = this.$t('vicenter.inspection.common.enterScannerID')
        } else if (e.ruleProp === 'lpnFront') {
          e.getLabel = this.$t('vicenter.inspection.history.LPN')
          e.placeHolder = this.$t('vicenter.inspection.history.LPNSelect')
        } else if (e.ruleProp === 'decNumCvs') {
          e.getLabel = this.$t('vicenter.inspection.history.declarationNo')
          e.placeHolder = this.$t('vicenter.inspection.history.declarationNoSelect')
        } else if (e.ruleProp === 'containerNumCsv') {
          e.getLabel = this.$t('vicenter.inspection.history.containerNo')
          e.placeHolder = this.$t('vicenter.inspection.history.containerNoSelect')
        } else if (e.ruleProp === 'checkinTime') {
          e.getLabel = this.$t('vicenter.inspection.history.checkInTime')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        } else if (e.ruleProp === 'scanTime') {
          e.getLabel = this.$t('vicenter.inspection.common.scanningTime')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        } else if (e.ruleProp === 'analystAccount') {
          e.getLabel = this.$t('vicenter.inspection.common.analystID')
          e.placeHolder = this.$t('vicenter.inspection.common.enterAnalystID')
        } else if (e.ruleProp === 'concImgcheck') {
          e.getLabel = this.$t('vicenter.inspection.history.conclusion')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.history.conclusion')})
        } else if (e.ruleProp === 'concManual') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.concManual')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.supervise.taskInspection.concManual')})
        } else if (e.ruleProp === 'concImgcheckFlag') {
          e.getLabel = this.$t('vicenter.inspection.history.conclusionFrom')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.history.conclusionFrom')})
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.option = [
            {
              value: '1',
              label: this.$t('vicenter.inspection.history.concImgcheckCenter')
            },
            {
              value: '2',
              label: this.$t('vicenter.inspection.history.concImgcheckLocal')
            }
          ]
        } else if (e.ruleProp === 'contrabandType') {
          e.getLabel = this.$t('vicenter.inspection.common.scanNonConformityCode')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.common.scanNonConformityCode')})
        } else if (e.ruleProp === 'bussinessType') {
          e.getLabel = this.$t('vicenter.inspection.history.businessType')
          e.placeHolder = this.$t('vicenter.inspection.history.businessTypeSelect')
        } else if (e.ruleProp === 'originSiteId') {
          e.getLabel = this.$t('vicenter.inspection.history.startSite')
          e.placeHolder = this.$t('vicenter.inspection.history.startSiteSelect')
        } else if (e.ruleProp === 'destinationSiteId') {
          e.getLabel = this.$t('vicenter.inspection.history.endSite')
          e.placeHolder = this.$t('vicenter.inspection.history.endSiteSelect')
        } else if (e.ruleProp === 'analystId') {
          e.getLabel = this.$t('vicenter.inspection.common.inspector')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.common.inspector')})
        } else if (e.ruleProp === 'reviewerId') {
          e.getLabel = this.$t('vicenter.inspection.common.recheckInspector')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.common.recheckInspector')})
        } else if (e.ruleProp === 'phyInspectorId') {
          e.getLabel = this.$t('vicenter.inspection.common.physicalInspector')
          // e.placeHolder = this.$t('vicenter.common.pleaseSelcet')
          e.placeHolder = this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.inspection.common.physicalInspector')})
        }
      })
      // 查询列
      this.tableGroupRes.forEach((e) => {
        if (e.model === 'lastScanImage') {
          e.label = this.$t('vicenter.inspection.history.scanImg')
        } else if (e.model === 'scanSerialNumber') {
          e.label = this.$t('vicenter.inspection.common.taskID')
        } else if (e.model === 'siteId') {
          e.label = this.$t('vicenter.inspection.history.site')
        } else if (e.model === 'deviceId') {
          e.label = this.$t('vicenter.inspection.common.scannerID')
        } else if (e.model === 'lpnFront') {
          e.label = this.$t('vicenter.inspection.history.LPN')
        } else if (e.model === 'decNumCvs') {
          e.label = this.$t('vicenter.inspection.history.declarationNo')
        } else if (e.model === 'containerNumCsv') {
          e.label = this.$t('vicenter.inspection.history.containerNo')
        } else if (e.model === 'checkinTime') {
          e.label = this.$t('vicenter.inspection.history.checkInTime')
        } else if (e.model === 'scanTime') {
          e.label = this.$t('vicenter.inspection.common.scanningTime')
        } else if (e.model === 'analystId') {
          e.label = this.$t('vicenter.inspection.common.inspector')
        } else if (e.model === 'concImgcheck') {
          e.label = this.$t('vicenter.inspection.history.conclusion')
        } else if (e.model === 'concManual') {
          e.label = this.$t('vicenter.supervise.taskInspection.concManual')
        } else if (e.model === 'concImgcheckFlag') {
          e.label = this.$t('vicenter.inspection.history.conclusionFrom')
        } else if (e.model === 'contrabandType') {
          e.label = this.$t('vicenter.inspection.common.scanNonConformityCode')
        } else if (e.model === 'bussinessType') {
          e.label = this.$t('vicenter.inspection.history.businessType')
        } else if (e.model === 'originSiteId') {
          e.label = this.$t('vicenter.inspection.history.startSite')
        } else if (e.model === 'destinationSiteId') {
          e.label = this.$t('vicenter.inspection.history.endSite')
        } else if (e.model === 'reviewerId') {
          e.label = this.$t('vicenter.inspection.common.recheckInspector')
        } else if (e.model === 'phyInspectorId') {
          e.label = this.$t('vicenter.inspection.common.physicalInspector')
        }
      })
      this.exportFileName = this.$t('vicenter.inspection.history.historyTask')
      // this.query()
      this.getSearchTransferOrigin()
    },
    getList (params) {
      this.tableData.data = []
      this.tableData.isPage = false
      ajax.getTableList(params).then((res) => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$data.tableData.data = data.result.content
            this.$data.tableData.data.forEach(obj => {
              // 是否手持机判断
              if (obj.isHandset === '1') {
                obj.isHandset = this.$options.filters['yesOrNo']('1')
              } else {
                obj.isHandset = this.$options.filters['yesOrNo']('0')
              }
              obj.checkinTime = this.$options.filters['formatDate'](obj.checkinTime, this.$t('vicenter.common.formatDate'))
              obj.scanTime = this.$options.filters['formatDate'](obj.scanTime, this.$t('vicenter.common.formatDate'))
              obj.siteId = obj.siteName
              obj.deviceId = obj.deviceCode
              obj.bussinessType = obj.bussinessType ? this.$t(obj.bussinessType) : ''
              obj.contrabandType = this.$t(obj.contrabandType)
              obj.concManual = this.$t(obj.concManual)
              obj.originSiteId = obj.originSiteName
              obj.destinationSiteId = obj.destinationSiteName
              obj.concImgcheck = obj.concImgcheck ? this.$t(obj.concImgcheck) : ''
              obj.analystId = obj.analystAccount
              obj.reviewerId = obj.reviewerAccount
              obj.phyInspectorId = obj.phyInspectorAccount
              if (obj.lastScanImage === null || obj.lastScanImage === undefined || obj.lastScanImage === '') {
                obj.lastScanImage = require('@/assets/img/common/ViCenter.png')
              }
              obj.operation = [
                {
                  func: this.getDetail,
                  label: `<span class='iconfont editTable'>&#xe610;</span>`,
                  title: this.$t('vicenter.common.detail'),
                  show: true
                }
              ]
              obj.lastScanImage = {
                src: obj.lastScanImage,
                func: this.getDetail
              }
              obj.concImgcheckFlag = this.$options.filters['concImgcheckFlag'](obj.concImgcheckFlag)
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
    openSearchDialog () {
      this.searchTransfer.flag = true
      this.isOpenSearch = true
    },
    openListDialog () {
      this.listTransfer.flag = true
      this.isOpenList = true
    },
    historyExportExcel () {
      const {lang} = this.$store.state
      let model = this.setParams()
      let params = {
        lang: lang,
        model: model,
        sysMenu: this.sysMenu,
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/supervise/tasksearch/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    // getDefaultListTransferOrigin () {
    //   console.log('defaultList')
    //   ajax.getDefaultSearchCondition({ufType: 2}).then((res) => {
    //     if (res.data.flag) {
    //       res.data.result.forEach(e => {
    //         this.$data.tableGroupOrigin.forEach(orgin => {
    //           if (orgin.model === e.taskField) {
    //             this.$data.tableGroup.push(orgin)
    //           }
    //         })
    //       })
    //       this.$data.tableGroup.unshift({
    //         label: this.$t('vicenter.common.No'),
    //         type: 'index'
    //       })
    //     }
    //     this.getListTransfer()
    //   }).catch(() => {})
    // },
    getListTransferOrigin () {
      this.$data.tableGroupOrigin = []
      this.$data.tableGroup = []
      let params = {
        ufType: 2,
        sysMenu: this.sysMenu
      }
      ajax.getSearchCondition(params).then((res) => {
        if (res.data.flag) {
          this.tableGroupRes.forEach(orgin => {
            res.data.result.allEnableSc.forEach(e => {
              if (orgin.model === e.taskField) {
                orgin.id = e.id
                this.$data.tableGroupOrigin.push(orgin)
              }
            })
          })
          if (res.data.result.userDefineSc.length > 0) {
            console.log('userList')
            this.$data.tableGroupOrigin.forEach(orgin => {
              res.data.result.userDefineSc.forEach(e => {
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
        }
      }).catch(() => {})
    },
    // getDefaultSearchTransferOrigin () {
    //   console.log('defaultSearch')
    //   ajax.getDefaultSearchCondition({ufType: 1}).then((res) => {
    //     if (res.data.flag) {
    //       res.data.result.forEach(e => {
    //         this.$data.tableGroupOrigin.forEach(orgin => {
    //           if (orgin.model === e.taskField) {
    //             this.$data.inputItem.push(orgin)
    //           }
    //         })
    //       })
    //     }
    //     this.getSearchTransfer()
    //   }).catch(() => {})
    // },
    // 针对检入时间增加默认值增加了flag参数，表示保存查询条件之前是否有检入时间项
    getSearchTransferOrigin (flag = true) {
      this.$data.inputItemOrigin = []
      this.$data.inputItem = []
      let params = {
        ufType: 1,
        sysMenu: this.sysMenu
      }
      ajax.getSearchCondition(params).then((res) => {
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
          if (res.data.result.userDefineSc.length > 0) {
            console.log('userSearch')
            res.data.result.userDefineSc.forEach(e => {
              this.$data.inputItemOrigin.forEach(orgin => {
                if (orgin.ruleProp === e.taskField) {
                  this.$data.inputItem.push(orgin)
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
        }
        this.getListTransferOrigin()
      }).catch(() => {})
    },
    getSort () {
      console.log(this.formRule)
    },
    getSearchTransfer () {
      this.searchTransfer.transfer.data = []
      this.searchTransfer.transfer.model = []
      this.inputItemOrigin.forEach(ele => {
        this.searchTransfer.transfer.data.push({
          key: ele.id,
          label: ele.getLabel
        })
      })
      this.inputItem.forEach(e => {
        this.searchTransfer.transfer.model.push(e.id)
        if (e.type === 'treeInput') {
          e.checkedOption = this.formRule.model[e.ruleProp].split(',')
        }
      })
      this.query()
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
    getSortTable ({column, prop, order}) { // 表格排序
      if (prop === null && order === null) {
        this.$data.formRule.model.sort = ''
      } else {
        if (order === 'descending') {
          const orde = 'desc'
          this.$data.formRule.model.sort = `${prop},${orde}`
        } else {
          this.$data.formRule.model.sort = `${prop}`
        }
      }
      this.query()
    },
    setParams () {
      let params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.checkinTime
      delete params.scanTime
      let checkinTime = this.formRule.model.checkinTime
      if (checkinTime != null && checkinTime.length === 2) {
        params.checkinTimeStart = checkinTime[0].getTime()
        params.checkinTimeEnd = checkinTime[1].getTime()
      }
      let scanTime = this.formRule.model.scanTime
      if (scanTime != null && scanTime.length === 2) {
        params.scanTimeStart = scanTime[0].getTime()
        params.scanTimeEnd = scanTime[1].getTime()
      }
      params.analystId = params.analystId.length > 0 ? params.analystId.join(',') : ''
      params.reviewerId = params.reviewerId.length > 0 ? params.reviewerId.join(',') : ''
      params.phyInspectorId = params.phyInspectorId.length > 0 ? params.phyInspectorId.join(',') : ''
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
    handleSizeChange (value) {
      this.$set(this.tableData.page, 'pagesize', value)
      this.query(false)
    },
    handleCurrentChange (value) {
      this.$set(this.tableData.page, 'CurrentPage', value - 1)
      this.query(false)
    },
    getDetail (scope) { // 获取历史任务详情
      this.$router.push({
        path: 'History-detail'
      })
      let detailId = scope.row.id
      sessionStorage.setItem('detailId', JSON.stringify(detailId))
    },
    saveSearchcondition (ufType) {
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
      ajax.updateSearchCondition(params).then((res) => {
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
      this.saveSearchcondition('1')
    },
    saveListTranfer () {
      this.saveSearchcondition('2')
    },
    dontSaveSearchTranfer () {
      this.searchTransfer.flag = false
      this.searchTransfer.transfer.model = []
      this.inputItem.forEach(ele => {
        this.searchTransfer.transfer.model.push(ele.id)
      })
    },
    dontSaveListTranfer () {
      this.listTransfer.flag = false
      this.listTransfer.transfer.model = []
      this.tableGroup.forEach(ele => {
        if (ele.type !== 'operation' && ele.type !== 'index') {
          this.listTransfer.transfer.model.push(ele.id)
        }
      })
    },
    treeClick (data) {
      // console.log(this.inputItem[0].models)
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
    originSiteCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'originSiteId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['originSiteId'] = checkedValue.ids
      }
    },
    destinationCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$checkChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.inputItem.forEach(e => {
          if (e.ruleProp === 'destinationSiteId') {
            e.models = checkedValue.name
          }
        })
        this.formRule.model['destinationSiteId'] = checkedValue.ids
      }
    },
    checkChange (refs, ruleProp) {
      let checkedName = []
      let checkedId = []
      let checked = refs.getCheckedNodes()
      checked.forEach(e => {
        // this.getCheckedChirden(e, checkedName, checkedId)
        if (e.children.length === 0 && e.pid !== null) {
          if (!this.$isInArray(checkedId, e.id)) {
            checkedName.push(e.name)
            checkedId.push(e.id)
          }
        } else {
          e.children.forEach(child => {
            if (!this.$isInArray(checkedId, child.id)) {
              checkedName.push(child.name)
              checkedId.push(child.id)
            }
          })
        }
      })
      let name = checkedName.join(',')
      let ids = checkedId.join(',')
      this.inputItem.forEach(e => {
        if (e.ruleProp === ruleProp) {
          e.models = name
        }
      })
      this.formRule.model[ruleProp] = ids
    },
    getCheckedChirden (node, names, ids) {
      if (node.children.length === 0) {
        names.push(node.name)
        ids.push(node.id)
      } else {
        this.getCheckedChirden(node, names, ids)
      }
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
    ajaxTree () { // 获取机构树方法
      commonAjax.orgNodesTree({all: true}).then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.$data.inputItemRes.forEach(e => {
            if (this.needTreeData.indexOf(e.ruleProp) !== -1) {
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
    setinputItemRes () {
      this.ajaxTree()
      this.deviceAjaxTree()
      // 获取人员信息
      this.getPersonInfo('INSPECTOR')
      this.getPersonInfo('RECHECK-INSPECTOR')
      this.getPersonInfo('PHYSICAL-INSPECTOR')
    },
    excelExport () {
      let tableData = []
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.checkinTime
      delete params.scanTime
      let checkinTime = this.formRule.model.checkinTime
      if (checkinTime != null && checkinTime.length === 2) {
        params.checkinTimeStart = checkinTime[0].getTime()
        params.checkinTimeEnd = checkinTime[1].getTime()
      }
      let scanTime = this.formRule.model.scanTime
      if (scanTime != null && scanTime.length === 2) {
        params.scanTimeStart = scanTime[0].getTime()
        params.scanTimeEnd = scanTime[1].getTime()
      }
      params.page = 0
      params.size = 5000
      ajax.getTableList(params).then((res) => {
      // ajax.exportexcel(params).then((res) => {
        console.log(res)
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            tableData = data.result.content
            let exportTHeader = []
            let exportFields = []
            let dontExport = ['index', 'operation', 'selection', 'lastScanImage']
            this.tableGroup.forEach((item) => {
              if (dontExport.indexOf(item.model) === -1) {
                exportTHeader.push(item.label)
                let model = item.model
                if (item.model === 'siteId') {
                  model = 'siteName'
                } else if (item.model === 'deviceId') {
                  model = 'deviceCode'
                } else if (item.model === 'originSiteId') {
                  model = 'originSiteName'
                } else if (item.model === 'destinationSiteId') {
                  model = 'destinationSiteName'
                }
                exportFields.push(model)
              }
            })
            tableData.forEach(obj => {
              obj.checkinTime = this.$options.filters['formatDate'](obj.checkinTime)
              obj.scanTime = this.$options.filters['formatDate'](obj.scanTime, this.$t('vicenter.common.formatDate'))
              obj.bussinessType = this.$t(obj.bussinessType)
              obj.contrabandType = this.$t(obj.contrabandType)
              obj.concImgcheck = this.$t(obj.concImgcheck)
            })
            console.log('deviceId')
            exportExcel({exportArray: tableData, tHeader: exportTHeader, filterFields: exportFields, fileName: this.exportFileName})
          } else {
            // this.$ConfirmMsgBox(data.message)
            return false
          }
        }
      }).catch(() => {
        this.$ConfirmMsgBox(this.$t('vicenter.common.filter.error'))
        return false
      })
    },
    tableCellClass ({row, column, rowIndex, columnIndex}) {
      if (column.property === 'concImgcheck') {
        if (row.concImgcheck === this.$t('vicenter.DIC.T_IMG_CHECK_CONC.C_CONC001')) {
          return 'bgColorRed'
        } else {
          return 'bgColorGreen'
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Inspection/History-detail') {
      if (this.$refs.inputRef) {
        this.$refs.inputRef.reset()
      }
      this.formRule.model = {
        siteId: '',
        deviceId: '',
        lpnFront: '',
        decNumCvs: '',
        containerNumCsv: '',
        checkinTime: [],
        analystAccount: '',
        concImgcheck: '',
        concImgcheckFlag: '',
        concManual: '',
        contrabandType: '',
        bussinessType: '',
        originSiteId: '',
        destinationSiteId: '',
        scanSerialNumber: '',
        analystId: [],
        reviewerId: [],
        phyInspectorId: []
      }
      // 设置检入时间默认值
      this.inputItem.forEach(obj => {
        if (obj.ruleProp === 'checkinTime') {
          obj.models = obj.defaultValue
        }
      })
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
.History-bar {
  @extend .extend-bar;
  .History-M {
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
    .tableComp .el-table th div {
      display: table!important;
    }
    .bgColorGreen{
      background: #00ff41 !important;
    }
    .bgColorRed{
      background: #ff0000 !important;
    }
  }
}
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
</style>
