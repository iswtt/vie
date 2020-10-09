import $axios from '@/components/axios.js'
let pre = '/management'
export default {
  getList (data) {
    const service = {
      method: 'post',
      url: pre + '/systemappversion/queryPage'
    }
    return $axios(service, data)
  },
  getAppName (data) {
    const service = {
      method: 'get',
      url: pre + '/systemappversion/queryAppName'
    }
    return $axios(service, data)
  },
  deleteInfo (data) {
    const service = {
      method: 'post',
      url: pre + ''
    }
    return $axios(service, data)
  }
}
