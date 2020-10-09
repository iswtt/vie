import $axios from '@/components/axios.js'
let baseUrl = window.config.trainingUI.baseUrl
// let pre = '/training'
let pre = ''
export default {
  // 根据条件获取试卷列表(分页)
  getTestPaper (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/getTestPaper'
    }
    return $axios(service, data)
  },
  // 随机保存(生成试卷)
  andomSave (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/andomSave'
    }
    return $axios(service, data)
  },
  // 手动保存(生成试卷)
  manualSave (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/manualSave'
    }
    return $axios(service, data)
  },
  // 根据条件查询试题条数
  getQuestionInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/getQuestionInfo'
    }
    return $axios(service, data)
  },
  // 查看试卷详情
  getTestPaperInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/getTestPaperInfo'
    }
    return $axios(service, data)
  },
  // 查看试题详情
  getTestImgInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/getTestImgInfo'
    }
    return $axios(service, data)
  },
  // 更改试卷数据
  updateTestPaperBySave (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/updateTestPaperBySave'
    }
    return $axios(service, data)
  },
  // 更改试卷状态
  updateTestPaperStatus (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/testPaper/updateTestPaperStatus'
    }
    return $axios(service, data)
  },
  // 获取考试信息(分页)
  getExam (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/getExam'
    }
    return $axios(service, data)
  },
  // 保存考试信息
  saveExam (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/saveExam'
    }
    return $axios(service, data)
  },
  // 获取试卷名称列表
  getTestPapers (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/getTestPapers'
    }
    return $axios(service, data)
  },
  // 获取学员/培训班信息
  getUsersInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/getUsersInfo'
    }
    return $axios(service, data)
  },
  // 考试信息详情
  examInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/examInfo'
    }
    return $axios(service, data)
  },
  // 更新考试信息
  updateExam (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/updateExam'
    }
    return $axios(service, data)
  },
  // 更新考试状态
  updateExamStatus (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/updateExamStatus'
    }
    return $axios(service, data)
  },
  // 考试统计
  countExam (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/exam/countExam'
    }
    return $axios(service, data)
  },
  // 获取题目集合
  practiceDate (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/practiceDate'
    }
    return $axios(service, data)
  },
  // 查看考试试题
  viewQuestions (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/practice/viewQuestions'
    }
    return $axios(service, data)
  },
  // 培训相关 开始 ===================================================================↓
  /**
   * 获取培训数据列表
   * @param data
   */
  getTraPageInfo (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraPageInfo'
    }
    return $axios(service, data)
  },
  /**
   * 查询培训分类信息列表
   * @param data
   */
  getTraDictInfo (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraDictInfo'
    }
    return $axios(service, data)
  },
  /**
   * 添加培训数据
   * @param data
   */
  addTraInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/tra/addTraInfo'
    }
    return $axios(service, data)
  },
  /**
   * 删除培训数据
   * @param data
   */
  delTraInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/tra/delTraInfo'
    }
    return $axios(service, data)
  },
  /**
   * 查询学员信息列表
   * @param data
   */
  getTraUserInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/tra/getAllStudentsInfo'
    }
    return $axios(service, data)
  },
  /**
   * 获取培训数据详情
   * @param data
   */
  getTraInfo (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraInfo'
    }
    return $axios(service, data)
  },
  /**
   * 获取课程是否可以删除如果>0不可以
   * @param data
   */
  getTraCourCount (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraCourCount'
    }
    return $axios(service, data)
  },
  /**
   * 获取用户是否可以删除如果>0不可以
   * @param data
   */
  getTraUserCount (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/tra/getTraUserCount'
    }
    return $axios(service, data)
  },
  /**
   * 修改培训主数据
   * @param data
   */
  upTraInfo (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/tra/upTraInfo'
    }
    return $axios(service, data)
  },
  /**
   * FormData文件上传
   * @param data
   */
  uploadFormData (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/api/uploadFormData'
    }
    return $axios(service, data)
  },
  /**
   * 上传doc或者docx课件
   * @param data
   */
  docToPdf (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/api/docToPdf'
    }
    return $axios(service, data)
  },
  /**
   * 上传ppt或者pptx课件
   * @param data
   */
  pptToPdf (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/api/pptToPdf'
    }
    return $axios(service, data)
  },
  /**
   * 下载文件
   * @param data
   */
  downLoadFail (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/api/downFileWithName'
    }
    return $axios(service, data)
  },
  // 培训相关 结束 ===================================================================↑
  // 教师端首页 结束 ===================================================================↓
  /**
   * 学员培训进度统计
   * @param data
   */
  statCadetProgress (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/data/statCadetProgress'
    }
    return $axios(service, data)
  },
  /**
   * 学员考试情况明细
   * @param data
   */
  trainingDetail (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/trainingDetail'
    }
    return $axios(service, data)
  },
  /**
   * 考试成绩(老师看板)报表
   * @param data
   */
  examinationCountByTeacher (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/examinationCountByTeacher'
    }
    return $axios(service, data)
  },
  /**
   * 考试名称列表(老师看板)
   * @param data
   */
  examListByTeacher (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/examListByTeacher'
    }
    return $axios(service, data)
  },
  /**
   * 学员培训学习报表
   * @param data
   */
  getCadetReport (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/data/getCadetReport'
    }
    return $axios(service, data)
  },
  /**
   * 图像学习报表
   * @param data
   */
  learnCount (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/learnCount'
    }
    return $axios(service, data)
  },
  /**
   * 审图练习报表
   * @param data
   */
  reviewCount (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/reviewCount'
    }
    return $axios(service, data)
  },
  /**
   * 考试成绩报表
   * @param data
   */
  examinationCount (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/report/examinationCount'
    }
    return $axios(service, data)
  },
  /**
   * 导出学员培训学习报表
   * @param data
   */
  exportCadetReport (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/data/exportCadetReport'
    }
    return $axios(service, data)
  }
  // 教师端首页 结束 ===================================================================↑
}
