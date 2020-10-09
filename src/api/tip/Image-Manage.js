import $axios from '@/components/axios.js'
export default {
  querylist (data) { // 图像管理列表
    const service = {
      method: 'post',
      url: '/tip/image/querylist'
    }
    return $axios(service, data)
  },
  queryListImage (data) { // 获取图类别树
    const service = {
      method: 'get',
      url: '/tip/imagecategory/getcategorynodes'
    }
    return $axios(service, data)
  },
  getImgDetail (data) { // 获取图像详情
    const service = {
      method: 'get',
      url: '/tip/image/detail'
    }
    return $axios(service, data)
  },
  getSuperviseList (data) { // 获取监管任务列表
    const service = {
      method: 'post',
      url: '/supervise/interactive/imglist'
    }
    return $axios(service, data)
  },
  getSuperviseDetail (data) { // 获取监管任务详情
    const service = {
      method: 'post',
      url: '/supervise/interactive/imgdetail'
    }
    return $axios(service, data)
  },
  getImgLibList (data) { // 获取任务列表
    const service = {
      method: 'post',
      url: '/imagelibrary/httpservice/getimglist'
    }
    return $axios(service, data)
  },
  getuploadpath (data) { // 获取图像上传路径
    const service = {
      method: 'post',
      url: '/tip/image/getuploadpath'
    }
    return $axios(service, data)
  },
  createImage (data) { // 新增保存
    const service = {
      method: 'post',
      url: '/tip/image/add'
    }
    return $axios(service, data)
  },
  release (data) { // 批量发布
    const service = {
      method: 'post',
      url: '/tip/image/release'
    }
    return $axios(service, data)
  },
  unrelease (data) { // 批量取消发布
    const service = {
      method: 'post',
      url: '/tip/image/unrelease'
    }
    return $axios(service, data)
  },
  deleteImage (data) { // 删除
    const service = {
      method: 'post',
      url: '/tip/image/delete'
    }
    return $axios(service, data)
  },
  update (data) { // 修改保存
    const service = {
      method: 'post',
      url: '/tip/image/update'
    }
    return $axios(service, data)
  },
  checkImageName (data) { // 校验图像名称是否已存在
    const service = {
      method: 'post',
      url: '/tip/image/checkimagename'
    }
    return $axios(service, data)
  }
}
