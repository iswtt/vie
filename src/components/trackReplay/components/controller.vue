<template>
  <div class="player-box" id="player-box">
    <div class="play-btn-box">
      <ul>
        <li>
          <a :title="$t('vitracking.kazTrackPlay.start')" id="start" @click="start">
            <span class="play-img play-img-start"></span>
          </a>
        </li>
        <li>
          <a :title="$t('vitracking.kazTrackPlay.pause')" id="pause" @click="pause">
            <span class="play-img play-img-pause"></span>
          </a>
        </li>
        <li>
          <a :title="$t('vitracking.kazTrackPlay.back')" id="back" @click="back">
            <span class="play-img play-img-back"></span>
          </a>
        </li>
        <li>
          <a :title="$t('vitracking.kazTrackPlay.stop')" id="stop" @click="stop">
            <span class="play-img play-img-stop"></span>
          </a>
        </li>
        <li>
          <a :title="$t('vitracking.kazTrackPlay.speedDown')" @click="speedDown">
            <span class="play-img play-img-speed-down"></span>
          </a>
        </li>
        <li>
          <a :title="$t('vitracking.kazTrackPlay.speedUp')" @click="speedUp">
            <span class="play-img play-img-speed-up"></span>
          </a>
        </li>
        <li>
          <span class="times">×{{times}}</span>
        </li>
      </ul>
    </div>
    <div class="clear-fix"></div>
    <div class="play-slider">
      <div id="play-slider-range" class="play-slider-range" :style="width"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 'width: 0%',
      times: 1
    }
  },
  methods: {
    start () {
      this.setActive('start')
      this.$emit('start')
    },
    pause () {
      this.setActive('pause')
      this.$emit('pause')
    },
    back () {
      this.setActive('back')
      this.$emit('back')
    },
    stop () {
      this.setActive('stop')
      this.$emit('stop')
    },
    speedDown () {
      this.$emit('speedDown')
    },
    speedUp () {
      this.$emit('speedUp')
    },
    changeProgress (data) {
      this.width = `width: ${data}`
    },
    changeTimes (data) {
      this.times = data
    },
    setActive (targetId) {
      document.getElementById('start').className = ''
      document.getElementById('pause').className = ''
      document.getElementById('back').className = ''
      document.getElementById('stop').className = ''
      document.getElementById(targetId).className = 'active'
    }
  }
}
</script>

<style lang="scss" scoped>
.player-box {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  height: 80px;
  border-radius: 5px;
  // background: rgba(218, 202, 121, 0.19);
  background: rgba(25, 23, 17, 0.39);
  // background: -moz-linear-gradient(top, #fbfbfa 0%, #e3e5e6 100%);
  // background: -webkit-linear-gradient(top, #fbfbfa 0%,#e3e5e6 100%);
  // background: linear-gradient(to bottom, #fbfbfa 0%,#e3e5e6 100%);
  border: #cdcdcd solid 1px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.52);
  .play-btn-box {
    padding: 13px 0 0 19px;
    ul li {
      a {
        float: left;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #dadcdb;
        background: -moz-linear-gradient(top, #dadcdb 0%, #f9f9f9 100%);
        background: -webkit-linear-gradient(top, #dadcdb 0%,#f9f9f9 100%);
        background: linear-gradient(to bottom, #dadcdb 0%,#f9f9f9 100%);
        box-shadow: inset 2px 2px 1px rgba(255, 255, 255, 0.52), 1px 1px 7px rgba(0, 0, 0, 0.37);
        border: rgba(145, 145, 145, 0.75) solid 1px;
        margin: 0 3px;
      }
      a:focus {
        background: #dadcdb;
        box-shadow: inset 2px 2px 1px rgba(192, 192, 192, 0.52), 1px 1px 7px rgba(0, 0, 0, 0.37);
      }
      a:hover {
        background: #f9f9f9;
        background: -moz-linear-gradient(top, #f9f9f9 0%, #dadcdb 100%);
        background: -webkit-linear-gradient(top, #f9f9f9 0%,#dadcdb 100%);
        background: linear-gradient(to bottom, #f9f9f9 0%,#dadcdb 100%);
      }
      .active {
        border: rgb(34, 151, 219) solid 3px;
        position: relative;
        top: -3px;
      }
      .times {
        color: #fff;
        height: 30px;
        line-height: 30px;
        padding-left: 3px;
      }
    }
    .play-img {
      background-image: url('../assets/player-btn.png');
      display: inline-block;
      width: 30px;
      height: 30px;
    }
    .play-img-start {
      background-position: -110px, 0;
    }
    .play-img-pause {
      background-position: -75px, 0;
    }
    .play-img-back {
      background-position: -36px, 0;
    }
    .play-img-stop {
      background-position: -147px, 0;
    }
    .play-img-speed-down {
      background-position: -186px, 0;
    }
    .play-img-speed-up {
      background-position: -222px, 0;
    }
  }
  .clear-fix::after {
    box-sizing: border-box;
  }
  .clear-fix::before {
    box-sizing: border-box;
    clear: both;
    display: table;
    content: ' ';
  }
  .play-slider {
    margin: 13px 20px;
    height: 6px;
    background: #dedede;
    border-radius: 3px;
    box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.48), 1px 1px 1px #fff;
    .play-slider-range {
      background: #48c6eb;
      background: -moz-linear-gradient(left, #48c6eb 0%, #1d91d9 100%);
      background: -webkit-linear-gradient(left, #48c6eb 0%,#1d91d9 100%);
      background: linear-gradient(to right, #48c6eb 0%,#1d91d9 100%);
      border-radius: 3px;
      height: 6px;
      box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.48);
    }
  }
}
</style>
