import $axios from '@/components/axios.js'
let pre = '/supervise'
export default {
  getOrgPortDeviceTree (data) { // 获取关区、口岸、设备
    const service = {
      method: 'post',
      url: '/management/scdevice/getdevicetree'
    }
    return $axios(service, data)
  },
  getPersonAndPort (data) { // 根据角色获取用户及口岸信息
    const service = {
      method: 'post',
      url: '/management/scdevice/listPortAndPersionByRoleCode'
    }
    return $axios(service, data)
  },
  getInspectStatistics (data) { // 获取查验统计数据
    const service = {
      method: 'post',
      url: pre + '/statistics/inspectReport'
    }
    return $axios(service, data)
  },
  recheckReport (data) { // 获取稽核统计
    const service = {
      method: 'post',
      url: pre + '/statistics/inspectReport'
    }
    return $axios(service, data)
  },
  getAnalysisReport (data) { // 地图在口岸级别时，当日审图员工作量统计接口
    const service = {
      method: 'post',
      url: pre + '/statistics/analystReport'
    }
    return $axios(service, data)
  },
  getPhysicalReport (data) { // 地图在口岸级别时，当日手检员工作量统计接口
    const service = {
      method: 'post',
      url: pre + '/statistics/phyInspectorReport'
    }
    return $axios(service, data)
  },
  taskTrendReport (data) { // 业务量趋势统计
    const service = {
      method: 'post',
      url: `${pre}/statistics/taskTrendReport`
    }
    return $axios(service, data)
  },
  maplistpage (data) {
    const service = {
      method: 'post',
      // url: `${pre}/tasksearch/maplistpage`
      url: `${pre}/tasksearch/listpage`
    }
    return $axios(service, data)
  }
}
