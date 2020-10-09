import $axios from '@/components/axios.js'
export default {
  getList (data) { // 设备状态查询
    const service = {
      method: 'post',
      url: '/supervise/devicestatus/listpage'
      // url: '/imagelibrary/httpservice/getimglist'
    }
    return $axios(service, data)
  }
}
