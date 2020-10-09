<template>
  <div id="viewer">
    <div class="container">
      <!-- 顶部标题 -->
      <div class="title">
        <span v-for="(item, index) in imgInfo" :key="index" @click="changeTitle(index)" :class="viewer.titleIndex == index ? 'selected' : ''">{{item.title}}</span>
      </div>
      <!-- 图片面板水平方向 -->
      <div v-if="viewerStyle.layout == 'horizontal'" class="img-panel">
        <!-- 缩略图预览小图的位置 -->
        <div :style="viewerStyle.thumbnailPosition == 'left' ? 'left: 0' : 'right: 0'" class="horThumbP">
          <img v-for="(item, index) in imgInfo[viewer.titleIndex].url" :key="index" :src="item" alt="image" :style="viewerStyle.thumbnailStyle" class="horThumbS" :class="viewer.thumbnailSelected == index ? 'selectedBorder': ''" @click="checkImg({item, index})">
        </div>
        <!-- 大图位置 -->
        <div :style="viewerStyle.bigImgPosition == 'right' ? 'left: 96px' : 'right: 96px'" class="horBigImgP">
          <div class="viewer-tool-group" ref="imgContainer">
            <img :src="viewer.url || imgInfo[viewer.titleIndex].url[0]" alt="image" ref="scroll" class="big-img" @mousewheel="scrollImg">
            <span class="percentage-tips">{{viewer.zoom}}</span>
            <div class="tool">
              <ul>
                <li class="tool-zoom-in" @click="zoomIn"></li>
                <li class="tool-zoom-out" @click="zoomOut"></li>
                <li class="tool-reset" @click="resetImg"></li>
                <li class="tool-rotate-left" @click="rotateLeft"></li>
                <li class="tool-rotate-right" @click="rotateRight"></li>
                <li class="tool-max-width" @click="maxWidth"></li>
                <li class="tool-max-height" @click="maxHeight"></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 图片面板 竖直方向 -->
      <div class="img-panel" v-if="viewerStyle.layout == 'vertical'">
        <!-- 缩略图预览小图的位置 -->
        <div :style="viewerStyle.thumbnailPosition == 'top' ? 'top: 0' : 'bottom: -140px'" class="verThumbP">
          <img v-for="(item, index) in imgInfo[viewer.titleIndex].url" :key="index" :src="item" alt="image" :style="viewerStyle.thumbnailStyle" class="verThumbS" :class="viewer.thumbnailSelected == index ? 'selectedBorder': ''" @click="checkImg({item, index})">
        </div>
        <!-- 大图位置 -->
        <div :style="viewerStyle.bigImgPosition == 'bottom' ? 'top: 120px' : 'top: 0'" class="verBigImgP">
          <div class="viewer-tool-group" ref="imgContainer">
            <img :src="viewer.url || imgInfo[viewer.titleIndex].url[0]" alt="image" ref="scroll" class="big-img" @mousewheel="scrollImg">
            <span class="percentage-tips">{{viewer.zoom}}</span>
            <div class="tool">
              <ul>
                <li class="tool-zoom-in" @click="zoomIn"></li>
                <li class="tool-zoom-out" @click="zoomOut"></li>
                <li class="tool-reset" @click="resetImg"></li>
                <li class="tool-rotate-left" @click="rotateLeft"></li>
                <li class="tool-rotate-right" @click="rotateRight"></li>
                <li class="tool-max-width" @click="maxWidth"></li>
                <li class="tool-max-height" @click="maxHeight"></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'viewer',
  data () {
    return {
      viewer: {
        titleIndex: 0, // 被选中的title索引
        url: '', // 右侧大图显示的图片地址
        thumbnailSelected: 0, // 图片是否被选中
        zoom: '100%',
        rotateTimes: 0,
        isAllowScrollImg: true
      }
    }
  },
  mounted () {
    const {scroll} = this.$refs
    scroll.style.zoom = '100%'
  },
  methods: {
    changeTitle (index) { // 切换标题的方法
      this.$data.viewer.titleIndex = index // 取到title索引
      this.$data.viewer.url = '' // 将上一个title下的显示图片置空
      this.$data.viewer.thumbnailSelected = 0 // 将下一个页面的第一个缩略图加边框
      this.resetImg()
    },
    checkImg (parm) { // 点击图片
      let {item, index} = parm // 获取图片信息
      this.$data.viewer.url = item
      this.$data.viewer.thumbnailSelected = index // 高亮当前的缩略图
      this.resetImg()
    },
    scrollImg (e) { // 滚动滚轮
      if (this.$data.viewer.isAllowScrollImg || e.wheelDelta < 0) { // 只有允许缩放和缩小的时候可以滚动
        const {scroll} = this.$refs
        let zoom = parseInt(scroll.style.zoom) || 100
        zoom += event.wheelDelta / 12
        if (zoom % 2 !== 0) {
          zoom = zoom + (zoom % 2)
        }
        if (zoom > 0) {
          scroll.style.zoom = `${zoom}%`
          this.$data.viewer.zoom = scroll.style.zoom
          if (zoom >= 1000 && (e.wheelDelta > 0)) {
            this.$data.viewer.isAllowScrollImg = false
          } else {
            this.$data.viewer.isAllowScrollImg = true
          }
        }
        return false
      }
    },
    zoom (parm) { // 放大缩小方法
      const {scroll} = this.$refs
      let zoomStr = scroll.style.zoom
      let zoom = parm.calc === 'add' ? (parseInt(zoomStr) ? parseInt(zoomStr) + 10 : 110) : (parseInt(zoomStr) ? parseInt(zoomStr) - 10 : 90)
      scroll.style.zoom = `${zoom}%`
      this.$data.viewer.zoom = `${zoom}%`
    },
    zoomIn () { // 放大
      const {zoom} = this.$refs.scroll.style
      let Integer = parseInt(zoom.substr(0, zoom.length - 1))
      if (Integer > 999) {
        return false
      }
      this.zoom({calc: 'add'})
    },
    zoomOut () { // 缩小
      const {zoom} = this.$refs.scroll.style
      let Integer = parseInt(zoom.substr(0, zoom.length - 1))
      if (Integer < 10) {
        return false
      }
      this.zoom({calc: 'reduce'})
    },
    resetImg () { // 重置
      const {scroll} = this.$refs
      scroll.style.transform = `rotate(0deg)`
      scroll.style.zoom = '100%'
      this.$data.viewer.zoom = '100%'
    },
    rotate (parm) { // 旋转
      const {scroll} = this.$refs
      parm.direction === 'left' ? this.$data.viewer.rotateTimes += 1 : this.$data.viewer.rotateTimes -= 1
      let angle = 90 * this.$data.viewer.rotateTimes
      scroll.style.transform = `rotate(${angle}deg)`
    },
    rotateLeft () {
      this.rotate({direction: 'left'})
    },
    rotateRight () {
      this.rotate({direction: 'right'})
    },
    maxWidth () { // 宽度自适应
      this.resetImg()
      const {scroll, imgContainer} = this.$refs
      this.$data.viewer.zoom = `${parseInt((imgContainer.offsetWidth / scroll.width) * 100)}%`
      scroll.style.zoom = `${parseInt((imgContainer.offsetWidth / scroll.width) * 100)}%`
    },
    maxHeight () { // 高度自适应
      this.resetImg()
      const {scroll, imgContainer} = this.$refs
      this.$data.viewer.zoom = `${parseInt((imgContainer.offsetHeight / scroll.height) * 100)}%`
      scroll.style.zoom = `${parseInt((imgContainer.offsetHeight / scroll.height) * 100)}%`
    }
  },
  computed: {},
  watch: {
    // 'viewer.titleIndex' (old, newData) {
    //   console.log(old, newData)
    //   this.$data.viewer.thumbnailSelected = 0
    // }
  },
  props: [ 'imgInfo', 'viewerStyle' ],
  components: {}
}
</script>

