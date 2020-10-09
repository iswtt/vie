<template>
  <div class="doubleSwipe">
    <div class="doubleSwipe-left">
      <!-- <img :src="listData[leftImg].src" @click="Look"> -->
      <Cswiper ref='left' :propOption='optionsLeft' :listData='listData'></Cswiper>
    </div>
    <div class="doubleSwipe-right">
      <Cswiper @changeImg="changeImg" ref="right" :propOption='optionRightReal' :listData='listData'></Cswiper>
    </div>
  </div>
</template>
<script>
import Cswiper from './swipe'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  data () {
    return {
      leftImg: 0,
      imgId: '',
      optionDefault: {
        index: 0,
        height: '10rem',
        delay: 1000,
        spaceBetween: 10,
        slidesPerView: 4,
        direction: 'vertical',
        showImg: false // 点击轮播不放大图片
      },
      optionRightReal: {
      }
    }
  },
  created () {
    // this.imgId = this.optionsRight.propId + 'Img'
    this.optionRightReal = Object.assign(this.optionDefault, this.optionsRight)
    this.optionsLeft = JSON.parse(JSON.stringify(this.optionRightReal))
    this.optionsLeft.propId = this.optionsLeft.propId + 'left'
    this.optionsLeft.slidesPerView = 1
    this.optionsLeft.showImg = true
  },
  methods: {
    changeImg () {
      this.leftImg = this.$refs.right.propOption.index
      this.$refs.left.slideTo(this.leftImg)
    }
    // Look () {
    //   this.$refs.right.LookImg(this.leftImg)
    // }
  },
  components: {
    Cswiper, Viewer
  },
  props: {
    'listData': {
      type: Array,
      default: []
    },
    'optionsRight': {
      type: Object,
      default: {}
    }
  }
}
</script>
<style lang="scss">
.doubleSwipe {
  width: 100%;
  height: 100%;
  .doubleSwipe-left {
    width: 80%;
    height: 100%;
    margin-right: 10px;
    float: left;
     img{
      margin: 0 auto;
      cursor: pointer;
      height: unset;
      max-height: 10rem
    }
    .fileIcon{
      font-size: 80px!important;
    }
  }
  .doubleSwipe-right {
    width: calc(20% - 10px);
    float: left;
    img{
      height: 100%;
      width: 80%;
      padding-left: 5px;
    }
    .fileName{
      display: none;
    }
    .fileIcon{
      font-size: 29px!important;
    }
 }
}
</style>
