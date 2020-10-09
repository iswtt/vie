import $axios from '@/components/axios.js'
export default {
  getList (data) { // 查询列表
    const service = {
      method: 'POST',
      url: '/inspection/manualcheck/list'
    }
    return $axios(service, data)
  },
  getDetail (data) { // 详情
    const service = {
      method: 'POST',
      url: '/inspection/manualcheck/detailtask'
    }
    return $axios(service, data)
  },
  submitTask (data) { // 提交
    const service = {
      method: 'POST',
      url: '/inspection/manualcheck/submitmanualcheck'
    }
    return $axios(service, data)
  },
  quitTask (data) { // 放弃
    const service = {
      method: 'POST',
      url: '/inspection/manualcheck/abandonmanualcheck'
    }
    return $axios(service, data)
  },
  getuserlockPhysicalcheck (data) { // 查找该用户在当前审图环节是否存在未完成任务
    const service = {
      method: 'POST',
      url: '/inspection/manualcheck/getuserlockmanualcheck'
    }
    return $axios(service, data)
  },
  delAttach (data) {
    const service = {
      method: 'post',
      url: '/inspection/manualcheck/delfiles'
    }
    return $axios(service, data)
  }
}
