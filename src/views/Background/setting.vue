<template>
  <div class='Background-setting' v-bar>
    <div class="settings-parms">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread" />
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="table-bar" v-bar>
            <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-dialog">
      <Dialog :modalData="modalData">
        <ComForm ref="modalForm" :searchIpt="modalItem" :searchFunc="modalFn" :formRule='modalRule'></ComForm>
      </Dialog>
    </div>
  </div>
</template>
<script>
import breadCrumb from '@/components/breadCrumb.vue'
import panelTitle from '@/components/title.vue'
import ComTable from '@/components/table.vue'
import ComForm from '@/components/form.vue'
import Dialog from '@/components/dialog.vue'
import ajax from '@/api/background/setting.js'
export default {
  name: 'Background-setting',
  data () {
    return {
      validateRules: [
        {
          pattern: /^(50{4}|[1-4]\d{4}|[1-9]\d{0,3})$/,
          message: this.$t('vicenter.Background.device.enterInteger', {msg: '1-50000'}),
          trigger: 'blur'
        },
        {
          pattern: /^(50{2}|[1-4]\d{2}|[1-9]\d{0,1})$/,
          message: this.$t('vicenter.Background.device.enterInteger', {msg: '1-500'}),
          trigger: 'blur'
        }
      ],
      modalRule: {
        refName: 'paramsInfoForm',
        rule: {
          confValue: [
            { required: true, message: ' ', trigger: 'blur' }
          ]
        },
        model: {
          id: '',
          confValue: ''
        }
      },
      modalFn: {
        query: this.sure,
        close: this.closeModal,
        queryText: this.$t('vicenter.common.save'),
        resetText: this.$t('vicenter.common.cancel')
      },
      modalItem: [
        {
          getLabel: this.$t('vicenter.Background.setting.describe'),
          type: 'text',
          disabled: true,
          ruleProp: 'nameI18nDisplayVal'
        }
      ],
      defaultModalItem: [
        {
          getLabel: this.$t('vicenter.Background.setting.parameterValues'),
          type: 'text',
          placeHolder: '',
          models: '',
          ruleProp: 'confValue'
        },
        {
          getLabel: this.$t('vicenter.Background.setting.parameterValues'),
          type: 'radio',
          placeHolder: '',
          models: '',
          ruleProp: 'confValue',
          option: [
            {
              label: this.$t('vicenter.common.open'),
              value: 'true'
            },
            {
              label: this.$t('vicenter.common.close'),
              value: 'false'
            }
          ]
        },
        {
          getLabel: this.$t('vicenter.Background.setting.parameterValues'),
          type: 'radio',
          placeHolder: '',
          models: '',
          ruleProp: 'confValue',
          option: [
            {
              label: this.$t('vicenter.common.automatic'),
              value: 'ASSIGN'
            },
            {
              label: this.$t('vicenter.common.manual'),
              value: 'GET'
            }
          ]
        }
      ],
      modalData: {
        title: this.$t('vicenter.Background.setting.modificationParameters'),
        flag: false,
        resetModal: this.resetModal
      },
      titleBread: {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Background/index'
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      tableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index',
          width: '100px'
        },
        {
          label: this.$t('vicenter.Background.setting.describe'),
          type: 'text',
          model: 'nameI18nDisplayVal'
        },
        {
          label: this.$t('vicenter.Background.setting.parameterValues'),
          type: 'text',
          model: 'confValueDisplay',
          width: '500px'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation',
          width: '150px'
        }
      ],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'paramsInfoTable',
        sortMethod: '',
        page: {}
      }
    }
  },
  methods: {
    sure () {
      let params = {
        id: this.$data.modalRule.model.id,
        confValue: this.$data.modalRule.model.confValue
      }
      ajax.updateSettingParams(params).then(res => {
        if (res.data.flag) {
          this.getSettingParams()
          this.$data.modalData.flag = false
          this.$NotifSuccess(this.$t('vicenter.common.editSuccessToLogIn'))
        }
      })
    },
    closeModal () {
      this.$data.modalData.flag = false
    },
    resetModal () {
      this.$refs.modalForm.reset()
    },
    getSettingParams () {
      this.$data.tableData.data = []
      ajax.querySettingParams().then(res => {
        let data = res.data
        if (data.flag) {
          this.$data.tableData.data = data.result.content
          this.$data.tableData.data.forEach(obj => {
            obj.nameI18nDisplayVal = obj.nameI18nKey ? this.$t(obj.nameI18nKey) : obj.nameI18nDisplay
            obj.nameI18nKey = this.$t(obj.nameI18nKey)
            if (obj.confKey === 'aiEnable' || obj.confKey === 'printEnable' || obj.confKey === 'exportEnable') {
              obj.confValueDisplay = obj.confValue === 'true' ? this.$t('vicenter.common.open') : this.$t('vicenter.common.close')
            } else if (obj.confKey === 'imageCheckMode') {
              obj.confValueDisplay = obj.confValue === 'GET' ? this.$t('vicenter.common.manual') : this.$t('vicenter.common.automatic')
            } else {
              obj.confValueDisplay = obj.confValue
            }
            obj.operation = [
              {
                func: this.getEdit,
                label: `<span class='iconfont editTable'>&#xe650;</span>`,
                title: this.$t('vicenter.common.fix'),
                show: true
              }]
          })
        }
      })
    },
    getEdit (scope) {
      this.$data.modalRule.model.id = scope.row.id
      this.$data.modalRule.model.confValue = scope.row.confValue
      this.$data.modalItem = this.$data.modalItem.splice(0, 1)
      this.$data.modalRule.rule.confValue = this.$data.modalRule.rule.confValue.splice(0, 1)
      switch (scope.row.confKey) {
        case 'maxExportNumber': { // 导出最大数量（条）
          this.$data.modalRule.rule.confValue[0].message = this.$data.validateRules[0].message
          this.$data.modalRule.rule.confValue.push(this.$data.validateRules[0])
          this.$data.modalItem.push(this.$data.defaultModalItem[0])
          break
        }
        case 'expiredDay': // 日志保留天数
        case 'maxUnallocationTask': { // 每人最大待分配任务数
          this.$data.modalRule.rule.confValue[0].message = this.$data.validateRules[1].message
          this.$data.modalRule.rule.confValue.push(this.$data.validateRules[1])
          this.$data.modalItem.push(this.$data.defaultModalItem[0])
          break
        }
        case 'aiEnable': // 智能分析(AI算法)
        case 'printEnable': // 打印功能
        case 'exportEnable': { // 导出功能
          this.$data.modalRule.rule.confValue[0].message = ' '
          this.$data.modalItem.push(this.$data.defaultModalItem[1])
          break
        }
        case 'imageCheckMode': { // 审图任务分派模式
          this.$data.modalRule.rule.confValue[0].message = ' '
          this.$data.modalItem.push(this.$data.defaultModalItem[2])
          break
        }
        default: {
          this.$data.modalItem.push(this.$data.defaultModalItem[0])
        }
      }
      let tempArr = this.$data.modalItem
      for (const obj of tempArr) {
        obj.models = scope['row'][obj.ruleProp]
      }
      this.$data.modalData.flag = true
    }
  },
  created () {
    this.getSettingParams()
  },
  components: { breadCrumb, panelTitle, ComTable, ComForm, Dialog }
}
</script>
<style lang="scss">
@import '@/styles/index.scss';
.Background-setting {
  @extend .extend-bar;
  .settings-parms {
    padding:$margin;
    @include box-sizing;
    .infolist {
      .panel {
        @extend .extend-panel;
      }
      .panel-Q {
        width: $all;
      }
      .table-bar {
        width: $all;
        @media screen and (min-width: 1640px) {
          height: $all;
          overflow: hidden;
        }
      }
    }
  }
  .tableComp {
    padding-bottom: 0px;
  }
  .modal-dialog {
    .search-form {
      @include layout(2);
      .el-radio-group {
        text-align: left;
      }
    }
    .el-input.is-disabled {
      .el-input__inner {
        color: #c0c4cc;
      }
    }
  }
}
</style>
