import $axios from '@/components/axios.js'
let pre = '/management'
export default {
  getHSCodeTree (data) { // 获取hscode树
    const service = {
      method: 'post',
      url: pre + '/hscodes/gethscodes'
    }
    return $axios(service, data)
  },
  getHSCodeDetail (data) { // 根据id/code获取节点信息
    const service = {
      method: 'post',
      url: pre + '/hscodes/getdetail'
    }
    return $axios(service, data)
  },
  addHSCode (data) { // 添加HsCode信息
    const service = {
      method: 'post',
      url: pre + '/hscodes/add'
    }
    return $axios(service, data)
  },
  updateHSCode (data) { // 修改HsCode信息
    const service = {
      method: 'post',
      url: pre + '/hscodes/update'
    }
    return $axios(service, data)
  },
  deleteHSCode (data) { // 删除HsCode信息
    const service = {
      method: 'post',
      url: pre + '/hscodes/del'
    }
    return $axios(service, data)
  },
  getNodeAndChildren (data) {
    const service = {
      method: 'post',
      url: pre + '/hscodes/getnodeandchildren'
    }
    return $axios(service, data)
  },
  getNodeByCode (data) {
    const service = {
      method: 'post',
      url: pre + '/hscodes/getnodesbycode'
    }
    return $axios(service, data)
  },
  getnodesbydesc (data) {
    const service = {
      method: 'post',
      url: pre + '/hscodes/getnodesbydesc'
    }
    return $axios(service, data)
  },
  getGrandChildren (data) {
    const service = {
      method: 'post',
      url: pre + '/hscodes/getgrandchildren'
    }
    return $axios(service, data)
  },
  gethscodeList (data) {
    const service = {
      method: 'post',
      url: pre + '/hscodes/list'
    }
    return $axios(service, data)
  }
}
