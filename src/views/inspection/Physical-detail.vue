<template>
  <div class='physical-analysis-detail-bar' v-bar>
    <div class='physical-analysis-detail-M'>
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
              <el-button v-if="printButton" data-id="print-btn" @click="handlePrint" type="primary" size="mini" >{{$t('vicenter.common.print')}}</el-button>
              <el-button v-if="exportButton" data-id="export-btn" @click="handleExport" type="primary" size="mini" >{{$t('vicenter.common.export', {msg: ''})}}</el-button>
              <!-- <el-button class="findImg" type="primary" size="mini" @click='showFindImgDialog'>{{$t('vicenter.common.FindImage')}}</el-button> -->
              <el-button type="primary" size="mini" @click="submitTask()">{{$t('vicenter.common.submit')}}</el-button>
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
                      <panelTitle :panelTitleInit="title.XRayImage">
                         <el-button type="primary" size="mini" @click="openViprobe()">Viprobe</el-button>
                      </panelTitle>
                      <div class = "XRayImage">
                        <img :id="XRayImageID" @click="LookImg" :src="thisImgdata.imgSrc"/>
                      </div>
                    </div>
                    <!-- <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.video"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe :optionsRight='videoAttach.option' :listData='videoAttach.data' ></doubleSwipe>
                      </div>
                    </div> -->
                    <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.attachment"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe :optionsRight='otherAttach.option' :listData='otherAttach.data' ></doubleSwipe>
                      </div>
                    </div>
                  </div>
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
                </div>
              </div>
              <div class="border ImgAnyCon">
                <panelTitle :panelTitleInit="title.ImageAnalysisTitle"></panelTitle>
                <ComTable :tableData='imgCheckData' :tableGroup='imgCheckGroup'></ComTable>
              </div>
              <el-col :span="24" class="flex">
              <div class="border listBox docInfoHeight">
                <DocInfo :infoData="docInfoData"></DocInfo>
              </div>
              <div class="border physicalBox flex">
                <panelTitle :panelTitleInit="title.physicalBox"></panelTitle>
                <div class="panel panel-Q">
                  <div class="form-bar" v-bar>
                    <ComForm ref="manualCheck" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule' :fromClass="formClass"></ComForm>
                     <div class="attach_label">{{$t('vicenter.common.enclosure')}}</div>
                     <br>
                      <div class="uploadBox">
                        <div class="uploadButton">
                          <upload ref='uploadAttr' :propOption='uploadImg.option'></upload>
                        </div>
                        <br>
                        <div v-if="showSwiper && uploadImg.option.previewList.length>0" class="swiperPreview">
                          <Cswiper @deleteAttach="deleteAttach" :propOption='uploadImg.option.preview' :listData='uploadImg.option.previewList'></Cswiper>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              </el-col>
            </div>
          </div>
        </div>
        <Dialog :modalData="findImgModal">
          <TabList ref="TabList" :currentImgData="currentImgData" :searchImgByImgData="searchImgByImgData"></TabList>
        </Dialog>
        <Dialog :modalData="addSeizedGoodsModalData">
          <ComForm  ref="addSeizedGoodsModal" :searchIpt="addSeizedGoodsData.inputItem" :searchFunc="addSeizedGoodsData.queryFn" :formRule='addSeizedGoodsData.formRule'></ComForm>
          <div class="addSeizedGoodsBtnClass">
            <el-button type="primary" size="mini" @click="handleAddSeizedGoods">{{$t('vicenter.common.sure')}}</el-button>
            <el-button size="mini" @click="closeAddModal">{{$t('vicenter.common.cancel')}}</el-button>
          </div>
        </Dialog>
     </div>
    </div>
    <printTable ref="printTableRef" :printTable="printTable"></printTable>
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
import upload from '@/components/uploadPreview'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import doubleSwipe from '@/components/detailSwipe'
import ajax from '@/api/inspection/Physical-Analysis.js'
import insCommonAjax from '@/api/inspection/common.js'
import viProbe from '@/lib/viprobe/viProbeForIns.js'
import Dialog from '@/components/dialogCommon'
import TabList from '@/components/tabList'
import DocInfo from '@/components/documentInfomation'
export default {
  name: 'physical-analysis-detail',
  data () {
    // 嫌疑物数量校验
    var seizedQtyMax = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value) {
        let num = parseFloat(value)
        // (0.00~99999999.99]为范围
        if (num > 99999999.99 || num === 0.00) {
          callback(new Error(this.$t('vicenter.common.verifyRules.seizedQty')))
        } else {
          callback()
        }
      }
    }
    return {
      docInfoData: [],
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 6,
        title: this.$t(this.$route.name),
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 6,
            infoType: 'checkinInfo',
            label: this.$t('vicenter.inspection.common.inspectionInformation')
          },
          {
            type: 'content',
            infoType: 'checkinInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.siteId'),
                ruleProp: 'siteName'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'siteName'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.device'),
                ruleProp: 'deviceName'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'deviceName'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.checkinTime'),
                ruleProp: 'checkinTime'
              },
              {
                type: 'time',
                value: '',
                ruleProp: 'checkinTime'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'checkinInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.vehicleType'),
                ruleProp: 'vehicleType'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'vehicleType'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.lpnBefore'),
                ruleProp: 'lpnFront'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'lpnFront'
              },
              {
                type: 'label',
                value: this.$t('vicenter.inspection.common.lpnBack'),
                ruleProp: 'lpnBackCsv'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'lpnBackCsv'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'checkinInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.declaration'),
                ruleProp: 'decNumCvs'
              },
              {
                colspan: 2,
                type: 'text',
                value: '',
                ruleProp: 'decNumCvs'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.container'),
                ruleProp: 'containerNumCsv'
              },
              {
                colspan: 2,
                type: 'text',
                value: '',
                ruleProp: 'containerNumCsv'
              }
            ]
          },
          {
            type: 'title',
            colspan: 6,
            infoType: 'imageCheckInfo',
            label: this.$t('vicenter.supervise.taskInspection.conclusionOfdrawing')
          },
          {
            type: 'content',
            infoType: 'imageCheckInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.conclusionOfdrawing'),
                ruleProp: 'conclusion'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'conclusion'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.contrabandLocation'),
                ruleProp: 'contrabandLocation'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'contrabandLocation'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.contrabandType'),
                ruleProp: 'contrabandType'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'contrabandType'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'imageCheckInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.rapporteur'),
                ruleProp: 'operatorAccount'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'operatorAccount'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.drawingTime'),
                ruleProp: 'time'
              },
              {
                type: 'timeRange',
                value: '',
                ruleProp: 'time'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
                ruleProp: 'remark'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'remark'
              }
            ]
          },
          {
            type: 'title',
            colspan: 6,
            infoType: 'secondImageCheckInfo',
            label: this.$t('vicenter.inspection.common.recheckConclution')
          },
          {
            type: 'content',
            infoType: 'secondImageCheckInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.inspection.common.recheckConclution'),
                ruleProp: 'conclusion'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'conclusion'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.contrabandLocation'),
                ruleProp: 'contrabandLocation'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'contrabandLocation'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.contrabandType'),
                ruleProp: 'contrabandType'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'contrabandType'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'secondImageCheckInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.inspection.common.recheckInspector'),
                ruleProp: 'operatorAccount'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'operatorAccount'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.recheckTime'),
                ruleProp: 'time'
              },
              {
                type: 'timeRange',
                value: '',
                ruleProp: 'time'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
                ruleProp: 'remark'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'remark'
              }
            ]
          },
          {
            type: 'title',
            colspan: 6,
            infoType: 'manualCheckInfo',
            label: this.$t('vicenter.supervise.taskInspectionDetail.handExaminationconclusion')
          },
          {
            type: 'content',
            infoType: 'manualCheckInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.handExaminationconclusion'),
                ruleProp: 'conclusion'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'conclusion'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.common.physicalContrabandLocation'),
                ruleProp: 'contrabandLocation'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'contrabandLocation'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.seizedGoods'),
                ruleProp: 'contrabandTypeAll'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'contrabandTypeAll'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'manualCheckInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.handInspector'),
                ruleProp: 'operatorAccount'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'operatorAccount'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.handInspectiontime'),
                ruleProp: 'time'
              },
              {
                type: 'timeRange',
                value: '',
                ruleProp: 'time'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
                ruleProp: 'remark'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'remark'
              }
            ]
          }
        ]
      },
      findImgModal: {
        title: this.$t('vicenter.common.FindImage'),
        flag: false,
        width: '90%',
        top: '50px',
        resetModal: this.closeFindImgModal
      },
      currentImgData: {}, // 当前任务的lastScanImage、scanSerialNumber、siteName、hsCodes
      searchImgByImgData: '', // 保存ilSearchImageByImageReturnData字段(json字符串)
      showSwiper: true,
      uploadImg: {
        option: {
          propId: 'upload',
          multiple: true,
          data: {},
          action: 'inspection/manualcheck/addfiles',
          fileList: [],
          previewList: [],
          stop: false,
          imgSize: {
            width: '178px',
            height: '178px'
          },
          handleSuccess: this.handleUploadSuccess,
          beforeUpload: this.handleBeforeUpload,
          preview: {
            name: 'attachFile',
            propId: 'Resattachment',
            width: '100%',
            height: '150px',
            slidesPerView: 2,
            spaceBetween: 20,
            deleteFlag: true,
            navigate: {
              position: 'outside',
              type: 'shadow'
            }
          },
          accept: '.jpg,.jpeg,.tif,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP,.avi,.rmvb,.rm,.mpg,.mpeg,.wmv,.mp4,.mp3,.wav,.ogg,.wma,.txt,.pdf,.xls,.doc,.docx,.xlsx',
          specialcharaPrompt: false
        }
      },
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
          title: this.$t('vicenter.inspection.common.physicalDetailForm')
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
        physicalBox: {
          title: this.$t('vicenter.inspection.common.physicalConclusion')
        },
        video: {
          title: this.$t('vicenter.inspection.common.video')
        }
      },
      XRayImageID: 'xRayImage',
      imgCheckData: {
        data: [],
        sortMethod: ''
      },
      imgCheckGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.inspection.common.imgConclusion'),
          type: 'text',
          model: 'conclusion'
        },
        {
          label: this.$t('vicenter.inspection.common.contrabandLocation'),
          type: 'text',
          model: 'contrabandLocation'
        },
        {
          label: this.$t('vicenter.inspection.common.contrabandType'),
          type: 'text',
          model: 'contrabandType'
        },
        {
          label: this.$t('vicenter.inspection.common.conclusionType'),
          type: 'text',
          model: 'taskLink'
        },
        {
          label: this.$t('vicenter.inspection.common.remarks'),
          type: 'text',
          model: 'remark'
        }
      ],
      inputItem: [
        {
          getLabel: this.$t('vicenter.inspection.common.physicalConclusion'),
          type: 'radio',
          placeHolder: '',
          models: '',
          ruleProp: 'conclusion',
          change: this.changeRadio,
          option: []
        },
        {
          getLabel: this.$t('vicenter.inspection.common.physicalContrabandLocation'),
          type: 'select2',
          uncollapse: true, // 不折叠多选tag
          placeHolder: this.$t('vicenter.common.pleaseSelcet'),
          models: '',
          ruleProp: 'contrabandLocation',
          clearable: true, // 可清除
          disabled: true,
          option: [],
          change: this.changeLocation
        },
        // {
        //   getLabel: this.$t('vicenter.inspection.common.physicalContrabandType'),
        //   type: 'select2',
        //   placeHolder: this.$t('vicenter.common.pleaseSelcet'),
        //   models: '',
        //   ruleProp: 'contrabandType',
        //   clearable: true, // 可清除
        //   disabled: true,
        //   option: [],
        //   change: this.changeType
        // },
        {
          getLabel: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsInfo'),
          type: 'table',
          isHide: true,
          disabled: true,
          models: '',
          ruleProp: 'seizedList',
          isRequired: true,
          tableData: {
            data: [],
            isBorder: true,
            isStripe: true,
            isPage: false,
            sortMethod: this.getSort
          },
          tableGroup: [
            {
              label: this.$t('vicenter.ImageLibrary.common.seizedGoods'),
              type: 'text',
              model: 'seizedTypeVal',
              width: ''
            },
            {
              label: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsNum'),
              type: 'text',
              model: 'seizedQty',
              width: ''
            },
            {
              label: this.$t('vicenter.ImageLibrary.imageManagement.unit'),
              type: 'text',
              model: 'seizedUnitVal',
              width: ''
            },
            {
              label: this.$t('vicenter.common.operation'),
              type: 'operation',
              model: 'operation',
              width: '',
              fixed: 'right'
            }
          ],
          func: this.showAddSeizedGoodsModal,
          funcText: this.$t('vicenter.common.add'),
          customClass: 'areaClass'
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
        seizedList: [
          { required: true, message: this.$t('vicenter.inspection.common.selectPhysicalContrabandType'), trigger: 'blur' }
        ],
        contrabandLocation: [
          { required: true, message: this.$t('vicenter.inspection.common.selectPhysicalContrabandLocation'), trigger: 'blur' }
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
          contrabandLocation: '',
          contrabandTypeJsonStr: '',
          remark: '',
          listFUrl: ''
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
        data: []
      },
      carNumAttach: { // 车牌号附件
        option: { // 其他附件
          propId: 'carNumAttach'
        },
        data: []
      },
      containAttach: { // 集装箱附件
        option: { // 其他附件
          propId: 'containAttach'
        },
        data: []
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
      scanningImgFiles: [],
      isUff: false,
      scanImagePath: '',
      openViprobeFlag: false,
      viprobeData: {
        suspected: 'MC001',
        noSuspected: 'MC002',
        timeout: 10,
        markFilePath: ''
      },
      addSeizedGoodsModalData: {
        title: this.$t('vicenter.ImageLibrary.imageManagement.addSeizedGoodsInfo'),
        flag: false,
        resetModal: this.closeAddModal,
        customClass: 'addSeizedGoodsModal',
        width: '600px'
      },
      addSeizedGoodsData: {
        inputItem: [
          {
            getLabel: this.$t('vicenter.ImageLibrary.common.seizedGoods'),
            placeHolder: this.$t('vicenter.ImageLibrary.common.selectSeizedGoods'),
            type: 'select',
            models: '',
            ruleProp: 'seizedType',
            clearable: true,
            option: [],
            change: this.changeSeizedType
          },
          {
            getLabel: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsNum'),
            placeHolder: this.$t('vicenter.ImageLibrary.imageManagement.enterSeizedGoodsNum'),
            type: 'text',
            models: '',
            ruleProp: 'seizedQty'
          },
          {
            getLabel: this.$t('vicenter.ImageLibrary.imageManagement.unit'),
            placeHolder: this.$t('vicenter.ImageLibrary.imageManagement.checkUnit'),
            type: 'select',
            models: '',
            ruleProp: 'seizedUnit',
            clearable: true,
            option: [],
            change: this.changeSeizedUnit
          }
        ],
        queryFn: {
          query: this.queryNull
        },
        formRule: {
          refName: 'addSeizedGoodsForm',
          rule: {
            seizedType: [ // 查获物品校验
              { required: true, message: this.$t('vicenter.ImageLibrary.common.selectSeizedGoods'), trigger: 'blur' }
            ],
            seizedQty: [ // 查获数量校验
              { required: true, message: this.$t('vicenter.ImageLibrary.imageManagement.enterSeizedGoodsNum'), trigger: 'blur' },
              // { pattern: /^[0-9]+$/, message: this.$t('vicenter.common.verifyRules.onlyD'), trigger: 'blur' }
              {pattern: /^((([1-9][0-9]*|0)[.][0-9]{1,2})|[1-9][0-9]*|0)$/, message: this.$t('vicenter.common.verifyRules.onlyDUpDecimal', {msg: 2})},
              {validator: seizedQtyMax, trigger: 'blur'}
              // {pattern: /^((([1-9][0-9]{0,8}|0)[.][0-9]{1,2})|[1-9][0-9]{0,9}|0)$/, message: this.$t('vicenter.common.verifyRules.seizedQty', {msg: 2})}
            ],
            seizedUnit: [ // 查获物单位校验
              { required: true, message: this.$t('vicenter.ImageLibrary.imageManagement.checkUnit'), trigger: 'blur' }
            ]
          },
          model: {
            seizedType: '',
            seizedQty: '',
            seizedUnit: ''
          }
        }
      },
      seizedList: [] // 查获物品信息
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    let id = JSON.parse(sessionStorage.getItem('detailId'))
    this.id = id
    this.uploadImg.option.data = {id: id}
    this.getDetail()
    this.$getDataByTypecode(['MANUAL_CHECK_CONC', 'CONTRABAND_TYPE', 'CONTRABAND_LOCATION'], ['conclusion', 'contrabandType', 'contrabandLocation'], this.inputItem)
    this.$getDataByTypecode(['CONTRABAND_TYPE', 'CONTRABAND_LOCATION', 'PACKAGE_TYPE', 'SEIZED_UNIT'], ['seizedType', 'contrabandLocation', 'packageType', 'seizedUnit'], this.addSeizedGoodsData.inputItem)
    // this.inputItem[0].models = this.viprobeData.noSuspected
    window.viprobeReturn = {
      getMarkBase64Success: null,
      markBase64: null,
      errorCode: 0,
      uploadImageAnalysisSuccess: null,
      imageInViProbeBase64: null
    }
    window.viprobeUtilReturn.errorCode = null
    window.viprobeUtilReturn.reconnectToViProbeFailed = null
  },
  methods: {
    handlePrint () {
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$refs.printTableRef.handleExport()
    },
    // 显示查获物模态框
    showAddSeizedGoodsModal () {
      this.addSeizedGoodsModalData.flag = true
    },
    // 删除查获物
    deleteSeizedGoodsInfo (scope) {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        let tempArr = []
        this.inputItem.forEach(item => {
          if (item.ruleProp === 'seizedList') {
            item.tableData.data.forEach(e => {
              if (e.id !== scope.row.id) {
                tempArr.push(e)
              }
            })
            item.tableData.data = tempArr
            item.models = tempArr
            this.seizedList = item.tableData.data
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
          }
        })
      })
    },
    // 添加查获物
    handleAddSeizedGoods () {
      this.$refs['addSeizedGoodsModal'].$refs[this.addSeizedGoodsData.formRule.refName].validate((valid) => {
        if (valid) {
          let { seizedType, seizedQty, seizedUnit } = this.addSeizedGoodsData.formRule.model
          this.inputItem.forEach(e => {
            if (e.ruleProp === 'seizedList') {
              e.tableData.data.push({
                id: new Date().getTime(),
                seizedTypeVal: this.$t(`vicenter.DIC.T_CONTRABAND_TYPE.C_${seizedType}`),
                seizedType: seizedType,
                seizedQty: seizedQty,
                seizedUnitVal: this.$t(`vicenter.DIC.T_SEIZED_UNIT.C_${seizedUnit}`),
                seizedUnit: seizedUnit,
                operation: [
                  {
                    func: this.deleteSeizedGoodsInfo,
                    label: `<span class='iconfont editTable'>&#xe658;</span>`,
                    title: this.$t('vicenter.common.delete'),
                    show: true
                  }
                ]
              })
              e.models = e.tableData.data
              this.seizedList = e.tableData.data
            }
          })
          this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
          this.closeAddModal()
        }
      })
    },
    // 关闭查获物模态框
    closeAddModal () {
      this.addSeizedGoodsData.inputItem.forEach(e => {
        e.models = ''
      })
      this.addSeizedGoodsModalData.flag = false
      this.$refs['addSeizedGoodsModal'].$refs[this.addSeizedGoodsData.formRule.refName].resetFields()
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
      this.$changeSelectValidateField('manualCheck', this, 'contrabandLocation')
    },
    changeType () {
      this.$changeSelectValidateField('manualCheck', this, 'contrabandType')
    },
    getDetail () {
      if (this.id === -1) {
        this.$NotifPrompt(this.$t('vicenter.inspection.common.dataError'))
      } else {
        ajax.getDetail({id: this.id}).then(res => {
          if (res.data.flag) {
            let { taskObject, taskDecObjects, taskTargetObjects, taskAttachementObjects, imgCheckObjects } = res.data.result
            Object.assign(this.currentImgData, res.data.result)
            this.searchImgByImgData = taskObject.ilSearchImageByImageData
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
            // 审图结论
            this.$initCheckObject(this.$data, imgCheckObjects)
            // 解决页面初始化图片展示变形的问题
            this.showFlag = true
            this.viprobeData.markFilePath = taskObject.markFilePath
            // this.openViprobe()
            // 打印信息处理
            this.printTable.imgUrl = taskObject.lastScanImage
            this.$getPrintInfo(this, taskObject, 'checkinInfo')
            if (imgCheckObjects && imgCheckObjects.length > 0) {
              imgCheckObjects.forEach(item => {
                if (item.taskLink.indexOf('SECOND_IMAGE_CHECK') > -1) {
                  this.$getPrintInfo(this, item, 'secondImageCheckInfo')
                } else {
                  this.$getPrintInfo(this, item, 'imageCheckInfo')
                }
              })
            }
            if (manualCheckObject) {
              if (manualCheckObject.seizedObjects && manualCheckObject.seizedObjects) {
                let arr = []
                manualCheckObject.seizedObjects.forEach(item => {
                  arr.push(this.$t(item.seizedType) + '(' + item.seizedQty + this.$t(item.seizedUnit) + ')')
                })
                manualCheckObject.contrabandTypeAll = arr.join(', ')
              } else {
                manualCheckObject.contrabandTypeAll = ''
              }
              this.$getPrintInfo(this, manualCheckObject, 'manualCheckInfo')
            }
          } else {
            this.getBack()
          }
        }).catch(() => {})
      }
    },
    resetDeleteAttach () {
      let delFUrls = []
      if (this.uploadImg.option.previewList.length > 0) {
        this.uploadImg.option.previewList.forEach((e, index) => {
          delFUrls.push(e.src)
        })
        ajax.delAttach({delFUrls: delFUrls}).then((res) => {
          if (res.data.flag) {
            this.showSwiper = false
            this.uploadImg.option.previewList = []
          }
          this.$nextTick(() => {
            this.showSwiper = true
          })
        }).catch(() => {
          this.$nextTick(() => {
            this.showSwiper = true
          })
        })
        this.uploadImg.option.previewList = []
      }
    },
    deleteAttach (item) {
      this.$ConfirmBox(this.$t('vicenter.common.uploadPreview.confirmTip'), () => {
        let src = item.src
        // this.showSwiper = false
        console.log(src)
        this.uploadImg.option.previewList.forEach((e, index) => {
          if (e.src === src) {
            ajax.delAttach({ delFUrls: [src] }).then((res) => {
              if (res.data.flag) {
                this.showSwiper = false
                this.uploadImg.option.previewList.splice(index, 1)
              }
              this.$nextTick(() => {
                this.showSwiper = true
              })
            }).catch(() => {
              this.$nextTick(() => {
                this.showSwiper = true
              })
            })
            // this.uploadImg.option.previewList.splice(index, 1)
          }
        })
      })
    },
    /**
     * 提交任务方法
     */
    submitTask () {
      this.$refs['manualCheck'].$refs[this.formRule.refName].validate((valid) => {
        if (valid) {
          let data = {}
          data = this.formRule.model
          data.id = this.id
          let list = []
          this.uploadImg.option.previewList.forEach(e => {
            list.push(e.relativeUrl)
          })
          data.listFUrl = list
          if (data.contrabandLocation) {
            data.contrabandLocation = data.contrabandLocation.join(',')
          }
          let seizedList = []
          this.seizedList.forEach(e => {
            let {seizedType, seizedQty, seizedUnit} = e
            seizedList.push(
              {
                seizedType: seizedType,
                seizedQty: seizedQty,
                seizedUnit: seizedUnit
              }
            )
          })
          data.contrabandTypeJsonStr = ''
          if (seizedList.length > 0) {
            data.contrabandTypeJsonStr = JSON.stringify(seizedList)
          }
          delete data.seizedList
          this.$ConfirmBox(this.$t('vicenter.inspection.common.submitTask'), () => {
            ajax.submitTask(data).then(res => {
              if (res.data.flag) {
                this.uploadImg.option.previewList = []
                this.$NotifSuccess(this.$t('vicenter.common.submitSuccess'))
                this.$router.push({ path: '/Inspection/Physical-Inspection' })
              }
            }).catch(() => {})
          })
        }
      })
    },
    /**
    放弃任务的方法
     */
    quitTask () {
      this.$ConfirmBox(this.$t('vicenter.inspection.common.quitTask'), () => {
        let data = {}
        data.id = this.id
        ajax.quitTask(data).then(res => {
          if (res.data.flag) {
            this.$router.push({ path: '/Inspection/Physical-Inspection' })
          }
        }).catch(() => {})
      })
    },
    openViprobe () {
      var name = this.scanningImgName// 图像 流水号
      var path = this.scanImagePath// 到文件夹级别
      var imageFiles = this.scanningImgFiles// 放入所有的img文件
      imageFiles = this.$data.scanningImgFiles
      var isUff = this.isUff
      var markFilePath = this.scanImagePath + 'suspects_json.mark'
      var stepFilePath = this.scanImagePath + 'history.steps'
      let params = {
        paths: `${markFilePath},${stepFilePath}`
      }
      insCommonAjax.getFullSignPath(params).then((res) => {
        if (res.data.flag) {
          res.data.result.forEach(e => {
            if (e.indexOf('suspects_json.mark') !== -1) {
              markFilePath = e
            } else if (e.indexOf('history.steps') !== -1) {
              stepFilePath = e
            }
          })
        }
        viProbe.openImageAndAnalysisInfoInViProbe(name, path, imageFiles, markFilePath, stepFilePath, null, isUff)
        if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
          this.openViprobeFlag = true
        } else {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
        }
      })
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
      this.$checkChangeRadio(this, 'manualCheck', 'manual')
    },
    querynull () {
      return false
    },
    getBack () {
      this.resetDeleteAttach()
      this.$router.push({ path: '/Inspection/Physical-Inspection' })
    },
    LookImg () {
      var viewer = new Viewer(document.getElementById(this.XRayImageID))
      viewer.view()
    },
    handleBeforeUpload (file) {
      this.uploadImg.option.stop = false
      if (this.$checkFileNameIfSpecialCharacter(file.name)) {
        this.$refs.uploadAttr.option.stop = true
        if (!this.uploadImg.option.specialcharaPrompt) {
          this.$NotifError(this.$t('vicenter.common.existSpecialCharacter'))
          this.uploadImg.option.specialcharaPrompt = true
        }
        this.uploading = false
        return false
      }
      if (file.name) {
        let existFlag = false
        this.uploadImg.option.previewList.forEach(e => {
          let index = e.relativeUrl.lastIndexOf('/') + 1
          let existName = e.relativeUrl.substring(index, e.relativeUrl.length)
          if (file.name === existName) {
            this.$refs.uploadAttr.option.stop = true
            this.$NotifError(this.$t('vicenter.common.uploadPreview.nameRepeat'))
            existFlag = true
            this.uploading = false
            return false
          }
        })
        if (existFlag) {
          return
        }
      }
      if (this.uploadImg.option.accept.indexOf(file.type.split('/')[1]) !== -1) {
        this.uploading = true
        this.fileNum++
      }
    },
    handleUploadSuccess (response, file, fileList) {
      this.showSwiper = false
      if (response.flag) {
        this.fileNum--
        this.$NotifSuccess(this.$t('vicenter.supervise.taskInspectionDetail.uploadSuccess'))
        response.result.forEach(e => {
          let type = e.relativeUrl.substring(e.relativeUrl.lastIndexOf('.') + 1)
          type = this.$options.filters['attachType'](type)
          this.uploadImg.option.previewList.push({
            type: type,
            src: e.signUrl,
            relativeUrl: e.relativeUrl
          })
        })
        console.log(this.uploadImg.option.previewList)
        if (this.fileNum === 0) {
          this.uploading = false
        }
        this.$nextTick(() => {
          this.showSwiper = true
        })
      } else {
        this.uploading = false
        this.$NotifError(this.$t('vicenter.supervise.taskInspectionDetail.uploadFailure'))
        this.$nextTick(() => {
          this.showSwiper = true
        })
      }
    }
  },
  beforeDestroy () {
    if (this.openViprobeFlag && viprobeUtilReturn.reconnectToViProbeFailed === false) {
      this.closeViprobe()
    }
    this.resetDeleteAttach()
  },
  components: {breadCrumb, panelTitle, ComTable, ComForm, Cswiper, doubleSwipe, insTitle, asycuda, detailList, upload, Dialog, TabList, DocInfo}
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.physical-analysis-detail-bar {
  @extend .extend-bar;
  .physical-analysis-detail-M{
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
      .listBox{
        width: 70%;
      }
      .ImgAnyCon{
        height: 300px;
      }
      .physicalBox{
        width: calc(30% - 20px);
        margin-left: 16px;
        margin-top: -150px;
        .attach_label{
          font-weight: bold;
          float: left;
          padding: 5px 10px;
          font-size: 14px;
        }
        .uploadBox{
          width: $all;
          display: block;
          .swiperPreview{
            width: 80%
          }
          .uploadButton{
            width: 50%;
            text-align: center;
            ul{
              display: none;
            }
          }
          .swiper-slide-file{
            display: -webkit-box;
            img{
              height: 70px,
            }
          }
        }
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
            min-height: 400px!important;
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
    .areaClass {
      // position: absolute;
      // top: 32px;
      // left: 0;
    }
    .docInfoHeight {
      height: 425px;
      padding: 1px;
      @include box-sizing();
    }
  }
}
.addSeizedGoodsModal {
  .el-dialog__body {
    padding: 10px 20px 30px;
    .search-form-item {
      margin-bottom: $dis10;
      .search-form-label {
        text-align: left;
      }
      .el-input__inner {
        height: 35px;
      }
    }
    .search-form-btn {
      display: none;
    }
  }
  .addSeizedGoodsBtnClass {
    padding-top: 5px;
    text-align: right;
  }
}
</style>
