import $axios from '@/components/axios.js'
export default {
  knowComSection (data) {
    const service = {
      method: 'POST',
      url: '/knowComSection/getTableData'
    }
    return $axios(service, data)
  }
}
