import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 语言选择保存到本地
function saveSessionStorage (state) {
  // 此处的currentLang保存的是所有state状态值
  window.sessionStorage.setItem('currentLang', JSON.stringify(state))
}
// 共享数据
const state = {
  lang: window.config.conmmonLang, // 初始语言
  path: '', // 国际化切换路由
  // 启动IM
  IMUrl: sessionStorage.IMUrl ? sessionStorage.IMUrl : '',
  isloadIM: sessionStorage.isloadIM ? sessionStorage.isloadIM : '',
  // IM消息，是否登录
  imMessageNum: sessionStorage.imMessageNum ? sessionStorage.imMessageNum : '',
  imisLogOut: 'logOut',
  isIMhidden: 'hidden'
}
// 改变数据的方法
const mutations = {
  loadIM (state, parm) {
    state.IMUrl = parm.IMUrl
    state.isloadIM = parm.isloadIM
  },
  changeIMMessage (state, parm) {
    state.imMessageNum = parm.imMessageNum
  },
  changeIMStatus (state, parm) {
    state.imisLogOut = parm.imisLogOut
  },
  showIM (state, parm) {
    state.isIMhidden = parm.isIMhidden
  },
  changeLang (state, parm) {
    // 更新IM地址里面的语言参数
    let langParam = `lang=${state.lang}`
    if (state.IMUrl.indexOf(langParam) > -1) {
      state.IMUrl = state.IMUrl.replace(langParam, `lang=${parm.lang}`)
      sessionStorage.setItem('IMUrl', state.IMUrl)
    }
    state.lang = parm.lang
    state.path = parm.path
    saveSessionStorage(state)
  },
  changeSkin (state, parm) {
    state.path = parm.path
  }
}
// 实例
const store = new Vuex.Store({
  state,
  mutations
})
export default store
