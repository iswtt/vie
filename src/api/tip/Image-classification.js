import $axios from '@/components/axios.js'
export default {
  addImage (data) { // 添加图像分类
    const service = {
      method: 'post',
      url: '/tip/imagecategory/add'
    }
    return $axios(service, data)
  },
  updateImage (data) { // 修改图像分类
    const service = {
      method: 'post',
      url: '/tip/imagecategory/update'
    }
    return $axios(service, data)
  },
  delImage (data) { // 删除图像分类
    const service = {
      method: 'delete',
      url: '/tip/imagecategory/delete'
    }
    return $axios(service, data)
  },
  queryListImage (data) { // 获取图像分类树
    const service = {
      method: 'get',
      url: '/tip/imagecategory/getcategorynodes'
    }
    return $axios(service, data)
  },
  detail (data) { // 获取图像分类详情
    const service = {
      method: 'get',
      url: '/tip/imagecategory/detail'
    }
    return $axios(service, data)
  }
}
