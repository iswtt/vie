import $axios from '@/components/axios.js'
export default {
  getList (data) { // 获取复核任务列表
    const service = {
      method: 'POST',
      url: '/inspection/tampered/list'
    }
    return $axios(service, data)
  },
  addRecord (data) { // 新增篡改记录
    const service = {
      method: 'POST',
      url: '/inspection/tampered/add'
    }
    return $axios(service, data)
  }
}
