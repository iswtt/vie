<template>
  <div class='trainingMsg-bar' v-bar>
    <div class="trainingMsg-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button data-id="submit-btn" type="primary" v-if="operateType !== 'detail'" size="mini" @click='handleSave'>
          {{$t('vicenter.common.submit')}}
        </el-button>
        <el-button data-id="back-btn" type="white" size="mini" @click='goBack'>{{$t('vicenter.common.back')}}
        </el-button>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <!--基础信息-->
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.basicTitle"></panelTitle>
          <ComForm ref="basicInformation" id="basicInformation" :searchIpt="addIpt" :searchFunc="{}" :formRule='formRule'></ComForm>
        </div>
        <!--课件信息-->
        <div class="panel">
          <panelTitle :panelTitleInit="panelTitle.coursewareTitle">
            <el-button data-id="add-btn" type="primary" size="mini" v-if="operateType !== 'detail'"
                       @click='handleCreate'>{{$t('vicenter.training.common.add')}}
            </el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="coursewareTable" :tableData="tableData" :tableGroup="tableGroup"></ComTable>
          </div>
          <!--          :action="baseUrl + '/api/uploadFormData'"-->
          <el-upload
            class="upload-demo"
            :action="baseUrl + actionUrl"
            :with-credentials='true'
            :headers="uploadHeader"
            :data="defaultData"
            :on-error="handleError"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            :multiple="false">
            <el-button ref="uploadFile" size="small" type="primary"></el-button>
          </el-upload>
        </div>
        <!--学员信息-->
        <div class="panel" v-show="isStudentShow && operateType !== 'detail'">
          <panelTitle :panelTitleInit="panelTitle.studentTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <div class="transfer-box" v-loading="isSavingList" element-loading-background="rgba(255, 255, 255, 0.8)">
              <el-transfer data-id="studentListTransfer" @change="transferChange" v-model="listTransfer.transfer.model"
                           :data="listTransfer.transfer.data" :titles="listTransfer.transfer.title"
                           :button-texts="listTransfer.transfer.button" target-order="push"></el-transfer>
            </div>
          </div>
        </div>
        <div class="panel" v-show="operateType === 'detail'">
          <panelTitle :panelTitleInit="panelTitle.studentTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="studentsTable" :tableData="detailTableData" :tableGroup="detailTableGroup"></ComTable>
          </div>
        </div>
        <el-dialog
          class="pdf-view"
          :title="$t('vicenter.training.common.eLearning')"
          :visible.sync="dialogStudyFlag"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          :destroy-on-close='true'>
          <iframe v-if="!videoOrPDF && dialogStudyFlag" :src="studyBaseUrl + studyPDF + '#toolbar=0'" frameborder="0"></iframe>
          <Video v-if="videoOrPDF && dialogStudyFlag" :src="studyBaseUrl + videoSrc" :playerOptions="playerOptions"
                 :playerFunc="playerFunc"></Video>
          <!--          <video :src="studyBaseUrl + videoSrc" controls="controls" autoplay></video>-->
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import Video from '@/components/video'

import req from '@/api/training/teacher'

