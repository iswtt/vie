<template>
  <div class='History-detail-bar' v-bar>
    <div class='History-detail-M'>
     <div class="up-down-container">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 详情内容 -->
        <div class="up-down-infolist">
          <div class="up-down-panel">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
              <div class="number-title">
                  <span data-id="taskNo-span" class="list-title">{{$t('vicenter.inspection.common.taskNo')}}：{{taskNo}} </span>
              </div>
              <el-button v-if="printButton" data-id="print-btn" @click="handlePrint" type="primary" size="mini" >{{$t('vicenter.common.print')}}</el-button>
              <el-button v-if="exportButton" data-id="export-btn" @click="handleExport" type="primary" size="mini" >{{$t('vicenter.common.export', {msg: ''})}}</el-button>
              <!-- <el-button type="primary" size="mini" @click='openPrint'>{{$t('vicenter.common.print')}}</el-button> -->
              <!-- <el-button class="findImg" type="primary" size="mini" @click='showFindImgDialog'>{{$t('vicenter.common.FindImage')}}</el-button> -->
              <el-button data-id="goBack-btn" type="white" size="mini" @click='getBack()'>{{$t('vicenter.common.back')}}</el-button>
            </panelTitle>
            <timeSteps :title='title.timeline' v-if='stepsFlag' :steps='steps'></timeSteps>
            <div class="image-info-box">
              <div class="checkin border">
                <panelTitle :panelTitleInit="title.InspectionInformation"></panelTitle>
                <div class="baseInfo">
                  <div class="InspectionInfo">
                    <detailList :listData="baseInfo" :widthStyle="detailListWidth" :listRule="detailListRefName.baseInfo"></detailList>
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
                        <img data-id="XRayImage-img" :id="XRayImageID" @click="LookImg" :src="thisImgdata.imgSrc"/>
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
                        <doubleSwipe data-id="otherAttach-doubleSwipe" :optionsRight='otherAttach.option' :listData='otherAttach.data' ></doubleSwipe>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.carNum"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe data-id="carNumAttach-doubleSwipe" :optionsRight='carNumAttach.option' :listData='carNumAttach.data' ></doubleSwipe>
                      </div>
                    </div>
                    <div class="border imgBox">
                      <panelTitle :panelTitleInit="title.container"></panelTitle>
                      <div class = "attachment" v-if="showFlag">
                        <doubleSwipe data-id="containerAttach-doubleSwipe" :optionsRight='containAttach.option' :listData='containAttach.data' ></doubleSwipe>
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
              <div class="border physicalBox">
                <panelTitle :panelTitleInit="title.physicalBox"></panelTitle>
                <!-- <ComTable :tableData='physicalData' :tableGroup='physicalGroup'></ComTable> -->
                <detailList :listData="resultInfo.physicalResult" :widthStyle="allWidth" :listRule="detailListRefName.physicalResult"></detailList>
                <div v-if='uploadImg.option.previewList.length>0' class="physicalData">
                     <div class="list-title">{{$t('vicenter.common.enclosure')}}</div>
                      <div class="uploadBox">
                        <div v-if="showSwiper && uploadImg.option.previewList.length>0" class="swiperPreview">
                          <Cswiper :propOption='uploadImg.option.preview' :listData='uploadImg.option.previewList'></Cswiper>
                        </div>
                      </div>
                </div>
              </div>
              </el-col>
            </div>
          </div>
        </div>
        <el-dialog :visible.sync="printFlag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag'>
              <el-button type="primary" size="mini" @click="printDom">{{$t('vicenter.common.print')}}</el-button>
              <el-button type="white" size="mini" @click='printFlag = false'>{{$t('vicenter.common.back')}}</el-button>
              <br>
          <div class="printTable" ref="print" id="printDom">
             <div style="text-align: center;font-size: 28px">
               {{this.$t('vicenter.inspection.history.printTitle')}}
             </div>
             <br>
             <div style="text-align: center">
              <table style="margin: 0 auto;text-align: left" border="1" cellspacing="0" >
                <tr >
                  <td>{{printData.taskNo.label}}</td>
                  <td>{{taskNo}}</td>
                  <td>{{printData.siteName.label}}</td>
                  <td colspan="3">{{printData.siteName.value}}</td>
                  <td>{{printData.lpnFront.label}}</td>
                  <td style="min-width: 50px">{{printData.lpnFront.value}}</td>
                </tr>
                <tr>
                  <td>{{printData.conclusion.label}}</td>
                  <td>{{printData.conclusion.value}}</td>
                  <td colspan="3">{{printData.contrabandType.label}}</td>
                  <td colspan="4">{{printData.contrabandType.value}}</td>
                </tr>
                <tr>
                  <td>{{printData.remark.label}}</td>
                  <td colspan="7">{{printData.remark.value}}</td>
                </tr>
                <tr>
                  <td>{{printData.sequence.label}}</td>
                  <td colspan="7">{{printData.sequence.value}}</td>
                </tr>
                <template v-for='(item,index) in tempDecArr'>
                  <tr :key = index>
                    <td :rowspan="item.row + 1">{{printData.decNum.label}}</td>
                    <td :rowspan="item.row + 1">{{item.decNum}}</td>
                    <td>{{printData.stemSepNo.label}}</td>
                    <td>{{printData.hsCode.label}}</td>
                    <td>{{printData.stemSepNo.label}}</td>
                    <td>{{printData.hsCode.label}}</td>
                    <td>{{printData.stemSepNo.label}}</td>
                    <td>{{printData.hsCode.label}}</td>
                  </tr>
                  <tr v-for="(row,index2) in item.rowArr" :key = index2>
                    <td>{{item.dmsCusDecItemDto[row.one].stemSepNo}}</td>
                    <td>{{item.dmsCusDecItemDto[row.one].hsCode}}</td>
                    <td v-if="item.dmsCusDecItemDto.length > row.two">{{item.dmsCusDecItemDto[row.two].stemSepNo}}</td>
                    <td v-else></td>
                    <td v-if="item.dmsCusDecItemDto.length > row.two">{{item.dmsCusDecItemDto[row.two].hsCode}}</td>
                    <td v-else></td>
                    <td v-if="item.dmsCusDecItemDto.length > row.three">{{item.dmsCusDecItemDto[row.three].stemSepNo}}</td>
                    <td v-else></td>
                    <td v-if="item.dmsCusDecItemDto.length > row.three">{{item.dmsCusDecItemDto[row.three].hsCode}}</td>
                    <td v-else></td>
                  </tr>
                </template>
                <tr>
                  <td colspan="8">
                    <img style="min-height: 200px;max-height: 450px;width: 100%;margin: 0 auto" :src="printSrc">
                  </td>
                </tr>
                </table>
             </div>
             <br>
             <div style="text-align: center;">
               {{printData.printBy.label}}: {{printData.printBy.value}}
               <br>
               {{printData.printTime.label}}: {{printData.printTime.value}}
             </div>
        </div>
        </el-dialog>
        <Dialog :modalData="findImgModal">
          <TabList ref="TabList" :currentImgData="currentImgData" :searchImgByImgData="searchImgByImgData"></TabList>
        </Dialog>
     </div>
    </div>
    <printTable ref="printTableRef" :printTable="printTable"></printTable>
  </div>
