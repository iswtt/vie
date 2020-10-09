import $axios from '@/components/axios.js'
let pre = '/inspection'
let preDMS = '/supervise'
export default {
  imageAnalystBoard (data) { // 审图员看板
    const service = {
      method: 'post',
      url: pre + '/dashboard/imageAnalystBoard'
    }
    return $axios(service, data)
  },
  imageRecheckAnalystBoard (data) { // 图像复审员看板
    const service = {
      method: 'post',
      url: pre + '/dashboard/imageRecheckAnalystBoard'
    }
    return $axios(service, data)
  },
  physicalInspectorBoard (data) { // 手检员看板
    const service = {
      method: 'post',
      url: pre + '/dashboard/physicalInspectorBoard'
    }
    return $axios(service, data)
  },
  imageCheckAdminBoard (data) { // 审图管理员看板
    const service = {
      method: 'post',
      url: pre + '/dashboard/imageCheckAdministratorBoard'
    }
    return $axios(service, data)
  },
  physicalInspectionAdminBoard (data) { // 手检管理员看板
    const service = {
      method: 'post',
      url: pre + '/dashboard/physicalInspectorAdministratorBoard'
    }
    return $axios(service, data)
  },
  auditorBoard (data) { // 稽核员看板
    const service = {
      method: 'post',
      url: preDMS + '/dashboard/supervisoryAuditorBoard'
    }
    return $axios(service, data)
  },
  auditorAdminBoard (data) { // 稽核管理员看板
    const service = {
      method: 'post',
      url: preDMS + '/dashboard/supervisoryAdministratorBoard'
    }
    return $axios(service, data)
  }
}