export default {
  name: 'demo',
  data () {
    return {
      traId: '', // 培训id
      traType: '', // 培训类型
      studyPDF: '', // 预览pdf路径
      videoSrc: '', // 预览视频路径
      videoOrPDF: false, // true: video false: pdf
      uploadHeader: {
        'X-CSRF-TOKEN': localStorage.getItem('Xcsrftoken'),
        'X-APP-UACCOUNT': sessionStorage.getItem('account')
      },
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
        notSupportedMessage: this.$t('vicenter.common.videoDisabled'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
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
      studyBaseUrl: window.config.trainingUI.fileUrl,
      dialogStudyFlag: false,
      baseUrl: window.config.trainingUI.baseUrl,
      actionUrl: '/api/uploadFormDataByCour',
      titleBread: {}, // 面包屑
      panelTitle: {}, // 标题栏
      addIpt: [ // 基础表单
        {
          type: 'select',
          clearable: true,
          models: '',
          subKey: 'traClass',
          option: [],
          change: () => {
            this.changeDeviceType('basicInformation', 'trainingClassification')
          },
          disabled: false,
          getLabel: this.$t('vicenter.training.common.trainingClassification'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingClassification'),
          ruleProp: 'trainingClassification'
        },
        {
          type: 'select',
          clearable: true,
          models: '',
          subKey: 'traCourType',
          option: [],
          change: () => {
            this.changeDeviceType('basicInformation', 'trainingType')
          },
          disabled: false,
          getLabel: this.$t('vicenter.training.common.trainingType'),
          placeHolder: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingType'),
          ruleProp: 'trainingType'
        },
        {
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          models: '',
          subKey: 'traName',
          disabled: false,
          maxlength: 50,
          getLabel: this.$t('vicenter.training.common.trainingName'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName'),
          ruleProp: 'trainingName'
        },
        {
          type: 'textarea',
          models: '',
          subKey: 'traDesc',
          disabled: false,
          maxlength: 100,
          getLabel: this.$t('vicenter.training.common.trainingDesc'),
          placeHolder: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingDesc'),
          ruleProp: 'trainingDesc'
        }
      ],
      uploadIndex: null,
      operationA: [
        {
          func: this.toUpload, // 修改
          label: `<span class='iconfont editTable'>&#xe6bb;</span>`,
          title: this.$t('vicenter.training.common.upload'),
          show: true
        },
        {
          func: this.handleDeleteWithoutFile, // 删除
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          title: this.$t('vicenter.common.delete'),
          show: true
        }
      ],
      operationB: [
        {
          func: this.handleDelete, // 删除
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          title: this.$t('vicenter.common.delete'),
          show: true
        }
      ],
      operationC: [
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
      formRule: { // 查询表单规则
        model: {
          trainingClassification: '',
          trainingType: '',
          trainingName: '',
          trainingDesc: ''
        },
        refName: 'queryForm',
        rule: {
          trainingClassification: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingClassification'),
              trigger: 'change'
            }
          ],
          trainingType: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingType'),
              trigger: 'change'
            }
          ],
          trainingName: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName'),
              trigger: 'change'
            }
          ],
          trainingDesc: [
            {
              required: true,
              message: this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingDesc'),
              trigger: 'change'
            }
          ]
        }
      },
      tableData: { // 表格数据
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
      tableGroup: [ // 表格数据列
        {
          label: '',
          type: 'index',
          model: 'index'
        },
        {
          label: '',
          type: 'text',
          model: 'courName'
        },
        {
          label: '',
          type: 'checkbox',
          checkList: [this.$t('vicenter.training.common.eLearning'), this.$t('vicenter.training.common.download')],
          model: 'coursewarePermissions'
        },
        {
          label: '',
          type: 'operation',
          model: 'operation',
          fixed: 'right'
        }
      ],
      detailTableData: {
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
          label: this.$t('vicenter.training.common.name'),
          type: 'text',
          model: 'pcTyueName'
        },
        {
          label: this.$t('vicenter.training.common.account'),
          type: 'text',
          model: 'pcUserName'
        },
        {
          label: this.$t('vicenter.training.common.startTrainingTime'),
          type: 'text',
          model: 'traStartTime'
        },
        {
          label: this.$t('vicenter.training.common.lastTrainingTime'),
          type: 'text',
          model: 'traEndTime'
        },
        {
          label: this.$t('vicenter.training.common.trainingTimes'),
          type: 'text',
          model: 'traTime'
        },
        {
          label: this.$t('vicenter.training.common.trainingProgress'),
          type: 'progress',
          strokeWidth: 15,
          inside: false,
          width: '200px',
          model: 'traPercent'
        }
      ],
      selRowId: '',
      isList: true,
      selectObj: {
        hsCodes: '',
        siteId: '',
        deviceId: ''
      },
      isSavingList: false,
      isStudentShow: false, // 是否展示学员信息
      listTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: []
        }
      },
      transferUserAll: [], // 所有的学员
      oldUserList: [], // 之前选中的学员
      seizedGoodsData: [
        {
          ruleProp: 'contrabandType',
          option: []
        },
        {
          ruleProp: 'contrabandLocation',
          option: []
        }
      ],
      canSubmit: true, // 避免多次提交
      defaultData: {pathName: 'cour_file', type: ''}, // 默认的文件参数
      uploadClose: null, // 上传文件loading
      selfClass: '', // 私有课Id
      tempIndex: 0, // 解决查询条件和列表项重复的问题
      operateType: 'add', // 新增 修改 详情
      operateId: '' // 新增 修改 详情
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
    this.traId = sessionStorage.getItem('traId')
    this.traType = sessionStorage.getItem('traType')
  },
  mounted () {
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    // 初始化 值
    setI18n () {
      this.getOptions()
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            // path: '/Training/teacher/index' // 跳转路径
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
          title: this.$t('vicenter.training.common.basicInformation')
        },
        coursewareTitle: {
          title: this.$t('vicenter.training.common.coursewareInformation')
        },
        studentTitle: {
          title: this.$t('vicenter.training.common.studentInformation')
        }
      }
      // 自定义列表弹框
      this.listTransfer.title = this.$t('vicenter.common.definedList')
      this.listTransfer.transfer.title = [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')]
      this.listTransfer.transfer.button = [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'index') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'courName') {
          e.label = this.$t('vicenter.training.common.courseware')
        } else if (e.model === 'coursewarePermissions') {
          e.label = this.$t('vicenter.training.common.coursewarePermissions')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
    },
    /**
       * 初始化下拉值和学员穿梭框
       */
    getOptions () {
      let loadCase = this.$initLoading()
      let reqArr = [req.getTraDictInfo({dictId: '100'}), req.getTraDictInfo({dictId: '200'}), req.getTraUserInfo()]
      Promise.all(reqArr)
        .then(res => {
          let _type = res[0].data.result
          let _classify = res[1].data.result
          let _user = res[2].data.result || []
          // 穿梭框数据
          this.listTransfer.transfer.data = _user.map(e => {
            return {key: e.pcUserId, label: e.pcUserName, disabled: false}
          })
          this.transferUserAll = _user
          this.selfClass = _classify[1].dictId // 私有课Id
          // 培训分类
          this.addIpt[0].option = _classify.map(e => {
            return {
              value: e.dictId,
              label: this.$t(`vicenter.training.common.trainingClassificationList.${e.dictId.toString()}`)
            }
          })
          // 培训类型
          this.addIpt[1].option = _type.map(e => {
            return {
              value: e.dictId,
              label: this.$t(`vicenter.training.common.trainingTypeList.${e.dictId.toString()}`)
            }
          })
          if (this.traId) {
            this.operateType = this.traType
            this.operateId = this.traId
            this.getInfo(this.traId)
          }
          loadCase.close()
        })
        .catch(err => {
          loadCase.close()
          console.log(err)
        })
    },
    // 查询回显数据
    getInfo (traId) {
      req.getTraInfo({traId})
        .then(res => {
          console.log(res)
          let info = res.data.result
          let courList = [] // 课件
          let chooseUsers = []
          let disabledUsers = []
          this.addIpt.forEach(item => {
            item.models = info[item.subKey]
          })
          info.courList.forEach(item => {
            let _cour = {
              courName: item.courName,
              coursewarePermissions: [!item.courIsDown ? this.$t('vicenter.training.common.download') : '', !item.courIsView ? this.$t('vicenter.training.common.eLearning') : ''],
              courFilePath: item.courFilePath,
              pdfFilePath: item.pdfFilePath,
              courId: item.courId
            }
            // 详情不显示操作
            if (this.operateType !== 'detail') {
              _cour.operation = this.operationB
            } else {
              _cour.operation = this.operationC
            }
            courList.push(_cour)
          })
          if (info.mapList) { // 有则渲染学员
            info.mapList.forEach(item => {
              item.traStartTime = item.traTime ? this.$options.filters['formatDate'](item.traStartTime, this.$t('vicenter.common.formatDate')) : '-'
              item.traEndTime = item.traTime ? this.$options.filters['formatDate'](item.traEndTime, this.$t('vicenter.common.formatDate')) : '-'
              chooseUsers.push(item.pcUserId)
              if (item.isDel) {
                disabledUsers.push(item.pcUserId)
              }
            })
            // 已选学员
            this.listTransfer.transfer.model = chooseUsers
            this.oldUserList = chooseUsers
            this.listTransfer.transfer.data.forEach(item => {
              // 学员不可删除
              item.disabled = disabledUsers.indexOf(item.key) !== -1
            })
            this.detailTableData.data = info.mapList
          }
          if (this.operateType === 'detail') {
            // 详情基础信息禁用
            this.addIpt.forEach(item => {
              item.disabled = true
            })
          } else {
            this.addIpt[0].disabled = true // 培训类型不可修改
          }
          this.tableData.data = courList
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 校验数据是否完整
    checkInfo () {
      let haveFile = this.tableData.data.filter(e => {
        return e.courFilePath
      })
      let cl = haveFile.length // 课件个数
      if (!cl) { // 没有上传课件
        return this.$t('vicenter.training.common.uploadCourseware')
      }
      for (let i = 0; i < cl; i++) {
        if (!haveFile[i].courFilePath) { // 没有为课件上传文档
          return this.$t('vicenter.training.common.uploadCourseware')
          // 没有选择课件权限
        } else if (haveFile[i].coursewarePermissions.indexOf(this.$t('vicenter.training.common.eLearning')) === -1 && haveFile[i].coursewarePermissions.indexOf(this.$t('vicenter.training.common.download')) === -1) {
          return this.$t('vicenter.training.common.selectCoursewarePermissions')
        }
      }
      // 私有课没有添加学员
      if (this.isStudentShow && !this.listTransfer.transfer.model.length) {
        return this.$t('vicenter.training.common.addStudent')
      }
    },
    // 提交
    handleSave () {
      if (!this.canSubmit) return false // 避免多次提交
      // 基础信息校验
      this.canSubmit = false
      this.$refs.basicInformation.$refs[this.formRule.refName].validate((valid) => {
        if (valid) {
          let msg = this.checkInfo()
          if (msg) {
            this.canSubmit = true
            return this.$NotifError(msg)
          }
          let upData = {} // 提交data
          // 基础信息
          this.addIpt.forEach(item => {
            upData[item.subKey] = item.models
          })
          upData.traCourCount = this.tableData.data.filter(e => {
            return e.courFilePath
          }).length // 课件个数
          upData.traUsreCount = this.listTransfer.transfer.model.length // 学员个数
          upData.courList = JSON.stringify(this.getCourList()) // 课件
          // if (this.isStudentShow) { // 私有课才有学员
          if (upData.traUsreCount) {
            upData.userList = JSON.stringify(this.getUserList()) // 学员
          }
          if (this.operateType === 'add') { // 新增
            upData.tarCreateUser = sessionStorage.getItem('userId') // 创建人id
            upData.traCourTrueName = sessionStorage.getItem('userName') // 创建人name
            req.addTraInfo(upData)
              .then(res => {
                if (res.data.result !== 900004) {
                  this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
                  this.goBack()
                } else {
                  this.$NotifError(this.$t('vicenter.training.common.trainingNameRepeating'))
                  throw new Error('nameRepeating')
                }
              })
              .catch(err => {
                this.canSubmit = true
                console.log(err)
              })
          } else { // 修改
            upData.traId = this.operateId
            req.upTraInfo(upData)
              .then(res => {
                if (res.data.flag) {
                  if (res.data.result !== 900004) {
                    this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
                    this.goBack()
                  } else {
                    this.$NotifError(this.$t('vicenter.training.common.trainingNameRepeating'))
                    throw new Error('nameRepeating')
                  }
                } else {
                  this.canSubmit = true
                }
              })
              .catch(err => {
                this.canSubmit = true
                console.log(err)
              })
          }
        } else {
          this.canSubmit = true
        }
      })
    },
    // 课件数据
    getCourList () {
      return this.tableData.data.filter(e => {
        return e.courFilePath
      }).map(e => {
        return {
          ...e,
          courIsDown: e.coursewarePermissions.indexOf(this.$t('vicenter.training.common.download')) !== -1 ? 0 : 1,
          courIsView: e.coursewarePermissions.indexOf(this.$t('vicenter.training.common.eLearning')) !== -1 ? 0 : 1
        }
      })
    },
    // 学员数据
    getUserList () {
      console.log(this.transferUserAll)
      let _selectedUser = this.transferUserAll.filter(u => {
        return this.listTransfer.transfer.model.indexOf(u.pcUserId) !== -1
      })
      return _selectedUser.map(e => {
        return {
          pcUserId: e.pcUserId,
          pcUserName: e.pcUserNo,
          pcTyueName: e.pcUserName,
          act: (this.oldUserList.indexOf(e.pcUserId) === -1 && this.operateType === 'edit') ? '1' : '' // 修改时 新增的人员添加 新增标识
        }
      })
    },
    // 选择器校验
    changeDeviceType (ref, param) {
      this.$changeSelectValidateField(ref, this, param)
    },
    // 返回
    goBack () {
      this.$router.push({path: '/Training/teacher/trainingList'})
    },
    getSort () {
    },
    treeClick (data) {
    },
    // 穿梭框值改变回调
    transferChange (e, to, arr) {
      console.log(e)
      console.log(to)
      console.log(arr)
      // if (to === 'left' && this.operateType === 'edit') { // 删除
      //   let promiseList = []
      //   arr.forEach(item => {
      //     promiseList.push(req.getTraCourCount({traId: this.operateId, pcUserId: item}))
      //   })
      //   Promise.all(promiseList)
      //     .then(res => {
      //       console.log(res)
      //     })
      //     .catch(err => {
      //       console.log(err)
      //     })
      // }
    },
    // 课件信息 相关操作开始 =================================================↓
    /**
       * 新增课件
       */
    handleCreate () {
      let obj = {
        courName: '',
        coursewarePermissions: [this.$t('vicenter.training.common.eLearning')],
        operation: this.operationA
      }
      if (this.operateType === 'edit') { // 修改时 新增的数据添加 新增标识
        obj.act = 1
      }
      // 插入一行数据
      this.tableData.data.push(obj)
    },
    /**
       * 上传课件
       * @param scope
       */
    toUpload (scope) {
      // 触发文件选择
      this.uploadIndex = scope.$index
      this.$refs.uploadFile.$el.click()
    },
    /**
       * 文件上传成功
       * @param res
       * @param file
       * @param fileList
       */
    handleSuccess (res, file, fileList) {
      console.log(res)
      this.uploadClose.close()
      this.uploadClose = null
      if (res.flag) {
        this.tableData.data[this.uploadIndex].courName = file.name
        this.tableData.data[this.uploadIndex].courFilePath = res.result.filePath
        this.tableData.data[this.uploadIndex].pdfFilePath = res.result.viewPath
        this.tableData.data[this.uploadIndex].operation = this.operationB
      } else {
        this.$NotifError(this.$t('vicenter.training.common.uploadFailure'))
      }
    },
    /**
       * 文件上传前
       * @param file
       */
    handleBeforeUpload (file) {
      console.log(file)
      if (!file.size) {
        this.$NotifError(this.$t('vicenter.training.common.fileNone'))
        return false
      }
      // 文件大小限制
      if (file.size > (1024 * 1024 * 100)) {
        this.$NotifError(this.$t('vicenter.training.common.fileSize'))
        return false
      }
      let _f = file.name.split('.')
      let _t = _f[_f.length - 1]
      // if (!/^(pdf|ppt|pptx|doc|docx|mp4|avi){1}$/.test(_t)) {
      if (!/^(pdf|ppt|pptx|doc|docx|mp4){1}$/.test(_t)) {
        // 不支持的类型
        this.$NotifError(this.$t('vicenter.training.common.fileType'))
        return false
      } else {
        this.defaultData.type = _t
        this.uploadClose = this.$initLoading()
      }
    },
    /**
       * 文件上传失败
       * @param err
       * @param file
       * @param fileList
       */
    handleError (err, file, fileList) {
      this.uploadClose.close()
      this.uploadClose = null
      console.log(err)
      console.log(file)
    },
    /**
     * 未上传课件时的删除
     * @param scope
     */
    handleDeleteWithoutFile (scope) {
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toDelete'), () => {
        this.tableData.data.splice(scope.$index, 1)
      })
    },
    /**
       * 删除上传的课件课件
       * @param scope
       */
    handleDelete (scope) {
      this.$ConfirmBox(this.$t('vicenter.training.common.confirmInfo.toDelete'), () => {
        if (this.operateType === 'add' || !scope.row.courId) { // 新增或者没有课件Id时可以直接删除
          this.tableData.data.splice(scope.$index, 1)
        } else {
          req.getTraCourCount({traId: this.operateId, courId: scope.row.courId})
            .then(res => {
              console.log(res)
              if (res.data.result > 0) {
                this.$NotifError(this.$t('vicenter.training.common.learned'))
              } else {
                this.tableData.data.splice(scope.$index, 1)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    /**
       * 预览课件
       * @param scope
       */
    studyOnline (scope) {
      console.log(scope)
      let _a = scope.row.pdfFilePath.split('.')
      let _type = _a[_a.length - 1]
      if (_type.indexOf('pdf') > -1) {
        this.videoOrPDF = false
        this.studyPDF = scope.row.pdfFilePath // 课件预览路径
      } else {
        this.videoOrPDF = true
        this.videoSrc = scope.row.pdfFilePath
      }
      this.dialogStudyFlag = true
    },
    // export const downloadBlob = (content, fileName) => {
    //   const blob = new Blob([content]);
    //   const a = document.createElement("a");
    //   const url = window.URL.createObjectURL(blob);
    //   const filename = fileName;
    //   a.href = url;
    //   a.download = filename;
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // }
    /**
       * 下载课件
       * @param scope
       */
    getDownload (scope) {
      console.log(scope)
      const filePath = scope.row.courFilePath
      window.open(`${this.baseUrl}/api/downFileWithName?fileName=${scope.row.courName}&fileUrl=${filePath.substring(0, filePath.indexOf('?'))}`)
    },
    // 课件信息 相关操作结束 =================================================↑
    // video ready
    videoReady () {
    },
    videoPlay () {
    },
    videoPause () {
    },
    videoEnded () {
    },
    videoLoadeddata () {
    },
    videoWaiting () {
    },
    videoTimeupdate () {
    },
    videoCanplay () {
    },
    videoCanplaythrough () {
    },
    videoStatechanged () {
    }
  },
  watch: {
    // 培训分类 切换
    addIpt: {
      handler (newName, oldName) {
        // 私有课显示学员
        this.isStudentShow = newName[0].models === this.selfClass
      },
      deep: true
    }
  },
  components: {bread, ComForm, panelTitle, ComTable, Dialog, Video}
}
</script>

<style lang="scss">
  @import '@/styles/index.scss';

  .upload-demo {
    width: 0;
    height: 0;
  }

  .trainingMsg-bar {
    @extend .extend-bar;

    .trainingMsg-M {
      padding: $margin;
      @include box-sizing;

      .operation-group {
        @include flex(row, flex-end, center);
        margin-bottom: $dis10;
      }

      .form-bar {
        width: $all;
        @media screen and (min-width: 1640px) {
          height: $all;
          overflow: hidden;
        }

        // #basicInformation {
        //   @include layout(2);
        //   .search-form-btn {
        //     button {
        //       display: none;
        //     }
        //   }
        // }

        .transfer-box {
          margin: $margin 0;
          .el-transfer__buttons {
            button {
              width: $all;
            }
          }
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

      @media screen and (min-width: 1640px) {
        .infolist {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          display: -webkit-box;
          display: -ms-flexbox;
          display: block;
        }
      }
      #basicInformation {
        width: $all;
        @include layout(2);
        .search-form-item {
          width: 48%!important;
          margin-right: 2%!important;
        }
        .search-form-btn {
          button {
            display: none;
          }
        }
      }
    }
  }

  .pdf-view .el-dialog {
    width: 100% !important;
    margin: 0 !important;
    height: 100vh;

    .el-dialog__body {
      height: calc(100% - 54px);
      box-sizing: border-box;

      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
