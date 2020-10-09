import $axios from '@/components/axios.js'
export default {
  addExam (data) { // 添加考核
    const service = {
      method: 'post',
      url: '/tip/exam/add'
    }
    return $axios(service, data)
  },
  updateExam (data) { // 修改考核
    const service = {
      method: 'post',
      url: '/tip/exam/update'
    }
    return $axios(service, data)
  },
  deleteExam (data) { // 删除考核
    const service = {
      method: 'post',
      url: '/tip/exam/delete'
    }
    return $axios(service, data)
  },
  stopExam (data) { // 停止考核
    const service = {
      method: 'post',
      url: '/tip/exam/stop'
    }
    return $axios(service, data)
  },
  queryExam (data) { // 考核详情
    const service = {
      method: 'get',
      url: '/tip/exam/detail'
    }
    return $axios(service, data)
  },
  queryexamineelist (data) { // 获取考核人员信息
    const service = {
      method: 'get',
      url: '/tip/exam/queryexamineelist'
    }
    return $axios(service, data)
  },
  stopexaminee (data) { // 停止审图员考核
    const service = {
      method: 'post',
      url: '/tip/exam/stopexaminee'
    }
    return $axios(service, data)
  },
  ListExam (data) { // 考核设置查询列表
    const service = {
      method: 'get',
      url: '/tip/exam/querylist'
    }
    return $axios(service, data)
  },
  queryResultList (data) { // 考核结果列表查询
    const service = {
      method: 'get',
      url: '/tip/exam/queryresultlist'
    }
    return $axios(service, data)
  },
  queryResultExam (data) { // 考核成绩查询
    const service = {
      method: 'get',
      url: '/tip/exam/queryresult'
    }
    return $axios(service, data)
  }
}
