/* eslint-disable */
/*
 * 版权所有 ( c ) 同方威视技术股份有限公司 2018 保留所有权利。
 * 项目：ViCenter-WEB
 * 文件名：viProbeForIns.js
 * 描述：查验子系统 与viProbe交互的页面使用，依赖viProbeUtil.js文件
 */
// 初始化WebSocket连接
// 由于浏览器限制的原因，每个页面可以建立的WebSocket连接有限制，故建议一个页面共用同一个socket连接
import vm from '@/main.js'
import {Notification} from 'element-ui'
import util from '@/lib/viprobe/viProbeUtil'

util.initViProbeWebSocket()
// 传输协议，ViProbe与文件服务器之间的传输协议
var transType = 'https'
// 提交图像分析结果相关文件是否成功，根据调用方法后的返回结果，设置此字段值
var uploadImageAnalysisSuccess = null
// 是否成功激活指定窗口
var activeWindowSuccess = false
// ViProbe中变换后的最终图像的BASE64编码，
// 是一个字符串数组，用逗号分隔，以支持双视角图像，如果是单视角图像则数组的大小为1，否则为双视角图像返回的数组大小为2
var imageInViProbeBase64 = null
var imageInViProbeSuccess = null
var isOriginal = null
// 保存tip图像后的返回
var saveTipResult = {}
saveTipResult.flag = null
saveTipResult.result = {}
var openLocalResult = {}
openLocalResult.result = {}
openLocalResult.flag = null
var errorCode = 0
// 上传本地图像文件是否成功
var uploadLocalImageSuccess = false
// 当调用获取嫌疑标记Base64方法后根据返回结果设设置下面两个字段的值
// 获取嫌疑标记Base64信息成功与否，默认为null，
var getMarkBase64Success = null
// 嫌疑标记信息的BASE64编码
var markBase64 = null
// 当调用获取嫌疑标记Json方法后根据返回结果设设置下面两个字段的值
// 获取嫌疑标记Json信息成功与否，默认为null，
var getMarkJsonSuccess = null
// 当调用计算嫌疑标记比值方法后根据返回结果设设置下面两个字段的值
var shapeRatioByJsonResult = {}
shapeRatioByJsonResult.result = {}
shapeRatioByJsonResult.flag = null
// 嫌疑标记信息的Json编码
var markJson = null
var uploadLocalv2Res = ''
// 上传jpg是否成功
var uploadJpgSuccess = null
var uploadJpgBackResult = ''
window.viprobeReturn = {
  getMarkBase64Success: getMarkBase64Success,
  markBase64: markBase64,
  getMarkJsonSuccess: getMarkJsonSuccess,
  markJson: markJson,
  errorCode: errorCode,
  uploadImageAnalysisSuccess: uploadImageAnalysisSuccess,
  imageInViProbeBase64: imageInViProbeBase64,
  imageInViProbeSuccess: imageInViProbeSuccess,
  isOriginal: isOriginal,
  saveTipResult: saveTipResult,
  openLocalResult: openLocalResult,
  shapeRatioByJsonResult: shapeRatioByJsonResult,
  activeWindowSuccess: activeWindowSuccess,
  uploadLocalImageSuccess: uploadLocalImageSuccess,
  uploadLocalv2Res: uploadLocalv2Res,
	uploadJpgSuccess: uploadJpgSuccess,
	uploadJpgBackResult: uploadJpgBackResult
}
/**
 * upload_jpg,上传给定name名称的图像的jpg原图(未经图像变换处理)，如果带嫌疑图片就包含嫌疑，否则不包含嫌疑
 * @param {*} name 
 * @param {*} path 
 */
function generateUploadJpgCommand(name, serverPath){
	var uploadObj = util.viProbeJsonUtil.generateUploadJpgObj(name,serverPath);
	var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('upload_jpg',uploadObj);
	util.viProbeOperation.sendCommand(uploadCommandObj)
}
/**
 * 上传本地图像调用方法 新版
 * @param name
 *    图像流水号，即任务号
 * @param serverPath
 *    图像路径，到文件夹级别
 * @returns
 */
