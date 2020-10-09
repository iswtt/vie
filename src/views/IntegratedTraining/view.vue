<template>
  <div class="out">
    <div class="breadCrumb">
      <breadCrumb :breadcrumb="titleBread" />
    </div>
    <div id="view__" v-if="!!Object.keys(options).length">
      <avideo v-if="options.type==='video'" ref="video" :playerOptions="opc" :src="options.src" :playerFunc="play"></avideo>
      <vdoc v-else :listData="options.data" :propOption="op"></vdoc>
    </div>
  </div>
</template>

<script>
import vdoc from '@/components/swipe'
import avideo from '@/components/video'
import breadCrumb from '@/components/breadCrumb'
export default {
  data () {
    return {
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/IntegratedTraining/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      op: { id: 'filename' },
      // src: require('../../../static/temp/aaa.mp4'),
      opc: { refName: 'vedio', sources: [{ src: '' }] },
      play: {
        statechanged: () => { },
        ended: () => { },
        pause: () => { },
        timeupdate: () => { },
        waiting: () => { },
        play: () => { },
        loadeddata: () => { },
        canplay: () => { },
        canplaythrough: () => { }
      },
      options: {}
    }
  },
  created () {
    this.options = this.$route.query
    console.log(this.options)
  },
  methods: {

  },
  components: { vdoc, avideo, breadCrumb }
}
</script>
<style lang="scss" scoped>
.out {
  padding: 30px;
}
</style>

<style >
#view__ {
  width: 700px;
  height: 500px;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
#view__ .video-js {
  height: 500px !important;
}
</style>
