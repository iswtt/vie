<template>
  <div class="Task-inspection-detail-bar">
    <div class="Task-inspection-detail-M up-down-container">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread"/>
      </div>
      <div class="Task-inspection-detail-info">
        <div class="up-down-infolist">
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane :label="title.basicInfo" name="first">
              <div class="basicInfo">
                <div style="height: 100%;" v-bar>
                  <div>
                    <div class="box">
                      <panelTitle :panelTitleInit="panelTitle.basicInfo.inspectionInformation"></panelTitle>
                      <detailList :listData="basicInfo.basic" :listRule="basicInfo.refName" :widthStyle="listWidth"></detailList>
                      <div class="conAndDeclist">
                        <div class="conList">
                          <p class="image-info-group">
                            <span class="list-title">{{panelTitle.basicInfo.containerList.title}}</span>
                          </p>
                          <ComTable :tableData='basicInfo.contableData' :tableGroup='basicInfo.contableGroup'></ComTable>
                        </div>
                        <div class="decList">
                          <p class="image-info-group">
                            <span class="list-title">{{panelTitle.basicInfo.decList.title}}</span>
                          </p>
                          <ComTable @dbclick="selectDecRow" :tableData='basicInfo.dectableData' :tableGroup='basicInfo.dectableGroup'></ComTable>
                        </div>
                      </div>
                    </div>
                    <div class="box docInfoHeight">
                      <DocInfo :infoData="docInfoData"></DocInfo>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="title.inspectionConclusion" name="second">
              <div class="contBox">
                <div style="height: 100%;" v-bar>
                  <div>
                    <div class="inspectionConclusionImg">
                      <div v-if="resultInfo.imgSrc != null && resultInfo.imgSrc !== ''" class="viprobe-button">
                        <img id='lastScanImg' :src="resultInfo.imgSrc" @click="LookImg">
                        <el-button v-if='supViporbeButton' class="openBtn" @click="openViprobe" type="primary" size="mini" data-id="openViprobe-btn" >Viprobe</el-button>
                      </div>
                      <img v-else :src="defaultImg" style="height: 100%;"/>
                    </div>
                    <div v-if='activeName === "second"' class="result">
                      <div class="box">
                        <panelTitle :panelTitleInit="panelTitle.result.imageResult"></panelTitle>
                        <!-- <detailList :listData="resultInfo.imageResult" :widthStyle="allWidth" :listRule="resultInfo.refName"></detailList> -->
                        <ComTable :tableData='imageCheckTableData' :tableGroup='imageCheckTableGroup'></ComTable>
                      </div>
                      <div class="box center">
                        <panelTitle :panelTitleInit="panelTitle.result.physicalResult"></panelTitle>
                        <ComTable :tableData='physicalTableData' :tableGroup='physicalTableGroup'></ComTable>
                        <detailList :listData="resultInfo.physicalResult" :widthStyle="allWidth" :listRule="resultInfo.refNamePhy"></detailList>
                        <span v-if="resultInfo.physicalResultAttach.flag" class="list-title attach-title">{{panelTitle.result.attachment.title}}</span>
                        <Cswiper v-if="resultInfo.physicalResultAttach.flag" :propOption='options.attachment' :listData='resultInfo.physicalResultAttach.data' data-id="physicalAttach-cswiper"></Cswiper>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="title.taskTotal" name="third">
              <div v-if='activeName === "third"' class="contBox">
                <div style="height: 100%;" v-bar>
                  <timeLine :timeLineData="taskTotal.data" data-id="task-timeLine"></timeLine>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="title.checkConclusion" name="forth">
              <div v-if='activeName === "forth"' class="checkResult contBox">
                <div style="height: 100%;" v-bar>
                  <div>
                    <div v-if="reviewFlag" class="review"  v-loading="uploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
                      <ComForm ref="modalForm" :searchIpt="checkResultForm.inputItem" :searchFunc="checkResultForm.queryFn" :formRule='checkResultForm.formRule' :fromClass="checkResultForm.formClass"></ComForm>
                      <p>{{$t('vicenter.supervise.taskInspectionDetail.enclosure')}}</p>
                      <div class="uploadBox">
                        <div v-if="showSwiper && uploadImg.option.previewList.length>0" class="swiperPreview">
                          <Cswiper @deleteAttach="deleteAttach" :propOption='uploadImg.option.preview' :listData='uploadImg.option.previewList' data-id="checkResult-cswiper"></Cswiper>
                        </div>
                        <div class="uploadButton">
                          <upload ref='uploadAttr' :propOption='uploadImg.option' data-id="checkResult-upload"></upload>
                        </div>
                      </div>
                      <!-- <div class="resultbutton">
                        <el-button :disabled="isSaving" @click="saveRecheck" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
                        <el-button @click="resetRecheck" type="white" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
                      </div> -->
                    </div>
                    <div v-if="!reviewFlag" class="review">
                      <ComForm :searchIpt="checkDetail.data" :searchFunc="checkResultForm.queryFn" :formRule='checkDetail.formRule' :fromClass="checkResultForm.formClass"></ComForm>
                      <p v-if="checkDetail.listRecheckAttrFlag">{{$t('vicenter.supervise.taskInspectionDetail.enclosure')}}</p>
                      <Cswiper v-if="checkDetail.listRecheckAttrFlag" :propOption='checkDetail.option' :listData='checkDetail.listRecheckAttr' data-id="checkDetail-cswiper"></Cswiper>
                    </div>
                    <!-- <div class="box">
                      <panelTitle :panelTitleInit="panelTitle.checkResult.checkHistory"></panelTitle>
                      <div class="form-bar" v-bar style="width: 100%;">
                        <ComTable :tableData='checkResult.tableData' :tableGroup='checkResult.tableGroup'></ComTable>
                      </div>
                    </div>
                    <el-dialog :title="checkDetail.title" :visible.sync="checkDetail.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag'>
                      <div class="checkDetail">
                        <ComForm :searchIpt="checkDetail.data" :searchFunc="checkResultForm.queryFn" :formRule='checkDetail.formRule' :fromClass="checkResultForm.formClass"></ComForm>
                        <p v-if="checkDetail.listRecheckAttrFlag">{{$t('vicenter.supervise.taskInspectionDetail.enclosure')}}</p>
                        <Cswiper v-if="checkDetail.listRecheckAttrFlag" :propOption='options.attachment' :listData='checkDetail.listRecheckAttr'></Cswiper>
                      </div>
                    </el-dialog> -->
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="operateBox">
            <div class="number-title">
              <span class="list-title" data-id="taskNo-span">{{$t('vicenter.supervise.taskInspection.taskID')}}：{{taskNo}} </span>
            </div>
            <el-button v-if="!reviewFlag && printButton" data-id="print-btn" @click="handlePrint" type="primary" size="mini" >{{$t('vicenter.common.print')}}</el-button>
            <el-button v-if="!reviewFlag && exportButton" data-id="export-btn" @click="handleExport" type="primary" size="mini" >{{$t('vicenter.common.export', {msg: ''})}}</el-button>
            <el-button v-if="reviewFlag && imageLibraryEnable && showAIResult" class="AIResult" type="primary" size="mini" @click='showAIResultModal' data-id="AIResult-btn">
              {{$t('vicenter.common.AIResult')}}
              <span v-if="AIResultData.jsonData && $isJsonString(AIResultData.jsonData)" class="mark" :class="{mark_red:AIResultData.conclusion!=='NO_SUSPECT',mark_green:AIResultData.conclusion==='NO_SUSPECT'}" data-id="AIResult-span"></span>
            </el-button>
            <el-button class="addImg" type="primary" size="mini" @click='showAddModal' data-id="addImage-btn">{{$t('vicenter.common.AddImage')}}</el-button>
            <el-button v-if="reviewFlag" class="findImg" type="primary" size="mini" @click='showFindImgDialog' data-id="findImage-btn">{{$t('vicenter.common.FindImage')}}</el-button>
            <el-button v-if="showSaveBtn" :disabled="isSaving" @click="saveRecheck" type="primary" size="mini" data-id="save-btn">{{$t('vicenter.common.save')}}</el-button>
            <el-button class="goBack" type="white" size="mini" @click='goBack' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
          </div>
        </div>
      </div>
      <Dialog :modalData="decQueryModal">
        <DecQuery ref="DecQuery" :declarationNo="declarationNo"></DecQuery>
      </Dialog>
      <Dialog :modalData="findImgModal">
        <TabList ref="TabList" :currentImgData="currentImgData" :searchImgByImgData="searchImgByImgData"></TabList>
      </Dialog>
      <Dialog :modalData="addModalData">
        <ComForm  ref="addFormModal" :searchIpt="addFormData.inputItem" :searchFunc="addFormData.queryFn" :formRule='addFormData.formRule'></ComForm>
        <div class="addToTilBtnClass">
          <el-button type="primary" size="mini" @click="addTypicalImage" data-id="sure-btn">{{$t('vicenter.common.sure')}}</el-button>
          <el-button size="mini" @click="closeAddModal" data-id="cancel-btn">{{$t('vicenter.common.cancel')}}</el-button>
        </div>
      </Dialog>
      <AIResult v-if="AIResultData.jsonData" ref="AIResultRef" :AIResultData='AIResultData'></AIResult>
    </div>
    <printTable ref="printTableRef" :printTable="printTable"></printTable>
  </div>
