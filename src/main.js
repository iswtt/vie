// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import vueBar from 'vuebar'
import router from './router'
import VueI18n from 'vue-i18n'
import store from './vuex/store'
import ElementUI from 'element-ui'
import Chinese from './locale/Chinese'
import Russian from './locale/Russian'
import English from './locale/English'
import VueLazyload from 'vue-lazyload'
import VCharts from 'v-charts'
import echarts from 'echarts'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import './assets/iconfont/iconfont.css'
import './directives/prototype.js'
import './filter/filter.js'
import $treeCode from './lib/common/code.js'
import $axios from '@/components/axios.js'
import htmlToPdf from './lib/exportPdf/htmlToPdf.js'
import SpecialCharacter from './lib/common/SpecialCharacter.js'
import '../static/openlayers/ol.css'
import UUID from 'vue-uuid'
import printTable from '@/components/printTable.vue' // 打印模板组件
import PrintJs from 'print-js'

// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
// import Mock from './mock'
// Mock.start()
// 加载主题
var link = document.getElementById('skinCss')
if (sessionStorage.getItem('skin') === 'blue') {
  link.href = './static/elementBLUE/index.css'
  document.getElementById('initBody').setAttribute('data-theme', 'blue')
} else if (sessionStorage.getItem('skin') === 'red') {
  link.href = './static/elementRED/index.css'
  document.getElementById('initBody').setAttribute('data-theme', 'red')
} else if (!sessionStorage.getItem('skin')) {
  if (window.config.skinTheme === 'blue') {
    link.href = './static/elementBLUE/index.css'
    document.getElementById('initBody').setAttribute('data-theme', 'blue')
  } else if (window.config.skinTheme === 'red') {
    link.href = './static/elementRED/index.css'
    document.getElementById('initBody').setAttribute('data-theme', 'red')
  }
}

var currentLang = sessionStorage.getItem('currentLang') ? JSON.parse(sessionStorage.getItem('currentLang')).lang : window.config.conmmonLang

Vue.use(vueBar)
Vue.use(VueI18n)
Vue.use(ElementUI, currentLang)
Vue.use(VueLazyload)
Vue.use(VCharts)
Vue.use(echarts)
Vue.use(VideoPlayer)
Vue.use(htmlToPdf)
Vue.use(UUID)

Vue.component('printTable', printTable)

Vue.config.productionTip = false
Vue.prototype.$treeCode = $treeCode
Vue.prototype.$echarts = echarts
Vue.prototype.$SpecialCharacter = SpecialCharacter
Vue.prototype.$PrintJs = PrintJs

var i18n = new VueI18n({
  locale: currentLang,
  messages: {
    'zh-CN': Chinese,
    'en-US': English
  }
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    // 解决用户已登录，重开tab页访问时不能进入系统的问题
    $axios({
      method: 'get',
      url: 'upmsapi/user/isLogon'
    }, {}).then((res) => {
      if (res.data.flag) {
        next({ path: '/menus' })
        sessionStorage.setItem('account', res.data.result.account)
        sessionStorage.setItem('userName', res.data.result.userName)
        sessionStorage.setItem('userId', res.data.result.userId)
      } else {
        next()
        // sessionStorage.clear()
        vm.$clearSession()
      }
    }).catch(() => {})
  } else {
    if ((to.path === '/language' || to.path === '/skin') && from.path === '/') {
      next({ path: '/login' })
    }
    let account = sessionStorage.getItem('account')
    let userName = sessionStorage.getItem('userName')
    if (!account && !userName && to.path !== '/login' && to.path !== '/language' && to.path !== '/skin' && from.path !== '/') {
      next({ path: '/login' })
    } else {
      if (to.path !== '/language' && to.path !== '/skin') {
        $axios({
          method: 'get',
          url: 'upmsapi/user/isLogon'
        }, {}).then((res) => {
          if (res.data.flag) {
            next()
            sessionStorage.setItem('account', res.data.result.account)
            sessionStorage.setItem('userName', res.data.result.userName)
            sessionStorage.setItem('userId', res.data.result.userId)
          } else {
            // sessionStorage.clear()
            vm.$clearSession()
            vm.$NotifError(vm.$t('vicenter.error.' + res.data.errorCode))
            next({ path: '/login' })
          }
        }).catch((res) => {
          next()
        })
      } else {
        next()
      }
    }
  }
})

/* eslint-disable no-new */

function loadLocaleMessage (locale, cb) {
  return $axios({
    method: 'post',
    url: '/upmsapi/i18n/vueJsonByLang'
  }, {
    path: 'vicenter',
    lang: locale
  }).then((res) => {
    if (res.data.flag) {
      cb(res.data.result)
    }
  }).catch(() => {})
}
loadLocaleMessage('zh-CN', (message) => {
  i18n.setLocaleMessage('zh-CN', message)
  loadLocaleMessage('en-US', (message) => {
    i18n.setLocaleMessage('en-US', message)
    window.config.langInit = true
  })
})
var vm = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})

export default vm