function uploadLocalImageNew (name, serverPath, trans) {
	var uploadLocalImageObj = {}
	if (name) {
		uploadLocalImageObj.name = name
	}
	if (serverPath) {
		uploadLocalImageObj.server_path = serverPath
	}
	if (trans) {
		uploadLocalImageObj.trans = trans
	} else {
		uploadLocalImageObj.trans = 'https'
	}
	var uploadLocalImageCommandObj = util.viProbeJsonUtil.generateCommandObj('upload_images_v2', uploadLocalImageObj)
	console.log('11111', uploadLocalImageCommandObj)
	util.viProbeOperation.sendCommand(uploadLocalImageCommandObj)
}
/**
/**
 * 打开要编辑扫描图
 * @param {*}
 */
function generateEditTipCommandObj (name, path, imageFiles, isUff, geometry) {
  var ext = ''
  if (isUff) {
    ext = 'tiff'
  } else {
    ext = 'img'
  }
  //传值不匹配时，viprobe自动识别打开的图像类型，此处不能传空值或空串。
  var type = 'auto'
  var trans = transType
  var rep_name = null
  var closable = false
  var imageObj = {}
  imageObj = util.viProbeJsonUtil.generateImageObj(name, path, imageFiles, null, ext, type, trans, rep_name, closable, isUff)
  var param = {}
  param.image = imageObj
  param.geometry = geometry
  var editTip = util.viProbeJsonUtil.generateCommandObj('editTip', param)
  console.debug('generateEditTipCommandObj: ' + JSON.stringify(editTip))
  return editTip
}

/**
 * 打开本地
 * @param {*} name 任务号
 */
function generateOpenLocalCommandObj (name) {
  var param = {}
  param.name = name
  var openLocalCommandObj = util.viProbeJsonUtil.generateCommandObj('open_local', param)
  console.debug('generateOpenLocalCommandObj: ' + JSON.stringify(openLocalCommandObj))
  return openLocalCommandObj
}

/**
 * 生成打开图像的Command
 * @param name
 *    图像流水号，即任务号
 * @param path
 *    图像路径，到文件夹级别
 * @param imageFiles
 *    图像数组，文件数组，其中sign和md5根据项目可选
 *    [{"name":"XXXXX.img","sign":"xxxx","md5":"md5code"},…,{ "name":"XXXX.img","sign":"xxxx","md5":"md5code"}]
 * @param openMode
 * @param isOpen 用于判断 util.viProbeJsonUtil.generateCommandObj 的第一个参数 为 open (true) 还是 open_v2 (false)
 * @returns
 */
function generateOpenImageCommandObj (name, path, imageFiles, openMode, isUff, closable, fileNameExt, isOpen) {
  var ext = ''
  // if (isUff) {
  // 	ext = 'uff';
  // } else {
  // 	ext = 'img';
  // }
  ext = fileNameExt.toLowerCase()
  //传值不匹配时，viprobe自动识别打开的图像类型，此处不能传空值或空串。
  var type = 'auto'
  var trans = transType
  // var rep_name = null
  var closable = ''
  if (closable) {
    closable = closable
  } else {
    closable = true // 默认能关闭
  }
  var imageObj = {}
  imageObj = util.viProbeJsonUtil.generateImageObj(name, path, imageFiles, null, ext, type, trans, null, closable, isUff)
  var param = {}
  isOpen && (param = {images:[]})
  param[isOpen ? 'images' : 'image'] = []
  if (openMode) {
    param.mode = openMode
  } else {
    param.mode = 'default'
  }
  isOpen && delete imageObj.uff // 解决uff打不开的问题，如果是 open 则删除 uff
  isOpen ? param.images.push(imageObj) : param.image = imageObj
  var openCommandObj = util.viProbeJsonUtil.generateCommandObj(isOpen ? 'open' : 'open_v2', param)
  console.debug('generateOpenImageJsonObj: ' + JSON.stringify(openCommandObj))
  return openCommandObj
}

/**
 * 激活指定窗口命令
 * @param name
 *    图像名称
 * @returns
 */
function defaultWindowCommandObj (name) {
  var param = {}
  param.name = name
  var defaultWindowCommandObj = util.viProbeJsonUtil.generateCommandObj('active', param)
  return defaultWindowCommandObj
}

/**
 * 在图像上显示嫌疑标记命令，嫌疑标记不可编辑
 * @param name
 *    图像名称
 * @param markFilePath
 *    嫌疑标记文件的绝对路径
 * @returns
 */
