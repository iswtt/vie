import $axios from '@/components/axios.js'
let trainingUI = window.config.trainingUI
let baseUrl = trainingUI.baseUrl
let pre = '/api'
let usersPackageName = '/upmsapi' // 获取用户接口包名
export default {
  // 获取题库信息(分页)
  base64Uplaod (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/base64Uplaod'
    }
    return $axios(service, data)
  },
  // 获取用户接口
  findUsersByRole (data) {
    const service = {
      method: 'get',
      url: usersPackageName + '/ru/findUsersByRole'
    }
    return $axios(service, data)
  },
  // 获取用户接口
  saveUsers (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/auth/saveUsers'
    }
    return $axios(service, data)
  },
  // 生成证件图片
  getCertImg (data) {
    const service = {
      method: 'get',
      baseUrl,
      url: pre + '/getCertImg'
    }
    return $axios(service, data)
  },
  // 生成viprobe上传的文件夹
  createFloder (data) {
    const service = {
      method: 'post',
      baseUrl,
      url: pre + '/createImgFolder'
    }
    return $axios(service, data)
  }
}
