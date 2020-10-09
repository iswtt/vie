<template>
  <div id="tabList">
    <el-tabs v-if="showTabs" ref="allTabList" class="tablistCon" v-model="activeTabName" type="card" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in tabData" :label="item.tabLabel" :name="'tabItem' + index" :key="index">
        <div v-if="item.showMode === 'Table'" class="tabContent" v-bar>
          <div>
            <div class="tableList hisTableList">
              <ComForm :searchIpt="item.tableData.searchIpt" :searchFunc="item.tableData.searchFunc" :formRule='item.tableData.formRule'></ComForm>
              <ComTable ref="typicalTable" @listenToSelectDataEvent='selectTypicalRow' :tableData="item.tableData.tableInfoData" :tableGroup="item.tableData.tableInfoGroup" ></ComTable>
            </div>
            <div class="compareTab">
              <el-tabs v-model="originalImageTab.activeName" type="card">
                <el-tab-pane :label="originalImageTab.activeName" :name="originalImageTab.activeName">
                  <div class="info-container" v-bar>
                    <div>
                      <panelTitle :panelTitleInit="originalImageTab.imageInfoTitle"></panelTitle>
                      <div class="basic-info">
                        <img id="originalTypicalScanImg" class="scanImg" :src="originalImageTab.originalImageTabInfo.imgSrc" @click="LookImg('originalTypicalScanImg')">
                        <Cswiper v-if="originalTypicalImageTabInfo.showSwiper" :propOption='originalTypicalImageTabInfo.attachmentOption' :listData='originalTypicalImageTabInfo.attachmentData'></Cswiper>
                        <detailList :listData="originalImageTab.originalImageTabInfo.imageInfoForm" :widthStyle="imageInfoStyle" :listRule="originalImageTab.originalImageTabInfo.refName"></detailList>
                      </div>
                      <div class="documentInfoContent">
                        <DocInfo :infoData="originalImageTab.docInfoData"></DocInfo>
                      </div>
                      <!-- <panelTitle :panelTitleInit="originalImageTab.documentInfoTitle"></panelTitle>
                      <div class="other-info">{{$t('vicenter.common.nodata')}}</div> -->
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <el-tabs :class="{showCompareTab: selectedTypicalRow.length === 0}" v-model="compareTypicalImageTab.activeName" type="card" closable @tab-click="compareTypicalImageTab.clickTab" @tab-remove="compareTypicalImageTab.removeTab">
                <el-tab-pane v-for="(item, index) in compareTypicalImageTab.compareImageTabInfo" :key="index" :label="item.imageName" :name="item.id">
                  <div class="info-container" v-bar v-loading="typicalInfoLoading">
                    <div>
                      <panelTitle :panelTitleInit="compareTypicalImageTab.imageInfoTitle"></panelTitle>
                      <div class="basic-info">
                        <img id="compareTypicalScanImg" class="scanImg" :src="item.imgSrc" @click="LookImg('compareTypicalScanImg')">
                        <Cswiper v-if="item.showSwiper" :propOption='item.attachmentOption' :listData='item.attachmentData'></Cswiper>
                        <detailList v-if="item.imageInfoForm" :listData="item.imageInfoForm" :widthStyle="imageInfoStyle" :listRule="'compareTypicalImageDetailList' + index"></detailList>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <div v-if="item.showMode === 'Image'" class="tabContent" v-bar>
          <div>
            <ul v-if="hasImgByImgData" class="imageList">
              <li v-for="(e, index) in item.imageData" :key="index">
                <div class="imgShow">
                  <img v-if="e.imgSrc" :src="e.imgSrc">
                  <img v-else :src="defaultImg">
                </div>
                <ul class="imgDesc">
                  <li v-for="(info, index) in e.imgInfo" :key="index" :class="{hiddenInfo: !info.show}">
                    <span>{{info.label}} :</span>
                    <span>{{info.value}}</span>
                  </li>
                </ul>
                <div class="operateBtn">
                  <el-button class="findImg" type="primary" size="small" @click='showCompareDialog(e)' data-id="imgCompare-btn">{{$t('vicenter.common.findImg.compare')}}</el-button>
                </div>
                <div></div>
              </li>
            </ul>
            <div class="noData" v-else >{{$t('vicenter.common.nodata')}}</div>
          </div>
        </div>
        <div v-if="item.showMode === 'hisImage'" class="tabContent" v-bar>
          <div>
            <div class="tableList hisTableList">
              <ComForm :searchIpt="item.tableData.searchIpt" :searchFunc="item.tableData.searchFunc" :formRule='item.tableData.formRule'></ComForm>
              <ComTable ref="hisTable" @listenToSelectDataEvent='selectHisRow' :tableData="item.tableData.tableInfoData" :tableGroup="item.tableData.tableInfoGroup" ></ComTable>
            </div>
            <div class="compareTab">
              <el-tabs v-model="originalImageTab.activeName" type="card">
                <el-tab-pane :label="originalImageTab.activeName" :name="originalImageTab.activeName">
                  <div class="info-container" v-bar>
                    <div>
                      <panelTitle :panelTitleInit="originalImageTab.imageInfoTitle"></panelTitle>
                      <div class="basic-info">
                        <img id="originalScanImg" class="scanImg" :src="originalImageTab.originalImageTabInfo.imgSrc" @click="LookImg('originalScanImg')">
                        <Cswiper v-if="originalImageTab.originalImageTabInfo.showSwiper" :propOption='originalImageTab.originalImageTabInfo.attachmentOption' :listData='originalImageTab.originalImageTabInfo.attachmentData'></Cswiper>
                        <detailList :listData="originalImageTab.originalImageTabInfo.imageInfoForm" :widthStyle="imageInfoStyle" :listRule="originalImageTab.originalImageTabInfo.refName"></detailList>
                      </div>
                      <div class="documentInfoContent">
                        <DocInfo :infoData="originalImageTab.docInfoData"></DocInfo>
                      </div>
                      <!-- <panelTitle :panelTitleInit="originalImageTab.documentInfoTitle"></panelTitle>
                      <div class="other-info">{{$t('vicenter.common.nodata')}}</div> -->
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <el-tabs :class="{showCompareTab: selectedHisRow.length === 0}" v-model="compareImageTab.activeName" type="card" closable @tab-click="compareImageTab.clickTab" @tab-remove="compareImageTab.removeTab">
                <el-tab-pane v-for="(item, index) in compareImageTab.compareImageTabInfo" :key="index" :label="item.scanSerialNumber" :name="item.id">
                  <div class="info-container" v-bar v-loading="hisInfoLoading">
                    <div>
                      <panelTitle :panelTitleInit="compareImageTab.imageInfoTitle"></panelTitle>
                      <div class="basic-info">
                        <img id="compareScanImg" class="scanImg" :src="item.imgSrc" @click="LookImg('compareScanImg')">
                        <Cswiper v-if="item.showSwiper" :propOption='item.attachmentOption' :listData='item.attachmentData'></Cswiper>
                        <detailList v-if="item.imageInfoForm" :listData="item.imageInfoForm" :widthStyle="imageInfoStyle" :listRule="'compareImageDetailList' + index"></detailList>
                      </div>
                      <panelTitle :panelTitleInit="compareImageTab.insConclusionInfoTitle"></panelTitle>
                      <ComTable v-if="item.insConclusionTableData" :tableData='item.insConclusionTableData' :tableGroup='insConclusionTableGroup'></ComTable>
                      <div class="documentInfoContent">
                        <DocInfo :infoData="item.docInfoData || []"></DocInfo>
                      </div>
                      <!-- <panelTitle :panelTitleInit="compareImageTab.documentInfoTitle"></panelTitle>
                      <div class="other-info">{{$t('vicenter.common.nodata')}}</div> -->
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :width="compareImgModal.width" :top="compareImgModal.top" @close="compareImgModal.resetModal" :title="compareImgModal.title" :visible.sync="compareImgModal.flag" :close-on-click-modal='false' :close-on-press-escape='false' :modal-append-to-body='false' :append-to-body='true'>
      <div class="imageInfoBox">
        <div class="imageBox" v-bar>
          <div>
            <img :src="imageCompareData.original.imgSrc" alt="">
          </div>
        </div>
        <div class="infoBox" v-bar>
          <div>
            <ul v-for="(item, index) in imageCompareData.original.info" :key="index">
              <li>{{item.label}}</li>
              <li :data-id="item.ruleProp + '-original-li'">{{item.value}}</li>
            </ul>
          </div>
        </div>
        <div class="tag">{{$t('vicenter.common.findImg.originalImg')}}</div>
      </div>
      <div class="imageInfoBox">
        <div class="imageBox" v-bar>
          <div>
            <img :src="imageCompareData.compared.imgSrc" alt="">
          </div>
        </div>
        <div class="infoBox" v-bar>
          <div>
            <ul v-for="(item, index) in imageCompareData.compared.info" :key="index">
              <li>{{item.label}}</li>
              <li :data-id="item.ruleProp + '-compared-li'">{{item.value}}</li>
            </ul>
          </div>
        </div>
        <div class="tag">{{$t('vicenter.common.findImg.compareImg')}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/api/imageLibrary/imageManagement.js'
import hisAjax from '@/api/inspection/History.js'
import hscodeAjax from '@/api/background/HSCode.js'
import insCommonAjax from '@/api/inspection/common.js'
import ComTable from '@/components/table'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import detailList from '@/components/detailList'
import Cswiper from '@/components/swipe'
import viProbe from '@/lib/viprobe/viProbeForIns.js'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import DocInfo from '@/components/documentInfomation'
export default {
  name: 'tabList',
  data () {
    return {
      hideTab: {
        showAIResult: false, // 是否集成AI
        imageLibraryEnable: false // 是否集成典图系统
      },
      showTabs: true,
      hasImgByImgData: false,
      defaultImg: require('@/assets/img/common/ViCenter.png'),
      activeTabName: 'tabItem0',
      compareImgModal: {
        title: this.$t('vicenter.common.findImg.compareImages'),
        flag: false,
        width: '70%',
        top: '100px',
        resetModal: this.closeCompareImgModal
      },
      openedImgNum: 1, // viprobe已经打开的图像数量
      selectedHisRow: [], // 已经勾选的历史图像数量
      selectedTypicalRow: [], // 已经勾选的典型图像数量
      hisInfoLoading: false,
      typicalInfoLoading: false,
      attachmentOptionCommon: {
        propId: '',
        height: '70px',
        width: '87%',
        slidesPerView: 6,
        spaceBetween: 10,
        autoplay: false,
        delay: 10,
        navigate: {
          position: 'outside',
          type: 'shadow'
        },
        hasFile: true
      },
      imageInfoFormCommon: [
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
      typicalImageInfoFormCommon: [
        {
          label: this.$t('vicenter.ImageLibrary.common.hsCodes'),
          value: '',
          ruleProp: 'hsCodes'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.ImageName'),
          value: '',
          ruleProp: 'imageName'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
          value: '',
          ruleProp: 'imageType'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.seizedGoods'),
          value: '',
          ruleProp: 'seizedType'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation'),
          value: '',
          ruleProp: 'seizedLocation'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.imageDesc'),
          value: '',
          ruleProp: 'remarks'
        }
      ],
      originalImageTab: {
        docInfoData: [],
        activeName: '',
        imageInfoTitle: {
          title: this.$t('vicenter.common.findImg.scanImageInfo')
        },
        documentInfoTitle: {
          title: this.$t('vicenter.common.findImg.ducumentInfo')
        },
        originalImageTabInfo: {
          imgSrc: '',
          attachmentOption: {},
          attachmentData: [],
          imageInfoForm: [],
          refName: 'originalImageDetailList',
          showSwiper: false
        }
      },
      originalTypicalImageTabInfo: {
        attachmentOption: {},
        attachmentData: [],
        showSwiper: false
      },
      compareImageTab: {
        activeName: '',
        clickTab: this.clickTab,
        removeTab: this.removeTab,
        imageInfoTitle: {
          title: this.$t('vicenter.common.findImg.scanImageInfo')
        },
        insConclusionInfoTitle: {
          title: this.$t('vicenter.common.findImg.insConclusionInfo')
        },
        documentInfoTitle: {
          title: this.$t('vicenter.common.findImg.ducumentInfo')
        },
        compareImageTabInfo: []
      },
      compareTypicalImageTab: {
        activeName: '',
        clickTab: this.clickTypicalTab,
        removeTab: this.removeTypicalTab,
        imageInfoTitle: {
          title: this.$t('vicenter.common.findImg.scanImageInfo')
        },
        compareImageTabInfo: []
      },
      insConclusionTableData: {
        refName: 'insConclusionTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort
      },
      insConclusionTableGroup: [
        {
          label: this.$t('vicenter.common.No'),
          type: 'index'
        },
        {
          label: this.$t('vicenter.common.findImg.insConclusionInfo'),
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
      tabData: [
        {
          tabLabel: this.$t('vicenter.common.findImg.hisImageCompare'),
          showMode: 'hisImage',
          tableData: {
            tableInfoData: {
              refName: 'hisImgTable',
              data: [],
              isBorder: true,
              isStripe: true,
              isPage: false,
              sortMethod: this.getSort,
              layout: 'total, prev, pager, next, jumper',
              page: {
                CurrentPage: 0,
                pagesize: 5,
                handleSizeChange: this.handleHisSizeChange,
                handleCurrentChange: this.handleHisCurrentChange,
                Allpage: 0
              }
            },
            tableInfoGroup: [
              {
                type: 'selection',
                width: '60px'
              },
              {
                label: this.$t('vicenter.inspection.history.site'),
                type: 'text',
                model: 'siteName',
                width: ''
              },
              {
                label: this.$t('vicenter.inspection.history.LPN'),
                type: 'text',
                model: 'lpnFront',
                width: ''
              },
              {
                label: this.$t('vicenter.inspection.common.lpnBack'),
                type: 'text',
                model: 'lpnBackCsv',
                width: ''
              },
              {
                label: this.$t('vicenter.inspection.history.declarationNo'),
                type: 'text',
                model: 'decNumCvs',
                width: ''
              },
              {
                label: this.$t('vicenter.inspection.history.containerNo'),
                type: 'text',
                model: 'containerNumCsv',
                width: ''
              },
              {
                label: this.$t('vicenter.inspection.common.scanningTime'),
                type: 'text',
                model: 'scanTime',
                width: ''
              },
              {
                label: this.$t('vicenter.inspection.history.conclusion'),
                type: 'text',
                model: 'concImgcheck',
                width: ''
              },
              {
                label: this.$t('vicenter.supervise.taskInspection.concManual'),
                type: 'text',
                model: 'concManual',
                width: '230px'
              }
            ],
            searchIpt: [
              {
                getLabel: this.$t('vicenter.inspection.history.LPN'),
                type: 'text',
                placeHolder: '',
                models: '',
                ruleProp: 'lpnFront'
              },
              {
                getLabel: this.$t('vicenter.inspection.history.containerNo'),
                type: 'text',
                placeHolder: '',
                models: '',
                ruleProp: 'containerNumCsv'
              },
              {
                getLabel: this.$t('vicenter.inspection.history.declarationNo'),
                type: 'text',
                placeHolder: '',
                models: '',
                ruleProp: 'decNumCvs'
              }
            ],
            searchFunc: {
              query: this.getHisList,
              queryText: this.$t('vicenter.common.query'),
              resetText: this.$t('vicenter.common.reset')
            },
            formRule: {
              refName: 'hisQueryForm',
              rule: {},
              model: {
                lpnFront: '',
                containerNumCsv: '',
                decNumCvs: ''
              }
            }
          }
        },
        {
          tabLabel: this.$t('vicenter.common.findImg.textQuery'),
          showMode: 'Table',
          tableData: {
            tableInfoData: {
              refName: 'typicalImgTable',
              data: [],
              isBorder: true,
              isStripe: true,
              isPage: false,
              sortMethod: this.getSort,
              layout: 'total, prev, pager, next, jumper',
              page: {
                CurrentPage: 0,
                pagesize: 5,
                Allpage: 0,
                handleSizeChange: this.handleSizeChange,
                handleCurrentChange: this.handleCurrentChange
              }
            },
            tableInfoGroup: [
              {
                type: 'selection',
                width: '60px'
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.hsCodes'),
                type: 'text',
                model: 'hsCodes',
                width: ''
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.ImageName'),
                type: 'text',
                model: 'imageName',
                width: ''
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
                type: 'text',
                model: 'imageType',
                width: ''
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.seizedGoods'),
                type: 'text',
                model: 'seizedType',
                width: ''
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation'),
                type: 'text',
                model: 'seizedLocation',
                width: ''
              },
              {
                label: this.$t('vicenter.ImageLibrary.common.imageDesc'),
                type: 'text',
                model: 'remarks',
                width: ''
              }
            ],
            searchIpt: [
              {
                getLabel: this.$t('vicenter.ImageLibrary.common.Imagetype'),
                type: 'select',
                clearable: true,
                models: '',
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
                getLabel: this.$t('vicenter.ImageLibrary.common.seizedGoods'),
                type: 'select',
                clearable: true,
                models: '',
                ruleProp: 'contrabandType',
                option: []
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
                  defaultExpandedKeys: []
                }
              },
              {
                getLabel: this.$t('vicenter.ImageLibrary.common.imageDesc'),
                type: 'text',
                placeHolder: '',
                models: '',
                ruleProp: 'imageDesc'
              }
            ],
            searchFunc: {
              query: this.query,
              queryText: this.$t('vicenter.common.query'),
              resetText: this.$t('vicenter.common.reset')
            },
            formRule: {
              refName: 'typicalQueryForm',
              rule: {},
              model: {
                imageType: '',
                contrabandType: '',
                imageDesc: '',
                hsCodes: '',
                imageStatus: 'PUBLISHED',
                page: 0,
                size: 5
              }
            }
          }
        },
        {
          tabLabel: this.$t('vicenter.common.findImg.imgCompare'),
          showMode: 'Image',
          imageData: []
        }
      ],
      imageInfoStyle: {
        width: '33.33%'
      },
      imageCompareData: {
        original: {
          imgSrc: '',
          info: [
            {
              label: this.$t('vicenter.common.findImg.originalImgName'),
              value: '',
              ruleProp: 'scanSerialNumber'
            },
            {
              label: this.$t('vicenter.common.findImg.sourceSite'),
              value: '',
              ruleProp: 'siteName'
            },
            {
              label: this.$t('vicenter.common.findImg.goodsInfo'),
              value: '',
              ruleProp: 'hsCodes'
            }
          ]
        },
        compared: {
          imgSrc: '',
          info: [
            {
              label: this.$t('vicenter.common.findImg.compareImgName'),
              value: '',
              ruleProp: 'imageName'
            },
            {
              label: this.$t('vicenter.common.findImg.sourceSite'),
              value: '',
              ruleProp: 'siteName'
            },
            {
              label: this.$t('vicenter.common.findImg.goodsInfo'),
              value: '',
              ruleProp: 'hsCodes'
            }
          ]
        }
      },
      scanSerialNumber: '',
      hscodeAllData: [],
      allOpenedImg: [], // 存放除原图外所有已打开的历史图像流水号
      allOpenedTypicalImg: [] // 存放除原图外所有已打开的典型图像名称
    }
  },
  created () {
    this.hideTab = {
      showAIResult: this.$getSystemConfig('aiEnable'),
      imageLibraryEnable: window.config.imageLibraryEnable
    }
    // 文本检索页面需要加载hscode和查获物类型
    if (this.hideTab.imageLibraryEnable) {
      this.hscodeAjaxTree()
      this.$getDataByTypecode(['CONTRABAND_TYPE'], ['contrabandType'], this.tabData[1].tableData.searchIpt)
    }
    // 以图找图页面AI返回的图像流水号处理
    if (this.hideTab.imageLibraryEnable && this.hideTab.showAIResult) {
      let searchImgByImgData = this.$props.searchImgByImgData && this.$isJsonString(this.$props.searchImgByImgData) ? JSON.parse(this.$props.searchImgByImgData) : ''
      if (searchImgByImgData) {
        let wimappingResult = searchImgByImgData['wimapping_result']['wimapping_items']
        if (wimappingResult && wimappingResult.length > 0) {
          let tempArr = []
          wimappingResult.forEach(e => {
            tempArr.push(e['image_id'])
          })
          this.scanSerialNumber = tempArr.join(',')
        }
      }
    }
    // 获取当前原图图像的相关信息
    this.getCurrentImgInfo(this.$props.currentImgData)
    // 查询条件输入框增加校验
    this.tabData[0].tableData.formRule.rule.containerNumCsv = this.$allRules().containerNumCsv
  },
  mounted () {
    // 判断以图找图和文本检索tab页签是否显示
    if (this.hideTab.imageLibraryEnable) {
      if (!this.hideTab.showAIResult) {
        // 集成典图系统但没有集成AI的时候，隐藏以图找图页面
        this.$nextTick(function () {
          this.$refs.allTabList.$children[0].$refs.tabs[2].style.display = 'none'
        })
      }
    } else {
      // 没有集成典图系统的时候，隐藏文本检索和以图找图页面
      this.$nextTick(function () {
        this.$refs.allTabList.$children[0].$refs.tabs[1].style.display = 'none'
        this.$refs.allTabList.$children[0].$refs.tabs[2].style.display = 'none'
      })
    }
    // 以图找图页面根据AI返回的图像流水号从典图已发布的图像中查找图像
    if (this.hideTab.imageLibraryEnable && this.hideTab.showAIResult) {
      if (this.scanSerialNumber) {
        let params = {
          scanSerialNumber: this.scanSerialNumber,
          imageStatus: 'PUBLISHED'
        }
        console.log('获取以图找图数据')
        this.getImageList(params)
      }
    }
    // 文本检索页面从典图中获取已发布的图像
    if (this.hideTab.imageLibraryEnable) {
      console.log('获取文本检索数据')
      this.query()
    }
    // 历史图像对比页面获取历史列表数据
    this.getHisList()
  },
  methods: {
    getCurrentImgInfo (data) {
      this.imageCompareData.original.imgSrc = data.taskObject.lastScanImage
      this.imageCompareData.original.info.forEach(e => {
        e.value = data.taskObject[e.ruleProp]
      })
      // 设置历史图像对比页面查询条件默认值
      this.tabData[0].tableData.searchIpt.forEach(obj => {
        obj.models = data.taskObject[obj.ruleProp]
        this.tabData[0].tableData.formRule.model[obj.ruleProp] = data.taskObject[obj.ruleProp]
      })
      // 历史图像对比原图信息加载
      this.originalImageTab.activeName = data.taskObject.scanSerialNumber
      this.originalImageTab.originalImageTabInfo.scanningImgName = data.taskObject.scanSerialNumber
      this.originalImageTab.originalImageTabInfo.scanImagePath = data.taskObject.scanImagePath
      this.originalImageTab.originalImageTabInfo.taskMarks = data.taskMarks
      // 扫描图像
      this.originalImageTab.originalImageTabInfo.imgSrc = data.taskObject.lastScanImage
      // 扫描图像信息
      this.initScanImageInfo(this.originalImageTab.originalImageTabInfo, data.taskObject)
      // 附件
      this.originalImageTab.originalImageTabInfo.showSwiper = false
      this.originalTypicalImageTabInfo.showSwiper = false
      this.initAttachInfo(this.originalImageTab.originalImageTabInfo, data.taskAttachementObjects, 'originalAttach')
      this.initAttachInfo(this.originalTypicalImageTabInfo, data.taskAttachementObjects, 'originalTypicalAttach')
      // viprobe打开图像(除了审图详情和复审详情，其他页面打开辅助审像模态框时需要打开原图)
      if (this.$route.path !== '/Inspection/Image-Analysis-detail' && this.$route.path !== '/Inspection/Recheck-detail') {
        this.openViprobe(this.originalImageTab.originalImageTabInfo.scanningImgName, this.originalImageTab.originalImageTabInfo.scanImagePath, this.originalImageTab.originalImageTabInfo.scanningImgFiles, this.originalImageTab.originalImageTabInfo.isUff, false, false, this.originalImageTab.originalImageTabInfo)
      }
    },
    getImageList (params) {
      ajax.getImgLibList(params).then(res => {
        if (res.data.flag) {
          let { content } = res.data.result
          if (content.length > 0) {
            this.hasImgByImgData = true
            content.forEach(e => {
              let imageCollectModes = ['MANNUAL', 'SUPERVISION']
              this.tabData[2].imageData.push(
                {
                  imgSrc: e.lastImage,
                  imageId: e.id,
                  imgInfo: [
                    {
                      label: this.$t('vicenter.ImageLibrary.common.ImageName'),
                      value: e.imageName,
                      ruleProp: 'imageName',
                      show: true
                    },
                    {
                      label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
                      value: e.imageType ? this.$t(`vicenter.ImageLibrary.common.imageType.${e.imageType}`) : '',
                      ruleProp: 'imageType',
                      show: true
                    },
                    {
                      label: this.$t('vicenter.common.findImg.addMode'),
                      value: e.imageCollectMode ? this.$t(`vicenter.ImageLibrary.common.AcquisitionMode.${imageCollectModes[e.imageCollectMode - 1]}`) : '',
                      ruleProp: 'imageCollectMode',
                      show: true
                    },
                    {
                      label: this.$t('vicenter.common.findImg.sourceSite'),
                      value: e.siteName,
                      ruleProp: 'siteName',
                      show: true
                    },
                    {
                      label: this.$t('vicenter.common.findImg.sourceSite'),
                      value: e.hsCodes,
                      ruleProp: 'hsCodes',
                      show: false
                    }
                  ]
                }
              )
            })
          } else {
            this.hasImgByImgData = false
          }
        }
      }).catch(() => {})
    },
    getList (params) {
      ajax.getImgLibList(params).then(res => {
        if (res.data.flag) {
          let { content, pageable, totalElements } = res.data.result
          this.tabData[1].tableData.tableInfoData.data = content
          if (this.tabData[1].tableData.tableInfoData.data.length > 0) {
            this.tabData[1].tableData.tableInfoData.isPage = true
          } else {
            this.tabData[1].tableData.tableInfoData.isPage = false
            return
          }
          this.tabData[1].tableData.tableInfoData.page.CurrentPage = pageable.pageNumber
          this.tabData[1].tableData.tableInfoData.page.Allpage = totalElements
          this.tabData[1].tableData.formRule.model.page = pageable.pageNumber
          this.tabData[1].tableData.tableInfoData.data.forEach(item => {
            // 图像类型
            item.imageTypeCode = item.imageType
            item.imageType = item.imageType ? this.$t(`vicenter.ImageLibrary.common.imageType.${item.imageType}`) : ''
            // 查获物类型
            if (item.seizedType) {
              let typeArr = item.seizedType.split(',')
              let _typeArr = []
              typeArr.forEach(e => {
                _typeArr.push(this.$t(`vicenter.DIC.T_CONTRABAND_TYPE.C_${e}`))
              })
              item.seizedType = _typeArr.join(',')
            } else {
              item.seizedType = ''
            }
            // 查获物位置
            if (item.seizedLocation) {
              let localArr = item.seizedLocation.split(',')
              let _localArr = []
              localArr.forEach(e => {
                _localArr.push(this.$t(`vicenter.DIC.T_CONTRABAND_LOCATION.C_${e}`))
              })
              item.seizedLocation = _localArr.join(',')
            } else {
              item.seizedLocation = ''
            }
          })
        }
      }).catch(() => {})
    },
    // 选择典型图像
    selectTypicalRow (data) {
      this.selectedTypicalRow = data.map(el => {
        return el
      })
      if (this.selectedTypicalRow.length > window.config.maxCompareImgQty - this.openedImgNum - this.selectedHisRow.length) {
        this.$NotifPrompt(this.$t('vicenter.common.findImg.maxOpenImageQty', {msg: window.config.maxCompareImgQty - this.openedImgNum}))
        this.$refs.typicalTable[0].$refs['typicalImgTable'].toggleRowSelection(data[data.length - 1], false)
      }
    },
    // 选择历史图像
    selectHisRow (data) {
      this.selectedHisRow = data.map(el => {
        return el
      })
      if (this.selectedHisRow.length > window.config.maxCompareImgQty - this.openedImgNum - this.selectedTypicalRow.length) {
        this.$NotifPrompt(this.$t('vicenter.common.findImg.maxOpenImageQty', {msg: window.config.maxCompareImgQty - this.openedImgNum}))
        this.$refs.hisTable[0].$refs['hisImgTable'].toggleRowSelection(data[data.length - 1], false)
      }
    },
    // 获取历史列表数据
    getHisList (flag) {
      // 加载列表数据
      this.tabData[0].tableData.tableInfoData.data = []
      this.tabData[0].tableData.tableInfoData.isPage = false
      // 设置请求列表数据参数
      if (!flag) {
        this.tabData[0].tableData.tableInfoData.page.CurrentPage = 0
        // 清空选中的列表数据
        this.$refs.hisTable[0].$refs['hisImgTable'].clearSelection()
      }
      let otherParams = {
        size: this.tabData[0].tableData.tableInfoData.page.pagesize,
        page: this.tabData[0].tableData.tableInfoData.page.CurrentPage
      }
      let hisParams = Object.assign(otherParams, this.tabData[0].tableData.formRule.model)
      hisAjax.getHisTableList(hisParams).then((res) => {
        if (res.data.flag) {
          let { content, totalElements } = res.data.result
          this.tabData[0].tableData.tableInfoData.data = content
          this.tabData[0].tableData.tableInfoData.data.forEach(obj => {
            obj.scanTime = this.$options.filters['formatDate'](obj.scanTime, this.$t('vicenter.common.formatDate'))
            obj.concManual = obj.concManual ? this.$t(obj.concManual) : ''
            obj.concImgcheck = obj.concImgcheck ? this.$t(obj.concImgcheck) : ''
          })
          this.tabData[0].tableData.tableInfoData.page.Allpage = totalElements
          if (this.tabData[0].tableData.tableInfoData.data.length > 0) {
            this.tabData[0].tableData.tableInfoData.isPage = true
          }
        }
      }).catch(() => {})
    },
    // 对比图像tab页点击
    clickTab (tab, event) {
      this.compareImageTab.compareImageTabInfo.forEach(item => {
        if (item.attachmentData.length > 0) {
          item.showSwiper = false
          this.$nextTick(() => {
            item.showSwiper = true
          })
        }
      })
    },
    // 对比图像tab页移除
    removeTab (targetName) {
      if (this.selectedHisRow.length > 0) {
        this.selectedHisRow.forEach((item, index) => {
          if (item.id === targetName) {
            this.$refs.hisTable[0].$refs['hisImgTable'].toggleRowSelection(this.selectedHisRow[index], false)
          }
        })
      }
    },
    // 对比典型图像tab页点击
    clickTypicalTab (tab, event) {
      this.compareTypicalImageTab.compareImageTabInfo.forEach(item => {
        if (item.attachmentData.length > 0) {
          item.showSwiper = false
          this.$nextTick(() => {
            item.showSwiper = true
          })
        }
      })
    },
    // 对比典型图像tab页移除
    removeTypicalTab (targetName) {
      if (this.selectedTypicalRow.length > 0) {
        this.selectedTypicalRow.forEach((item, index) => {
          if (item.id === targetName) {
            this.$refs.typicalTable[0].$refs['typicalImgTable'].toggleRowSelection(this.selectedTypicalRow[index], false)
          }
        })
      }
    },
    // 获取历史图像详情信息
    getHisImgDetail (taskId) {
      return new Promise(function (resolve, reject) {
        hisAjax.getTaskDetail({id: taskId}).then(res => {
          if (res.data.flag) {
            resolve(res.data.result)
          }
        }).catch((err) => {
          reject(err)
        })
      })
    },
    getDetail (data) {
      let {taskObject, taskAttachementObjects, imgCheckObjects, manualCheckObject} = data
      this.compareImageTab.compareImageTabInfo.forEach((item, index) => {
        if (item.id === taskObject.id) {
          item.imgSrc = taskObject.lastScanImage
          item.scanningImgName = taskObject.scanSerialNumber
          item.scanImagePath = taskObject.scanImagePath
          // 处理扫描图像信息
          this.initScanImageInfo(item, taskObject)
          // 处理查验结论信息
          this.initInsClusionInfo(item, imgCheckObjects, manualCheckObject)
          // 处理附件信息
          this.initAttachInfo(item, taskAttachementObjects, `compareAttach${index}`)
          // 处理单据信息
          item.docInfoData = []
        }
      })
    },
    getTypicalDetail (data) {
      this.compareTypicalImageTab.compareImageTabInfo.forEach((item, index) => {
        if (item.id === data.id) {
          item.imgSrc = data.lastImage
          item.scanningImgName = data.imageName + '.'
          item.scanImagePath = data.lastImage.substring(0, data.lastImage.lastIndexOf('/') + 1)
          // 处理扫描图像信息
          this.initTypicalScanImageInfo(item, data)
          // 处理附件信息
          this.initTypicalAttachInfo(item, data.fileList, `compareTypicalAttach${index}`)
        }
      })
    },
    // 处理扫描图像信息
    initScanImageInfo (tabInfo, data) {
      tabInfo.imageInfoForm = []
      tabInfo.imageInfoForm = JSON.parse(JSON.stringify(this.imageInfoFormCommon))
      tabInfo.imageInfoForm.forEach(e => {
        e.value = data[e.ruleProp]
        if (e.ruleProp === 'checkinTime') {
          if (data[e.ruleProp] !== null) {
            e.value = this.$options.filters['formatDate'](data[e.ruleProp])
          }
        }
        if (e.ruleProp === 'vehicleType') {
          e.value = this.$t(data[e.ruleProp])
        }
      })
    },
    // 处理查验结论信息
    initInsClusionInfo (tabInfo, imgCheckObjects, manualCheckObject) {
      tabInfo.insConclusionTableData = {
        refName: 'insConclusionTable',
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        sortMethod: this.getSort
      }
      if (imgCheckObjects && imgCheckObjects.length > 0) {
        imgCheckObjects.forEach(e => {
          tabInfo.insConclusionTableData.data.push({
            conclusion: e.conclusion ? this.$t(e.conclusion) : '',
            contrabandLocation: e.contrabandLocation ? this.$t(e.contrabandLocation) : '',
            contrabandType: e.contrabandType ? this.$t(e.contrabandType) : '',
            taskLink: e.taskLink ? this.$t(e.taskLink) : '',
            remark: e.remark
          })
        })
      }
      if (manualCheckObject != null) {
        let contrabandTypeArr = []
        let contrabandLocationArr = []
        // 查获物
        if (manualCheckObject.seizedObjects && manualCheckObject.seizedObjects.length > 0) {
          contrabandTypeArr = manualCheckObject.seizedObjects.map(e => {
            return this.$t(e.seizedType)
          })
        }
        // 查获位置
        contrabandLocationArr = manualCheckObject.contrabandLocation ? manualCheckObject.contrabandLocation.split(',').map(e => { return this.$t(e) }) : []
        tabInfo.insConclusionTableData.data.push({
          conclusion: manualCheckObject.conclusion ? this.$t(manualCheckObject.conclusion) : '',
          contrabandLocation: contrabandLocationArr.length ? contrabandLocationArr.join(',') : '',
          contrabandType: contrabandTypeArr.length > 0 ? contrabandTypeArr.join(',') : '',
          taskLink: this.$t('vicenter.DIC.T_TIMELINE_NODE.C_MANUAL_CHECK'),
          remark: manualCheckObject.remark
        })
      }
    },
    // 处理附件信息
    initAttachInfo (tabInfo, data, propId) {
      if (data == null) {
        return
      }
      tabInfo.attachmentOption = Object.assign({}, this.attachmentOptionCommon)
      tabInfo.attachmentOption.propId = propId
      tabInfo.attachmentData = []
      let {CHECKIN, SCANNING, MANUAL_CHECK} = data
      if (CHECKIN != null) {
        CHECKIN.forEach(e => {
          let swipeType = this.$options.filters['attachType'](e.fileNameExt)
          let imgObj = {
            type: swipeType,
            src: e.location
          }
          if (e.docType === 'CCR') { // 集装箱附件
            tabInfo.attachmentData.push(imgObj)
          } else if (e.docType === 'LPR') { // 车牌号附件
            tabInfo.attachmentData.push(imgObj)
          } else { // 其他附件
            tabInfo.attachmentData.push(imgObj)
          }
        })
      }
      if (MANUAL_CHECK != null) {
        MANUAL_CHECK.forEach(e => {
          let swipeType = this.$options.filters['attachType'](e.fileNameExt)
          let imgObj = {
            type: swipeType,
            src: e.location
          }
          tabInfo.attachmentData.push(imgObj)
        })
      }
      if (SCANNING != null) {
        tabInfo.isUff = this.$isUFF(SCANNING)
        let res = this.$getScanningData(SCANNING)
        tabInfo.scanningImgFiles = res
      }
      this.$nextTick(() => {
        if (tabInfo.attachmentData.length > 0) {
          this.$nextTick(() => {
            tabInfo.showSwiper = true
          })
        }
      })
    },
    // 处理扫描图像信息
    initTypicalScanImageInfo (tabInfo, data) {
      tabInfo.imageInfoForm = []
      tabInfo.imageInfoForm = JSON.parse(JSON.stringify(this.typicalImageInfoFormCommon))
      tabInfo.imageInfoForm.forEach(e => {
        e.value = data[e.ruleProp]
      })
    },
    initTypicalAttachInfo (tabInfo, data, propId) {
      if (data == null) {
        return
      }
      tabInfo.attachmentOption = Object.assign({}, this.attachmentOptionCommon)
      tabInfo.attachmentOption.propId = propId
      let tmpObj = {
        imageUpData: {
          isUFF: false,
          scanningImgFiles: [],
          allScanningImgFile: [],
          imageFile: {
            filesArr: []
          },
          imageIcon: {
            iconArr: [],
            iconRadio: []
          }
        },
        basicInfoFormData: [
          {
            ruleProp: 'photo',
            listData: []
          }
        ],
        otherInfoFormData: [
          {
            ruleProp: 'otherAttach',
            listData: []
          }
        ]
      }
      // 针对手工录入的图像的处理
      tabInfo.allScanningImgFile = []
      data.forEach(d => {
        if (d.docType === 'LOCAL') {
          tabInfo.allScanningImgFile.push(
            {
              name: d.fileName,
              sign: '',
              md5: ''
            }
          )
        }
      })
      this.$initTILImgData(tmpObj, data)
      tabInfo.attachmentData = tmpObj.basicInfoFormData[0].listData.concat(tmpObj.otherInfoFormData[0].listData)
      tabInfo.isUff = tmpObj.imageUpData.isUFF
      tabInfo.scanningImgFiles = tmpObj.imageUpData.scanningImgFiles
    },
    openViprobe (scanningImgName, scanImagePath, scanningImgFiles, isUFF, isManualAdd = false, isIllegal = false, rowData) {
      // if (isManualAdd) {
      //   // 手工录入的典图
      //   let markFile = isIllegal
      //   viProbe.openRemoteImageInViProbe(scanningImgName, scanImagePath, scanningImgFiles, markFile, false, false)
      //   return
      // }
      var name = scanningImgName// 图像 流水号
      var path = scanImagePath// 到文件夹级别
      var imageFiles = scanningImgFiles// 放入所有的img文件
      var isUff = isUFF
      var markFilePath = scanImagePath + 'suspects_json.mark'
      var stepFilePath = scanImagePath + 'history.steps'
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
        let taskMarks = rowData.taskMarks ? JSON.parse(rowData.taskMarks.replace(/'/g, '"')) : null
        let _markFile = taskMarks || markFilePath
        viProbe.openImageAndAnalysisInfoInViProbe(name, path, imageFiles, _markFile, stepFilePath, null, isUff)
        if (viprobeUtilReturn.reconnectToViProbeFailed !== false) {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
        }
      })
    },
    closeViprobe (scanningName) {
      viProbe.closeImageInViProbe(scanningName)
    },
    LookImg (id) {
      var viewer = new Viewer(document.getElementById(id))
      this.$nextTick().then(() => {
        viewer.update()
      })
    },
    handleTabClick (tab, event) {
      if (this.activeTabName === 'tabItem0') {
        if (this.originalImageTab.originalImageTabInfo.attachmentData.length > 0) {
          this.originalImageTab.originalImageTabInfo.showSwiper = false
          this.$nextTick(() => {
            this.originalImageTab.originalImageTabInfo.showSwiper = true
          })
        }
      } else if (this.activeTabName === 'tabItem1') {
        if (this.originalTypicalImageTabInfo.attachmentData.length > 0) {
          this.originalTypicalImageTabInfo.showSwiper = false
          this.$nextTick(() => {
            this.originalTypicalImageTabInfo.showSwiper = true
          })
        }
      }
    },
    showCompareDialog (data) {
      this.imageCompareData.compared.imgSrc = data.imgSrc
      this.imageCompareData.compared.info.forEach(e => {
        data.imgInfo.forEach(item => {
          if (e.ruleProp === item.ruleProp) {
            e.value = item.value
          }
        })
      })
      this.compareImgModal.flag = true
      // 记录该图像的使用次数
      ajax.addTilImgUsedCount({imageId: data.imageId}).then(res => {}).catch(() => {})
    },
    openCompareDialog (scope) {
      this.imageCompareData.compared.imgSrc = scope.row.lastImage
      this.imageCompareData.compared.info.forEach(e => {
        e.value = scope.row[e.ruleProp]
      })
      this.compareImgModal.flag = true
    },
    closeCompareImgModal () {
      this.compareImgModal.flag = false
    },
    query (flag) {
      let params = {}
      params = JSON.parse(JSON.stringify(this.tabData[1].tableData.formRule.model))
      delete params.contrabandType
      params.seizedType = this.tabData[1].tableData.formRule.model.contrabandType
      params.imageStatus = 'PUBLISHED'
      if (!flag) {
        this.tabData[1].tableData.tableInfoData.page.CurrentPage = 0
        // 清空选中的列表数据
        this.$refs.typicalTable[0].$refs['typicalImgTable'].clearSelection()
      }
      this.getList(params)
    },
    handleSizeChange () {},
    handleCurrentChange (val) {
      this.tabData[1].tableData.formRule.model.page = val - 1
      this.query(true)
    },
    handleHisSizeChange () {},
    handleHisCurrentChange (val) {
      this.tabData[0].tableData.tableInfoData.page.CurrentPage = val - 1
      this.getHisList(true)
    },
    /**
     * 获取hscode树方法
     */
    hscodeAjaxTree () {
      hscodeAjax.getHSCodeTree().then(res => {
        if (res.data.flag) {
          // hscode查询条件以输入建议的形式展示
          this.hscodeAllData = res.data.result
          if (this.hscodeAllData.length > 0) {
            this.hscodeAllData.forEach(item => {
              item.value = item.code
            })
          }
          this.tabData[1].tableData.searchIpt.forEach(e => {
            if (e.ruleProp === 'hsCodes') {
              e.allData = this.hscodeAllData
            }
          })
          // hscode查询条件以结构树的形式展示
          // let treeData = this.$json2treeData(res.data.result, 'id', 'pid')
          // this.tabData[1].tableData.searchIpt.forEach(e => {
          //   if (e.ruleProp === 'hsCodes') {
          //     e.treedata = treeData
          //   }
          // })
        }
      }).catch(() => {})
    },
    /**
     * hscode树点击节点
     */
    hsCodesCheckChange (nodeObj, checkedObj) {
      let checkedValue = this.$hscodeCheckChange(nodeObj, checkedObj)
      if (checkedValue !== null) {
        this.tabData[1].tableData.searchIpt.forEach(e => {
          if (e.ruleProp === 'hsCodes') {
            e.models = checkedValue.name
          }
        })
        this.tabData[1].tableData.formRule.model['hsCodes'] = checkedValue.codes
      }
    },
    treeClick () {},
    getSort () {},
    select () {}
  },
  beforeDestroy () {
    // 关闭模态框之前，审图详情和复审详情关闭除原图之外的所有已打开的图像，其他页面需要关闭所有已打开的图像
    if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
      if (this.$route.path !== '/Inspection/Image-Analysis-detail' && this.$route.path !== '/Inspection/Recheck-detail') {
        viProbe.closeAllImageInViProbe()
      } else {
        let allOpenImgs = []
        allOpenImgs = this.allOpenedImg.concat(this.allOpenedTypicalImg)
        if (allOpenImgs.length > 0) {
          allOpenImgs.forEach(e => {
            console.log('close Viprobe---' + e)
            this.closeViprobe(e)
          })
        }
      }
    }
  },
  props: {
    'currentImgData': { // 当前任务的相关信息
      type: Object,
      default: {}
    },
    'searchImgByImgData': { // json字符串
      type: String,
      default: ''
    }
  },
  watch: {
    'selectedHisRow': {
      handler (newValue, oldValue) {
        this.compareImageTab.compareImageTabInfo = []
        this.allOpenedImg = []
        if (newValue.length > 0) {
          newValue.forEach(obj => {
            this.compareImageTab.compareImageTabInfo.unshift({
              id: obj.id,
              scanSerialNumber: obj.scanSerialNumber,
              showSwiper: false,
              taskMarks: obj.taskMarks
            })
            this.allOpenedImg.unshift(obj.scanSerialNumber)
          })
          // 默认激活第一个tab页签
          this.compareImageTab.activeName = this.compareImageTab.compareImageTabInfo[0].id
          let getHisImgDetailsArr = []
          this.compareImageTab.compareImageTabInfo.forEach(item => {
            getHisImgDetailsArr.push(this.getHisImgDetail(item.id))
          })
          this.hisInfoLoading = true
          // 获取勾选的图像的详情信息
          Promise.all(getHisImgDetailsArr).then(res => {
            if (res && res.length > 0) {
              res.forEach(item => {
                this.getDetail(item)
              })
              this.$nextTick(() => {
                this.compareImageTab.compareImageTabInfo.forEach(item => {
                  if (item.attachmentData.length > 0) {
                    this.$nextTick(() => {
                      item.showSwiper = true
                    })
                  }
                })
                this.hisInfoLoading = false
                // viprobe打开图像
                let oldOpenedImg = oldValue.map(e => { return e.scanSerialNumber })
                if (this.allOpenedImg.length > oldOpenedImg.length) {
                  // 增加勾选数量
                  this.allOpenedImg.forEach(e => {
                    if (oldOpenedImg.indexOf(e) === -1) {
                      this.compareImageTab.compareImageTabInfo.forEach((item, index) => {
                        if (item.scanSerialNumber === e) {
                          console.log('open Viprobe---' + e)
                          this.openViprobe(e, item.scanImagePath, item.scanningImgFiles, item.isUff, false, false, item)
                        }
                      })
                    }
                  })
                } else {
                  // 减少勾选数量
                  oldOpenedImg.forEach(e => {
                    if (this.allOpenedImg.indexOf(e) === -1) {
                      console.log('close Viprobe---' + e)
                      this.closeViprobe(e)
                    }
                  })
                }
              })
            } else {
              this.hisInfoLoading = false
            }
          }).catch(err => {
            console.log('err', err)
            this.hisInfoLoading = false
          })
        } else {
          // 清空勾选数据
          oldValue.forEach(e => {
            console.log('close Viprobe---' + e.scanSerialNumber)
            this.closeViprobe(e.scanSerialNumber)
          })
        }
      },
      deep: true
    },
    'selectedTypicalRow': {
      handler (newValue, oldValue) {
        this.compareTypicalImageTab.compareImageTabInfo = []
        this.allOpenedTypicalImg = []
        if (newValue.length > 0) {
          newValue.forEach(obj => {
            this.compareTypicalImageTab.compareImageTabInfo.unshift({
              id: obj.id,
              imageName: obj.imageName + '.',
              showSwiper: false,
              isManualAdd: obj.imageCollectMode === '1',
              isIllegal: obj.imageTypeCode === 'ILLEGAL',
              taskMarks: obj.taskMarks
            })
            this.allOpenedTypicalImg.unshift(obj.imageName + '.')
          })
          // 默认激活第一个tab页签
          this.compareTypicalImageTab.activeName = this.compareTypicalImageTab.compareImageTabInfo[0].id
          this.typicalInfoLoading = true
          // 获取勾选的典型图像的详情信息
          newValue.forEach(item => {
            this.getTypicalDetail(item)
          })
          this.$nextTick(() => {
            this.compareTypicalImageTab.compareImageTabInfo.forEach(item => {
              if (item.attachmentData.length > 0) {
                this.$nextTick(() => {
                  item.showSwiper = true
                })
              }
            })
            this.typicalInfoLoading = false
            // viprobe打开图像
            let oldOpenedImg = oldValue.map(e => { return e.imageName + '.' })
            if (this.allOpenedTypicalImg.length > oldOpenedImg.length) {
              // 增加勾选数量
              this.allOpenedTypicalImg.forEach(e => {
                if (oldOpenedImg.indexOf(e) === -1) {
                  this.compareTypicalImageTab.compareImageTabInfo.forEach((item, index) => {
                    if (item.imageName === e) {
                      console.log('open Viprobe---' + e)
                      this.openViprobe(e, item.scanImagePath, item.scanningImgFiles, item.isUff, item.isManualAdd, item.isIllegal, item)
                      // if (item.isManualAdd) {
                      //   this.openViprobe(e, item.scanImagePath, item.allScanningImgFile, item.isUff, item.isManualAdd, item.isIllegal)
                      // } else {
                      //   this.openViprobe(e, item.scanImagePath, item.scanningImgFiles, item.isUff, item.isManualAdd, item.isIllegal)
                      // }
                      // 记录该图像的使用次数
                      ajax.addTilImgUsedCount({imageId: item.id}).then(res => {}).catch(() => {})
                    }
                  })
                }
              })
            } else {
              // 减少勾选数量
              oldOpenedImg.forEach(e => {
                if (this.allOpenedTypicalImg.indexOf(e) === -1) {
                  console.log('close Viprobe---' + e)
                  this.closeViprobe(e)
                }
              })
            }
          })
        } else {
          // 清空勾选数据
          oldValue.forEach(e => {
            console.log('close Viprobe---' + e.imageName + '.')
            this.closeViprobe(e.imageName + '.')
          })
        }
      },
      deep: true
    }
  },
  components: { ComTable, ComForm, panelTitle, detailList, Cswiper, DocInfo }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';
#tabList {
  width: $all;
  margin-top: -20px;
  .tablistCon {
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__content {
      border: 1px solid #E4E7ED;
      border-top: none;
    }
    .tabContent {
      min-height: 650px;
      .tableList {
        min-height: 300px;
        .search-form {
          @include flex(row, flex-start, flex-end);
          padding: 0 10px;
          @include box-sizing();
          .search-form-item {
            @include box-sizing();
            padding-right: $dis10;
            width: 35%;
            margin-bottom: 0;
            .pack {
              @include flex(column, flex-end, flex-start);
              .el-form-item__label {
                width: max-content;
                min-width: 80px;
              }
              .treeClass {
                text-align: left;
                width: calc(100% - 2px);
                position: absolute;
                top: 70px;
                right: 0;
                #goods-tree-bar {
                  .maxHeight {
                    height: calc(100% - 40px);
                  }
                }
              }
            }
            .pack>div {
              width: $all;
            }
            .list-label{
              padding: 0px;
              width: unset;
              max-width: $all;
            }
          }
          .search-form-btn {
            margin-left: 30px;
            margin-bottom: 0;
            width: 15%!important;
            button {
              padding: 6px 10px;
            }
          }
        }
      }
      .hisTableList {
        .exportFor {
          margin-top: 5px;
        }
        .el-table  {
          td,th {
            padding: 5px 0;
          }
        }
        thead {
          .el-table-column--selection {
            .cell {
              // display: none;
            }
          }
        }
        .el-form-item {
          .el-form-item__error {
            z-index: 5;
            padding-top: 2px;
          }
        }
      }
      .imageList {
        li {
          @include flex(row, flex-start, flex-start);
          margin-bottom: $dis10;
          .imgShow {
            width: 48%;
            height: 190px;
            @include flex(row, center, center);
            overflow: hidden;
            img {
              height: $all;
            }
          }
          .imgDesc {
            width: 35%;
            height: 190px;
            background: #efefef;
            @include box-sizing();
            padding: 5px $dis10;
            .hiddenInfo {
              display: none;
            }
            li {
              @include flex(column, flex-start, flex-start);
              margin-bottom: 3px;
              span:first-child {
                color: #333;
              }
              span:last-child {
                display: inline-block;
                width: $all;
                min-height: 18px;
              }
            }
          }
          .operateBtn {
            @include flex(row, center, center);
            width: 17%;
            height: 190px;
          }
        }
      }
      .compareTab {
        @include flex(row, space-between, flex-start);
        margin-block-end: 10px;
        .el-tabs {
          width: $all/2;
          padding: 0 8px;
          @include box-sizing();
          .el-tabs__content {
            padding: 5px;
            .info-container {
              width: $all;
              height: 420px;
              .basic-info {
                .scanImg {
                  width: $all;
                  margin-bottom: 5px;
                  cursor: pointer;
                }
                .swiper-container-box {
                  .swiper-slide-container {
                    height: $all;
                    .fileIcon {
                      font-size: 50px!important;
                    }
                    .fileName {
                      width: 100px;
                      padding: 0;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      text-align: center;
                    }
                    .swiper-button-prev,.swiper-button-next  {
                      margin-top: 0;
                      transform: translate(0, -45%);
                    }
                  }
                }
                .detailListCont {
                  margin: 5px 0;
                  .el-form-item {
                    margin-bottom: 0;
                  }
                }
              }
              // .other-info {
              //   width: $all;
              //   min-height: 100px;
              //   @include flex(row, center, center);
              // }
              .documentInfoContent {
                width: $all;
                height: auto;
                margin-top: 15px;
                .el-tabs__header {
                  border: 1px solid #ddd;
                  .el-tabs__item.is-active {
                    border-top: 1px solid #ddd;
                  }
                }
              }
            }
          }
        }
        .showCompareTab {
          .el-tabs__header,.el-tabs__content {
            border: none;
          }
        }
      }
      .noData {
        width: $all;
        height: $all;
        line-height: 650px;
        @include flex(row, center, center);
      }
    }
  }
}
.imageInfoBox {
  @include flex(row, space-between, flex-start);
  height: 320px;
  margin-bottom: $dis10;
  position: relative;
  .imageBox {
    width: 65%;
    height: $all;
    @include box-sizing();
    img {
      width: $all;
    }
  }
  .infoBox {
    width: 34%;
    height: $all;
    @include box-sizing();
    text-align: center;
    li {
      min-height: 50px;
      @include flex(row, center, center);
    }
    li:nth-child(odd) {
      background: #2da8cf;
      color: #ffffff;
      min-height: 32px;
      line-height: 32px;
      font-weight: bold;
    }
  }
  .tag {
    position: absolute;
    top: $dis10;
    left: $dis10;
    background: rgba(45, 168, 207, .6);
    width: 150px;
    height: 40px;
    color: #fff;
    font-weight: bold;
    @include flex(row, center, center);
  }
}
</style>
