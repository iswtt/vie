import $axios from '@/components/axios.js'
export default {
  querySettingParams (data) {
    const service = {
      method: 'post',
      url: '/management/systemconfig/list'
    }
    return $axios(service, data)
  },
  updateSettingParams (data) {
    const service = {
      method: 'POST',
      url: '/management/systemconfig/update'
    }
    return $axios(service, data)
  }
}
