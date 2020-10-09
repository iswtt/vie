<template>
  <div id="image-view">
    <div class="viprobe-img" v-if="imageData.imageSrc">
        <img :src="imageData.imageSrc">
        <el-button class="view-btn" @click="openViprobe" type="primary" size="mini" >Viprobe</el-button>
    </div>
    <div v-else class="default-img">
      <img :src="defaultImg"/>
    </div>
  </div>
</template>
<script>
import viProbe from '@/lib/viprobe/viProbeForDms.js'
import insCommonAjax from '@/api/inspection/common.js'
export default {
  data () {
    return {
      imageName: '',
      openViprobeFlag: false, // 图像是否已打开
      hasImage: true,
      defaultImg: require('@/assets/img/common/ViCenter.png')
    }
  },
  methods: {
    openViprobe () {
      let imgSrc = this.$props.imageData.imageSrc
      let name = imgSrc.substring(imgSrc.lastIndexOf('/') + 1)
      if (name.indexOf('_icon') > -1) {
        name = name.substring(0, name.lastIndexOf('_'))
      } else {
        name = name.substring(0, name.lastIndexOf('.'))
      }
      this.imageName = name
      let path = imgSrc.substring(0, imgSrc.lastIndexOf('/'))
      let imageFiles = []
      imageFiles = this.$props.imageData.imageFiles
      let markFilePath = path + '/suspects_json.mark'
      let stepFilePath = path + '/history.steps'
      if (this.openViprobeFlag) {
        return
      }
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
        viProbe.openImageAndAnalysisInfoInViProbe(name, path, imageFiles, markFilePath, stepFilePath)
        this.openViprobeFlag = true
      })
    },
    closeViprobe () {
      viProbe.closeImageInViProbe(this.imageName)
    }
  },
  beforeDestroy () {
    if (this.openViprobeFlag) {
      this.closeViprobe()
    }
  },
  components: {},
  props: {
    'imageData': {
      type: Object,
      default: {
        imageSrc: '',
        imageFiles: []
      }
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
#image-view {
  height: calc(100% - 35px);
  .viprobe-img {
    height: $all;
    position: relative;
    overflow: hidden;
    img {
      margin: 0 auto;
      height: $all;
    }
    .view-btn {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .default-img {
    width: $all;
    height: $all;
    img {
      margin: 0 auto;
      height: $all;
    }
  }
}
@media screen and (max-width: 1640px) {
  #image-view {
    .default-img,.viprobe-img {
      height: $all;
      @include flex(row, center, center);
    }
    img {
      height: auto!important;
      width: $all;
    }
  }
}
</style>
