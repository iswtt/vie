import $axios from '@/components/axios.js'
let pre = '/tip'
export default {
  AduitLog (data) { // 审计日志
    const service = {
      method: 'post',
      url: pre + '/log/auditlog/getPages'
    }
    return $axios(service, data)
  },
  auditDetail (data) { // 审计日志详情
    const service = {
      method: 'post',
      url: pre + '/log/auditlog/detail/getPages'
    }
    return $axios(service, data)
  },
  getOperateObject (data) { // 获取操作对象下拉框数据
    const service = {
      method: 'post',
      url: '/upmsapi/log/auditlog/key/getOperateObjectKeys'
    }
    return $axios(service, data)
  },
  getOperateType (data) { // 获取操作类别下拉框数据
    const service = {
      method: 'post',
      url: '/upmsapi/log/auditlog/key/getActionKeys'
    }
    return $axios(service, data)
  }
}
