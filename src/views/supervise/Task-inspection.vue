<template>
  <div class='Task-inspection-bar' v-bar>
    <div class="Task-inspection-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="infolist">
          <div class="panel panel-Q">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
              <el-button type="primary" size="mini" @click="openSearchDialog" data-id="querySet-btn">{{$t('vicenter.common.set')}}</el-button>
            </panelTitle>
            <div v-if='showInput' class="form-bar" v-bar>
              <ComForm ref="inputRef" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
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
import breadCrumb from '../../components/breadCrumb'
import ComForm from '../../components/form'
import panelTitle from '../../components/title'
import ComTable from '../../components/table'
import ajax from '../../api/supervise/Task-inspection.js'
import commonAjax from '../../api/common/common.js'
export default {
  name: 'Task-inspection',
  data () {
    return {
      exportButton: false,
      sysMenu: 'CASE_AUDIT_LIST',
      userDefine: [],
      isSavingSearch: false,
      isSavingList: false,
      transferDefaultS: [],
      transferDefaultL: [],
      isOpenSearch: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      isOpenList: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      showInput: false,
      falseFlag: true,
      titleBread: {},
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      inputItemRes: [
        {
          // getLabel: this.$t('vicenter.inspection.common.taskID'),
          type: 'text',
          models: '',
          ruleProp: 'scanSerialNumber'
        },
        {
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
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'lpnFront'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'decNumCvs'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          ruleProp: 'containerNumCsv'
        },
        {
          type: 'datetimerange',
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
          ruleProp: 'checkinTime',
          pickerOptions: {
            // disabledDate: (time) => {
            //   return time.getTime() > Date.now()
            // }
          },
          blur: this.blur,
          focus: this.focus
          // format: this.$t('vicenter.common.pickerFmt')
        },
        {
          type: 'datetimerange',
          models: [],
          editable: false,
          ruleProp: 'scanTime',
          pickerOptions: {
            // disabledDate: (time) => {
            //   return time.getTime() > Date.now()
            // }
          },
          blur: this.blur,
          focus: this.focus
          // format: this.$t('vicenter.common.pickerFmt')
        },
        {
          type: 'select',
          models: '',
          ruleProp: 'concImgcheck',
          clearable: true, // 可清除
          option: [
          ]
        },
        {
          type: 'select',
          models: '',
          ruleProp: 'concManual',
          clearable: true, // 可清除
          option: [
          ]
        },
        {
          type: 'select',
          models: '',
          ruleProp: 'concRecheck',
          clearable: true, // 可清除
          option: [
          ]
        }
        // ,
        // {
        //   type: 'select',
        //   models: '',
        //   ruleProp: 'bussinessType',
        //   clearable: true, // 可清除
        //   option: [
        //   ]
        // },
        // {
        //   type: 'select',
        //   models: '',
        //   ruleProp: 'isHandset',
        //   clearable: true, // 可清除
        //   option: []
        // },
        // {
        //   models: '',
        //   ruleProp: 'originSiteId',
        //   type: 'treeInput',
        //   treedata: [],
        //   checkedOption: [],
        //   treeView: false,
        //   treeIptId: 'originSitetreeInput',
        //   treeDataId: 'originSitetreeData',
        //   readonly: true,
        //   disabled: false,
        //   treeClick: this.treeClick,
        //   check: this.originSiteCheckChange,
        //   treeRefName: 'originSitetreeIptRef'
        // },
        // {
        //   models: '',
        //   ruleProp: 'destinationSiteId',
        //   type: 'treeInput',
        //   treedata: [],
        //   checkedOption: [],
        //   treeView: false,
        //   treeIptId: 'destinationtreeInput',
        //   treeDataId: 'destinationtreeData',
        //   readonly: true,
        //   disabled: false,
        //   treeClick: this.treeClick,
        //   check: this.destinationCheckChange,
        //   treeRefName: 'destinationtreeIptRef'
        // }
      ],
      inputItemOrigin: [],
      inputItem: [
      ],
      queryFn: { // 页面表单查询方法
        query: this.query
      },
      formRule: {
        refName: 'queryForm',
        model: {
          siteId: '',
          deviceId: '',
          lpnFront: '',
          containerNumCsv: '',
          decNumCvs: '',
          checkinTime: [
            new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).toLocaleDateString()),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
          ],
          scanTime: [],
          concImgCheck: '',
          concManual: ''
        }
      },
      tableGroupOrigin: [],
      tableGroupRes: [
        {
          type: 'img',
          height: '50px',
          model: 'lastScanImage',
          func: this.getDetail,
          cursor: 'pointer',
          width: '160px'
        },
        {
          type: 'text',
          model: 'scanSerialNumber',
          width: '180px'
        },
        {
          type: 'text',
          model: 'siteId',
          width: '90px'
        },
        {
          type: 'text',
          model: 'deviceId',
          width: '100px'
        },
        {
          type: 'text',
          model: 'lpnFront',
          width: '100px'
        },
        {
          type: 'text',
          model: 'decNumCvs',
          width: '160px'
        },
        {
          type: 'text',
          model: 'containerNumCsv',
          width: '120px'
        },
        {
          type: 'text',
          model: 'checkinTime',
          width: '140px'
        },
        {
          type: 'text',
          model: 'scanTime',
          width: '140px'
        },
        {
          type: 'text',
          model: 'concImgcheck',
          width: '190px'
        },
        {
          type: 'text',
          model: 'concManual',
          width: '220px'
        },
        {
          type: 'text',
          model: 'concRecheck',
          width: '220px'
        }
        // },
        // {
        //   type: 'text',
        //   model: 'bussinessType',
        //   width: '170px'
        // },
        // {
        //   type: 'text',
        //   model: 'isHandset',
        //   width: '170px'
        // },
        // {
        //   type: 'text',
        //   model: 'originSiteId',
        //   width: '190px'
        // },
        // {
        //   type: 'text',
        //   model: 'destinationSiteId',
        //   width: '190px'
        // }
      ],
      tableOper: {
        type: 'operation',
        model: 'operation',
        fixed: 'right'
      },
      tableGroup: [
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
      this.$getDataByTypecode(['IMG_CHECK_CONC', 'MANUAL_CHECK_CONC', 'RECHECK_CONC'], ['concImgcheck', 'concManual', 'concRecheck'], this.inputItemRes)
      // 面包屑
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Supervise/index'
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
          e.getLabel = this.$t('vicenter.supervise.taskInspection.taskID')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.enterTaskID')
        } else if (e.ruleProp === 'siteId') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.site')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseChooseSite')
        } else if (e.ruleProp === 'deviceId') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.device')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.enterDevice')
        } else if (e.ruleProp === 'lpnFront') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.frontLpn')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseInputLpn')
        } else if (e.ruleProp === 'decNumCvs') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.customsDeclarationnumber')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseEnterdeclarationnumber')
        } else if (e.ruleProp === 'containerNumCsv') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.containerNumber')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseEntercontainernumber')
        } else if (e.ruleProp === 'checkinTime') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.checkIntime')
          // e.format = this.$t('vicenter.common.pickerFmt')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
        } else if (e.ruleProp === 'scanTime') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.scanTime')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        } else if (e.ruleProp === 'concImgcheck') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.conclusionOfdrawing')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseSelectConclusion')
        } else if (e.ruleProp === 'concManual') {
          e.getLabel = this.$t('vicenter.supervise.taskInspection.concManual')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseSelectConcManual')
        } else if (e.ruleProp === 'concRecheck') {
          e.getLabel = this.$t('vicenter.supervise.taskInspectionDetail.auditConclusion')
          e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseSelectConcRecheck')
        }
        // else if (e.ruleProp === 'originSiteId') {
        //   // e.getLabel = this.$t('vicenter.supervise.taskInspection.startCustoms')
        //   e.getLabel = this.$t('vicenter.supervise.taskInspection.departureSite')
        //   e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseChoosedeparturesite')
        // } else if (e.ruleProp === 'destinationSiteId') {
        //   e.getLabel = this.$t('vicenter.supervise.taskInspection.destinationSite')
        //   e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseChoosedestinationSite')
        // } else if (e.ruleProp === 'isHandset') {
        //   e.getLabel = this.$t('vicenter.supervise.taskInspection.isHandset')
        //   e.placeHolder = this.$t('vicenter.supervise.taskInspection.pleaseSelectIsHandset')
        //   e.option = [
        //     {
        //       value: '1',
        //       label: this.$t('vicenter.common.filter.yesOrNo.yes')
        //     },
        //     {
        //       value: '0',
        //       label: this.$t('vicenter.common.filter.yesOrNo.no')
        //     }
        //   ]
        // }
      })
      // 查询列
      this.tableGroupRes.forEach((e) => {
        if (e.model === 'lastScanImage') {
          e.label = this.$t('vicenter.supervise.taskInspection.scannedImage')
        } else if (e.model === 'scanSerialNumber') {
          e.label = this.$t('vicenter.supervise.taskInspection.taskID')
        } else if (e.model === 'siteId') {
          e.label = this.$t('vicenter.supervise.taskInspection.site')
        } else if (e.model === 'deviceId') {
          e.label = this.$t('vicenter.supervise.taskInspection.device')
        } else if (e.model === 'lpnFront') {
          e.label = this.$t('vicenter.supervise.taskInspection.frontLpn')
        } else if (e.model === 'decNumCvs') {
          e.label = this.$t('vicenter.supervise.taskInspection.customsDeclarationnumber')
        } else if (e.model === 'containerNumCsv') {
          e.label = this.$t('vicenter.supervise.taskInspection.containerNumber')
        } else if (e.model === 'checkinTime') {
          e.label = this.$t('vicenter.supervise.taskInspection.checkIntime')
        } else if (e.model === 'scanTime') {
          e.label = this.$t('vicenter.supervise.taskInspection.scanTime')
        } else if (e.model === 'concImgcheck') {
          e.label = this.$t('vicenter.supervise.taskInspection.conclusionOfdrawing')
        } else if (e.model === 'concManual') {
          e.label = this.$t('vicenter.supervise.taskInspection.concManual')
        } else if (e.model === 'concRecheck') {
          e.label = this.$t('vicenter.supervise.taskInspectionDetail.auditConclusion')
        }
        // } else if (e.model === 'bussinessType') {
        //   e.label = this.$t('vicenter.supervise.taskInspection.businessType')
        // } else if (e.model === 'isHandset') {
        //   e.label = this.$t('vicenter.supervise.taskInspection.isHandset')
        // } else if (e.model === 'originSiteId') {
        //   e.label = this.$t('vicenter.supervise.taskInspection.departureSite')
        // } else if (e.model === 'destinationSiteId') {
        //   e.label = this.$t('vicenter.supervise.taskInspection.destinationSite')
        // }
      })
      // this.getList('')
      // this.query('page')
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
    setinputItemRes () {
      this.ajaxTree()
      this.deviceAjaxTree()
      this.getSearchTransferOrigin()
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
      ajax.getSearchCondition(params).then((res) => {
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
    getList (params) {
      this.tableData.data = []
      this.tableData.isPage = false
      ajax.list(params).then((res) => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$data.tableData.data = data.result.content
            this.$data.tableData.data.forEach(obj => {
              // // 是否手持机判断
              // if (obj.isHandset === '1') {
              //   obj.isHandset = this.$options.filters['yesOrNo']('1')
              // } else {
              //   obj.isHandset = this.$options.filters['yesOrNo']('0')
              // }
              obj.checkinTime = this.$options.filters['formatDate'](obj.checkinTime, this.$t('vicenter.common.formatDate'))
              obj.scanTime = this.$options.filters['formatDate'](obj.scanTime, this.$t('vicenter.common.formatDate'))
              // obj.bussinessType = obj.bussinessTypeI18nKey ? this.$t(obj.bussinessTypeI18nKey) : ''
              obj.siteId = obj.siteName
              obj.deviceId = obj.deviceCode
              // obj.originSiteId = obj.originSiteName
              // obj.destinationSiteId = obj.destinationSiteName
              obj.concImgcheck = obj.concImgcheck ? this.$t(obj.concImgcheck) : ''
              obj.concManual = obj.concManual ? this.$t(obj.concManual) : ''
              obj.concRecheck = obj.concRecheck ? this.$t(obj.concRecheck) : ''
              if (obj.lastScanImage === null || obj.lastScanImage === undefined || obj.lastScanImage === '') {
                obj.lastScanImage = require('@/assets/img/common/ViCenter.png')
              }
              obj.operation = [
                {
                  func: this.getDetail,
                  label: `<span class='iconfont editTable'>&#xe610;</span>`,
                  title: this.$t('vicenter.common.detail'),
                  show: obj.recheckAccount
                },
                {
                  func: this.getReview,
                  label: `<span class='iconfont editTable'>&#xe60a;</span>`,
                  title: this.$t('vicenter.supervise.taskInspection.audit'),
                  show: !obj.recheckAccount
                }
              ]
            })
            this.tableData.page.Allpage = data.result.totalElements
            if (this.tableData.data.length > 0) {
              this.tableData.isPage = true
            }
          }
        }
      }).catch(() => {})
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
    treeClick (data) {
      // console.log(this.inputItem[0].models)
    },
    siteIdCheckChange (nodeObj, checkedObj) {
      let ruleProp = 'siteId'
      this.checkChange(checkedObj, ruleProp)
    },
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
    // originSiteCheckChange (nodeObj, checkedObj) {
    //   let ruleProp = 'originSiteId'
    //   this.checkChange(checkedObj, ruleProp)
    // },
    // destinationCheckChange (nodeObj, checkedObj) {
    //   let ruleProp = 'destinationSiteId'
    //   this.checkChange(checkedObj, ruleProp)
    // },
    checkChange (checkedObj, ruleProp) {
      let checkedName = []
      let checkedId = []
      checkedObj.checkedNodes.forEach(e => {
        if (e.typeName && e.typeName === 'dynamic.asv.port') {
          if (checkedId.indexOf(e.id) === -1) {
            checkedName.push(e.name)
            checkedId.push(e.id)
          }
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
    getSort () {
      console.log(this.formRule)
    },
    exportExcel () {
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
    setParams () {
      let params = {}
      params = JSON.parse(JSON.stringify(this.formRule.model))
      delete params.checkinTime
      delete params.scanTime
      let keys = Object.keys(params)
      keys.forEach(e => {
        if (this.userDefine.indexOf(e) < 0) {
          delete params[e]
        }
      })
      if (this.userDefine.indexOf('checkinTime') > -1) {
        let checkinTime = this.formRule.model.checkinTime
        if (checkinTime != null && checkinTime.length === 2) {
          params.checkinTimeStart = checkinTime[0].getTime()
          params.checkinTimeEnd = checkinTime[1].getTime()
        }
      }
      if (this.userDefine.indexOf('scanTime') > -1) {
        let scanTime = this.formRule.model.scanTime
        if (scanTime != null && scanTime.length === 2) {
          params.scanTimeStart = scanTime[0].getTime()
          params.scanTimeEnd = scanTime[1].getTime()
        }
      }
      return params
    },
    query (isPage = '') { // 页面查询
      let params = this.setParams()
      if (isPage === 'page') {
        params.page = this.tableData.page.CurrentPage
      } else {
        params.page = 0
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      params.size = this.tableData.page.pagesize
      this.getList(params)
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
    },
    handleSizeChange (value) {
      this.$set(this.tableData.page, 'pagesize', value)
      this.query('page')
    },
    handleCurrentChange (value) {
      this.$set(this.tableData.page, 'CurrentPage', value - 1)
      this.query('page')
    },
    getDetail (scope) {
      this.$router.push({
        path: './Task-inspection-detail'
      })
      let details = {
        id: scope.row.id,
        reviewFlag: false
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    },
    getReview (scope) {
      this.$router.push({
        path: './Task-inspection-review'
      })
      let details = {
        id: scope.row.id,
        reviewFlag: true
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Supervise/Task-inspection-detail' && to.path !== '/Supervise/Task-inspection-review') {
      if (this.$refs.inputRef) {
        this.$refs.inputRef.reset()
      }
      this.formRule.model = {
        siteId: '',
        deviceId: '',
        lpnFront: '',
        containerNumCsv: '',
        decNumCvs: '',
        checkinTime: [],
        scanTime: [],
        concImgCheck: '',
        concManual: '',
        bussinessType: '',
        originSiteId: '',
        isHandset: ''
      }
      // 设置检入时间默认值
      this.inputItem.forEach(obj => {
        if (obj.ruleProp === 'checkinTime') {
          obj.models = obj.defaultValue
        }
      })
      // if (to.path !== '/login') {
      //   this.getList('')
      // }
      this.$set(this.$data.tableData.page, 'CurrentPage', 0)
      this.$set(this.$data.tableData.page, 'pagesize', 10)
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.Task-inspection-bar {
  @extend .extend-bar;
  .Task-inspection-M {
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
