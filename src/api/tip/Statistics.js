import $axios from '@/components/axios.js'
export default {
  statisticsStatus (data) { // 图像状态分布统计
    const service = {
      method: 'get',
      url: '/tip/imagestatistics/status'
    }
    return $axios(service, data)
  },
  statisticsCategory (data) { // 图像类别分布统计
    const service = {
      method: 'get',
      url: '/tip/imagestatistics/category'
    }
    return $axios(service, data)
  },
  statisticsType (data) { // 已发布图像分布统计
    const service = {
      method: 'get',
      url: '/tip/imagestatistics/type'
    }
    return $axios(service, data)
  },
  examname (data) { // 考核名称统计
    const service = {
      method: 'get',
      url: '/tip/examstatistics/examname'
    }
    return $axios(service, data)
  },
  examinee (data) { // 考核人员统计
    var str = ''
    for (var i in data) {
      str += `name=${data[i]}`
    }
    const service = {
      method: 'get',
      url: '/tip/examstatistics/examinee?' + str
    }
    return $axios(service)
  },
  getExamName (data) { // 获取所有考核名称
    const service = {
      method: 'get',
      url: '/tip/examstatistics/queryExamParamName'
    }
    return $axios(service, data)
  },
  getExaminee (data) { // 获取所有考核人员
    const service = {
      method: 'get',
      url: '/tip/examstatistics/queryExaminee'
    }
    return $axios(service, data)
  },
  statisticsByExamName (data) { // 按考核名称统计
    const service = {
      method: 'post',
      url: '/tip/examstatistics/statisticsByExamParamName'
    }
    return $axios(service, data)
  },
  statisticsByExaminee (data) { // 按考核人员统计
    const service = {
      method: 'post',
      url: '/tip/examstatistics/statisticsByExaminee'
    }
    return $axios(service, data)
  }
}
