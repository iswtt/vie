import $axios from '@/components/axios.js'
let pre = '/training'
export default {
  getList (data) { // 获取列表
    const service = {
      method: 'post',
      url: pre + '/getList'
    }
    return $axios(service, data)
  },
  getDetail (data) { // 获取详情
    const service = {
      method: 'post',
      url: pre + '/getDetail'
    }
    return $axios(service, data)
  }
}
