import $axios from '@/components/axios.js'
export default {
  fileUpload (data) { // 删除
    const service = {
      method: 'POST',
      url: '/course/upload'
    }
    return $axios(service, data)
  }
}
