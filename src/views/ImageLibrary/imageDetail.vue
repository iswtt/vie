<template>
  <div class='image-detail-bar'>
    <div class="image-detail-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button v-if="printButton" data-id="print-btn" @click="handlePrint" type="primary" size="mini" >{{$t('vicenter.common.print')}}</el-button>
        <el-button v-if="exportButton" data-id="export-btn" @click="handleExport" type="primary" size="mini" >{{$t('vicenter.common.export', {msg: ''})}}</el-button>
        <el-button v-if="currentImageStatus === 'REJECTED'" type="danger" size="mini" @click='toDelete' data-id="delete-btn">{{$t('vicenter.common.delete')}}</el-button>
        <el-button v-if="currentImageStatus === 'PUBLISHED' && !flag && getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.UNRELEASE)" type="primary" size="mini" @click='unRelease' data-id="unpublish-btn">{{$t('vicenter.ImageLibrary.HSCodeManagement.Unpublish')}}</el-button>
        <el-button type="white" size="mini" @click='goBack' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
      </div>
      <div class="info-group" v-bar>
        <div>
          <!-- 图像素材 -->
          <div class="panel panel-up panel-up-class">
            <panelTitle :panelTitleInit="panelTitle.upTitle"></panelTitle>
            <imageView v-if="showImageView" class="imageViewClass" :imageData='imageUpData' :imageCollectMode="imageCollectMode" :imageType='defaultImageType' :taskMarks="taskMarks"></imageView>
            <imageViewDefault v-if="!showImageView" class="imageViewClass" :imageData='imageUpDataDefault'></imageViewDefault>
            <detailList :formData="recommendInfoFormData" :isEdit="isEdit" :formRule="recommendInfoFormRule"></detailList>
          </div>
          <!-- 基本信息 -->
          <div class="panel panel-block">
            <panelTitle :panelTitleInit="panelTitle.basicInfo"></panelTitle>
            <div class="form-bar">
              <detailList ref="basicInfoForm" :formData="basicInfoFormData" :isEdit="isEdit" :formRule="basicInfoFormRule"></detailList>
            </div>
          </div>
          <!-- 其他信息 -->
          <div class="panel panel-block">
            <panelTitle :panelTitleInit="panelTitle.otherInfo"></panelTitle>
            <div class="form-bar">
              <detailList ref="otherInfoForm" :formData="otherInfoFormData" :isEdit="isEdit" :formRule="otherInfoFormRule"></detailList>
            </div>
          </div>
          <!-- 评论区 -->
          <div class="panel panel-block" v-if="currentImageStatus === 'PUBLISHED'">
            <panelTitle :panelTitleInit="panelTitle.commentTitle">
              <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.BBSADD)" type="primary" size="mini" @click='showCommentModal' data-id="addComment-btn">{{$t('vicenter.ImageLibrary.imageManagement.addComment')}}</el-button>
            </panelTitle>
            <div class="form-bar" v-if="bbsList.length > 0">
              <ul class="commentBox">
                <li v-for="(item, index) in bbsList" :key="index">
                  <div class="commentInfo" data-id="commentInfo-div">
                    {{item.createTime}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.userAccount}}
                    <el-button v-if="getPrmFlag($prmCode.treeCode.imageLibrary.imageManagement.buttonPrm.BBSDELETE)" type="danger" size="mini" @click='deleteComment(item.id)' data-id="deleteComment-btn">{{$t('vicenter.common.delete')}}</el-button>
                  </div>
                  <div class="commentContent" data-id="commentContent-div">
                    {{item.commentContent}}
                  </div>
                </li>
              </ul>
            </div>
            <div v-else class="noData">{{$t('vicenter.common.nodata')}}</div>
          </div>
        </div>
      </div>
      <!-- 添加评论弹出框 -->
      <div class="modal-dialog">
        <Dialog :modalData="addCommentModal">
          <ComForm ref="commentModalForm" :searchIpt="addModalItem" :searchFunc="addModalFn" :formRule='addModalRule'></ComForm>
          <div class="operationBtn">
            <el-button @click="saveComment" type="primary" size="mini" data-id="sure-btn">{{$t('vicenter.common.sure')}}</el-button>
            <el-button @click="closeModal" size="mini" data-id="cancel-btn">{{$t('vicenter.common.cancel')}}</el-button>
          </div>
        </Dialog>
      </div>
    </div>
    <printTable ref="printTableRef" :printTable="printTable"></printTable>
  </div>
