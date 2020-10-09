<template>
  <div :class="this.option.navigate.position === 'outside'?'swiper-container-out swiper-container ':'swiper-container ' + propOption.propId" :style="swiperStyle">
    <div :id="propOption.propId" class="swiper-container-box">
      <div class="swiper-wrapper">
        <div v-for="(item, key, index) in listAllData" :key='index' class="swiper-slide">
          <div v-if="propOption.deleteFlag" class="delicon">
            <el-button @click='deleteAttach(item)' type="text">
              <span title="delete"><span class="iconfont editTable">&#xe658;</span></span>
            </el-button>
          </div>
          <img class="swiper-slide-container" v-if='item.type==="img" && !loading' :src="item.src" @click="showViewer(key)">
          <img class="swiper-slide-container swiper-lazy" v-if='item.type==="img" && loading' :data-src="item.src" @click="showViewer(key)">
          <div class="swiper-lazy-preloader" v-if='loading'></div>
          <!-- TXT文件 -->
          <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="txt"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe631;</div>
            <p class="fileName" @click="checkFile(item.src, 'txt')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- PDF文件 -->
          <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="pdf"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe632;</div>
            <p class="fileName" @click="checkFile(item.src, 'pdf')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- XML文件 -->
          <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="xml"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe6f0;</div>
            <p class="fileName" @click="checkFile(item.src, 'xml')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- DOC/DOCX文件 -->
           <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="doc" || item.type==="docx"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe629;</div>
            <p class="fileName" @click="checkFile(item.src, 'doc')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- XLS/XLSX文件 -->
           <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="xls" || item.type==="xlsx"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe6fe;</div>
            <p class="fileName" @click="checkFile(item.src, 'xls')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- 视频文件（通过点击视频封面打开视频播放弹出框，） -->
          <img v-if="item.type==='video' && item.poster" class="video-file" :src="item.poster">
          <div class="video-file-box">
            <div v-if="item.type==='video'" class="iconfont fileIcon video-file-icon" @click="playVideo(item.src, 'video')">&#xe697;</div>
            <video v-if="item.type==='video' && !item.poster" class="video-file" :data-id="item.src">
              <source :src="item.src">
            </video>
          </div>
          <!-- 原来的实现方式 -->
          <!-- <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="video"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe633;</div>
            <p class="fileName" @click="playVideo(item.src, 'video')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div> -->
          <!-- 视频文件（可下载） -->
          <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="videoDownLoad"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe633;</div>
            <p class="fileName" @click="checkFile(item.src, 'videoDownLoad')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- 音频文件 -->
          <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="audio"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe6f6;</div>
            <p class="fileName" @click="checkFile(item.src, 'audio')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- 压缩文件（可下载） -->
          <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="compressedFile"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe654;</div>
            <p class="fileName" @click="checkFile(item.src, 'compressedFile')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
          <!-- 其他文件（可下载） -->
          <div class="swiper-slide-container swiper-slide-file fileImg" v-if='item.type==="other"'>
            <div class="iconfont fileIcon" @click="changeIndex(key)">&#xe804;</div>
            <p class="fileName" @click="checkFile(item.src, 'other')" :title="item.src.split('/')[item.src.split('/').length - 1].split('?')[0]">{{item.src.split('/')[item.src.split('/').length - 1].split('?')[0]}}</p>
          </div>
        </div>
      </div>
      <el-dialog :before-close='stopVideo' :append-to-body='true' :visible.sync="modalData.flag" :close-on-click-modal='false' :close-on-press-escape='false'>
        <div class="video">
          <div class="first">
            <getVideo v-if="isShowVideoPlayer" ref="videoPlayer" :playerOptions="playerOptions" :src='videoSrc' :playerFunc="palyerFunc"></getVideo>
          </div>
        </div>
      </el-dialog>
      <iFrame v-if='fileType === "doc" || fileType === "docx" || fileType === "xls" || fileType === "xlsx" || fileType === "videoDownLoad" || fileType === "compressedFile"|| fileType === "other"' autoPlay='true' :src="fileSrc" style="display: none;"></iFrame>
      <div :class="propOption.propId + '-modal file-show-box'" v-if="isShowiframe" @click="hideFile">
        <div class="file-box">
          <iFrame v-if='fileType === "pdf" || fileType === "txt"' autoPlay='true' :src="fileSrc"  width="100%" height="100%" border=1></iFrame>
        </div>
      </div>
      <el-dialog :visible.sync="isAudio" width="30%" :append-to-body="true" style="text-align: center;" @close="handleAudioClose" :close-on-click-modal="false" :close-on-press-escape="false">
        <audio class="audio" width="100%" height="100%" :src="fileSrc" v-if='fileType === "audio"' controls="controls" controlsList="nodownload">
          your browser does not support the audio tag
        </audio>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import getVideo from '@/components/video.vue'
