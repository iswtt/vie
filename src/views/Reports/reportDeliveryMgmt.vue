<template>
  <div id='report-delivery-bar' v-bar>
    <div class="report-delivery-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="formIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
         <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button data-id="addApp-btn" type="primary" size="mini" @click="handleAdd">{{$t('vicenter.common.add')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData">
        <div class="report-delivery-modal" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)">
          <ComForm v-if="isEdit" ref="modalFormRef" :searchIpt="modalData.formIpt" :searchFunc="modalData.SearchFunc" :formRule='modalData.formRule'></ComForm>
          <ComForm v-if="!isEdit" ref="detailModalFormRef" :searchIpt="modalData.formDetailIpt" :searchFunc="modalData.SearchFunc" :formRule='modalData.formDetailRule'></ComForm>
          <div class="report-delivery-button">
            <el-button v-if="isEdit" data-id="save-btn" @click="save" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
            <el-button v-if="isEdit" data-id="cancel-btn" @click="closeModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
            <el-button v-if="!isEdit" data-id="back-btn" @click="closeModal" size="mini">{{$t('vicenter.common.back')}}</el-button>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/reports/reportsDelivery.js'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import ComForm from '@/components/form'
import ComTable from '@/components/table'
import Dialog from '@/components/dialogCommon'
export default {
  name: 'reportDelivery',
  data () {
    var checkReceiver = (rule, value, callback) => {
      let val = []
      this.modalData.formIpt.forEach(e => {
        if (e.ruleProp === 'receiver') {
          val = e.models
        }
      })
      // if (value && value.length === 0) {
      if (val && val.length === 0) {
        setTimeout(() => {
          callback(new Error(this.$t('vicenter.reports.reportDelivery.receiverSelect')))
        }, 100)
      } else {
        let noEmail = value.filter(e => this.noEmailAccount.includes(e))
        setTimeout(() => {
          if (noEmail.length > 0) {
            callback(new Error(this.$t('vicenter.reports.reportDelivery.noEmail', {msg: noEmail.join(', ')})))
          } else {
            callback()
          }
        }, 100)
      }
    }
    return {
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
            path: '/Reports/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      formRule: {
        refName: 'reportDeliveryQueryForm',
        model: {
          reportName: '',
          reportType: '',
          receiver: ''
        },
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      formIpt: [ // 查询表单初始化
        {
          getLabel: this.$t('vicenter.reports.reportDelivery.reportName'),
          type: 'select',
          models: '',
          ruleProp: 'reportName',
          clearable: true, // 可清除
          option: []
        },
        {
          getLabel: this.$t('vicenter.reports.reportDelivery.reportType'),
          type: 'select',
          models: '',
          ruleProp: 'reportType',
          clearable: true, // 可清除
          option: []
        },
        {
          getLabel: this.$t('vicenter.reports.reportDelivery.receiver'),
          type: 'select',
          models: '',
          ruleProp: 'receiver',
          clearable: true, // 可清除
          option: []
        }
      ],
      tableData: { // 表格数据
        refName: 'reportDeliveryTable',
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
          Allpage: 100
        }
      },
      tableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.reportName'),
          type: 'text',
          model: 'reportNameVal'
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.reportDimension'),
          type: 'text',
          model: 'reportDimensionVal'
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.reportStyle'),
          type: 'text',
          model: 'reportStyle'
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.reportType'),
          type: 'text',
          model: 'reportTypeVal'
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.sendTime'),
          type: 'text',
          model: 'sendTime'
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.receiver'),
          type: 'text',
          model: 'receiver'
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.status'),
          type: 'text',
          model: 'statusVal'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation',
          width: '160px'
        }
      ],
      modalData: {
        width: '60%',
        title: '',
        flag: false,
        closeModal: this.closeModal,
        formRule: {
          refName: 'modalQueryForm',
          model: {
            reportName: '',
            reportDimension: '',
            reportStyle: [],
            reportType: '',
            sendTime: '',
            receiver: []
          },
          rule: {
            reportName: [
              { required: true, message: this.$t('vicenter.reports.reportDelivery.reportNameSelect'), trigger: 'change' }
            ],
            reportStyle: [
              { required: true, message: this.$t('vicenter.reports.reportDelivery.reportStyleSelect'), trigger: 'change' }
            ],
            reportDimension: [],
            sendTime: [
              { required: true, message: this.$t('vicenter.reports.reportDelivery.sendTimeSelect'), trigger: 'change' }
            ],
            receiver: [
              { required: true, message: this.$t('vicenter.reports.reportDelivery.receiverSelect'), trigger: 'change' },
              { validator: checkReceiver, trigger: 'change' }
            ]
          }
        },
        reportDimensionRule: [
          { required: true, message: this.$t('vicenter.reports.reportDelivery.reportDimensionSelect'), trigger: 'change' }
        ],
        formIpt: [
          {
            getLabel: this.$t('vicenter.reports.reportDelivery.reportName'),
            placeHolder: this.$t('vicenter.reports.reportDelivery.reportNameSelect'),
            type: 'select',
            models: '',
            ruleProp: 'reportName',
            clearable: true, // 可清除
            option: [],
            change: this.changeReportName
          },
          {
            getLabel: this.$t('vicenter.reports.reportDelivery.reportDimension'),
            placeHolder: this.$t('vicenter.reports.reportDelivery.reportDimensionSelect'),
            type: 'select',
            models: '',
            ruleProp: 'reportDimension',
            clearable: true, // 可清除
            option: [],
            change: this.changeReportDimension
          },
          {
            getLabel: this.$t('vicenter.reports.reportDelivery.reportStyle'),
            type: 'select2',
            models: '',
            ruleProp: 'reportStyle',
            clearable: false,
            option: [],
            change: this.changeReportStyle
          },
          {
            getLabel: this.$t('vicenter.reports.reportDelivery.reportType'),
            type: 'select',
            models: '',
            ruleProp: 'reportType',
            clearable: false,
            option: []
          },
          {
            getLabel: this.$t('vicenter.reports.reportDelivery.sendTime'),
            placeHolder: this.$t('vicenter.reports.reportDelivery.sendTimeSelect'),
            type: 'timepicker',
            // valueFormat: 'timestamp',
            valueFormat: 'HH:mm',
            format: 'HH:mm',
            models: '',
            ruleProp: 'sendTime'
          },
          {
            getLabel: this.$t('vicenter.reports.reportDelivery.receiver'),
            placeHolder: this.$t('vicenter.reports.reportDelivery.receiverSelect'),
            type: 'select2',
            models: '',
            ruleProp: 'receiver',
            clearable: true, // 可清除
            option: [],
            change: this.changeReceiver
          }
        ],
        formDetailIpt: [],
        formDetailRule: {
          refName: 'modalDetailQueryForm',
          model: {
            reportName: '',
            reportDimension: '',
            reportStyle: '',
            reportType: '',
            sendTime: '',
            receiver: ''
          },
          rule: {}
        },
        SearchFunc: {
          queryText: '',
          resetText: ''
        }
      },
      loading: false,
      reportName: [
        {
          label: this.$t('vicenter.reports.menusName.taskVolumeReport'),
          value: 'TASK_NUM_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.imageCheckTaskReport'),
          value: 'IMGCHECK_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.recheckTaskReport'),
          value: 'SECOND_IMGCHK_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.manualTaskReport'),
          value: 'MANUAL_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.auditTaskReport'),
          value: 'RECHECK_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.imgAnalystTaskReport'),
          value: 'INSPECTOR_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.recheckorTaskReport'),
          value: 'RECHECK_INSPECTOR_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.physicalInspectorTaskReport'),
          value: 'PHYSICAL_INSPECTOR_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.auditorTaskReport'),
          value: 'AUDITOR_TASK_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.imageCheckAccuracyReport'),
          value: 'IMGCHK_ACCURACY_REP'
        },
        {
          label: this.$t('vicenter.reports.menusName.recheckAccuracyReport'),
          value: 'SECOND_IMGCHK_ACCURACY_REP'
        }
      ],
      reportType: [
        {
          label: this.$t('vicenter.reports.reportDelivery.DAILY'),
          value: 'DAILY' // 日报
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.WEEKLY'),
          value: 'WEEKLY' // 周报
        },
        {
          label: this.$t('vicenter.reports.reportDelivery.MONTHLY'),
          value: 'MONTHLY' // 月报
        }
      ],
      reportStyle: [
        {
          label: 'EXCEL',
          value: 'EXCEL'
        },
        {
          label: 'PDF',
          value: 'PDF'
        }
      ],
      reportDimension: [
        {
          label: this.$t('vicenter.reports.common.region'),
          value: 'CUSTOM' // 关区
        },
        {
          label: this.$t('vicenter.reports.common.port'),
          value: 'SITE' // 口岸
        },
        {
          label: this.$t('vicenter.reports.common.device'),
          value: 'DEVICE' // 设备
        }
      ],
      operationAll: [
        {
          func: this.handleDetail,
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          title: this.$t('vicenter.common.detail'),
          show: true
        },
        {
          func: this.handleEdit,
          label: `<span class='iconfont editTable'>&#xe650;</span>`,
          title: this.$t('vicenter.common.fix'),
          show: true
        },
        {
          func: this.handlePublish,
          label: `<span class='iconfont editTable bigFont'>&#xe702;</span>`,
          title: this.$t('vicenter.reports.reportDelivery.enable'),
          show: true
        },
        {
          func: this.handleUnpublish,
          label: `<span class='iconfont editTable bigFont'>&#xe712;</span>`,
          title: this.$t('vicenter.reports.reportDelivery.disable'),
          show: true
        },
        {
          func: this.handleDelete,
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          title: this.$t('vicenter.common.delete'),
          show: true
        }
      ],
      id: '',
      isEdit: true,
      receiverEmailAll: [],
      noEmailAccount: []
    }
  },
  created () {
    this.modalData.formIpt.forEach(item => {
      if (item.ruleProp === 'reportName') {
        item.option = this.reportName
        this.formIpt[0].option = this.reportName
      }
      if (item.ruleProp === 'reportDimension') {
        item.option = this.reportDimension
      }
      if (item.ruleProp === 'reportStyle') {
        item.option = this.reportStyle
        item.models = [item.option[0].value]
      }
      if (item.ruleProp === 'reportType') {
        item.option = this.reportType
        item.models = item.option[0].value
        this.formIpt[1].option = this.reportType
      }
    })
    ajax.getUser({size: 999999999}).then((res) => {
      if (res.data.flag && res.data.result.content.length > 0) {
        this.formIpt[2].option = res.data.result.content.map(e => {
          return {
            label: e.account,
            value: e.account,
            email: e.email || ''
          }
        })
        this.noEmailAccount = []
        this.formIpt[2].option.forEach(e => {
          if (!e.email) {
            this.noEmailAccount.push(e.value)
          }
        })
        this.modalData.formIpt.forEach(item => {
          if (item.ruleProp === 'receiver') {
            item.option = this.formIpt[2].option
          }
        })
        this.modalData.formDetailIpt = JSON.parse(JSON.stringify(this.modalData.formIpt))
        this.modalData.formDetailIpt.forEach(item => {
          item.disabled = true
          if (item.ruleProp === 'reportStyle' || item.ruleProp === 'receiver') {
            item.type = 'textarea'
            item.autoSize = 3
          }
        })
      }
    }).catch(() => {})
  },
  mounted () {
    this.query()
  },
  methods: {
    query (isPage = true) {
      let params = JSON.parse(JSON.stringify(this.formRule.model))
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
            e.reportNameVal = e.reportName ? this.reportName.filter(r => r.value === e.reportName)[0].label : ''
            e.reportDimensionVal = e.reportDimension ? this.reportDimension.filter(r => r.value === e.reportDimension)[0].label : '-'
            e.reportTypeVal = e.reportType ? this.reportType.filter(r => r.value === e.reportType)[0].label : ''
            if (e.status === 'PUBLISHED') {
              e.statusVal = this.$t('vicenter.reports.reportDelivery.enabled')
              e.operation = [this.operationAll[0], this.operationAll[3]]
            } else {
              e.statusVal = this.$t('vicenter.reports.reportDelivery.disabled')
              e.operation = [this.operationAll[0], this.operationAll[1], this.operationAll[2], this.operationAll[4]]
            }
          })
          this.formRule.model.page = res.data.result.pageable.pageNumber
          this.formRule.model.size = res.data.result.pageable.pageSize
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
        }
      }).catch(() => {})
    },
    save () {
      this.$refs['modalFormRef'].$refs[this.modalData.formRule.refName].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.modalData.formRule.model))
          params.id = this.id
          params.reportStyle = params.reportStyle.join(',')
          params.receiver = params.receiver.join(',')
          params.receiverEmail = this.receiverEmailAll.join(',')
          ajax.getEdit(params).then((res) => {
            if (res.data.flag) {
              if (this.id) {
                this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
              } else {
                this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
              }
              this.closeModal()
              this.query()
            }
          }).catch(() => {})
        }
      })
    },
    handleAdd () {
      this.id = ''
      this.modalData.title = this.$t('vicenter.common.add')
      this.isEdit = true
      this.modalData.flag = true
      this.$nextTick(() => {
        this.$refs['modalFormRef'].reset()
        this.modalData.formIpt.forEach(item => {
          if (item.ruleProp === 'reportStyle') {
            item.models = [item.option[0].value]
          }
          if (item.ruleProp === 'reportType') {
            item.models = item.option[0].value
          }
        })
        this.changeReportName(false)
      })
    },
    handleDetail (scope) {
      this.isEdit = false
      this.modalData.title = this.$t('vicenter.common.detail')
      this.modalData.formDetailIpt.forEach(item => {
        item.models = scope.row[item.ruleProp]
      })
      this.modalData.flag = true
    },
    handleEdit (scope) {
      this.id = scope.row.id
      this.isEdit = true
      this.modalData.title = this.$t('vicenter.common.fix')
      this.modalData.formIpt.forEach(item => {
        if (item.ruleProp === 'reportStyle' || item.ruleProp === 'receiver') {
          item.models = scope.row[item.ruleProp].split(',')
          this.modalData.formRule.model[item.ruleProp] = scope.row[item.ruleProp].split(',')
        } else {
          item.models = scope.row[item.ruleProp]
          this.modalData.formRule.model[item.ruleProp] = scope.row[item.ruleProp]
        }
      })
      this.changeReportName(false)
      this.changeReceiver(false)
      this.modalData.flag = true
    },
    handlePublish (scope) {
      this.$ConfirmBox(this.$t('vicenter.common.enableConfirm'), () => {
        ajax.getEnable({id: scope.row.id}).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.enableSuccess'))
            this.query()
          }
        }).catch(() => {})
      })
    },
    handleUnpublish (scope) {
      this.$ConfirmBox(this.$t('vicenter.common.disableConfirm'), () => {
        ajax.getEnable({id: scope.row.id}).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.disableSuccess'))
            this.query()
          }
        }).catch(() => {})
      })
    },
    handleDelete (scope) {
      this.$ConfirmBox(this.$t('vicenter.common.deleteConfirm'), () => {
        ajax.getDelete({id: scope.row.id}).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
            this.query()
          }
        }).catch(() => {})
      })
    },
    handleSizeChange (val) {
      this.$set(this.tableData.page, 'pagesize', val)
      this.query(false)
    },
    handleCurrentChange (val) {
      this.$set(this.tableData.page, 'CurrentPage', val - 1)
      this.query(false)
    },
    closeModal () {
      this.modalData.flag = false
    },
    changeReportName (flag = true) {
      if (flag) {
        this.changeValidate('reportName')
      }
      let curReportName = this.modalData.formIpt[0].models
      let disabledDimension = [
        'INSPECTOR_TASK_REP',
        'RECHECK_INSPECTOR_TASK_REP',
        'PHYSICAL_INSPECTOR_TASK_REP',
        'AUDITOR_TASK_REP',
        'IMGCHK_ACCURACY_REP',
        'SECOND_IMGCHK_ACCURACY_REP'
      ]
      if (disabledDimension.indexOf(curReportName) > -1) {
        this.modalData.formIpt[1].disabled = true
        this.modalData.formIpt[1].models = ''
        this.modalData.formRule.model.reportDimension = ''
        this.modalData.formRule.rule.reportDimension = []
      } else {
        this.modalData.formIpt[1].disabled = false
        this.modalData.formRule.rule.reportDimension = this.modalData.reportDimensionRule
      }
    },
    changeReportDimension () {
      this.changeValidate('reportDimension')
    },
    changeReportStyle () {
      this.changeValidate('reportStyle')
    },
    changeReceiver (flag = true) {
      if (flag) {
        this.changeValidate('receiver')
      }
      this.modalData.formIpt.forEach(e => {
        if (e.ruleProp === 'receiver') {
          if (e.models.length > 0) {
            this.receiverEmailAll = []
            e.option.forEach(o => {
              if (e.models.indexOf(o.value) > -1) {
                this.receiverEmailAll.push(o.email)
              }
            })
          } else {
            this.receiverEmailAll = []
          }
        }
      })
    },
    changeValidate (data) {
      this.$changeSelectValidateField('modalFormRef', this, data)
    },
    getSort () {}
  },
  components: {bread, panelTitle, ComForm, ComTable, Dialog}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#report-delivery-bar {
  @extend .extend-bar;
  .report-delivery-M {
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
.report-delivery-modal {
  .search-form {
    @include layout(3);
    justify-content: flex-start!important;
    align-items: flex-start!important;
    .search-form-btn .el-form-item__content {
      display: none;
    }
    .el-input__inner {
      height: 32px!important;
    }
    .is-disabled {
      .el-input__inner {
        height: 32px!important;
      }
    }
  }
  .report-delivery-button {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
