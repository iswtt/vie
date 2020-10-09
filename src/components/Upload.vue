<template>
  <div class="uploadComp">
    <div class="upload">
      <el-upload
        drag
        ref='upload'
        :data='option.data'
        :action='option.action'
        :limit='option.limit'
        :accept='option.accept'
        :on-success='onSuccess'
        :on-error='onError'
        :on-exceed='onExceed'
        :before-upload='beforeUpload'
        :auto-upload='false'
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('upload.uploadTex')}}<em>{{$t('upload.clickToUpload')}}</em></div>
        <div slot="tip" class="el-upload__tip">{{option.tip}}</div>
      </el-upload>
    </div>
    <div class="upload-button el-form-item">
      <el-button @click='uploadSure' type='primary'>{{$t('vicenter.common.sure')}}</el-button>
      <el-button @click='uploadCancel'>{{$t('vicenter.common.cancel')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'uploadComp',
  data () {
    return {
      flag: true
    }
  },
  methods: {
    onExceed (files, fileList) { // 文件超出允许上传个数
      console.log('onExceed', files, fileList)
      this.$message({
        type: 'error',
        message: this.$t('upload.limit', {msg: this.$props.option.limit})
      })
    },
    onError (err, file, fileList) { // 上传失败
      console.log('onError', err, file, fileList)
      this.$message({
        type: 'error',
        message: this.$t('upload.uploadFail')
      })
    },
    onSuccess (response, file, fileList) { // 上传成功
      console.log('onSuccess', response, file, fileList)
      this.$message({
        type: 'success',
        message: this.$t('upload.uploadSuccess')
      })
    },
    beforeUpload (file) { // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      console.log('beforeUpload', file)
      let index = file.name.lastIndexOf('.')
      let type = file.name.substr(index + 1)
      if (type !== this.$props.option.accept) {
        this.$message({
          type: 'error',
          message: this.$t('upload.TypeInconformity')
        })
        this.$data.flag = false
        return false
      }
    },
    uploadSure () { // 确认上传事件
      this.$refs.upload.submit()
      if (this.$data.flag) {
        this.$props.option.flag = false
      }
    },
    uploadCancel () { // 取消上传事件
      this.$refs.upload.clearFiles()
      this.$props.option.flag = false
    }
  },
  props: ['option']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
  @import '../styles/index.scss';
  .uploadComp{
    width: $all;
    .upload {
      width: $all;
      .el-upload {
        display: block;
        .el-upload-dragger {
          width:$all;
        }
      }
    }
    .upload-button {
      width: $all;
      margin-top: $dis10*2;
      @include flex(row,center,center);
      @include box-sizing();
    }
  }
</style>
