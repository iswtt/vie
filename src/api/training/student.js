import $axios from '@/components/axios.js'
let baseUrl = window.config.trainingUI.baseUrl
// let pre = '/training'
let pre = ''
export default {
  // 我的考试(分页)
  getMyExamApi (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/myExam/getMyExamApi'
    }
    return $axios(service, data)
  },
  // 我的考试详情
  details (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/myExam/details'
    }
    return $axios(service, data)
  },
  // 考试结果信息
  getMyExamResult (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/myExam/getMyExamResult'
    }
    return $axios(service, data)
  },
  // 开始考试
  generateTestData (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/generateTestData'
    }
    return $axios(service, data)
  },
  // 提交试题
  submitQuestions (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/submitQuestions'
    }
    return $axios(service, data)
  },
  // 结束本次学习或考试
  endPractice (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/endPractice'
    }
    return $axios(service, data)
  },
  // 生成学习(练习)的数据
  addPractice (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/addPractice'
    }
    return $axios(service, data)
  },
  // 图像学习/审图练习(分页)
  getPractice (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/getPractice'
    }
    return $axios(service, data)
  },
  // 获取学习(练习)的数量
  getPracticeNum (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/getPracticeNum'
    }
    return $axios(service, data)
  },
  // 用户查询证书
  getCertificateByUser (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/certificate/getCertificateByUser'
    }
    return $axios(service, data)
  },
  // 培训相关 开始 ===================================================================↓
  /**
   * 查询个人培训数据列表
   * @param data
   */
  getTraPageInfoByStu (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraPageInfoByStu'
    }
    return $axios(service, data)
  },
  /**
   * 查询个人可选公开课列表
   * @param data
   */
  getTraGkCourPageInfoByStu (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraGkCourPageInfoByStu'
    }
    return $axios(service, data)
  },
  /**
   * 个人添加公开课
   * @param data
   */
  addGkCourInfoByStu (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/tra/addGkCourInfoByStu'
    }
    return $axios(service, data)
  },
  /**
   * 获取个人课程详情
   * @param data
   */
  getTraInfoByUser (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraInfoByUser'
    }
    return $axios(service, data)
  },
  /**
   * 个人学习公开课
   * @param data
   */
  upTraPceByUser (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/tra/upTraPceByUser'
    }
    return $axios(service, data)
  },
  /**
   * 个人培训进度统计复制文
   * @param data
   */
  statMeProgress (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/data/statMeProgress'
    }
    return $axios(service, data)
  },
  /**
   * 查询用户是否有正在考试的数据
   * @param data
   */
  startExamData (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/startExamData'
    }
    return $axios(service, data)
  },
  /**
   * 用户统计
   * @param data
   */
  reportApi (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/userExamCount'
    }
    return $axios(service, data)
  }
  // 培训相关 结束 ===================================================================↑
}
