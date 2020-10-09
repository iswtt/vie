<template>
  <div class='image-analysis-detail-bar' v-bar>
    <div class='image-analysis-detail-M'>
     <div class="up-down-container">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 详情内容 -->
        <div class="up-down-infolist">
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
              <div class="number-title">
                  <span class="list-title">{{$t('vicenter.inspection.common.taskNo')}}：{{taskNo}} </span>
              </div>
              <el-button v-if="imageLibraryEnable && showAIResult" class="AIResult" type="primary" size="mini" @click='showAIResultModal'>
                {{$t('vicenter.common.AIResult')}}
                <span v-if="AIResultData.jsonData" class="mark" :class="{mark_red:AIResultData.conclusion!=='NO_SUSPECT',mark_green:AIResultData.conclusion==='NO_SUSPECT'}"></span>
              </el-button>
              <el-button class="findImg" type="primary" size="mini" @click='showFindImgDialog'>{{$t('vicenter.common.FindImage')}}</el-button>
              <el-button type="primary" size="mini" @click="judgeSubmit()">{{$t('vicenter.common.submit')}}</el-button>
              <el-button size="mini" @click="quitTask()">{{$t('vicenter.common.quit')}}</el-button>
            </panelTitle>
            <div class="image-info-box">
              <div class="checkin border">
                <panelTitle :panelTitleInit="title.InspectionInformation"></panelTitle>
                <div class="baseInfo">
                  <div class="InspectionInfo">
                    <detailList :listData="baseInfo" :widthStyle="detailListWidth"></detailList>
                  </div>
                  <div class="conAndDeclist">
                    <div class="conList">
                      <p class="image-info-group">
                        <span class="list-title">{{$t('vicenter.inspection.common.containerList')}}</span>
                      </p>
                      <ComTable :tableData='contableData' :tableGroup='contableGroup'></ComTable>
                    </div>
                    <div class="decList">
                      <p class="image-info-group">
                        <span class="list-title">{{$t('vicenter.inspection.common.decList')}}</span>
                      </p>
                      <ComTable :tableData='dectableData' :tableGroup='dectableGroup'></ComTable>
                    </div>
                  </div>
                </div>
                <div class="picBox">
                  <div class="row">
                    <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.carNum"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe :optionsRight='carNumAttach.option' :listData='carNumAttach.data' ></doubleSwipe>
                      </div>
                    </div>
                    <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.container"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe :optionsRight='containAttach.option' :listData='containAttach.data' ></doubleSwipe>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <!-- <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.XRayImage"></panelTitle>
                      <div class = "XRayImage">
                        <img :id="XRayImageID" @click="LookImg" :src="thisImgdata.imgSrc"/>
                      </div>
                    </div> -->
                    <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.video"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe :optionsRight='videoAttach.option' :listData='videoAttach.data' ></doubleSwipe>
                      </div>
                    </div>
                    <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.attachment"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe :optionsRight='otherAttach.option' :listData='otherAttach.data' ></doubleSwipe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="border ImgAnyCon flex">
                <panelTitle :panelTitleInit="title.ImageAnalysisTitle"></panelTitle>
                <div class="panel panel-Q">
                  <div class="form-bar" v-bar>
                    <ComForm ref="imageCheck" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule' :fromClass="formClass"></ComForm>
                  </div>
                </div>
              </div>
              <el-col :span="24" class="flex">
              <div class="border listBox">
                <panelTitle :panelTitleInit="title.asycuda"></panelTitle>
                <asycuda ref="declaration" :asycuda='entryInfo'></asycuda>
              </div>
              </el-col>
            </div>
          </div>
        </div>
        <Dialog :modalData="findImgModal">
          <TabList ref="TabList" :currentImgData="currentImgData" :searchImgByImgData="searchImgByImgData"></TabList>
        </Dialog>
        <Dialog :modalData="tipResultModal">
          <div class="insTipResult">
            <!-- todo score 变为数组，样式待讨论 -->
            <li>{{$t('vicenter.inspection.tip.score')}}</li>
            <ul class="score" v-for="(data, index) in tipResult.scoreShow" :key='index'>
              <li :class="{redSCore: data.score < 60}" class="greenSCore">{{index + 1}}、{{data.score}}</li>
            </ul>
            <ul class="image-show">
              <li>{{$t('vicenter.inspection.tip.correctImg')}}</li>
              <li>
                <img :src="tipResult.imgSrc" alt="">
              </li>
            </ul>
          </div>
        </Dialog>
        <AIResult v-if="AIResultData.jsonData" ref="AIResultRef" :AIResultData='AIResultData'></AIResult>
     </div>
    </div>
  </div>
