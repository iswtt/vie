import $axios from '@/components/axios.js'
let pre = '/imagelibrary'
export default {
  getImageList (data) { // 获取典图列表
    const service = {
      method: 'POST',
      url: pre + '/image/list'
    }
    return $axios(service, data)
  },
  getImageDetail (data) { // 获取典图详情
    const service = {
      method: 'POST',
      url: pre + '/image/detail'
    }
    return $axios(service, data)
  },
  updateImage (data, isUpdate) { // 手动保存或提交典图
    let _url = pre + '/image/add'
    if (isUpdate) {
      _url = pre + '/image/update'
    }
    const service = {
      method: 'POST',
      url: _url
    }
    return $axios(service, data)
  },
  deleteImage (data) { // 删除典图
    const service = {
      method: 'POST',
      url: pre + '/image/delete'
    }
    return $axios(service, data)
  },
  releaseImage (data) { // 发布典图
    const service = {
      method: 'POST',
      url: pre + '/image/release'
    }
    return $axios(service, data)
  },
  unreleaseImage (data) { // 取消发布典图
    const service = {
      method: 'POST',
      url: pre + '/image/unrelease'
    }
    return $axios(service, data)
  },
  rejectImage (data) { // 拒绝典图
    const service = {
      method: 'POST',
      url: pre + '/image/rejected'
    }
    return $axios(service, data)
  },
  addBBS (data) { // 添加评论
    const service = {
      method: 'post',
      url: pre + '/image/bbs/add'
    }
    return $axios(service, data)
  },
  deleteBBS (data) { // 删除评论
    const service = {
      method: 'post',
      url: pre + '/image/bbs/delete'
    }
    return $axios(service, data)
  },
  addImagefiles (data) { // 文件上传
    const service = {
      method: 'POST',
      url: pre + '/image/imgupfiles'
    }
    return $axios(service, data)
  },
  deleteImageFile (data) { // 删除文件服务器附件
    const service = {
      method: 'post',
      url: pre + '/image/delfiles'
    }
    return $axios(service, data)
  },
  getImgLibList (data) {
    const service = {
      method: 'post',
      url: '/imagelibrary/httpservice/getimglist'
    }
    return $axios(service, data)
  },
  base64Uplaod (data) {
    const service = {
      method: 'post',
      url: '/imagelibrary/image/base64Upload'
    }
    return $axios(service, data)
  },
  addTilImgUsedCount (data) { // 辅助审像中典型图像对比和以图找图场景调用，记录典图的使用次数
    const service = {
      method: 'post',
      url: '/imagelibrary/httpservice/addTilImgUsedCount'
    }
    return $axios(service, data)
  },
  createImgFolder (data) {
    const service = {
      method: 'post',
      url: '/imagelibrary/image/createImgFolder'
    }
    return $axios(service, data)
  }
}
