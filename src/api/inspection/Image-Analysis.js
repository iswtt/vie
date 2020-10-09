import $axios from '@/components/axios.js'
export default {
  getList (data) { // 查询列表
    const service = {
      method: 'POST',
      url: '/inspection/imagecheck/list'
    }
    return $axios(service, data)
  },
  getDetail (data) { // 详情
    const service = {
      method: 'POST',
      url: '/inspection/imagecheck/detailtask'
    }
    return $axios(service, data)
  },
  submitTask (data) { // 提交
    const service = {
      method: 'POST',
      url: '/inspection/imagecheck/addImgCheck'
    }
    return $axios(service, data)
  },
  quitTask (data) { // 放弃
    const service = {
      method: 'POST',
      url: '/inspection/imagecheck/abandonimgcheck'
    }
    return $axios(service, data)
  },
  getuserlockimagcheck (data) { // 查找该用户在当前审图环节是否存在未完成任务
    const service = {
      method: 'POST',
      url: '/inspection/imagecheck/getuserlockimagcheck'
    }
    return $axios(service, data)
  }
}
