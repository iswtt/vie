import $axios from '@/components/axios.js'
let trainingUI = window.config.trainingUI
let baseUrl = trainingUI.baseUrl
// let pre = '/training'
let pre = ''
let typicalMapPackageName = '/imagelibrary' // 典图系统接口包名
let supervisionPackageName = '/supervise' // 监管系统接口包名
export default {
  // 获取题库信息(分页)
  getQuestionBank (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/questionBank/getQuestionBank'
    }
    return $axios(service, data)
  },
  // 获取试题详情(详情,修改查询)
  getQuestion (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/questionBank/getQuestion'
    }
    return $axios(service, data)
  },
  // 新增试题
  addQuestion (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/questionBank/addQuestion'
    }
    return $axios(service, data)
  },
  // 更改试题内容
  updateQuestion (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/questionBank/updateQuestion'
    }
    return $axios(service, data)
  },
  // 更改试题状态
  updateState (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/questionBank/updateState'
    }
    return $axios(service, data)
  },
  // 获取典图和监管系统信息
  getimglist (data) {
    let service
    if (data.imageName !== undefined) {
      service = {
        method: 'post',
        url: typicalMapPackageName + '/httpservice/getimglist'
      }
    } else {
      service = {
        method: 'post',
        // url: trainingUI.supervisionUrl + supervisionPackageName + '/interactive/imglist'
        url: supervisionPackageName + '/interactive/imglist'
      }
    }
    return $axios(service, data)
  },
  // 获取监管 历史图像详情
  getImgDetail (data) {
    const service = {
      method: 'post',
      url: supervisionPackageName + '/interactive/imgdetailForTraining'
    }
    return $axios(service, data)
  },
  // 导入数据(典图导入,监管导入)
  importDate (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/questionBank/importDate'
    }
    return $axios(service, data)
  },
  // 获取所有hscode
  gethscodes (data) {
    const service = {
      method: 'post',
      url: '/management/hscodes/gethscodes'
    }
    return $axios(service, data)
  },
  // 新增证书
  addCertificate (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/certificate/addCertificate'
    }
    return $axios(service, data)
  },
  // 删除证书
  deleteCertificate (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/certificate/deleteCertificate'
    }
    return $axios(service, data)
  },
  // 证书分页查询
  getCertificate (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/certificate/getCertificate'
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
  // 选择培训、选择考试
  preAddCertificateByList (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/certificate/preAddCertificateByList'
    }
    return $axios(service, data)
  },
  // 待发证学员
  preAddCertificateByTable (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/certificate/preAddCertificateByTable'
    }
    return $axios(service, data)
  }
}
