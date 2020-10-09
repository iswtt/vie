import $axios from '@/components/axios.js'
let pre = '/imagelibrary'
export default {
  getDataForTable (data) { // Hscode表格统计
    const service = {
      method: 'POST',
      url: pre + '/statistics/getDataForTable'
    }
    return $axios(service, data)
  },
  getDataForChart (data) { // Hscode饼图统计
    const service = {
      method: 'POST',
      url: pre + '/statistics/getDataForChart'
    }
    return $axios(service, data)
  }
}
