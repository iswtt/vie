import Vue from 'vue'
import { MessageBox, Notification, Loading } from 'element-ui'
import dicAjax from '@/api/background/dictionary.js'
import commonAjax from '@/api/common/common.js'
import hscodeAjax from '@/api/background/HSCode.js'
import vm from '@/main.js'
import globalData from '@/lib/common/globalData'
const axios = require('axios')
const qs = require('qs')

/**
 * 全局变量
 */
Vue.prototype.$globalData = globalData
let loading
/**
 * loading
 * @param {*} text: 用于提示消息
 * @param {*} flag: 是否全屏
 */
Vue.prototype.$initLoading = (flag = true, text, target) => { // loading
  loading = Loading.service({
    target: target,
    lock: true,
    text: text || '',
    fullscreen: flag,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  return loading
}
/**
 * 请求超时，如果页面有遮罩层，清除遮罩层
 */
Vue.prototype.$closeLoading = () => {
  console.log(loading)
  if (loading) {
    console.log('close  loading')
    vm.$initLoading().close()
    loading = undefined
  }
  // let mask = document.getElementsByClassName('el-loading-mask')
  // if (mask && mask.length > 0) {
  //   vm.$initLoading().close()
  // }
}
/**
 *
 * @author zhuzhiguo
 * @param {*} message: 用于提示消息
 * @param {*} func: 用于传递回调函数
 * @param {*} catchFunc: 用于传递回调函数
 */
Vue.prototype.$ConfirmBox = (message, func, catchFunc) => { // 确认弹窗
  MessageBox.confirm(message, '', {
    confirmButtonText: vm.$t('vicenter.common.sure'),
    cancelButtonText: vm.$t('vicenter.common.cancel'),
    closeOnClickModal: false,
    type: 'warning'
  }).then(
    func
  ).catch(
    catchFunc || (() => {})
  )
}

/**
 *
 * @param {*} message: 后台错误提示
 * @param {*} func: 用于传递回调函数
 */
Vue.prototype.$ConfirmMsgBox = (message, func) => { // 确认弹窗
  MessageBox.alert(message, '', {
    confirmButtonText: vm.$t('vicenter.common.sure'),
    closeOnClickModal: false,
    cancelButtonText: '',
    type: 'warning'
  }).then(
    func
  ).catch(() => {
  })
}

/**
 *
 * @author zhuzhiguo
 * @param {*} message: 用于传递成功消息
 */
Vue.prototype.$NotifSuccess = (message) => {
  Notification.success({
    title: vm.$t('vicenter.common.successfuly'),
    message: message,
    position: 'top-right'
  })
}

/**
 * @author miyuan
 * @param {*} message: 用于传递提示消息
 */
Vue.prototype.$NotifPrompt = (message) => {
  Notification.info({
    title: vm.$t('vicenter.common.prompt'),
    message: message,
    position: 'top-right'
  })
}

/**
 * @author miyuan
 * @param {*} message: 用于传递错误消息
 */
Vue.prototype.$NotifError = (message) => {
  Notification.error({
    title: vm.$t('vicenter.common.dataError'),
    message: message,
    position: 'top-right'
  })
}

/**
 * @author xuegang
 * @param {*} message: 用于传递警告消息
 */
Vue.prototype.$NotifWarning = (message) => {
  Notification.warning({
    title: vm.$t('vicenter.common.warning'),
    message: message,
    position: 'top-right'
  })
}

/**
 *
 * @author zhuzhiguo
 * @param {string} val: 用于存储数据
 * @param {object} key: 后台传递的数据
 * @param {string} type: 区分调用方法
 * @param {array}  categorys: cate名数组
 */
Vue.prototype.$StatisticsResult = (val, key, type, categorys) => {
  if (key.data.flag) {
    val.data.columns = []
    val.data.rows = []
    for (var i in key.data.result) {
      val.data.columns.push(i)
    }
    if (val.data.columns.length > 0) {
      if (type === 'examinee') {
        var res = key.data.result.category
        key.data.result.category = ['date']
        for (var j in res) {
          key.data.result.category.push(res[j])
        }
      }
      for (var k in key.data.result[val.data.columns[0]]) {
        var obj = {}
        for (var m in val.data.columns) {
          var cate = key.data.result[val.data.columns[m]][k]
          if (m === '0') {
            if (type === 'status') { // 图像状态统计
              if (cate === '0') {
                cate = categorys[0]
              } else {
                cate = categorys[1]
              }
            } else if (type === 'type') { // 图像类型统计
              if (cate === '1') {
                cate = categorys[0]
              } else {
                cate = categorys[1]
              }
            }
          }
          obj[val.data.columns[m]] = cate
        }
        val.data.rows.push(obj)
      }
    }
  }
}
/**
 * 考核统计按人员统计使用
 * @param {string} val: 用于存储数据
 * @param {object} key: 后台传递的数据
 */
Vue.prototype.$Statistics = (val, key) => {
  if (key.data.flag) {
    val.data.columns = []
    val.data.rows = []
    val.data.columns.push('date')
    for (var i in key.data.result.name) {
      val.data.columns.push(key.data.result.name[i])
    }
    for (var k in key.data.result.date) {
      var obj = {}
      obj['date'] = vm.$options.filters['formatDate'](key.data.result.date[k], vm.$t('vicenter.common.monthFormat'))
      for (var j in val.data.columns) {
        if (val.data.columns[j] !== 'date') {
          obj[val.data.columns[j]] = key.data.result.value[k][j - 1]
        }
      }
      val.data.rows.push(obj)
    }
  }
}
/**
 *
 * @author zhuzhiguo
 * @param {*} val: 用于存储后台传递的数据
 * @param {*} label: 用于显示的label值的拓展
 * @param {*} id: 用于储存id的值
 */
Vue.prototype.$treeNode = (val, label = 'label', id = 'id', code = 'code', pid = 'pid', children = 'children') => {
  if (!val) {
    return
  }
  val.forEach(e => {
    e.label = e[label]
    e.id = e[id]
    e.code = e[code]
    e.pid = e[pid]
    if (e['typeName']) {
      e.typeName = e['typeName']
    }
    if (e[children] && e[children].length > 0) {
      // 增加pCode字段
      e[children].forEach(child => {
        child.pCode = e.code
      })
      Vue.prototype.$treeNode(e[children], label, id, code, pid)
    }
  })
}
/**
 *
 * @param {*} page : 页面的page变量
 * @param {*} result ：后台返回的result.data对象
 */
Vue.prototype.$page = (page, result) => {
  page.CurrentPage = result.pageable.pageNumber
  page.pagesize = result.pageable.pageSize
  page.Allpage = result.totalElements
}
/**
 * 改变一页显示数量
 * @param {*} value 数值
 * @param {*} searchData 给后台发送的数据
 * @param {*} func getlist方法名
 */
Vue.prototype.$handleSizeChange = (value, searchData, func) => {
  searchData.size = value
  searchData.page = 0 // 回到首页
  func()
}
/**
 * 翻页
 * @param {*} value 数值
 * @param {*} searchData 给后台发送的数据
 * @param {*} func getlist方法名
 */
Vue.prototype.$handleCurrentChange = (value, searchData, func) => {
  searchData.page = value - 1
  func()
}

Vue.prototype.$getTotalTime = (faultDate, completeTime) => {
  var stime = Date.parse(new Date(faultDate))
  var etime = Date.parse(new Date(completeTime))
  var usedTime = etime - stime// 两个时间戳相差的毫秒数
  var days = Math.floor(usedTime / (24 * 3600 * 1000))
  // 计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000)// 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)// 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  var time = days + '天' + hours + '时' + minutes + '分'
  return time
}
Vue.prototype.$getTotalMinute = (faultDate, completeTime) => {
  var stime = Date.parse(new Date(faultDate))
  var etime = Date.parse(new Date(completeTime))
  var usedTime = etime - stime// 两个时间戳相差的毫秒数
  var minutes = Math.ceil(usedTime / (60 * 1000))
  return minutes
}
/**
 * 根据字典类型获取此类型的所有字典信息
 * @param {*} typeCodeArr 字典类型数组
 * @param {*} itemArr 显示字典信息的属性值,属性值的顺序要和数组typeCodeArr字典类型一一对应
 * @param {*} modalItem ComForm的modalItem
 */
Vue.prototype.$getDataByTypecode = (typeCodeArr, itemArr, modalItem) => {
  dicAjax.getDataByTypecode({'typeCodeArr': typeCodeArr}).then(res => {
    if (res.data.flag) {
      let arr = res.data.result
      modalItem.forEach(obj => {
        itemArr.forEach((item, index) => {
          if (obj.ruleProp === item) {
            arr.forEach(e => {
              if (e.typeCode === typeCodeArr[index]) {
                obj.option = []
                e.dicList.forEach(dic => {
                  obj.option.push({
                    value: dic.code,
                    label: vm.$t(dic.key)
                  })
                })
              }
            })
          }
        })
      })
    }
  }).catch(() => {})
}
Vue.prototype.$isInArray = (arr, value) => {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}
/**
 * 点击机构树节点获取点击的节点值
 * @param {*} nodeObj
 * @param {*} checkedObj
 */
Vue.prototype.$checkChange = (nodeObj, checkedObj) => {
  let checkedName = []
  let checkedId = []
  let checkedCode = []
  checkedObj.checkedNodes.forEach(e => {
    if (e.pid !== null && e.typeName && e.typeName === 'dynamic.asv.port') {
      if (checkedId.indexOf(e.id) === -1) {
        checkedName.push(e.name)
        checkedId.push(e.id)
        checkedCode.push(e.code)
      }
    }
  })
  let checkedVal = {}
  checkedVal.name = checkedName.join(',')
  checkedVal.ids = checkedId.join(',')
  checkedVal.codes = checkedCode.join(',')
  return checkedVal
}
/**
 * 点击设备树获取点击的设备节点值
 * @param {*} nodeObj
 * @param {*} checkedObj
 */
Vue.prototype.$checkNodeChange = (nodeObj, checkedObj) => {
  let checkedName = []
  let checkedId = []
  let checkedCode = []
  checkedObj.checkedNodes.forEach(e => {
    if (e.pid !== null && e.type === 'device') {
      if (checkedId.indexOf(e.id) === -1) {
        checkedName.push(e.name)
        checkedId.push(e.id)
        checkedCode.push(e.code)
      }
    }
  })
  let checkedVal = {}
  checkedVal.name = checkedName.join(',')
  checkedVal.ids = checkedId.join(',')
  checkedVal.codes = checkedCode.join(',')
  return checkedVal
}
Vue.prototype.$checkNodeChangeV2 = (nodeObj, checkedObj) => {
  let checkedName = []
  let checkedId = []
  let checkedCode = []
  checkedObj.checkedNodes.forEach(e => {
    if (e.pid !== null) {
      if (checkedId.indexOf(e.id) === -1) {
        checkedName.push(e.name)
        checkedId.push(e.id)
        checkedCode.push(e.code)
      }
    }
  })
  let checkedVal = {}
  checkedVal.name = checkedName.join(',')
  checkedVal.ids = checkedId.join(',')
  checkedVal.codes = checkedCode.join(',')
  return checkedVal
}
Vue.prototype.$trimLeftRight = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
/**
 * 查验初始化数据附件
 */
Vue.prototype.$initImgData = (val, data) => {
  if (data == null) {
    return
  }
  let {CHECKIN, SCANNING, MANUAL_CHECK} = data
  if (CHECKIN != null) {
    CHECKIN.forEach(e => {
      let swipeType = vm.$options.filters['attachType'](e.fileNameExt)
      let imgObj = {
        type: swipeType,
        src: e.location
      }
      if (e.docType === 'CCR') { // 集装箱附件
        val.containAttach.data.push(imgObj)
      } else if (e.docType === 'LPR') { // 车牌号附件
        val.carNumAttach.data.push(imgObj)
      } else if (e.docType === 'VS') { // 视频附件
        val.videoAttach.data.push(imgObj)
      } else { // 其他附件
        val.otherAttach.data.push(imgObj)
      }
    })
  }
  if (MANUAL_CHECK != null && val.uploadImg != null) {
    MANUAL_CHECK.forEach(e => {
      let swipeType = vm.$options.filters['attachType'](e.fileNameExt)
      let imgObj = {
        type: swipeType,
        src: e.location
      }
      val.uploadImg.option.previewList.push(imgObj)
    })
  }
  if (SCANNING != null && val.scanningImgFiles != null) {
    // SCANNING.forEach(e => {
    //   if (e.fileNameExt.indexOf('img') > -1) {
    //     if (e.location.indexOf('?') !== -1) {
    //       val.scanningImgFiles.push({
    //         'name': e.location.substring(e.location.lastIndexOf('/') + 1, e.location.indexOf('?')),
    //         'sign': e.location.substring(e.location.indexOf('?') + 1)
    //       })
    //     } else {
    //       val.scanningImgFiles.push({
    //         'name': e.location.substring(e.location.lastIndexOf('/') + 1)
    //       })
    //     }
    //   }
    // })
    val.isUff = vm.$isUFF(SCANNING)
    if (val.tamperedStatus === 0) {
      // 判断是否篡改
      if (SCANNING.length > 0) {
        let imgIsTamperedArr = []
        SCANNING.forEach(s => {
          if (s.docType === 'HIGH' || s.docType === 'LOW' || s.docType === 'HEMD' || s.docType === 'LOCAL') {
            imgIsTamperedArr.push(Number(s.imgIsTampered))
          }
        })
        if (imgIsTamperedArr.includes(1)) {
          val.tamperedStatus = 1
        } else if (imgIsTamperedArr.includes(2)) {
          val.tamperedStatus = 2
        } else {
          val.tamperedStatus = 0
        }
      }
    }
    let res = vm.$getScanningData(SCANNING)
    val.scanningImgFiles = res
  }
}
// 典图初始化数据附件
Vue.prototype.$initTILImgData = (val, data) => {
  if (data.length === 0) {
    return
  }
  val.imageUpData.isUFF = vm.$imgLibIsUFF(data)
  console.log('val.imageUpData.isUFF', val.imageUpData.isUFF)
  data.forEach(e => {
    if (e.fileClassify === '1' || e.fileClassify === '2') {
      // 扫描图原图（NUCTECH）、扫描图原图（UFF）
      // if (e.fileClassify === '1') {
      //   val.imageUpData.isUFF = false
      // } else if (e.fileClassify === '2') {
      //   val.imageUpData.isUFF = true
      // }
      let res = vm.$getScanningData(data)
      val.imageUpData.scanningImgFiles = res
      if (e.docType === 'HIGH' || e.docType === 'LOW' || e.docType === 'HEMD' || e.docType === 'LOCAL' || (e.fileName.indexOf('suspects_json.mark') > -1)) {
        let disabled = false
        if (e.fileName.indexOf('suspects_json.mark') > -1) {
          disabled = true
        }
        val.imageUpData.imageFile.filesArr.push({
          fileClassify: e.fileClassify,
          docType: e.docType,
          location: e.url,
          relativeUrl: e.location,
          fileName: e.fileName,
          imageType: {
            models: e.docType,
            disabled: disabled
          },
          energyType: e.energyType,
          imgMd5: e.imgMd5,
          viewIndex: e.viewIndex
        })
      }
      if (e.docType === 'OTHER' || e.docType === 'CLR' || e.docType === 'LPR' || e.docType === 'CCR') {
        val.otherInfoFormData.forEach(item => {
          if (item.ruleProp === 'otherAttach') {
            let type = ''
            if (e.url.indexOf('?') < 0) {
              type = vm.$options.filters['attachType'](e.url.substring(e.url.lastIndexOf('.') + 1))
            } else {
              type = vm.$options.filters['attachType'](e.url.substring(e.url.lastIndexOf('.') + 1, e.url.lastIndexOf('?')))
            }
            item.listData.push(
              {
                src: e.signUrl,
                relativeUrl: e.location,
                type: type
              }
            )
          }
        })
      }
    } else if (e.fileClassify === '3') {
      // 扫描图预览图
      val.imageUpData.imageIcon.iconArr.push(
        {
          signUrl: e.signUrl,
          relativeUrl: e.location,
          defaultView: e.defaultView
        }
      )
      if (e.defaultView === '1') {
        val.imageUpData.imageIcon.iconRadio = e.location
      }
    } else if (e.fileClassify === '4') {
      // 实物照片
      val.basicInfoFormData.forEach(item => {
        if (item.ruleProp === 'photo') {
          let type = ''
          if (e.url.indexOf('?') < 0) {
            type = vm.$options.filters['attachType'](e.url.substring(e.url.lastIndexOf('.') + 1))
          } else {
            type = vm.$options.filters['attachType'](e.url.substring(e.url.lastIndexOf('.') + 1, e.url.lastIndexOf('?')))
          }
          item.listData.push(
            {
              src: e.signUrl,
              relativeUrl: e.location,
              type: type
            }
          )
        }
      })
    } else if (e.fileClassify === '0') {
      // 其他附件
      if (e.fileNameExt !== 'steps' && e.fileNameExt !== 'mark') {
        // 其他附件不展示嫌疑标记文件和历史步骤文件，防止被删除
        val.otherInfoFormData.forEach(item => {
          if (item.ruleProp === 'otherAttach') {
            let type = ''
            if (e.url.indexOf('?') < 0) {
              type = vm.$options.filters['attachType'](e.url.substring(e.url.lastIndexOf('.') + 1))
            } else {
              type = vm.$options.filters['attachType'](e.url.substring(e.url.lastIndexOf('.') + 1, e.url.lastIndexOf('?')))
            }
            item.listData.push(
              {
                src: e.signUrl,
                relativeUrl: e.location,
                type: type
              }
            )
          }
        })
      }
    }
  })
}
/**
 * 监管数据判断是否UFF格式图像
 */
Vue.prototype.$isUFF = (data) => {
  var isUff = false
  if (data.length > 0) {
    data.forEach(e => {
      if (e.docType === 'HIGH' && e.imgSrcFlag === '3') {
        isUff = true
      }
    })
    return isUff
  }
}
/**
 * 典图数据判断是否UFF格式图像
 */
Vue.prototype.$imgLibIsUFF = (data) => {
  let uffExt = ['tif', 'tiff']
  var isUff = false
  if (data.length > 0) {
    data.forEach(e => {
      let ext = e.fileNameExt
      if (ext && uffExt.indexOf(ext.toLowerCase()) > -1) {
        isUff = true
      }
    })
  }
  return isUff
}
/**
 * tip数据判断是否UFF格式图像
 */
Vue.prototype.$tipIsUFF = (data) => {
  let uffExt = ['tif', 'tiff']
  var isUff = false
  if (data) {
    for (let key in data) {
      if (data[key]) {
        let name = data[key].name
        name = name.substring(name.lastIndexOf('.') + 1)
        if (name && uffExt.indexOf(name.toLowerCase()) > -1) {
          isUff = true
        }
      }
    }
  }
  return isUff
}
Vue.prototype.$getScanningData = (data) => {
  let res = []
  if (data === null || data.length === 0) {
    return res
  }
  let view1 = {} // 第一视角
  let view2 = {} // 第二视角
  data.forEach(e => {
    if (e.docType === 'HIGH' || e.docType === 'LOW' || e.docType === 'HEMD' || e.docType === 'LOCAL') {
      let docType = e.docType.toLowerCase()
      if (e.viewIndex === '1') { // 第二视角
        view2.view_index = e.viewIndex
        if (e.energyType) {
          view2.energe_type = e.energyType
        }
        if (e.imgMd5) {
          view2[docType] = {
            name: e.fileName,
            check_code: e.imgMd5
          }
        } else {
          view2[docType] = {
            name: e.fileName
          }
        }
      } else if (!e.viewIndex || e.viewIndex === '0') { // 第一视角
        view1.view_index = e.viewIndex || '0'
        if (e.energyType) {
          view1.energe_type = e.energyType
        }
        if (e.imgMd5) {
          view1[docType] = {
            name: e.fileName,
            check_code: e.imgMd5
          }
        } else {
          view1[docType] = {
            name: e.fileName
          }
        }
      }
    }
  })
  if (view2.view_index) {
    res = [view1, view2]
  } else {
    res = [view1]
  }
  return res
}
/**
 * 查验初始化数据时间轴
 */
Vue.prototype.$initTimeLineData = (val, data) => {
  if (data == null) {
    val.steps = []
    val.stepsFlag = true
    return
  }
  if (data.length > 0) {
    data.forEach(e => {
      let startTime = ''
      let endTime = ''
      let time = ''
      if (e.startTime !== null) {
        // startTime = vm.$options.filters['formatDate'](e.startTime)
        startTime = e.startTime
      }
      if (e.endTime !== null) {
        // endTime = vm.$options.filters['formatDate'](e.endTime)
        endTime = e.endTime
      }
      if (startTime !== '' && endTime !== '') {
        time = startTime + '-' + endTime
      } else if (startTime !== '' && endTime === '') {
        time = startTime + '-'
      } else if (startTime === '' && endTime !== '') {
        time = endTime + ''
      }
      let title = ''
      if (e.operatorAccount) {
        title = vm.$t(e.taskNode) + '(' + e.operatorAccount + ')'
      } else {
        title = vm.$t(e.taskNode)
      }
      if (e.taskNode.indexOf('RECHECK') < 0) {
        val.steps.push({
          time: time,
          title: title
        })
      }
    })
  }
  val.stepsFlag = true
}
/**
 * 查验初始化数据基本数据
 */
Vue.prototype.$initInspectionData = (val, data) => {
  if (data == null) {
    return
  }
  val.baseInfo.forEach(e => {
    e.value = data[e.ruleProp]
    if (e.ruleProp === 'checkinTime') {
      if (e.value !== null) {
        e.value = vm.$options.filters['formatDate'](e.value)
      }
    }
    if (e.ruleProp === 'vehicleType') {
      e.value = vm.$t(e.value)
    }
  })
  if (val.printData != null) {
    val.printData.siteName.value = data.siteName
    val.printData.lpnFront.value = data.lpnFront
  }
}
/**
 * 查验、监管基本信息初始化数据集装箱信息
 */
Vue.prototype.$initContainerData = (val, data) => {
  if (data == null) {
    return
  }
  val.contableData.data = []
  if (data.length > 0) {
    data.forEach((item, index) => {
      if (item.tragetType === '1') { // 集装箱对象
        val.contableData.data.push({
          targetNumber: item.targetNumber,
          containerType: item.containerType,
          operation: [{
            func: '',
            label: `<span class='iconfont editTable'>&#xe610;</span>`,
            title: vm.$t('vicenter.common.detail'),
            show: true
          }]
        })
      }
    })
  }
}
/**
 * 查验、监管基本信息初始化数据报关单信息
 */
Vue.prototype.$initCusDecData = (val, data) => {
  if (data == null) {
    return
  }
  if (data.length > 0) {
    val.dectableData.data = data
    val.dectableData.data.forEach(e => {
      e.operation = [
        {
          func: '',
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          title: vm.$t('vicenter.common.detail'),
          show: true
        }
      ]
    })
  }
}
/**
 * 查验初始化数据查验结论
 */
Vue.prototype.$initCheckObject = (val, imgCheckObjects) => {
  if (imgCheckObjects && imgCheckObjects.length > 0) {
    imgCheckObjects.forEach(e => {
      val.imgCheckData.data.push({
        conclusion: e.conclusion ? vm.$t(e.conclusion) : '',
        contrabandLocation: e.contrabandLocation ? vm.$t(e.contrabandLocation) : '',
        contrabandType: e.contrabandType ? vm.$t(e.contrabandType) : '',
        taskLink: e.taskLink ? vm.$t(e.taskLink) : '',
        remark: e.remark
      })
    })
  }
}
/**
 * 查验结论切换单选框
 */
Vue.prototype.$checkChangeRadio = (val, formName, imgOrManual = 'img') => {
  let seleConclusion = val.formRule.model.conclusion
  let mark = val.formRule.model.remark
  if (seleConclusion === val.viprobeData.noSuspected) { // 无嫌疑
    val.formRule.rule = val.noSuspectedRule
    val.$refs[formName].$refs[val.formRule.refName].resetFields()
    val.inputItem.forEach(e => {
      if (imgOrManual === 'img') {
        if (e.ruleProp === 'contrabandType' || e.ruleProp === 'contrabandLocation') {
          e.disabled = true
          e.models = ''
        }
      } else if (imgOrManual === 'manual') {
        if (e.ruleProp === 'contrabandLocation') {
          e.disabled = true
          e.models = []
        }
        if (e.ruleProp === 'seizedList') {
          e.tableData.data = []
          e.models = []
          e.disabled = true
        }
        val.seizedList = []
      }
    })
  } else {
    val.formRule.rule = val.suspectedRule
    val.$refs[formName].$refs[val.formRule.refName].resetFields()
    val.inputItem.forEach(e => {
      if (e.ruleProp === 'contrabandType' || e.ruleProp === 'contrabandLocation' || e.ruleProp === 'seizedList') {
        e.disabled = false
      }
    })
  }
  val.formRule.model.conclusion = seleConclusion
  val.formRule.model.remark = mark
}
/**
 * 表单下拉框校验
 * @param {*} formRef // 表单组件的ref
 * @param {*} val // this对象
 * @param {*} property 需要校验的属性
 */
Vue.prototype.$changeSelectValidateField = (formRef, val, property) => {
  vm.$nextTick(() => {
    val.$refs[formRef].$refs[val.$refs[formRef].formRule.refName].validateField(property)
  })
}
/**
 * 查验初始化数据查验结论
 */
Vue.prototype.$initManalCheckObj = (physicalResult, manualCheckObject) => {
  if (manualCheckObject != null) {
    physicalResult.forEach(e => {
      e.value = manualCheckObject[e.ruleProp]
      if (e.ruleProp === 'checkinTime' && e.value) {
        e.value = vm.$options.filters['formatDate'](e.value)
      }
      if (e.ruleProp === 'vehicleType' || e.ruleProp === 'conclusion') {
        if (e.value) {
          e.value = vm.$t(e.value)
        }
      } else if (e.ruleProp === 'seizedObjects') {
        if (manualCheckObject[e.ruleProp] && manualCheckObject[e.ruleProp].length > 0 && manualCheckObject[e.ruleProp][0].seizedType) {
          e.tableData.data = manualCheckObject[e.ruleProp]
          e.tableData.data.forEach(seized => {
            seized.seizedType = seized.seizedType ? vm.$t(seized.seizedType) : ''
            seized.seizedUnit = seized.seizedUnit ? vm.$t(seized.seizedUnit) : ''
          })
        }
      } else if (e.ruleProp === 'contrabandLocation' && e.value !== '') {
        e.value = vm.$toI18nString(e.value)
      }
    })
  }
}
/**
 * 查验统计切换关区、口岸、设备、审图员、手检员
 */
Vue.prototype.$inspectTypeChange = (val, person, personIds) => {
  // 切换查询条件
  var name = val.inputItem[0].models
  val.inputItem = []
  val.inputItemDefault.forEach((item) => {
    val.inputItem.push(item)
  })
  val.inputItem[1].models = []
  val.inputItem[2].models = []
  val.inputItem[3].models = []
  val.inputItem[1].option = val.groupAll
  if (name === 'cus') {
    val.inputItem.splice(2, 3)
    val.inputItem[1].models = val.groupAllModels
    val.formRule.model.customIds = val.groupAllModels
  } else if (name === 'port') {
    val.inputItem[2].option = val.portAll
    val.inputItem[1].models = val.groupAllModels
    val.inputItem[2].models = val.portAllModels
    val.inputItem.splice(3, 2)
    val.formRule.model.portIds = val.portAllModels
  } else if (name === 'dev') {
    val.inputItem[2].option = val.portAll
    val.inputItem[3].option = val.deviceAll
    val.inputItem[1].models = val.groupAllModels
    val.inputItem[2].models = val.portAllModels
    val.inputItem[3].models = val.deviceAllModels
    val.inputItem.splice(4, 1)
    val.formRule.model.devIds = val.deviceAllModels
  } else if (name === val.const.person) {
    val.inputItem[4].option = val.analystDefine
    val.inputItem[1].models = []
    val.inputItem[2].models = []
    val.inputItem[4].models = val.analystDefineModels
    val.inputItem.splice(3, 1)
    val.formRule.model[personIds] = val.analystDefineModels
  } else {
    val.inputItem[1].option = []
    val.inputItem[2].option = []
    val.inputItem.splice(2, 3)
  }
}
/**
 * 查验统计关区、口岸、设备
 */
Vue.prototype.$inspectchangeGroup = (val) => {
  let type = val.inputItem[0].models
  val.inputItem[2].option = []
  let selectArr = val.inputItem[1].models
  let nextAll = val.portAll
  let modelsArr = val.inputItem[2].models
  let tempArr = []
  let personArr = []
  if (type !== '' && type !== val.const.cus && type !== val.const.person) {
    for (let i in selectArr) {
      for (let next in nextAll) {
        if (selectArr[i] === nextAll[next].pid) {
          val.inputItem[2].option.push(nextAll[next])
          if (modelsArr.indexOf(nextAll[next].value) !== -1) {
            tempArr.push(nextAll[next].value)
          }
        }
      }
    }
    val.inputItem[2].models = tempArr
    vm.$inspectchangePort(val)
  } else if (val.inputItem[0].models === val.const.person) {
    for (let i in selectArr) {
      for (let next in nextAll) {
        if (nextAll[next]['pid'] === selectArr[i] && val.inputItem[2].option.indexOf(nextAll[next]) === -1) {
          val.inputItem[2].option.push(nextAll[next])
          tempArr.push(nextAll[next].value)
        }
      }
    }
    val.inputItem[2].models = tempArr
    vm.$inspectchangePort(val)
  }
}
/**
 * 查验统计关区、口岸、设备
 */
Vue.prototype.$inspectchangePort = (val) => {
  let selectPortArr = val.inputItem[2].models
  val.inputItem[3].option = []
  if (val.inputItem[0].models === val.const.dev) {
    let devAll = val.deviceAll
    let devModelsArr = val.inputItem[3].models
    let devTempArr = []
    for (var i in selectPortArr) {
      for (var dev in devAll) {
        if (selectPortArr[i] === devAll[dev].pid) {
          val.inputItem[3].option.push(devAll[dev])
          if (devModelsArr.indexOf(devAll[dev].value) !== -1) {
            devTempArr.push(devAll[dev].value)
          }
        }
      }
    }
    val.inputItem[3].models = devTempArr
  } else if (val.inputItem[0].models === val.const.person) {
    let personArr = []
    let personAll = val.personAll
    let personOption = val.inputItem[3].option
    let selectGroup = val.inputItem[1].models
    for (let person in personAll) {
      if (selectPortArr.indexOf(personAll[person].pid) !== -1) {
        personOption.push(personAll[person])
        personArr.push(personAll[person].value)
      }
      if (selectGroup.indexOf(personAll[person].pid) !== -1) {
        personOption.push(personAll[person])
        personArr.push(personAll[person].value)
      }
    }
    val.inputItem[3].models = personArr
  }
}
/**
 * 监管统计构造groupItems参数
 */
Vue.prototype.$getGroupItems = (val, data) => {
  let groupItems = []
  let dataAll = []
  let dataSelect = []
  if (val.groupType === data.const.port && val.portIds.length > 0) {
    dataAll = data.portAll
    dataSelect = val.portIds
  } else if (val.groupType === data.const.cus && val.customIds.length > 0) {
    dataAll = data.groupAll
    dataSelect = val.customIds
  } else if (val.groupType === data.const.dev && val.devIds.length > 0) {
    dataAll = data.deviceAll
    dataSelect = val.devIds
  } else if (data.const.person != null && val.groupType === data.const.person) {
    if (data.const.person === 'analyst' && (val.analystIds.length > 0)) {
      dataAll = data.personAll
      dataSelect = val.analystIds
    }
    if (data.const.person === 'manual' && (val.manualPeopleIds.length > 0)) {
      dataAll = data.personAll
      dataSelect = val.manualPeopleIds
    }
  }
  if (dataSelect.length > 0) {
    dataAll.forEach(e => {
      if (dataSelect.indexOf(e.value) > -1) {
        let a = "{name:'" + e.label + "',id:'" + e.value + "'}"
        groupItems.push(a)
      }
    })
  }
  if (groupItems.length > 0) {
    groupItems = '[' + groupItems.join(',') + ']'
  }
  return groupItems
}
/**
 * 统计切换按年、按月、按日
 */
Vue.prototype.$StatisTabClick = (inputItem, activeName, val) => {
  if (!inputItem) {
    return
  }
  let len = inputItem.length
  if (len < 2) {
    return
  }
  let now = new Date().getTime()
  if (activeName === 'day') {
    inputItem[len - 2].type = 'date'
    inputItem[len - 1].type = 'date'
    inputItem[len - 2].format = vm.$t('vicenter.common.dayFormat')
    inputItem[len - 1].format = vm.$t('vicenter.common.dayFormat')
  } else if (activeName === 'month') {
    inputItem[len - 2].type = 'month'
    inputItem[len - 1].type = 'month'
    inputItem[len - 2].format = vm.$t('vicenter.common.monthFormat')
    inputItem[len - 1].format = vm.$t('vicenter.common.monthFormat')
  } else if (activeName === 'year') {
    inputItem[len - 2].type = 'year'
    inputItem[len - 1].type = 'year'
    inputItem[len - 2].format = vm.$t('vicenter.common.yearFormat')
    inputItem[len - 1].format = vm.$t('vicenter.common.yearFormat')
  }
  // val.panelTitle.statisTitle.title = vm.$t(val.$route.name) + '（' + vm.$t('vicenter.common.' + activeName) + '）'
  inputItem[len - 2].models = now
  inputItem[len - 1].models = now
}
/**
 * 统计切换关区、口岸、设备
 */
Vue.prototype.$typeChange = (val) => {
  // 切换查询条件
  var name = val.inputItem[0].models
  val.inputItem = []
  val.inputItemDefault.forEach((item) => {
    val.inputItem.push(item)
  })
  val.inputItem[1].models = []
  val.inputItem[2].models = []
  val.inputItem[3].models = []
  val.inputItem[1].option = val.groupAll
  if (name === 'cus') {
    val.inputItem.splice(2, 2)
    val.inputItem[1].models = val.groupAllModels
    val.formRule.model.customIds = val.groupAllModels
  } else if (name === 'port') {
    val.inputItem[2].option = val.portAll
    val.inputItem[1].models = val.groupAllModels
    val.inputItem[2].models = val.portAllModels
    val.inputItem.splice(3, 1)
    val.formRule.model.portIds = val.portAllModels
  } else if (name === 'dev') {
    val.inputItem[2].option = val.portAll
    val.inputItem[3].option = val.deviceAll
    val.inputItem[1].models = val.groupAllModels
    val.inputItem[2].models = val.portAllModels
    val.inputItem[3].models = val.deviceAllModels
    val.formRule.model.devIds = val.deviceAllModels
  } else {
    val.inputItem[1].option = []
    val.inputItem[2].option = []
    val.inputItem.splice(2, 2)
  }
}
/**
 * 监管统计关区、口岸、设备
 */
Vue.prototype.$getSelectData = (data, val) => {
  // 关区、口岸、设备
  data.forEach((item) => {
    let pid = 0
    if (item.pid) {
      pid = item.pid
    }
    let obj = {
      label: item.name,
      code: item.code,
      pid: pid,
      value: item.id
    }
    if (item.orgType === null && item.type === 'org') {
      // 海关总署
    } else if (item.orgType === 'customs') {
      val.groupAll.push(obj)
      val.groupAllModels.push(obj.value)
    } else if (item.orgType === 'port') {
      val.portAll.push(obj)
      val.portAllModels.push(obj.value)
    } else if (item.type === 'device') {
      val.deviceAll.push(obj)
      val.deviceAllModels.push(obj.value)
    }
    if (item.children && item.children.length > 0) {
      vm.$getSelectData(item.children, val)
    }
  })
}
/**
 * 监管统计关区、口岸、设备
 */
Vue.prototype.$changeGroup = (val) => {
  let type = val.inputItem[0].models
  if (type === val.const.port || type === val.const.dev) {
    val.inputItem[2].option = []
    let selectArr = val.inputItem[1].models
    let nextAll = val.portAll
    let modelsArr = val.inputItem[2].models
    let tempArr = []
    for (var i in selectArr) {
      for (var next in nextAll) {
        if (selectArr[i] === nextAll[next].pid) {
          val.inputItem[2].option.push(nextAll[next])
          if (modelsArr.indexOf(nextAll[next].value) !== -1) {
            tempArr.push(nextAll[next].value)
          }
        }
      }
    }
    val.inputItem[2].models = tempArr
    vm.$changePort(val)
  }
}
/**
 * 监管统计关区、口岸、设备
 */
Vue.prototype.$changePort = (val) => {
  if (val.inputItem[0].models === val.const.dev) {
    val.inputItem[3].option = []
    let selectPortArr = val.inputItem[2].models
    let devAll = val.deviceAll
    let devModelsArr = val.inputItem[3].models
    let devTempArr = []
    for (var i in selectPortArr) {
      for (var dev in devAll) {
        if (selectPortArr[i] === devAll[dev].pid) {
          val.inputItem[3].option.push(devAll[dev])
          if (devModelsArr.indexOf(devAll[dev].value) !== -1) {
            devTempArr.push(devAll[dev].value)
          }
        }
      }
    }
    val.inputItem[3].models = devTempArr
  }
}
/**
 * 点击hscode树节点获取点击的节点值
 * @param {*} nodeObj
 * @param {*} checkedObj
 */
Vue.prototype.$hscodeCheckChange = (nodeObj, checkedObj) => {
  let checkedName = []
  let checkedId = []
  let checkedCode = []
  checkedObj.checkedNodes.forEach(e => {
    if (checkedId.indexOf(e.id) === -1 && !e.children) {
      checkedName.push(`(${e.code})${e.name}`)
      checkedId.push(e.id)
      checkedCode.push(e.code)
    }
  })
  let checkedVal = {}
  checkedVal.name = checkedName.join(',')
  checkedVal.ids = checkedId.join(',')
  checkedVal.codes = checkedCode.join(',')
  return checkedVal
}
Vue.prototype.$json2treeData = (jsonData, idStr, pidStr) => {
  let treeData = []
  let hash = {}
  let id = idStr
  let pid = pidStr
  let children = 'children'
  let len = jsonData.length
  for (let i = 0; i < len; i++) {
    hash[jsonData[i][id]] = jsonData[i]
  }
  for (let j = 0; j < len; j++) {
    let aVal = jsonData[j]
    let hashVP = hash[aVal[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(aVal)
    } else {
      treeData.push(aVal)
    }
  }
  return treeData
}
/**
 * 点击树节点获取点击的节点值
 * @param {*} nodeObj
 * @param {*} checkedObj
 */
Vue.prototype.$checkTreeChange = (nodeObj, checkedObj) => {
  let checkedName = []
  let checkedId = []
  let checkedCode = []
  checkedObj.checkedNodes.forEach(e => {
    if (checkedId.indexOf(e.id) === -1) {
      checkedName.push(e.name)
      checkedId.push(e.id)
      checkedCode.push(e.code)
    }
  })
  let checkedVal = {}
  checkedVal.name = checkedName.join(',')
  checkedVal.ids = checkedId.join(',')
  checkedVal.codes = checkedCode.join(',')
  return checkedVal
}
/**
 * 验证查验、监管统计选择一个统一的维度，这个维度的值必填
 * @param {*} params // 查询参数
 * @param {*} val // 维度常量
 */
Vue.prototype.$validateMust = (params, val) => {
  let result = true
  let msg = ''
  if (params.groupItems === null || params.groupItems.length === 0) {
    result = false // 验证不通过
  }
  if (result === false) {
    if (params.groupType === val.cus) {
      msg = vm.$t('vicenter.common.checkStatistics.cusSelect')
    } else if (params.groupType === val.port) {
      msg = vm.$t('vicenter.common.checkStatistics.portSelected')
    } else if (params.groupType === val.dev) {
      msg = vm.$t('vicenter.common.checkStatistics.deviceSelected')
    } else if (params.groupType === 'manual') {
      msg = vm.$t('vicenter.common.checkStatistics.manualPeopleSelect')
    } else if (params.groupType === 'analyst') {
      msg = vm.$t('vicenter.common.checkStatistics.imgAnalystSelect')
    }
    vm.$NotifPrompt(msg)
  }
  return result
}
/**
 * 校验上传的文件名是否含有特殊字符
 * @param {*} fileName 文件名
 */
Vue.prototype.$checkFileNameIfSpecialCharacter = (fileName) => {
  var reg = /[`#%^*|{}:;\\[\]<>/?！……*（）——【】‘；：”“’。，、？《》]|\n|\r|\t/
  if (reg.test(fileName)) {
    return true
  }
  return false
}
/**
 * 国际化键数组字符串转换
 * @param {*} val 字符串
 */
Vue.prototype.$toI18nString = (val) => {
  if (!val) {
    return ''
  }
  let res = ''
  val = val.split(',')
  if (val.length === 0) {
    return ''
  }
  val.forEach((e, index) => {
    val[index] = vm.$t(e)
  })
  res = val.join(',')
  return res
}
/**
 * 列表自动刷新
 * @param {*} fuc 刷新方法
 */
Vue.prototype.$refreshList = (fuc) => {
  let id = window.setInterval(fuc, window.config.refreshTime * 1000)
  return id
}
/**
 * 清空自动刷新
 * @param {*} refresh
 */
Vue.prototype.$clearRefresh = (id) => {
  window.clearInterval(id)
}
/**
 * 获取最近一周(今天是最后一天)
 */
Vue.prototype.$get7day = () => {
  var arr = []
  var now = new Date().getTime()
  var oneDayTime = 60 * 60 * 24 * 1000
  for (var i = 6; i >= 0; i--) {
    var dd = new Date(now - i * oneDayTime).getDate()
    var MM = new Date(now - i * oneDayTime).getMonth() + 1
    arr.push(MM + '.' + dd)
  }
  return arr
}
/**
 * 生成16进制的随机颜色数组
 * @param {*} num 颜色数量
 */
Vue.prototype.$color16 = (num) => {
  var colorArr = []
  var excludeColorArr = ['#000000', '#ffffff']
  if (num > 0) {
    for (var i = 0; i < num; i++) {
      colorArr.push(excludeColor(excludeColorArr))
    }
  }
  return colorArr
}
function excludeColor (arr) {
  var colorStr = ''
  var r = Math.floor(Math.random() * 256)
  var g = Math.floor(Math.random() * 256)
  var b = Math.floor(Math.random() * 256)
  var color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
  if (arr.indexOf(color) !== -1) {
    excludeColor(arr)
  } else {
    colorStr = color
  }
  return colorStr
}
/**
 *  修改导出excel的total、average列
 * @param {*} val this对象
 */
Vue.prototype.$setExportExcel = (val) => {
  let length = val.tableData.data.length
  let dataArray = JSON.parse(JSON.stringify(val.tableData.data))
  val.exportFields.forEach((e, index) => {
    dataArray[length - 1][val.exportFields[index + 1]] = val.tableData.data[length - 1][e]
    dataArray[length - 2][val.exportFields[index + 1]] = val.tableData.data[length - 2][e]
  })
  dataArray[length - 1].index = ''
  dataArray[length - 2].index = ''
  let filelds = JSON.parse(JSON.stringify(val.exportFields))
  let headers = JSON.parse(JSON.stringify(val.exportTHeader))
  filelds.splice(0, 1)
  headers.splice(0, 1)
  let res = {
    tableData: dataArray,
    filelds: filelds,
    headers: headers
  }
  return res
}
Vue.prototype.$exportLog = (val) => {
  commonAjax.exportlog(val)
}

// 打印信息处理（监管、查验子系统）
Vue.prototype.$getPrintInfo = function (that, data, type) {
  if (!data || !that.printTable) {
    return
  }
  that.printTable.infoData.forEach(item => {
    if (item.infoType === type && item.type === 'content') {
      item.data.forEach(e => {
        if (e.type === 'text') {
          e.value = data[e.ruleProp]
        } else if (e.type === 'dic') {
          if (e.ruleProp === 'contrabandLocation') {
            if (data[e.ruleProp] && data[e.ruleProp].length > 0) {
              let allLocation = data[e.ruleProp].split(',')
              let arr = []
              allLocation.forEach(l => {
                arr.push(this.$t(l))
              })
              e.value = arr.join(', ')
            }
          } else {
            e.value = data[e.ruleProp] ? this.$t(data[e.ruleProp]) : ''
          }
        } else if (e.type === 'time') {
          e.value = data[e.ruleProp] ? this.$options.filters['formatDate'](data[e.ruleProp]) : ''
        } else if (e.type === 'timeRange') {
          let beginTime = data['beginTime'] ? this.$options.filters['formatDate'](data['beginTime']) : ''
          let endTime = data['endTime'] ? this.$options.filters['formatDate'](data['endTime']) : ''
          if (beginTime || endTime) {
            e.value = beginTime + ' ~ ' + endTime
          } else {
            e.value = ''
          }
        }
      })
    }
  })
}

// 打印信息处理（报表子系统）
Vue.prototype.$getPrintReportInfo = function (that, num) {
  // 统计详情
  that.printTable.infoData[num].data = that.tableGroup.map(item => {
    return {
      type: 'label',
      value: item.label,
      ruleProp: item.model || 'index'
    }
  })
  if (that.tableData.data && that.tableData.data.length > 0) {
    that.printTable.infoData.splice(num + 1)
    that.tableData.data.forEach((item, index) => {
      let objData = that.printTable.infoData[num].data.map(e => {
        if (e.ruleProp === 'index') {
          return {
            type: 'text',
            value: index + 1,
            ruleProp: e.ruleProp
          }
        } else {
          return {
            type: 'text',
            value: item[e.ruleProp],
            ruleProp: e.ruleProp
          }
        }
      })
      let obj = {
        type: 'content',
        infoType: 'statisticDetailsInfo',
        data: objData
      }
      that.printTable.infoData.push(obj)
    })
  }
}
/**
 * 报表后端导出excel设置参数
 * 参数
 */
Vue.prototype.$reportExportExcel = (data) => {
  const {lang} = vm.$store.state
  data.lang = lang
  let str = ''
  for (let key in data) {
    if (data[key] !== '' && String(data[key]).length > 0 && data[key] !== null && data[key] !== undefined) {
      str += `${key}=${String(data[key])}&`
    }
  }
  str = str.substring(0, parseInt(str.length - 1))
  console.log(str)
  return str
}
/**
 * 后端导出excel
 */
Vue.prototype.$commonExportExcel = (val, flag = true) => {
  let {lang, sysMenu, model, url, allDataNum} = val
  let data = JSON.parse(JSON.stringify(model))
  if (sysMenu) {
    Object.assign(data, {lang: lang, sysMenu: sysMenu})
  } else {
    Object.assign(data, {lang: lang})
  }
  if (allDataNum > vm.$getSystemConfig('maxExportNumber')) {
    vm.$NotifPrompt(vm.$t('vicenter.common.maxExportDataNum', {msg: vm.$getSystemConfig('maxExportNumber')}))
    return
  }
  if (allDataNum === 0) {
    vm.$NotifPrompt(vm.$t('vicenter.common.noExportData'))
    return
  }
  if (flag) {
    let str = ''
    for (let key in data) {
      if (data[key] !== '' && String(data[key]).length > 0 && data[key] !== null && data[key] !== undefined && key !== 'page' && key !== 'size') {
        str += `${key}=${String(data[key])}&`
      }
    }
    str = str.substring(0, parseInt(str.length - 1))
    console.log(url)
    console.log(str)
    commonAjax.exportExcel({str: str, url: url})
  } else {
    axios({ // 用axios发送post请求
      baseURL: window.config.baseUrl,
      method: 'post',
      url: url,
      timeout: 100000,
      data: qs.stringify(data),
      arrayFormat: 'indices',
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-TOKEN': localStorage.getItem('Xcsrftoken'),
        'X-APP-UACCOUNT': sessionStorage.getItem('account')
      },
      withCredentials: true
    }).then((res) => { // 处理返回的文件流
      const blob = new Blob([res.data])
      const fileName = `${vm.$options.filters['formatDate'](new Date().getTime(), 'yyyyMMddHHmmss')}.xlsx`
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    })
  }
}

Vue.prototype.$formatDate = function (value, format) {
  if (value === null || value === '' || value === undefined) {
    return
  }
  var paddNum = function (num) {
    num += ''
    return num.replace(/^(\d)$/, '0$1')
  }
  var date = new Date(parseInt(value))
  var cfg = {
    yyyy: date.getFullYear(),
    yy: date.getFullYear().toString().substring(2),
    M: date.getMonth() + 1,
    MM: paddNum(date.getMonth() + 1),
    d: date.getDate(),
    dd: paddNum(date.getDate()),
    HH: paddNum(date.getHours()),
    mm: paddNum(date.getMinutes()),
    ss: paddNum(date.getSeconds())
  }
  return format.replace(/([a-z])(\1)*/ig, function (m) {
    return cfg[m]
  })
}
Vue.prototype.$trim = (val) => {
  val = val.replace(/(^\s*)|(\s*$)/g, '')
  return val
}
Vue.prototype.$Special = (val) => {
  val = val.replace(/</g, '')
  val = val.replace(/>/g, '')
  val = val.replace(/'/g, '')
  val = val.replace(/"/g, '')
  val = val.replace(/\[/g, '')
  val = val.replace(/]/g, '')
  return val
}
/**
 * 表单校验项
*/
Vue.prototype.$allRules = () => {
  return {
    scanSerialNumber: [ // 任务编号--允许输入字母、数字、下划线、"-"
      { pattern: /^[a-zA-Z0-9_-]*$/, message: vm.$t('vicenter.common.verifyRules.onlyLDUM'), trigger: 'change' }
    ],
    containerNumCsv: [ // 集装箱号（查询项）--允许输入字母和数字
      { pattern: /^[a-zA-Z0-9]*$/, message: vm.$t('vicenter.common.verifyRules.onlyLD'), trigger: 'change' }
    ],
    containerNums: [ // 集装箱号（输入项）--允许输入字母（大写）和数字，前4位字母，后7位数字，共11位
      {
        validator: (rule, value, callback) => {
          if (value) {
            let reg = /^[A-Z]{4}[0-9]{7}$/
            if (!reg.test(value)) {
              callback(new Error(vm.$t('vicenter.common.verifyRules.containerNo')))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  }
}

/**
 * 获取系统参数配置项
 * @param {String} keyName: 配置项
 * @returns {*} 配置值
*/
Vue.prototype.$getSystemConfig = (keyName) => {
  if (!sessionStorage.getItem('systemConfig')) {
    return
  }
  let systemConfig = JSON.parse(sessionStorage.getItem('systemConfig'))
  if (keyName === 'maxExportNumber') {
    // 导出最大数量（条）
    return Number(systemConfig[keyName])
  } else if (keyName === 'aiEnable' || keyName === 'printEnable' || keyName === 'exportEnable') {
    // 智能分析(AI算法)、打印功能、导出功能
    return systemConfig[keyName] === 'true'
  }
}
/**
 * 获取组件类型树
 * @param result {Array} ajax数据
 * @param flag {Boolean} 是否包含子节点，默认包含
 * @returns {Array} 组件类型树数据
*/
Vue.prototype.$getComponentTypeTree = function (result, flag = true) {
  let treeData = []
  if (result && result.length > 0) {
    treeData = result.map(e => {
      let childrenNodes = []
      if (flag && e.componentList && e.componentList.length > 0) {
        childrenNodes = e.componentList.map(c => {
          return {
            pId: e.id, // 组件类型id
            id: c.id, // 组件id
            label: c.componentName, // 组件名称
            desc: c.desc, // 组件描述
            imgUrl: c.imgUrl, // 组件封面图
            shape: c.shape, // 组件图表类型
            url: c.url // 组件实际数据接口地址
          }
        })
      }
      return {
        pId: null,
        id: e.id,
        label: this.$t(e.componentType),
        children: childrenNodes
      }
    })
  }
  return treeData
}
/**
 * 获取模板地图坐标信息和模板所容纳的组件数量
 * @param proportion {String} 模板比例
 * @returns {Object} 组件数量和地图坐标
*/
Vue.prototype.$filterLayoutType = function (proportion) {
  let componentsQty = 0
  let layoutMapPosition = {}
  switch (proportion) {
    case '3:4':
      componentsQty = 8
      layoutMapPosition = {
        x: 1,
        y: 1,
        w: 2,
        h: 2,
        i: 'MAP',
        static: true,
        label: 'Map'
      }
      break
    case '3:5':
      componentsQty = 9
      layoutMapPosition = {
        x: 1,
        y: 1,
        w: 3,
        h: 2,
        i: 'MAP',
        static: true,
        label: 'Map'
      }
      break
    case '4:4':
      componentsQty = 10
      layoutMapPosition = {
        x: 1,
        y: 1,
        w: 2,
        h: 3,
        i: 'MAP',
        static: true,
        label: 'Map'
      }
      break
  }
  return { componentsQty, layoutMapPosition }
}
// training系统新增的公共方法放到下面
/**
 * 查验、监管基本信息初始化数据集装箱信息
 */
Vue.prototype.$initSearchIpt = (oldSearchIpt, newSearchIpt, isDisabled = false) => {
  if (newSearchIpt == null) {
    return
  }
  let arr = Object.getOwnPropertyNames(newSearchIpt)
  if (arr.length > 0) {
    for (let i in oldSearchIpt) {
      // console.log(i, oldSearchIpt[i].ruleProp, newSearchIpt[oldSearchIpt[i].ruleProp])
      oldSearchIpt[i].disabled = isDisabled
      if (newSearchIpt[oldSearchIpt[i].ruleProp] === undefined) continue
      // console.log(oldSearchIpt[i].ruleProp, newSearchIpt[oldSearchIpt[i].ruleProp])
      oldSearchIpt[i].models = newSearchIpt[oldSearchIpt[i].ruleProp]
      if (oldSearchIpt[i].type === 'treeInput' && oldSearchIpt[i].treeIptComName === 'hsCodesTree' && newSearchIpt[oldSearchIpt[i].ruleProp]) {
        // 文本框显示
        oldSearchIpt[i].models = newSearchIpt.hsIds ? newSearchIpt.hsIds.split(',') : []
        // 下拉显示
        let arr = newSearchIpt[oldSearchIpt[i].ruleProp].split(',')
        oldSearchIpt[i].options = arr.map((val, index) => {
          let obj = {
            opsLabel: val,
            opsValue: oldSearchIpt[i].models[index]
          }
          return obj
        })
        // 选中的节点
        oldSearchIpt[i].goodsOption.checkedKeys = newSearchIpt.hsIds ? newSearchIpt.hsIds.split(',') : []
      } else if (oldSearchIpt[i].type === 'datetime' && oldSearchIpt[i].valueFormat === 'timestamp') {
        oldSearchIpt[i].models = new Date(newSearchIpt[oldSearchIpt[i].ruleProp]).getTime()
      } else if (oldSearchIpt[i].type === 'datetime' && oldSearchIpt[i].valueFormat === 'yyyy-MM-dd hh:mm:ss') {
        oldSearchIpt[i].models = formatDate(newSearchIpt[oldSearchIpt[i].ruleProp])
      } else if (oldSearchIpt[i].type === 'selectRemote') {
        oldSearchIpt[i].models = []
      }
    }
    // console.log(oldSearchIpt)
  } else {
    console.log(oldSearchIpt)
    for (let i in oldSearchIpt) {
      oldSearchIpt[i].disabled = isDisabled
    }
  }
}
function formatDate (value) {
  let fmt = 'yyyy-MM-dd HH:mm:ss'
  let date = new Date(parseInt(value))
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  // 遍历这个对象
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      // console.log(`${k}`)
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
/**
 * 考培多选hscode公共方法
 */
Vue.prototype.$trainHsCodeChange = (hscodeItem, hscodeData) => {
  let {selectHscode} = hscodeData
  // this.saveDisabled = false
  console.log('选中的hscode: ', hscodeItem.models)
  if (hscodeItem.models && hscodeItem.models.length > 0) {
    // 存在选中项的情况
    let tmpArr = selectHscode.map(selected => selected.id)
    console.log('option')
    console.log(hscodeItem.option)
    hscodeItem.option.map(e => {
      if (hscodeItem.models.indexOf(e.value) > -1 && tmpArr.indexOf(e.value) === -1) {
        selectHscode.push(
          {
            id: e.value,
            hsCode: e.code,
            name: e.label.substring(e.label.indexOf(')') + 1)
          }
        )
        console.log(selectHscode)
      }
    })
    // 删除某些选中项的情况，需更新selectHscode
    selectHscode = selectHscode.filter(selected => hscodeItem.models.indexOf(selected.id) > -1)
    hscodeData.selectHscode = selectHscode
    // 如果输入框中还有内容，则获取数据；输入框没有内容就只保留下拉选中项
    if (hscodeData.queryTxt) {
      vm.$trainGetRemoteHscode(hscodeData.queryTxt, hscodeItem, hscodeData)
    } else {
      hscodeItem.option = selectHscode.map(selected => {
        return {
          label: `(${selected.hsCode})${selected.name}`,
          value: selected.id,
          code: selected.hsCode
        }
      })
    }
  } else {
    selectHscode = []
    hscodeData.selectHscode = selectHscode
    // 清空选中项的情况：如果输入框中还有内容，则获取数据；输入框没有内容就清空下拉列表
    if (hscodeData.queryTxt) {
      vm.$trainGetRemoteHscode(hscodeData.queryTxt, hscodeItem, hscodeData)
    } else {
      hscodeItem.option = []
    }
  }
  console.log('选中的hscode和hsdesc: ', JSON.stringify(selectHscode))
  return selectHscode
  // this.currentCheckGoods({checkedNodes: [{id: hscodeItem.models}]})
}
Vue.prototype.$trainGetRemoteHscode = (query, hscodeItem, hscodeData) => {
  let {selectHscode} = hscodeData
  hscodeData.queryTxt = query
  if (query !== '') {
    hscodeItem.loading = true
    hscodeAjax.getNodeByCode({hsCode: query}).then(res => {
      console.log('查询的query=' + query, '当前的query=' + hscodeData.queryTxt)
      if (query !== hscodeData.queryTxt) {
        hscodeItem.loading = false
        return
      }
      hscodeItem.option = []
      if (selectHscode.length > 0) {
        // 保留上次搜索中被选择的项
        hscodeItem.option = selectHscode.map(selected => {
          return {
            label: `(${selected.hsCode})${selected.name}`,
            value: selected.id,
            code: selected.hsCode
          }
        })
      }
      if (res.data.flag && res.data.result && res.data.result.length > 0) {
        // 新的查询结果展示在上方
        res.data.result.forEach(item => {
          if (hscodeItem.models.indexOf(item.id) === -1) {
            hscodeItem.option.push({
              label: `(${item.hsCode})${item.hsDesc}`,
              value: item.id,
              code: item.hsCode
            })
          }
        })
      }
      hscodeItem.loading = false
    }).catch(() => {})
  } else if (!query && (!hscodeItem.models || hscodeItem.models.length === 0)) {
    hscodeItem.option = []
    selectHscode = []
  } else if (!query && hscodeItem.models && hscodeItem.models.length > 0) {
    hscodeItem.option = []
    if (selectHscode.length > 0) {
      // 保留上次搜索中被选择的项
      hscodeItem.option = selectHscode.map(selected => {
        return {
          label: `(${selected.hsCode})${selected.name}`,
          value: selected.id,
          code: selected.hsCode
        }
      })
    }
  }
}
/**
 * @param {*} data formItem
 * @param {*} hscodeString 存放hscode的字段名
 */
Vue.prototype.$trainSetHscodeEdit = (data, hscodeString = 'testImgHashCodes') => {
  let option = []
  let {hsIds, hsNames} = data
  let testImgHashCodes = data[hscodeString]
  let selectNode = {
    label: [],
    value: [],
    code: []
  }
  if (hsIds && hsIds !== '') {
    selectNode.code = testImgHashCodes.split(',')
    selectNode.id = hsIds.split(',')
    selectNode.name = hsNames.split(',')
    selectNode.id.forEach((e, index) => {
      let item = {
        label: `(${selectNode.code[index]})${selectNode.name[index]}`,
        value: e,
        code: selectNode.code[index]
      }
      option.push(item)
    })
  }
  return option
}
Vue.prototype.$trainGetSelectHscode = (option) => {
  let selectHscode = []
  option.map(e => {
    selectHscode.push(
      {
        id: e.value,
        hsCode: e.code,
        name: e.label.substring(e.label.indexOf(')') + 1)
      }
    )
  })
  return selectHscode
}
Vue.prototype.$trainHsCodeFocus = (hscodeItem, hscodeData) => {
  hscodeItem.option = []
  hscodeItem.models = []
  if (hscodeData.selectHscode.length > 0) {
    // 保留上次搜索中被选择的项
    hscodeData.selectHscode.forEach(selected => {
      let option = {
        label: `(${selected.hsCode})${selected.name}`,
        value: selected.id,
        code: selected.hsCode
      }
      hscodeItem.option.push(option)
      hscodeItem.models.push(selected.id)
    })
  }
}
/**
 * 文本太长换行显示
 * @param value {string} 文本内容
 * @param maxLen {number} 每行最多maxLen个字符
 * @param maxRowQty {number} 最多展示maxRowQty行，超出显示省略号，默认2行
*/
Vue.prototype.$textFormat = (value, maxLen, maxRowQty = 2) => {
  let newValue = ''
  let charLen = value.length
  if (charLen > maxLen) {
    for (let i = 0; i < maxRowQty; i++) {
      if (value[i * maxLen]) {
        newValue += value.substr(i * maxLen, maxLen) + '\n'
      }
    }
    if (charLen > maxLen * maxRowQty) {
      newValue += '...'
    }
    return newValue
  } else {
    return value
  }
}

/**
 * 判断是否为json字符串
*/
Vue.prototype.$isJsonString = function (str) {
  try {
    if (str && typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {}
  return false
}
/**
 * 图表类目文本太长换行处理
 * @param value {string} 类目文本内容
 * @param maxLen {number} 每行最多maxLen个字符
 * @param maxRowQty {number} 最多展示maxRowQty行，超出显示省略号，默认1行
*/
Vue.prototype.$textFormat = (value, maxLen, maxRowQty = 1) => {
  let newValue = ''
  let charLen = value.length
  if (charLen > maxLen) {
    for (let i = 0; i < maxRowQty; i++) {
      if (value[i * maxLen]) {
        newValue += '\n' + value.substr(i * maxLen, maxLen)
      }
    }
    if (charLen > maxLen * maxRowQty) {
      newValue += '...'
    }
    return newValue
  } else {
    return value
  }
}
/**
 * 清除部分sessionStorage存储的值（有一些需要保留，比如语言设置）
*/
Vue.prototype.$clearSession = () => {
  sessionStorage.removeItem('account')
  sessionStorage.removeItem('userName')
  sessionStorage.removeItem('userId')
  sessionStorage.removeItem('imMessageNum')
  sessionStorage.removeItem('imisLogOut')
  sessionStorage.removeItem('isIMhidden')
  sessionStorage.removeItem('IMUrl')
  sessionStorage.removeItem('isloadIM')
}
