<template>
    <video-player  class="vjs-custom-skin"
                   :ref="playerOptions.refName"
                   :options="playerOptions"
                   :playsinline="true"
                   @play="playerFunc.play($event)"
                   @pause="playerFunc.pause($event)"
                   @ended="playerFunc.ended($event)"
                   @loadeddata="playerFunc.loadeddata($event)"
                   @waiting="playerFunc.waiting($event)"
                   @playing="playerFunc.waiting($event)"
                   @timeupdate="playerFunc.timeupdate($event)"
                   @canplay="playerFunc.canplay($event)"
                   @canplaythrough="playerFunc.canplaythrough($event)"
                   @ready="playerFunc.ready"
                   @statechanged="playerFunc.statechanged($event)">
    </video-player>
</template>

<script>
export default {
  created () {
    if (this.$props.src) {
      this.$props.playerOptions.sources[0].src = this.$props.src
    }
  },
  props: ['playerOptions', 'src', 'playerFunc']
}
</script>