function generateShowHistoryMarkCommandObj (name, markFilePath, editable, deleteable) {
  var type = 'jsonstr'
  var content = markFilePath
  var show = true
  var color = null
  if (editable) { //可不可编辑
    editable = editable
  } else {
    editable = false
  }
  if (deleteable) { //可不可删除
    deleteable = deleteable
  } else {
    deleteable = false
  }
  var markObj = util.viProbeJsonUtil.generateMarkObj(type, content, show, color, editable, deleteable)
  var markArr = new Array()
  markArr.push(markObj)
  var param = {}
  param.name = name
  param.marks = markArr
  var showMarkCommandObj = util.viProbeJsonUtil.generateCommandObj('add_mark', param)
  return showMarkCommandObj
}

/**
 * 生成上传图像分析信息的命令，包含嫌疑标记文件、历史操作步骤、带嫌疑标记的jpg文件
 * @param name
 *    图像名称
 * @param path
 *    图像要上传到的文件夹路径
 * @param isMarkUpload
 *    嫌疑标记是否上传，true/false
 * @param isStepUpload
 *    操作步骤是否上传，true/false
 * @param isMarkJpgUpload
 *    带嫌疑标记的jpg图像是否上传，true/false
 * @returns
 */
function generateUploadAnalysisInfoCommand (name, path, isMarkUpload, isStepUpload, isMarkJpgUpload) {
  var trans = transType
  var markColor = null
  var uploadObj = util.viProbeJsonUtil.generateUploadObj(trans
    , name, path, markColor, isMarkUpload, isStepUpload, isMarkJpgUpload)
  var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('upload', uploadObj)
  return uploadCommandObj
}

/**
 * 用户在ViProbe中变换的最终图像
 * @param name
 *    图像名称
 *  @param original
 *    是否原图
 *  @param includeMark
 *    是否包含标记
 * @returns
 */
function getImageInViProbeBase64 (name, original, includeMark) {
  isOriginal = original
  var getImageBase64CommandObj = generateGetImageBase64Command(name, original, includeMark)
  util.viProbeOperation.sendCommand(getImageBase64CommandObj)
}

/**
 * 生成获取Viprobe中最终审图结果图像的命令
 * @param name
 *    图像名称
 * @returns
 */
function generateGetImageBase64Command (name, original, includeMark) {
  var original = original
  var lineWidth = null
  var viewport = false
  var includeMark = includeMark
  var includeRuler = true
  var getImageBase64Obj = util.viProbeJsonUtil.generateGetImageBase64Obj(name,
    original, lineWidth, viewport, includeMark, includeRuler)
  var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('get_image_as_base64', getImageBase64Obj)
  return uploadCommandObj
}

/**
 * 打开本地图像
 * @returns
 */
function openLocalImageInViProbe (name) {
  //仅支持同时打开 一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
  //图像打开方式，不允许用户通过ViProbe手动关闭，且仅打开图像即可
  var openCommandObj = generateOpenLocalCommandObj(name)
  util.viProbeOperation.sendCommand(openCommandObj)
}

/**
 * 打开（一个扫描任务的）扫描图像
 * @returns
 */
function openImageInViProbe (name, path, imageFiles, isUff, closable) {
  //仅支持同时打开 一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
  //图像打开方式，不允许用户通过ViProbe手动关闭，且仅打开图像即可
  var openCommandObj = generateOpenImageCommandObj(name, path, imageFiles, null, isUff, closable)
  util.viProbeOperation.sendCommand(openCommandObj)
}

/**
 * 打开（一个手检或历史任务的）扫描图像
 * 仅支持同时打开一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
 * 图像打开方式，不允许用户通过ViProbe手动关闭
 * 打开图像时，需要同时以只读的方式打开嫌疑标记信息、历史操作步骤等。
 * @returns
 */
