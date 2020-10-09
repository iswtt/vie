import $axios from '@/components/axios.js'
let pre = '/supervise'
export default {
  getTableList (data) { // 获取任务列表
    const service = {
      method: 'post',
      url: pre + '/taskRep/listpage'
    }
    return $axios(service, data)
  },
  getTaskDetail (data) { // 获取任务详情
    const service = {
      method: 'post',
      url: pre + '/taskRep/detailtask'
    }
    return $axios(service, data)
  },
  getSearchCondition (data) { // 获取全部查询条件/显示列与自定义的全部查询条件/显示列
    const service = {
      method: 'post',
      url: pre + '/taskRep/getsearchcondation'
    }
    return $axios(service, data)
  },
  // getDefaultSearchCondition (data) { // 获取默认的查询条件/显示列(?)
  //   const service = {
  //     method: 'post',
  //     url: pre + '/tasksearch/getdefseaorcon'
  //   }
  //   return $axios(service, data)
  // },
  updateSearchCondition (data) { // 更新自定义查询条件
    const service = {
      method: 'post',
      url: pre + '/taskRep/upseaordisplay'
    }
    return $axios(service, data)
  },
  // exportExcel (data) { // 导出excel
  //   let url = window.config.baseUrl + pre + '/taskRep/exportExcel?lang=' + data.lang
  //   window.open(url)
  // },
  // 获取任务量统计报表数据
  getImageCheckTaskQtyData (data) { // 审图任务量查询
    const service = {
      method: 'post',
      url: pre + '/taskNumRep/queryImgChkNum'
    }
    return $axios(service, data)
  },
  getRecheckTaskQtyData (data) { // 复审任务量查询
    const service = {
      method: 'post',
      url: pre + '/taskNumRep/queryReviewChkNum'
    }
    return $axios(service, data)
  },
  getManualTaskQtyData (data) { // 手检任务量查询
    const service = {
      method: 'post',
      url: pre + '/taskNumRep/queryManualNum'
    }
    return $axios(service, data)
  },
  getAuditTaskQtyData (data) { // 稽核任务量查询
    const service = {
      method: 'post',
      url: pre + '/taskNumRep/queryRecheckNum'
    }
    return $axios(service, data)
  },
  // 获取查验结论统计报表数据
  getNoSuspectQtyData (data) { // 无嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/insConRep/queryNoSuspectNum'
    }
    return $axios(service, data)
  },
  getSuspectQtyData (data) { // 有嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/insConRep/querySuspectNum'
    }
    return $axios(service, data)
  },
  getNoSeizedQtyData (data) { // 无查获量查询
    const service = {
      method: 'post',
      url: pre + '/insConRep/queryNoSeizedNum'
    }
    return $axios(service, data)
  },
  getSeizedQtyData (data) { // 有查获量查询
    const service = {
      method: 'post',
      url: pre + '/insConRep/querySeizedNum'
    }
    return $axios(service, data)
  },
  // 获取稽核结论统计报表数据
  getAuditedQtyData (data) { // 已稽核量查询
    const service = {
      method: 'post',
      url: pre + '/recheckRep/queryRecheckNum'
    }
    return $axios(service, data)
  },
  getAuditPassQtyData (data) { // 已稽核通过量查询
    const service = {
      method: 'post',
      url: pre + '/recheckRep/queryRecheckPassNum'
    }
    return $axios(service, data)
  },
  getAuditNotPassQtyData (data) { // 已稽核不通过量查询
    const service = {
      method: 'post',
      url: pre + '/recheckRep/queryRecheckNotPassNum'
    }
    return $axios(service, data)
  },
  getNotAuditedQtyData (data) { // 未稽核量查询
    const service = {
      method: 'post',
      url: pre + '/recheckRep/queryNotRecheckNum'
    }
    return $axios(service, data)
  },
  // 获取人员任务统计报表数据
  getPassQtyData (data) { // 获取审图无嫌疑、复审无嫌疑、手检无查获、稽核通过量
    const service = {
      method: 'post',
      url: pre + '/usrTaskRep/queryNoSuspectNum'
    }
    return $axios(service, data)
  },
  getNotPassQtyData (data) { // 获取审图有嫌疑、复审有嫌疑、手检有查获、稽核不通过量
    const service = {
      method: 'post',
      url: pre + '/usrTaskRep/querySuspectNum'
    }
    return $axios(service, data)
  },
  getConcSameQtyData (data) { // 获取结论一致量
    const service = {
      method: 'post',
      url: pre + '/usrTaskRep/queryConcSame'
    }
    return $axios(service, data)
  },
  getConcNotSameQtyData (data) { // 获取结论不一致量
    const service = {
      method: 'post',
      url: pre + '/usrTaskRep/queryConcNotSame'
    }
    return $axios(service, data)
  },
  // 获取人员效率统计报表数据
  getCompetedTaskQtyData (data) { // 获取已完成审图、复审、稽核任务量
    const service = {
      method: 'post',
      url: pre + '/usrEfficiencyRep/queryTaskNum'
    }
    return $axios(service, data)
  },
  getOpenToSubmitTimeData (data) { // 获取任务打开到提交时间（均值）数据
    const service = {
      method: 'post',
      url: pre + '/usrEfficiencyRep/queryOpenToSubmitTimeAvgLen'
    }
    return $axios(service, data)
  },
  getAssignToSubmitTimeData (data) { // 获取任务分配到提交时间（均值）数据
    const service = {
      method: 'post',
      url: pre + '/usrEfficiencyRep/queryAssignToSubmitTimeAvgLen'
    }
    return $axios(service, data)
  },
  getHistoryUser (data) { // 获取历史人员信息（审图员、复审员、手检员、稽核员）
    const service = {
      method: 'post',
      url: pre + '/usrTaskRep/queryUsr'
    }
    return $axios(service, data)
  },
  // 获取人员任务趋势报表数据
  getNoSuspectNumOfUserTrend (data) { // 无嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/usrTaskTrendRep/queryNoSuspectNum'
    }
    return $axios(service, data)
  },
  getSuspectNumOfUserTrend (data) { // 有嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/usrTaskTrendRep/querySuspectNum'
    }
    return $axios(service, data)
  },
  getNoSeizedNumOfUserTrend (data) { // 无查获量查询
    const service = {
      method: 'post',
      url: pre + '/usrTaskTrendRep/queryNoSeizedNum'
    }
    return $axios(service, data)
  },
  getSeizedNumOfUserTrend (data) { // 有查获量查询
    const service = {
      method: 'post',
      url: pre + '/usrTaskTrendRep/querySeizedNum'
    }
    return $axios(service, data)
  },
  getRecheckPassNumOfUserTrend (data) { // 稽核通过量查询
    const service = {
      method: 'post',
      url: pre + '/usrTaskTrendRep/queryRecheckPassNum'
    }
    return $axios(service, data)
  },
  getRecheckNotPassNumOfUserTrend (data) { // 稽核不通过量查询
    const service = {
      method: 'post',
      url: pre + '/usrTaskTrendRep/queryRecheckNotPassNum'
    }
    return $axios(service, data)
  },
  getNotRecheckNumOfUserTrend (data) { // 未稽核量查询
    const service = {
      method: 'post',
      url: pre + '/usrTaskTrendRep/queryNotRecheckNum'
    }
    return $axios(service, data)
  },
  // 获取审图任务趋势报表数据
  getNoSuspectNumOfImgCheckTrend (data) { // 无嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/imgChkTaskTrendRep/queryNoSuspectNum'
    }
    return $axios(service, data)
  },
  getSuspectNumOfImgCheckTrend (data) { // 有嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/imgChkTaskTrendRep/querySuspectNum'
    }
    return $axios(service, data)
  },
  // 获取复审任务趋势报表数据
  getNoSuspectNumOfRecheckTrend (data) { // 无嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/reviewTaskTrendRep/queryNoSuspectNum'
    }
    return $axios(service, data)
  },
  getSuspectNumOfRecheckTrend (data) { // 有嫌疑量查询
    const service = {
      method: 'post',
      url: pre + '/reviewTaskTrendRep/querySuspectNum'
    }
    return $axios(service, data)
  },
  // 获取手检任务趋势报表数据
  getNoSeizedNumOfManualTrend (data) { // 无查获量查询
    const service = {
      method: 'post',
      url: pre + '/manualTaskTrendRep/queryNoSeizedNum'
    }
    return $axios(service, data)
  },
  getSeizedNumOfManualTrend (data) { // 有查获量查询
    const service = {
      method: 'post',
      url: pre + '/manualTaskTrendRep/querySeizedNum'
    }
    return $axios(service, data)
  },
  // 获取已稽核任务趋势报表数据
  getRecheckPassNumOfAuditTrend (data) { // 稽核通过量查询
    const service = {
      method: 'post',
      url: pre + '/recheckTaskTrendRep/queryRecheckPassNum'
    }
    return $axios(service, data)
  },
  getRecheckNotPassNumOfAuditTrend (data) { // 稽核不通过量查询
    const service = {
      method: 'post',
      url: pre + '/recheckTaskTrendRep/queryRecheckNotPassNum'
    }
    return $axios(service, data)
  },
  getNotRecheckNumOfAuditTrend (data) { // 未稽核量查询
    const service = {
      method: 'post',
      url: pre + '/recheckTaskTrendRep/queryNotRecheckNum'
    }
    return $axios(service, data)
  },
  // 获取人员任务对比报表数据
  getUserComparedData (data) {
    const service = {
      method: 'post',
      url: pre + '/taskCompareRep/queryUsrCompare'
    }
    return $axios(service, data)
  },
  // 获取审图任务对比报表数据
  getImgCheckComparedData (data) {
    const service = {
      method: 'post',
      url: pre + '/taskCompareRep/queryImgChkCompare'
    }
    return $axios(service, data)
  },
  // 获取复审任务对比报表数据
  getRecheckComparedData (data) {
    const service = {
      method: 'post',
      url: pre + '/taskCompareRep/queryReviewCompare'
    }
    return $axios(service, data)
  },
  // 获取手检任务对比报表数据
  getManualComparedData (data) {
    const service = {
      method: 'post',
      url: pre + '/taskCompareRep/queryManualCompare'
    }
    return $axios(service, data)
  },
  // 获取已稽核任务对比报表数据
  getAuditComparedData (data) {
    const service = {
      method: 'post',
      url: pre + '/taskCompareRep/queryRecheckCompare'
    }
    return $axios(service, data)
  },
  // 获取审图、复审有嫌疑量
  getSuspectData (data) {
    const service = {
      method: 'post',
      url: pre + '/accuracyRep/queryTaskNum'
    }
    return $axios(service, data)
  },
  // 获取审图、复审正确量
  getCorrectData (data) {
    const service = {
      method: 'post',
      url: pre + '/accuracyRep/queryRightTaskNum'
    }
    return $axios(service, data)
  },
  // 获取审图、复审错误量
  getErrorData (data) {
    const service = {
      method: 'post',
      url: pre + '/accuracyRep/queryWrongTaskNum'
    }
    return $axios(service, data)
  }
}