/* eslint-disable */ 
export default {
  data () {
    return {
      listAllData: [],
      isAudio: false,
      isShowiframe: false,
      modalData: {
        flag: false
      },
      isShowVideoPlayer: false,
      videoSrc: '',
      swiperObj: {},
      swiperStyle: {},
      swiperPagination: {},
      navigation: {},
      loading: this.propOption.lazy,
      isObserver: this.propOption.observer,
      fileSrc: '',
      fileType: '',
      option: {},
      optionDefault: {
        deleteFlag: false,
        showImg: true,
        hasFile: false,
        slidesPerView: 1,
        direction: 'horizontal',
        initialSlide: 0,
        speed: 300,
        effect: 'slide',
        coverflowEffect: {},
        preloadImages: true,
        loop: false,
        observer: false,
        autoplay: false,
        pagination: {},
        spaceBetween: 0,
        lazy: false,
        navigate: {
          position: 'inside',
          type: 'default'
        },
        uniqueNavElements: false,
        bulletsColor: '#007aff'
      },
      playerOptions: {
        refName: 'videoPlayer',
        muted: false, // 是否静音
        language: sessionStorage.lang, // 插件语言
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 设置倍速
        sources: [{
          type: 'video/mp4',
          src: ''
        }]
      },
      palyerFunc: {
        play: this.onPlayerPlay,
        pause: this.onPlayerPause,
        ended: this.onPlayerEnded,
        loadeddata: this.onPlayerLoadeddata,
        waiting: this.onPlayerWaiting,
        playing: this.onPlayerPlaying,
        timeupdate: this.onPlayerTimeupdate,
        canplay: this.onPlayerCanplay,
        canplaythrough: this.onPlayerCanplaythrough,
        statechanged: this.playerStateChanged,
        ready: this.playerReadied
      }
    }
  },
  created () {
    this.listAllData = [...this.$props.listData]
    this.option = Object.assign(this.optionDefault, this.propOption)
    if (this.$listeners.hasOwnProperty('last')) {
      this.isObserver = true
      this.loading = true
    }
    if (this.option.hasOwnProperty('navigate')) {
      if (this.option.navigate.position === 'outside') {
        this.option.uniqueNavElements = true
      }
      if (!this.option.navigate.hasOwnProperty('type')) {
        this.option.navigate['type'] = 'default'
      }
    }
    this.swiperStyle = {
      height: this.option.height,
      width: this.option.width
    }
    if (this.option.effect === 'coverflow') {
      this.option.coverflowEffect = {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }
    }
  },
  mounted () {
    const _this = this
    new Promise((resolve, reject) => {
      if (_this.$parent.$options._componentTag !== 'c-swiper-group') {
        _this.$parent._data[_this.option.propId + 'Index'] = _this.option.initialSlide
      }
      if (Object.entries(_this.option.pagination).length > 0) {
        _this.ctrlNode('el', 'pagination', 'swiper-pagination-' + _this.option.propId)
      }
      if (_this.propOption.hasOwnProperty('navigate')) {
        _this.ctrlNode('prevEl', 'navigation', 'swiper-button-prev')
        _this.ctrlNode('nextEl', 'navigation', 'swiper-button-next')
      }
      resolve()
    }).then(() => {
      _this.swiperObj[_this.option.propId] = new Swiper('#' + _this.option.propId, {
        slidesPerView: _this.option.slidesPerView,
        direction: _this.option.direction,
        initialSlide: _this.option.initialSlide,
        speed: _this.option.speed,
        effect: _this.option.effect,
        coverflowEffect: _this.option.coverflowEffect,
        preloadImages: _this.option.preloadImages,
        loop: _this.option.loop,
        observer: _this.isObserver,
        autoplay: _this.option.autoplay,
        pagination: _this.option.pagination,
        navigation: _this.navigation,
        lazy: _this.loading,
        uniqueNavElements: _this.option.navOut,
        spaceBetween: _this.option.spaceBetween,
        grabCursor: true,
        setWrapperSize: true,
        on: {
          init: () => {
            _this.$nextTick(() => {
              if (Object.entries(_this.option.pagination).length > 0 && _this.option.pagination.type === 'bullets') {
                _this.swiperObj[_this.option.propId].pagination.bullets.css('background', _this.option.bulletsColor)
              }
            })
          },
          slideChange: () => {
            _this.$nextTick(() => {
              _this.$parent._data[_this.option.propId + 'Index'] = _this.swiperObj[_this.option.propId].activeIndex
              if (_this.$parent.$options._componentTag === 'c-swiper-group') {
                _this.$parent.getWatcher(_this.swiperObj[_this.option.propId].activeIndex)
              }
            })
          },
          slideChangeTransitionEnd: () => {
            _this.$nextTick(() => {
              _this.$parent._data[_this.option.propId + 'Index'] = _this.swiperObj[_this.option.propId].activeIndex
              if (_this.swiperObj[_this.option.propId].isEnd) {
                _this.$emit('last')
              }
            })
          },
          resize: () => {
            _this.throttle(_this.swiperResize, window)
          }
        }
      })
    }).catch((error) => {
      console.log(error)
    })
    if(document.getElementsByClassName('file-show-box').length > 0){
      document.getElementsByClassName('file-show-box')[0].addEventListener('mousewheel', (e) => {
        e.stopPropagation()
        e.preventDefault()
      }, {passive: false})
    }
    let videoFiles = document.querySelectorAll('.video-file')
    if (videoFiles.length === 0) {
      return
    }
    videoFiles.forEach(e => {
      this.getPosterUrl(e, videoFiles.length)
    })
  },
  methods: {
    // 获取视频封面图像路径
    getPosterUrl (video, num) {
      let _this = this
      video.currentTime = 1 // 第一帧
      video.addEventListener('loadeddata', function(e) {
        // let posterUrl = ''
        // let canvas = document.createElement('canvas')
        // canvas.width = video.videoWidth
        // canvas.height = video.videoHeight
        // canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        // posterUrl = canvas.toDataURL('image/png')
        // video.setAttribute('poster', posterUrl)
        // _this.listAllData.forEach(item => {
        //   if (item.type === 'video' && item.src === video.dataset.id) {
        //     item.poster = posterUrl
        //   }
        // })
      })
    },
    swiperResize () {
      this.swiperObj[this.option.propId].update()
    },
    slideTo (index) {
      this.swiperObj[this.option.propId].slideTo(index,0,false)
    },
    ctrlNode (tag, flag, name) {
      let node = document.createElement('div')
      node.setAttribute('class', name + '-' + this.option.propId + ' ' + name + ' ' + name + '-' + this.option.navigate.type)
      if (this.option.navigate.position === 'outside') {
        document.getElementById(this.option.propId).parentNode.appendChild(node)
      } else {
        document.getElementById(this.option.propId).appendChild(node)
      }
      if (tag === 'el') {
        this.option[flag][tag] = '.' + name
      } else {
        this[flag][tag] = '.' + name + '-' + this.option.propId
      }
    },
    throttle (method, context) {
      clearTimeout(method.tid)
      method.tid = setTimeout(function () {
        method.call(context)
      }, 500)
    },
    handleAudioClose () {
      var audio = document.getElementsByClassName('audio')[0]
      audio.pause()
      audio.load()
    },
    checkFile (src, type) {
      this.fileSrc = src
      this.fileType = type
      // if(this.fileType === 'img'){
      //   document.getElementsByClassName(this.option.propId + '-modal')[0].style.display = 'block'
      // }
      if (this.fileType === 'audio') {
        this.isAudio = true
      }
      if (this.fileType === 'txt' || this.fileType === 'pdf') {
        this.isShowiframe = true
      }
      if (this.fileType === 'xml') {
        window.open(src, '_blank')
      }
      if (this.fileType === 'doc' || this.fileType === 'docx' || this.fileType === 'xls' || this.fileType === 'xlsx' || this.fileType === 'videoDownLoad' || this.fileType === 'compressedFile' || this.fileType === 'other') {
        console.log('download')
      }
    },
    hideFile () {
      this.isShowiframe = false
      // document.getElementsByClassName(this.option.propId + '-modal')[0].style.display = 'none'
    },
    deleteAttach (item) {
      this.$emit('deleteAttach', item);
    },
    changeIndex (key) {
      this.propOption.index = this.swiperObj[this.option.propId].clickedIndex
      this.$emit('changeImg');
    },
    showViewer (key) {
      if(this.option.showImg){
        this.LookImg(key)
      }else{
        this.changeIndex (key)
      }
    },
    LookImg (index) {
      var viewer = new Viewer(document.getElementById(this.$props.propOption.propId).getElementsByClassName('swiper-wrapper')[0])    
      this.$nextTick().then(() => {
        viewer.update()
      })
      viewer.view(0)
    },
    playVideo (src) {
      this.videoSrc = src
      this.modalData.flag = true
    },
    // listen event
    onPlayerPlay (player) {
      console.log(player)
      // let type = player.currentType()
      // let src = player.currentSrc()
      // player.pause()
      // player.play()
      /*  this.$notify({
        title: '开始播放' + type + src
      }) */
    },
    onPlayerPause (player) {
      player.pause()
      /* this.$notify({
        title: '暂停'
      }) */
    },
    onPlayerEnded (player) {
      /* this.$notify({
        title: '播放结束'
      }) */
    },
    onPlayerLoadeddata (player) {
      /* this.$notify({
        title: '加载数据'
      }) */
    },
    onPlayerWaiting (player) {
      /* this.$notify({
        title: '视频缓存'
      }) */
    },
    onPlayerPlaying (player) {
      // this.$notify('播放中', player)
    },
    onPlayerTimeupdate (player) {
      // this.$notify('播放进度更新', player.currentTime())
    },
    onPlayerCanplay (player) {
      /* this.$notify({
        title: '可以播放'
      }) */
    },
    onPlayerCanplaythrough (player) {
      /* this.$notify({
        title: '进度拖动'
      }) */
    },
    // or listen state event
    playerStateChanged (playerCurrentState) {
      // this.$notify('player current update state', playerCurrentState)
    },
    // player is ready
    playerReadied (player) {
      // seek to 10s
      // player.currentTime(10)
      /* this.$notify({
        title: '从多少秒开始'
      }) */
    },
    playerTOReadied (player) {
      // seek to 10s
      player.currentTime(30)
      /* this.$notify({
        title: '从多少秒开始'
      }) */
    },
    stopVideo () {
      this.onPlayerPause(this.$refs.videoPlayer.$refs.videoPlayer.player)
      this.modalData.flag = false
    }
  },
  props: {
    'listData': {
      type: Array,
      default: []
    },
    'propOption': {
      type: Object,
      default: {}
    }
  },
  watch: {
    'modalData.flag': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.isShowVideoPlayer = true
        } else {
          this.isShowVideoPlayer = false
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: { getVideo }
}
</script>

<style lang="scss">
@import "../styles/index.scss";
.swiper-slide-container {
  width: 100%;
  height: calc(100% - 42px);
  display: block;
}
.swiper-container-out {
  padding: 0 50px!important;
}
.swiper-wrapper {
  position: relative;
  z-index: 998;
}
.delicon {
  height: 42px;
  text-align: right;
}
.swiper-container {
  z-index: initial;
  position: relative;
}
.swiper-container-box {
  width: 100%;
  height: 100%;
  position: relative;
}
.swiper-container-out .swiper-container-box {
  overflow: hidden;
}
.swiper-container>div[class^="swiper-pagination"] {
  position: absolute;
  z-index: 100;
}
.swiper-slide-file {
  display: flex!important;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  box-sizing: border-box;
  /* padding: 10%; */
}
.fileImg{
  background-size: 25% 40%!important;
  background-position: top center!important;
}
.fileIcon {
  color: #1296db;
  font-size: 50px!important;
}
.audioImg{
  background: $swiperImgAudio no-repeat;
}
.swiper-slide-file img {
  display: block;
}
.swiper-slide-file p {
  word-break: break-all;
  text-decoration: underline;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  padding: 5px 20px 0 20px;
}
.file-show-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  /* display: none; */
  background: rgba(	119, 136, 153, 0.4);
  box-sizing: border-box;
  padding: calc(15% - 1px) calc(25% - 1px);
}
.file-box {
  width: 100%;
  height: 100%;
  background: #fff;
}
.swiper-button-prev, .swiper-container-rtl .swiper-button-next,
.swiper-button-next, .swiper-container-rtl .swiper-button-prev,
.swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled {
  z-index: 998;
}
.swiper-button-prev,
.navigation-out.swiper-button-prev {
  left: 0
}
.swiper-button-next,
.navigation-out.swiper-button-next {
  right: 0
}
.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
  position: absolute;
  z-index: 998;
}
.swiper-button-prev.swiper-button-prev-large {
  height: 100px;
  width: 50px;
  background: $swiperImgBtnLarge no-repeat;
  background-position: 0 50%;
}
.swiper-button-next.swiper-button-next-large {
  height: 100px;
  width: 50px;
  background: $swiperImgBtnLarge no-repeat;
  background-position: -75px 50%;
}
.swiper-button-prev.swiper-button-prev-circle {
  height: 32px;
  width: 32px;
  background: $swiperImgBtnCircle no-repeat;
  background-position: 0 50%;
}
.swiper-button-next.swiper-button-next-circle {
  height: 32px;
  width: 32px;
  background: $swiperImgBtnCircle no-repeat;
  background-position: -40px 50%;
}
.swiper-button-prev.swiper-button-prev-bold {
  height: 32px;
  width: 20px;
  background: $swiperImgBtnBold no-repeat;
  background-position: 0 50%;
}
.swiper-button-next.swiper-button-next-bold {
  height: 32px;
  width: 20px;
  background: $swiperImgBtnBold no-repeat;
  background-position: -30px 50%;
}
.swiper-button-prev.swiper-button-prev-shadow {
  height: 60px;
  width: 36px;
  background: $swiperImgBtnShadow no-repeat;
  background-position: 0 50%;
}
.swiper-button-next.swiper-button-next-shadow {
  height: 60px;
  width: 36px;
  background: $swiperImgBtnShadow no-repeat;
  background-position: -75px 50%;
}
.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction{
  display:flex;
  justify-content: center;
}
.swiper-container-box {
  .swiper-wrapper {
    .swiper-slide {
      .video-file-box {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .video-file {
        width: 100%;
        height: 100%;
      }
      .video-file-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 5;
        transform: translate(-50%, -50%);
        cursor: pointer;
        font-size: 30px!important;
      }
    }
  }
}
.doubleSwipe {
  .doubleSwipe-left {
    .swiper-slide {
      .video-file-icon {
        font-size: 45px!important;
      }
    }
  }
  .doubleSwipe-right {
    .swiper-slide {
      .video-file-icon {
        font-size: 15px!important;
      }
    }
  }
}
.video{
    width: auto;
    height: 600px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .video .first,.video .second{
    width:100%;
    height:100%;
    padding:20px;
    box-sizing: border-box;
  }
  .video .first .video-player,.video .first .video-player .video-js {
    height: 100%!important;
  }
  .viewer-title{
    display: none!important;
  }
</style>
