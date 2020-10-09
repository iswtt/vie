import $axios from '@/components/axios.js'
let pre = '/supervise'
export default {
  listPortAndPersionByRoleCode (data) {
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
  getOrgPortDeviceTree (data) { // 获取关区、口岸、设备
    const service = {
      method: 'post',
      url: '/management/scdevice/getdevicetree'
    }
    return $axios(service, data)
  }
}
