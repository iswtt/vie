<template>
  <div class='image-Edit-bar'>
    <div class="image-Edit-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <div class="operation-group">
        <el-button type="white" size="mini" @click='goBack' data-id="back-btn">{{$t('vicenter.common.back')}}</el-button>
        <el-button type="primary" size="mini" @click='handleSave' data-id="save-btn">{{$t('vicenter.common.save')}}</el-button>
      </div>
      <div class="info-group">
         <!-- 查看图像 -->
        <div class="panel panel-up">
          <panelTitle :panelTitleInit="panelTitle.queryTitle">
            <!-- <el-button type="primary" size="mini" @click='openViprobe' data-id="openViprobe-btn">Viprobe</el-button> -->
          </panelTitle>
          <div class="containerBox">
            <div class="dataBox">
              <div class="imgSelect">
                <detailList :formData="imgFrom.data" :isEdit="isEdit" :formRule="imgFrom.formRule"></detailList>
              </div>
              <div class="imgShow">
                <img v-if="imageData.imageSrc" :src="imageData.imageSrc">
                <img v-else :src="defaultImg">
              </div>
            </div>
          </div>
        </div>
        <!-- 图像详情 -->
        <div class="panel panel-down">
          <panelTitle :panelTitleInit="panelTitle.listTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <detailList ref="imageAttributeForm" :formData="imageFormData" :isEdit="isEdit" :formRule="formRule"></detailList>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/api/tip/Image-Manage.js'
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import detailList from './common/detailList'
import imageView from './common/imageView'
import viProbe from '@/lib/viprobe/viProbeForTip.js'
export default {
  name: 'imageEdit',
  data () {
    const status = {
      release: '1',
      unRelease: '0'
    }
    const type = {
      single: '1',
      double: '2'
    }
    return {
      defaultImg: require('@/assets/img/common/ViCenter.png'),
      id: '',
      status: '',
      isEdit: true,
      imageData: {
        imageSrc: '',
        imageFiles: []
      },
      titleBread: { // 面包屑导航组件初始化
        font: '/', // 中间分隔字符，可以是文字，也可以是符号
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Tip/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: {
        queryTitle: {
          title: this.$t('vicenter.tip.imageManagement.tipImage')
        },
        listTitle: {
          title: this.$t('vicenter.tip.imageManagement.imageProperties')
        }
      },
      imgFrom: {
        formRule: {
          refName: 'imgFrom',
          rule: {
            imgFrom: [
              { required: true, message: this.$t('vicenter.tip.imageManagement.selectImageSource'), trigger: 'blur' }
            ]
          },
          model: {
            imgFrom: ''
          }
        },
        data: [
          {
            change: this.imgFromChange,
            type: 'select',
            value: '',
            disabled: true,
            label: this.$t('vicenter.tip.imageManagement.imageSource'),
            ruleProp: 'imgFrom', // 图像名称
            option: [
              {
                value: 'local',
                label: this.$t('vicenter.tip.imageManagement.local')
              },
              {
                value: 'ins',
                label: this.$t('vicenter.tip.imageManagement.ins')
              },
              {
                value: 'imageLibrary',
                label: this.$t('vicenter.tip.imageManagement.imageLibrary')
              }
            ]
          }
        ]
      },
      imageFormData: [
        {
          label: this.$t('vicenter.tip.imageManagement.imageName'),
          placeHolder: this.$t('vicenter.tip.imageManagement.enterImageName'),
          type: 'text',
          value: '',
          ruleProp: 'name' // 图像名称
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageStatus'),
          placeHolder: this.$t('vicenter.tip.imageManagement.selectImageStatus'),
          type: 'select',
          value: '',
          ruleProp: 'status',
          option: [
            {
              value: status.release,
              label: this.$t('vicenter.tip.imageStatistics.release')
            },
            {
              value: status.unRelease,
              label: this.$t('vicenter.tip.imageStatistics.notRelease')
            }
          ],
          change: this.changeStatus
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageType'),
          placeHolder: this.$t('vicenter.tip.imageManagement.selectImageType'),
          type: 'select',
          value: '',
          disabled: true,
          ruleProp: 'imageEnergyType',
          option: [
            {
              value: type.single,
              label: this.$t('vicenter.tip.imageStatistics.singleEnergy')
            },
            {
              value: type.double,
              label: this.$t('vicenter.tip.imageStatistics.doubleEnergy')
            }
          ],
          change: this.changeImageEnergyType
        },
        {
          label: this.$t('vicenter.tip.imageManagement.imageCategory'),
          placeHolder: this.$t('vicenter.tip.imageManagement.selectImageCategory'),
          value: '',
          ruleProp: 'imageCategory',
          type: 'select',
          option: [],
          change: this.changeImageCategories
        },
        {
          label: this.$t('vicenter.tip.imageManagement.describe'),
          type: 'textarea',
          placeHolder: this.$t('vicenter.tip.imageManagement.enterDescribe'),
          value: '',
          ruleProp: 'describe',
          maxlength: 500
        }
      ],
      formRule: {
        refName: 'imageForm',
        rule: {
          name: [
            { required: true, message: this.$t('vicenter.tip.imageManagement.enterImageName'), trigger: 'blur' }
          ],
          status: [
            { required: true, message: this.$t('vicenter.tip.imageManagement.selectImageStatus'), trigger: 'blur' }
          ],
          // imageEnergyType: [
          //   { required: true, message: this.$t('vicenter.tip.imageManagement.selectImageType'), trigger: 'blur' }
          // ],
          imageCategory: [
            { required: true, message: this.$t('vicenter.tip.imageManagement.selectImageCategory'), trigger: 'blur' }
          ]
        },
        model: {
          name: '',
          status: '',
          imageEnergyType: '',
          imageCategory: '',
          describe: ''
        }
      },
      openViprobeFlag: false,
      saveImg: {
        scanSerialNumber: '',
        scanImagePath: '',
        files: {},
        tipImageInfo: {},
        tipImagePath: '',
        tipPosition: {},
        imageEnergyType: '',
        uffFlag: ''
      },
      loading: {},
      viprobeData: {
        timeout: 3000
      }
    }
  },
  created () {
    let {id} = JSON.parse(sessionStorage.Edit)
    this.id = id
    this.$getDataByTypecode(['TIP_IMAGE_CATEGORY'], ['imageCategory'], this.imageFormData)
  },
  mounted () {
    // this.queryListImage()
    this.getDetailInfo()
  },
  methods: {
    // queryListImage () { // 获取类别树
    //   ajax.queryListImage({isAll: true}).then((res) => {
    //     if (res.data.flag) {
    //       this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
    //       this.imageFormData[3].treedata = res.data.result
    //     }
    //   }).catch(() => {})
    // },
    /**
     * tip类别点击节点
     */
    // treeClick (nodeObj, allNode) {
    //   this.imageFormData[3].value = nodeObj.name
    //   this.formRule.model.imageCategory = nodeObj.id
    //   this.$changeSelectValidateField('imageAttributeForm', this, 'imageCategory')
    // },
    getDetailInfo () {
      ajax.getImgDetail({id: this.id}).then(res => {
        if (res.data.flag) {
          let detailsData = res.data.result
          let {tipImagePath, tipImageInfo, tipPosition, imageCategory, source, picNo, originalImageInfo, path, uffFlag, imageEnergyType} = res.data.result
          this.saveImg.scanSerialNumber = picNo
          this.saveImg.tipImageInfo = tipImageInfo
          this.saveImg.files = originalImageInfo
          this.saveImg.imageEnergyType = imageEnergyType
          this.saveImg.uffFlag = uffFlag
          if (tipImagePath !== '') {
            // 需要viprobe打开的文件
            this.imageData.imageSrc = tipImagePath
            this.saveImg.tipImagePath = tipImagePath.substring(0, tipImagePath.lastIndexOf('/'))
          }
          this.imgFrom.data[0].value = source
          this.imageFormData.forEach(item => {
            item.value = detailsData[item.ruleProp]
            if (item.ruleProp === 'lastEditTime') {
              item.value = this.$options.filters['formatDate'](detailsData[item.ruleProp], this.$t('vicenter.common.formatDate'))
            }
          })
          this.formRule.model.imageCategory = imageCategory
          let tipPositionObj = JSON.parse(tipPosition)
          Object.keys(tipPositionObj).forEach(function (key) {
            tipPositionObj[key] = parseInt(tipPositionObj[key])
          })
          this.saveImg.tipPosition = tipPositionObj
          this.openViprobe()
        }
      }).catch(() => {})
    },
    setButtonEnable () {
      this.loading.close()
    },
    handleSave () {
      if (this.formRule.rule !== '{}') {
        this.$refs['imageAttributeForm'].$refs[this.formRule.refName].validate((valid) => {
          if (valid) {
            // 判断图像名称是否已存在
            let params = JSON.parse(JSON.stringify(this.formRule.model))
            params.id = this.id
            ajax.checkImageName(params).then(res => {
              if (res.data.flag) {
                this.$ConfirmBox(this.$t('vicenter.common.confirmSave'), () => {
                  var saveTipResult = {}
                  saveTipResult.flag = null
                  saveTipResult.result = {}
                  viprobeReturn.saveTipResult = saveTipResult
                  this.setLoading()
                  this.saveTip()
                })
              }
            }).catch(() => {})
          }
        })
      }
    },
    saveTip () {
      let {files} = this.saveImg
      if (files === null) {
        this.$NotifError(this.$t('vicenter.tip.imageManagement.noSelectImg'))
        this.setButtonEnable()
        return
      }
      if (this.openViprobeFlag) {
        this.viprobeSaveTip()
      }
    },
    createImage () {
      let params = JSON.parse(JSON.stringify(this.formRule.model))
      params.picNo = this.saveImg.scanSerialNumber
      let {path, originalFiles, tipFiles, fileType, geometry} = viprobeReturn.saveTipResult.result
      params.id = this.id
      params.path = path
      params.tipImage = JSON.stringify(tipFiles)
      params.tipPosition = JSON.stringify(geometry)
      params.fileType = fileType
      params.source = this.imgFrom.formRule.model.imgFrom
      ajax.update(params).then(res => {
        this.setButtonEnable()
        if (res.data.flag) {
          this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
          this.$router.push({ path: '/Tip/imageManagement' })
        }
      }).catch(() => {
        this.setButtonEnable()
      })
    },
    viprobeSaveTip (params) {
      let tipImagePath = this.saveImg.tipImagePath
      let name = this.saveImg.scanSerialNumber
      if (tipImagePath === '' || name === '') {
        this.$$NotifError(this.$t('vicenter.tip.imageManagement.pathNotExist'))
        this.setButtonEnable()
        return false
      }
      if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
        this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
        this.setButtonEnable()
        return false
      } else {
        viProbe.saveTipInViProbe(name, tipImagePath, true)
        console.info('upload ViProbe info not finished, waiting...')
        this.saveTipData()
      }
    },
    saveTipData () {
      if (viprobeReturn.saveTipResult.flag === null) {
        setTimeout(this.saveTipData, this.viprobeData.timeout)
      } else if (viprobeReturn.saveTipResult.flag === true) {
        console.debug('end validate Upload ViProbe info, submit conclusion')
        this.createImage()
      } else if (viprobeReturn.saveTipResult.flag === false) {
        // 弹出提示框，提示用户，与ViProbe交互失败
        if (viprobeReturn.errorCode !== 24578) { // viProbe返回的错误码，在viProbeForTip.js已经有提示“未抠图，请处理图片”
          this.$NotifError(this.$t('vicenter.common.viprobe.uploadError'))
        }
        this.setButtonEnable()
        return false
      }
    },
    openViprobe () {
      let name = this.saveImg.scanSerialNumber
      let path = this.saveImg.tipImagePath
      // let isUff = this.saveImg.uffFlag === '1' // UFF格式图像1:是0：否
      let isUff = this.$tipIsUFF(this.saveImg.files)
      let imageFiles = []
      let file = {}
      file.energe_type = this.saveImg.imageEnergyType
      if (this.saveImg.files.high) {
        file.high = this.saveImg.files.high
      }
      if (this.saveImg.files.low) {
        file.low = this.saveImg.files.low
      }
      if (this.saveImg.files.hemd) {
        file.hemd = this.saveImg.files.hemd
      }
      imageFiles.push(file)
      viProbe.editTipInViProbe(name, path, imageFiles, isUff, this.saveImg.tipPosition)
      this.openViprobeFlag = true
    },
    closeViprobe () {
      // 关闭ViProbe中已打开的此任务的图像
      var name = this.saveImg.scanSerialNumber // 图像 流水号
      this.saveImg.scanSerialNumber = ''
      viProbe.closeImageInViProbe(name)
    },
    setLoading () {
      this.loading = this.$loading({
        lock: true,
        text: this.$t('vicenter.inspection.common.waiting'),
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.5)'
      })
    },
    goBack () {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.unSaving'), () => {
        this.$router.push({ path: '/Tip/imageManagement' })
      })
    },
    changeStatus () {
      this.$changeSelectValidateField('imageAttributeForm', this, 'status')
    },
    changeImageEnergyType () {
      this.$changeSelectValidateField('imageAttributeForm', this, 'imageEnergyType')
    },
    changeImageCategories () {
      this.$changeSelectValidateField('imageAttributeForm', this, 'imageCategory')
    }
  },
  beforeDestroy () {
    if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
      this.closeViprobe()
    }
  },
  components: { bread, panelTitle, detailList, imageView }
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
        height: 40%;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        @include box-sizing;
        .containerBox {
          width: $all;
          height: calc(100% - 35px);
          @include flex(row, space-between, flex-start);
          .dataBox {
            width: $all;
            height: $all;
            @include flex(column, flex-start, flex-start);
            .imgSelect{
              width: $all
            }
            .imgShow {
              width: $all;
              height: calc(100% - 35px);
              position: relative;
              overflow: hidden;
              img {
                margin: 0 auto;
                height: $all;
              }
            }
          }
        }
      }
      .panel-down {
        width: $all;
        height: calc(60% - 10px);
        border-radius: 4px;
        border: 1px solid #ddd;
        @include box-sizing;
        .form-bar {
          height: calc(100% - 35px);
        }
      }
      #panelTitle {
        .panel-title {
          border-radius: 4px;
        }
      }
    }
    @media screen and (max-width: 1640px) {
      .info-group {
        @include flex(row, space-between, flex-start);
        .panel-up {
          width: 50%;
          height: $all;
        }
        .panel-down {
          width: calc(50% - 10px);
          height: $all;
        }
      }
    }
  }
}
</style>
