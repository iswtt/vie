import $axios from '@/components/axios.js'
let pre = '/supervise'
export default {
  getList (data) { // 获取列表
    const service = {
      method: 'post',
      url: pre + '/repSendMgr/list'
    }
    return $axios(service, data)
  },
  getEdit (data) { // 保存、修改
    const service = {
      method: 'post',
      url: pre + '/repSendMgr/edit'
    }
    return $axios(service, data)
  },
  getEnable (data) { // 启用、禁用
    const service = {
      method: 'post',
      url: pre + '/repSendMgr/release'
    }
    return $axios(service, data)
  },
  getDelete (data) { // 删除
    const service = {
      method: 'post',
      url: pre + '/repSendMgr/del'
    }
    return $axios(service, data)
  },
  getUser (data) { // 获取所有用户
    const service = {
      method: 'post',
      url: '/upmsapi/ut/getUserPage'
    }
    return $axios(service, data)
  }
}
