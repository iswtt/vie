<template>
  <div id="image-view">
    <div class="imageFilesBox" v-loading="filesUploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
      <div class="head">
        <div class="label">
          <span :class="{labelRequired: imageData.isEdit}">{{imageData.imageFile.imageFilesLabel}}</span>
          <!-- <el-select v-if="imageData.isEdit" v-model="imageData.imageFile.format" @change="handleFormatChange" size="small" :placeholder="$t('vicenter.ImageLibrary.common.checkImagetype')" data-id="imageType-select">
            <el-option
              v-for="item in formatOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </div>
        <div v-if="showImgUpload" class="operation">
          <!-- <upload v-if="imageData.isEdit" ref='uploadImgFiles' :propOption='uploadImgFiles.option'></upload> -->
          <el-button v-if="imageData.isEdit" type="primary" size="mini" @click='uploadFile' data-id="upload-btn">{{$t('vicenter.ImageLibrary.common.Upload')}}</el-button>
          <el-button v-if="showViprobe" type="primary" size="mini" @click='openViprobe' data-id="viProbe-btn">ViProbe</el-button>
        </div>
      </div>
      <div class="imageShow" v-bar>
        <div>
          <ComTable :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
        </div>
      </div>
    </div>
    <div class="imageIconBox" v-loading="iconsUploading" :element-loading-text="uploadingTxt" element-loading-background="rgba(255, 255, 255, 0.8)">
      <div class="head">
        <div v-if="imageData.isEdit" class="label" :class="{labelRequired: imageData.isEdit}">{{imageData.imageIcon.imageIconLabel}}</div>
        <div v-else class="label">{{imageData.imageIcon.imageIconLabel}}</div>
        <div v-if="imageData.isEdit" class="operation">
          <!-- <upload v-if="imageData.isEdit" ref='uploadImgIcon' :propOption='uploadImgIcon.option'></upload> -->
          <el-button v-if="imageData.isEdit" type="primary" size="mini" @click='uploadIcon' data-id="updateIcon-btn">{{$t('vicenter.ImageLibrary.common.generatePreview')}}</el-button>
        </div>
      </div>
      <div class="imageShow">
        <!-- <div v-if="!imageData.isEdit">
          <div class="imageBox onlyOne">
            <img :src="imageData.imageIcon.iconArr[0]">
          </div>
        </div> -->
        <template  v-for="(item, index) in imageData.imageIcon.iconArr" >
          <div class="content" v-if="item.defaultView" :key="index">
            <div class="imageBox">
              <img :id="'privew-img-'+index" :src="item.signUrl" @click="lookImg('privew-img-'+index)">
              <!-- <span class='iconfont editTable' v-if="imageData.isEdit" :title="$t('vicenter.common.delete')" @click="deleteIcon(item.signUrl)" data-id="deleteIcon-btn">&#xe658;</span> -->
            </div>
            <el-radio v-model="imageData.imageIcon.iconRadio" :disabled="true" :label="item.relativeUrl" @change="handleRadioChange" data-id="icon-radio">{{$t('vicenter.ImageLibrary.common.default')}}</el-radio>
          </div>
        </template>
        <div v-if="imageData.imageIcon.iconArr.length === 0" class="nodata">{{$t('vicenter.common.nodata')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import ComTable from '@/components/table'
import upload from './upload'
import viProbe from '@/lib/viprobe/viProbeForIns.js'
import insCommonAjax from '@/api/inspection/common.js'
import ajax from '@/api/imageLibrary/imageManagement.js'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  data () {
    const acceptFile = {
      NUCTECH: '.img,.mark',
      UFF: '.tif,.png,.mark'
    }
    return {
      showViprobe: false,
      imgBase64: {
        noSuspectBase64: '',
        suspectBase64: ''
      },
      const: {
        acceptFile: acceptFile
      },
      markFileFlag: false,
      markFileUrl: '',
      isUpdateImageFile: false,
      currentFileLen: 0, // 当前已经成功上传的原图数量
      currentIconLen: 0, // 当前已经成功上传的预览图数量
      scanningImgName: '',
      scanImagePath: '',
      fileNum: 0,
      filesUploading: false,
      iconNum: 0,
      iconsUploading: false,
      showImgUpload: true,
      uploadingTxt: '',
      formatOption: [
        {
          value: 'NUCTECH',
          label: 'NUCTECH'
        },
        {
          value: 'UFF',
          label: 'UFF'
        }
      ],
      acceptFormat: '.img',
      defaultImg: require('@/assets/img/common/ViCenter.png'),
      uploadImgIcon: {
        option: {
          propId: 'imageUploadIcon',
          multiple: true,
          data: {
            uploadUUID: ''
          },
          action: 'imagelibrary/image/imgupfiles',
          fileList: [],
          stop: false,
          handleSuccess: this.handleUploadIconSuccess,
          beforeUpload: this.handleBeforeUploadIcon,
          autoUpload: true,
          overLimitPrompt: false, // 此变量用于扫描图像图像上传数量限制提示信息标识
          accept: '.jpg'
        },
        limit: 2
      },
      uploadImgFiles: {
        option: {
          propId: 'imageUploadFiles',
          multiple: true,
          data: {
            uploadUUID: ''
          },
          action: 'imagelibrary/image/imgupfiles',
          fileList: [],
          stop: false,
          handleSuccess: this.handleUploadFilesSuccess,
          beforeUpload: this.handleBeforeUploadFiles,
          autoUpload: true,
          overLimitPrompt: false, // 此变量用于扫描图像图像上传数量限制提示信息标识
          accept: acceptFile.NUCTECH // 限制上传文件格式
        },
        limit: 3
      },
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'imageShowTable',
        sortMethod: this.getSort
      },
      tableGroup: [ // 表格数据列
        {
          label: this.$t('vicenter.common.No'),
          type: 'index',
          width: '70px'
        },
        {
          label: this.$t('vicenter.ImageLibrary.common.ImageName'),
          type: 'text',
          model: 'fileName',
          width: ''
          // align: 'left'
        }
        // {
        //   label: this.$t('vicenter.ImageLibrary.common.Imagetype'),
        //   type: 'select',
        //   model: 'imageType',
        //   width: '350px'
        // },
        // {
        //   label: this.$t('vicenter.ImageLibrary.imageManagement.imageSize'),
        //   type: 'text',
        //   model: 'imageSize',
        //   width: '100px'
        // },
        // {
        //   label: this.$t('vicenter.common.operation'),
        //   type: 'operation',
        //   model: 'operation',
        //   width: '120px',
        //   fixed: 'right'
        // }
      ],
      operation: [
        {
          func: this.handleFileDelete,
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          title: this.$t('vicenter.common.delete'),
          show: true
        }
      ],
      imageTypeArr: [
        {
          value: 'HIGH',
          label: this.$t('vicenter.ImageLibrary.common.HIGH')
        },
        {
          value: 'LOW',
          label: this.$t('vicenter.ImageLibrary.common.LOW')
        },
        {
          value: 'HEMD',
          label: this.$t('vicenter.ImageLibrary.common.HEMD')
        }
      ],
      lastTimeImgUrl: [], // 存放之前几次获取的缩略图
      tempUploadUrl: [], // 针对修改和审核页面保存后来上传的文件路径
      tempDeleteUrl: [], // 针对修改和审核页面保存后来删除的文件路径
      whiteList: ['img', 'uff', 'tif', 'tiff', 'png', 'PNG', 'urf'] // 白名单
    }
  },
  created () {
    if (this.$route.path === '/ImageLibrary/imageManagement/ImageCreate') {
      this.showViprobe = false
    } else {
      this.showViprobe = true
    }
    this.uploadImgFiles.option.data.uploadUUID = this.$props.uuid
    this.uploadImgIcon.option.data.uploadUUID = this.$props.uuid
    // // 显示扫描图像原文件表格信息
    // if (this.$props.imageData.isUFF) {
    //   this.$props.imageData.imageFile.format = 'UFF'
    //   this.uploadImgFiles.option.accept = this.const.acceptFile.UFF
    // } else {
    //   this.$props.imageData.imageFile.format = 'NUCTECH'
    //   this.uploadImgFiles.option.accept = this.const.acceptFile.NUCTECH
    // }
    console.log(this.$props.imageData.scanningImgFiles)
    if (this.$props.imageCollectMode === '1') {
      // 手工录入
      if (this.$props.imageData.scanningImgFiles.length > 0) {
        this.$props.imageData.scanningImgFiles.forEach(e => {
          // this.scanningImgName = e.local.name.substring(0, e.local.name.lastIndexOf('.'))
          this.scanningImgName = e.high.name.substring(0, e.high.name.lastIndexOf('.'))
        })
      }
    } else {
      // 非手工录入
      if (this.$props.imageData.scanningImgFiles.length > 0) {
        this.$props.imageData.scanningImgFiles.forEach(e => {
          this.scanningImgName = e.high.name.substring(0, e.high.name.lastIndexOf('.'))
        })
      }
    }
    this.$props.imageData.imageIcon.iconArr.forEach(e => {
      this.currentIconLen++
    })
    this.$props.imageData.imageFile.filesArr.forEach(e => {
      let disabled = false
      // if (e.fileName.indexOf('suspects_json.mark') > -1) {
      //   disabled = true
      // }
      this.currentFileLen++
      if (this.$props.imageCollectMode === '1') {
        this.tableData.data.push({
          fileClassify: e.fileClassify,
          docType: e.docType,
          location: e.location,
          relativeUrl: e.relativeUrl,
          fileName: e.fileName,
          energyType: e.energyType,
          imgMd5: e.imgMd5,
          viewIndex: e.viewIndex,
          imageType: {
            models: e.imageType.models,
            disabled: disabled,
            placeholder: this.$t('vicenter.ImageLibrary.common.checkImagetype'),
            option: this.imageTypeArr
          }
        })
      } else {
        this.tableData.data.push({
          fileClassify: e.fileClassify,
          docType: e.docType,
          location: e.location,
          relativeUrl: e.relativeUrl,
          fileName: e.fileName,
          imageType: {
            models: e.imageType.models,
            disabled: disabled,
            placeholder: this.$t('vicenter.ImageLibrary.common.checkImagetype'),
            option: this.imageTypeArr
          },
          operation: this.operation,
          energyType: e.energyType,
          imgMd5: e.imgMd5,
          viewIndex: e.viewIndex
        })
      }
    })
    // if (!this.$props.imageData.isEdit) {
    //   // 查看模式不显示操作列
    //   let tempArr = []
    //   this.tableGroup.forEach(e => {
    //     if (e.model !== 'operation') {
    //       tempArr.push(e)
    //     }
    //   })
    //   this.tableGroup = tempArr
    //   // 查看模式图像类型不可切换
    //   this.tableData.data.forEach(e => {
    //     e.imageType.disabled = true
    //   })
    // }
  },
  mounted () {},
  methods: {
    lookImg (id) {
      var viewer = new Viewer(document.getElementById(id))
      this.$nextTick().then(() => {
        viewer.update()
      })
      viewer.view(0)
    },
    // 通过viprobe上传扫描图到文件服务器
    async viprobeUploadLocalImage () {
      // 参数：imageSource:image(典图)
      viprobeReturn.uploadLocalImageSuccess = null
      let path = ''
      let getPathFlag = true
      if (this.$props.imageData.currentPage === 'ADD') {
        let imageSource = 'image'
        let res = await ajax.createImgFolder({imageSource: imageSource, uploadUUID: this.$props.uuid})
        if (res.data.flag) {
          path = res.data.result
        } else {
          getPathFlag = false
          return false
        }
      } else {
        // path = this.scanImagePath
        path = this.$props.imageData.serverPath
      }
      if (getPathFlag) {
        this.$props.imageData.serverPath = path
        viProbe.uploadLocalImageNew(this.scanningImgName, path)
        window.viprobeReturn.uploadLocalImageSuccess = null
        this.uploadLocalImageNewCallBack()
      }
    },
    // viprobe新版上传扫描图回调
    uploadLocalImageNewCallBack () {
      if (!window.viprobeReturn.uploadLocalImageSuccess) {
        if (window.viprobeReturn.uploadLocalImageSuccess === false) {
          console.log('上传失败', window.viprobeReturn.errorCode)
          viprobeReturn.uploadLocalImageSuccess = null
        } else {
          console.log('正在上传扫描图...')
          setTimeout(this.uploadLocalImageNewCallBack, 1000)
        }
      }
    },
    // viprobe上传扫描图回调
    uploadLocalImageCallBack (url) {
      if (!window.viprobeReturn.uploadLocalImageSuccess) {
        console.log('正在上传扫描图...')
        setTimeout(this.uploadLocalImageCallBack, 100, url)
      } else {
        this.$props.imageData.imageFile.filesArr.forEach(item => {
          let location = url + item.fileName
          item.location = location
          item.relativeUrl = location.split('intelImage')[1]
        })
        console.log(this.$props.imageData.imageFile.filesArr)
      }
    },
    uploadIcon () {
      if (this.$props.imageData.imageFile.filesArr.length === 0 || !window.viprobeReturn.openImgSuccess) {
        return
      }
      this.iconsUploading = true
      // 获取原缩略图
      this.markFileFlag = false
      this.imgBase64.noSuspectBase64 = ''
      this.imgBase64.suspectBase64 = ''
      // this.getImageBase64(this.scanningImgName, true)
      // 改为只获取有嫌疑的缩略图
      this.getImageBase64(this.scanningImgName, false)
    },
    uploadFile () {
      viProbe.closeAllImageInViProbe()
      this.scanningImgName = new Date().getTime().toString()
      viProbe.openLocalImageInViProbe(this.scanningImgName)
      window.viprobeReturn.openLocalResult = {
        flag: null
      }
      window.viprobeReturn.openImgSuccess = null
      this.openLocalImageInViProbeCallBack()
    },
    // 本地文件打开viprobe回调
    openLocalImageInViProbeCallBack () {
      if (window.viprobeReturn.openLocalResult.flag === null) {
        if (viprobeUtilReturn.reconnectToViProbeFailed === true) {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
          return false
        } else {
          setTimeout(this.openLocalImageInViProbeCallBack, 100)
        }
      } else if (window.viprobeReturn.openLocalResult.flag === true) {
        window.viprobeReturn.openImgSuccess = true
        console.log('打开本地文件成功', window.viprobeReturn.openLocalResult)
        this.markFileFlag = false
        let files = window.viprobeReturn.openLocalResult.result
        this.tableData.data = []
        this.$props.imageData.imageFile.filesArr = []
        let errorFlag = false
        if (files.length > 0) {
          // 限制单独上传的png
          if (files.length === 1) {
            let ext = files[0].substr(files[0].lastIndexOf('.') + 1).toLowerCase()
            if (ext === 'png') {
              this.$NotifError(this.$t('vicenter.common.viprobe.onlyImgOrUff'))
              viProbe.closeAllImageInViProbe()
              errorFlag = true
              return
            }
          }
          files.forEach(e => {
            // 判断是否上传了img和uff之外的文件  改为  img uff tif tiff png urf
            let imgext = e.substr(e.lastIndexOf('.') + 1).toLowerCase()
            if (this.whiteList.indexOf(imgext) < 0) {
              this.$NotifError(this.$t('vicenter.common.viprobe.onlyImgOrUff'))
              viProbe.closeAllImageInViProbe()
              errorFlag = true
              return
            }
            let fileClassify = e.substring(e.lastIndexOf('.') + 1) === 'img' ? '1' : '2'
            let fileName = e.substring(e.lastIndexOf('/') + 1)
            let fileObj = {
              fileClassify: fileClassify,
              docType: '',
              location: '',
              relativeUrl: '',
              fileName: fileName,
              energyType: null,
              imgMd5: '',
              viewIndex: '0'
            }
            this.$props.imageData.imageFile.format = fileClassify
            this.$props.imageData.imageFile.filesArr.push(fileObj)
            this.tableData.data.push(fileObj)
          })
        }
        if (!errorFlag) {
          // 生成缩略图
          this.uploadIcon()
        }
      } else if (window.viprobeReturn.openLocalResult.flag === false) {
        this.$NotifError(this.$t('vicenter.common.viprobe.openLocalError'))
      }
    },
    closeViprobe () {
      if (window.viprobeReturn.openImgSuccess && this.scanningImgName) {
        viProbe.closeImageInViProbe(this.scanningImgName)
        window.viprobeReturn.openImgSuccess = false
      }
    },
    async openViprobe () {
      this.closeViprobe()
      let markDeleteable = this.$props.imageData.isEdit || false
      var imageFiles = this.$props.imageData.scanningImgFiles
      var isUFF = this.$props.imageData.isUFF
      let path = ''
      if (this.$props.imageData.imageFile.filesArr && this.$props.imageData.imageFile.filesArr.length > 0) {
        let file = this.$props.imageData.imageFile.filesArr[0]
        path = file.location.substring(0, file.location.lastIndexOf('/') + 1)
        this.scanImagePath = path
      }
      if (this.$props.imageCollectMode === '1') {
        // 手工录入
        console.log(this.$props.imageData.imageFile.filesArr)
        let markFile = false
        if (this.$props.imageType === 'ILLEGAL') {
          markFile = true
        }
        // viProbe.openRemoteImageInViProbe(this.scanningImgName, path, imageFiles, markFile, false, markDeleteable)
        let markFilePath = null
        let stepFilePath = null
        if (markFile) {
          markFilePath = path + 'suspects_json.mark'
          stepFilePath = path + 'history.steps'
          let params = {
            paths: `${markFilePath},${stepFilePath}`
          }
          // 图像修改页面
          let res = await insCommonAjax.getFullSignPath(params)
          if (res.data.flag) {
            res.data.result.forEach(e => {
              if (e.indexOf('suspects_json.mark') !== -1) {
                markFilePath = e
              } else if (e.indexOf('history.steps') !== -1) {
                stepFilePath = e
              }
            })
          }
        }
        console.log(this.scanningImgName, path, imageFiles, markFilePath, stepFilePath, null, isUFF, markDeleteable)
        viProbe.openImageAndAnalysisInfoInViProbe(this.scanningImgName, path, imageFiles, markFilePath, stepFilePath, null, isUFF, markDeleteable)
        if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
          this.openViprobeFlag = true
        } else {
          this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
        }
      } else {
        var name = ''
        this.$props.imageData.scanningImgFiles.forEach(e => {
          name = e.high.name.substring(0, e.high.name.lastIndexOf('.'))
          this.scanningImgName = name
        })
        let markFilePath = path + 'suspects_json.mark'
        var stepFilePath = path + 'history.steps'
        let params = {
          paths: `${markFilePath},${stepFilePath}`
        }
        // 图像修改页面
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
          let taskMarks = this.$props.taskMarks ? JSON.parse(this.$props.taskMarks.replace(/'/g, '"')) : null
          let _markFile = taskMarks || markFilePath
          viProbe.openImageAndAnalysisInfoInViProbe(name, path, imageFiles, _markFile, stepFilePath, null, isUFF, markDeleteable)
          if (viprobeUtilReturn.reconnectToViProbeFailed === false) {
            this.openViprobeFlag = true
          } else {
            this.$NotifError(this.$t('vicenter.common.viprobe.connectFail'))
          }
        })
      }
    },
    getImageBase64 (name, flag) {
      if (window.viprobeReturn.openImgSuccess) {
        window.viprobeReturn.getImageInViProbeBase64Success = null
        if (flag) {
          console.log('获取原缩略图的base64')
          viProbe.getImageInViProbeBase64(name, true, false)
        } else {
          console.log('获取带嫌疑标记图的base64')
          viProbe.getImageInViProbeBase64(name, false, true)
        }
        window.viprobeReturn.getImageInViProbeBase64Success = null
        this.getImageBase64CallBackNew()
      } else {
        let info = flag ? 'first' : 'second'
        console.info(`get ${info} base64 not finished, waiting...`)
        let that = this
        setTimeout(() => {
          that.getImageBase64(name, flag)
        }, 1000)
      }
    },
    // 只获取有嫌疑的缩略图
    getImageBase64CallBackNew () {
      if (window.viprobeReturn.getImageInViProbeBase64Success) {
        console.log('获取带嫌疑标记缩略图base64成功')
        let imageInViProbeBase64 = window.viprobeReturn.imageInViProbeBase64
        if (!this.imgBase64.suspectBase64) {
          this.imgBase64.suspectBase64 = imageInViProbeBase64
          // this.base64Uplaod()
          this.base64UplaodNew()
        }
      } else {
        setTimeout(this.getImageBase64CallBackNew, 10)
      }
    },
    getImageBase64CallBack () {
      if (window.viprobeReturn.getImageInViProbeBase64Success) {
        if (this.markFileFlag) {
          console.log('获取带嫌疑标记缩略图base64成功')
          let imageInViProbeBase64 = window.viprobeReturn.imageInViProbeBase64
          if (this.imgBase64.noSuspectBase64 && !this.imgBase64.suspectBase64) {
            this.imgBase64.suspectBase64 = imageInViProbeBase64
            // this.base64Uplaod()
            this.base64UplaodNew()
          }
        } else {
          // 判断是否画嫌疑标记
          viProbe.getMarkAsJson(this.scanningImgName)
          window.viprobeReturn.getMarkJsonSuccess = null
          this.getMarkJsonCallback()
        }
      } else {
        setTimeout(this.getImageBase64CallBack, 10)
      }
    },
    // 业务端去掉调用上传缩略图
    base64UplaodNew () {
      let params = {
        uploadUuid: this.$props.uuid,
        noSuspectBase64: this.imgBase64.noSuspectBase64,
        suspectBase64: this.imgBase64.suspectBase64
      }
      let noSuspectBase64 = this.imgBase64.noSuspectBase64
      let suspectBase64 = null
      if (this.imgBase64.suspectBase64) {
        suspectBase64 = this.imgBase64.suspectBase64
      }
      let currentImg = JSON.parse(JSON.stringify(this.$props.imageData.imageIcon.iconArr))
      this.$props.imageData.imageIcon.iconArr = []
      suspectBase64.forEach(pic => {
        pic = `data:image/jpeg;base64,${pic}`
        this.$props.imageData.imageIcon.iconArr.push({
          signUrl: pic,
          relativeUrl: pic,
          defaultView: '0'
        })
      })
      this.$props.imageData.imageIcon.iconRadio = this.$props.imageData.imageIcon.iconArr[0].relativeUrl
      this.iconsUploading = false
    },
    async base64Uplaod () {
      let params = {
        uploadUuid: this.$props.uuid,
        noSuspectBase64: this.imgBase64.noSuspectBase64,
        suspectBase64: this.imgBase64.suspectBase64
      }
      console.log(params)
      console.log(params.noSuspectBase64 === params.suspectBase64)
      ajax.base64Uplaod(params).then((res) => {
        if (res.data.flag) {
          let currentImg = JSON.parse(JSON.stringify(this.$props.imageData.imageIcon.iconArr))
          if (currentImg.length > 0) {
            currentImg.forEach(e => {
              this.lastTimeImgUrl.push(e.signUrl.substring(0, e.signUrl.lastIndexOf('?')))
            })
          }
          let { suspectUrl, suspectSignerUrl, noSuspectUrl, noSuspectSignerUrl } = res.data.result
          this.$props.imageData.imageIcon.iconArr = [
            {
              signUrl: suspectSignerUrl,
              relativeUrl: suspectUrl
            },
            {
              signUrl: noSuspectSignerUrl,
              relativeUrl: noSuspectUrl
            }
          ]
          this.$props.imageData.imageIcon.iconRadio = this.$props.imageData.imageIcon.iconArr[0].relativeUrl
          let signUrl = this.$props.imageData.imageIcon.iconArr[0].signUrl
          // if (signUrl) {
          //   this.scanImagePath = signUrl.substring(0, signUrl.lastIndexOf('/') + 1)
          // }
        }
        this.iconsUploading = false
      })
    },
    isAddMarkSuccess () {
      if (window.viprobeReturn.addMarkSuccess) {
        // 添加嫌疑标记成功之后，获取嫌疑标记信息
        viProbe.getMarkAsJson(this.scanningImgName)
        this.getMarkJsonCallback()
      } else {
        if (window.viprobeReturn.errorCode !== 0) {
          console.log('上传的mark文件内容格式错误，需重新上传')
          this.$NotifError(this.$t('vicenter.common.viprobe.markJsonError'))
        } else {
          console.log('正在判断嫌疑标记是否添加成功')
          let that = this
          setTimeout(() => {
            that.isAddMarkSuccess()
          }, 10)
        }
      }
    },
    getMarkJsonCallback () {
      if (window.viprobeReturn.getMarkJsonSuccess) {
        console.log('获取原缩略图base64成功')
        // let imageInViProbeBase64 = window.viprobeReturn.imageInViProbeBase64[0]
        let imageInViProbeBase64 = window.viprobeReturn.imageInViProbeBase64
        console.log('当前获取的嫌疑标记json', window.viprobeReturn.marksJSON)
        if (window.viprobeReturn.marksJSON && window.viprobeReturn.marksJSON.length > 0) {
          this.markFileFlag = true
          if (!this.imgBase64.noSuspectBase64) {
            this.imgBase64.noSuspectBase64 = imageInViProbeBase64
            this.imgBase64.suspectBase64 = ''
            this.getImageBase64(this.scanningImgName, false)
          }
        } else {
          // 没有嫌疑标记，则只获取原缩略图的base64
          this.imgBase64.noSuspectBase64 = imageInViProbeBase64
          // this.imgBase64.suspectBase64 = imageInViProbeBase64
          this.imgBase64.suspectBase64 = null
          // this.base64Uplaod()
          this.base64UplaodNew()
        }
      } else {
        console.log('正在获取嫌疑标记json信息...')
        let that = this
        setTimeout(() => {
          that.getMarkJsonCallback()
        }, 10)
      }
    },
    // 切换原图格式
    handleFormatChange (selectedFormat) {
      if (selectedFormat === 'NUCTECH') {
        this.uploadImgFiles.option.accept = this.const.acceptFile.NUCTECH
      } else if (selectedFormat === 'UFF') {
        this.uploadImgFiles.option.accept = this.const.acceptFile.UFF // UFF图像材料图为png格式
      }
      this.showImgUpload = false
      // 清空已经上传的文件
      if (this.$props.imageData.imageFile.filesArr.length > 0) {
        this.uploadingTxt = ''
        this.filesUploading = true
        let deleteFilesArr = []
        this.$props.imageData.imageFile.filesArr.forEach(e => {
          deleteFilesArr.push(e.location)
        })
        let params = {
          delFUrls: deleteFilesArr
        }
        if (this.$route.path === '/ImageLibrary/imageManagement/ImageEdit' || this.$route.path === '/ImageLibrary/imageManagement/imagePreview') {
          // 如果是修改和审核页面先不删除文件服务器上面的文件，只删除页面上的文件
          // 将删除的文件全路径保存到tempDeleteUrl中
          this.$props.imageData.imageFile.filesArr.forEach(e => {
            this.tempDeleteUrl.push(e.location)
          })
          this.tableData.data = []
          this.$props.imageData.imageFile.filesArr = []
          this.currentFileLen = 0
          this.closeViprobe()
          this.isUpdateImageFile = true
          this.filesUploading = false
        } else {
          ajax.deleteImageFile(params).then(res => {
            if (res.data.flag) {
              this.tableData.data = []
              this.$props.imageData.imageFile.filesArr = []
              this.currentFileLen = 0
              this.closeViprobe()
              this.isUpdateImageFile = true
            }
            this.filesUploading = false
          }).catch(() => {})
        }
      }
      this.$nextTick(() => {
        this.showImgUpload = true
      })
    },
    // 切换默认预览图
    handleRadioChange (selectedUrl) {
      this.$props.imageData.imageIcon.iconRadio = selectedUrl
    },
    // 上传预览图成功
    handleUploadIconSuccess (response, file, fileList) {
      if (response.flag) {
        this.$NotifSuccess(this.$t('vicenter.common.uploadSuccess'))
        // 上传的文件显示到页面上
        response.result.forEach(e => {
          this.$props.imageData.imageIcon.iconArr.push(
            {
              signUrl: e.signUrl,
              relativeUrl: e.relativeUrl
            }
          )
          this.tempUploadUrl.push(e.signUrl)
        })
        this.$props.imageData.imageIcon.iconRadio = this.$props.imageData.imageIcon.iconArr[0].relativeUrl
      } else {
        this.currentIconLen--
      }
      // 取消加载框
      this.iconNum--
      if (this.iconNum === 0) {
        this.iconsUploading = false
        this.uploadImgIcon.option.overLimitPrompt = false
      }
    },
    // 上传预览图之前
    handleBeforeUploadIcon (file) {
      this.currentIconLen++
      if (this.currentIconLen > this.uploadImgIcon.limit) {
        if (!this.uploadImgIcon.option.overLimitPrompt) {
          this.$NotifError(this.$t('vicenter.common.uploadPreview.overLimitTip', {msg: this.uploadImgIcon.limit}))
          this.uploadImgIcon.option.overLimitPrompt = true
        }
        this.currentIconLen--
        return false
      } else {
        this.uploadImgIcon.option.overLimitPrompt = false
      }
      this.uploadingTxt = this.$t('vicenter.common.uploading')
      this.iconsUploading = true
      this.iconNum++
    },
    // 删除图像预览图文件
    // deleteIcon (iconUrl) {
    //   this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
    //     let params = {
    //       delFUrls: [iconUrl]
    //     }
    //     if (this.$route.path === '/ImageLibrary/imageManagement/ImageEdit' || this.$route.path === '/ImageLibrary/imageManagement/imagePreview') {
    //       // 如果是修改和审核页面先不删除文件服务器上面的文件，只删除页面上的文件
    //       // 将删除的文件全路径保存到tempDeleteUrl中
    //       this.tempDeleteUrl.push(iconUrl)
    //       let tempArr = []
    //       this.$props.imageData.imageIcon.iconArr.forEach(e => {
    //         if (e.signUrl !== iconUrl) {
    //           tempArr.push(e)
    //         }
    //       })
    //       this.$props.imageData.imageIcon.iconArr = tempArr
    //       if (this.$props.imageData.imageIcon.iconArr.length > 0) {
    //         this.$props.imageData.imageIcon.iconRadio = this.$props.imageData.imageIcon.iconArr[0].relativeUrl
    //       }
    //       this.currentIconLen--
    //     } else {
    //       ajax.deleteImageFile(params).then(res => {
    //         if (res.data.flag) {
    //           this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
    //           let tempArr = []
    //           this.$props.imageData.imageIcon.iconArr.forEach(e => {
    //             if (e.signUrl !== iconUrl) {
    //               tempArr.push(e)
    //             }
    //           })
    //           this.$props.imageData.imageIcon.iconArr = tempArr
    //           if (this.$props.imageData.imageIcon.iconArr.length > 0) {
    //             this.$props.imageData.imageIcon.iconRadio = this.$props.imageData.imageIcon.iconArr[0].relativeUrl
    //           }
    //           this.currentIconLen--
    //         }
    //       }).catch(() => {})
    //     }
    //   })
    // },
    // 上传扫描图像文件成功
    handleUploadFilesSuccess (response, file, fileList) {
      if (response.flag) {
        this.$NotifSuccess(this.$t('vicenter.common.uploadSuccess'))
        // 上传的文件显示到页面上
        response.result.forEach(e => {
          let _fileClassify = this.$props.imageData.imageFile.format === 'NUCTECH' ? '1' : '2'
          let fileName = e.relativeUrl.substring(e.relativeUrl.lastIndexOf('/') + 1)
          let checkRepeat = false // 判断文件是否重复
          this.tableData.data.forEach(_data => {
            if (_data.fileName === fileName) {
              checkRepeat = true
            }
          })
          let markFlag = this.judgeMarkFile(e.signUrl)
          let disabled = false
          if (markFlag) {
            disabled = true
          }
          let imageType = {
            models: '',
            disabled: disabled,
            placeholder: this.$t('vicenter.ImageLibrary.common.checkImagetype'),
            option: this.imageTypeArr
          }
          let fileObj = {
            markFlag: markFlag,
            fileClassify: _fileClassify,
            docType: '',
            location: e.signUrl.substring(0, e.signUrl.lastIndexOf('?')),
            relativeUrl: e.relativeUrl,
            fileName: e.relativeUrl.substring(e.relativeUrl.lastIndexOf('/') + 1),
            imageSize: Math.round(file.size / 1024 / 1024) + 'MB',
            imageType: imageType,
            operation: this.operation,
            energyType: null,
            imgMd5: '',
            viewIndex: '0'
          }
          if (checkRepeat) { // 如果文件名重复，替换掉之前的文件
            this.$props.imageData.imageFile.filesArr.forEach(arr => {
              if (arr.fileName === fileName) {
                arr = fileObj
              }
            })
          } else {
            this.$props.imageData.imageFile.filesArr.push(fileObj)
          }
          this.tempUploadUrl.push(e.signUrl)
        })
        this.tableData.data = this.$props.imageData.imageFile.filesArr
        this.closeViprobe()
        this.isUpdateImageFile = true
      } else {
        this.currentFileLen--
      }
      // 取消加载框
      this.fileNum--
      if (this.fileNum === 0) {
        this.filesUploading = false
        this.uploadImgFiles.option.overLimitPrompt = false
      }
    },
    // 判断是否上传了suspects_json.mark文件
    judgeMarkFile (signUrl) {
      if (signUrl.indexOf('suspects_json.mark') > -1) {
        this.markFileFlag = true
        this.markFileUrl = signUrl
        this.$emit('markFile', true)
        return true
      }
    },
    // 上传扫描图像文件之前
    handleBeforeUploadFiles (file) {
      let fileFormat = this.$props.imageData.imageFile.format
      if (fileFormat === 'NUCTECH') {
        this.$props.imageData.isUFF = false
      } else if (fileFormat === 'UFF') {
        this.$props.imageData.isUFF = true
      }
      this.currentFileLen++
      if (this.currentFileLen > this.uploadImgFiles.limit) {
        if (!this.uploadImgFiles.option.overLimitPrompt) {
          this.$NotifError(this.$t('vicenter.common.uploadPreview.overLimitTip', {msg: this.uploadImgFiles.limit}))
          this.uploadImgFiles.option.overLimitPrompt = true
        }
        this.currentFileLen--
        return false
      } else {
        this.uploadImgFiles.option.overLimitPrompt = false
      }
      this.uploadingTxt = this.$t('vicenter.common.uploading')
      this.filesUploading = true
      this.fileNum++
    },
    // 删除扫描图像文件
    handleFileDelete (scope) {
      this.$ConfirmBox(this.$t('vicenter.ImageLibrary.imageManagement.confirmInfo.toDelete'), () => {
        let params = {
          delFUrls: [scope.row.location]
        }
        let markFlag = false
        if (scope.row.location.indexOf('suspects_json.mark') > -1) {
          markFlag = true
        }
        if (this.$route.path === '/ImageLibrary/imageManagement/ImageEdit' || this.$route.path === '/ImageLibrary/imageManagement/imagePreview') {
          // 如果是修改和审核页面先不删除文件服务器上面的文件，只删除页面上的文件
          // 将删除的文件全路径保存到tempDeleteUrl中
          this.tempDeleteUrl.push(scope.row.location)
          let tempArr = []
          this.$props.imageData.imageFile.filesArr.forEach(e => {
            if (e.location !== scope.row.location) {
              tempArr.push(e)
            }
          })
          this.$props.imageData.imageFile.filesArr = tempArr
          this.tableData.data = this.$props.imageData.imageFile.filesArr
          this.currentFileLen--
          this.closeViprobe()
          this.isUpdateImageFile = true
          if (markFlag) { // 如果删除了mark文件，要修改图像类型
            this.markFileFlag = false
            this.$emit('markFile', false)
          }
        } else {
          ajax.deleteImageFile(params).then(res => {
            if (res.data.flag) {
              this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
              let tempArr = []
              this.$props.imageData.imageFile.filesArr.forEach(e => {
                if (e.location !== scope.row.location) {
                  tempArr.push(e)
                }
              })
              this.$props.imageData.imageFile.filesArr = tempArr
              this.tableData.data = this.$props.imageData.imageFile.filesArr
              this.currentFileLen--
              this.closeViprobe()
              this.isUpdateImageFile = true
              if (markFlag) { // 如果删除了mark文件，要修改图像类型
                this.markFileFlag = false
                this.$emit('markFile', false)
              }
            }
          }).catch(() => {})
        }
      })
    },
    getSort () {}
  },
  destroyed () {
    this.closeViprobe()
  },
  beforeDestroy () {
    this.closeViprobe()
  },
  components: { ComTable, upload },
  props: {
    'imageData': {
      type: Object,
      default: {
        isUFF: false,
        isEdit: true,
        scanningImgFiles: [],
        imageFile: {
          imageFilesLabel: '', // 左侧内容label值
          filesArr: [], // 上传的扫描图像文件数组
          format: 'NUCTECH' // 当前选中的扫描图像原图格式
        },
        imageIcon: {
          imageIconLabel: '', // 右侧内容label值
          iconArr: [], // 上传的预览图地址数组(最多两张)
          iconRadio: '' // 默认选中的预览图地址
        }
      }
    },
    'uuid': {
      required: false,
      type: String
    },
    'imageCollectMode': {
      required: false,
      type: String
    },
    'imageType': {
      required: false,
      type: String
    },
    'taskMarks': {
      required: false
    }
  },
  watch: {
    'tableData.data': {
      handler (newValue, oldValue) {
        let scanningImgFiles = []
        // 解决上传同名文件，删除之后再次上传，允许上传数量异常的问题
        this.currentFileLen = newValue.length
        if (newValue.length > 0) {
          console.log(newValue)
          newValue.forEach(e => {
            if (!e.imageType) {
              // 本地打开的图像不能识别图像类型
              e.docType = 'LOCAL'
            } else {
              e.docType = e.imageType.models
            }
            if (e.fileClassify === '1' || e.fileClassify === '2') {
              // if (e.fileClassify === '1') {
              //   this.$props.imageData.isUFF = false
              // } else if (e.fileClassify === '2') {
              //   this.$props.imageData.isUFF = true
              // }
              let res = this.$getScanningData(newValue)
              this.$props.imageData.scanningImgFiles = res
            }
          })
        }
        this.$props.imageData.imageFile.filesArr = newValue
      },
      deep: true
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#image-view {
  @include flex(row, flex-start, flex-start);
  .head {
    padding: 0 $dis10;
    @include flex(row, space-between, flex-start);
    .label {
      height: 26px;
    }
    .labelRequired::after {
      content: "*";
      color: $danger;
      margin-left: 4px;
    }
  }
  .imageFilesBox {
    width: $all/2;
    height: $all;
    box-sizing: border-box;
    padding: $dis10 $dis10*2;
    .head {
      .el-select--small {
        height: 28px;
      }
      .operation {
        div,button {
          display: inline-block;
        }
      }
    }
    .imageShow {
      width: $all;
      height: 230px;
      .tableComp {
        padding-bottom: 0;
        .exportFor {
          margin-top: 0;
        }
      }
    }
  }
  .imageIconBox {
    width: $all/2;
    height: $all;
    box-sizing: border-box;
    padding: $dis10 $dis10*2;
    .head {
      padding-right: $dis10*2;
    }
    .imageShow {
      width: $all;
      @include flex(row, flex-start, flex-start);
      height: calc(100% - 35px);
      padding: $dis10;
      box-sizing: border-box;
      div.content {
        width: 48%;
        height: $all;
        text-align: left;
        margin-right: $dis10;
        .imageBox {
          position: relative;
          padding-right: $dis10;
          width: $all;
          height: 90%;
          overflow: hidden;
          img {
            max-height: $all;
            width: $all;
            display: inline-block;
          }
          .iconfont {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
        .onlyOne {
          img {
            width: auto;
            height: $all;
          }
        }
        .el-radio {
          margin-top: $dis10;
        }
      }
      .nodata {
        width: $all;
        text-align: center;
      }
      .tableComp {
        .el-table {
          td {
            padding: 5px 0;
          }
        }
      }
    }
  }
}
</style>
