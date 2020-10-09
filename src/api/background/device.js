import $axios from '@/components/axios.js'
export default {
  deleteDeviceList (data) { // 删除
    const service = {
      method: 'POST',
      url: '/management/scdevice/delete'
    }
    return $axios(service, data)
  },
  addDevice (data) { // 添加保存
    const service = {
      method: 'POST',
      url: '/management/scdevice/add'
    }
    return $axios(service, data)
  },
  updateDevice (data) { // 修改保存
    const service = {
      method: 'POST',
      url: '/management/scdevice/update'
    }
    return $axios(service, data)
  },
  getDeviceList (data) { // 查询列表
    const service = {
      method: 'POST',
      url: '/management/scdevice/querypage'
    }
    return $axios(service, data)
  },
  getDetail (data) {
    const service = {
      method: 'POST',
      url: '/management/scdevice/detail'
    }
    return $axios(service, data)
  },
  delAttach (data) {
    const service = {
      method: 'post',
      url: '/management/scdevice/delfiles'
    }
    return $axios(service, data)
  }
}
