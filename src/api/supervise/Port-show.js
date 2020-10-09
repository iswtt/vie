import $axios from '@/components/axios.js'
let pre = '/supervise'
export default {
  getStatisticalData (data) {
    const service = {
      method: 'post',
      url: pre + '/homestatis/statissitecheck'
    }
    return $axios(service, data)
  }
}
