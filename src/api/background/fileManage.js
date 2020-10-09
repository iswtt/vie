import $axios from '@/components/axios.js'
let pre = '/management'
export default {
  getList (data) { // 归档记录查询
    const service = {
      method: 'post',
      url: pre + '/archive/list'
    }
    return $axios(service, data)
  },
  getLogList (data) { // 归档操作日志查询
    const service = {
      method: 'post',
      url: pre + '/arcopera/list'
    }
    return $axios(service, data)
  },
  getPlan (data) { // 归档策略查询
    const service = {
      method: 'post',
      url: pre + '/arcmanage/getarcinfo'
    }
    return $axios(service, data)
  },
  updatePlan (data) { // 归档策略修改
    const service = {
      method: 'post',
      url: pre + '/arcmanage/editarc'
    }
    return $axios(service, data)
  },
  manualarc (data) { // 手动归档
    const service = {
      method: 'post',
      url: '/supervise/arcserve/manualarc'
    }
    return $axios(service, data)
  }
}