function openImageAndAnalysisInfoInViProbe (name, path, imageFiles, markFilePath, editable, deleteable, stepFilePath, isUff, closable, fileNameExt, isOpen) {
  console.log(imageFiles)
  /*
  * 数组中的对象 只有两种情况
  * 1. 只有name属性
  *    过滤name的结尾是否为指定类型
  * 2. energe_type view_index 和一个 特殊字段
  *    过滤 特殊字段的name属性的结尾是否为特殊字段
  * */
  let whiteList = ['img', 'uff', 'tif', 'tiff', 'png', 'PNG', 'urf']
  let _imageFiles = []
  if (Object.keys(imageFiles[0]).length > 1) { // 是否只有name
    imageFiles.forEach(e => {
      // 获取特殊的key
      let _sKey = Object.keys(e).filter(k => {
        return ['energe_type', 'view_index'].indexOf(k) === -1
      })[0]
      console.log(_sKey)
      let imgext = e[_sKey].name.substr(e[_sKey].name.lastIndexOf('.') + 1)
      imgext = imgext.toLowerCase()
      console.log(whiteList.indexOf(imgext) !== -1)
      if (whiteList.indexOf(imgext) !== -1) {
        _imageFiles.push(e)
      }
    })
  } else {
    _imageFiles = imageFiles.filter(e => { 
      let imgext = e.name.substr(e.name.lastIndexOf('.') + 1)
      imgext = imgext.toLowerCase()
      console.log(imgext)
      return whiteList.indexOf(imgext) !== -1
    })
  }
  console.log(_imageFiles)
  //打开图像
  var openCommandObj = generateOpenImageCommandObj(name, path, _imageFiles, null, isUff, closable, fileNameExt, isOpen)
  var flag = util.viProbeOperation.sendCommand(openCommandObj)
  if (flag) {
    return
  }
  //加载嫌疑标记文件
  if (markFilePath) {
    var showMarkCommandObj = generateShowHistoryMarkCommandObj(name, markFilePath, editable, deleteable)
    util.viProbeOperation.sendCommand(showMarkCommandObj)
  }
  //加载操作步骤文件
  if (stepFilePath) {
    var loadStepCommandObj = generateLoadStepCommandObj(name, stepFilePath)
    util.viProbeOperation.sendCommand(loadStepCommandObj)
  }
  // 指定默认激活窗口
  var activeDefaultWindow = defaultWindowCommandObj(name)
  util.viProbeOperation.sendCommand(activeDefaultWindow)

}

/**
 * 关闭图像
 * @param name
 *    图像名称
 * @returns
 */
function closeImageInViProbe (name) {
  var param = {'name': name}
  var closeCommandObj = util.viProbeJsonUtil.generateCommandObj('close', param)
  util.viProbeOperation.sendCommand(closeCommandObj)
}

/**
 * 关闭ViProbe中的所有图像
 * @returns
 */
function closeAllImageInViProbe () {
  var param = {}
  var closeAllCommandObj = util.viProbeJsonUtil.generateCommandObj('close_all', param)
  util.viProbeOperation.sendCommand(closeAllCommandObj)
}

/**
 * 获取用户在viprobe上画的嫌疑标记信息的BASE64编码
 * @param name
 *    图像名称
 * @returns
 */
function getMarkAsBase64 (name) {
  var param = {'name': name, 'visible': true}
  var getMarkBase64CommandObj = util.viProbeJsonUtil.generateCommandObj('get_mark_as_base64', param)
  util.viProbeOperation.sendCommand(getMarkBase64CommandObj)
}

/**
 * 上传本地图像调用方法
 * @param name
 *    图像流水号，即任务号
 * @param path
 *    图像路径，到文件夹级别
 * @param imageFiles
 *    图像数组，文件数组，其中sign和md5根据项目可选
 *    [{"name":"XXXXX.img","sign":"xxxx","md5":"md5code"},…,{ "name":"XXXX.img","sign":"xxxx","md5":"md5code"}]
 * @param openMode
 * @returns
 */
function uploadLocalImage (name, trans, serverPath, imageFiles) {
  var uploadLocalImageObj = {}
  if (name) {
    uploadLocalImageObj.name = name
  }
  if (trans) {
    uploadLocalImageObj.trans = trans
  }
  if (serverPath) {
    uploadLocalImageObj.server_path = serverPath
  }
  if (imageFiles) {
    uploadLocalImageObj.image_files = imageFiles
  }
  var uploadLocalImageCommandObj = util.viProbeJsonUtil.generateCommandObj('upload_images', uploadLocalImageObj)
  util.viProbeOperation.sendCommand(uploadLocalImageCommandObj)
}

/**
 * 获取嫌疑标记（Json）
 * @param name
 *    图像流水号，即任务号
 * @param visible
 *    获取显示，false获取隐藏
 * @returns
 */
function getMarkAsJson (name, visible) {
  var getMarkAsJsonObj = {}
  if (name) {
    getMarkAsJsonObj.name = name
  }
  if (visible) {
    getMarkAsJsonObj.visible = visible
  }
  var getMarkAsJsonCommandObj = util.viProbeJsonUtil.generateCommandObj('get_mark_as_json', getMarkAsJsonObj)
  util.viProbeOperation.sendCommand(getMarkAsJsonCommandObj)
}

