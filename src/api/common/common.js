import $axios from '@/components/axios.js'
const base = '/upmsapi'
export default {
  getKaptcha (data) {
    const service = {
      method: 'get',
      url: base + '/kaptcha/captcha'
    }
    return $axios(service, data)
  },
  login (data) {
    const service = {
      method: 'post',
      url: base + '/user/login'
    }
    return $axios(service, data)
  },
  changePassword (data) {
    const service = {
      method: 'post',
      url: base + '/user/changePassword'
    }
    return $axios(service, data)
  },
  initPwdRule (data) {
    const service = {
      method: 'get',
      url: base + '/user/initPwdRule'
    }
    return $axios(service, data)
  },
  logout (data) {
    const service = {
      method: 'post',
      url: base + '/user/logout'
    }
    return $axios(service, data)
  },
  getPrmList (data) {
    const service = {
      method: 'post',
      url: base + '/prm/getPrmCodeList'
    }
    return $axios(service, data)
  },
  orgNodesTree (data) { // 获取机构树
    const service = {
      method: 'post',
      url: base + '/org/getOrgNodes'
    }
    return $axios(service, data)
  },
  deviceNodesTree (data) { // 获取机构设备树
    const service = {
      method: 'post',
      url: '/management/scdevice/getdevicetree'
    }
    return $axios(service, data)
  },
  getUsers (data) { // 根据角色编码及应用编码获取用户信息
    const service = {
      method: 'post',
      url: '/upmsapi/ru/getUsersByRoleCodeAndAppCode'
    }
    return $axios(service, data)
  },
  listPortAndPersionByRoleCode (data) {
    const service = {
      method: 'post',
      url: '/management/scdevice/listPortAndPersionByRoleCode'
    }
    return $axios(service, data)
  },
  // 前端导出日志记录
  exportlog (data) {
    const service = {
      method: 'post',
      url: '/management/httpservice/export'
    }
    return $axios(service, data)
  },
  // 是否登录
  isLogon (data) {
    const service = {
      method: 'get',
      url: 'upmsapi/user/isLogon'
    }
    return $axios(service, data)
  },
  getSearchCondition (data) { // 返回该用户可用的全部查询条件/显示列 与 用户自定义的全部查询条件/显示列
    const service = {
      method: 'post',
      url: '/supervise/tasksearch/getsearchcondation'
    }
    return $axios(service, data)
  },
  updateSearchCondition (data) { // 更新自定义查询条件
    const service = {
      method: 'post',
      url: '/supervise/tasksearch/upseaordisplay'
    }
    return $axios(service, data)
  },
  exportExcel (data) { // 导出接口
    let url = window.config.baseUrl + data.url + '?' + data.str
    window.open(url)
  },
  getUserDetail (data) { // 获取用户角色
    const service = {
      method: 'post',
      url: '/upmsapi/user/detail'
    }
    return $axios(service, data)
  },
  // 根据hscode id获取hscode信息
  getInfosByHsIds (data) {
    const service = {
      method: 'post',
      url: '/management/hscodes/getInfosByHsIds'
    }
    return $axios(service, data)
  },
  // 根据hscode code获取hscode信息
  getInfosByHsCodes (data) {
    const service = {
      method: 'post',
      url: '/management/hscodes/getInfosByHsCodes'
    }
    return $axios(service, data)
  },
  getSystemConfig (data) {
    const service = {
      method: 'get',
      url: '/management/systemconfig/list'
    }
    return $axios(service, data)
  }
}
