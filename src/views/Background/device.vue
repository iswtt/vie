<template>
   <div class='background-device-bar' v-bar>
     <div class="background-device-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="infolist">
          <div class="panel panel-Q">
            <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
            <div class="tree-bar" v-bar>
              <div class="treebox">
                <el-tree ref='dicTree' :data="organ.data" :props="organ.default" :expand-on-click-node='falseflag' :default-expand-all='trueflag' highlight-current  @node-click="OrganTreeClick" :empty-text='organ.EmptyText' node-key='id'>
                  <div class="custom-tree-node" :data-id="'organTreeItem'+node.id+'-div'" slot-scope="{ node, data }">
                    {{ node.label }}
                  </div>
                </el-tree>
              </div>
            </div>
          </div>
          <div class="panel panel-L">
            <panelTitle :panelTitleInit="panelTitle.listTitle">
              <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
              <el-button type="primary" size="mini" @click="openListDialog" data-id="tableSet-btn">{{$t('vicenter.common.set')}}</el-button>
              <!-- <el-button type="danger" size="mini" @click="getDeleteAll">{{$t('vicenter.common.deleteAll')}}</el-button> -->
              <el-button type="primary" size="mini" data-id="add-btn" @click="getAdd">{{$t('vicenter.common.add')}}</el-button>
            </panelTitle>
            <ComForm :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
            <div class="form-bar" v-bar>
              <ComTable ref="deviceTable" @listenToSelectDataEvent='selectRow' :tableData='tableData' :tableGroup='tableGroup'></ComTable>
            </div>
          </div>
        </div>
        <div class="modal-dialog">
          <Dialog :modalData="modalData">
            <ComForm ref="modalForm" :searchIpt="modalItem" :searchFunc="modalFn" :formRule='modalRule'></ComForm>
            <div class="review">
              <p>{{$t('vicenter.Background.device.devicePicture')}}</p>
              <div class="uploadBox">
                <div v-if="showSwiper && uploadImg.option.previewList.length>0" class="swiperPreview">
                  <Cswiper @deleteAttach="deleteAttach" :propOption='uploadImg.option.preview' :listData='uploadImg.option.previewList'></Cswiper>
                </div>
                <div class="uploadButton">
                  <upload v-if="showUpload" :propOption='uploadImg.option'></upload>
                </div>
              </div>
            </div>
            <div class="resultbutton">
              <el-button :disabled="isSaving" @click="saveEdit()" type="primary" size="mini" >{{$t('vicenter.common.save')}}</el-button>
              <el-button @click="closeModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
            </div>
          </Dialog>
          <Dialog :modalData="detailData">
            <el-form class="search-form">
              <el-form-item class='search-form-item' v-for='(item,key) in detailItem' :key='key' :prop='item.key'>
                <label class="search-form-label el-form-item__label">{{item.label}}</label>
                <el-input v-model="item.value" class="search-form-input" :disabled="true" v-if="item.ruleProp !== 'remark'" :title="item.title"></el-input>
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 5}" v-model="item.value" disabled v-if="item.ruleProp === 'remark'" resize="none"></el-input>
              </el-form-item>
            </el-form>
            <div class="divShow" v-if="hasDevicePic">
              <p data-id="devicePicture-p">{{$t('vicenter.Background.device.devicePicture')}}</p>
              <img :src="detailImg" id="pic" class="imgShow" @click="clickImg">
            </div>
            <div class="resultbutton">
              <el-button data-id="closeModal-btn" @click="closeDetailModal" size="mini">{{$t('vicenter.common.close')}}</el-button>
            </div>
          </Dialog>
          <DialogCommon :modalData="mapData">
            <div class="deviceMapContainer">
              <ul class="coorShow">
                <li data-id="longitude-li">{{$t('vicenter.Background.device.longitude')}}: <span data-id="longitude-spn">{{tempDeviceCoord.lng}}</span></li>
                <li data-id="latitude-li">{{$t('vicenter.Background.device.latitude')}}: <span data-id="latitude-spn">{{tempDeviceCoord.lat}}</span></li>
              </ul>
              <div class="deviceMap" id="hahaha">
                <Map v-if="mapData.flag" ref="deviceMap" @getProperty='handleFeatureDrag'></Map>
              </div>
            </div>
            <div class="deviceMapButton">
              <el-button :disabled="isSaving" data-id="sure-btn" @click="saveDeviceCoord" type="primary" size="mini" >{{$t('vicenter.common.sure')}}</el-button>
              <el-button data-id="cancel-btn" @click="resetMapModal" size="mini">{{$t('vicenter.common.cancel')}}</el-button>
            </div>
          </DialogCommon>
          <el-dialog :title="listTransfer.title" :visible.sync="listTransfer.flag" :show-close='falseFlag' :close-on-click-modal='falseFlag' :close-on-press-escape='falseFlag' class='searchTransfer'>
            <div class="transfer-box" v-loading="isSavingList" element-loading-background="rgba(255, 255, 255, 0.8)">
              <el-transfer v-if="isOpenList" v-model="listTransfer.transfer.model" :data="listTransfer.transfer.data" :titles="listTransfer.transfer.title" :button-texts="listTransfer.transfer.button" target-order="push" :right-default-checked="transferDefaultL" data-id="list-transfer"></el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" :disabled="listTransfer.transfer.model.length === 0 || isSavingList" @click="saveListTranfer" data-id="listTransferSave-btn">{{this.$t('vicenter.common.save')}}</el-button>
              <el-button :disabled="isSavingList" @click="dontSaveListTranfer" data-id="listTransferBack-btn">{{this.$t('vicenter.common.back')}}</el-button>
            </div>
          </el-dialog>
        </div>
     </div>
   </div>
</template>

