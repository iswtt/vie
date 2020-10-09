import $axios from '@/components/axios.js'
export default {
  doOnline (data) { // 审图员登录后，在审图列表点击在岗按钮或离岗按钮的操作
    const service = {
      method: 'POST',
      url: '/inspection/analyst/doonline'
    }
    return $axios(service, data)
  },
  getList (data) { // 派图管理列表
    const service = {
      method: 'POST',
      url: '/inspection/analyst/list'
    }
    return $axios(service, data)
  },
  doStart (data) { // 开始派图/停止派图
    const service = {
      method: 'POST',
      url: '/inspection/analyst/dostart'
    }
    return $axios(service, data)
  },
  getTaskStatistic (data) { // 获取任务统计
    const service = {
      method: 'POST',
      url: '/inspection/analyst/gettasknum'
    }
    return $axios(service, data)
  },
  recoveryTask (data) { // 任务回收
    const service = {
      method: 'POST',
      url: '/inspection/analyst/recoverytask'
    }
    return $axios(service, data)
  },
  getAnalystInfo (data) { // 获取当前登录的审图员信息
    const service = {
      method: 'POST',
      url: '/inspection/analyst/getinfo'
    }
    return $axios(service, data)
  }
}
