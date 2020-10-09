import $axios from '@/components/axios.js'
let pre = '/management'
export default {
  getList (data) { // 国际化数据
    const service = {
      method: 'post',
      url: pre + '/log/auditlog/getPages'
    }
    return $axios(service, data)
  },
  getDetail (data) { // 国际化数据详情
    const service = {
      method: 'post',
      url: pre + '/log/auditlog/detail/getPages'
    }
    return $axios(service, data)
  }
}
