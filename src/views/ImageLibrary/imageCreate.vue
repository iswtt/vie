<template>
  <div class='image-Edit-bar'>
    <div class="image-Edit-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button v-if="currentPage === 'ADD' || currentPage === 'EDIT'" type="primary" size="mini" @click='handleSave("0")' data-id="save-btn">{{$t('vicenter.common.save')}}</el-button>
        <el-button v-if="currentPage === 'ADD' || currentPage === 'EDIT'" type="primary" size="mini" @click='handleSave("1")' data-id="submit-btn">{{$t('vicenter.common.submit')}}</el-button>
        <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.RELEASE)" type="primary" size="mini" @click='handleSave("2")' data-id="publish-btn">{{$t('vicenter.ImageLibrary.HSCodeManagement.Publish')}}</el-button>
        <el-button v-if="currentPage === 'PREVIEW' && getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.REJECTED)" type="danger" size="mini" @click='toReject' data-id="reject-btn">{{$t('vicenter.ImageLibrary.HSCodeManagement.Reject')}}</el-button>
        <el-button type="white" size="mini" @click='goBack' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
      </div>
      <div class="info-group" v-bar>
        <div>
          <!-- 图像素材 -->
          <div class="panel panel-up" :class="{panelUpClass: currentPage === 'PREVIEW'}">
            <panelTitle :panelTitleInit="panelTitle.upTitle"></panelTitle>
            <imageView v-if="showImageView" ref="imageViewRef" class="imageViewClass" :imageData='imageUpData' :uuid="uuid" :imageCollectMode="imageCollectMode" :imageType='defaultImageType' :taskMarks="taskMarks" @markFile='markFile'></imageView>
            <!-- imageViewDefault组件用于过渡，没有实际作用（解决扫描图像文件表格不显示数据的问题） -->
            <imageViewDefault v-if="!showImageView" class="imageViewClass" :imageData='imageUpDataDefault'></imageViewDefault>
            <detailList v-if="currentPage === 'PREVIEW'" :formData="recommendInfoFormData" :isEdit="isEdit" :formRule="recommendInfoFormRule"></detailList>
          </div>
          <!-- 基本信息 -->
          <div class="panel panel-block" v-loading="goodsPhotoUploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
            <panelTitle :panelTitleInit="panelTitle.basicInfo"></panelTitle>
            <div class="form-bar">
              <detailList ref="basicInfoForm" :formData="basicInfoFormData" :isEdit="isEdit" :formRule="basicInfoFormRule"></detailList>
            </div>
          </div>
          <!-- 其他信息 -->
          <div class="panel panel-block" v-loading="otherAttachUploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
            <panelTitle :panelTitleInit="panelTitle.otherInfo"></panelTitle>
            <div class="form-bar">
              <detailList ref="otherInfoForm" :formData="otherInfoFormData" :isEdit="isEdit" :formRule="otherInfoFormRule"></detailList>
            </div>
          </div>
        </div>
      </div>
      <Dialog :modalData="addSeizedGoodsModalData">
        <ComForm  ref="addSeizedGoodsModal" :searchIpt="addSeizedGoodsData.inputItem" :searchFunc="addSeizedGoodsData.queryFn" :formRule='addSeizedGoodsData.formRule'></ComForm>
        <div class="addSeizedGoodsBtnClass">
          <el-button type="primary" size="mini" @click="handleAddSeizedGoods" data-id="sure-btn">{{$t('vicenter.common.sure')}}</el-button>
          <el-button size="mini" @click="closeAddModal" data-id="cancel-btn">{{$t('vicenter.common.cancel')}}</el-button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/imageLibrary/imageManagement.js'
