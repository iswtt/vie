import $axios from '@/components/axios.js'
export default {
  login (data) {
    const service = {
      method: 'post',
      url: '/tip/user/login'
    }
    return $axios(service, data)
  },
  logout (data) {
    const service = {
      method: 'post',
      url: '/tip/user/logout'
    }
    return $axios(service, data)
  }
}