</template>
<script>
import breadCrumb from '../../components/breadCrumb'
import panelTitle from '../../components/title'
import detailList from '@/components/detailList'
import Cswiper from '../../components/swipe'
import ComTable from '../../components/table'
import timeLine from '../../components/timeLine'
import upload from '../../components/uploadPreview'
import ComForm from '../../components/form'
import ajax from '../../api/supervise/Task-inspection.js'
import insCommonAjax from '@/api/inspection/common.js'
import viProbe from '@/lib/viprobe/viProbeForDms.js'
import Dialog from '@/components/dialogCommon'
import TabList from '@/components/tabList'
import DecQuery from '@/components/declarationQuery'
import AIResult from '@/components/AIResult'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import DocInfo from '@/components/documentInfomation'
export default {
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
          },
          {
            type: 'title',
            colspan: 6,
            infoType: 'auditInfo',
            label: this.$t('vicenter.supervise.taskInspectionDetail.auditConclusion')
          },
          {
            type: 'content',
            infoType: 'auditInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.auditConclusion'),
                ruleProp: 'conclusion'
              },
              {
                type: 'dic',
                value: '',
                ruleProp: 'conclusion'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.auditTime'),
                ruleProp: 'operateTime'
              },
              {
                type: 'time',
                value: '',
                ruleProp: 'operateTime'
              },
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.reviewer'),
                ruleProp: 'operatorAccount'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'operatorAccount'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'auditInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
                ruleProp: 'remark'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'remark'
              },
              {
                type: 'label',
                value: '',
                ruleProp: 'empty'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'empty'
              },
              {
                type: 'label',
                value: '',
                ruleProp: 'empty'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'empty'
              }
            ]
          }
        ]
      },
      taskNo: '',
      showAIResult: false,
      imageLibraryEnable: false,
      AIResultData: {
        jsonData: '',
        imgSrc: '',
        conclusion: ''
      },
      decQueryModal: {
        title: this.$t('vicenter.supervise.taskInspectionDetail.declarationQuery'),
        flag: false,
        width: '70%',
        top: '50px',
        resetModal: this.closeDecQueryModal
      },
      findImgModal: {
        title: this.$t('vicenter.common.FindImage'),
        flag: false,
        width: '90%',
        top: '50px',
        resetModal: this.closeFindImgModal
      },
      addModalData: {
        title: this.$t('vicenter.supervise.taskInspectionDetail.addImage'),
        flag: false,
        resetModal: this.closeAddModal,
        customClass: 'addToTilModal',
        width: '600px'
      },
      addFormData: {
        inputItem: [
          {
            getLabel: this.$t('vicenter.ImageLibrary.common.Imagetype'),
            type: 'radio',
            disabled: true,
            models: 'STANDARD',
            ruleProp: 'imageType',
            option: [
              {
                value: 'STANDARD',
                label: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD')
              },
              {
                value: 'ILLEGAL',
                label: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL')
              }
            ]
          },
          {
            getLabel: this.$t('vicenter.ImageLibrary.common.hsCodes'),
            placeHolder: ' ',
            models: '',
            options: [],
            ruleProp: 'hsCodes',
            type: 'treeInput',
            treedata: [],
            checkedOption: [],
            treeView: false,
            treeIptId: 'hsCodesInput',
            treeDataId: 'hsCodesData',
            readonly: true,
            disabled: false,
            treeClick: this.treeClick,
            check: this.hsCodesCheckChange,
            treeRefName: 'hsCodesIptRef',
            treeIptComName: 'hsCodesTree',
            TreeProps: {
              children: 'children',
              label: function (data) {
                // 重写节点的label显示内容
                return `(${data.code}) ${data.name}`
              }
            },
            goodsOption: {
              hscodeTreeQuery: false,
              hscodePosition: true,
              isShowCheckbox: true,
              checkedKeys: [],
              defaultExpandedKeys: [],
              maxLimit: 1 // 标准图最多选择一个，违规图可以多个
            },
            change: this.changeHscode
          },
          {
            getLabel: this.$t('vicenter.ImageLibrary.common.recommendedReason'),
            type: 'textarea',
            models: '',
            ruleProp: 'recommendReason',
            maxlength: 500,
            autoSize: 5,
            minSize: 2
          }
        ],
        queryFn: {
          query: this.queryNull
        },
        formRule: {
          refName: 'addImgForm',
          rule: {
            imageType: [ // 图像类型校验
              { required: true, message: this.$t('vicenter.ImageLibrary.common.checkImagetype'), trigger: 'change' }
            ],
            recommendReason: [ // 推荐原因校验
              { required: true, message: this.$t('vicenter.ImageLibrary.common.inputRecommendedReason'), trigger: 'blur' }
            ],
            hsCodes: [ // hsCodes校验
              { required: true, message: this.$t('vicenter.ImageLibrary.common.selectHsCodes'), trigger: 'blur' }
            ]
          },
          model: {
            imageType: 'STANDARD',
            recommendReason: '',
            hsCodes: '',
            hsIds: '',
            hsNames: ''
          }
        }
      },
      currentImgData: {}, // 当前任务的lastScanImage、scanSerialNumber、siteName、hsCodes
      searchImgByImgData: '', // 保存ilSearchImageByImageData字段(json字符串)
      viprobeData: {
        markFilePath: ''
      },
      showSaveBtn: false,
      isSaving: false,
      uploading: false,
      fileNum: 0,
      uploadingTxt: this.$t('vicenter.common.uploading'),
      defaultImg: require('@/assets/img/common/ViCenter.png'),
      hasTrackId: false,
      openViprobeFlag: false,
      showSwiper: true,
      imgType: ['jpg', 'png', 'jpeg', 'gif', 'img'],
      needFormat: ['isMeasured', 'isScanned', 'isTracked'],
      needDic: ['bussinessType', 'riskLevel', 'conclusion'],
      falseFlag: true,
      id: -1,
      reviewFlag: false,
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Supervise/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
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
          listType: 'picture-card',
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
      activeName: 'first',
      title: {
        basicInfo: this.$t('vicenter.supervise.taskInspectionDetail.essentialInformation'),
        inspectionConclusion: this.$t('vicenter.supervise.taskInspectionDetail.inspectionConclusion'),
        taskTotal: this.$t('vicenter.supervise.taskInspectionDetail.businessOverview'),
        checkConclusion: this.$t('vicenter.supervise.taskInspectionDetail.auditConclusion')
      },
      panelTitle: {
        basicInfo: {
          inspectionInformation: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.inspectionInformation')
          },
          billInfo: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.billInfo')
          },
          containerList: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.containerList')
          },
          decList: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.decList')
          }
        },
        result: {
          imageResult: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.comparisonOfresultsexamination')
          },
          physicalResult: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.handTestresult')
          },
          attachment: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.enclosure')
          }
        },
        checkResult: {
          checkHistory: {
            title: this.$t('vicenter.supervise.taskInspectionDetail.reviewHistory')
          }
        }
      },
      listWidth: {
        width: '33.33%'
      },
      allWidth: {
        width: '100%'
      },
      imgSrc: '',
      basicInfo: {
        basic: [
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.siteId'),
            value: '',
            attachFlag: false,
            ruleProp: 'siteName'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.device'),
            value: '',
            attachFlag: false,
            ruleProp: 'deviceName'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.checkinTime'),
            value: '',
            attachFlag: false,
            ruleProp: 'checkinTime'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.vehicleType'),
            value: '',
            attachFlag: false,
            ruleProp: 'vehicleType'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.lpnBefore'),
            value: '',
            attachFlag: false,
            attachList: [],
            ruleProp: 'lpnFront'
          },
          {
            label: this.$t('vicenter.inspection.common.lpnBack'),
            value: '',
            attachFlag: false,
            attachList: [],
            ruleProp: 'lpnBackCsv'
          }
        ],
        contableGroup: [
          {
            label: this.$t('vicenter.common.No'),
            type: 'index'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.container'),
            type: 'text',
            model: 'targetNumber'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.containerType'),
            type: 'text',
            model: 'containerType'
          }
        ],
        contableData: {
          data: [],
          sortMethod: '',
          MaxHeight: 200,
          refName: 'conDataTable'
        },
        dectableGroup: [
          {
            label: this.$t('vicenter.common.No'),
            type: 'index'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.declaration'),
            type: 'text',
            model: 'decNum'
          }
        ],
        dectableData: {
          data: [],
          sortMethod: '',
          MaxHeight: 200,
          refName: 'decDataTable'
        },
        refName: 'basicDetailList'
      },
      resultInfo: {
        isUff: false,
        scanningImgs: [],
        imgSrc: '',
        scanningImgName: '',
        scanImagePath: '',
        scanningImgFiles: [],
        imageResult: [
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.conclusionOfdrawing'),
            value: '',
            ruleProp: 'conclusion'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.contrabandLocation'),
            value: '',
            ruleProp: 'contrabandLocation'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.contrabandType'),
            value: '',
            ruleProp: 'contrabandType'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
            value: '',
            ruleProp: 'remark'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.rapporteur'),
            value: '',
            ruleProp: 'operatorAccount'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.drawingTime'),
            value: '',
            ruleProp: 'time'
          }
        ],
        physicalResult: [
          // {
          //   label: this.$t('vicenter.supervise.taskInspectionDetail.handExaminationconclusion'),
          //   value: '',
          //   ruleProp: 'conclusion'
          // },
          // {
          //   label: this.$t('vicenter.supervise.common.physicalContrabandLocation'),
          //   value: '',
          //   ruleProp: 'contrabandLocation'
          // },
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
          }
          // {
          //   label: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
          //   value: '',
          //   ruleProp: 'remark'
          // },
          // {
          //   label: this.$t('vicenter.supervise.taskInspectionDetail.handInspector'),
          //   value: '',
          //   ruleProp: 'operatorAccount'
          // },
          // {
          //   label: this.$t('vicenter.supervise.taskInspectionDetail.handInspectiontime'),
          //   value: '',
          //   ruleProp: 'time'
          // }
        ],
        physicalResultAttach: {
          flag: false,
          data: []
        },
        refName: 'imageResultDetailList',
        refNamePhy: 'physicalResultDetailList'
      },
      options: {
        attachment: {
          propId: 'Resattachment',
          height: '120px',
          width: '70%',
          slidesPerView: 2,
          spaceBetween: 20,
          autoplay: false,
          delay: 10,
          navigate: {
            position: 'outside',
            type: 'shadow'
          },
          hasFile: true
        }
      },
      taskTotal: {
        data: [
        ]
      },
      checkResult: {
        tableGroup: [
          {
            label: this.$t('vicenter.common.No'),
            type: 'index'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.time'),
            type: 'text',
            model: 'operateTime'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.reviewer'),
            type: 'text',
            model: 'operatorAccount'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.reviewConclusion'),
            type: 'text',
            model: 'conclusion'
          },
          {
            label: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
            type: 'text',
            model: 'remark'
          },
          {
            label: this.$t('vicenter.common.operation'),
            type: 'operation',
            model: 'operation'
          }
        ],
        tableData: {
          data: [
          ],
          isBorder: true,
          isStripe: true,
          isPage: false,
          refName: 'multipleTable',
          sortMethod: this.getSort
        }
      },
      checkResultForm: {
        queryFn: { // 页面表单查询方法
          query: this.querynull
        },
        formClass: {
          buttonClass: 'firbutton'
        },
        inputItem: [
          {
            getLabel: this.$t('vicenter.common.conclusion'),
            type: 'radio',
            placeHolder: '',
            models: '',
            ruleProp: 'conclusion',
            option: []
          },
          {
            getLabel: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
            type: 'textarea',
            placeHolder: '',
            models: '',
            rows: '3',
            minSize: '3',
            autoSize: '3',
            ruleProp: 'remark'
          }
        ],
        formRule: {
          refName: 'checkResultQueryForm',
          model: {
            conclusion: 'RC001'
            // remark: ''
          },
          rule: {
            conclusion: [
              { required: true, message: this.$t('vicenter.supervise.taskInspectionDetail.pleaseChooseconclusion'), trigger: 'blur' }
            ],
            remark: [
              // { required: true, message: this.$t('vicenter.supervise.taskInspectionDetail.pleaseInputremarks'), trigger: 'blur' },
              {min: 1, max: 500, message: this.$t('vicenter.common.limitRemarksLength'), trigger: 'blur'}
            ]
          }
        }
      },
      passCode: 'RC001',
      checkDetail: {
        title: this.$t('vicenter.supervise.taskInspectionDetail.reviewHistory'),
        data: [
          {
            disabled: true,
            getLabel: this.$t('vicenter.supervise.taskInspectionDetail.time'),
            type: 'text',
            models: '',
            ruleProp: 'operateTime'
          },
          {
            disabled: true,
            getLabel: this.$t('vicenter.supervise.taskInspectionDetail.reviewer'),
            type: 'text',
            models: '',
            ruleProp: 'operatorAccount'
          },
          {
            disabled: true,
            getLabel: this.$t('vicenter.common.conclusion'),
            type: 'radio',
            placeHolder: '',
            models: '',
            ruleProp: 'conclusion',
            option: [
            ]
          },
          {
            disabled: true,
            getLabel: this.$t('vicenter.supervise.taskInspectionDetail.remarks'),
            type: 'textarea',
            placeHolder: '',
            models: '',
            rows: '3',
            minSize: '3',
            autoSize: '3',
            ruleProp: 'remark'
          }
        ],
        option: {
          propId: 'checkDetail',
          height: '120px',
          width: '90%',
          slidesPerView: 4,
          spaceBetween: 20,
          autoplay: false,
          delay: 10,
          navigate: {
            position: 'outside',
            type: 'shadow'
          }
        },
        listRecheckAttrFlag: false,
        listRecheckAttr: [],
        recheckAttr: [],
        formRule: {
          refName: 'checkDetailQueryForm',
          model: {
            result: '',
            remark: ''
          }
        },
        flag: false
      },
      imageTypeDefault: '', // 图像类型
      supViporbeButton: window.config.supViporbeButton, // 监管页面viprobe按钮是否显示
      backFlag: 'list',
      declarationNo: '',
      imageCheckTableGroup: [
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
        },
        {
          label: this.$t('vicenter.inspection.common.inspector'),
          type: 'text',
          model: 'operatorAccount'
        },
        {
          label: this.$t('vicenter.supervise.taskInspectionDetail.drawingTime'),
          type: 'text',
          model: 'time'
        },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation',
          width: '75px'
        }
      ],
      imageCheckTableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'imageCheckTable'
      },
      physicalTableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.supervise.taskInspectionDetail.handExaminationconclusion'),
          type: 'text',
          model: 'conclusion'
        },
        {
          label: this.$t('vicenter.supervise.common.physicalContrabandLocation'),
          type: 'text',
          model: 'contrabandLocation'
        },
        {
          label: this.$t('vicenter.inspection.common.remarks'),
          type: 'text',
          model: 'remark'
        },
        {
          label: this.$t('vicenter.supervise.taskInspectionDetail.handInspector'),
          type: 'text',
          model: 'operatorAccount'
        },
        {
          label: this.$t('vicenter.supervise.taskInspectionDetail.handInspectiontime'),
          type: 'text',
          model: 'time',
          width: '275px'
        }
      ],
      physicalTableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'physicalTable'
      },
      stepFilePath: '',
      taskMarks: null
    }
  },
  created () {
    this.showAIResult = this.$getSystemConfig('aiEnable')
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.imageLibraryEnable = window.config.imageLibraryEnable
    let details = JSON.parse(sessionStorage.getItem('details'))
    let id = details.id
    let reviewFlag = details.reviewFlag
    this.id = id
    if (details.backFlag) {
      this.backFlag = details.backFlag
    }
    this.uploadImg.option.data = {taskId: id}
    this.reviewFlag = reviewFlag
    this.getDetail(this.reviewFlag)
  },
  mounted () {
    let details = JSON.parse(sessionStorage.getItem('details'))
    let id = details.id
    let reviewFlag = details.reviewFlag
    this.id = id
    this.reviewFlag = reviewFlag
    this.$getDataByTypecode(['RECHECK_CONC'], ['conclusion'], this.checkResultForm.inputItem)
    this.checkResultForm.inputItem[0].models = this.passCode
    this.$getDataByTypecode(['RECHECK_CONC'], ['conclusion'], this.checkDetail.data)
  },
  beforeDestroy () {
    if (this.openViprobeFlag) {
      this.closeViprobe()
    }
    this.resetDeleteAttach()
    // localStorage.removeItem('details')
  },
  methods: {
    handlePrint () {
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$refs.printTableRef.handleExport()
    },
    selectDecRow (data) {
      this.declarationNo = data.decNum
      this.decQueryModal.flag = true
    },
    closeDecQueryModal () {
    },
    changeHscode () {
      this.$changeSelectValidateField('addFormModal', this, 'hsCodes')
    },
    showAIResultModal () {
      if (this.AIResultData.jsonData && this.$isJsonString(this.AIResultData.jsonData)) {
        this.$refs.AIResultRef.AIResultModal.flag = true
      } else {
        this.$NotifPrompt(this.$t('vicenter.common.AIResultNoData'))
      }
    },
    // 添加图像信息到典图库
    addTypicalImage () {
      this.$refs['addFormModal'].$refs[this.addFormData.formRule.refName].validate((valid) => {
        if (valid) {
          let params = Object.assign({}, {id: this.id}, this.addFormData.formRule.model)
          ajax.addTypicalImage(params).then((res) => {
            if (res.data.flag) {
              this.$NotifSuccess(this.$t('vicenter.ImageLibrary.common.recommendSuccess'))
              this.closeAddModal()
            }
          }).catch(() => {})
        }
      })
    },
    showAddModal () {
      this.addFormData.inputItem.forEach(e => {
        if (e.ruleProp === 'imageType') {
          if (this.imageTypeDefault.indexOf('CONC001') !== -1) {
            e.models = 'ILLEGAL'
            this.addFormData.inputItem.forEach(item => {
              if (item.ruleProp === 'hsCodes') {
                item.goodsOption.maxLimit = null
              }
            })
          } else {
            e.models = 'STANDARD'
            this.addFormData.inputItem.forEach(item => {
              if (item.ruleProp === 'hsCodes') {
                item.goodsOption.maxLimit = 1
              }
            })
          }
        }
      })
      this.addModalData.flag = true
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
    goBack () {
      this.resetDeleteAttach()
      if (this.backFlag === 'map') {
        this.$router.push({ path: '/Supervise/supervise-map' })
      } else {
        this.$router.push({ path: '/Supervise/Task-inspection' })
      }
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
      let tempArr = file.name.split('.')
      if (this.uploadImg.option.accept.indexOf(tempArr[tempArr.length - 1]) !== -1) {
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
        if (this.fileNum === 0) {
          this.uploading = false
        }
        this.$nextTick(() => {
          this.showSwiper = true
        })
      } else {
        this.uploading = false
        this.fileNum--
        this.$NotifError(this.$t('vicenter.supervise.taskInspectionDetail.uploadFailure'))
        this.$nextTick(() => {
          this.showSwiper = true
        })
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
    resetRecheck () {
      this.checkResultForm.inputItem.forEach(e => {
        if (e.ruleProp === 'conclusion') {
          e.models = this.passCode
        } else if (e.ruleProp === 'remark') {
          e.models = ''
        }
      })
      this.resetDeleteAttach()
    },
    saveRecheck () {
      let conclusion = ''
      let remark = ''
      let list = []
      this.checkResultForm.inputItem.forEach(e => {
        if (e.ruleProp === 'conclusion') {
          conclusion = e.models
        } else if (e.ruleProp === 'remark') {
          remark = e.models
        }
      })
      if (conclusion === '') {
        this.$NotifPrompt(this.$t('vicenter.supervise.taskInspectionDetail.conclusionCannotempty'))
        return
      }
      this.uploadImg.option.previewList.forEach(e => {
        list.push(e.relativeUrl)
      })
      this.$refs['modalForm'].$refs[this.checkResultForm.formRule.refName].validate((valid) => {
        if (valid) {
          this.isSaving = true
          let param = {
            'taskId': this.id,
            'conclusion': conclusion,
            'remark': remark,
            'listFUrl': list
          }
          this.$confirm(this.$t('vicenter.common.confirmSave'), {
            confirmButtonText: this.$t('vicenter.common.sure'),
            cancelButtonText: this.$t('vicenter.common.cancel'),
            type: 'warning'
          }).then(() => {
            ajax.saveTaskRecheck(param).then((res) => {
              if (res.data.flag) {
                this.$NotifSuccess(this.$t('vicenter.supervise.taskInspectionDetail.saveSuccess'))
                this.uploadImg.option.previewList = []
                this.checkResultForm.inputItem.forEach(e => {
                  if (e.ruleProp === 'conclusion') {
                    e.models = this.passCode
                  } else if (e.ruleProp === 'remark') {
                    e.models = ''
                  }
                })
                if (this.openViprobeFlag) {
                  this.closeViprobe()
                }
                // 保存之后返回列表页面
                this.goBack()
              }
              this.isSaving = false
            })
          }).catch(() => {
            this.isSaving = false
          })
        }
      })
    },
    deleteAttach (item) {
      this.$ConfirmBox(this.$t('vicenter.common.uploadPreview.confirmTip'), () => {
        let src = item.src
        // this.showSwiper = false
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
    getDetail (flag) {
      if (this.id === -1) {
        this.$NotifPrompt(this.$t('vicenter.supervise.taskInspectionDetail.dataError'))
      } else {
        let params = {
          id: this.id,
          isAudit: flag ? '1' : '0' // 稽核页面为1，详情页面为0
        }
        ajax.checkDetail(params).then((res) => {
          if (res.data.flag) {
            let {
              taskObject,
              taskTargetObjects,
              taskDecObjects,
              imgCheckObjects,
              manualCheckObject,
              taskTimeLineObjects,
              taskRecheckObjects,
              taskAttachementObjects,
              taskMarks
            } = res.data.result
            // 以图找图所需信息
            Object.assign(this.currentImgData, res.data.result)
            // 以图搜图
            this.searchImgByImgData = taskObject.ilSearchImageByImageData
            // 智审结果
            this.AIResultData.jsonData = taskObject.ilSearchImageByImageData
            if (this.AIResultData.jsonData && this.$isJsonString(this.AIResultData.jsonData)) {
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
            this.taskNo = taskObject.scanSerialNumber
            // 基本信息
            this.getValue(this.basicInfo.basic, taskObject)
            // 集装箱信息
            this.$initContainerData(this.$data.basicInfo, taskTargetObjects)
            // 报关单信息
            this.$initCusDecData(this.$data.basicInfo, taskDecObjects)
            if (imgCheckObjects && imgCheckObjects.length > 0) {
              let imgCheck = imgCheckObjects[0]
              imgCheckObjects.forEach(e => {
                if (imgCheck.endTime < e.endTime) {
                  imgCheck = e
                }
              })
              this.getValue(this.resultInfo.imageResult, imgCheck)
              this.setTime(this.resultInfo.imageResult, imgCheck)
              // 调整后的审图结论
              this.imageCheckTableData.data = JSON.parse(JSON.stringify(imgCheckObjects))
              this.imageCheckTableData.data.forEach((i, index) => {
                i.conclusion = this.$t(i.conclusion)
                i.contrabandLocation = this.$t(i.contrabandLocation)
                i.contrabandType = this.$t(i.contrabandType)
                i.taskLink = this.$t(i.taskLink)
                i.time = this.getTimeRange(imgCheckObjects[index])
                i.operation = [
                  {
                    func: this.openReplay,
                    label: `<span class='iconfont editTable'>&#xe716;</span>`,
                    title: this.$t('vicenter.common.replayOperation'),
                    show: true
                  }
                ]
              })
            } else {
              this.imageCheckTableData.data = []
            }
            // 有嫌疑为违规图，无嫌疑为标准图
            this.imageTypeDefault = taskObject.concImgcheck
            // 手检结论
            if (manualCheckObject != null) {
              this.$initManalCheckObj(this.resultInfo.physicalResult, manualCheckObject)
              this.setTime(this.resultInfo.physicalResult, manualCheckObject)
              // this.imageTypeDefault = manualCheckObject.conclusion
              // 调整后的手检结论
              this.physicalTableData.data = [manualCheckObject]
              this.physicalTableData.data.forEach(p => {
                p.conclusion = this.$t(p.conclusion)
                p.contrabandLocation = this.$toI18nString(p.contrabandLocation)
                p.time = this.getTimeRange(manualCheckObject)
              })
            } else {
              this.physicalTableData.data = []
            }
            let listAttr = []
            var listManuAttr = []
            if (taskAttachementObjects != null) {
              if (taskAttachementObjects['CHECKIN']) {
                listAttr = taskAttachementObjects['CHECKIN'] // 检入附件
              }
              if (taskAttachementObjects['MANUAL_CHECK']) {
                listManuAttr = taskAttachementObjects['MANUAL_CHECK'] // 手检附件
              }
              if (taskAttachementObjects['RECHECK']) {
                this.recheckAttr = taskAttachementObjects['RECHECK'] // 稽核历史附件
              }
              let {SCANNING} = taskAttachementObjects
              this.resultInfo.isUff = this.$isUFF(SCANNING)
              this.resultInfo.scanningImgFiles = this.$getScanningData(SCANNING)
            }
            this.setAttach(listAttr, taskObject.lastScanImage, listManuAttr)
            // 扫描图片
            let imgSrc = taskObject.scanSerialNumber
            if (imgSrc != null && imgSrc !== '') {
              this.resultInfo.scanningImgName = imgSrc
            }
            this.resultInfo.scanImagePath = taskObject.scanImagePath
            this.resultInfo.imgSrc = taskObject.lastScanImage
            this.viprobeData.markFilePath = taskObject.markFilePath
            this.taskMarks = taskMarks ? JSON.parse(taskMarks.replace(/'/g, '"')) : null
            if (taskRecheckObjects) {
              // this.getCheckTable(this.checkResult.tableData, taskRecheckObjects)
              // 展示稽核详情信息
              this.getRecheckInfo(this.checkDetail, taskRecheckObjects)
            }
            this.setTimeLine(this.taskTotal.data, taskTimeLineObjects)
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
            if (taskRecheckObjects && taskRecheckObjects.length > 0) {
              taskRecheckObjects.forEach(item => {
                this.$getPrintInfo(this, item, 'auditInfo')
              })
            }
          } else {
            this.goBack()
          }
        }).catch(() => {})
      }
    },
    openReplay () {
      if (window.viprobeReturn.openImgSuccess) {
        viProbe.loadStepAutoplay(this.resultInfo.scanningImgName, this.stepFilePath)
      } else {
        console.log('viprobe未打开图像')
      }
    },
    setAttach (listAttr, imgSrc, listManuAttr) {
      // 报关单附件
      let portAttach = []
      // 前车牌号附件
      let frontCarNumAttach = []
      // 后车牌号附件
      let backCarNumAttach = []
      listAttr.forEach(e => {
        if (e.docType === 'LPR') { // 前车牌号
          frontCarNumAttach.push(e)
        } else if (e.docType === 'LPR_BACK') { // 后车牌号
          // backCarNumAttach.push(e) // 目前返回的数据结果docType没有LPR_BACK类型，暂时先注释掉
        } else if (e.fileNameExt === 'img') {
          this.resultInfo.scanningImgs.push({'name': e.fileName})
        }
      })
      this.basicInfo.basic.forEach(e => {
        if (e.ruleProp === 'lpnFront') {
          if (frontCarNumAttach.length === 0) {
            e.attachFlag = false
          } else {
            e.attachFlag = true
            this.setAttachData(frontCarNumAttach, e.attachList)
          }
        } else if (e.ruleProp === 'lpnBackCsv') {
          if (backCarNumAttach.length === 0) {
            e.attachFlag = false
          } else {
            e.attachFlag = true
            this.setAttachData(backCarNumAttach, e.attachList)
          }
        }
      })
      if (listManuAttr != null && listManuAttr.length > 0) {
        this.setAttachData(listManuAttr, this.resultInfo.physicalResultAttach.data)
        this.resultInfo.physicalResultAttach.flag = true
      }
    },
    setAttachData (data, attachList) {
      data.forEach(e => {
        let type = this.$options.filters['attachType'](e.fileNameExt)
        attachList.push(
          {
            src: e.location,
            type: type
          }
        )
      })
    },
    setTime (arr1, arr2) {
      let {beginTime, endTime} = arr2
      beginTime = this.$options.filters['formatDate'](beginTime, this.$t('vicenter.common.formatDate'))
      endTime = this.$options.filters['formatDate'](endTime, this.$t('vicenter.common.formatDate'))
      if (beginTime != null && endTime != null) {
        arr1.forEach(e => {
          if (e.ruleProp === 'time') {
            e.value = beginTime + '~' + endTime
          }
        })
      }
    },
    getTimeRange (obj) {
      let timeRange = ''
      let { beginTime, endTime } = obj
      beginTime = this.$options.filters['formatDate'](beginTime, this.$t('vicenter.common.formatDate'))
      endTime = this.$options.filters['formatDate'](endTime, this.$t('vicenter.common.formatDate'))
      if (beginTime != null && endTime != null) {
        timeRange = beginTime + '~' + endTime
      }
      return timeRange
    },
    setTimeLine (timeLine, res) {
      this.taskTotal.data = res
      this.taskTotal.data.forEach(line => {
        line.taskNode = this.$t(line.taskNode)
        line.haveVideo = false
        line.haveImg = false
        line.videoList = []
        line.imgList = []
        if (line.attachements !== null) {
          line.attachements.forEach(att => {
            let src = ''
            let type = this.$options.filters['attachType'](att.fileNameExt)
            if (type === 'video' || type === 'videoDownLoad') {
              line.videoList.push({
                type: type,
                src: att.location
              })
            } else if (type === 'img' && att.fileNameExt !== 'img') {
              line.imgList.push({
                type: type,
                src: att.location
              })
            }
          })
          if (line.imgList.length > 0) {
            line.haveImg = true
          }
          if (line.videoList.length > 0) {
            line.haveVideo = true
          }
        }
        if (line.concFlag != null) {
          if (line.concFlag === 'MC001') {
            line.status = 2
            line.statusMsg = this.$t('vicenter.DIC.T_MANUAL_CHECK_CONC.C_MC001')
          } else if (line.concFlag === 'MC002') {
            line.status = 1
            line.statusMsg = this.$t('vicenter.supervise.taskInspectionDetail.noSeizure')
          } else if (line.concFlag === 'CONC001') {
            line.status = 2
            line.statusMsg = this.$t('vicenter.supervise.taskInspectionDetail.suspected')
          } else if (line.concFlag === 'CONC002') {
            line.status = 1
            line.statusMsg = this.$t('vicenter.supervise.taskInspectionDetail.noSuspicion')
          }
        }
      })
    },
    getRecheckInfo (val, data) {
      val.listRecheckAttrFlag = false
      val.listRecheckAttr = []
      if (data.length > 0) {
        let recheckInfoObj = data[data.length - 1]
        val.data.forEach(e => {
          if (e.ruleProp === 'conclusion') {
            let conclusionArr = recheckInfoObj[e.ruleProp].split('vicenter.DIC.T_RECHECK_CONC.C_')
            e.models = conclusionArr[conclusionArr.length - 1]
          } else if (e.ruleProp === 'operateTime') {
            e.models = this.$options.filters['formatDate'](recheckInfoObj[e.ruleProp], this.$t('vicenter.common.formatDate'))
          } else {
            e.models = recheckInfoObj[e.ruleProp]
          }
        })
        if (this.recheckAttr && this.recheckAttr.length > 0) {
          this.recheckAttr.forEach(e => {
            if (recheckInfoObj.id === e.eventId) {
              let type = this.$options.filters['attachType'](e.fileNameExt)
              val.listRecheckAttr.push({
                src: e.location,
                type: type
              })
            }
          })
        }
        if (val.listRecheckAttr != null && val.listRecheckAttr.length > 0) {
          this.$nextTick(() => {
            val.listRecheckAttrFlag = true
          })
        }
      }
    },
    getCheckTable (table, res) {
      table.data = res
      table.data.forEach(e => {
        e.conclusion = this.$t(e.conclusion)
        e.operateTime = this.$options.filters['formatDate'](e.operateTime, this.$t('vicenter.common.formatDate'))
        e.operation = [
          {
            func: this.getCheckDetail,
            label: `<span class='iconfont editTable'>&#xe610;</span>`,
            title: this.$t('vicenter.common.detail'),
            show: true
          }
        ]
      })
    },
    getCheckDetail (scope) {
      this.checkDetail.listRecheckAttrFlag = false
      this.checkDetail.data.forEach(e => {
        e.models = scope.row[e.ruleProp]
        if (e.ruleProp === 'conclusion') {
          if (e.models === this.$t('vicenter.DIC.T_RECHECK_CONC.C_RC001')) {
            e.models = 'RC001'
          } else if (e.models === this.$t('vicenter.DIC.T_RECHECK_CONC.C_RC002')) {
            e.models = 'RC002'
          }
        }
      })
      this.checkDetail.listRecheckAttr = []
      if (this.recheckAttr && this.recheckAttr.length > 0) {
        this.recheckAttr.forEach(e => {
          if (scope.row.id === e.eventId) {
            let type = this.$options.filters['attachType'](e.fileNameExt)
            this.checkDetail.listRecheckAttr.push({
              src: e.location,
              type: type
            })
          }
        })
      }
      if (this.checkDetail.listRecheckAttr != null && this.checkDetail.listRecheckAttr.length > 0) {
        this.$nextTick(() => {
          this.checkDetail.listRecheckAttrFlag = true
        })
      }
      this.checkDetail.flag = true
    },
    getValue (arr1, arr2) {
      arr1.forEach(e => {
        e.value = arr2[e.ruleProp]
        if (e.ruleProp === 'checkinTime' && e.value) {
          e.value = this.$options.filters['formatDate'](e.value)
        }
        if (e.ruleProp === 'vehicleType' || e.ruleProp === 'conclusion' || e.ruleProp === 'contrabandLocation' || e.ruleProp === 'contrabandType') {
          if (e.value) {
            e.value = this.$t(e.value)
          }
        }
      })
    },
    querynull () {
      return false
    },
    openViprobe () {
      var name = this.resultInfo.scanningImgName// 图像 流水号
      var path = this.resultInfo.scanImagePath// 到文件夹级别
      var imageFiles = this.resultInfo.scanningImgFiles// 放入所有的img文件
      var isUff = this.resultInfo.isUff
      let markFilePath = path + 'suspects_json.mark'
      var stepFilePath = path + 'history.steps'
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
        this.stepFilePath = stepFilePath
        let _markFile = this.taskMarks || markFilePath
        viProbe.openImageAndAnalysisInfoInViProbe(name, path, imageFiles, _markFile, stepFilePath, null, isUff)
        if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
          this.openViprobeFlag = true
          this.judgeOpen()
        } else {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
        }
      })
    },
    judgeOpen () {
      if (window.viprobeReturn.openImgSuccess === null) {
        setTimeout(this.judgeOpen, 200)
      } else {
        if (window.viprobeReturn.openImgSuccess) {
          // 打开原图成功之后，调用viporbe显示智审结果接口
          if (this.AIResultData.jsonData && this.$isJsonString(this.AIResultData.jsonData)) {
            let name = this.resultInfo.scanningImgName
            let type = 'jsonstr'
            let jsonData = this.AIResultData.jsonData
            viProbe.showIntelligentAnalysis(name, type, jsonData)
          }
        }
      }
    },
    closeViprobe () {
      viProbe.closeImageInViProbe(this.resultInfo.scanningImgName)
    },
    sortChange () {
    },
    getSort () {
    },
    // 关闭推荐到典图库模态框
    closeAddModal () {
      this.addFormData.inputItem.forEach(e => {
        e.models = ''
        if (e.ruleProp === 'hsCodes') {
          e.options = []
          e.goodsOption.checkedKeys = []
          e.goodsOption.defaultExpandedKeys = []
        }
      })
      this.addModalData.flag = false
      this.$refs['addFormModal'].$refs[this.addFormData.formRule.refName].resetFields()
    },
    queryNull () {
      return false
    },
    treeClick () {},
    /**
     * hscode树点击节点
     */
    hsCodesCheckChange (nodeObj, checkedObj) {},
    LookImg () {
      var viewer = new Viewer(document.getElementById('lastScanImg'))
      this.$nextTick().then(() => {
        viewer.update()
      })
      viewer.view(0)
    }
  },
  watch: {
    'activeName': {
      handler (newValue, oldValue) {
        if (newValue === 'forth' && this.reviewFlag) {
          this.showSaveBtn = true
        } else {
          this.showSaveBtn = false
        }
      }
    }
  },
  components: {breadCrumb, panelTitle, detailList, Cswiper, ComTable, timeLine, upload, ComForm, Dialog, TabList, DecQuery, AIResult, DocInfo}
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.Task-inspection-detail-bar{
  @extend .extend-bar;
  .Task-inspection-detail-M{
    padding:$margin;
    height: 100%;
    @include box-sizing;
    .Task-inspection-detail-info{
      height: calc(100% - 30px);
      .up-down-infolist {
        height: 100%;
        position: relative;
        .basicInfo {
          width: 100%;
          height: 100%;
          padding: 15px;
          box-sizing: border-box;
          .box {
            width: 100%;
            border: 1px solid #ddd;
            box-sizing: border-box;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .conAndDeclist{
            width: 100%;
            display: flex;
            flex-direction: row;
            .conList{
              width: 60%;
            }
            .decList{
              width: 40%;
              .el-table__row {
                cursor: pointer;
              }
            }
          }
        }
        .operateBox {
          position: absolute;
          right: $dis10;
          top: 0;
          transform: translate(0, 12%);
          @include flex(row, flex-end, center);
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
      }
      .contBox {
        width: 100%;
        height: 100%;
        padding: 15px;
        box-sizing: border-box;
      }
      .inspectionConclusionImg{
        width: calc(100% + 15px);
        height: 265px;
        border: 1px solid $detailBorder;
        padding: 10px 0;
        box-sizing: border-box;
        border-radius: 4px;
        .viprobe-button{
          height: 100%;
          text-align: right;
          padding: 0 20px;
          position: relative;
          .openBtn {
            position: absolute;
            top: 0;
            right: 10px;
          }
        }
        img{
          margin: 0 auto;
          height: calc(100% - 30px);
          max-width: 100%;
          cursor: pointer;
        }
      }
      .result{
        overflow: hidden;
        width: calc(100% + 15px);
        min-height: 710px;
        margin-top: 15px;
        .box {
          min-height: 450px;
          padding-bottom: 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          display: block;
          [data-id='seizedObjectsTable'].tableComp {
            padding: 0;
          }
        }
        .attach-title{
          width: 100%;
          display:block;
          line-height: 32px;
          padding-left: 20px;
          font-weight: normal;
        }
        .center{
          margin-left: 25px;
          float: right;
        }
      }
      .detail-title{
        width: $all;
        display: inline-flex;
        padding: 10px 0 10px 10px;
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;
        margin: 20px 0px 10px -5px;
      }
      .box{
        @include flex(row, flex-start, flex-start);
        flex-wrap: wrap;
        width: calc(100%/2 - 20px);
        border-bottom: 1px solid #ddd !important;
        border-left: 1px solid #ddd !important;
        border-right: 1px solid #ddd !important;
        overflow: hidden;
        padding-bottom: 10px;
        float: left;
        .detail-title{
          margin-top: 0px !important;
        }
        .detailList{
          width: 100%;
        }
        .detailList .group .info-attach .list-info{
          width: 100%
        }
      }
      .checkResult{
        .box {
          width: $all;
          border: 1px solid #ddd;
          box-sizing: border-box;
          border-radius: 4px;
        }
        .firbutton{
          display: none;
        }
        .review{
          width: $all/2;
          margin-bottom: 20px;
          text-align: left;
          .el-form-item{
            margin-bottom: 10px;
            .search-form-label{
              text-align: left;
            }
          }
          .resultbutton{
            text-align: right;
          }
          .uploadBox{
            width: $all;
            display: flex;
            .uploadButton{
              width: 50%;
              text-align: center;
              ul{
                display: none;
              }
            }
            .swiperPreview{
              width: 50%
            }
            .swiper-slide-file{
              display: -webkit-box;
              img{
                height: 70px,
              }
            }
          }
          .el-form{
            padding-bottom: 10px;
          }
        }
      }
      .checkDetail{
        width: 70%;
        margin: 0 auto;
        p {
          text-align: left;
        }
        .firbutton{
          display: none;
        }
        .el-form-item{
          text-align: left;
        }
        .resultbutton{
          text-align: right;
        }
      }
      .swiper-slide-file{
        img{
          height: 70px,
        }
      }
      @media screen and (max-width: 1366px) {
        .el-tabs__item {
          padding: 0 5px!important;
        }
        .operateBox {
          .number-title {
            margin-right: 10px;
            .list-title {
              letter-spacing: -1px;
            }
          }
          .el-button+.el-button {
            margin-left: 8px;
          }
          .el-button--mini {
            padding: 7px 5px;
          }
        }
      }
    }
    .el-form-item__label{
      width: 100%;
      text-align: left;
    }
    .docInfoHeight {
      height: auto;
    }
  }
}
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
.el-tabs--border-card>.el-tabs__header {
  width: $all;
  height: 34px;
  padding-top: 0;
  position: relative;
  @include flex(row, space-between, center);
  background: $titleUrlImg repeat-x 0 -15px;
}
.el-tabs__item {
  height: 35px;
  line-height: 35px;
}
.el-tabs.el-tabs--top.el-tabs--border-card {
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  .el-tabs__header.is-top {
    border-radius: 4px;
  }
  .el-tabs__content {
    height: calc(100% - 35px);
    overflow: hidden;
    padding: 0;
    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }
}
.addToTilModal {
  .el-dialog__body {
    padding: 10px 20px 30px;
    .search-form-item {
      .search-form-label {
        text-align: left;
      }
    }
    .search-form-btn {
      display: none;
    }
  }
  .addToTilBtnClass {
    padding-top: 10px;
    text-align: right;
    padding-bottom: 20px;
  }
  .viewer-title{
    display: none!important;
  }
}
</style>
