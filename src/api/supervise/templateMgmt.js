import $axios from '@/components/axios.js'
let pre = '/supervise'
export default {
  getList (data) { // 获取模板列表数据
    const service = {
      method: 'post',
      url: pre + '/dashboard/templatelist'
    }
    return $axios(service, data)
  },
  updateTemplateStatus (data) { // 更新模板状态
    const service = {
      method: 'post',
      url: pre + '/dashboard/updatetemplatestatus'
    }
    return $axios(service, data)
  },
  getTemplateDetail (data) { // 获取模板详情
    const service = {
      method: 'post',
      url: pre + '/dashboard/templatedetail'
    }
    return $axios(service, data)
  },
  updateTemplate (data) { // 保存模板修改
    const service = {
      method: 'post',
      url: pre + '/dashboard/updatetemplate'
    }
    return $axios(service, data)
  },
  getComponentTree (data) { // 获取组件类型树
    const service = {
      method: 'post',
      url: pre + '/dashboard/componenttypetree'
    }
    return $axios(service, data)
  },
  getComponentList (data) { // 获取组件列表数据
    const service = {
      method: 'post',
      url: pre + '/dashboard/componentlist'
    }
    return $axios(service, data)
  },
  saveComponent (data) { // 保存组件信息修改
    const service = {
      method: 'post',
      url: pre + '/dashboard/updatecomponent'
    }
    return $axios(service, data)
  },
  getComponentStatistic (data, url) { // 获取各组件统计数据
    const service = {
      method: 'get',
      url: url
    }
    return $axios(service, data)
  }
}