/**
 * 计算嫌疑标记比值
 * 根据传入占本地
 * @param name
 *    图像名称
 * @returns
 */
function getShapeRatioByJson (name, markFilePath) {
  var ShapeRatioByJson = generateShapeRatioByJsonCommandObj(name, markFilePath)
  util.viProbeOperation.sendCommand(ShapeRatioByJson)
}

/**
 * 在图像上显示嫌疑标记命令，嫌疑标记不可编辑
 * @param name
 *    图像名称
 * @param markFilePath
 *    嫌疑标记文件的绝对路径
 * @returns
 */
function generateShapeRatioByJsonCommandObj (name, markFilePath) {
  /*
  * 2020 03-20
  * 获取嫌疑比例回调
  * 有时候返回的是本地文件路径
  * */
  // var type = transType;
  var type = 'jsonstr'
  var content = markFilePath
  var show = true
  var color = null
  var editable = false	//不可编辑
  var deleteable = false	//不可删除
  var markObj = util.viProbeJsonUtil.generateMarkObj(type, content, show, color, editable, deleteable)
  var markArr = new Array()
  markArr.push(markObj)
  var param = {}
  param.name = name
  param.marks = markArr
  var showMarkCommandObj = util.viProbeJsonUtil.generateCommandObj('get_shape_ratio_by_json', param)
  return showMarkCommandObj
}

/**
 * 重写调用打开本地图像后的onMessage方法
 */
util.viProbeWsCallback.open_local = function (jsonObj) {
  console.debug('OnMessage call .open_local #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.result && jsonObj.error === 0) {
    openLocalResult.flag = true
    openLocalResult.result = jsonObj.result
  } else {
    openLocalResult.flag = false
    errorCode = jsonObj.error
  }
  window.viprobeReturn.openLocalResult = openLocalResult
  window.viprobeReturn.errorCode = errorCode
}

//根据需要重写viProbeWsCallback对象中的某些方法，覆盖viProbeUtil.js中的方法
//即各动作操作成功后需要的操作，可以写在相应的回调函数中
/**
 * 重写调用打开图像后的onMessage方法
 */
util.viProbeWsCallback.open = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  window.viprobeReturn.errorCode = jsonObj.error
  switch (jsonObj.error) {
    case 0:
      //   openHistoryImg = true;
      break
    case 2:
      vm.$NotifError(vm.$t('vicenter.common.viprobe.memoryNotEnough'))
      break
    case 4096:
      vm.$NotifError(vm.$t('vicenter.common.viprobe.fileNotExist'))
      break
    case 4106:
      vm.$NotifError(vm.$t('vicenter.common.viprobe.openFileOverLimit'))
      break
    case 12288:
      vm.$NotifError(vm.$t('vicenter.common.viprobe.downLoadFailed'))
      break
    case 32768:
      vm.$NotifError(vm.$t('vicenter.common.viprobe.sysBusy'))
      break
    case 24578:
      vm.$NotifError(vm.$t('vicenter.common.viprobe.notCutImg'))
      break
  }
}

/**
 * 重写调用上传ViProbe中审图信息后的onMessage方法
 */
util.viProbeWsCallback.upload = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.result && jsonObj.error === 0) {
    uploadImageAnalysisSuccess = true
  } else {
    uploadImageAnalysisSuccess = false
    errorCode = jsonObj.error
  }
  window.viprobeReturn.uploadImageAnalysisSuccess = uploadImageAnalysisSuccess
  window.viprobeReturn.errorCode = errorCode
}

/**
 * 重写激活指定窗口的onMessage方法
 */
util.viProbeWsCallback.active = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.error === 0) {
    activeWindowSuccess = true
  } else {
    activeWindowSuccess = false
    errorCode = jsonObj.error
  }
}
/**
 * 重写调用获取图像接口后的onMessage方法
 */
util.viProbeWsCallback.get_image_as_base64 = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.result && jsonObj.error === 0) {
    imageInViProbeSuccess = true
    imageInViProbeBase64 = jsonObj.result
  } else {
    imageInViProbeSuccess = false
    imageInViProbeBase64 = []
    errorCode = jsonObj.error
  }
  window.viprobeReturn.imageInViProbeSuccess = imageInViProbeSuccess
  window.viprobeReturn.imageInViProbeBase64 = imageInViProbeBase64
  window.viprobeReturn.isOriginal = isOriginal
  window.viprobeReturn.errorCode = errorCode
}
/**
 * 重写调用上传本地图像文件后的onMessage方法
 */
