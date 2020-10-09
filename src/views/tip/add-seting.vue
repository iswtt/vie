<template>
   <div class='add-seting-bar' v-bar>
     <div class="up-down-container">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="up-down-infolist">
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
              <div>
                <el-button type="primary" size="mini" @click='getBack()' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
              </div>
            </panelTitle>
            <div class="transfer-box transferCss">
              <el-transfer v-model="transfer.model" :data="transfer.data" :titles="transfer.title" :button-texts="transfer.button" data-id="setting-transfer"></el-transfer>
            </div>
          </div>
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
            <ComForm ref="formCheck" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
          </div>
        </div>
     </div>
   </div>
</template>

<script>
import breadCrumb from '../../components/breadCrumb'
import panelTitle from '../../components/title'
import ComForm from '../../components/form'
import ajax from '../../api/tip/Assessment.js'
import commonAjax from '../../api/common/common.js'
export default {
  name: 'add-seting',
  data () {
    var validateFrequency = (rule, value, callback) => {
      let {frequencyType} = this.formRule.model
      if (value === '') {
        return callback(new Error(this.$t('vicenter.tip.addSetting.frequency')))
      }
      if (frequencyType === '') {
        return callback(new Error(this.$t('vicenter.tip.addSetting.frequencyTypeSelect')))
      }
      var reg = /^[1-9]\d*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('vicenter.tip.addSetting.number')))
      } else {
        if (frequencyType === '0') {
          if (value < 30 || value > 100) {
            callback(new Error(this.$t('vicenter.tip.addSetting.frequencyTime')))
          } else {
            callback()
          }
        } else {
          if (value < 10 || value > 100) {
            callback(new Error(this.$t('vicenter.tip.addSetting.frequencyAmount')))
          } else {
            callback()
          }
        }
      }
    }
    var validateTime = (rule, value, callback) => {
      var time = new Date().getTime()
      if (value[0].getTime() < time || value[1].getTime() < time) {
        callback(new Error(this.$t('vicenter.tip.addSetting.greaterCurrentTime')))
      } else if (value[1] <= value[0]) {
        callback(new Error(this.$t('vicenter.tip.addSetting.greater')))
      } else {
        callback()
      }
    }
    return {
      examineeInfo: [],
      transfer: {
        model: [],
        data: [],
        title: [this.$t('vicenter.tip.addSetting.rapporteur'), this.$t('vicenter.tip.addSetting.selectedPersonnel')],
        button: [this.$t('vicenter.tip.addSetting.deleting'), this.$t('vicenter.tip.addSetting.addSelection')]
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Tip/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: { // title组件数据
        queryTitle: {
          title: this.$t('vicenter.tip.addSetting.selectionOfMap')
        },
        listTitle: {
          title: this.$t('vicenter.tip.addSetting.settingAssessmentInformation')
        }
      },
      inputItem: [
        {
          getLabel: this.$t('vicenter.tip.addSetting.appraisalName'),
          type: 'text',
          placeHolder: this.$t('vicenter.tip.addSetting.inputExaminationName'),
          models: '',
          ruleProp: 'name'
        },
        {
          getLabel: this.$t('vicenter.tip.addSetting.dateOfAssessment'),
          type: 'datetimerange',
          startPlace: this.$t('vicenter.common.startTime'),
          endPlace: this.$t('vicenter.common.endTime'),
          models: [],
          ruleProp: 'time',
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() < Date.now() - 3600 * 1000 * 24 * 1
            }
          }
        },
        {
          getLabel: this.$t('vicenter.tip.addSetting.assessmentMethod'),
          type: 'select',
          placeHolder: this.$t('vicenter.tip.addSetting.frequencyType'),
          models: '',
          ruleProp: 'frequencyType',
          change: this.changeFrequencyType,
          option: [
            {
              value: '0',
              label: this.$t('vicenter.tip.addSetting.timeInterval')
            },
            {
              value: '1',
              label: this.$t('vicenter.tip.addSetting.numberApprovedDrawings')
            }
          ]
        },
        {
          getLabel: this.$t('vicenter.tip.addSetting.examinationFrequency'),
          type: 'text',
          placeHolder: this.$t('vicenter.tip.addSetting.frequency'),
          models: '',
          ruleProp: 'frequency'
        },
        {
          getLabel: this.$t('vicenter.tip.addSetting.degreeDifficulty'),
          type: 'select',
          placeHolder: this.$t('vicenter.tip.addSetting.difficultySelect'),
          models: '',
          ruleProp: 'difficulty',
          change: this.changeDifficulty,
          option: [
            {
              value: '1',
              label: this.$t('vicenter.tip.addSetting.easily')
            },
            {
              value: '2',
              label: this.$t('vicenter.tip.addSetting.difficulty')
            }
          ]
        },
        {
          type: 'inputNum',
          min: 1,
          max: window.config.tipImageQtyMax,
          models: '',
          ruleProp: 'imageQty',
          getLabel: this.$t('vicenter.tip.common.imageQty'),
          placeHolder: this.$t('vicenter.tip.common.selectimageQty')
        },
        {
          type: 'select2',
          models: [],
          ruleProp: 'imageCategories',
          getLabel: this.$t('vicenter.tip.imageManagement.imageCategory'),
          placeHolder: this.$t('vicenter.tip.common.selectImageCategoryNotOverFive'),
          option: [],
          multipleLimit: 5
        }
      ],
      queryFn: { // 页面表单查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.save'),
        resetText: this.$t('vicenter.tip.addSetting.empty')
      },
      formRule: { // 表单验证和存放数据 model=> post到后台的数据
        refName: 'settingForm',
        rule: {
          name: [
            { required: true, message: this.$t('vicenter.tip.addSetting.name'), trigger: 'blur' }
          ],
          time: [
            { required: true, message: this.$t('vicenter.tip.addSetting.time'), trigger: 'blur' },
            { validator: validateTime, trigger: 'blur' }
          ],
          frequencyType: [
            { required: true, message: this.$t('vicenter.tip.addSetting.frequencyType'), trigger: 'blur' }
          ],
          frequency: [
            { required: true, message: this.$t('vicenter.tip.addSetting.frequency'), trigger: 'blur' },
            { validator: validateFrequency, trigger: 'blur' }
          ],
          difficulty: [
            { required: true, message: this.$t('vicenter.tip.addSetting.difficultySelect'), trigger: 'blur' }
          ],
          imageQty: [
            { required: true, message: this.$t('vicenter.tip.addSetting.imageQty'), trigger: 'blur' }
          ]
        },
        model: {}
      }
    }
  },
  created () {
    this.getTransferData()
    this.$getDataByTypecode(['TIP_IMAGE_CATEGORY'], ['imageCategories'], this.inputItem)
  },
  methods: {
    getBack () {
      this.$router.push({ path: '/Tip/Assessment-settings' })
    },
    getTransferData () {
      commonAjax.getUsers({roleCode: window.config.roleCode, appCode: window.config.appCode}).then(res => {
        if (res.data.flag) {
          this.examineeInfo = res.data.result
          this.examineeInfo.forEach(ele => {
            this.transfer.data.push({
              key: ele.id,
              label: ele.account
            })
          })
        }
      }).catch(() => {})
    },
    query () { // 保存
      let {name, difficulty, frequencyType, frequency, time, imageQty, imageCategories} = this.formRule.model
      let startTime = time[0].getTime()
      let endTime = time[1].getTime()
      let examineeIds = this.transfer.model
      if (examineeIds === null || examineeIds.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.tip.addSetting.personnelSelect'))
        return false
      }
      let examineeList = []
      examineeIds.forEach(examineeId => {
        this.examineeInfo.forEach(info => {
          if (info.id === examineeId) {
            let examinee = {id: info.id, account: info.account, name: info.name}
            examineeList.push(examinee)
          }
        })
      })
      let param = {
        name: name,
        difficulty: difficulty,
        frequencyType: frequencyType,
        frequency: frequency,
        startTime: startTime,
        endTime: endTime,
        examineeList: examineeList.length === 0 ? '' : JSON.stringify(examineeList),
        imageQty: imageQty,
        imageCategories: imageCategories.join(',')
      }
      ajax.addExam(param).then(res => {
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
          this.$router.push({
            path: '/Tip/Assessment-settings'
          })
        }
      })
    },
    changeFrequencyType () {
      if (this.inputItem[2].models === '1') {
        this.inputItem[3].getLabel = this.$t('vicenter.tip.addSetting.examinationFrequencyNum')
      } else if (this.inputItem[2].models === '0') {
        this.inputItem[3].getLabel = this.$t('vicenter.tip.addSetting.examinationFrequencyMin')
      } else {
        this.inputItem[3].getLabel = this.$t('vicenter.tip.addSetting.examinationFrequency')
      }
      this.$changeSelectValidateField('formCheck', this, 'frequencyType')
    },
    changeDifficulty () {
      this.$changeSelectValidateField('formCheck', this, 'difficulty')
    }
  },
  components: { breadCrumb, panelTitle, ComForm }
}
</script>

<style lang="scss">
@import "../../styles/index.scss";
.add-seting-bar {
  @extend .extend-bar;
  .transfer-box {
    padding: $margin;
    @include flex();
    .transQuery {
      align-self: flex-end;
      margin-left: 40px;
    }
  }
  .transferCss {
    .el-transfer {
      .el-transfer-panel:last-child {
        .el-transfer-panel__header {
          .el-checkbox {
            .el-checkbox__label::after {
              content: "*";
              color: $danger;
            }
          }
        }
      }
    }
  }
  .search-form {
    width: $all;
    padding: $margin $margin 0 $margin;
    @include box-sizing();
    @include layout(4);
    .search-form-btn {
      .el-form-item__content {
        text-align: right
      }
    }
    .el-button--default {
      display: none;
    }
  }
}
</style>