</template>

<script>
import ajax from '@/api/imageLibrary/imageManagement.js'
import bread from '@/components/breadCrumb'
import panelTitle from '@/components/title'
import detailList from './common/detailList'
import imageView from './common/imageView'
import imageViewDefault from './common/imageViewDefault'
import ComForm from '@/components/form'
import Dialog from '@/components/dialogCommon'
import $prmCode from '@/lib/common/code.js'
export default {
  name: 'imageDetails',
  data () {
    return {
      printButton: false,
      exportButton: false,
      printTable: {
        allColsNum: 6,
        title: '',
        printer: sessionStorage.userName || '',
        imgUrl: '',
        infoData: [
          {
            type: 'title',
            colspan: 6,
            infoType: 'imageInfo',
            label: this.$t('vicenter.ImageLibrary.common.imageInfo')
          },
          {
            type: 'content',
            infoType: 'imageInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.ImageName'),
                ruleProp: 'imageName'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'imageName'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.Imagetype'),
                ruleProp: 'imageType'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'imageType'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.hsCodes'),
                ruleProp: 'hsCodes'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'hsCodes'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'imageInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.ImageStatus'),
                ruleProp: 'imageStatus'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'imageStatus'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.acquisitionMode'),
                ruleProp: 'imageCollectMode'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'imageCollectMode'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageManagement.imageDate'),
                ruleProp: 'createTime'
              },
              {
                type: 'time',
                value: '',
                ruleProp: 'createTime'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'imageInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageManagement.imageSerialNumber'),
                ruleProp: 'scanSerialNumber'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'scanSerialNumber'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.siteCode'),
                ruleProp: 'siteName'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'siteName'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.deviceCode'),
                ruleProp: 'deviceName'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'deviceName'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'imageInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsInfo'),
                ruleProp: 'seizedTypeAll'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'seizedTypeAll'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation'),
                ruleProp: 'seizedLocation'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'seizedLocation'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.goodsDesc'),
                ruleProp: 'hsNames'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'hsNames'
              }
            ]
          },
          {
            type: 'title',
            colspan: 6,
            infoType: 'recommendedInfo',
            label: this.$t('vicenter.ImageLibrary.common.recommendedInfo')
          },
          {
            type: 'content',
            infoType: 'recommendedInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageManagement.recommender'),
                ruleProp: 'createUserAccount'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'createUserAccount'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageManagement.submitDate'),
                ruleProp: 'createTime'
              },
              {
                type: 'time',
                value: '',
                ruleProp: 'createTime'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.common.recommendedReason'),
                ruleProp: 'recommendReason'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'recommendReason'
              }
            ]
          },
          {
            type: 'content',
            infoType: 'recommendedInfo',
            data: [
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageManagement.reviewer'),
                ruleProp: 'auditUserAccount'
              },
              {
                type: 'text',
                value: '',
                ruleProp: 'auditUserAccount'
              },
              {
                type: 'label',
                value: this.$t('vicenter.ImageLibrary.imageManagement.reviewDate'),
                ruleProp: 'auditTime'
              },
              {
                type: 'time',
                value: '',
                ruleProp: 'auditTime'
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
      defaultImageType: '',
      $prmCode: {},
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
        },
        commentTitle: {
          title: this.$t('vicenter.ImageLibrary.imageManagement.comment')
        }
      },
      currentImageStatus: '',
      showImageView: false,
      imageUpDataDefault: {
        isEdit: false,
        imageFile: {
          imageFilesLabel: this.$t('vicenter.ImageLibrary.imageManagement.imageOriginal'),
          format: 'NUCTECH'
        },
        imageIcon: {
          imageIconLabel: this.$t('vicenter.ImageLibrary.imageManagement.imagePreview')
        }
      },
      imageCollectMode: '',
      imageUpData: {
        isUFF: false,
        isEdit: false,
        scanningImgFiles: [],
        imageFile: {
          imageFilesLabel: this.$t('vicenter.ImageLibrary.imageManagement.imageOriginal'),
          filesArr: [],
          format: 'NUCTECH'
        },
        imageIcon: {
          imageIconLabel: this.$t('vicenter.ImageLibrary.imageManagement.imagePreview'),
          iconArr: [],
          iconRadio: ''
        }
      },
      addCommentModal: {
        title: this.$t('vicenter.ImageLibrary.imageManagement.commentContent'),
        flag: false,
        resetModal: this.closeModal,
        customClass: 'addCommentModal',
        width: '700px'
      },
      addModalItem: [
        {
          getLabel: this.$t('vicenter.ImageLibrary.imageManagement.comment'),
          type: 'textarea',
          placeHolder: '',
          models: '',
          ruleProp: 'commentContent',
          autoSize: 5,
          minSize: 3,
          maxlength: 500
        }
      ],
      addModalFn: {},
      addModalRule: {
        refName: 'commentForm',
        rule: {
          commentContent: [ // 评论内容校验
            { required: true, message: this.$t('vicenter.ImageLibrary.imageManagement.inputcommentContent'), trigger: 'blur' }
          ]
        },
        model: {
          commentContent: ''
        }
      },
      id: '',
      flag: true, // true表示是从图像检索页面跳转过来的，false表示从图像管理页面跳转过来的
      isEdit: true,
      recommendInfoFormData: [
        {
          label: this.$t('vicenter.ImageLibrary.common.recommendedReason'),
          type: 'textarea',
          disabled: true,
          value: '',
          ruleProp: 'recommendReason',
          minSize: 5,
          maxSize: 5,
          customClass: 'areaClass'
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
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.reviewer'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'auditUserAccount'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.reviewDate'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'auditTime'
        }
      ],
      basicInfoFormData: [
        {
          label: this.$t('vicenter.ImageLibrary.common.ImageName'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'imageName'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
          type: 'radio',
          disabled: true,
          value: 'STANDARD',
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
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.hsCodes'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'hsCodes'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.packageType'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'packageType'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.seizedDate'),
          type: 'text',
          isHide: false,
          disabled: true,
          value: '',
          ruleProp: 'seizedTime'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.imageDate'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'createTime'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.packageQty'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'packageQty'
        },
        // {
        //   label: this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation'),
        //   type: 'select2',
        //   disabled: true,
        //   isHide: false,
        //   value: '',
        //   ruleProp: 'seizedLocation',
        //   option: []
        // },
        {
          label: this.$t('vicenter.ImageLibrary.common.seizedGoodsLocation'),
          type: 'textarea',
          disabled: true,
          isHide: false,
          value: '',
          ruleProp: 'seizedLocation',
          minSize: 1,
          maxSize: 3
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
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsNumUnit'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'itemNumUnit'
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.seizedGoodsInfo'),
          type: 'table',
          value: '',
          ruleProp: 'seizedList',
          isHide: false,
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
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsWeightUnit'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'itemWeightUnit'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.goodsDesc'),
          type: 'textarea',
          disabled: true,
          value: '',
          ruleProp: 'hsNames',
          minSize: 5,
          maxSize: 5
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.goodsPhoto'),
          type: 'swiper',
          value: '',
          ruleProp: 'photo',
          propOption: {
            propId: 'goodsPhoto',
            height: '120px',
            width: '80%',
            slidesPerView: 3,
            spaceBetween: 10,
            autoplay: false,
            delay: 10,
            navigate: {
              position: 'outside',
              type: 'shadow'
            },
            hasFile: true
          },
          listData: []
        },
        {
          label: '',
          type: 'empty'
        }
      ],
      otherInfoFormData: [
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.imageSerialNumber'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'scanSerialNumber'
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.containerNumber'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'containerNums'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.deviceCode'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'deviceName'
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.frontLpn'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'lpnFront'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.siteCode'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'siteName'
        },
        {
          label: this.$t('vicenter.supervise.taskInspection.customsDeclarationnumber'),
          type: 'text',
          disabled: true,
          value: '',
          ruleProp: 'decNums'
        },
        {
          label: '',
          type: 'empty'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.remarks'),
          type: 'textarea',
          disabled: true,
          value: '',
          ruleProp: 'remarks',
          maxlength: 500,
          minSize: 5,
          maxSize: 5
        },
        {
          label: this.$t('vicenter.ImageLibrary.imageManagement.attachments'),
          type: 'swiper',
          value: '',
          ruleProp: 'otherAttach',
          propOption: {
            propId: 'otherAttach',
            height: '120px',
            width: '80%',
            slidesPerView: 3,
            spaceBetween: 10,
            autoplay: false,
            delay: 10,
            navigate: {
              position: 'outside',
              type: 'shadow'
            },
            hasFile: true
          },
          listData: []
        }
      ],
      recommendInfoFormRule: {
        refName: 'recommendInfoForm',
        rule: {},
        model: {}
      },
      basicInfoFormRule: {
        refName: 'basicInfoForm',
        rule: {},
        model: {}
      },
      otherInfoFormRule: {
        refName: 'otherInfoForm',
        rule: {},
        model: {}
      },
      bbsList: [],
      seizedGoodsData: [
        {
          ruleProp: 'contrabandLocation',
          option: []
        }
      ],
      taskMarks: null
    }
  },
  created () {
    this.printButton = this.$getSystemConfig('printEnable')
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.$prmCode = $prmCode
    let {id, flag} = JSON.parse(sessionStorage.details)
    this.id = id
    this.flag = flag
    this.$getDataByTypecode(['CONTRABAND_LOCATION', 'PACKAGE_TYPE'], ['contrabandLocation', 'packageType'], this.seizedGoodsData)
    this.getDetails()
  },
  mounted () {
  },
  methods: {
    handlePrint () {
      this.$refs.printTableRef.handlePrint()
    },
    handleExport () {
      this.$refs.printTableRef.handleExport()
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
          // 打印信息处理
          if (this.$route.path === '/ImageLibrary/imageManagement/imageDetails') {
            this.printTable.title = this.$t('vicenter.ImageLibrary.common.imageManagementDetail')
          } else if (this.$route.path === '/ImageLibrary/imageQuery/imageDetails') {
            this.printTable.title = this.$t('vicenter.ImageLibrary.common.imageQueryDetail')
          }
          this.printTable.imgUrl = res.data.result.lastImage
          this.getPrintInfo(res.data.result, 'imageInfo')
          this.getPrintInfo(res.data.result, 'recommendedInfo')
          let { imageType, bbsList, fileList, imageStatus, imageCollectMode, taskMarks } = res.data.result
          this.taskMarks = taskMarks
          this.currentImageStatus = imageStatus
          this.defaultImageType = imageType
          // 判断关于查获信息的内容区是否显示
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
          // 获取评论列表
          this.bbsList = bbsList
          if (this.bbsList.length > 0) {
            this.bbsList.forEach(e => {
              e.createTime = this.$options.filters['formatDate'](e.createTime)
            })
          }
          // 获取文件信息
          this.$initTILImgData(this.$data, fileList)
          this.showImageView = true
        }
      }).catch(() => {})
    },
    getPrintInfo (data, type) {
      this.printTable.infoData.forEach(item => {
        if (item.infoType === type && item.type === 'content') {
          item.data.forEach(e => {
            if (e.type !== 'label') {
              if (e.type === 'time') {
                e.value = data[e.ruleProp] ? this.$options.filters['formatDate'](data[e.ruleProp]) : ''
              } else if (e.ruleProp === 'imageType') {
                e.value = this.$t('vicenter.ImageLibrary.common.imageType.' + data[e.ruleProp])
              } else if (e.ruleProp === 'imageStatus') {
                e.value = this.$t('vicenter.ImageLibrary.common.imageStatus.' + data[e.ruleProp])
              } else if (e.ruleProp === 'imageCollectMode') {
                let arr = ['MANNUAL', 'SUPERVISION']
                e.value = this.$t('vicenter.ImageLibrary.common.AcquisitionMode.' + arr[data[e.ruleProp] - 1])
              } else if (e.ruleProp === 'seizedLocation') {
                if (data[e.ruleProp]) {
                  let allLocation = data[e.ruleProp].split(',')
                  let arr = []
                  allLocation.forEach(a => {
                    arr.push(this.$t('vicenter.DIC.T_CONTRABAND_LOCATION.C_' + a))
                  })
                  e.value = arr.join(', ')
                }
              } else if (e.ruleProp === 'seizedTypeAll') {
                if (data['seizedList'] && data['seizedList'].length > 0) {
                  let arr = []
                  data['seizedList'].forEach(s => {
                    arr.push(this.$t('vicenter.DIC.T_CONTRABAND_TYPE.C_' + s.seizedType) + '(' + s.seizedQty + this.$t('vicenter.DIC.T_SEIZED_UNIT.C_' + s.seizedUnit) + ')')
                  })
                  e.value = arr.join(', ')
                } else {
                  e.value = ''
                }
              } else {
                e.value = data[e.ruleProp]
              }
            }
          })
        }
      })
    },
    getValue (val, data) {
      val.forEach(e => {
        if (e.ruleProp === 'imgCreateTime' || e.ruleProp === 'seizedTime' || e.ruleProp === 'createTime' || e.ruleProp === 'auditTime') {
          e.value = this.$options.filters['formatDate'](data[e.ruleProp])
        } else if (e.ruleProp === 'seizedLocation') {
          // e.value = data[e.ruleProp] ? data[e.ruleProp].split(',') : []
          e.value = data[e.ruleProp] ? data[e.ruleProp].split(',').map(d => this.$t(`vicenter.DIC.T_CONTRABAND_LOCATION.C_${d}`)).join(',') : ''
        } else if (e.ruleProp === 'seizedList') {
          if (data[e.ruleProp].length > 0 && data[e.ruleProp][0].seizedType) {
            e.tableData.data = data[e.ruleProp]
            e.tableData.data.forEach(seized => {
              seized.seizedType = seized.seizedType ? this.$t(`vicenter.DIC.T_CONTRABAND_TYPE.C_${seized.seizedType}`) : ''
              seized.seizedUnit = seized.seizedUnit ? this.$t(`vicenter.DIC.T_SEIZED_UNIT.C_${seized.seizedUnit}`) : ''
            })
          }
        } else if (e.ruleProp === 'packageType') {
          e.value = data[e.ruleProp] ? this.$t(`vicenter.DIC.T_PACKAGE_TYPE.C_${data[e.ruleProp]}`) : ''
        } else {
          e.value = data[e.ruleProp]
        }
      })
    },
    // 删除已拒绝状态的图像
    toDelete () {
      let params = {
        id: this.id
      }
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        ajax.deleteImage(params).then(res => {
          if (res.data.flag) {
            this.query()
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.deleteSuccess'))
          }
        }).catch(() => {})
      })
    },
    // 获取评论列表
    getBBSList () {
      ajax.getImageDetail({id: this.id}).then((res) => {
        if (res.data.flag) {
          let { bbsList } = res.data.result
          this.bbsList = bbsList
          if (this.bbsList.length > 0) {
            this.bbsList.forEach(e => {
              e.createTime = this.$options.filters['formatDate'](e.createTime)
            })
          }
        }
      }).catch(() => {})
    },
    // 添加评论
    saveComment () {
      this.$refs['commentModalForm'].$refs[this.addModalRule.refName].validate((valid) => {
        if (valid) {
          let params = {
            imageId: this.id
          }
          this.addModalItem.forEach(e => {
            params[e.ruleProp] = e.models
          })
          ajax.addBBS(params).then((res) => {
            if (res.data.flag) {
              this.getBBSList()
              this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
              this.closeModal()
            }
          }).catch(() => {})
        }
      })
    },
    // 删除评论
    deleteComment (commentId) {
      let params = {
        id: commentId
      }
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        ajax.deleteBBS(params).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
            this.getBBSList()
          }
        }).catch(() => {})
      })
    },
    showCommentModal () {
      this.addCommentModal.flag = true
    },
    closeModal () {
      this.addModalItem.forEach(e => {
        e.models = ''
      })
      this.$refs['commentModalForm'].$refs[this.addModalRule.refName].resetFields()
      this.addCommentModal.flag = false
    },
    goBack () {
      if (this.flag) {
        this.$router.push({ path: '/ImageLibrary/imageQuery' })
      } else {
        this.$router.push({ path: '/ImageLibrary/imageManagement' })
      }
    },
    // 取消发布
    unRelease () {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toUnRelease'), () => {
        ajax.unreleaseImage({id: this.id}).then((res) => {
          if (res.data.flag) {
            this.goBack()
            this.$NotifSuccess(this.$t('vicenter.ImageLibrary.imageManagement.noticeInfo.unReleaseSuccess'))
          }
        }).catch(() => {})
      })
    },
    getSort () {}
  },
  components: { bread, panelTitle, detailList, imageView, imageViewDefault, ComForm, Dialog },
  watch: {
    'seizedGoodsData': {
      handler (newValue, oldValue) {
        for (let k = 0; k < newValue.length; k++) {
          if (newValue[k].ruleProp === 'contrabandLocation') {
            this.basicInfoFormData.forEach(e => {
              if (e.ruleProp === 'seizedLocation') {
                // e.option = newValue[k].option
              }
            })
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.image-detail-bar {
  @extend .extend-bar;
  .image-detail-M {
    height: $all;
    padding:$margin;
    @include box-sizing;
    .operation-group {
        @include flex(row, flex-end, center);
        margin-bottom: $dis10;
    }
    .form-bar {
      width: $all;
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
      .panel-up-class {
        height: 460px;
        .detailListCont .detailList .group .list-label{
          font-size: 16px!important;
        }
      }
      .panel-block {
        width: $all;
        min-height: 150px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid $detailBorder;
        @include box-sizing;
        .commentBox {
          width: $all;
          box-sizing: border-box;
          padding: $dis10*2;
          li {
            width: $all;
            border-bottom: 1px solid $detailBorder;
            margin-bottom: $dis10;
            text-align: left;
            .commentInfo {
              position: relative;
              font-weight: bold;
              margin-bottom: $dis10;
              font-size: 16px;
              button {
                position: absolute;
                top: 0;
                right: 0;
                padding: 5px 15px;
              }
            }
            .commentContent {
              font-size: 14px;
              line-height: 20px;
              padding: 0 $dis10*6 $dis10 $dis10;
              word-break: break-all;
            }
          }
        }
        .noData {
          line-height: 150px;
        }
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
.addCommentModal {
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
  .operationBtn {
    padding-top: 5px;
    text-align: right;
  }
}
</style>
