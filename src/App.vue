<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div class="imIframeDialog" :class="{'hidden': $store.state.isIMhidden === 'hidden'}">
      <div class="content" v-if="$store.state.isloadIM === 'load'">
        <div class="imframeHeader">
          <span><i class="el-icon-close" @click="closeIm"></i></span>
        </div>
        <iframe :src="$store.state.IMUrl" class="imIframe" id="imIframe"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isIMhidden: ''
    }
  },
  created () {
    // 解决刷新页面语言变成默认显示的问题
    sessionStorage.getItem('currentLang') && this.$store.replaceState(JSON.parse(sessionStorage.getItem('currentLang')))
  },
  mounted () {
    if (this.$store.state.isloadIM === 'load') {
      console.log('刷新执行加载IM')
      this.setIMIframe()
    }
  },
  methods: {
    setIMIframe () {
      let imIframe = document.getElementById('imIframe')
      let _this = this
      window.onmessage = function (message) {
        console.log(message)
        let data
        let setStatus = (data) => {
          if (data.command === 'onUnreadChanged') {
            _this.$store.commit({
              type: 'changeIMMessage',
              imMessageNum: data.args[0]
            })
            sessionStorage.setItem('imMessageNum', data.args[0])
          } else if (data.command === 'onOnlineStatusChanged') {
            if (data.args[0]) {
              console.log('在线')
              _this.$store.commit({
                type: 'changeIMStatus',
                imisLogOut: 'logIn'
              })
              sessionStorage.setItem('imisLogOut', 'logIn')
            } else {
              console.log('离线')
              _this.$store.commit({
                type: 'changeIMStatus',
                imisLogOut: 'logOut'
              })
              sessionStorage.setItem('imisLogOut', 'logOut')
            }
          }
        }
        if (typeof message.data === 'object' && message.data) {
          data = message.data
          setStatus(data)
        } else if (typeof message.data !== 'object' && message.data) {
          data = JSON.parse(message.data)
          setStatus(data)
        }
      }
    },
    closeIm () {
      let imIframe = document.getElementById('imIframe')
      let msg = JSON.stringify({command: 'hidden', args: []})
      imIframe.contentWindow.postMessage(msg, '*')
      this.$store.commit({
        type: 'showIM',
        isIMhidden: 'hidden'
      })
      sessionStorage.setItem('isIMhidden', 'hidden')
    }
  },
  computed: {
    // ceshi () {
    //   return this.$store.state.changeNumber
    // },
    // loadIM () {
    //   return this.$store.state.loadIM
    // }
  },
  watch: {
    '$store.state.isloadIM': {
      handler (newVal) {
        if (newVal === 'load') {
          console.log('启动IM')
          this.setIMIframe()
        }
      }
    },
    '$store.state.isIMhidden': {
      handler (newVal) {}
    }
  }
}
</script>

<style lang="scss">
@import './styles/common.scss';
@import './styles/index.scss';
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: $all;
}
:root{
  width: $all;
  height: $all;
}
body {
  margin: 0;
}
.imIframeDialog.hidden {
  top: -2000px;
}
.imIframeDialog {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.4);
  .content {
    width: 1300px;
    height: 700px;
    position: absolute;
    top: 100px;
    left: 50%;
    margin-left: -650px;
    padding: 20px;
    @include box-sizing;
    // background: #fff;
  }
  .imframeHeader {
    height: 30px;
    width: 100%;
    // @include flex(row, space-between, center);
    position: relative;
    i {
      position: absolute;
      top: 50px;
      right: 10px;
      cursor: pointer;
    }
  }
  .imIframe {
    width: 100%;
    height: calc(100% - 50px);
    border: none;
  }
}
</style>