</template>
<script>
import detailList from '@/components/detailList'
import breadCrumb from '@/components/breadCrumb'
import insTitle from '@/components/inspection/title'
import asycuda from '@/components/inspection/asycuda'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import ComForm from '@/components/form'
import Cswiper from '@/components/swipe'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import doubleSwipe from '@/components/detailSwipe'
import ajax from '@/api/inspection/Image-Analysis.js'
import insCommonAjax from '@/api/inspection/common.js'
import tamperRecordAjax from '@/api/inspection/Tampering-record.js'
import viProbe from '@/lib/viprobe/viProbeForIns.js'
import Dialog from '@/components/dialogCommon'
import TabList from '@/components/tabList'
import AIResult from '@/components/AIResult'
export default {
  name: 'image-analysis-detail',
  data () {
    return {
      showAIResult: false,
      imageLibraryEnable: false,
      tipExamId: '', // Tip任务id
      AIResultData: {
        jsonData: '',
        imgSrc: '',
        conclusion: ''
      },
      findImgModal: {
        title: this.$t('vicenter.common.FindImage'),
        flag: false,
        width: '90%',
        top: '50px',
        resetModal: this.closeFindImgModal
      },
      currentImgData: {}, // 当前任务的lastScanImage、scanSerialNumber、siteName、hsCodes
      searchImgByImgData: '', // 保存ilSearchImageByImageData字段(json字符串)
      tipResultModal: {
        title: this.$t('vicenter.inspection.tip.examResult'),
        flag: false,
        resetModal: this.closeTipResultModal
      },
      tipImageObj: { // 打开Tip融合图时需要的参数(进入详情页面直接获取)
        difficultyLevel: 0,
        files: []
      },
      tipResult: { // 考核结果(上传审图结论之后，viprobe返回)
        scoreShow: [], // 分数数组展示
        score: [], // 与后台交互分数数组
        imgSrc: '',
        examImgPath: []
      },
      tipImgPath: [], // Tip图像路径(全路径)
      examImgPath: '', // 保存TIP融合图像的路径
      detailListWidth: {
        width: '33.33%'
      },
      dectableData: {
        data: [],
        sortMethod: '',
        MaxHeight: 200
      },
      dectableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.inspection.common.declarationNo'),
          type: 'text',
          model: 'decNum'
        }
      ],
      contableData: {
        data: [],
        sortMethod: '',
        MaxHeight: 200
      },
      contableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.inspection.common.containerNo'),
          type: 'text',
          model: 'targetNumber'
        },
        {
          label: this.$t('vicenter.inspection.common.containerType'),
          type: 'text',
          model: 'containerType'
        }
      ],
      falseFlag: true,
      id: -1,
      taskNo: '',
      thisImgdata: {
        imgSrc: ''
      },
      cusDecInfoArr: [],
      containerInfoArr: [],
      currentContainer: 'container0',
      currentDec: 'dec0',
      currentDecItem: 'item0',
      tableLoading: true,
      CurrentChageFlag: false, // 分页切换标志位
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
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
      baseInfo: [
        {
          label: this.$t('vicenter.inspection.common.office'),
          value: '',
          ruleProp: 'siteName'
        },
        {
          label: this.$t('vicenter.inspection.common.scannerID'),
          value: '',
          ruleProp: 'deviceCode'
        },
        {
          label: this.$t('vicenter.inspection.common.checkInTime'),
          value: '',
          ruleProp: 'checkinTime'
        },
        {
          label: this.$t('vicenter.inspection.common.carType'),
          value: '',
          ruleProp: 'vehicleType'
        },
        {
          label: this.$t('vicenter.inspection.common.LPN'),
          value: '',
          ruleProp: 'lpnFront'
        },
        {
          label: this.$t('vicenter.inspection.common.lpnBack'),
          value: '',
          ruleProp: 'lpnBackCsv'
        }
      ],
      containerPane: {
        paneTitle: [],
        containerInfo: [
          {
            label: this.$t('vicenter.inspection.common.container'),
            value: '',
            ruleProp: 'targetNumber'
          },
          {
            label: this.$t('vicenter.inspection.common.containerType'),
            value: '',
            ruleProp: 'containerType'
          },
          {
            label: this.$t('vicenter.inspection.common.cargoStatus'),
            value: '',
            ruleProp: 'cargoStatus'
          },
          {
            label: this.$t('vicenter.inspection.common.sealNo'),
            value: '',
            ruleProp: 'sealNo'
          },
          {
            label: this.$t('vicenter.inspection.common.containerWeight'),
            value: '',
            ruleProp: 'containerWeight'
          }
        ]
      },
      panelTitle: { // title组件数据
        queryTitle: {
          title: this.$t('vicenter.inspection.common.inspectionTaskForm')
        }
      },
      title: {
        ImageAnalysisTitle: {
          title: this.$t('vicenter.inspection.common.imageAnalysis')
        },
        InspectionInformation: {
          title: this.$t('vicenter.inspection.common.inspectionInformation')
        },
        attachment: {
          title: this.$t('vicenter.inspection.common.attachments')
        },
        XRayImage: {
          title: this.$t('vicenter.inspection.common.XRayImage')
        },
        carNum: {
          title: this.$t('vicenter.inspection.common.carNum')
        },
        container: {
          title: this.$t('vicenter.inspection.common.containerTitle')
        },
        asycuda: {
          title: this.$t('vicenter.inspection.common.asycuda')
        },
        video: {
          title: this.$t('vicenter.inspection.common.video')
        }
      },
      XRayImageID: 'xRayImage',
      inputItem: [
        {
          getLabel: this.$t('vicenter.inspection.common.imgConclusion'),
          type: 'radio',
          placeHolder: '',
          models: '',
          ruleProp: 'conclusion',
          change: this.changeRadio,
          option: []
        },
        {
          getLabel: this.$t('vicenter.inspection.common.contrabandLocation'),
          type: 'select',
          placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: '',
          ruleProp: 'contrabandLocation',
          clearable: true, // 可清除
          disabled: true,
          option: [],
          change: this.changeLocation
        },
        {
          getLabel: this.$t('vicenter.inspection.common.contrabandType'),
          type: 'select',
          placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: '',
          ruleProp: 'contrabandType',
          clearable: true, // 可清除
          disabled: true,
          option: [],
          change: this.changeType
        },
        {
          getLabel: this.$t('vicenter.inspection.common.remarks'),
          type: 'textarea',
          placeHolder: this.$t('vicenter.common.pleaseEnter'),
          models: '',
          rows: '3',
          autoSize: '3',
          ruleProp: 'remark'
        }
      ],
      queryFn: { // 页面表单查询方法
        query: this.querynull
      },
      suspectedRule: {
        conclusion: [
          { required: true, message: this.$t('vicenter.supervise.taskInspectionDetail.pleaseChooseconclusion'), trigger: 'blur' }
        ],
        contrabandType: [
          { required: true, message: this.$t('vicenter.inspection.common.selectcontrabandType'), trigger: 'blur' }
        ],
        contrabandLocation: [
          { required: true, message: this.$t('vicenter.inspection.common.selectcontrabandLocation'), trigger: 'blur' }
        ],
        remark: [
          {min: 1, max: 500, message: this.$t('vicenter.common.limitRemarksLength'), trigger: 'blur'}
        ]
      },
      noSuspectedRule: {
        conclusion: [
          { required: true, message: this.$t('vicenter.supervise.taskInspectionDetail.pleaseChooseconclusion'), trigger: 'blur' }
        ],
        remark: [
          {min: 1, max: 500, message: this.$t('vicenter.common.limitRemarksLength'), trigger: 'blur'}
        ]
      },
      formRule: {
        refName: 'queryForm',
        rule: {
          conclusion: [
            { required: true, message: this.$t('vicenter.supervise.taskInspectionDetail.pleaseChooseconclusion'), trigger: 'blur' }
          ],
          remark: [
            {min: 1, max: 500, message: this.$t('vicenter.common.limitRemarksLength'), trigger: 'blur'}
          ]
        },
        model: {
          conclusion: '',
          contrabandType: '',
          contrabandLocation: '',
          remark: ''
        }
      },
      formClass: {
        buttonClass: 'firbutton'
      },
      listData: [
      ],
      videoAttach: {
        option: { // 视频附件
          propId: 'videoAttach'
        },
        data: []
      },
      otherAttach: {
        option: { // 其他附件
          propId: 'otherAttach'
        },
        data: [
        ]
      },
      carNumAttach: { // 车牌号附件
        option: { // 其他附件
          propId: 'carNumAttach'
        },
        data: [
        ]
      },
      containAttach: { // 集装箱附件
        option: { // 其他附件
          propId: 'containAttach'
        },
        data: [
        ]
      },
      entryInfo: {
        paneTitle: [],
        upList: [
          {
            label: this.$t('vicenter.inspection.common.declaration'),
            value: '',
            ruleProp: 'decNum'
          },
          {
            label: this.$t('vicenter.inspection.common.declarationType'),
            value: '',
            ruleProp: 'decType'
          },
          {
            label: this.$t('vicenter.inspection.common.regime'),
            value: '',
            ruleProp: 'regime'
          },
          {
            label: this.$t('vicenter.inspection.common.portOfEntry'),
            value: '',
            ruleProp: 'portOfEntry'
          },
          {
            label: this.$t('vicenter.inspection.common.officeOfDeclaration'),
            value: '',
            ruleProp: 'officeOfDeclaration'
          },
          {
            label: this.$t('vicenter.inspection.common.portOfExit'),
            value: '',
            ruleProp: 'portOfExit'
          }
        ],
        downList: {
          panelTitle: [],
          infoData: [
            {
              label: this.$t('vicenter.inspection.common.stemSepNo'),
              value: '',
              ruleProp: 'stemSepNo'
            },
            {
              label: this.$t('vicenter.inspection.common.hsCode'),
              value: '',
              ruleProp: 'hsCode'
            },
            {
              label: this.$t('vicenter.inspection.common.description'),
              value: '',
              ruleProp: 'hsDesc'
            },
            {
              label: this.$t('vicenter.inspection.common.countryOfOrigin'),
              value: '',
              ruleProp: 'countryOfOrigin'
            },
            {
              label: this.$t('vicenter.inspection.common.CPC'),
              value: '',
              ruleProp: 'cpc'
            },
            {
              label: this.$t('vicenter.inspection.common.isVehicle'),
              value: '',
              ruleProp: 'isVehicle'
            },
            {
              label: this.$t('vicenter.inspection.common.quantity'),
              value: '',
              ruleProp: 'quantity'
            },
            {
              label: this.$t('vicenter.inspection.common.grossWeight'),
              value: '',
              ruleProp: 'grossWeight'
            },
            {
              label: this.$t('vicenter.inspection.common.netWeight'),
              value: '',
              ruleProp: 'netWeight'
            },
            {
              label: this.$t('vicenter.inspection.common.noOfPackages'),
              value: '',
              ruleProp: 'noOfPackages'
            }
          ]
        }
      },
      loading: {},
      showFlag: false,
      scanningImgName: '',
      scanImagePath: '',
      scanningImgFiles: [],
      isUff: false,
      openViprobeFlag: false,
      viprobeData: {
        suspected: 'CONC001',
        noSuspected: 'CONC002',
        timeout: 10
      }
    }
  },
  created () {
    this.showAIResult = window.config.showAIResult
    this.imageLibraryEnable = window.config.imageLibraryEnable
    let id = JSON.parse(sessionStorage.getItem('detailId'))
    this.id = id
    this.getDetail()
    this.$getDataByTypecode(['IMG_CHECK_CONC', 'CONTRABAND_TYPE', 'CONTRABAND_LOCATION'], ['conclusion', 'contrabandType', 'contrabandLocation'], this.inputItem)
    // this.inputItem[0].models = this.viprobeData.noSuspected
    window.viprobeReturn = {
      getMarkBase64Success: null,
      markBase64: null,
      errorCode: 0,
      uploadImageAnalysisSuccess: null,
      uploadTipImageAnalysisSuccess: null,
      uploadImageAnalysisBackResult: null,
      imageInViProbeBase64: null,
      openImgSuccess: null
    }
    window.viprobeUtilReturn.errorCode = null
    window.viprobeUtilReturn.reconnectToViProbeFailed = null
  },
  methods: {
    showAIResultModal () {
      if (this.AIResultData.jsonData) {
        this.$refs.AIResultRef.AIResultModal.flag = true
      } else {
        this.$NotifPrompt(this.$t('vicenter.common.AIResultNoData'))
      }
    },
    // 处理TIP考核信息数据
    handleTipExamData (examImgPath, difficulty, energyType) {
      var files = []
      var view1 = {
        difficultyLevel: difficulty //  -1 / 0 / 1 / 2, //-1或0表示随机难度，难度级别包括1容易，2困难
      }
      if (examImgPath && examImgPath.length > 0) {
        examImgPath.forEach(e => {
          e.path = e.imgPath
          e.uuid = e.imgId
          e.energe_type = Number(energyType)
          e.trans = 'https'
          e['high'] = {
            name: e.high
          }
          if (e['low']) {
            e['low'] = {
              name: e.low
            }
          } else {
            delete e.low
          }
          if (e['hemd']) {
            e['hemd'] = {
              name: e.hemd
            }
          } else {
            delete e.hemd
          }
          delete e.imgId
          delete e.imgPath
          delete e.difficultyLevel
          files.push(e)
        })
      }
      console.log(files)
      return files
    },
    // 关闭考核结果
    closeTipResultModal () {
      this.$NotifPrompt(this.$t('vicenter.inspection.tip.analyzeImgAgain'))
      this.tipExamId = '' // 清空tipExamId,审图员开始审原图
      this.inputItem.forEach(e => {
        // if (e.ruleProp === 'conclusion') {
        //   e.models = this.viprobeData.noSuspected
        // }
        if (e.ruleProp === 'remark') {
          e.models = ''
        }
      })
      this.formRule.model = {
        // conclusion: this.viprobeData.noSuspected,
        conclusion: '',
        contrabandType: '',
        contrabandLocation: '',
        remark: ''
      }
      this.$checkChangeRadio(this, 'imageCheck')
      this.openViprobe()
    },
    // 显示以图找图弹出框
    showFindImgDialog () {
      this.findImgModal.flag = true
      // 解决关闭模态框的时候查询数据不清空的问题
      if (this.$refs.TabList) {
        this.$refs.TabList.showTabs = true
      }
    },
    closeFindImgModal () {
      // 解决关闭模态框的时候查询数据不清空的问题
      this.$refs.TabList.showTabs = false
    },
    changeLocation () {
      this.$changeSelectValidateField('imageCheck', this, 'contrabandLocation')
    },
    changeType () {
      this.$changeSelectValidateField('imageCheck', this, 'contrabandType')
    },
    getDetail () {
      if (this.id === -1) {
        this.$NotifPrompt(this.$t('vicenter.inspection.common.dataError'))
      } else {
        ajax.getDetail({id: this.id}).then(res => {
          if (res.data.flag) {
            let { taskObject, taskDecObjects, taskTargetObjects, taskAttachementObjects, tipExamObject } = res.data.result
            Object.assign(this.currentImgData, res.data.result)
            // 以图搜图
            this.searchImgByImgData = taskObject.ilSearchImageByImageData
            // 智审结果
            this.AIResultData.jsonData = taskObject.ilSearchImageByImageData
            if (this.AIResultData.jsonData) {
              let _jsonData = JSON.parse(this.AIResultData.jsonData)
              this.AIResultData.conclusion = _jsonData.overall_result['conclusion']
              let params = {}
              params.paths = taskObject.lastScanImage.substr(0, taskObject.lastScanImage.lastIndexOf('/') + 1) + taskObject.scanSerialNumber + '.jpg'
              insCommonAjax.getFullSignPath(params).then((res) => {
                if (res.data.flag) {
                  res.data.result.forEach(e => {
                    this.AIResultData.imgSrc = e
                    console.log(this.AIResultData.imgSrc)
                  })
                }
              })
            }
            // 扫描流水号
            this.$data.taskNo = taskObject.scanSerialNumber
            // 查验信息
            this.$initInspectionData(this.$data, taskObject)
            // 集装箱信息
            this.$initContainerData(this.$data, taskTargetObjects)
            // 报关单信息
            this.$initCusDecData(this.$data, taskDecObjects)
            // LPN、Container No图片
            this.$initImgData(this.$data, taskAttachementObjects)
            // 扫描图像(X-Ray Image)
            this.$data.thisImgdata.imgSrc = taskObject.lastScanImage
            // 扫描图片
            let imgSrc = taskObject.scanSerialNumber
            if (imgSrc != null && imgSrc !== '') {
              this.scanningImgName = imgSrc
            }
            this.scanImagePath = taskObject.scanImagePath
            // 解决页面初始化图片展示变形的问题
            this.showFlag = true
            if (tipExamObject) {
              // Tip考核id
              this.tipExamId = tipExamObject.tipExamId
              // 难度系数
              this.tipImageObj.difficultyLevel = tipExamObject.difficulty
              // Tip图像
              this.tipImgPath = tipExamObject.tipImg
              // tippath  不定
              // if (this.tipImgPath.length > 0) {
              //   this.tipImgPath.forEach(img => {
              //     this.tipImageObj.path = img.path.substring(0, img.path.lastIndexOf('/') + 1)
              //   })
              // }
              this.tipImageObj.files = this.handleTipExamData(this.tipImgPath, tipExamObject.difficulty, tipExamObject.energyType)
              // 保存TIP融合图像的路径
              this.examImgPath = tipExamObject.examImgPath
            }
            if (taskObject.tamperedPosition) { // 篡改位置字段 1：中心,2：现场,3:中心、现场都改
              if (taskObject.tamperedPosition === '1' || taskObject.tamperedPosition === '2' || taskObject.tamperedPosition === '3') {
                // this.$NotifPrompt(this.$t('vicenter.common.viprobe.tampered')) // 当前图像已经被篡改
              }
            }
            this.openViprobe()
          } else {
            this.getBack()
          }
        }).catch(() => {})
      }
    },
    /**
     * 判断是否提交任务
     */
    judgeSubmit () {
      console.log('judgeSubmit')
      if (viprobeUtilReturn.errorCode === 24577 || viprobeUtilReturn.errorCode === 4105) {
        viprobeUtilReturn.errorCode = 0
      }
      console.log('judgeSubmit,errorCode=' + viprobeUtilReturn.errorCode)
      this.$refs['imageCheck'].$refs[this.formRule.refName].validate((valid) => {
        console.log('judgeSubmit,valid=' + valid)
        if (valid) {
          console.log('judgeSubmit,openViprobeFlag=' + this.openViprobeFlag + ',reconnectToViProbeFailed =' + viprobeUtilReturn.reconnectToViProbeFailed + ',viprobeUtilReturn.errorCode =' + viprobeUtilReturn.errorCode)
          if (this.openViprobeFlag === false || viprobeUtilReturn.reconnectToViProbeFailed !== false || viprobeUtilReturn.errorCode !== 0) {
            this.$NotifPrompt(this.$t('vicenter.common.viprobe.waiting'))
            return false
          }
          let _this = this
          this.$ConfirmBox(this.$t('vicenter.inspection.common.submitTask'), () => {
            this.setLoading()
            // 此方法业务逻辑
            // 设置页面上所有按钮不能点击，等待提交
            // 1.弹出提示让用户确认是否要提交，若确定提交则校验结论的必填项，是否填写完整
            // 2.获取嫌疑标记信息，核验嫌疑标记与结论是否匹配(下有嫌疑结论时图像上应该有嫌疑标记，下无嫌疑结论时图像上应该无嫌疑标记)
            // 3.上传嫌疑标记文件、历史操作步骤文件、带嫌疑框的原始图像
            // 4.获取用户在ViProbe中变换的最终图像
            // 5.提交信息到后台
            // 6.提交成功后关闭在ViProbe中已打开的图像，返回到任务列表页，
            // 6.提交失败后设置按钮可以点击，保留在此页面。
            // 第2、3、4、步骤的操作如下所示-----------------------------------------
            // 清除所有要用的变量的值，设置为初始值
            console.debug('start getMarkAsBase64')
            viProbe.getMarkAsBase64(this.scanningImgName)
            console.debug('start validate Mark info')
            _this.markValidator()
          })
        }
      })
    },
    // 校验嫌疑标记信息与结论是否相符，并进行后续操作
    markValidator () {
      let {conclusion} = this.formRule.model
      let name = this.scanningImgName// 图像 流水号
      let path = this.scanImagePath// 到文件夹级别
      console.log('window' + viprobeReturn.getMarkBase64Success)
      if (viprobeReturn.getMarkBase64Success === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.setButtonEnable()
          return false
        } else {
          console.info('get mark not finished, waiting...')
          setTimeout(this.markValidator, this.viprobeData.timeout)
        }
      } else if (viprobeReturn.getMarkBase64Success === true) {
        viprobeReturn.getMarkBase64Success = null
        if (conclusion === this.viprobeData.suspected && viprobeReturn.markBase64 !== '') {
          console.debug('end validate Mark, start upload viprobe info')
          if (this.tipExamId) {
            viProbe.uploadTipImageAnalysisInfo(name, this.examImgPath)
            setTimeout(this.uploadTipViProbeInfoValidator, this.viprobeData.timeout)
          } else {
            let markSign = ''
            let stepSign = ''
            let markJpgSign = ''
            viProbe.uploadImageAnalysisInfo(name, path, true, true, true, markSign, stepSign, markJpgSign)
            setTimeout(this.uploadViProbeInfoValidator, this.viprobeData.timeout)
          }
        } else if (conclusion === this.viprobeData.noSuspected && viprobeReturn.markBase64 === '') {
          console.debug('end validate Mark, start upload viprobe info')
          if (this.tipExamId) {
            viProbe.uploadTipImageAnalysisInfo(name, this.examImgPath)
            setTimeout(this.uploadTipViProbeInfoValidator, this.viprobeData.timeout)
          } else {
            let stepSign = ''
            viProbe.uploadImageAnalysisInfo(name, path, false, true, false, '', stepSign, '')
            setTimeout(this.uploadViProbeInfoValidator, this.viprobeData.timeout)
          }
        } else {
          // 弹出提示框，提示用户，结论与嫌疑标记不符
          this.$NotifError(this.$t('vicenter.common.viprobe.conclusionAndMarkDontMatch'))
          this.setButtonEnable()
          return false
        }
      } else if (viprobeReturn.getMarkBase64Success === false) {
        viprobeReturn.getMarkBase64Success = null
        // 弹出提示框，提示用户，与ViProbe交互失败
        // this.$NotifError(this.$t('vicenter.common.viprobe.getMarkError') + viprobeReturn.errorCode)
        this.$NotifError(this.$t('vicenter.common.viprobe.getMarkError'))
        this.setButtonEnable()
        return false
      }
    },
    // 校验上传ViProbe中审图相关信息是否成功，并进行后续操作
    uploadViProbeInfoValidator () {
      console.log('uploadImageAnalysisSuccess   ' + viprobeReturn.uploadImageAnalysisSuccess)
      if (viprobeReturn.uploadImageAnalysisSuccess === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
          this.setButtonEnable()
          return false
        } else {
          console.info('upload ViProbe info not finished, waiting...')
          setTimeout(this.uploadViProbeInfoValidator, this.viprobeData.timeout)
        }
      } else if (viprobeReturn.uploadImageAnalysisSuccess === true) {
        console.debug('end validate Upload ViProbe info, submit conclusion')
        this.submitTask()
      } else if (viprobeReturn.uploadImageAnalysisSuccess === false) {
        // 弹出提示框，提示用户，与ViProbe交互失败
        // this.$NotifError(this.$t('vicenter.common.viprobe.uploadMarkError') + viprobeReturn.errorCode)
        this.$NotifError(this.$t('vicenter.common.viprobe.uploadMarkError'))
        this.setButtonEnable()
        return false
      }
    },
    uploadTipViProbeInfoValidator () {
      if (viprobeReturn.uploadTipImageAnalysisSuccess === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
          this.setButtonEnable()
          return false
        } else {
          console.info('upload ViProbe info not finished, waiting...')
          setTimeout(this.uploadTipViProbeInfoValidator, this.viprobeData.timeout)
        }
      } else if (viprobeReturn.uploadTipImageAnalysisSuccess === true) {
        console.debug('end validate Upload ViProbe info, submit conclusion')
        if (this.tipExamId) {
          console.log(viprobeReturn.uploadImageAnalysisBackResult)
          let tipBackData = viprobeReturn.uploadImageAnalysisBackResult
          let ratioArr = tipBackData.ratio
          ratioArr.forEach(e => {
            // 第一个浮点数表示重合的区域占标准答案的比值取值范围为[0,1]
            // 第二个浮点数表示用户答题框出的区域与标准答案区域的比值，比值小于1时，直接取第一个参数作为参考，比值大于1时，第一个浮点数需要除以第二个浮点数
            let arr = e.value.split(':')
            let score = 0
            if (arr.length === 2) {
              let a = Number(arr[0])
              let b = Number(arr[1])
              if (b < 1) {
                score = a * 100
              } else {
                let c = a / b
                score = c * 100
              }
            }
            score = Math.round(score) // 转成int型
            let str = `${e.uuid}:${score}`
            this.tipResult.score.push(str)
            this.tipResult.scoreShow.push({score: score, uuid: e.uuid})
          })
          // if (ratioArr[1] > 1) {
          //   this.tipResult.score = Math.round(ratioArr[0] / ratioArr[1] * 100)
          // } else {
          //   this.tipResult.score = Math.round(ratioArr[0] * 100)
          // }
          if (tipBackData.files.length > 0) {
            tipBackData.files.forEach(e => {
              this.tipResult.examImgPath.push(`${tipBackData.path}/${e}`)
            })
          }
        }
        this.submitTask()
      } else if (viprobeReturn.uploadTipImageAnalysisSuccess === false) {
        // 弹出提示框，提示用户，与ViProbe交互失败
        // this.$NotifError(this.$t('vicenter.common.viprobe.uploadMarkError') + viprobeReturn.errorCode)
        this.$NotifError(this.$t('vicenter.common.viprobe.uploadMarkError'))
        this.setButtonEnable()
        return false
      }
    },
    getImageInViProbeValidator () {
      if (viProbe.getImageInViProbeBase64Success === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.setButtonEnable()
          return false
        } else {
          console.info('get image in ViProbe not finished, waiting...')
          setTimeout(this.getImageInViProbeValidator, this.viprobeData.timeout)
        }
      } else if (viProbe.getImageInViProbeBase64Success === true) {
        console.debug('end validate get image in ViProbe, start print ')
        // 获取到了嫌疑标记
        alert('imageInViProbeBase64:' + viProbe.imageInViProbeBase64)
      } else if (viProbe.getImageInViProbeBase64Success === false) {
        // 弹出提示框，提示用户，与ViProbe交互失败
        this.$NotifError(this.$t('vicenter.common.viprobe.getImgError'))
        return false
      }
    },
    setButtonEnable () {
      this.loading.close()
    },
    setLoading () {
      this.loading = this.$loading({
        lock: true,
        text: this.$t('vicenter.inspection.common.waiting'),
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.5)'
      })
    },
    /**
     * 提交任务方法
     */
    submitTask () {
      let data = {}
      data = this.formRule.model
      data.id = this.id
      if (this.tipExamId) {
        data.tipExamId = this.tipExamId
        data.score = this.tipResult.score
        data.examImgPath = this.tipResult.examImgPath
      }
      ajax.submitTask(data).then(res => {
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.submitSuccess'))
          this.setButtonEnable()
          this.closeViprobe()
          this.openViprobeFlag = false
          if (this.tipExamId) {
            // 如果此图是Tip图，弹框显示得分以及正确图像，考核结束。关闭弹框后，打开原图重新审图
            res.data.result.forEach(e => {
              if (e.indexOf('_answer.jpg') > 0) {
                this.tipResult.imgSrc = e
              }
            })
            this.tipResultModal.flag = true
          } else {
            this.$router.push({ path: '/Inspection/Image-Analysis' })
          }
        } else {
          this.setButtonEnable()
        }
      }).catch(() => {
        this.setButtonEnable()
      })
    },
    /**
    放弃任务的方法
     */
    quitTask () {
      this.$ConfirmBox(this.$t('vicenter.inspection.common.quitTask'), () => {
        let data = {}
        data.id = this.id
        if (this.tipExamId) {
          data.tipExamId = this.tipExamId
        }
        ajax.quitTask(data).then(res => {
          if (res.data.flag) {
            this.closeViprobe()
            this.$router.push({ path: '/Inspection/Image-Analysis' })
          }
        }).catch(() => {})
      })
    },
    openViprobe () {
      var name = this.scanningImgName// 图像 流水号
      var path = this.scanImagePath// 到文件夹级别
      var imageFiles = this.scanningImgFiles// 放入所有的img文件
      if (this.tipExamId) {
        console.log('审Tip图')
        let _imageFiles = []
        if (imageFiles && imageFiles.length > 0) {
          _imageFiles.push(imageFiles[0]) // 对于TIP融合图，原图只传第一视角的，第二视角的数据不传
        }
        viProbe.openImageInViProbe(name, path, _imageFiles, this.tipImageObj, this.isUff)
      } else {
        console.log('审原图')
        viProbe.openImageInViProbe(name, path, imageFiles, null, this.isUff)
      }
      if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
        this.openViprobeFlag = true
        this.judgeOpen()
      } else {
        this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
      }
    },
    judgeOpen () {
      if (window.viprobeReturn.openImgSuccess === null) {
        setTimeout(this.judgeOpen, 200)
      } else {
        if (!window.viprobeReturn.openImgSuccess) {
          if (window.viprobeReturn.errorCode === 4105) { // 图像被意外篡改
            tamperRecordAjax.addRecord({taskId: this.id}).then(res => {
            })
          }
        } else { // 打开原图成功之后，调用viporbe显示智审结果接口
          if (!this.tipExamId && this.AIResultData.jsonData) {
            let name = this.scanningImgName
            let type = 'jsonstr'
            let jsonData = this.AIResultData.jsonData
            viProbe.showIntelligentAnalysis(name, type, jsonData)
          }
        }
      }
    },
    closeViprobe () {
      // 关闭ViProbe中已打开的此任务的图像
      var name = this.$data.scanningImgName // 图像 流水号
      viProbe.closeImageInViProbe(name)
    },
    /**
     * 点击radio切换时,选中无嫌疑，嫌疑类型不可编辑，选中有嫌疑，嫌疑类型可编辑
     */
    changeRadio () {
      this.$checkChangeRadio(this, 'imageCheck')
    },
    querynull () {
      return false
    },
    getBack () {
      this.$router.push({ path: '/Inspection/Image-Analysis' })
    },
    LookImg () {
      var viewer = new Viewer(document.getElementById(this.XRayImageID))
      viewer.view()
    }
  },
  beforeDestroy () {
    if (this.openViprobeFlag && viprobeUtilReturn.reconnectToViProbeFailed === false) {
      this.closeViprobe()
    }
  },
  components: {breadCrumb, panelTitle, ComTable, ComForm, Cswiper, doubleSwipe, insTitle, asycuda, detailList, Dialog, TabList, AIResult}
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.image-analysis-detail-bar {
  @extend .extend-bar;
  .image-analysis-detail-M{
    .up-down-infolist {
      .AIResult>span {
        @include flex(row, center, center);
        .mark {
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background: transparent;
          margin-left: 5px;
        }
        .mark_red {
          background: red;
        }
        .mark_green {
          background: green;
        }
      }
    }
    .image-info-box {
      position: relative;
      width: calc(100% - 10px);
      margin: $detailMargin;
      padding-bottom: 2px;
      @include flex(row, flex-start, flex-start);
      flex-wrap: wrap;
      .el-form-item__label{
        line-height: 34px;
      }
      .el-select {
        width: 100%;
      }
      .flex{
        @include flex(row, flex-start, flex-start);
        flex-wrap: wrap;
        .panel {
          @extend .extend-panel;
          border: 0px;
          margin-bottom: 0px;
        }
        .panel-Q {
          .el-form {
            @include layout(1);
          }
          height: calc(100% - 50px);
          @extend .extend-panel-Q;
          margin-right: 0;
          padding: 10px 20px;
          width: $all;
          .form-bar {
            width: $all;
            height: $all;
            .el-form-item {
              margin: 10px;
            }
            @media screen and (min-width: 1640px) {
            height: $all;
            overflow: hidden;
            }
            .el-radio-group {
              width: 100%;
              text-align: left;
            }
            .firbutton{
              display: none;
            }
          }
        }
      }
      .el-form-item__label{
        font-weight: bold;
      }
      .el-textarea__inner{
        resize: none;
        height: unset!important;
      }
      .tabs{
       width: $all;
       margin-bottom: 10px;
      }
      .col-right {
        position: absolute;
        right: 0%;
        top: 0;
        bottom: 0;
      }
    }
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
    }
    .el-tabs__nav-next, .el-tabs__nav-prev {
      line-height: 30px;
    }
    .el-tab-pane {
      overflow: auto;
    }
  }
}
.insTipResult {
  ul {
    margin-bottom: $dis10;
    li {
      line-height: 30px;
    }
  }
  .score {
    .greenSCore {
      font-weight: bold;
      color: green;
      font-size: 18px;
    }
    .redSCore {
      font-weight: bold;
      color: red;
      font-size: 18px;
    }
  }
  .image-show {
    img {
      width: $all;
    }
  }
}
</style>
