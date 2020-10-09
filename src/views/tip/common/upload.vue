<template>
  <div class="upload-box">
    <el-upload
      :data='option.data'
      :id='option.propId'
      :ref='option.propId'
      :action='action'
      name='attachFile'
      :on-preview='handlePreview'
      :multiple='option.multiple'
      :show-file-list="option.showFileList"
      :auto-upload='option.autoUpload'
      :with-credentials='option.withCredentials'
      :headers='option.headers'
      :accept='option.accept'
      :limit='option.limit'
      :list-type="option.listType"
      :on-remove='handleRemove'
      :before-remove='beforeRemove'
      :before-upload='option.beforeUpload'
      :on-exceed='handleExceed'
      :on-change='handleChange'
      :on-success='option.handleSuccess'
      :on-error='handleError'
      :file-list='fileList'>
      <el-button type="primary" size="mini">{{$t('vicenter.ImageLibrary.common.Upload')}}</el-button>
      <div slot='tip' class='el-upload__tip'>{{option.warningText}}</div>
    </el-upload>
     <el-dialog :visible.sync="dialogVisible" width="50%">
      <img width="100%" :src='dialogUrl' v-if='isImg'/>
      <iframe  v-if='!isImg' :class="'upload-iframe upload-iframe-' + option.propId" :src="dialogUrl"></iframe>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    'propOption': {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      option: {},
      optionDefault: {
        stop: false,
        propId: '',
        action: '',
        accept: '',
        fileList: [],
        previewList: [],
        limit: 1000,
        maxSize: 20,
        multiple: false,
        buttonText: '',
        submitText: '',
        showFileList: true,
        name: 'file',
        listType: 'text',
        withCredentials: true,
        autoUpload: true,
        headers: {
          'X-CSRF-TOKEN': localStorage.getItem('Xcsrftoken'),
          'X-APP-UACCOUNT': sessionStorage.getItem('account')
        },
        data: {},
        handleSuccess: function () {
          this.$NotifSuccess('OK')
        },
        beforeUpload: function () {
        },
        handleChange: function () {
        }
      },
      isImg: true,
      dialogVisible: false,
      imageUrl: '',
      dialogUrl: '',
      fileList: this.propOption.fileList,
      onChangeItemInfo: {},
      dragTip: this.$t('vicenter.common.uploadPreview.dragTip'),
      typeErrorTip: this.$t('vicenter.common.uploadPreview.typeErrorTip'),
      sizeErrorTip: this.$t('vicenter.common.uploadPreview.sizeErrorTip'),
      confirmTip: this.$t('vicenter.common.uploadPreview.confirmTip')
    }
  },
  computed: {
    action: function () {
      if (window.config.baseUrl.substr(-1, 1) === '/') {
        return `${window.config.baseUrl}${this.$props.propOption.action}`
      } else {
        return `${window.config.baseUrl}/${this.$props.propOption.action}`
      }
      // return 'http://10.30.4.57:8080/supervise/tasksearch/addfiles'
    }
  },
  created () {
    this.option = Object.assign(this.optionDefault, this.propOption)
  },
  mounted () {
    // const _this = this
    // this.$refs['upload-iframe-' + this.option.propId].addEventListener('open', function () {
    //   _this.previewInDialog()
    // })
  },
  methods: {
    handleSubmit () {
      console.log('handleSubmit')
      this.$refs[this.option.propId].submit()
    },
    handleChange (file, fileList) {
      this.option.handleChange(file, fileList)
      // if (file.status === 'success') {
      //   if (this.option.imgSize && !this.option.showFileList) {
      //     this.imageUrl = URL.createObjectURL(file.raw)
      //   }
      // }
      // fileList.forEach((item, index) => {
      //   if (item.status === 'success' && !this.imageUrl && !this.dialogUrl) {
      //     if (document.getElementById(this.propOption.propId).getElementsByClassName('el-upload-list__item-name')[index].innerText === item.name) {
      //       document.getElementById(this.propOption.propId).getElementsByClassName('el-upload-list__item-name')[index].innerHTML += `&nbsp;&nbsp;&nbsp;&nbsp;${(item.size / 1024).toFixed(2)}KB`
      //     }
      //   }
      // })
    },
    handlePreview (file) {
      const fileType = file.name.split('.')[file.name.split('.').length - 1].toLowerCase()
      const imgType = ['jpg', 'png', 'jpeg', 'gif', 'img']
      this.isImg = imgType.indexOf(fileType) !== -1
      this.dialogUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload (file) {
      this.option.beforeUpload(file)
      if (this.option.stop) {
        this.option.stop = false
        return false
      }
      if (this.propOption.maxSize && file.size / 1024 / 1024 > this.propOption.maxSize) {
        this.$NotifError(`${this.sizeErrorTip}${this.propOption.maxSize}MB`)
        return false
      }
      if (file.type !== this.option.accept && this.propOption.accept && this.option.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1].toLowerCase()) === -1) {
        this.$NotifError(`${this.typeErrorTip}`)
        return false
      }
    },
    handleExceed (file, fileList) {
      const isNotOver = file.length + fileList.length < this.option.limit
      if (!isNotOver || fileList.length === 0) {
        this.$NotifError(this.$t('vicenter.common.uploadPreview.overLimitTip', {msg: this.option.limit}))
        this.option.warningText = this.$t('vicenter.common.uploadPreview.overLimitTip', {msg: this.option.limit})
      }
      return isNotOver
    },
    handleSuccess () {
      this.option.handleSuccess()
      console.log('handleSubmit')
      alert('handleSuccess')
    },
    handleError () {
      this.$NotifError(this.$t('vicenter.Background.device.uploadFailure'))
    },
    handleRemove (file, fileList) {
      // console.log(file)
      // console.log(fileList)
    },
    beforeRemove (file, fileList) {
      if (file.status === 'success') {
        return this.$confirm(`${this.confirmTip}${file.name}？`)
      }
    }
  },
  component: {}
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style>
.el-upload-list {
  display: none;
}
</style>