<style lang="scss">
@import '../styles/index.scss';
#viewer {
  width: $all * .4;
  height: 900px;
  padding: $dis10 * 2;
  @include flex();
  .container {
    width: $all;
    height: $all;
    .title {
      @include flex(row,flex-start,center);
      padding: 14px 4px;
      span {
        font-size: 20px;
        color: #999;
        display: inline-block;
        margin-right: 40px;
        &:hover {
          cursor: pointer;
        }
      }
      .selected {
        color: #2ba6e1;
      }
    }
    .img-panel {
      height: $all * .9;
      position: relative;
      .horThumbS.selectedBorder,.verThumbS.selectedBorder {
        border-color: #2ba6e1;
      }
      .horThumbP {
        width: 76px;
        height: $all;
        overflow-y: auto;
        position: absolute;
      }
      .horThumbS {
        width: $all;
        height: $dis10 * 10;
        margin-bottom: $dis10;
        border-radius: 4px;
        object-fit: cover;
        border: 2px solid #999;
        cursor: pointer;
        @include box-sizing()
      }
      .horBigImgP {
        height: $all;
        width: calc(100% - 96px);
        position: absolute;
        .big-img {
          &:hover{
            cursor: pointer;
          }
        }
      }
      .viewer-tool-group {
        position: relative;
        @include flex();
        width: $all;
        height: $all;
        overflow: hidden;
        .percentage-tips {
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff;
          border-radius: 30px;
          font-size: 10px;
          position: absolute;
          top: 50%;
          padding: 2px 8px;
        }
        .tool {
          position: absolute;
          bottom: 20px;
          ul {
            @include flex();
            .tool-zoom-in {
              background-position: 2px;
            }
            .tool-zoom-out {
              background-position: -18px;
            }
            .tool-reset {
              background-position: -38px;
            }
            .tool-rotate-left {
              background-position: -138px;
            }
            .tool-rotate-right {
              background-position: -158px;
            }
            .tool-max-width {
              background-position: -178px;
            }
            .tool-max-height {
              background-position: -198px;
            }
          }
          li {
            background: $swiper no-repeat;
            background-color: rgba(0, 0, 0, .5);
            border-radius: 50%;
            margin-right: 10px;
            cursor: pointer;
            width: 24px;
            height: 24px;
          }
        }
      }
      .verThumbP {
        display: flex;
        width: 76px;
        height: 100px;
        margin-bottom: 20px;
        position: absolute;
      }
      .verThumbS {
        width: $all;
        height: $all;
        margin-right: $dis10;
        border-radius: 4px;
        object-fit: cover;
        border: 2px solid #999;
        cursor: pointer;
        @include box-sizing()
      }
      .verBigImgP {
        position: absolute;
        width: $all;
        height: $all;
        .big-img {
          &:hover{
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