</template>
<script>
import detailList from '@/components/detailList'
import breadCrumb from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import asycuda from '@/components/inspection/asycuda'
import timeSteps from '@/components/inspection/timeSteps'
import ComTable from '@/components/table'
import ComForm from '@/components/form'
import Cswiper from '@/components/swipe'
import upload from '@/components/uploadPreview'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import doubleSwipe from '@/components/detailSwipe'
import ajax from '@/api/reports/reports.js'
import insCommonAjax from '@/api/inspection/common.js'
import viProbe from '@/lib/viprobe/viProbeForIns.js'
import Dialog from '@/components/dialogCommon'
import TabList from '@/components/tabList'
import DocInfo from '@/components/documentInfomation'
export default {
  name: 'History-detail',
  data () {
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
      detailListRefName: {
        baseInfo: 'basicFormInfo',
        physicalResult: 'physicalResultFormInfo'
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
      stepsFlag: false,
      steps: [],
      tempDecArr: [],
      printSrc: '',
      printFlag: false,
      scanningImgName: '',
      scanImagePath: '',
      scanningImgFiles: [],
      isUff: false,
      openViprobeFlag: false,
      showFlag: false,
      showSwiper: true,
      uploadImg: {
        option: {
          propId: 'upload',
          multiple: true,
          data: {},
          action: 'supervise/tasksearch/addfiles',
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
            navigate: {
              position: 'outside',
              type: 'shadow'
            }
          }
        }
      },
      detailListWidth: {
        width: '33.33%'
      },
      dectableData: {
        refName: 'declarationInfoTable',
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
        refName: 'containerInfoTable',
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
      taskLink: '',
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
          title: this.$t(this.$route.name)
        }
      },
      title: {
        timeline: this.$t('vicenter.inspection.common.timeLine'),
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
          title: this.$t('vicenter.supervise.taskInspection.concManual')
        },
        video: {
          title: this.$t('vicenter.inspection.common.video')
        }
      },
      XRayImageID: 'xRayImage',
      imgCheckData: {
        refName: 'imgCheckInfoTable',
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
      resultInfo: {
        physicalResult: [
          {
            label: this.$t('vicenter.inspection.common.physicalConclusion'),
            value: '',
            ruleProp: 'conclusion'
          },
          {
            label: this.$t('vicenter.inspection.common.physicalContrabandLocation'),
            value: '',
            ruleProp: 'contrabandLocation'
          },
          {
            label: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsInfo'),
            type: 'table',
            value: '',
            ruleProp: 'seizedObjects',
            isHide: false,
            tableData: {
              data: [],
              isBorder: true,
              isStripe: true,
              isPage: false,
              refName: 'seizedObjectsTable',
              sortMethod: this.getSort
            },
            tableGroup: [
              {
                label: this.$t('vicenter.ImageLibrary.common.seizedGoods'),
                type: 'text',
                model: 'seizedType',
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
                model: 'seizedUnit',
                width: ''
              }
            ],
            customClass: 'areaClass'
          },
          {
            label: this.$t('vicenter.inspection.common.remarks'),
            value: '',
            ruleProp: 'remark'
          }
        ]
      },
      allWidth: {
        width: '100%'
      },
      queryFn: { // 页面表单查询方法
        query: this.querynull
      },
      formRule: {
        refName: 'queryForm',
        rule: {},
        model: {
          conclusion: '',
          contrabandType: '',
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
      viprobeData: {
        timeout: 10,
        markFilePath: ''
      },
      printData: {
        taskNo: {
          label: this.$t('vicenter.inspection.common.taskNo'),
          value: ''
        },
        siteName: {
          label: this.$t('vicenter.inspection.common.office'),
          value: ''
        },
        lpnFront: {
          label: this.$t('vicenter.inspection.common.LPN'),
          value: ''
        },
        sequence: {
          label: this.$t('vicenter.inspection.common.container'),
          value: ''
        },
        decNum: {
          label: this.$t('vicenter.inspection.common.declaration'),
          value: ['']
        },
        hsCode: {
          label: this.$t('vicenter.inspection.common.hsCode'),
          value: ['']
        },
        stemSepNo: {
          label: this.$t('vicenter.inspection.common.stemSepNo'),
          value: ['']
        },
        conclusion: {
          label: this.$t('vicenter.common.conclusion'),
          value: ''
        },
        contrabandType: {
          label: this.$t('vicenter.inspection.common.scanNonConformityCode'),
          value: ''
        },
        remark: {
          label: this.$t('vicenter.inspection.common.contents'),
          value: ''
        },
        printBy: {
          label: this.$t('vicenter.inspection.history.printBy'),
          value: ''
        },
        printTime: {
          label: this.$t('vicenter.inspection.history.printTime'),
          value: ''
        },
        arrMaxLength: 0,
        maxArr: []
      },
      taskMarks: null
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    let id = JSON.parse(sessionStorage.getItem('detailId'))
    this.id = id
    this.getDetail()
  },
  beforeDestroy () {
    if (this.openViprobeFlag && viprobeUtilReturn.reconnectToViProbeFailed === false) {
      this.closeViprobe()
    }
  },
  methods: {
    handlePrint () {
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$refs.printTableRef.handleExport()
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
    getDetail () {
      if (this.id === -1) {
        this.$NotifPrompt(this.$t('vicenter.inspection.common.dataError'))
      } else {
        ajax.getTaskDetail({id: this.id}).then(res => {
          if (res.data.flag) {
            let {taskObject, taskTimeLineObjects, taskDecObjects, taskTargetObjects, taskAttachementObjects, imgCheckObjects, manualCheckObject, taskMarks} = res.data.result
            Object.assign(this.currentImgData, res.data.result)
            this.searchImgByImgData = taskObject.ilSearchImageByImageData
            // 扫描流水号
            this.$data.taskNo = taskObject.scanSerialNumber
            // 时间轴
            this.$initTimeLineData(this.$data, taskTimeLineObjects)
            // 查验信息
            this.$initInspectionData(this.$data, taskObject)
            // 集装箱信息
            this.$initContainerData(this.$data, taskTargetObjects)
            // 报关单信息
            this.$initCusDecData(this.$data, taskDecObjects)
            // LPN、Container No图片
            this.$initImgData(this.$data, taskAttachementObjects)
            if (taskDecObjects != null) {
              // 打印报关单信息
              this.tempDecArr = taskDecObjects
            }
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
            // 手检结论
            this.$initManalCheckObj(this.resultInfo.physicalResult, manualCheckObject)
            // 解决页面初始化图片展示变形的问题
            this.showFlag = true
            this.viprobeData.markFilePath = taskObject.markFilePath
            this.taskMarks = taskMarks ? JSON.parse(taskMarks.replace(/'/g, '"')) : null
            // this.getPrintData(taskObject, imgCheckObjects)
            // this.openViprobe()
            if (taskObject.tamperedPosition) { // 篡改位置字段 1：中心,2：现场,3:中心、现场都改
              if (taskObject.tamperedPosition === '1' || taskObject.tamperedPosition === '2' || taskObject.tamperedPosition === '3') {
                this.$NotifPrompt(this.$t('vicenter.common.viprobe.tampered')) // 当前图像已经被篡改
              }
            }
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
          }
        }).catch(() => {})
      }
    },
    initImageAnalysisData (obj) {
      if (obj !== null) {
        this.inputItem.forEach(e => {
          e.models = obj[e.ruleProp]
        })
      }
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
        let _markFile = this.taskMarks || markFilePath
        viProbe.openImageAndAnalysisInfoInViProbe(name, path, imageFiles, _markFile, stepFilePath, null, isUff)
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
    querynull () {
      return false
    },
    getBack () {
      this.$router.push({ path: '/Reports/history' })
    },
    LookImg () {
      var viewer = new Viewer(document.getElementById(this.XRayImageID))
      viewer.view()
    },
    getPrintData (taskObject, imgCheckObjects) {
      this.printSrc = taskObject.lastScanImage // 打印图片
      let conStr = taskObject.containerNumCsv
      this.printData.sequence.value = conStr
      if (imgCheckObjects != null && imgCheckObjects.length > 0) {
        let length = imgCheckObjects.length
        this.printData.conclusion.value = this.$t(imgCheckObjects[length].conclusion)
        this.printData.contrabandType.value = this.$t(imgCheckObjects[length].contrabandType)
        this.printData.remark.value = imgCheckObjects[length].remark
      }
      this.printData.printBy.value = sessionStorage.userName
      this.tempDecArr.forEach(item => {
        let row = Math.ceil(item.dmsCusDecItemDto.length / 3)
        let rowArr = []
        for (let i = 0; i < row; i++) {
          let a = {
            'one': i,
            'two': i + row,
            'three': i + row + row
          }
          rowArr[i] = a
        }
        this.$set(item, 'rowArr', rowArr)
        this.$set(item, 'row', row)
      })
    },
    openPrint () {
      this.printData.printTime.value = this.$options.filters['formatDate'](new Date().getTime())
      this.printFlag = true
    },
    printDom () {
      Print({
        printable: 'printDom',
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*']
      })
    }
  },
  components: {breadCrumb, panelTitle, ComTable, ComForm, Cswiper, doubleSwipe, asycuda, detailList, upload, timeSteps, Dialog, TabList, DocInfo}
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.History-detail-bar {
  @extend .extend-bar;
  .History-detail-M{
    .steps{
      width: $all;
      @include flex(row, flex-start, flex-start);
      flex-wrap: wrap;
      margin-bottom: 10px;
      text-align: center;
      .el-steps--horizontal{
        width: $all
      }
      .noData {
        width: 100%;
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
      .listBox{
        width: 70%;
      }
      .ImgAnyCon{
        height: 350px;
      }
      .physicalBox{
        min-height: 493px;
        width: calc(30% - 20px);
        margin-left: 16px;
        margin-top: -109px;
        .attach_label{
          font-weight: bold;
          float: left;
          padding: 5px 10px;
          font-size: 14px;
        }
        .uploadBox{
          width: 90%;
          display: flex;
          .uploadButton{
            width: 50%;
            text-align: center;
            .el-upload__input{
              display: block;
            }
            ul{
              display: none;
            }
          }
          .swiperPreview{
            width: 70%
          }
          .swiper-slide-file{
            display: -webkit-box;
            img{
              height: 70px,
            }
          }
        }
      }
      .physicalData{
        width: 100%;
        text-align: left;
        margin: 10px 40px;
        .list-info {
          width: 100%;
          min-height: 25px;
          display: block;
        }
      }
      .flex{
        @include flex(row, flex-start, flex-start);
        flex-wrap: wrap;
        .panel {
          @extend .extend-panel;
          .search-form {
            @include layout(3);
          }
          border: 0px;
          margin-bottom: 0px;
        }
        .panel-Q {
          height: calc(100% - 50px);
          @extend .extend-panel-Q;
          margin-right: 0;
          padding: 10px 20px;
          width: $all;
          .el-form{
            min-height: 400px!important;
          }
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
    .docInfoHeight {
      height: 375px;
    }
  }
}
</style>
