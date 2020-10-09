import $axios from '@/components/axios.js'
let pre = '/imagelibrary'
export default {
  queryByImgDistribution (data) { // 图像分布统计
    const service = {
      method: 'POST',
      url: pre + '/imgStatistics/queryByImgDistribution'
    }
    return $axios(service, data)
  },
  queryByImgRecommend (data) { // 图像推荐统计
    const service = {
      method: 'POST',
      url: pre + '/imgStatistics/queryByImgRecommend'
    }
    return $axios(service, data)
  },
  queryByImgUse (data) { // 图像使用统计
    const service = {
      method: 'POST',
      url: pre + '/imgStatistics/queryByImgUse'
    }
    return $axios(service, data)
  }
}
