import $axios from '@/components/axios.js'
let pre = '/management'
export default {
  getFullSignPath (data) { // 获取签名后的路径
    const service = {
      method: 'post',
      url: pre + '/httpservice/getfullsignpath'
    }
    return $axios(service, data)
  }
}
