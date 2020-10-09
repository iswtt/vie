import $axios from '@/components/axios.js'
import $trackAxios from '@/components/trackReplay/api/axios.js'
let pre = '/supervise'
export default {
  list (data) {
    const service = {
      method: 'post',
      url: pre + '/tasksearch/listpage'
    }
    return $axios(service, data)
  },
  getSearchCondition (data) {
    const service = {
      method: 'post',
      url: pre + '/tasksearch/getsearchcondation'
    }
    return $axios(service, data)
  },
  updateSearchCondition (data) {
    const service = {
      method: 'post',
      url: pre + '/tasksearch/upseaordisplay'
    }
    return $axios(service, data)
  },
  checkDetail (data) {
    const service = {
      method: 'post',
      url: pre + '/tasksearch/detailtask'
    }
    return $axios(service, data)
  },
  delAttach (data) {
    const service = {
      method: 'post',
      url: pre + '/tasksearch/delfiles'
    }
    return $axios(service, data)
  },
  saveTaskRecheck (data) {
    const service = {
      method: 'post',
      url: pre + '/tasksearch/addtaskrecheck'
    }
    return $axios(service, data)
  },
  addTypicalImage (data) {
    const service = {
      method: 'post',
      url: pre + '/tasksearch/exportimgtotil'
    }
    return $axios(service, data)
  },
  getIsExists (data) {
    const service = {
      method: 'get',
      url: window.config.Vitracking.commonUrl + '/supply/exists-serialnumber'
    }
    return $trackAxios(service, data)
  }
}