util.viProbeWsCallback.upload_images = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.result && jsonObj.error === 0) {
    uploadLocalImageSuccess = true
  } else {
    uploadLocalImageSuccess = false
    errorCode = jsonObj.error
  }
  window.viprobeReturn.uploadLocalImageSuccess = uploadLocalImageSuccess
  window.viprobeReturn.errorCode = errorCode
}

/**
 * 重写调用获取嫌疑标记后的onMessage方法
 */
util.viProbeWsCallback.get_mark_as_base64 = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.error === 0) {
    getMarkBase64Success = true
    markBase64 = jsonObj.result
  } else {
    getMarkBase64Success = false
    markBase64 = null
    errorCode = jsonObj.error
  }
  window.viprobeReturn.getMarkBase64Success = getMarkBase64Success
  window.viprobeReturn.markBase64 = markBase64
  window.viprobeReturn.errorCode = errorCode
}

/**
 * 重写调用获取嫌疑标记Json后的onMessage方法
 */
util.viProbeWsCallback.get_mark_as_json = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.error === 0) {
    getMarkJsonSuccess = true
    markJson = jsonObj.result
  } else {
    getMarkJsonSuccess = false
    markAsJson = []
    errorCode = jsonObj.error
  }
  window.viprobeReturn.getMarkJsonSuccess = getMarkJsonSuccess
  window.viprobeReturn.markJson = markJson
  window.viprobeReturn.errorCode = errorCode
}

/**
 * 重写调用计算嫌疑标记比值后的onMessage方法
 */
util.viProbeWsCallback.get_shape_ratio_by_json = function (jsonObj) {
  console.debug('OnMessage call .open_local #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.result && jsonObj.error === 0) {
    shapeRatioByJsonResult.flag = true
    shapeRatioByJsonResult.result = jsonObj.result
  } else {
    shapeRatioByJsonResult.flag = false
    errorCode = jsonObj.error
  }
  window.viprobeReturn.openLocalResult = shapeRatioByJsonResult
  window.viprobeReturn.errorCode = errorCode
}
/**
 * 重写调用上传本地图像文件新版后的onMessage方法
 */
util.viProbeWsCallback.upload_images_v2 = function (jsonObj) {
	console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
	if (jsonObj.result && jsonObj.error === 0) {
	  uploadLocalImageSuccess = true
	} else {
	  uploadLocalImageSuccess = false
	  errorCode = jsonObj.error
	}
	window.viprobeReturn.uploadLocalImageSuccess = uploadLocalImageSuccess
	window.viprobeReturn.errorCode = errorCode
	window.viprobeReturn.uploadLocalv2Res = jsonObj.result
}

util.viProbeWsCallback.upload_jpg = function (jsonObj) {
  console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
  if (jsonObj.result && jsonObj.error === 0) {
    uploadJpgSuccess = true
    uploadJpgBackResult = jsonObj.result
  } else {
    uploadJpgSuccess = false
    errorCode = jsonObj.error
  }
  window.viprobeReturn.uploadJpgSuccess = uploadJpgSuccess
  window.viprobeReturn.uploadJpgBackResult = uploadJpgBackResult
  window.viprobeReturn.errorCode = errorCode
  }

var viProbe = {
  // editTipInViProbe: editTipInViProbe,
  // saveTipInViProbe: saveTipInViProbe,
  openLocalImageInViProbe: openLocalImageInViProbe,
  openImageAndAnalysisInfoInViProbe: openImageAndAnalysisInfoInViProbe,
  closeImageInViProbe: closeImageInViProbe,
  closeAllImageInViProbe: closeAllImageInViProbe,
  openImageInViProbe: openImageInViProbe,
  getMarkAsBase64: getMarkAsBase64,
  // uploadImageAnalysisInfo: uploadImageAnalysisInfo,
  getMarkAsJson: getMarkAsJson,
  getImageInViProbeBase64: getImageInViProbeBase64,
  getShapeRatioByJson: getShapeRatioByJson,
  uploadLocalImage: uploadLocalImage,
  uploadLocalImageNew: uploadLocalImageNew,
  generateUploadJpgCommand: generateUploadJpgCommand
}
export default viProbe
