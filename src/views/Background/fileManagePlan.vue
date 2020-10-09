<template>
  <div id='background-fileManagePlan-bar' v-bar>
    <div class="background-fileManagePlan-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.detailTitle">
            <div v-if='!isEdit'>
              <el-button  type="primary" size="mini" data-id="executeNow-btn" @click="execute">{{$t('vicenter.common.executeNow')}}</el-button>
              <el-button  type="primary" size="mini" data-id="edit-btn" @click="getEdit">{{$t('vicenter.common.edit')}}</el-button>
            </div>
            <div v-else>
              <el-button  type="primary" size="mini" data-id="save-btn" @click="saveEdit">{{$t('vicenter.common.save')}}</el-button>
              <el-button  type="primary" size="mini" data-id="cancel-btn" @click="cancelEdit">{{$t('vicenter.common.cancel')}}</el-button>
            </div>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComForm :searchIpt="infoForm" :searchFunc="SearchFunc" :formRule='formRule' :fromClass ='formClass'></ComForm>
          </div>
        </div>
      </div>
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
  // 归档策略管理
  name: 'fileManagePlan',
  data () {
    return {
      test: [],
      isEdit: false,
      panelTitle: {
        detailTitle: {
          title: this.$t('vicenter.Background.fileManage.planDetail')
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
      infoForm: [
        {
          // 归档周期
          disabled: true,
          type: 'select',
          getLabel: this.$t('vicenter.Background.fileManage.shelfLife'),
          models: '',
          ruleProp: 'shelfLife',
          option: [
            {
              label: this.$t('vicenter.Background.fileManage.SLTwelve'),
              value: 12
            },
            {
              label: this.$t('vicenter.Background.fileManage.SLTwentyFour'),
              value: 24
            },
            {
              label: this.$t('vicenter.Background.fileManage.SLThirtySix'),
              value: 36
            }
          ]
        },
        {
          disabled: true,
          type: 'checkbox',
          getLabel: this.$t('vicenter.Background.fileManage.manageCondition'),
          models: [],
          ruleProp: 'ArcPolicyInfoDto',
          option: [
            {
              label: this.$t('vicenter.Background.fileManage.MCImgNoSus'),
              value: '',
              disabled: true,
              checked: false
            },
            {
              label: this.$t('vicenter.Background.fileManage.MCImgSusManNoSus'),
              value: '',
              disabled: true,
              checked: false
            },
            {
              label: this.$t('vicenter.Background.fileManage.MCImgSusManSus'),
              value: '',
              disabled: true,
              checked: false
            }
          ]
        }
      ],
      formClass: {
        form: 'search-form',
        formItem: 'search-form-item',
        label: 'search-form-label',
        iptClass: 'search-form-input',
        buttonClass: 'firbutton'
      },
      SearchFunc: { // 查询方法
        queryText: '',
        resetText: ''
      },
      formRule: {
        model: {
          shelfLife: '',
          ArcPolicyInfoDto: []
        },
        refName: 'queryForm',
        rule: {}
      }
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    query () { // 用于form表单查询方法
      ajax.getPlan({}).then((res) => {
        if (res.data.flag) {
          let {shelfLife, listMgmtArcPolicyDto} = res.data.result // 归档周期
          let ArcPolicyInfoDto = listMgmtArcPolicyDto // 归档条件
          this.infoForm[0].models = shelfLife
          this.infoForm[1].models = []
          this.formRule.model.ArcPolicyInfoDto = []
          ArcPolicyInfoDto.forEach(e => {
            let {policyImgcheck, id, policyManual, isEnable} = e
            // 无嫌疑:policyImgcheck:CONC002 有嫌疑无查获:policyImgcheck:CONC001且policyManual:MC002. 有嫌疑查获:policyImgcheck:CONC001且policyManual:MC001
            let index = 0
            if (policyImgcheck === 'CONC002') {
              this.infoForm[1].option[0].value = id
            }
            if (policyImgcheck === 'CONC001' && policyManual === 'MC002') {
              this.infoForm[1].option[1].value = id
              index = 1
            }
            if (policyImgcheck === 'CONC001' && policyManual === 'MC001') {
              this.infoForm[1].option[2].value = id
              index = 2
            }
            if (isEnable === '1') {
              this.infoForm[1].option[index].checked = true
              this.infoForm[1].models.push(id)
              this.formRule.model.ArcPolicyInfoDto.push(id)
            } else {
              this.infoForm[1].option[index].checked = false
            }
          })
        }
      }).catch(() => {})
    },
    execute () {
      ajax.manualarc({}).then((res) => {
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.archiveSuccess'))
        }
      })
    },
    getEdit () { // 编辑
      this.infoForm.forEach(e => {
        e.disabled = false
      })
      this.infoForm[1].option.forEach(e => {
        e.disabled = false
      })
      this.isEdit = true
    },
    cancelEdit () { // 取消编辑
      this.query()
      this.infoForm.forEach(e => {
        e.disabled = true
      })
      this.infoForm[1].option.forEach(e => {
        e.disabled = true
      })
      this.isEdit = false
    },
    saveEdit () {
      let {ArcPolicyInfoDto, shelfLife} = this.formRule.model
      let enablePlIds = ArcPolicyInfoDto.join(',')
      let params = {
        enablePlIds: enablePlIds,
        shelfLife: shelfLife
      }
      // 归档条件至少选一个
      if (!params.enablePlIds) {
        this.$NotifPrompt(this.$t('vicenter.Background.fileManage.requiredCondition'))
        return
      }
      ajax.updatePlan(params).then((res) => {
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
          this.cancelEdit()
        } else {
          // this.query()
        }
      }).catch(() => {})
    }
  },
  components: {bread, ComForm, panelTitle, ComTable}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
#background-fileManagePlan-bar {
  @extend .extend-bar;
  .background-fileManagePlan-M {
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
          @include layout(1);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
        width: $all;
        .firbutton{
          display: none;
        }
        .el-form-item__content{
          width: max-content;
          padding-left: 7%;
        }
      }
      .search-form-item:first-child{
        border-bottom: #bdbbbb 1px solid;
      }
      .el-form-item {
        padding-bottom: 22px;
        margin: 0;
      }
    }
  }
}
</style>
