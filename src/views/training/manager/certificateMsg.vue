<template>
  <div class='certificateMsg-bar' v-bar>
    <div class="certificateMsg-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button data-id="submit-btn" type="primary" size="mini" @click='handleSave'>
          {{ $t('vicenter.common.submit') }}
        </el-button>
        <el-button data-id="cancel-btn" type="white" size="mini" @click='goBack'>{{ $t('vicenter.common.cancel') }}
        </el-button>
      </div>
      <!-- 表格内容 -->
      <div class="info-container">
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.basicTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <div>
              <ComForm :fromClass="firstFormClass" ref="addForm" :searchIpt="addInputItem" :searchFunc="{}"
                      :formRule='formRule' class="certificate-form">
                <template v-slot:soltTable>
                  <ComTable class="soltTable" ref="trainTable" @listenToSelectDataEvent='selectRow' :tableData="tableData"
                            :tableGroup="trainTableGroup" key="1" v-if="formRule.model.credType === 0"></ComTable>
                  <ComTable class="soltTable" ref="examTable" @listenToSelectDataEvent='selectRow' :tableData="tableData"
                            :tableGroup="examTableGroup" key="2" v-if="formRule.model.credType === 1"></ComTable>
                </template>
                <!-- <template v-slot:soltDatetime>
                  <div class="soltDatetime" @click="preview">
                    {{ $t('vicenter.training.common.clickPreviewCertificate') }}
                  </div>
                </template> -->
              </ComForm>
              <div class="soltDatetime" @click="preview">
                {{ $t('vicenter.training.common.clickPreviewCertificate') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog :modalData="modalData">
        <div class="certificatePreview-img" data-id="certificatePreview-div">
          <img :src="imgUrl" alt="">
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import viProbe from '@/lib/viprobe/viProbeForTra.js'
import ajax from '@/api/training/manager.js'
import ajaxIndex from '@/api/training/index.js'
export default {
  name: 'demo',
  data () {
    return {
      modalData: {
        flag: false,
        title: this.$t('vicenter.training.common.certificatePreview')
      },
      menuKey: 1,
      imgUrl: '',
      titleBread: {}, // 面包屑
      panelTitle: {}, // 标题栏
      firstFormClass: {
        form: 'search-form',
        formItem: 'search-form-item',
        label: 'search-form-label',
        iptClass: 'search-form-input',
        buttonClass: 'search-form-btn'
      },
      addInputItem: [ // 基础表单
        {
          type: 'radio',
          clearable: true,
          models: 0,
          change: this.changeCredType,
          option: [
            {
              label: this.$t('vicenter.training.common.certificateTypeList.0'),
              name: 'certificate',
              value: 0
            },
            {
              label: this.$t('vicenter.training.common.certificateTypeList.1'),
              name: 'certificate',
              value: 1
            }
          ],
          getLabel: this.$t('vicenter.training.common.certificateType'),
          ruleProp: 'credType'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          getLabel: this.$t('vicenter.training.common.chooseTraining'),
          placeHolder: this.$t('vicenter.training.common.checkChooseTraining'),
          change: () => {
            this.changeDeviceType('addForm', 'pId')
            this.$refs.trainTable && this.$refs.trainTable.$refs[this.tableData.refName] && this.$refs.trainTable.$refs[this.tableData.refName].clearSelection()
            this.$refs.examTable && this.$refs.examTable.$refs[this.tableData.refName] && this.$refs.examTable.$refs[this.tableData.refName].clearSelection()
          },
          isSolt: true,
          soltName: 'soltTable',
          ruleProp: 'pId'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          getLabel: this.$t('vicenter.training.common.trainingName'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName'),
          ruleProp: 'credLevelDesc'
        },
        {
          type: 'date',
          models: Date.now(),
          valueFormat: 'timestamp',
          format: 'yyyy-MM-dd',
          getLabel: this.$t('vicenter.training.common.dateOfCompletion'),
          ruleProp: 'credFinishTime'
        },
        {
          type: 'date',
          models: Date.now(),
          valueFormat: 'timestamp',
          format: 'yyyy-MM-dd',
          isSolt: true,
          soltName: 'soltDatetime',
          getLabel: this.$t('vicenter.training.common.dateOfIssue'),
          ruleProp: 'credTime'
        }
      ],
      formRule: { // 查询表单规则
        model: {
          credType: 0,
          pId: '',
          credLevelDesc: '',
          credFinishTime: '',
          credTime: ''
        },
        refName: 'queryForm',
        rule: {
          credType: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.scopeOfApplication'),
              trigger: 'change'
            }
          ],
          pId: [
            {required: true, message: this.$t('vicenter.training.common.checkChooseTraining'), trigger: 'change'}
          ],
          credLevelDesc: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName'),
              trigger: 'change'
            }
          ],
          credFinishTime: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.dateOfCompletion'),
              trigger: 'change'
            }
          ],
          credTime: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.dateOfIssue'),
              trigger: 'change'
            }
          ]
        }
      },
      trainTableGroup: [ // 表格数据列
        {
          type: 'selection',
          width: '40px'
        },
        {
          type: 'text',
          model: 'pcUserName'
        },
        {
          type: 'text',
          model: 'pcUserNo'
        },
        {
          type: 'text',
          model: 'traStartTime'
        },
        {
          type: 'text',
          model: 'traEndTime'
        },
        {
          type: 'text',
          model: 'traTime'
        },
        {
          type: 'progress',
          strokeWidth: 15,
          inside: false,
          model: 'traPercent'
        }
      ],
      examTableGroup: [ // 表格数据列
        {
          type: 'selection',
          width: '40px'
        },
        {
          type: 'text',
          model: 'pcName'
        },
        {
          type: 'text',
          model: 'account'
        },
        {
          type: 'text',
          model: 'userExamStartTime'
        },
        {
          type: 'text',
          model: 'userExamEndTime'
        },
        {
          type: 'text',
          model: 'userExamTime'
        },
        {
          type: 'text',
          model: 'userExamTrueCount'
        },
        {
          type: 'text',
          model: 'correctRate'
        },
        {
          type: 'text',
          model: 'userExamStatus'
        }
      ],
      tableData: { // 表格数据
        data: [],
        refName: 'trainTable',
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 0,
          Allpage: 0,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        sortMethod: this.getSort
      },
      selRowId: [],
      isList: true,
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {},
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  watch: {
    'formRule.model.pId': function (newVal, oldVal) {
      // console.log(newVal)
      console.log('b')
      if (newVal) {
        let params = {}
        if (this.formRule.model.credType === 0) {
          params.traId = this.formRule.model.pId
        } else {
          params.examId = this.formRule.model.pId
        }
        // console.log(this.addInputItem[1].option)
        // 培训考试名称初始化
        this.addInputItem[1].option.map(item => {
          if (item.value === this.formRule.model.pId) {
            this.addInputItem[2].models = item.label
            if (this.formRule.model.credType === 1) {
              this.addInputItem[this.addInputItem.length - 2].models = item.key
            }
          }
        })
        this.preAddCertificateByTable(params)
      } else {
        this.tableData.data = []
      }
    }
  },
  methods: {
    setI18n () {
      // console.log(this.$route)
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Training/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      }
      // 查询条件和列表title
      this.panelTitle = {
        basicTitle: {
          title: this.$t('vicenter.training.common.certificateInformation')
        }
      }
      // 培训结业查询列
      this.trainTableGroup.forEach((e) => {
        if (e.model === 'pcUserName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.model === 'pcUserNo') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.model === 'traStartTime') {
          e.label = this.$t('vicenter.training.common.startTrainingTime')
        } else if (e.model === 'traEndTime') {
          e.label = this.$t('vicenter.training.common.lastTrainingTime')
        } else if (e.model === 'traTime') {
          e.label = this.$t('vicenter.training.common.trainingTimes')
        } else if (e.model === 'traPercent') {
          e.label = this.$t('vicenter.training.common.trainingProgress')
        }
      })
      // 考试合格查询列
      this.examTableGroup.forEach((e) => {
        if (e.model === 'pcName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.model === 'account') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.model === 'userExamStartTime') {
          e.label = this.$t('vicenter.training.common.examStartTime')
        } else if (e.model === 'userExamEndTime') {
          e.label = this.$t('vicenter.training.common.examEndTime')
        } else if (e.model === 'userExamTime') {
          e.label = this.$t('vicenter.training.common.examinationTimes')
        } else if (e.model === 'userExamTrueCount') {
          e.label = this.$t('vicenter.training.common.answerNumberOfQuestions')
        } else if (e.model === 'correctRate') {
          e.label = this.$t('vicenter.training.common.correctRate')
        } else if (e.model === 'userExamStatus') {
          e.label = this.$t('vicenter.training.common.examinationStatus')
        }
      })
      this.preAddCertificateByList(0)
    },
    // 选择培训、选择考试列表
    preAddCertificateByList (credType) {
      // console.log(this.formRule.model.credType)
      let params = {}
      params.type = credType
      this.openLoading()
      ajax.preAddCertificateByList(params).then((res) => {
        // console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          let data = res.data.result.traInfo ? res.data.result.traInfo : res.data.result.examInfo
          if (data.length > 0) {
            let option = data.map(item => {
              let obj = {}
              obj.value = item.traId ? item.traId : item.examId
              obj.label = item.traName ? item.traName : item.examName
              obj.key = item.examEndTime ? item.examEndTime : ''
              return obj
            })
            this.addInputItem[1].option = option
          }
        }
      })
    },
    // 待发证学员
    preAddCertificateByTable (params) {
      this.openLoading()
      ajax.preAddCertificateByTable(params).then((res) => {
        console.log(res.data.result.traInfo ? res.data.result.traInfo : res.data.result.userExamInfo)
        this.closeLoading()
        if (res.data.flag) {
          if (res.data.result.traInfo) {
            res.data.result.traInfo.forEach(item => {
              item.traStartTime = this.$options.filters['formatDate'](item.traStartTime, this.$t('vicenter.common.formatDate'))
              item.traEndTime = this.$options.filters['formatDate'](item.traEndTime, this.$t('vicenter.common.formatDate'))
            })
          }
          if (res.data.result.userExamInfo) {
            res.data.result.userExamInfo.forEach(item => {
              item.userExamStartTime = this.$options.filters['formatDate'](item.userExamStartTime, this.$t('vicenter.common.formatDate'))
              item.userExamEndTime = this.$options.filters['formatDate'](item.userExamEndTime, this.$t('vicenter.common.formatDate'))
              item.userExamStatus = this.$t(`vicenter.training.common.examinationStatusList2.${item.userExamStatus}`)
            })
          }
          this.tableData.data = res.data.result.traInfo ? res.data.result.traInfo : res.data.result.userExamInfo
        }
      })
    },
    // 提交
    handleSave () {
      this.$refs['addForm'].$refs[this.formRule.refName].validate((valid) => {
        if (valid) {
          if (this.selRowId.length === 0) {
            this.$NotifPrompt(this.$t('vicenter.training.common.addStudent'))
            return
          }
          let params = {}
          this.selRowId.forEach(item => {
            Object.assign(item, this.formRule.model)
          })
          params.jsonStr = JSON.stringify(this.selRowId)
          params.createUserId = sessionStorage.getItem('userId')
          params.language = JSON.parse(sessionStorage.getItem('currentLang')) ? JSON.parse(sessionStorage.getItem('currentLang')).lang : window.config.conmmonLang
          this.addCertificate(params)
        }
      })
    },
    // 新增证书
    addCertificate (params) {
      this.openLoading()
      ajax.addCertificate(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
          this.$router.push({
            path: '/Training/manager/certificateList'
          })
        }
      })
    },
    // 点击预览证书
    preview () {
      if (this.tableData.data.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.training.common.notCertificate'))
        return
      }
      let params = {}
      params.cretName = this.formRule.model.credLevelDesc
      params.flag = 1
      params.type = this.formRule.model.credType === 1 ? 1 : 2
      params.userName = this.tableData.data[0].pcUserName ? this.tableData.data[0].pcUserName : this.tableData.data[0].pcName
      params.language = JSON.parse(sessionStorage.getItem('currentLang')) ? JSON.parse(sessionStorage.getItem('currentLang')).lang : window.config.conmmonLang
      this.openLoading()
      console.log(this.formRule.model)
      params.completeDate = this.formRule.model.credTime
      params.certificationDate = this.formRule.model.credFinishTime
      ajaxIndex.getCertImg(params).then((res) => {
        console.log(res)
        this.closeLoading()
        if (res.data.flag) {
          this.imgUrl = res.data.result
          this.modalData.flag = true
        }
      })
    },
    // 列表选中行
    selectRow (data) {
      // console.log(data)
      let idArr = data.map(el => {
        let obj = {}
        obj.pcUserId = el.pcUserId
        obj.account = el.pcUserNo
        return obj
      })
      // console.log(idArr)
      this.$data.selRowId = idArr
    },
    // 证书类型切换重置表单
    changeCredType () {
      // console.log(this.formRule.model.credType)
      this.addInputItem[0].KeepDefault = true
      if (this.formRule.model.credType === 0) {
        this.addInputItem[0].defaultValue = 0
      } else {
        this.addInputItem[0].defaultValue = 1
      }
      this.$refs['addForm'].reset()
      this.tableData.data = []
      this.changeCertificateMsg(this.addInputItem[0].defaultValue)
    },
    // 重置证书新增页面
    changeCertificateMsg (credType) {
      // console.log(credType)
      if (credType === 1) {
        this.addInputItem[1].getLabel = this.$t('vicenter.training.common.chooseExam')
        this.addInputItem[1].placeHolder = this.$t('vicenter.training.common.checkChooseExam')
        this.formRule.rule.pId = [{
          required: true,
          message: this.$t('vicenter.training.common.checkChooseExam'),
          trigger: 'change'
        }]
        this.formRule.rule.credLevelDesc = [{
          required: true,
          message: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testName'),
          trigger: 'change'
        }]
        this.addInputItem[2].getLabel = this.$t('vicenter.training.common.testName')
        this.addInputItem[2].placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.testName')
        this.addInputItem[this.addInputItem.length - 1].models = Date.now()
      } else {
        this.addInputItem[1].getLabel = this.$t('vicenter.training.common.chooseTraining')
        this.addInputItem[1].placeHolder = this.$t('vicenter.training.common.checkChooseTraining')
        this.formRule.rule.pId = [{
          required: true,
          message: this.$t('vicenter.training.common.checkChooseTraining'),
          trigger: 'change'
        }]
        this.addInputItem[2].getLabel = this.$t('vicenter.training.common.trainingName')
        this.addInputItem[2].placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName')
        this.addInputItem[this.addInputItem.length - 1].models = Date.now()
        this.addInputItem[this.addInputItem.length - 2].models = Date.now()
      }
      this.preAddCertificateByList(credType)
    },
    // 选择器校验
    changeDeviceType (ref, param) {
      this.$changeSelectValidateField(ref, this, param)
    },
    // 取消
    goBack () {
      this.$router.push({path: '/Training/manager/certificateList'})
    },
    toUpload (scope) {},
    toDelete (id) {
      let params = {
        id: id
      }
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteSuccess'))
      })
    },
    handleSizeChange (val) {
      this.formRule.model.size = val
      this.formRule.model.page = 0
      this.$set(this.tableData.page, 'pagesize', val)
      this.SetpageQuery(0)
    },
    handleCurrentChange (val) {
      this.formRule.model.page = val - 1
      this.SetpageQuery(this.formRule.model.page)
    },
    SetpageQuery (page) { // 查询设置页
      var times = {}
      if (this.formRule.model.createTime === null || this.formRule.model.createTime.length === 0) {
        times = {}
      } else {
        times = {
          createTimeFrom: this.formRule.model.createTime[0],
          createTimeTo: this.formRule.model.createTime[1]
        }
      }
      var value = {
        imageName: this.formRule.model.imageName,
        imageDesc: this.formRule.model.imageDesc,
        scanSerialNumber: this.formRule.model.scanSerialNumber,
        seizedLocation: this.formRule.model.seizedLocation,
        seizedType: this.formRule.model.seizedType,
        imageType: this.formRule.model.imageType,
        imageCollectMode: this.formRule.model.imageCollectMode,
        hsCodes: this.formRule.model.hsCodes,
        imageStatus: this.formRule.model.imageStatus,
        page: page,
        size: this.tableData.page.pagesize
      }
      var val = Object.assign({}, value, times)
      this.getList(val)
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
    getSort () {},
    treeClick (data) {
    },
    // 打开loading
    openLoading () {
      this.$initLoading()
    },
    // 关闭loading
    closeLoading () {
      this.$initLoading().close()
    }
  },
  components: {bread, ComForm, panelTitle, ComTable, Dialog}
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.certificateMsg-bar {
  @extend .extend-bar;

  .certificateMsg-M {
    padding: $margin;
    @include box-sizing;

    .operation-group {
      @include flex(row, flex-end, center);
      margin-bottom: $dis10;
    }

    .info-container {
      height: calc(100% - 85px);
      .panel {
        width: $all;
        height: $all;
        @extend .extend-panel;
        @include flex(column, flex-start, flex-start);
        .form-bar {
          width: $all;
          height: $all;
        }
        .certificate-form {
          width: $all;
          @include flex(row, flex-start, flex-start);
          flex-wrap: wrap;
          padding: 20px;
          @include box-sizing();
          .search-form-btn {
            display: none;
          }
          .search-form-item {
            width: $all;
            height: auto;
            text-align: left;
            position: relative;
            margin-bottom: 0;
            .soltTable {
              width: $all;
              padding: 0;
              margin-top: $margin * 1.5;
            }
            .el-form-item__error {
              position: absolute;
              top: 70px
            }
          }
          .search-form-item:nth-child(2) {
            .search-form-input {
              width: 30.33%!important;
            }
          }
          .search-form-item:nth-child(3),
          .search-form-item:nth-child(4),
          .search-form-item:nth-child(5) {
            width: 30.33%!important;
            margin-right: 3%!important;
          }
        }
        .soltDatetime {
          width: $all;
          padding: 0 0 20px 20px;
          text-align: left;
          color: #0066ff;
          cursor: pointer;
        }
      }
    }
    .certificatePreview-img {
      @include flex(row, center, center);

      img {
        width: 30%;
      }
    }
  }
}
</style>