<script>
import breadCrumb from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import DialogCommon from '@/components/dialogCommon'
import Cswiper from '@/components/swipe'
import upload from '@/components/uploadPreview'
import ajax from '@/api/background/device.js'
import commonAjax from '@/api/common/common.js'
import Map from '@/components/map/views/map'
import icons from '@/components/map/lib/importIcon.js' // 所有图标
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { setTimeout } from 'timers'
export default {
  name: 'background-device',
  data () {
    // 经度值校验
    var checkLongitude = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value) {
        setTimeout(() => {
          var reg = /^-?((([0-9]|[1-9][0-9]|1[0-7][0-9]|0{1,3})[.][0-9]{0,6})|([0-9]|[1-9][0-9]|1[0-7][0-9]|0{1,3})|180[.]0{0,6}|180)$/
          if (!reg.test(value)) {
            callback(new Error(this.$t('vicenter.Background.device.checkLongitude')))
          } else {
            callback()
          }
        }, 100)
      }
    }
    // 纬度值校验
    var checkLatitude = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value) {
        setTimeout(() => {
          var reg = /^-?([0-8]?[0-9]{1}[.][0-9]{0,6}|90[.]0{0,6}|[0-8]?[0-9]{1}|90)$/
          if (!reg.test(value)) {
            callback(new Error(this.$t('vicenter.Background.device.checkLatitude')))
          } else {
            callback()
          }
        }, 100)
      }
    }
    // 经纬度校验
    var checkLngAndLat = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value) {
        var reg = /^-?((([0-9]|[1-9][0-9]|1[0-7][0-9]|0{1,3})[.][0-9]{0,6})|([0-9]|[1-9][0-9]|1[0-7][0-9]|0{1,3})|180[.]0{0,6}|180),-?([0-8]?[0-9]{1}[.][0-9]{0,6}|90[.]0{0,6}|[0-8]?[0-9]{1}|90)$/
        if (!reg.test(value)) {
          callback(new Error(this.$t('vicenter.Background.device.checkLngAndLat')))
        } else {
          callback()
        }
      }
    }
    // 标尺精度校验
    var validateRulerAccuracy = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      var reg = /^(0|[1-9][0-9]{0,2}|1000)$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('vicenter.Background.device.enterInteger', {msg: '0-1000'})))
      } else {
        callback()
      }
    }
    // 坏道坐标轴校验
    var validateCoordinateAxis = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value) {
        var reg = /^(50{3}|[1-4]\d{3}|[1-9]\d{0,2})(,(50{3}|[1-4]\d{3}|[1-9]\d{0,2}))*$/
        if (!reg.test(value)) {
          callback(new Error(this.$t('vicenter.Background.device.enterInteger', {msg: '1-5000'}) + this.$t('vicenter.Background.device.enterExample')))
        } else {
          callback()
        }
      }
    }
    return {
      exportButton: false,
      sysMenu: 'DEVICE_MANAGEMENT',
      isSaving: false,
      hasDevicePic: false,
      selRowId: '',
      showSwiper: true,
      trueflag: true,
      falseflag: false,
      nowOpration: '',
      tempArr: [],
      deviceTypeArr: [],
      deviceStyleArr: [],
      detailImg: '',
      showUpload: false,
      titleBread: { // 面包屑导航组件初始化
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
      uploadImg: {
        option: {
          propId: 'upload',
          maxSize: 10,
          multiple: true,
          action: 'management/scdevice/uploadicon',
          fileList: [],
          previewList: [],
          limit: 1,
          imgSize: {
            width: '178px',
            height: '178px'
          },
          listType: 'picture-card',
          handleSuccess: this.handleUploadSuccess,
          preview: {
            name: 'attachFile',
            propId: 'Resattachment',
            width: '40%',
            height: '160px',
            slidesPerView: 1,
            spaceBetween: 20,
            deleteFlag: true
          },
          accept: '.jpg,.jpeg,.tif,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP'
        }
      },
      organ: { // 组织机构树
        EmptyText: this.$t('vicenter.Background.device.noOrganization'),
        data: [],
        default: { // 机构树设置
          children: 'children',
          label: 'label'
        }
      },
      panelTitle: { // title组件数据
        queryTitle: {
          title: this.$t('vicenter.Background.device.deviceManagement')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      },
      queryFn: { // 页面表单查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      modalFn: { // 弹窗表单确定方法
        query: this.saveNull
      },
      formRule: { // 表单验证和存放数据 model=> post到后台的数据
        refName: 'queryForm',
        rule: {
          deviceCode: [
            { pattern: /^[a-zA-Z0-9_]*$/, message: this.$t('vicenter.common.verifyRules.onlyLDU'), trigger: 'change' }
          ]
        },
        model: {
          deviceCode: '',
          deviceName: ''
        }
      },
      modalRule: { // 弹窗表单验证和存放数据 model=> post到后台的数据
        refName: 'modalQueryForm',
        rule: {
          deviceCode: [ // 设备编号校验
            { required: true, message: this.$t('vicenter.Background.device.enterDevicenumber'), trigger: 'blur' },
            // {min: 1, max: 20, message: this.$t('vicenter.Background.device.codeLength'), trigger: 'blur'},
            { pattern: /^[a-zA-Z0-9_]+$/, message: this.$t('vicenter.common.verifyRules.onlyLDU'), trigger: 'blur' }
          ],
          deviceName: [ // 设备名称校验
            { required: true, message: this.$t('vicenter.Background.device.inputDevicename'), trigger: 'blur' }
            // {min: 1, max: 100, message: this.$t('vicenter.Background.device.nameLength'), trigger: 'blur'}
            // { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: this.$t('vicenter.common.verifyRules.onlyCEDU'), trigger: 'blur' }
          ],
          deviceType: [
            // { required: true, message: this.$t('vicenter.Background.device.selectDevicetype'), trigger: 'blur' }
          ],
          lngAndLat: [
            { validator: checkLngAndLat, trigger: 'change' }
          ],
          longitude: [
            { validator: checkLongitude, trigger: 'blur' }
          ],
          latitude: [
            { validator: checkLatitude, trigger: 'blur' }
          ],
          deviceManager: [ // 设备负责人校验
            // {min: 1, max: 50, message: this.$t('vicenter.Background.device.managerLength'), trigger: 'blur'}
          ],
          deviceManagerTel: [ // 设备负责人电话校验
            // {min: 1, max: 30, message: this.$t('vicenter.Background.device.telLength'), trigger: 'blur'},
            { pattern: /^[0-9-]+$/, message: this.$t('vicenter.common.verifyRules.onlyDM'), trigger: 'blur' }
          ],
          remark: [ // 备注校验
            // {min: 1, max: 500, message: this.$t('vicenter.common.limitRemarksLength'), trigger: 'blur'}
          ],
          horizontalSpermm: [ // 标尺横向精度校验
            {validator: validateRulerAccuracy, trigger: 'change'}
          ],
          verticalSpermm: [ // 标尺纵向精度校验
            {validator: validateRulerAccuracy, trigger: 'change'}
          ],
          badwayYaxis: [ // 坏道坐标轴校验
            {validator: validateCoordinateAxis, trigger: 'change'}
          ]
        },
        model: {
          deviceCode: '',
          deviceName: '',
          siteId: '',
          siteName: '',
          customId: '',
          customName: '',
          deviceType: 'XRCS', // 设备类型固定传 XRCS 扫描设备
          deviceStyle: '',
          deviceManager: '',
          deviceManagerTel: '',
          longitude: 0.0,
          latitude: 0.0,
          horizontalSpermm: '',
          verticalSpermm: '',
          badwayYaxis: '',
          remark: ''
        }
      },
      modalItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.Background.device.equipmentNumber'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.enterDevicenumber'),
          disabled: false,
          models: '',
          ruleProp: 'deviceCode',
          maxlength: 20
        },
        {
          getLabel: this.$t('vicenter.Background.device.deviceName'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.inputDevicename'),
          disabled: false,
          models: '',
          ruleProp: 'deviceName',
          maxlength: 100
        },
        {
          getLabel: this.$t('vicenter.Background.device.port'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.enterPort'),
          disabled: true,
          models: '',
          ruleProp: 'siteName'
        },
        // {
        //   getLabel: this.$t('vicenter.Background.device.equipmentType'),
        //   type: 'select',
        //   placeHolder: this.$t('vicenter.Background.device.selectDevicetype'),
        //   disabled: false,
        //   models: '',
        //   ruleProp: 'deviceType',
        //   option: [],
        //   change: this.changeDeviceType
        // },
        {
          getLabel: this.$t('vicenter.Background.device.equipmentModel'),
          type: 'select',
          placeHolder: this.$t('vicenter.Background.device.selectDevicetypee'),
          disabled: false,
          models: '',
          ruleProp: 'deviceStyle',
          option: [],
          clearable: true // 可清除
        },
        {
          getLabel: this.$t('vicenter.Background.device.equipmentLeader'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.inputDeviceleader'),
          disabled: false,
          models: '',
          ruleProp: 'deviceManager',
          maxlength: 50
        },
        {
          getLabel: this.$t('vicenter.Background.device.personTelephone'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.inputPersonphone'),
          disabled: false,
          models: '',
          ruleProp: 'deviceManagerTel',
          maxlength: 50
        },
        {
          getLabel: this.$t('vicenter.Background.device.coordinates'),
          type: 'textAndBtn',
          placeHolder: this.$t('vicenter.Background.device.inputCoordinates'),
          btnTitle: this.$t('vicenter.Background.device.selectCoordinates'),
          btnFun: this.showMapModal,
          btnDisabled: false,
          models: '',
          ruleProp: 'lngAndLat'
        },
        // {
        //   getLabel: this.$t('vicenter.Background.device.longitude'),
        //   type: 'text',
        //   placeHolder: this.$t('vicenter.Background.device.inputLongitude'),
        //   disabled: false,
        //   models: '',
        //   ruleProp: 'longitude'
        // },
        // {
        //   getLabel: this.$t('vicenter.Background.device.latitude'),
        //   type: 'text',
        //   placeHolder: this.$t('vicenter.Background.device.inputLatitude'),
        //   disabled: false,
        //   models: '',
        //   ruleProp: 'latitude'
        // },
        {
          getLabel: this.$t('vicenter.Background.device.rulerLateralAccuracy'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.enterInteger', {msg: '0~1000'}),
          disabled: false,
          models: '',
          ruleProp: 'horizontalSpermm'
        }, // 标尺横向精度
        {
          getLabel: this.$t('vicenter.Background.device.rulerLongitudinalAccuracy'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.enterInteger', {msg: '0-1000'}),
          disabled: false,
          models: '',
          ruleProp: 'verticalSpermm'
        }, // 标尺纵向精度
        {
          getLabel: this.$t('vicenter.Background.device.badTrackCoordinateAxis'),
          type: 'text',
          placeHolder: this.$t('vicenter.Background.device.enterInteger', {msg: '1-5000'}) + this.$t('vicenter.Background.device.enterExample'),
          disabled: false,
          models: '',
          ruleProp: 'badwayYaxis'
        }, // 坏道坐标轴
        {
          getLabel: this.$t('vicenter.Background.device.remarks'),
          type: 'textarea',
          placeHolder: this.$t('vicenter.Background.device.inputRemarks'),
          disabled: false,
          models: '',
          ruleProp: 'remark',
          autoSize: 5,
          maxlength: 500
        }
      ],
      detailItem: [ // 文本搜索条件 models为显示的数据
        {
          label: this.$t('vicenter.Background.device.equipmentNumber'),
          value: '',
          ruleProp: 'deviceCode'
        },
        {
          label: this.$t('vicenter.Background.device.deviceName'),
          value: '',
          ruleProp: 'deviceName'
        },
        {
          label: this.$t('vicenter.Background.device.port'),
          value: '',
          ruleProp: 'siteName'
        },
        // {
        //   label: this.$t('vicenter.Background.device.equipmentType'),
        //   value: '',
        //   ruleProp: 'deviceType'
        // },
        {
          label: this.$t('vicenter.Background.device.equipmentModel'),
          value: '',
          ruleProp: 'deviceStyle'
        },
        {
          label: this.$t('vicenter.Background.device.equipmentLeader'),
          value: '',
          ruleProp: 'deviceManager'
        },
        {
          label: this.$t('vicenter.Background.device.personTelephone'),
          value: '',
          ruleProp: 'deviceManagerTel'
        },
        {
          label: this.$t('vicenter.Background.device.longitude'),
          value: '',
          ruleProp: 'longitude'
        },
        {
          label: this.$t('vicenter.Background.device.latitude'),
          value: '',
          ruleProp: 'latitude'
        },
        {
          label: this.$t('vicenter.Background.device.badTrackCoordinateAxis'),
          value: '',
          ruleProp: 'badwayYaxis'
        }, // 坏道坐标轴
        {
          label: this.$t('vicenter.Background.device.rulerLateralAccuracy'),
          value: '',
          ruleProp: 'horizontalSpermm',
          title: this.$t('vicenter.Background.device.rulerAccuracyUnit')
        }, // 标尺横向精度
        {
          label: this.$t('vicenter.Background.device.rulerLongitudinalAccuracy'),
          value: '',
          ruleProp: 'verticalSpermm',
          title: this.$t('vicenter.Background.device.rulerAccuracyUnit')
        }, // 标尺纵向精度
        {
          label: this.$t('vicenter.Background.device.remarks'),
          value: '',
          ruleProp: 'remark'
        }
      ],
      inputItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.Background.device.equipmentNumber'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          placeHolder: this.$t('vicenter.Background.device.enterDevicenumber'),
          models: '',
          ruleProp: 'deviceCode'
        },
        {
          getLabel: this.$t('vicenter.Background.device.deviceName'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          placeHolder: this.$t('vicenter.Background.device.inputDevicename'),
          models: '',
          ruleProp: 'deviceName'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'multipleTable',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        },
        sortMethod: this.getSortTable // 新增排序方法
      },
      tableGroupRes: [ // 表格数据列
        // {
        //   label: this.$t('vicenter.Background.device.serialNumber'),
        //   type: 'index'
        // },
        // {
        //   type: 'selection'
        // },
        {
          label: this.$t('vicenter.Background.device.equipmentNumber'),
          type: 'text',
          model: 'deviceCode'
        },
        {
          label: this.$t('vicenter.Background.device.deviceName'),
          type: 'text',
          model: 'deviceName'
        },
        {
          label: this.$t('vicenter.Background.device.longitude'),
          type: 'text',
          model: 'longitude'
        },
        {
          label: this.$t('vicenter.Background.device.latitude'),
          type: 'text',
          model: 'latitude'
        },
        {
          label: this.$t('vicenter.Background.device.equipmentModel'),
          type: 'text',
          model: 'deviceStyle'
        },
        {
          label: this.$t('vicenter.Background.device.devicePicture'),
          type: 'img',
          height: '50px',
          model: 'deviceIcon'
        },
        {
          label: this.$t('vicenter.Background.device.remarks'),
          type: 'text',
          model: 'remark'
        }
        // {
        //   label: this.$t('vicenter.common.operation'),
        //   type: 'operation',
        //   width: '150px',
        //   model: 'operation',
        //   fixed: 'right'
        // }
      ],
      modalData: {
        title: '',
        flag: false,
        resetModal: this.resetModal
      },
      detailData: {
        title: '',
        flag: false
      },
      organResData: {
        siteId: '',
        siteName: '',
        siteCode: '',
        customId: '',
        customName: '',
        customCode: ''
      },
      mapData: {
        width: '60%',
        top: '100px',
        title: this.$t('vicenter.Background.device.selectCoordinates'),
        flag: false,
        resetModal: this.resetMapModal
      },
      currentDeviceObj: {
        text: '',
        src: icons.scannerIcon,
        lng: 0,
        lat: 0
      },
      tempDeviceCoord: { // 用来保存拖拽选取的临时坐标
        lng: 0,
        lat: 0
      },
      portCoord: { // 当前设备所在口岸的经纬度
        lng: 0,
        lat: 0
      },
      allOrganCoord: [], // 保存所有机构经纬度
      updateDeleteFile: '',
      originIcon: '',
      tableGroupOrigin: [],
      tableOper: {
        type: 'operation',
        model: 'operation',
        fixed: 'right',
        label: this.$t('vicenter.common.operation')
      },
      tableGroup: [],
      userDefine: [],
      isSavingList: false,
      transferDefaultS: [],
      transferDefaultL: [],
      isOpenList: false, // 解决模态框关闭再打开时选中的项仍然存在的问题
      showInput: false,
      falseFlag: true,
      listTransfer: {
        flag: false,
        transfer: {
          model: [],
          data: [],
          title: [this.$t('vicenter.common.unselected'), this.$t('vicenter.common.selected')],
          button: [this.$t('vicenter.common.deleteSelected'), this.$t('vicenter.common.addSelected')]
        },
        title: this.$t('vicenter.common.definedList')
      }
    }
  },
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.$getDataByTypecode(['DEVICE_TYPE', 'DEVICE_MODEL'], ['deviceType', 'deviceStyle'], this.modalItem)
    this.ajaxTree()
    // this.ajaxTable()
    this.getListTransferOrigin()
  },
  mounted () {
  },
  methods: {
    changeDeviceType () {
      this.$changeSelectValidateField('modalForm', this, 'deviceType')
    },
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      this.$data.selRowId = idArr.join(',')
    },
    ajaxTree () { // 获取机构树方法
      commonAjax.orgNodesTree({all: true}).then(res => {
        if (res.data.flag) {
          // 保存所有机构经纬度
          this.getAllCoord(res.data.result)
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.organ.data = res.data.result
          let node = this.organ.data[0]
          this.modalRule.model.siteId = node.id
          this.modalRule.model.customId = node.pid
          this.modalRule.model.customName = node.pName
          this.$data.modalItem[2].models = node.name
          this.tempArr = [] // 数组置空
          this.getChildNode(node) // 添加点击节点所有子节点id
          this.tempArr.push(node.id) // 添加点击节点的id
          this.getDeviceList()
          this.$nextTick(function () {
            this.$refs.dicTree.setCurrentKey(this.organ.data[0].id)
          })
        }
      })
    },
    getAllCoord (data) {
      let organObj = {}
      data.forEach(e => {
        organObj = {
          id: e.id,
          name: e.name,
          type: e.typeName,
          lng: e.longitude,
          lat: e.latitude
        }
        this.allOrganCoord.push(organObj)
        if (e.children && e.children.length > 0) {
          this.getAllCoord(e.children)
        }
      })
    },
    // ajaxTable () { // 获取表单方法
    //   let params = {}
    //   params.page = this.tableData.page.CurrentPage
    //   params.size = this.tableData.page.pagesize
    //   params.mgmtScDeviceSiteArr = this.organ.data[0].id
    //   this.getDeviceList(params)
    // },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.setParams(true)
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/management/scdevice/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams (flag) {
      let params = {}
      params.deviceCode = this.formRule.model.deviceCode
      params.deviceName = this.formRule.model.deviceName
      if (flag) {
        let val = ''
        this.tempArr.forEach(e => {
          val += `mgmtScDeviceSiteArr=${String(e)}&`
        })
        val = val.substring(val.indexOf('=') + 1, val.lastIndexOf('&'))
        params.mgmtScDeviceSiteArr = val
      }
      return params
    },
    query (isPage = '') { // 用于form表单查询方法
      let params = this.setParams()
      if (isPage === 'page') {
        params.page = this.tableData.page.CurrentPage
      } else {
        params.page = 0
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      this.getDeviceList(params)
    },
    OrganTreeClick (data) { // 机构树点击
      // 获取当前要添加设备的口岸的经纬度
      this.currentDeviceObj.lng = parseFloat(data.longitude)
      this.currentDeviceObj.lat = parseFloat(data.latitude)
      this.portCoord.lng = parseFloat(data.longitude)
      this.portCoord.lat = parseFloat(data.latitude)
      this.organResData.siteId = data.id
      this.organResData.siteName = data.name
      this.organResData.siteCode = data.code
      this.organResData.customId = data.pid
      this.organResData.customName = data.pName
      this.organResData.customCode = data.pCode
      this.tempArr = [] // 数组置空
      this.getChildNode(data) // 添加点击节点所有子节点id
      this.tempArr.push(data.id) // 添加点击节点的id
      this.tableData.page.CurrentPage = 0
      this.tableData.page.pagesize = 10
      this.getDeviceList()
      // 清空搜索条件
      this.inputItem.forEach((e) => {
        e.models = ''
      })
    },
    closeModal () { // 添加修改详情弹窗非保存关闭
      this.$data.modalData.flag = false
    },
    closeDetailModal () { // 详情弹窗关闭
      this.$data.detailData.flag = false
    },
    getSortTable ({column, prop, order}) { // 表格排序
      console.log(column, prop, order)
    },
    handleSizeChange (val) { // 表格分页
      this.$set(this.tableData.page, 'pagesize', val)
      this.query('page')
    },
    handleCurrentChange (val) { // 表格分页
      this.$set(this.tableData.page, 'CurrentPage', val - 1)
      this.query('page')
    },
    resetModal () { // 点×号关闭弹窗并且清空数据
      this.deleteFile()
      this.$refs.modalForm.reset()
    },
    deleteFile () {
      let id = this.modalRule.model.id
      if (this.nowOpration === 'add') {
        if (this.uploadImg.option.previewList.length > 0) {
          // 删除已上传图片
          ajax.delAttach({id: id, deleteFile: this.uploadImg.option.previewList[0].relativeUrl}).then((res) => {})
        }
        if (this.updateDeleteFile !== '') {
          // 删除图片
          ajax.delAttach({id: id, deleteFile: this.updateDeleteFile}).then((res) => {})
        }
      } else { // 修改时，本来没有图片，不保存操作应删除上传的图片
        if (this.updateDeleteFile === '' && this.uploadImg.option.previewList.length > 0) {
          ajax.delAttach({id: id, deleteFile: this.uploadImg.option.previewList[0].relativeUrl}).then((res) => {})
        }
        if (this.updateDeleteFile !== '' && this.uploadImg.option.previewList.length > 0) {
          if (this.updateDeleteFile !== this.uploadImg.option.previewList[0].relativeUrl) {
            // 删除图片
            ajax.delAttach({id: id, deleteFile: this.uploadImg.option.previewList[0].relativeUrl}).then((res) => {})
          }
        }
      }
      this.updateDeleteFile = ''
    },
    showMapModal () {
      this.tempDeviceCoord.lng = this.currentDeviceObj.lng
      this.tempDeviceCoord.lat = this.currentDeviceObj.lat
      this.mapData.flag = true
      setTimeout(() => {
        this.getDeviceIcon([this.currentDeviceObj])
      }, 10)
    },
    resetMapModal () {
      this.mapData.flag = false
    },
    saveDeviceCoord () {
      this.currentDeviceObj.lng = parseFloat(this.tempDeviceCoord.lng)
      this.currentDeviceObj.lat = parseFloat(this.tempDeviceCoord.lat)
      // 将选取的坐标填入输入框中
      this.modalItem.forEach(e => {
        if (e.ruleProp === 'lngAndLat') {
          e.models = `${this.currentDeviceObj.lng},${this.currentDeviceObj.lat}`
        }
      })
      this.mapData.flag = false
    },
    getAdd () { // 添加设备
      if (this.$refs.modalForm) {
        this.$refs.modalForm.reset()
      }
      this.showUpload = false
      this.isSaving = false
      this.uploadImg.option.previewList = []
      this.uploadImg.option.fileList = []
      if (this.$refs.dicTree.getCurrentKey() === null) {
        this.$NotifPrompt(this.$t('vicenter.Background.device.chooseOrganization'))
      } else if (this.$refs.dicTree.getCurrentNode().pid === null || this.$refs.dicTree.getCurrentNode().typeName !== 'dynamic.asv.port') {
        this.$NotifPrompt(this.$t('vicenter.Background.device.cannotAdddevices'))
      } else {
        this.modalData.title = this.$t('vicenter.Background.device.addDevice')
        this.modalData.flag = true
        this.nowOpration = 'add'
        this.$data.modalItem.forEach(obj => {
          if (obj.ruleProp === 'siteName') {
            obj.models = this.organResData.siteName
            obj.disabled = true
          }
          if (obj.ruleProp === 'deviceCode') {
            obj.disabled = false
          }
        })
        this.$nextTick(function () {
          this.showUpload = true
        })
      }
    },
    getDeleteAll () { // 删除设备
      let data = {}
      data.id = this.$data.selRowId
      if (this.$refs.deviceTable.selectedData.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.Background.device.selectDevice'))
      } else {
        this.$ConfirmBox(this.$t('vicenter.Background.device.sureDeletedevice'), () => {
          ajax.deleteDeviceList(data).then(res => {
            if (res.data.flag) {
              this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
              this.getDeviceList()
            }
          })
        })
      }
    },
    deleteDevice (scope) { // 列表按钮的删除
      let data = {}
      data.id = scope.row.id
      this.$ConfirmBox(this.$t('vicenter.Background.device.sureDeletedevice'), () => {
        ajax.deleteDeviceList(data).then(res => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
            this.getDeviceList()
          }
        })
      })
    },
    getDetail (scope) { // 查看设备详情
      // 清空上次的内容
      this.detailItem.forEach((e) => {
        e.value = ''
      })
      this.hasDevicePic = false
      this.detailData.flag = true
      this.detailData.title = this.$t('vicenter.Background.device.deviceDetails')
      this.nowOpration = 'detail'
      let rowData = scope.row
      this.modalRule.model.id = rowData.id
      this.detailImg = ''
      ajax.getDetail({'id': rowData.id}).then(res => {
        if (res.data.flag) {
          let resData = res.data.result
          if (resData !== null) {
            let deviceData = resData.mgmtScDeviceDto
            this.detailItem.forEach(obj => {
              obj.value = deviceData[obj.ruleProp]
              if (obj.ruleProp === 'deviceType' && obj.value !== '') {
                obj.value = this.$t('vicenter.DIC.T_DEVICE_TYPE.C_' + obj.value)
                // deviceTypeArr因为异步请求，没有数据
                // this.deviceTypeArr.forEach(e => {
                //   if (obj.value === e.value) {
                //     obj.value = e.label
                //   }
                // })
              } else if (obj.ruleProp === 'deviceStyle' && obj.value !== '') {
                obj.value = this.$t('vicenter.DIC.T_DEVICE_MODEL.C_' + obj.value)
                // this.deviceStyleArr.forEach(e => {
                //   if (obj.value === e.value) {
                //     obj.value = e.label
                //   }
                // })
              }
            })
            if (resData.fullIconPath) {
              this.hasDevicePic = true
              this.detailImg = resData.fullIconPath
            } else {
              this.hasDevicePic = false
            }
          }
        }
      })
    },
    getEdit (scope) { // 修改设备信息
      if (this.$refs.modalForm) {
        this.$refs.modalForm.reset()
      }
      this.modalData.flag = true
      this.isSaving = false
      this.modalData.title = this.$t('vicenter.Background.device.modificationEquipment')
      this.nowOpration = 'update'
      this.showUpload = false
      let rowData = scope.row
      this.modalRule.model.id = rowData.id
      this.uploadImg.option.previewList = []
      this.uploadImg.option.fileList = []
      ajax.getDetail({'id': rowData.id}).then(res => {
        if (res.data.flag) {
          let resData = res.data.result
          if (resData !== null) {
            let deviceData = resData.mgmtScDeviceDto
            if (deviceData.siteId) {
              this.allOrganCoord.forEach(e => {
                if (e.id === deviceData.siteId) {
                  this.portCoord.lng = e.lng
                  this.portCoord.lat = e.lat
                }
              })
            } else {
              if (deviceData.customId) {
                this.allOrganCoord.forEach(e => {
                  if (e.id === deviceData.customId) {
                    this.portCoord.lng = e.lng
                    this.portCoord.lat = e.lat
                  }
                })
              }
            }
            this.modalItem.forEach(obj => {
              obj.models = deviceData[obj.ruleProp]
              if (obj.ruleProp === 'siteName' || obj.ruleProp === 'deviceCode') {
                obj.disabled = true
              }
            })
            this.organResData.siteId = deviceData.siteId
            this.organResData.siteName = deviceData.siteName
            this.organResData.customId = deviceData.customId
            this.organResData.customName = deviceData.customName
            if (resData.fullIconPath !== null) {
              this.updateDeleteFile = deviceData.deviceIcon
              // 保存点击编辑按钮之后打开详情后的设备图片
              this.originIcon = deviceData.deviceIcon
              this.uploadImg.option.previewList.push({
                type: 'img',
                src: resData.fullIconPath,
                relativeUrl: deviceData.deviceIcon
              })
              this.showUpload = false
            }
            if (deviceData.longitude && deviceData.latitude) {
              // 设备有经纬度值
              this.currentDeviceObj.lng = parseFloat(deviceData.longitude)
              this.currentDeviceObj.lat = parseFloat(deviceData.latitude)
              this.modalItem.forEach(e => {
                if (e.ruleProp === 'lngAndLat') {
                  e.models = `${deviceData.longitude},${deviceData.latitude}`
                }
              })
            } else {
              this.allOrganCoord.forEach(e => {
                // 当设备没有经纬度时，使用设备所在口岸的经纬度
                if (e.id === deviceData.siteId) {
                  this.currentDeviceObj.lng = parseFloat(e.lng)
                  this.currentDeviceObj.lat = parseFloat(e.lat)
                  this.portCoord.lng = parseFloat(e.lng)
                  this.portCoord.lat = parseFloat(e.lat)
                }
              })
            }
          }
        }
      })
      this.$nextTick(function () {
        this.uploadImg.option.fileList = this.uploadImg.option.previewList
        this.showUpload = true
      })
    },
    getEnable () { // 启用设备
      this.$ConfirmBox(this.$t('vicenter.Background.device.sureEnabledevices'), () => {})
    },
    getDisable () { // 禁用设备
      this.$ConfirmBox(this.$t('vicenter.Background.device.sureDisabledevice'), () => {})
    },
    saveEdit () { // 保存设备
      let keys = Object.keys(this.modalRule.model)
      keys.forEach(e => {
        if (typeof (this.modalRule.model[e]) === 'string') {
          this.modalRule.model[e] = this.modalRule.model[e].replace(/(^\s*)|(\s*$)/g, '')
        }
      })
      if (this.modalRule.rule !== '{}') {
        this.$refs['modalForm'].$refs[this.modalRule.refName].validate((valid) => {
          if (valid) {
            this.isSaving = true
            this.save()
          }
        })
      } else {
        this.isSaving = true
        this.save()
      }
    },
    save () {
      // 设备经纬度
      this.modalItem.forEach(e => {
        if (e.ruleProp === 'lngAndLat' && e.models) {
          let arr = e.models.split(',')
          this.modalRule.model.longitude = parseFloat(arr[0])
          this.modalRule.model.latitude = parseFloat(arr[1])
        } else if (e.ruleProp === 'lngAndLat' && !e.models) {
          this.modalRule.model.longitude = ''
          this.modalRule.model.latitude = ''
        }
      })
      let data = this.modalRule.model
      data.siteId = this.organResData.siteId
      data.siteName = this.organResData.siteName
      data.siteCode = this.organResData.siteCode
      data.customId = this.organResData.customId
      data.customName = this.organResData.customName
      data.customCode = this.organResData.customCode
      data.horizontalSpermm = data.horizontalSpermm ? Number(data.horizontalSpermm) : null
      data.verticalSpermm = data.verticalSpermm ? Number(data.verticalSpermm) : null
      data.badwayYaxis = data.badwayYaxis || ''
      let list = []
      this.uploadImg.option.previewList.forEach(e => {
        list.push(e.relativeUrl)
      })
      data.deviceType = 'XRCS' // 固定为扫描设备
      if (this.nowOpration === 'add') {
        data.deviceIcon = list[list.length - 1]
        ajax.addDevice(data).then(res => {
          this.isSaving = false
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
            this.getDeviceList()
            this.modalData.flag = false
          }
        })
      } else if (this.nowOpration === 'update') {
        data.deviceIcon = list[list.length - 1]
        if (this.updateDeleteFile !== '') {
          data.deleteFile = this.updateDeleteFile
        }
        if (this.originIcon === this.updateDeleteFile) {
          // 说明用户并没有改变原来的设备图片
          data.deleteFile = ''
        }
        ajax.updateDevice(data).then(res => {
          this.isSaving = false
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
            this.getDeviceList()
            this.modalData.flag = false
          }
        })
      } else {
        this.modalData.flag = false
      }
      this.uploadImg.option.previewList = []
    },
    getDeviceList (params = {}) { // 列表展示方法
      this.$data.tableData.data = []
      this.tableData.isPage = false
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      params.mgmtScDeviceSiteArr = this.tempArr
      ajax.getDeviceList(params).then(res => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$data.tableData.data = data.result.content
            this.$data.tableData.data.forEach(obj => {
              this.deviceStyleArr.forEach(e => {
                if (e.value === obj.deviceStyle) {
                  obj.deviceStyle = e.label
                }
              })
              obj.operation = [
                {
                  func: this.getDetail,
                  label: `<span class='iconfont editTable'>&#xe610;</span>`,
                  title: this.$t('vicenter.common.detail'),
                  show: true
                },
                {
                  func: this.getEdit,
                  label: `<span class='iconfont editTable'>&#xe650;</span>`,
                  title: this.$t('vicenter.common.fix'),
                  show: true
                }
                // {
                //   func: this.deleteDevice,
                //   label: `<span class='iconfont editTable'>&#xe658;</span>`,
                //   title: this.$t('vicenter.common.delete'),
                //   show: true
                // }
              ]
            })
            this.tableData.page.Allpage = data.result.totalElements
            if (this.tableData.data.length > 0) {
              this.tableData.isPage = true
            }
          }
        }
      })
    },
    getChildNode (node) {
      if (node.children && node.children.length > 0) {
        node.children.forEach(e => {
          this.tempArr.push(e.id)
          this.getChildNode(e)
        })
      }
    },
    handleUploadSuccess (response, file, fileList) {
      this.showSwiper = false
      if (response.flag) {
        this.$NotifSuccess(this.$t('vicenter.Background.device.uploadSuccess'))
        response.result.forEach(e => {
          let type = e.relativeUrl.substring(e.relativeUrl.lastIndexOf('.') + 1)
          type = this.$options.filters['attachType'](type)
          this.uploadImg.option.previewList = []
          this.uploadImg.option.previewList.push({
            type: type,
            src: e.signUrl,
            relativeUrl: e.relativeUrl
          })
        })
        this.$nextTick(() => {
          this.showSwiper = true
          this.showUpload = false
        })
      } else {
        this.$NotifError(this.$t('vicenter.Background.device.uploadFailure'))
        this.$nextTick(() => {
          this.showSwiper = true
        })
      }
    },
    deleteAttach (item) {
      this.$ConfirmBox(this.$t('vicenter.Background.device.sureDeletedevicepicture'), () => {
        this.showSwiper = false
        this.showUpload = false
        this.originIcon = ''
        this.uploadImg.option.previewList.forEach((e, index) => {
          if (e.relativeUrl === item.relativeUrl) {
            let id = this.modalRule.model.id
            if (item.relativeUrl === this.updateDeleteFile) {
              this.uploadImg.option.previewList.splice(index, 1)
              this.$nextTick(() => {
                this.showSwiper = true
                this.uploadImg.option.fileList = []
                this.showUpload = true
              })
            } else {
              ajax.delAttach({ id: id, deleteFile: item.relativeUrl }).then((res) => {
                if (res.data.flag) {
                  this.uploadImg.option.previewList.splice(index, 1)
                }
                this.$nextTick(() => {
                  this.showSwiper = true
                  this.uploadImg.option.fileList = []
                  this.showUpload = true
                })
              }).catch(() => {
                this.$nextTick(() => {
                  this.showSwiper = true
                })
              })
            }
          }
        })
      })
    },
    clickImg () {
      var viewer = new Viewer(document.getElementById('pic'))
      this.$nextTick().then(() => {
        viewer.update()
      })
      viewer.view(0)
    },
    initDeviceData () {
      this.modalItem.forEach(obj => {
        if (obj.ruleProp === 'deviceType') {
          this.deviceTypeArr = obj.option
        } else if (obj.ruleProp === 'deviceStyle') {
          this.deviceStyleArr = obj.option
        }
      })
    },
    saveNull () {
      return false
    },
    getDeviceIcon (arr) {
      // 设置缩放级别
      this.$refs.deviceMap.setMapZoomLevel(18)
      // 设置中心点
      this.$refs.deviceMap.setMapCenter([this.currentDeviceObj.lng, this.currentDeviceObj.lat])
      // 添加元素
      this.$refs.deviceMap.addScannerModify(arr)
    },
    handleFeatureDrag (data) {
      this.tempDeviceCoord.lng = data[0].toFixed(6)
      this.tempDeviceCoord.lat = data[1].toFixed(6)
    },
    openListDialog () {
      this.listTransfer.flag = true
      this.isOpenList = true
    },
    getListTransferOrigin () {
      this.$data.tableGroupOrigin = []
      this.$data.tableGroup = []
      let params = {
        ufType: 2,
        sysMenu: this.sysMenu
      }
      commonAjax.getSearchCondition(params).then((res) => {
        if (res.data.flag) {
          res.data.result.allEnableSc.forEach(e => {
            this.tableGroupRes.forEach(orgin => {
              if (orgin.model === e.taskField) {
                orgin.id = e.id
                this.$data.tableGroupOrigin.push(orgin)
              }
            })
          })
          res.data.result.userDefineSc.forEach(e => {
            this.$data.tableGroupOrigin.forEach(orgin => {
              if (orgin.model === e.taskField) {
                this.$data.tableGroup.push(orgin)
              }
            })
          })
          this.$data.tableGroup.unshift({
            label: this.$t('vicenter.common.No'),
            type: 'index'
          })
          this.getListTransfer()
          this.initDeviceData()
        }
      }).catch(() => {})
    },
    saveSearchcondation (ufType) {
      this.isSavingList = true
      let params = {}
      params.ufType = ufType
      params.sysMenu = this.sysMenu
      let arr = []
      arr = this.listTransfer.transfer.model
      params.strSearchCondations = arr.join(',')
      commonAjax.updateSearchCondition(params).then((res) => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
            this.getListTransferOrigin()
            this.listTransfer.flag = false
          }
          this.isOpenList = false
          this.isSavingList = false
        }
      }).catch(() => {})
    },
    dontSaveListTranfer () {
      this.listTransfer.flag = false
      this.isOpenList = false
      this.listTransfer.transfer.model = []
      this.tableGroup.forEach(ele => {
        if (ele.type !== 'operation' && ele.type !== 'index') {
          this.listTransfer.transfer.model.push(ele.id)
        }
      })
    },
    getListTransfer () {
      this.listTransfer.transfer.data = []
      this.listTransfer.transfer.model = []
      this.tableGroupOrigin.forEach(ele => {
        this.listTransfer.transfer.data.push({
          key: ele.id,
          label: ele.label
        })
      })
      this.tableGroup.forEach(e => {
        if (e.type !== 'index') {
          this.listTransfer.transfer.model.push(e.id)
        }
      })
      this.tableGroup.push(this.tableOper)
    },
    saveListTranfer () {
      this.saveSearchcondation('2')
    }
  },
  watch: {
    'modalItem': {
      handler (newValue, oldValue) {
        for (let k = 0; k < newValue.length; k++) {
          if (newValue[k].ruleProp === 'lngAndLat') {
            var reg = /^-?((([0-9]|[1-9][0-9]|1[0-7][0-9]|0{1,3})[.][0-9]{0,6})|([0-9]|[1-9][0-9]|1[0-7][0-9]|0{1,3})|180[.]0{0,6}|180),-?([0-8]?[0-9]{1}[.][0-9]{0,6}|90[.]0{0,6}|[0-8]?[0-9]{1}|90)$/
            if (reg.test(newValue[k].models) || !newValue[k].models) {
              newValue[k].btnDisabled = false
              if (newValue[k].models) {
                let arr = newValue[k].models.split(',')
                this.currentDeviceObj.lng = parseFloat(arr[0])
                this.currentDeviceObj.lat = parseFloat(arr[1])
              } else {
                this.currentDeviceObj.lng = parseFloat(this.portCoord.lng)
                this.currentDeviceObj.lat = parseFloat(this.portCoord.lat)
              }
            } else {
              this.currentDeviceObj.lng = parseFloat(this.portCoord.lng)
              this.currentDeviceObj.lat = parseFloat(this.portCoord.lat)
            }
          }
        }
      },
      deep: true
    }
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable, Dialog, Cswiper, upload, Map, DialogCommon }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.background-device-bar {
  @extend .extend-bar;
  .background-device-M {
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
          height: auto;
          @include layout(1, 'fasle');
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
        .tree-bar {
          width: $all;
          height: calc(100% - 40px);
          overflow: hidden;
        }
        .treebox {
          height: $all;
          width: $all;
          padding: 20px;
          @include box-sizing;
          .el-tree-node__content {
            min-height: fit-content;
          }
          .custom-tree-node {
            width: 100%;
            min-height: 26px;
            display: block;
            word-break: break-all;
            text-align: left;
            overflow: hidden;
            white-space: normal;
          }
        }
      }
      .panel-L {
        @extend .extend-panel-L;
        .el-form-item {
          margin-right: 5px!important;
        }
      }
    }
    .modal-dialog {
      .search-form {
        @include layout(3);
        justify-content: flex-start!important;
        .search-form-btn .el-form-item__content {
          display: none;
        }
      }
      .resultbutton {
        padding-top: 5px;
        text-align: right;
      }
      .review{
        width: $all;
        text-align: left;
        .uploadBox{
          width: $all;
          height: 150px;
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
        }
      }
      .divShow {
        text-align: left;
        height: 150px;
        padding: 20px;
        .imgShow {
          max-width: 100%;
          height: 100%;
          margin: 0 auto;
          cursor: pointer;
        }
      }
    }
  }
}
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
.deviceMapContainer {
  @include flex(column, flex-start, flex-start);
  .coorShow {
    @include flex(row, flex-end, center);
    li {
      margin-right: $dis10;
    }
  }
  .deviceMap {
    margin: $dis10 0;
    width: $all;
    height: 650px;
  }
}
.deviceMapButton {
  padding-top: 5px;
  text-align: right;
}
</style>
