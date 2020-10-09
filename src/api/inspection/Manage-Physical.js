import $axios from '@/components/axios.js'
export default {
  getList (data) { // 查询列表
    const service = {
      method: 'POST',
      url: '/inspection/manualtaskmgmt/manualchecklist'
    }
    return $axios(service, data)
  },
  getDetail (data) { // 详情
    const service = {
      method: 'POST',
      url: '/inspection/manualtaskmgmt/detailtask'
    }
    return $axios(service, data)
  },
  unlocktasks (data) { // 解锁
    const service = {
      method: 'POST',
      url: '/inspection/manualtaskmgmt/unlocktasks'
    }
    return $axios(service, data)
  },
  assignTask (data) { // 分配任务
    const service = {
      method: 'POST',
      url: '/inspection/manualtaskmgmt/assignTask'
    }
    return $axios(service, data)
  }
}
