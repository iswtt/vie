import $axios from '@/components/axios.js'
let pre = '/supervise'
export default {
  // exportExcel (data) { // 导出接口
  //   // const service = {
  //   //   method: 'post',
  //   //   url: '/supervise/tasksearch/exportExcel'
  //   // }
  //   // return $axios(service, data)
  //   let url = window.config.baseUrl + pre + '/tasksearch/exportExcel?lang=' + data.lang
  //   window.open(url)
  // },
  getTableList (data) { // 获取任务列表
    const service = {
      method: 'post',
      url: pre + '/tasksearch/listpage'
    }
    return $axios(service, data)
  },
  getSearchCondition (data) { // 获取全部查询条件/显示列与自定义的全部查询条件/显示列
    const service = {
      method: 'post',
      url: pre + '/tasksearch/getsearchcondation'
    }
    return $axios(service, data)
  },
  // getDefaultSearchCondition (data) { // 获取默认的查询条件/显示列
  //   const service = {
  //     method: 'post',
  //     url: pre + '/tasksearch/getdefseaorcon'
  //   }
  //   return $axios(service, data)
  // },
  updateSearchCondition (data) { // 更新自定义查询条件
    const service = {
      method: 'post',
      url: pre + '/tasksearch/upseaordisplay'
    }
    return $axios(service, data)
  },
  getTaskDetail (data) { // 获取任务详情页面
    const service = {
      method: 'post',
      url: pre + '/tasksearch/detailtask'
    }
    return $axios(service, data)
  },
  getHisTableList (data) { // 获取历史任务列表(仅用于历史图像对比页面)
    const service = {
      method: 'post',
      url: pre + '/tasksearch/lpnFrontHistory'
    }
    return $axios(service, data)
  }
}