import commonAjax from '@/api/common/common.js'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import detailList from './common/detailList'
import imageView from './common/imageView'
import imageViewDefault from './common/imageViewDefault'
import Dialog from '@/components/dialogCommon'
import ComForm from '@/components/form'
import viProbe from '@/lib/viprobe/viProbeForIns.js'
import insCommonAjax from '@/api/inspection/common.js'
import $prmCode from '@/lib/common/code.js'
export default {
  name: 'imageCreate',
  data () {
    // 查获物数量校验
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
      uuid: '',
      completeUploadIcon: false,
      $prmCode: {},
      isSaving: false, // 用来判断是否进行保存操作
      defaultAllUrl: [], // 用来保存页面上默认的所有文件
      currentAllUrl: [], // 用来保存退出页面前的所有文件
      UploadUrl: [], // 针对修改和审核页面保存后来上传的文件路径
      DeleteUrl: [], // 针对修改和审核页面保存后来删除的文件路径
      defaultImageType: '',
      showImageView: false,
      id: '',
      currentPage: '',
      isEdit: true,
      goodsPhotoNum: 0,
      goodsPhotoUploading: false,
      otherAttachNum: 0,
      otherAttachUploading: false,
      loading: false,
      uploadingTxt: this.$t('vicenter.common.uploading'),
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/ImageLibrary/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {
        upTitle: {
          title: this.$t('vicenter.ImageLibrary.common.ImageMaterials')
        },
        basicInfo: {
          title: this.$t('vicenter.ImageLibrary.imageManagement.basicInfo')
        },
        otherInfo: {
          title: this.$t('vicenter.ImageLibrary.imageManagement.otherInfo')
        }
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
      imageUpDataDefault: {
        isUFF: false,
        isEdit: true,
        scanningImgFiles: [],
        imageFile: {
          imageFilesLabel: this.$t('vicenter.ImageLibrary.imageManagement.requiredScannedImage'),
          filesArr: [],
          format: '1'
        },
        imageIcon: {
          imageIconLabel: this.$t('vicenter.ImageLibrary.imageManagement.imagePreview'),
          iconArr: [],
          iconRadio: ''
        }
      },
      imageCollectMode: '1',
      imageUpData: {
        isUFF: false,
        isEdit: true,
        scanningImgFiles: [],
        imageFile: {
          imageFilesLabel: this.$t('vicenter.ImageLibrary.imageManagement.requiredScannedImage'),
          filesArr: [],
          format: '1'
        },
        imageIcon: {
          imageIconLabel: this.$t('vicenter.ImageLibrary.imageManagement.imagePreview'),
          iconArr: [],
          iconRadio: ''
        },
        serverPath: '', // viprobe上传路径
        currentPage: '' // 当前路径
      },
      recommendTime: null,
      recommendInfoFormData: [
        {
          label: this.$t('vicenter.ImageLibrary.common.recommendedReason'),
          type: 'textarea',
          disabled: true,
          value: '',
          ruleProp: 'recommendReason'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.recommender'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'createUserAccount'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.submitDate'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'createTime'
        }
      ],
      recommendInfoFormRule: {
        refName: 'recommendInfoForm',
        rule: {},
        model: {
          createUserAccount: '',
          createTime: '',
          recommendReason: ''
        }
      },
      previewBasicInfoFormData: [ // 审核页面基本信息
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.common.ImageName')}),
          label: this.$t('vicenter.ImageLibrary.common.ImageName'),
          type: 'text',
          value: '',
          ruleProp: 'imageName'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
          type: 'radio',
          value: 'STANDARD',
          ruleProp: 'imageType',
          disabled: true,
          option: [
            {
              value: 'STANDARD',
              label: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD')
            },
            {
              value: 'ILLEGAL',
              label: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL')
            }
          ],
          change: this.imageTypeChange
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.hsCodes'),
          type: 'checkbox',
          value: [],
          ruleProp: 'hsCodes',
          isRequired: true,
          option: [],
          customClass: 'areaClass'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.packageType'),
          type: 'select',
          clearable: true,
          value: '',
          ruleProp: 'packageType',
          option: []
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.seizedDate'),
          type: 'datetime',
          isHide: true,
          value: '',
          valueFormat: 'timestamp',
          ruleProp: 'seizedTime',
          editable: false,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          }
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.packageQty'),
          type: 'text',
          value: '',
          ruleProp: 'packageQty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation'),
          placeHolder: this.$t('vicenter.ImageLibrary.common.selectSeizedGoodsLocation'),
          type: 'select2',
          collapseTags: true,
          isHide: true,
          value: '',
          ruleProp: 'seizedLocation',
          isRequired: true,
          option: []
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.goodsDesc'),
          type: 'textarea',
          value: '',
          ruleProp: 'hsNames',
          maxlength: 500
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsNumUnit'),
          type: 'text',
          value: '',
          ruleProp: 'itemNumUnit'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsInfo'),
          type: 'table',
          isHide: true,
          value: '',
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
          label: this.$t('vicenter.ImageLibrary.imageManagement.imageDate'),
          type: 'datetime',
          value: '',
          valueFormat: 'timestamp',
          ruleProp: 'imgCreateTime',
          editable: false,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          }
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsWeightUnit'),
          type: 'text',
          value: '',
          ruleProp: 'itemWeightUnit'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.ImageStatus'),
          type: 'select',
          disabled: true,
          value: '',
          ruleProp: 'imageStatus',
          option: [
            {
              value: 'TEMPORARY',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.TEMPORARY')
            },
            {
              value: 'SUBMIT',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.SUBMIT')
            },
            {
              value: 'PUBLISHED',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.PUBLISHED')
            },
            {
              value: 'REJECTED',
              label: this.$t('vicenter.ImageLibrary.common.imageStatus.REJECTED')
            }
          ]
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsPhoto'),
          type: 'upload',
          value: '',
          ruleProp: 'photo',
          show: true,
          propOption: {
            propId: 'goodsPhoto',
            height: '120px',
            width: '75%',
            slidesPerView: 2,
            spaceBetween: 20,
            autoplay: false,
            delay: 10,
            navigate: {
              position: 'outside',
              type: 'shadow'
            },
            hasFile: true,
            deleteFlag: true
          },
          listData: [],
          deleteAttach: this.deleteGoodsPhoto,
          uploadOption: {
            propId: 'upload',
            multiple: true,
            data: {
              uploadUUID: ''
            },
            action: 'imagelibrary/image/imgupfiles',
            fileList: [],
            stop: false,
            listType: 'picture-card',
            handleSuccess: this.handleUploadGoodsPhotoSuccess,
            beforeUpload: this.handleBeforeUploadGoodsPhoto,
            accept: '.jpg,.jpeg,.tif,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP'
          },
          customClass: 'areaClass'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.acquisitionMode'),
          type: 'select',
          disabled: true,
          value: '',
          ruleProp: 'imageCollectMode',
          option: [
            {
              value: '1',
              label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.MANNUAL')
            },
            {
              value: '2',
              label: this.$t('vicenter.ImageLibrary.common.AcquisitionMode.SUPERVISION')
            }
          ]
        }
      ],
      basicInfoFormData: [
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.common.ImageName')}),
          label: this.$t('vicenter.ImageLibrary.common.ImageName'),
          type: 'text',
          value: '',
          ruleProp: 'imageName'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
          type: 'radio',
          value: 'STANDARD',
          ruleProp: 'imageType',
          disabled: false,
          option: [
            {
              value: 'STANDARD',
              label: this.$t('vicenter.ImageLibrary.common.imageType.STANDARD')
            },
            {
              value: 'ILLEGAL',
              label: this.$t('vicenter.ImageLibrary.common.imageType.ILLEGAL')
            }
          ],
          change: this.imageTypeChange
        },
        {
          label: '',
          type: 'empty'
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.ImageLibrary.common.hsCodes')}),
          label: this.$t('vicenter.ImageLibrary.common.hsCodes'),
          type: 'checkbox',
          value: [],
          ruleProp: 'hsCodes',
          isRequired: true,
          option: [],
          customClass: 'areaClass',
          maxLimit: 1 // 标准图最多选择一个hscode，违规图可以多个
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseSelect', {msg: this.$t('vicenter.ImageLibrary.imageManagement.packageType')}),
          label: this.$t('vicenter.ImageLibrary.imageManagement.packageType'),
          type: 'select',
          clearable: true,
          value: '',
          ruleProp: 'packageType',
          option: []
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.imageManagement.seizedDate')}),
          label: this.$t('vicenter.ImageLibrary.imageManagement.seizedDate'),
          type: 'datetime',
          isHide: true,
          value: '',
          valueFormat: 'timestamp',
          ruleProp: 'seizedTime',
          editable: false,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          }
        },
        {
          label: '',
          type: 'empty'
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.imageManagement.packageQty')}),
          label: this.$t('vicenter.ImageLibrary.imageManagement.packageQty'),
          type: 'text',
          value: '',
          ruleProp: 'packageQty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation'),
          placeHolder: this.$t('vicenter.ImageLibrary.common.selectSeizedGoodsLocation'),
          type: 'select2',
          collapseTags: true,
          isHide: true,
          value: '',
          ruleProp: 'seizedLocation',
          isRequired: true,
          option: []
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.common.goodsDesc')}),
          label: this.$t('vicenter.ImageLibrary.common.goodsDesc'),
          type: 'textarea',
          value: '',
          ruleProp: 'hsNames',
          maxlength: 500
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.imageManagement.goodsNumUnit')}),
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsNumUnit'),
          type: 'text',
          value: '',
          ruleProp: 'itemNumUnit'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsInfo'),
          type: 'table',
          isHide: true,
          value: '',
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
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.imageManagement.imageDate')}),
          label: this.$t('vicenter.ImageLibrary.imageManagement.imageDate'),
          type: 'datetime',
          value: '',
          valueFormat: 'timestamp',
          ruleProp: 'imgCreateTime',
          editable: false,
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > Date.now()
            }
          }
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.imageManagement.goodsWeightUnit')}),
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsWeightUnit'),
          type: 'text',
          value: '',
          ruleProp: 'itemWeightUnit'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          placeHolder: this.$t('vicenter.ImageLibrary.common.inputRecommendedReason'),
          label: this.$t('vicenter.ImageLibrary.common.recommendedReason'),
          type: 'textarea',
          value: '',
          ruleProp: 'recommendReason',
          minSize: 5,
          maxSize: 5,
          maxlength: 500
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsPhoto'),
          type: 'upload',
          value: '',
          ruleProp: 'photo',
          show: true,
          propOption: {
            propId: 'goodsPhoto',
            height: '120px',
            width: '75%',
            slidesPerView: 2,
            spaceBetween: 20,
            autoplay: false,
            delay: 10,
            navigate: {
              position: 'outside',
              type: 'shadow'
            },
            hasFile: true,
            deleteFlag: true
          },
          listData: [],
          deleteAttach: this.deleteGoodsPhoto,
          uploadOption: {
            propId: 'upload',
            multiple: true,
            data: {
              uploadUUID: ''
            },
            action: 'imagelibrary/image/imgupfiles',
            fileList: [],
            stop: false,
            listType: 'picture-card',
            handleSuccess: this.handleUploadGoodsPhotoSuccess,
            beforeUpload: this.handleBeforeUploadGoodsPhoto,
            accept: '.jpg,.jpeg,.tif,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP'
          }
        }
      ],
      basicInfoFormRule: {
        refName: 'basicInfoForm',
        rule: {
          imageName: [
            {required: true, message: this.$t('vicenter.ImageLibrary.common.inputImageName'), trigger: 'blur'}
          ],
          imageType: [
            {required: true, message: ' ', trigger: 'change'}
          ],
          hsNames: [
            {required: true, message: this.$t('vicenter.ImageLibrary.common.inputGoodsDesc'), trigger: 'blur'}
          ],
          recommendReason: [
            {required: true, message: this.$t('vicenter.ImageLibrary.common.inputRecommendedReason'), trigger: 'blur'}
          ],
          packageQty: [
            {pattern: /^([1-9][0-9]{0,4}|100000)$/, message: this.$t('vicenter.common.verifyRules.onlyIntegerRange', {msg: '1~100000'}), trigger: 'change'}
          ]
        },
        model: {
          imageName: '',
          imageType: '',
          hsCodes: '',
          hsNames: '',
          recommendReason: '',
          packageType: '',
          packageQty: '',
          itemNumUnit: '',
          itemWeightUnit: '',
          seizedTime: '',
          seizedLocation: '',
          imgCreateTime: ''
        }
      },
      otherInfoFormData: [
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.imageManagement.imageSerialNumber')}),
          label: this.$t('vicenter.ImageLibrary.imageManagement.imageSerialNumber'),
          type: 'text',
          value: '',
          ruleProp: 'scanSerialNumber',
          maxlength: 100
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.supervise.taskInspection.containerNumber')}),
          label: this.$t('vicenter.supervise.taskInspection.containerNumber'),
          type: 'text',
          value: '',
          ruleProp: 'containerNums',
          input: this.inputContainerNo
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.deviceCode'),
          placeHolder: this.$t('vicenter.ImageLibrary.common.checkDeviceCode'),
          type: 'treeInput',
          value: '',
          ruleProp: 'deviceId',
          treedata: [],
          checkedOption: [],
          treeView: false,
          treeIptId: 'deviceCodeTreeInput',
          treeDataId: 'deviceCodeTreeData',
          readonly: true,
          disabled: false,
          treeClick: this.deviceIdtreeClick,
          treeRefName: 'deviceCodeTreeIptRef'
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.supervise.taskInspection.frontLpn')}),
          label: this.$t('vicenter.supervise.taskInspection.frontLpn'),
          type: 'text',
          value: '',
          ruleProp: 'lpnFront'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.common.siteCode')}),
          label: this.$t('vicenter.ImageLibrary.common.siteCode'),
          type: 'text',
          value: '',
          ruleProp: 'siteId',
          disabled: true
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.supervise.taskInspection.customsDeclarationnumber')}),
          label: this.$t('vicenter.supervise.taskInspection.customsDeclarationnumber'),
          type: 'text',
          value: '',
          ruleProp: 'decNums'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          placeHolder: this.$t('vicenter.common.tips.pleaseEnter', {msg: this.$t('vicenter.ImageLibrary.common.remarks')}),
          label: this.$t('vicenter.ImageLibrary.common.remarks'),
          type: 'textarea',
          value: '',
          ruleProp: 'remarks',
          maxlength: 500,
          minSize: 5,
          maxSize: 5
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.attachments'),
          type: 'upload',
          value: '',
          ruleProp: 'otherAttach',
          show: true,
          propOption: {
            propId: 'otherAttach',
            height: '120px',
            width: '75%',
            slidesPerView: 2,
            spaceBetween: 20,
            autoplay: false,
            delay: 10,
            navigate: {
              position: 'outside',
              type: 'shadow'
            },
            hasFile: true,
            deleteFlag: true
          },
          listData: [],
          deleteAttach: this.deleteOtherAttach,
          uploadOption: {
            propId: 'upload',
            multiple: true,
            data: {
              uploadUUID: ''
            },
            action: 'imagelibrary/image/imgupfiles',
            fileList: [],
            stop: false,
            listType: 'picture-card',
            handleSuccess: this.handleUploadOtherAttachSuccess,
            beforeUpload: this.handleBeforeUploadOtherAttach
          }
        }
      ],
      otherInfoFormRule: {
        refName: 'otherInfoForm',
        rule: {},
        model: {
          scanSerialNumber: '',
          siteId: '',
          deviceId: '',
          containerNums: '',
          lpnFront: '',
          remarks: ''
        }
      },
      selectedDeviceId: '',
      selectedSiteId: '',
      seizedList: [], // 查获物品信息
      fileList: [],
      seizedGoodsData: [
        {
          ruleProp: 'contrabandType',
          option: []
        },
        {
          ruleProp: 'contrabandLocation',
          option: []
        },
        {
          ruleProp: 'packageType',
          option: []
        },
        {
          ruleProp: 'seizedUnit',
          option: []
        }
      ],
      currentImageType: 'STANDARD',
      allParams: {},
      resFileList: [],
      editFileArr: [],
      taskMarks: null
    }
  },
  created () {
    // 保证用户上传的附件是同一组图像附件
    this.uuid = this.$uuid.v1()
    this.previewBasicInfoFormData.forEach(item => {
      if (item.ruleProp === 'photo') {
        item.uploadOption.data.uploadUUID = this.uuid
      }
    })
    this.basicInfoFormData.forEach(item => {
      if (item.ruleProp === 'photo') {
        item.uploadOption.data.uploadUUID = this.uuid
      }
    })
    this.otherInfoFormData.forEach(item => {
      if (item.ruleProp === 'otherAttach') {
        item.uploadOption.data.uploadUUID = this.uuid
      }
    })
    this.$prmCode = $prmCode
    window.viprobeUtilReturn.errorCode = 0
    window.viprobeUtilReturn.reconnectToViProbeFailed = false
    // 判断当前是添加、修改还是审核页面
    if (this.$route.path === '/ImageLibrary/imageManagement/imagePreview') {
      this.currentPage = 'PREVIEW'
      this.showImageView = false
      this.imageUpData.isEdit = false
      this.imageUpDataDefault.isEdit = false
      this.imageUpData.imageFile.imageFilesLabel = this.$t('vicenter.ImageLibrary.imageManagement.imageOriginal')
      this.imageUpDataDefault.imageFile.imageFilesLabel = this.$t('vicenter.ImageLibrary.imageManagement.imageOriginal')
      this.imageUpData.imageIcon.imageIconLabel = this.$t('vicenter.ImageLibrary.imageManagement.imagePreview')
      this.imageUpDataDefault.imageIcon.imageIconLabel = this.$t('vicenter.ImageLibrary.imageManagement.imagePreview')
      this.basicInfoFormData = this.previewBasicInfoFormData
    } else if (this.$route.path === '/ImageLibrary/imageManagement/ImageEdit') {
      this.currentPage = 'EDIT'
      this.showImageView = false
      this.imageUpData.isEdit = true
      this.imageUpDataDefault.isEdit = true
      this.imageUpData.imageFile.imageFilesLabel = this.$t('vicenter.ImageLibrary.imageManagement.imageOriginal')
      this.imageUpDataDefault.imageFile.imageFilesLabel = this.$t('vicenter.ImageLibrary.imageManagement.imageOriginal')
      this.imageUpData.imageIcon.imageIconLabel = this.$t('vicenter.ImageLibrary.imageManagement.imagePreview')
      this.imageUpDataDefault.imageIcon.imageIconLabel = this.$t('vicenter.ImageLibrary.imageManagement.imagePreview')
    } else if (this.$route.path === '/ImageLibrary/imageManagement/ImageCreate') {
      this.currentPage = 'ADD'
      this.showImageView = true
    }
    this.imageUpData.currentPage = this.currentPage
    // 加载设备树
    this.deviceAjaxTree()
    // 加载下拉列表字典项
    this.$getDataByTypecode(['CONTRABAND_TYPE', 'CONTRABAND_LOCATION', 'PACKAGE_TYPE', 'SEIZED_UNIT'], ['contrabandType', 'contrabandLocation', 'packageType', 'seizedUnit'], this.seizedGoodsData)
    // 修改页面或者审核页面要获取详情信息
    if (this.currentPage === 'EDIT' || this.currentPage === 'PREVIEW') {
      let { id } = JSON.parse(sessionStorage.details)
      this.id = id
      this.getDetails()
    }
    // 集装箱号输入框增加校验
    this.otherInfoFormRule.rule.containerNums = this.$allRules().containerNums
  },
  mounted () {
    window.viprobeReturn.uploadLocalv2Res = undefined
  },
  methods: {
    inputContainerNo () {
      this.otherInfoFormData.forEach(item => {
        if (item.ruleProp === 'containerNums') {
          item.value = item.value.toUpperCase()
        }
      })
    },
    // 判断按钮权限
    getPrmFlag (code) {
      if (this.$PrmCodeList.indexOf(code) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 获取详情
    getDetails () {
      ajax.getImageDetail({id: this.id}).then((res) => {
        if (res.data.flag) {
          let { imageType, fileList, seizedList, imageCollectMode, taskMarks } = res.data.result
          this.taskMarks = taskMarks
          this.defaultImageType = imageType // 详情信息默认图像类型
          this.currentImageType = imageType // 页面当前的图像类型（主要用于在修改和审核页面判断用户知否更改了图像类型）
          // 当图像类型为违规图时，要显示查获日期、查获位置以及查货物信息
          if (imageType === 'STANDARD') {
            this.basicInfoFormData.forEach(e => {
              if (e.ruleProp === 'seizedTime' || e.ruleProp === 'seizedLocation' || e.ruleProp === 'seizedList') {
                e.isHide = true
              }
            })
          } else if (imageType === 'ILLEGAL') {
            this.basicInfoFormData.forEach(e => {
              if (e.ruleProp === 'seizedTime' || e.ruleProp === 'seizedLocation' || e.ruleProp === 'seizedList') {
                e.isHide = false
              }
            })
          }
          this.imageCollectMode = imageCollectMode
          // 获取推荐信息
          this.getValue(this.recommendInfoFormData, res.data.result)
          // 获取基本信息
          this.getValue(this.basicInfoFormData, res.data.result)
          // 获取其他信息
          this.getValue(this.otherInfoFormData, res.data.result)
          // 设置口岸和设备页面显示默认值
          this.otherInfoFormData.forEach(e => {
            if (e.ruleProp === 'deviceId') {
              e.value = res.data.result.deviceName
            }
            if (e.ruleProp === 'siteId') {
              e.value = res.data.result.siteName
            }
          })
          // 设置当前选中的设备和口岸的id（用于保存提交或发布）
          this.selectedDeviceId = res.data.result.deviceId
          this.selectedSiteId = res.data.result.siteId
          // 设置当前查获物信息（用于保存提交或发布）
          if (seizedList && seizedList.length > 0) {
            let tempArr = []
            seizedList.forEach(e => {
              tempArr.push({
                seizedType: e.seizedType,
                seizedQty: e.seizedQty,
                seizedUnit: e.seizedUnit
              })
            })
            this.seizedList = tempArr
          }
          this.resFileList = fileList
          this.imageUpData.serverPath = this.resFileList[0].url.substring(0, this.resFileList[0].url.lastIndexOf('/') + 1)
          // 获取文件信息
          this.$initTILImgData(this.$data, fileList)
          this.showImageView = true
        }
      }).catch(() => {})
    },
    getValue (val, data) {
      val.forEach(e => {
        if (e.ruleProp === 'imgCreateTime' || e.ruleProp === 'seizedTime') {
          if (data[e.ruleProp]) {
            e.value = new Date(data[e.ruleProp])
          }
          if (data.imageType === 'STANDARD' && e.ruleProp === 'seizedTime') {
            // 标准图下也会返回查获时间（值不正确），不展示
            e.value = null
          }
        } else if (e.ruleProp === 'createTime') {
          this.recommendTime = data[e.ruleProp]
          e.value = this.$options.filters['formatDate'](data[e.ruleProp])
        } else if (e.ruleProp === 'seizedLocation') {
          e.value = data[e.ruleProp] ? data[e.ruleProp].split(',') : []
        } else if (e.ruleProp === 'seizedList') {
          if (data[e.ruleProp].length > 0 && data[e.ruleProp][0].seizedType) {
            e.tableData.data = data[e.ruleProp]
            e.tableData.data.forEach(seized => {
              seized.seizedUnitVal = seized.seizedUnit ? this.$t(`vicenter.DIC.T_SEIZED_UNIT.C_${seized.seizedUnit}`) : ''
              seized.seizedTypeVal = seized.seizedType ? this.$t(`vicenter.DIC.T_CONTRABAND_TYPE.C_${seized.seizedType}`) : ''
              seized.operation = [
                {
                  func: this.deleteSeizedGoodsInfo,
                  label: `<span class='iconfont editTable'>&#xe658;</span>`,
                  title: this.$t('vicenter.common.delete'),
                  show: true
                }
              ]
            })
          }
        } else if (e.ruleProp === 'hsCodes') {
          let hscodeIdsArr = data.hsIds ? data.hsIds.split(',') : []
          let hscodeNamesArr = data.hsNames ? data.hsNames.split(',') : []
          let hsCodesArr = data.hsCodes ? data.hsCodes.split(',') : []
          if (hscodeIdsArr.length > 0) {
            hscodeIdsArr.forEach((item, index) => {
              e.option.push({
                value: item,
                label: `(${hsCodesArr[index]})${hscodeNamesArr[index]}`,
                code: hsCodesArr[index]
              })
            })
          }
        } else {
          e.value = data[e.ruleProp]
        }
      })
    },
    // 获取设备树方法
    deviceAjaxTree () {
      commonAjax.deviceNodesTree().then(res => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pid')
          this.otherInfoFormData.forEach(e => {
            if (e.ruleProp === 'deviceId') {
              e.treedata = res.data.result
            }
          })
        }
      }).catch(() => {})
    },
    // 选取设备
    deviceIdtreeClick (nodeObj, allNode) {
      if (nodeObj.type === 'device') {
        this.otherInfoFormData.forEach(e => {
          if (e.ruleProp === 'deviceId') {
            e.value = nodeObj.name
          }
          if (e.ruleProp === 'siteId') {
            e.value = allNode.parent.data.name
          }
        })
        this.selectedDeviceId = nodeObj.id
        this.selectedSiteId = allNode.parent.data.id
      }
    },
    // 图像类型切换
    imageTypeChange () {
      // 切换图像类型的时候清空hscode和hsname
      this.$refs.basicInfoForm.emptyHscode()
      this.basicInfoFormData.forEach(item => {
        if (item.ruleProp === 'imageType') {
          this.currentImageType = item.value
        }
        if (item.ruleProp === 'hsNames') {
          item.value = ''
        }
      })
    },
    // 删除查获物
    deleteSeizedGoodsInfo (scope) {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        let tempArr = []
        this.basicInfoFormData.forEach(item => {
          if (item.ruleProp === 'seizedList') {
            item.tableData.data.forEach(e => {
              if (e.id !== scope.row.id) {
                tempArr.push(e)
              }
            })
            item.tableData.data = tempArr
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
          this.basicInfoFormData.forEach(e => {
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
    // 显示查获物模态框
    showAddSeizedGoodsModal () {
      this.addSeizedGoodsModalData.flag = true
    },
    // 删除实物照片
    deleteGoodsPhoto (data) {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        let params = {
          delFUrls: [data.src]
        }
        if (this.currentPage !== 'ADD') {
          this.DeleteUrl.push(data.src)
          let tempArr = []
          this.basicInfoFormData.forEach(item => {
            if (item.ruleProp === 'photo') {
              item.listData.forEach(e => {
                if (e.src !== data.src) {
                  tempArr.push(e)
                }
              })
              item.listData = tempArr
            }
          })
        } else {
          ajax.deleteImageFile(params).then(res => {
            if (res.data.flag) {
              this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
              let tempArr = []
              this.basicInfoFormData.forEach(item => {
                if (item.ruleProp === 'photo') {
                  item.listData.forEach(e => {
                    if (e.src !== data.src) {
                      tempArr.push(e)
                    }
                  })
                  item.listData = tempArr
                }
              })
            }
          }).catch(() => {})
        }
      })
    },
    // 实物照片上传成功
    handleUploadGoodsPhotoSuccess (response, file, fileList) {
      if (response.flag) {
        this.$NotifSuccess(this.$t('vicenter.common.uploadSuccess'))
        // 上传的文件显示到页面上
        this.basicInfoFormData.forEach(item => {
          if (item.ruleProp === 'photo') {
            response.result.forEach(e => {
              let type = this.$options.filters['attachType'](e.relativeUrl.substring(e.relativeUrl.lastIndexOf('.') + 1))
              item.listData.push({
                src: e.signUrl,
                relativeUrl: e.relativeUrl,
                type: type
              })
              this.UploadUrl.push(e.signUrl)
            })
          }
        })
      }
      // 取消加载框
      this.goodsPhotoNum--
      if (this.goodsPhotoNum === 0) {
        this.goodsPhotoUploading = false
      }
    },
    // 上传实物照片前
    handleBeforeUploadGoodsPhoto (file) {
      this.goodsPhotoUploading = true
      this.goodsPhotoNum++
    },
    // 删除其他附件
    deleteOtherAttach (data) {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        let params = {
          delFUrls: [data.src]
        }
        if (this.currentPage !== 'ADD') {
          this.DeleteUrl.push(data.src)
          let tempArr = []
          this.otherInfoFormData.forEach(item => {
            if (item.ruleProp === 'otherAttach') {
              item.listData.forEach(e => {
                if (e.src !== data.src) {
                  tempArr.push(e)
                }
              })
              item.listData = tempArr
            }
          })
        } else {
          ajax.deleteImageFile(params).then(res => {
            if (res.data.flag) {
              this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
              let tempArr = []
              this.otherInfoFormData.forEach(item => {
                if (item.ruleProp === 'otherAttach') {
                  item.listData.forEach(e => {
                    if (e.src !== data.src) {
                      tempArr.push(e)
                    }
                  })
                  item.listData = tempArr
                }
              })
            }
          }).catch(() => {})
        }
      })
    },
    // 其他附件上传成功
    handleUploadOtherAttachSuccess (response, file, fileList) {
      if (response.flag) {
        this.$NotifSuccess(this.$t('vicenter.common.uploadSuccess'))
        // 上传的文件显示到页面上
        this.otherInfoFormData.forEach(item => {
          if (item.ruleProp === 'otherAttach') {
            response.result.forEach(e => {
              let type = this.$options.filters['attachType'](e.relativeUrl.substring(e.relativeUrl.lastIndexOf('.') + 1))
              item.listData.push({
                src: e.signUrl,
                relativeUrl: e.relativeUrl,
                type: type
              })
              this.UploadUrl.push(e.signUrl)
            })
          }
        })
      }
      // 取消加载框
      this.otherAttachNum--
      if (this.otherAttachNum === 0) {
        this.otherAttachUploading = false
      }
    },
    // 上传其他附件前
    handleBeforeUploadOtherAttach (file) {
      this.otherAttachUploading = true
      this.otherAttachNum++
    },
    // 拒绝
    toReject () {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toReject'), () => {
        ajax.rejectImage({id: this.id}).then(res => {
          if (res.data.flag) {
            this.isSaving = false
            this.$router.push({ path: '/ImageLibrary/imageManagement' })
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.rejectSuccess'))
          }
        }).catch(() => {})
      })
    },
    // 保存(0)提交(1)和发布(2)共用
    handleSave (btnType) {
      this.fileList = []
      // 确认框内容
      let confirmInfo = ''
      if (btnType === '0') {
        confirmInfo = this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toSaving')
      } else if (btnType === '1') {
        confirmInfo = this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toSubmit')
      } else if (btnType === '2') {
        confirmInfo = this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toRelease')
      }
      // 扫描原图和扫描预览图
      let { filesArr, format } = this.imageUpData.imageFile
      let { iconArr, iconRadio } = this.imageUpData.imageIcon
      if (filesArr.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.ImageLibrary.imageManagement.requiredScannedImage'))
        return
      }
      if (iconArr.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.ImageLibrary.imageManagement.requiredPreviewImage'))
        return
      }
      // // 实物照片
      // this.basicInfoFormData.forEach(item => {
      //   if (item.ruleProp === 'photo' && item.listData.length > 0) {
      //     item.listData.forEach(e => {
      //       this.fileList.push(
      //         {
      //           fileClassify: '4', // 实物图
      //           docType: 'OTHER',
      //           location: e.relativeUrl,
      //           imgMd5: '',
      //           imgIsTampered: '',
      //           viewIndex: '',
      //           energyType: ''
      //           // defaultView: ''
      //         }
      //       )
      //     })
      //   }
      // })
      // // 其他附件
      // this.otherInfoFormData.forEach(item => {
      //   if (item.ruleProp === 'otherAttach' && item.listData.length > 0) {
      //     item.listData.forEach(e => {
      //       this.fileList.push(
      //         {
      //           fileClassify: '0', // 其他附件
      //           docType: 'OTHER',
      //           location: e.relativeUrl,
      //           imgMd5: '',
      //           imgIsTampered: '',
      //           viewIndex: '',
      //           energyType: ''
      //           // defaultView: ''
      //         }
      //       )
      //     })
      //   }
      // })
      // 基本信息以及其他信息
      this.basicInfoFormData.forEach(e => {
        if (e.ruleProp === 'hsCodes') {
          let hscodeArr = []
          let hsIdArr = []
          e.option.forEach(op => {
            hscodeArr.push(op.code)
            hsIdArr.push(op.value)
          })
          this.basicInfoFormRule.model.hsCodes = hscodeArr.join(',')
          this.basicInfoFormRule.model.hsIds = hsIdArr.join(',')
        }
      })
      let params = Object.assign({}, this.basicInfoFormRule.model, this.otherInfoFormRule.model)
      if (this.currentPage === 'PREVIEW') {
        // 审核页面需要推荐信息
        this.recommendInfoFormData.forEach(e => {
          params[e.ruleProp] = e.value
        })
        params.createTime = params.createTime ? new Date(this.recommendTime).getTime() : ''
      }
      if (this.currentPage === 'EDIT' || this.currentPage === 'PREVIEW') {
        // 修改和审核页面需要图像id
        params.id = this.id
      }
      params.btnType = btnType
      params.deviceId = this.selectedDeviceId
      params.siteId = this.selectedSiteId
      let _seizedList = []
      if (this.seizedList.length > 0) {
        this.seizedList.forEach(e => {
          _seizedList.push({
            seizedQty: e.seizedQty,
            seizedType: e.seizedType,
            seizedUnit: e.seizedUnit
          })
        })
      }
      params.seizedList = _seizedList
      params.fileList = this.fileList
      params.seizedLocation = params.seizedLocation.join(',')
      // 必须选择hscode
      if (params.hsCodes === '') {
        this.$NotifPrompt(this.$t('vicenter.ImageLibrary.common.selectHsCodes'))
        return
      }
      // 如果图像类型是违规图，必须添加查获物信息
      if (params.imageType === 'ILLEGAL' && params.seizedList.length === 0) {
        this.$NotifPrompt(this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsInfoRequired'))
        return
      }
      delete params.photo
      delete params.otherAttach
      params.seizedTime = params.seizedTime ? new Date(params.seizedTime).getTime() : ''
      params.imgCreateTime = params.imgCreateTime ? new Date(params.imgCreateTime).getTime() : ''
      // 保存所有的请求参数
      this.allParams = Object.assign({}, params)
      console.log(this.allParams)
      if (viprobeUtilReturn.errorCode === 24577 || viprobeUtilReturn.errorCode === 4105) {
        viprobeUtilReturn.errorCode = 0
      }
      console.log('errorCode=' + window.viprobeUtilReturn.errorCode)
      if (this.basicInfoFormRule.rule !== '{}' && this.otherInfoFormRule.rule !== '{}') {
        let flag = 0
        this.$refs['otherInfoForm'].$refs[this.otherInfoFormRule.refName].validate((valid) => {
          if (valid) {
            flag += 1
          }
        })
        this.$refs['basicInfoForm'].$refs[this.basicInfoFormRule.refName].validate((valid) => {
          if (valid && flag === 1) {
            if (viprobeUtilReturn.reconnectToViProbeFailed !== false || window.viprobeUtilReturn.errorCode !== 0) {
              this.$NotifPrompt(this.$t('vicenter.common.viprobe.waiting'))
              return false
            }
            let _this = this
            this.$ConfirmBox(confirmInfo, () => {
              if (this.currentPage === 'ADD') {
                // 创建图像页面相关逻辑
                this.setLoading()
                console.log(_this.$refs.imageViewRef.scanningImgName)
                viProbe.getMarkAsBase64(_this.$refs.imageViewRef.scanningImgName)
                // 重新生成缩略图
                this.$refs.imageViewRef.uploadIcon()
                _this.markValidator()
              } else {
                // 修改图像页面和审核页面相关逻辑
                console.log('window.viprobeReturn.openImgSuccess: ' + window.viprobeReturn.openImgSuccess)
                if (window.viprobeReturn.openImgSuccess) {
                  // 打开过viprobe（不管是有没有修改嫌疑标记 ）
                  this.setLoading()
                  console.log(_this.$refs.imageViewRef.scanningImgName)
                  viProbe.getMarkAsBase64(_this.$refs.imageViewRef.scanningImgName)
                  // 重新生成缩略图
                  this.$refs.imageViewRef.uploadIcon()
                  _this.markValidator()
                } else if (this.defaultImageType === this.currentImageType && !window.viprobeReturn.openImgSuccess) {
                  // 如果没有修改图像类型，并且没有打开过viprobe，直接提交
                  this.editNoUpload()
                  // this.updateImage()
                } else if (this.defaultImageType !== this.currentImageType && !window.viprobeReturn.openImgSuccess) {
                  // 如果修改了图像类型，并且没有打开过viprobe，提示让不匹配，用户打开viprobe
                  // this.$NotifError(this.$t('vicenter.common.viprobe.imageTypeAndMarkDontMatch'))
                  if (this.currentImageType === 'STANDARD') {
                    this.$NotifError(this.$t('vicenter.common.viprobe.toClearMark'))
                  } else if (this.currentImageType === 'ILLEGAL') {
                    this.$NotifError(this.$t('vicenter.common.viprobe.toAddMark'))
                  }
                  return false
                }
              }
            })
          }
        })
      }
    },
    // 校验嫌疑标记信息与查获信息是否相符，并进行后续操作
    markValidator () {
      let imageType = this.allParams.imageType
      let name = this.$refs.imageViewRef.scanningImgName
      let path = ''
      console.log('getMarkBase64Success' + viprobeReturn.getMarkBase64Success)
      if (viprobeReturn.getMarkBase64Success === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.setButtonEnable()
          return false
        } else {
          console.info('get mark not finished, waiting...')
          setTimeout(this.markValidator, 10)
        }
      } else if (viprobeReturn.getMarkBase64Success === true) {
        if (!this.$refs.imageViewRef.iconsUploading) {
          // 缩略图上传完毕
          let matchFlag = false
          viprobeReturn.getMarkBase64Success = null
          if (imageType === 'ILLEGAL' && viprobeReturn.markBase64 !== '') {
            matchFlag = true
          } else if (imageType === 'STANDARD' && viprobeReturn.markBase64 === '') {
            matchFlag = true
          } else {
            if (imageType === 'STANDARD') {
              this.$NotifError(this.$t('vicenter.common.viprobe.toClearMark'))
            } else if (imageType === 'ILLEGAL') {
              this.$NotifError(this.$t('vicenter.common.viprobe.toAddMark'))
            }
            this.setButtonEnable()
            return false
          }
          if (matchFlag) {
            this.createImage()
          }
        } else {
          setTimeout(this.markValidator, 100)
        }
      } else if (viprobeReturn.getMarkBase64Success === false) {
        viprobeReturn.getMarkBase64Success = null
        this.$NotifError(this.$t('vicenter.common.viprobe.getMarkError'))
        this.setButtonEnable()
        return false
      }
    },
    // 嫌疑标记等是否上传成功
    uploadViProbeInfoValidator () {
      console.log('uploadImageAnalysisSuccess' + viprobeReturn.uploadImageAnalysisSuccess)
      if (viprobeReturn.uploadImageAnalysisSuccess === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
          this.setButtonEnable()
          return false
        } else {
          console.info('upload ViProbe info not finished, waiting...')
          setTimeout(this.uploadViProbeInfoValidator, 10)
        }
      } else if (viprobeReturn.uploadImageAnalysisSuccess === true) {
        this.createImage()
      } else if (viprobeReturn.uploadImageAnalysisSuccess === false) {
        this.$NotifError(this.$t('vicenter.common.viprobe.uploadMarkError'))
        this.setButtonEnable()
        return false
      }
    },
    // 是否上传了嫌疑标记文件
    markFile (exist) {
      let type = ''
      if (exist) {
        type = 'ILLEGAL'
      } else {
        type = 'STANDARD'
      }
      this.basicInfoFormData.forEach(e => {
        if (e.ruleProp === 'imageType') {
          e.value = type
        }
      })
      this.basicInfoFormRule.model.imageType = type
      this.currentImageType = type
    },
    // 调接口保存提交或者发布
    createImage () {
      if (!this.completeUploadIcon) {
        // 缩略图生成完毕后，上传原文件
        console.log('viprobe开始上传文件...')
        if (window.viprobeReturn.openImgSuccess) {
          // 是新增页面或修改页面打开过viprobe
          window.viprobeReturn.uploadLocalImageSuccess = null
          this.$refs.imageViewRef.viprobeUploadLocalImage()
        }
        this.completeUploadIcon = true
      }
      if (window.viprobeReturn.uploadLocalImageSuccess) {
        console.log('viprobe上传文件成功')
        this.updateImage()
      } else {
        setTimeout(this.createImage, 100)
      }
    },
    // 修改时，没有打开过viprobe
    editNoUpload () {
      this.editFileArr = []
      if (this.resFileList && this.resFileList.length > 0) {
        this.resFileList.forEach(e => {
          if (e.fileClassify === '1' || e.fileClassify === '2' || e.fileClassify === '3') {
            this.editFileArr.push(e)
          }
        })
        this.imageUpData.serverPath = this.resFileList[0].url.substring(0, this.resFileList[0].url.lastIndexOf('/') + 1)
      }
      this.completeUploadIcon = true
      this.updateImage()
    },
    updateImage () {
      let params = Object.assign({}, this.allParams)
      // 将查货物信息和文件信息转成Json字符串传给后台
      if (params.seizedList) {
        params.seizedListJsonStr = JSON.stringify(params.seizedList)
      }
      delete params.seizedList
      let fileList = []
      // 实物照片
      this.basicInfoFormData.forEach(item => {
        if (item.ruleProp === 'photo' && item.listData.length > 0) {
          item.listData.forEach(e => {
            fileList.push(
              {
                fileClassify: '4', // 实物图
                docType: 'OTHER',
                location: e.relativeUrl,
                imgMd5: '',
                imgIsTampered: '',
                viewIndex: '',
                energyType: ''
                // defaultView: ''
              }
            )
          })
        }
      })
      // 其他附件
      this.otherInfoFormData.forEach(item => {
        if (item.ruleProp === 'otherAttach' && item.listData.length > 0) {
          item.listData.forEach(e => {
            fileList.push(
              {
                fileClassify: '0', // 其他附件
                docType: 'OTHER',
                location: e.relativeUrl,
                imgMd5: '',
                imgIsTampered: '',
                viewIndex: '',
                energyType: ''
                // defaultView: ''
              }
            )
          })
        }
      })
      if (this.editFileArr.length > 0) {
        fileList = fileList.concat(this.editFileArr)
      }
      params.fileListJsonStr = JSON.stringify(fileList)
      // 新增viprobe上传返回文件名参数
      console.log('uploadLocalv2Res', JSON.stringify(window.viprobeReturn.uploadLocalv2Res))
      params.localVipStr = JSON.stringify(window.viprobeReturn.uploadLocalv2Res)
      // Viprobe上传到文件服务器的文件夹路径
      console.log('serverPath', this.imageUpData.serverPath)
      params.relativeFolder = this.imageUpData.serverPath
      console.log(params)
      let isUpdate = this.currentPage !== 'ADD'
      ajax.updateImage(params, isUpdate).then(res => {
        if (res.data.flag) {
          if (this.allParams.btnType === '0') {
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.saveSuccess'))
          } else if (this.allParams.btnType === '1') {
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.submitSuccess'))
          } else if (this.allParams.btnType === '2') {
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.releaseSuccess'))
          }
          this.isSaving = true
          this.$router.push({ path: '/ImageLibrary/imageManagement' })
        }
        this.setButtonEnable()
      }).catch(() => {})
    },
    goBack () {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.unSaving'), () => {
        this.isSaving = false
        this.$router.push({ path: '/ImageLibrary/imageManagement' })
      })
    },
    // 隐藏整屏加载框
    setButtonEnable () {
      this.loading.close()
    },
    // 显示整屏加载框
    setLoading () {
      this.loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.5)'
      })
    },
    changeSeizedType () {
      this.$changeSelectValidateField('addSeizedGoodsModal', this, 'seizedType')
    },
    changeSeizedUnit () {
      this.$changeSelectValidateField('addSeizedGoodsModal', this, 'seizedUnit')
    },
    getSort () {},
    queryNull () {}
  },
  beforeDestroy () {
    let curIconImg = []
    // 扫描图像原图文件
    if (this.imageUpData.imageFile.filesArr.length > 0) {
      this.imageUpData.imageFile.filesArr.forEach(e => {
        this.currentAllUrl.push(e.location)
      })
    }
    // 扫描图像预览图文件
    if (this.imageUpData.imageIcon.iconArr.length > 0) {
      this.imageUpData.imageIcon.iconArr.forEach(e => {
        this.currentAllUrl.push(e.signUrl.substring(0, e.signUrl.lastIndexOf('?')))
        curIconImg.push(e.signUrl.substring(0, e.signUrl.lastIndexOf('?')))
      })
    }
    // 实物照片
    this.basicInfoFormData.forEach(item => {
      if (item.ruleProp === 'photo') {
        if (item.listData.length > 0) {
          item.listData.forEach(e => {
            this.currentAllUrl.push(e.src.substring(0, e.src.lastIndexOf('?')))
          })
        }
      }
    })
    // 其他附件
    this.otherInfoFormData.forEach(item => {
      if (item.ruleProp === 'otherAttach') {
        if (item.listData.length > 0) {
          item.listData.forEach(e => {
            this.currentAllUrl.push(e.src.substring(0, e.src.lastIndexOf('?')))
          })
        }
      }
    })
    let tempUploadUrl = this.$refs.imageViewRef.tempUploadUrl
    let tempDeleteUrl = this.$refs.imageViewRef.tempDeleteUrl
    let lastTimeImgUrl = this.$refs.imageViewRef.lastTimeImgUrl
    commonAjax.isLogon().then((res) => {
      if (res.data.flag) {
        if (this.currentPage === 'ADD') {
          // 创建页面如果没有进行保存、提交或发布操作而退出当前页面，则删除所有上传的文件
          let params = {
            delFUrls: []
          }
          if (!this.isSaving) {
            params.delFUrls = this.currentAllUrl.concat(lastTimeImgUrl)
          } else {
            // 删除viprobe生成的多余的缩略图
            params.delFUrls = lastTimeImgUrl
          }
          ajax.deleteImageFile(params).then(res => {
            if (res.data.flag) {}
          }).catch(() => {})
        } else if (this.currentPage === 'EDIT' || this.currentPage === 'PREVIEW') {
          if (!this.isSaving) {
            // 如果没有保存，则删除临时上传的文件
            let _lastTimeImgUrl = []
            if (lastTimeImgUrl.length > 0) {
              _lastTimeImgUrl = lastTimeImgUrl.length > 0 ? lastTimeImgUrl.slice(2) : []
              _lastTimeImgUrl = _lastTimeImgUrl.concat(curIconImg)
            }
            let allUrl = this.UploadUrl.concat(tempUploadUrl).concat(_lastTimeImgUrl)
            if (allUrl.length > 0) {
              let params = {
                delFUrls: allUrl
              }
              ajax.deleteImageFile(params).then(res => {
                if (res.data.flag) {}
              }).catch(() => {})
            }
          } else {
            // 如果保存，则删除做了删除操作的文件
            let allUrl = this.DeleteUrl.concat(tempDeleteUrl).concat(lastTimeImgUrl)
            if (allUrl.length > 0) {
              let params = {
                delFUrls: allUrl
              }
              ajax.deleteImageFile(params).then(res => {
                if (res.data.flag) {}
              }).catch(() => {})
            }
          }
        }
      }
    })
  },
  components: { bread, panelTitle, detailList, imageView, imageViewDefault, Dialog, ComForm },
  watch: {
    'seizedGoodsData': {
      handler (newValue, oldValue) {
        for (let k = 0; k < newValue.length; k++) {
          if (newValue[k].ruleProp === 'contrabandType') {
            this.addSeizedGoodsData.inputItem.forEach(e => {
              if (e.ruleProp === 'seizedType') {
                e.option = newValue[k].option
              }
            })
          }
          if (newValue[k].ruleProp === 'contrabandLocation') {
            this.basicInfoFormData.forEach(e => {
              if (e.ruleProp === 'seizedLocation') {
                e.option = newValue[k].option
              }
            })
          }
          if (newValue[k].ruleProp === 'packageType') {
            this.basicInfoFormData.forEach(e => {
              if (e.ruleProp === 'packageType') {
                e.option = newValue[k].option
              }
            })
          }
          if (newValue[k].ruleProp === 'seizedUnit') {
            this.addSeizedGoodsData.inputItem.forEach(e => {
              if (e.ruleProp === 'seizedUnit') {
                e.option = newValue[k].option
              }
            })
          }
        }
      },
      deep: true
    },
    'currentImageType': {
      handler (newValue, oldValue) {
        if (newValue === 'STANDARD') {
          this.basicInfoFormData.forEach(e => {
            if (e.ruleProp === 'seizedLocation' || e.ruleProp === 'seizedList' || e.ruleProp === 'seizedTime') {
              e.isHide = true
            }
            if (e.ruleProp === 'seizedList') {
              e.tableData.data = []
              this.seizedList = []
            }
            if (e.ruleProp === 'seizedLocation') {
              e.value = []
            }
            if (e.ruleProp === 'seizedTime') {
              e.value = ''
            }
            if (e.ruleProp === 'hsCodes') {
              e.maxLimit = 1
            }
          })
          if (this.basicInfoFormRule.rule.seizedLocation) {
            delete this.basicInfoFormRule.rule.seizedLocation
          }
          this.$refs['basicInfoForm'].$refs[this.basicInfoFormRule.refName].resetFields()
        } else if (newValue === 'ILLEGAL') {
          this.basicInfoFormData.forEach(e => {
            if (e.ruleProp === 'seizedLocation' || e.ruleProp === 'seizedList' || e.ruleProp === 'seizedTime') {
              e.isHide = false
            }
            if (e.ruleProp === 'hsCodes') {
              e.maxLimit = null
            }
          })
          this.basicInfoFormRule.rule.seizedLocation = [
            {required: true, message: this.$t('vicenter.ImageLibrary.common.selectSeizedGoodsLocation'), trigger: 'blur'}
          ]
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.image-Edit-bar {
  @extend .extend-bar;
  .image-Edit-M {
    height: $all;
    padding:$margin;
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
    }
    .info-group {
      @include flex(column, flex-start, flex-start);
      height: calc(100% - 65px);
      .panel-up {
        width: $all;
        height: 300px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid $detailBorder;
        @include box-sizing;
        .imageViewClass {
          height: 260px!important;
        }
      }
      .panelUpClass {
        height: 410px;
      }
      .panel-block {
        width: $all;
        min-height: 150px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid $detailBorder;
        @include box-sizing;
      }
      #panelTitle {
        .panel-title {
          border-radius: 4px;
        }
      }
      .areaClass {
        position: absolute;
        top: 32px;
        left: 0;
      }
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
