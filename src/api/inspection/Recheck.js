import $axios from '@/components/axios.js'
export default {
  getList (data) { // 获取复核任务列表
    const service = {
      method: 'POST',
      url: '/inspection/recheck/list'
    }
    return $axios(service, data)
  },
  getDetail (data) { // 获取复核任务详情
    const service = {
      method: 'POST',
      url: '/inspection/recheck/detailtask'
    }
    return $axios(service, data)
  },
  submitTask (data) { // 提交复核结论
    const service = {
      method: 'POST',
      url: '/inspection/recheck/addImgCheck'
    }
    return $axios(service, data)
  },
  quitTask (data) { // 放弃提交复核结论
    const service = {
      method: 'POST',
      url: '/inspection/recheck/abandonimgcheck'
    }
    return $axios(service, data)
  },
  getuserlockimagcheck (data) { // 自动加载未完成复核任务
    const service = {
      method: 'POST',
      url: '/inspection/recheck/getuserlockimagcheck'
    }
    return $axios(service, data)
  }
}
