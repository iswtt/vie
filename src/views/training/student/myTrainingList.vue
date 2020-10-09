<template>
  <div class='myTrainingList-bar' v-bar>
    <div class="myTrainingList-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm ref="searchFormRef"  :searchIpt="searchIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button data-id="publicClass-btn" type="primary" size="mini" @click='handleCreate'>{{$t('vicenter.training.common.publicClass')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="myTrainingListTable" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
      <Dialog :modalData="detailModalData" class="formDialog">
        <ComForm ref="detailFormRef"  :searchIpt="detailIpt" :searchFunc="SearchFunc" :formRule='detailFormRule'></ComForm>
        <ComTable ref="coursewareTable" :tableData="detailTableData" :tableGroup="detailTableGroup" ></ComTable>
      </Dialog>
      <el-dialog
        class="pdf-view"
        :title="$t('vicenter.training.common.eLearning')"
        :visible.sync="dialogStudyFlag"
        @close="viewClose"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :destroy-on-close='true'>
        <iframe v-if="!videoOrPDF && dialogStudyFlag" :src="studyBaseUrl + studyPDF + '#toolbar=0'" frameborder="0"></iframe>
        <Video v-if="videoOrPDF && dialogStudyFlag" :src="studyBaseUrl + videoSrc" :playerOptions="playerOptions" :playerFunc="playerFunc"></Video>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import upload from '@/components/uploadPreview'
import Dialog from '@/components/dialog'
import Video from '@/components/video'

import req from '@/api/training/teacher'
import reqStu from '@/api/training/student'
export default {
  name: 'demo',
  data () {
    return {
      detailModalData: {
        flag: false,
        resetModal: this.query,
        title: this.$t('vicenter.training.common.msg')
      },
      dialogStudyFlag: false,
      studyBaseUrl: window.config.trainingUI.fileUrl,
      baseUrl: window.config.trainingUI.baseUrl,
      videoSrc: '', // 预览视频路径
      videoOrPDF: false, // true: video false: pdf
      playerOptions: {
        refName: 'video',
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{src: ''}],
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          // timeDivider: true,
          // durationDisplay: true,
          // remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      playerFunc: {
        ready: this.videoReady,
        play: this.videoPlay,
        pause: this.videoPause,
        ended: this.videoEnded,
        loadeddata: this.videoLoadeddata,
        waiting: this.videoWaiting,
        timeupdate: this.videoTimeupdate,
        canplay: this.videoCanplay,
        canplaythrough: this.videoCanplaythrough,
        statechanged: this.videoStatechanged
      },
      studyPDF: '', // 预览pdf路径
      studyTraId: '', // 培训TraId
      traCourCount: '', // 培训数量
      studyCourId: '', // 课件id
      studyIsEnd: true, // 有没有结束学习
      studyStarTime: '', // 有没有结束学习
      titleBread: {},
      panelTitle: {},
      searchIpt: [ // 查询表单
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'traClass'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'traCourType'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          maxlength: 50,
          ruleProp: 'traName'
        },
        {
          type: 'textarea',
          models: '',
          ruleProp: 'trainingDesc',
          hiden: true
        }
      ],
      formRule: { // 查询表单规则
        model: {
          traClass: '',
          traCourType: '',
          traName: ''
        },
        refName: 'searchFormRef',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        sortMethod: this.getSort
      },
      tableGroup: [ // 表格数据列
        {
          type: 'index',
          model: 'serialNumber'
        },
        {
          type: 'text',
          model: 'className'
        },
        {
          type: 'text',
          model: 'typeName'
        },
        {
          type: 'text',
          model: 'traName'
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
          width: '200px',
          model: 'traPercent'
        },
        {
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      operation: [
        {
          func: this.getDetail, // 学习
          title: this.$t('vicenter.training.common.learn'),
          label: `<span class='iconfont editTable'>&#xe6a2;</span>`,
          show: true
        }
      ],
      detailIpt: [ // 查询表单
        {
          getLabel: this.$t('vicenter.training.common.trainingClassification'),
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          disabled: true,
          ruleProp: 'traClass'
        },
        {
          getLabel: this.$t('vicenter.training.common.trainingType'),
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          disabled: true,
          ruleProp: 'traCourType'
        },
        {
          getLabel: this.$t('vicenter.training.common.trainingName'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          disabled: true,
          ruleProp: 'traName'
        },
        {
          getLabel: this.$t('vicenter.training.common.trainingDesc'),
          type: 'textarea',
          models: '',
          minSize: 1,
          disabled: true,
          ruleProp: 'traDesc'
        }
      ],
      detailFormRule: { // 查询表单规则
        model: {
          traClass: '',
          traCourType: '',
          traName: '',
          traDesc: ''
        },
        refName: 'detailFormRef',
        rule: {}
      },
      detailTableData: { // 表格数据
        data: [],
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
      detailTableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.training.common.serialNumber'),
          type: 'index',
          model: 'serialNumber'
        },
        {
          label: this.$t('vicenter.training.common.courseware'),
          type: 'text',
          model: 'courName'
        },
        {
          label: this.$t('vicenter.training.common.trainingStatus'),
          type: 'text',
          model: 'courStatusStr'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      operationD: [
        {
          func: this.studyOnline, // 在线学习
          title: this.$t('vicenter.training.common.eLearning'),
          label: `<span class='iconfont editTable'>&#xe6a2;</span>`,
          show: true
        },
        {
          func: this.getDownload, // 下载
          title: this.$t('vicenter.training.common.download'),
          label: `<span class='iconfont editTable'>&#xe69e;</span>`,
          show: true
        }
      ],
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
  methods: {
    setI18n () {
      this.getOptions()
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            // path: '/Training/student/index' // 跳转路径
            path: '/Training/index' // 跳转路径
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
      // 查询和重置按钮
      this.SearchFunc.queryText = this.$t('vicenter.common.query')
      this.SearchFunc.resetText = this.$t('vicenter.common.reset')
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'traClass') {
          e.getLabel = this.$t('vicenter.training.common.trainingClassification')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingClassification')
        } else if (e.ruleProp === 'traCourType') {
          e.getLabel = this.$t('vicenter.training.common.trainingType')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingType')
        } else if (e.ruleProp === 'traName') {
          e.getLabel = this.$t('vicenter.training.common.trainingName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'serialNumber') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'className') {
          e.label = this.$t('vicenter.training.common.trainingClassification')
        } else if (e.model === 'typeName') {
          e.label = this.$t('vicenter.training.common.trainingType')
        } else if (e.model === 'traName') {
          e.label = this.$t('vicenter.training.common.trainingName')
        } else if (e.model === 'traStartTime') {
          e.label = this.$t('vicenter.training.common.startTrainingTime')
        } else if (e.model === 'traEndTime') {
          e.label = this.$t('vicenter.training.common.lastTrainingTime')
        } else if (e.model === 'traTime') {
          e.label = this.$t('vicenter.training.common.trainingTimes')
        } else if (e.model === 'traPercent') {
          e.label = this.$t('vicenter.training.common.trainingProgress')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.query()
    },
    /**
     * 初始化下拉值
     */
    getOptions () {
      let loadCase = this.$initLoading()
      let reqArr = [req.getTraDictInfo({dictId: '100'}), req.getTraDictInfo({dictId: '200'})]
      Promise.all(reqArr)
        .then(res => {
          console.log(res)
          let _type = res[0].data.result.map(e => { return {value: e.dictId, label: this.$t(`vicenter.training.common.trainingTypeList.${e.dictId.toString()}`)} })
          let _classify = res[1].data.result.map(e => { return {value: e.dictId, label: this.$t(`vicenter.training.common.trainingClassificationList.${e.dictId.toString()}`)} })
          // 培训分类
          this.searchIpt[0].option = _classify
          this.detailIpt[0].option = _classify
          // 培训类型
          this.searchIpt[1].option = _type
          this.detailIpt[1].option = _type
          this.query()
          loadCase.close()
        })
        .catch(err => {
          loadCase.close()
          console.log(err)
        })
    },
    // 发布
    release () {},
    handleCreate () {
      this.$router.push({
        path: '/Training/student/myTrainingMsg'
      })
    },
    resetForm () {
      this.formRule.model = {
        traClass: '',
        traCourType: '',
        traName: ''
      }
      // this.query()
    },
    query () {
      let params = {}
      // this.formRule.model
      params = JSON.parse(JSON.stringify(this.formRule.model))
      this.getList(params)
    },
    getList (params) {
      reqStu.getTraPageInfoByStu({ ...params, page: this.tableData.page.CurrentPage, size: this.tableData.page.pagesize, userId: sessionStorage.getItem('userId') })
        .then(res => {
          console.log(res)
          let tableData = res.data.result
          if (tableData) {
            tableData.content.forEach(item => {
              item.traPercent = item.traPercent || 0
              item.className = this.$t(`vicenter.training.common.trainingClassificationList.${item.traClass.toString()}`)
              item.typeName = this.$t(`vicenter.training.common.trainingTypeList.${item.traCourType.toString()}`)
              item.traStartTime = item.traTime ? this.$options.filters['formatDate'](item.traStartTime, this.$t('vicenter.common.formatDate')) : '-'
              item.traEndTime = item.traTime ? this.$options.filters['formatDate'](item.traEndTime, this.$t('vicenter.common.formatDate')) : '-'
            })
            this.tableData.data = tableData.content
            if (this.tableData.data.length > 0) {
              this.tableData.isPage = true
            }
            this.tableData.page.Allpage = tableData.totalElements
            this.tableData.data.forEach(item => {
              item.operation = this.operation
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 学习弹窗
    getDetail (scope) {
      reqStu.getTraInfoByUser({traId: scope.row.traId, userId: sessionStorage.getItem('userId')})
        .then(res => {
          console.log(res)
          let info = res.data.result
          let tableData = info.mapList
          this.detailIpt.forEach(item => {
            item.models = info[item.ruleProp]
          })
          tableData.forEach(item => {
            let b = []
            if (!item.courIsView) {
              b = b.concat(this.operationD[0])
            }
            if (!item.courIsDown) {
              b = b.concat(this.operationD[1])
            }
            item.operation = b
            // item.courStatusStr = item.recordStatus ? '未学习' : '已学习'
            item.courStatusStr = this.$t(`vicenter.training.student.${item.recordStatus ? 'untrained' : 'trained'}`)
          })
          this.studyTraId = info.traId
          this.traCourCount = info.traCourCount
          this.detailTableData.data = tableData
          this.detailModalData.flag = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 在线学习
    studyOnline (scope) {
      console.log(scope)
      let info = scope.row
      // 更新状态
      reqStu.upTraPceByUser({
        actType: '30001',
        courId: info.courId,
        traId: this.studyTraId,
        tarUserRecordStatus: info.recordStatus,
        traCourCount: this.traCourCount,
        userId: sessionStorage.getItem('userId')
      })
        .then(res => {
          console.log(res)
          this.studyIsEnd = false // 用于判断是否结束学习
          this.studyStarTime = res.data.result // 本次学习的开始时间
          this.studyCourId = info.courId // 课件id
          this.studyPDF = info.pdfFilePath // 课件预览路径
          let _a = info.pdfFilePath.split('.')
          let _type = _a[_a.length - 1]
          if (_type.indexOf('pdf') > -1) {
            this.videoOrPDF = false
            this.studyPDF = info.pdfFilePath // 课件预览路径
          } else {
            this.videoOrPDF = true
            this.videoSrc = info.pdfFilePath
          }
          this.dialogStudyFlag = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 在线学习关闭
    viewClose (t) {
      console.log('close')
      reqStu.upTraPceByUser({
        actType: '30001',
        courId: this.studyCourId,
        traId: this.studyTraId,
        startTime: this.studyStarTime,
        tarUserRecordStatus: '0',
        traCourCount: this.traCourCount,
        userId: sessionStorage.getItem('userId')
      })
        .then(res => {
          console.log(res)
          this.studyIsEnd = true
          if (t) return false
          // 更新培训详情数据
          this.getDetail({row: {traId: this.studyTraId}})
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 下载
    getDownload (scope) {
      console.log(scope)
      let info = scope.row
      // 更新状态
      reqStu.upTraPceByUser({
        actType: '30002',
        courId: info.courId,
        traId: this.studyTraId,
        tarUserRecordStatus: info.recordStatus,
        traCourCount: this.traCourCount,
        userId: sessionStorage.getItem('userId')
      })
        .then(res => {
          const filePath = info.courFilePath
          window.open(`${this.baseUrl}/api/downFileWithName?fileName=${info.courName}&fileUrl=${filePath.substring(0, filePath.indexOf('?'))}`)
          // 更新培训详情数据
          this.getDetail({row: {traId: this.studyTraId}})
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSizeChange (val) {
      this.tableData.page.pagesize = val
      this.query()
    },
    handleCurrentChange (val) {
      this.tableData.page.CurrentPage = val - 1
      this.query()
    },
    getSort () {},
    // video ready
    videoReady () {},
    videoPlay () {},
    videoPause () {},
    videoEnded () {},
    videoLoadeddata () {},
    videoWaiting () {},
    videoTimeupdate () {},
    videoCanplay () {},
    videoCanplaythrough () {},
    videoStatechanged () {}
  },
  beforeDestroy () {
    if (!this.studyIsEnd) {
      this.viewClose(1)
    }
  },
  components: { bread, ComForm, panelTitle, ComTable, upload, Dialog, Video }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.myTrainingList-bar {
  @extend .extend-bar;
  .myTrainingList-M {
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
          @include layout(3);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
        .editTable {
          margin: 0 5px;
        }
      }
    }
    .formDialog {
      .search-form {
        @include layout(2);
      }
      .search-form-btn .el-form-item__content {
        display: none;
      }
      .tableComp{
        padding: 0
      }
    }
  }
}
  .pdf-view .el-dialog{
    width: 100% !important;
    margin: 0 !important;
    height: 100vh;
    .el-dialog__body{
      height: calc(100% - 54px);
      box-sizing: border-box;
      iframe{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
