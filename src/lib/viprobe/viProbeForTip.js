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
import { Notification } from 'element-ui'
import util from  '@/lib/viprobe/viProbeUtil'
util.initViProbeWebSocket()
// 传输协议，ViProbe与文件服务器之间的传输协议
var transType = 'https'
// 当调用获取嫌疑标记方法后根据返回结果设设置下面两个字段的值
// 获取嫌疑标记信息成功与否，默认为null，
var getMarkBase64Success = null
// 嫌疑标记信息的BASE64编码
var markBase64 = null
// 提交图像分析结果相关文件是否成功，根据调用方法后的返回结果，设置此字段值
var uploadImageAnalysisSuccess = null
// 获取用户在ViProbe中变换的最终图像是否成功
var getImageInViProbeBase64Success = null
// 是否成功激活指定窗口
var activeWindowSuccess = false
// ViProbe中变换后的最终图像的BASE64编码，
// 是一个字符串数组，用逗号分隔，以支持双视角图像，如果是单视角图像则数组的大小为1，否则为双视角图像返回的数组大小为2
var imageInViProbeBase64 = null
// 打开文件成功标志位
var openHistoryImg = false
// 保存tip图像后的返回
var saveTipResult = {}
saveTipResult.flag = null
saveTipResult.result = {}
var openLocalResult = {}
openLocalResult.result = {}
openLocalResult.flag = null
var errorCode = 0
window.viprobeReturn = {
	getMarkBase64Success: getMarkBase64Success,
	markBase64: markBase64,
	errorCode: errorCode,
	uploadImageAnalysisSuccess: uploadImageAnalysisSuccess,
	imageInViProbeBase64: imageInViProbeBase64,
	saveTipResult: saveTipResult,
	openLocalResult: openLocalResult,
	activeWindowSuccess: activeWindowSuccess
}
/**
 * 打开要编辑tip图
 * @param {*}
 */
function generateEditTipCommandObj(name, path, imageFiles, isUff, geometry){
	var ext = '';
	if (isUff) {
		ext = 'tiff';
	} else {
		ext = 'img';
	}
	//传值不匹配时，viprobe自动识别打开的图像类型，此处不能传空值或空串。
	var type = 'auto'
	var trans = transType
	var rep_name = null
	var closable = false
	var imageObj = {}
	imageObj = util.viProbeJsonUtil.generateImageObj(name, path, imageFiles, null,ext,type,trans,rep_name,closable,isUff)
	var param = {};
	param.image = imageObj;
	param.geometry = geometry
	var editTip = util.viProbeJsonUtil.generateCommandObj('editTip', param)
	console.debug('generateEditTipCommandObj: ' + JSON.stringify(editTip))
	return editTip;
}
/**
 * 
 * @param {*} name 任务号
 * @param {*} path 路径
 * @param {*} tipOnly 是否首次保存  true首次
 */
function generateSaveTipCommandObj(name, path, tipOnly){
	var param = {}
	param.name = name
	param.path = path
	param.tipOnly = tipOnly	
	var saveTip = util.viProbeJsonUtil.generateCommandObj('saveTip',param)
	console.debug('generateSaveTipCommandObj: ' + JSON.stringify(saveTip))
	return saveTip;
}
/**
 * 打开本地
 * @param {*} name 任务号
 */
function generateOpenLocalCommandObj(name){
	var param = {};
	param.name = name
	var openLocalCommandObj = util.viProbeJsonUtil.generateCommandObj('open_local',param)
	console.debug('generateOpenLocalCommandObj: ' + JSON.stringify(openLocalCommandObj))
	return openLocalCommandObj;
}
/**
 * 生成打开图像的Command
 * @param name
 * 		图像流水号，即任务号
 * @param path
 * 		图像路径，到文件夹级别
 * @param imageFiles
 * 		图像数组，文件数组，其中sign和md5根据项目可选
 * 		[{"name":"XXXXX.img","sign":"xxxx","md5":"md5code"},…,{ "name":"XXXX.img","sign":"xxxx","md5":"md5code"}]
 * @param openMode
 * @returns
 */
function generateOpenImageCommandObj(name,path,imageFiles,openMode,isUff){
	var ext = '';
	if (isUff) {
		ext = 'tiff';
	} else {
		ext = 'img';
	}
	//传值不匹配时，viprobe自动识别打开的图像类型，此处不能传空值或空串。
	var type = 'auto'
	var trans = transType
	var rep_name = null
	var closable = false
	var imageObj = {}
	imageObj = util.viProbeJsonUtil.generateImageObj(name, path, imageFiles, null,ext,type,trans,rep_name,closable,isUff)
	var param = {};
	if(openMode){
		param.mode = openMode;
	}else{
		param.mode = 'default';
	}
	param.image = imageObj;
	var openCommandObj = util.viProbeJsonUtil.generateCommandObj('open_v2',param);
	console.debug('generateOpenImageJsonObj: ' + JSON.stringify(openCommandObj))
	return openCommandObj;
}
/**
 * 激活指定窗口命令
 * @param name
 * 		图像名称
 * @returns
 */
function defaultWindowCommandObj(name){
	var param = {};
	param.name = name;
	var defaultWindowCommandObj = util.viProbeJsonUtil.generateCommandObj('active',param);
	return defaultWindowCommandObj;
}
/**
 * 在图像上显示嫌疑标记命令，嫌疑标记不可编辑
 * @param name
 * 		图像名称
 * @param markFilePath
 * 		嫌疑标记文件的绝对路径
 * @returns
 */
function generateShowHistoryMarkCommandObj(name,markFilePath){
	var type = transType;
	var content = markFilePath;
	// ips现场独立审像若是嫌疑图，content需要传递嫌疑标记内容，type为jsonstr
	if (typeof content === 'string') {
		type = transType
	} else {
		type = 'jsonstr'
	}
	var show = true;
	var color = null;
	var editable = false;	//不可编辑
	var deleteable = false;	//不可删除
	var markObj = util.viProbeJsonUtil.generateMarkObj(type,content,show,color,editable,deleteable);
	var markArr = new Array();
	markArr.push(markObj);
	var param = {};
	param.name = name;
	param.marks = markArr;
	var showMarkCommandObj = util.viProbeJsonUtil.generateCommandObj('add_mark',param);
	return showMarkCommandObj;
}
/**
 * 生成加载历史操作步骤命令
 * @param name
 * 		图像名称
 * @param stepFilePath
 * 		操作步骤文件的绝对路径
 * @returns
 */
function generateLoadStepCommandObj(name, stepFilePath){
	var type = transType;
	var content = stepFilePath;
	//不自动播放历史操作步骤，false
	//20180907由于设置为false时viprobe有bug，此值暂时设计为null，此bug在viprobe的下一版本中修改
	var autoPlay = window.config.viprobeAutoPlay;
	var stepObj = util.viProbeJsonUtil.generateStepObj(type, content, autoPlay);
	var param = {};
	param.name = name;
	param.step = stepObj;
	var loadStepCommandObj = util.viProbeJsonUtil.generateCommandObj('set_history',param);
	return loadStepCommandObj;
}

/**
 * 生成上传图像分析信息的命令，包含嫌疑标记文件、历史操作步骤、带嫌疑标记的jpg文件
 * @param name
 * 		图像名称
 * @param path
 * 		图像要上传到的文件夹路径
 * @param isMarkUpload
 * 		嫌疑标记是否上传，true/false
 * @param isStepUpload
 * 		操作步骤是否上传，true/false
 * @param isMarkJpgUpload
 * 		带嫌疑标记的jpg图像是否上传，true/false
 * @returns
 */
function generateUploadAnalysisInfoCommand(name, path, isMarkUpload,isStepUpload, isMarkJpgUpload){
	var trans = transType;
	var markColor = null;
	var uploadObj = util.viProbeJsonUtil.generateUploadObj(trans
			,name,path,markColor,isMarkUpload,isStepUpload,isMarkJpgUpload);
	var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('upload',uploadObj);
	return uploadCommandObj;
}
/**
 * 生成获取Viprobe中最终审图结果图像的命令
 * @param name
 * 		图像名称
 * @returns
 */
function generateGetImageBase64Command(name){
	var original = false;
	var lineWidth = null;
	var viewport = false;
	var includeMark = true;
	var includeRuler = true;
	var getImageBase64Obj = util.viProbeJsonUtil.generateGetImageBase64Obj(name,
			original,lineWidth,viewport,includeMark,includeRuler);
	var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('get_image_as_base64',getImageBase64Obj);
	return uploadCommandObj;
}
/**
 * 打开要编辑的tip图
 * @param {*} image 对象
 * @param {*} geometry 位置信息
 */
function editTipInViProbe(name, path, imageFiles, isUff, geometry){
	var openCommandObj = generateEditTipCommandObj(name, path, imageFiles, isUff, geometry)
	util.viProbeOperation.sendCommand(openCommandObj);
}

/**
 * 保存tip图
 * @param {*} name 任务号
 * @param {*} path 路径
 * @param {*} tipOnly 是否首次保存  true首次
 * @returns
 */
function saveTipInViProbe(name, path, tipOnly){
	var openCommandObj = generateSaveTipCommandObj(name, path, tipOnly)
	util.viProbeOperation.sendCommand(openCommandObj);
}


/**
 * 打开本地图像
 * @returns
 */
function openLocalImageInViProbe(name){
	//仅支持同时打开 一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
	//图像打开方式，不允许用户通过ViProbe手动关闭，且仅打开图像即可
	var openCommandObj = generateOpenLocalCommandObj(name);
	util.viProbeOperation.sendCommand(openCommandObj);
}

/**
 * 打开（一个扫描任务的）扫描图像
 * @returns
 */
function openImageInViProbe(name,path,imageFiles,isUff){
	//仅支持同时打开 一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
	//图像打开方式，不允许用户通过ViProbe手动关闭，且仅打开图像即可
	var openCommandObj = generateOpenImageCommandObj(name,path,imageFiles,null,isUff);
	util.viProbeOperation.sendCommand(openCommandObj);
}

/**
 * 打开（一个手检或历史任务的）扫描图像
 * 仅支持同时打开一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
 * 图像打开方式，不允许用户通过ViProbe手动关闭
 * 打开图像时，需要同时以只读的方式打开嫌疑标记信息、历史操作步骤等。
 * @returns
 */
function openImageAndAnalysisInfoInViProbe(name,path,imageFiles,markFilePath,stepFilePath,isUff){
	//打开图像
	var openCommandObj = generateOpenImageCommandObj(name,path,imageFiles,null,isUff);
	var flag = util.viProbeOperation.sendCommand(openCommandObj);
	if (flag) {
	  return
	}
	//加载嫌疑标记文件
	if(markFilePath){
		var showMarkCommandObj = generateShowHistoryMarkCommandObj(name,markFilePath)
		util.viProbeOperation.sendCommand(showMarkCommandObj);
	}
	//加载操作步骤文件
	if(stepFilePath){
		var loadStepCommandObj = generateLoadStepCommandObj(name,stepFilePath)
		util.viProbeOperation.sendCommand(loadStepCommandObj);
	}
	// 指定默认激活窗口
	var activeDefaultWindow = defaultWindowCommandObj(name)
	util.viProbeOperation.sendCommand(activeDefaultWindow);
	//加载嫌疑标记文件
	// if(window.viprobeReturn.error===0 && openHistoryImg && markFilePath){
	// 	var showMarkCommandObj = generateShowHistoryMarkCommandObj(name,markFilePath)
	// 	util.viProbeOperation.sendCommand(showMarkCommandObj);
	// }
	// //加载操作步骤文件
	// if(window.viprobeReturn.error===0 && openHistoryImg && stepFilePath){
	// 	var loadStepCommandObj = generateLoadStepCommandObj(name,stepFilePath)
	// 	util.viProbeOperation.sendCommand(loadStepCommandObj);
	// }
}

/**
 * 关闭图像
 * @param name
 * 		图像名称
 * @returns
 */
function closeImageInViProbe(name){
	var param = {"name":name};
	var closeCommandObj = util.viProbeJsonUtil.generateCommandObj('close',param);
	util.viProbeOperation.sendCommand(closeCommandObj)
}

/**
 * 关闭ViProbe中的所有图像
 * @returns
 */
function closeAllImageInViProbe(){
	var param = {};
	var closeAllCommandObj = util.viProbeJsonUtil.generateCommandObj('close_all',param);
	util.viProbeOperation.sendCommand(closeAllCommandObj)
}

/**
 * 获取用户在viprobe上画的嫌疑标记信息的BASE64编码
 * @param name
 * 		图像名称
 * @returns
 */
function getMarkAsBase64(name){
	var param = {"name":name, "visible": true};
	var getMarkBase64CommandObj = util.viProbeJsonUtil.generateCommandObj('get_mark_as_base64',param);
	util.viProbeOperation.sendCommand(getMarkBase64CommandObj)
}

/**
 * 上传图像分析相关信息
 * @param name
 * 		图像名称
 * @returns
 */
function uploadImageAnalysisInfo(name, path, isMarkUpload,isStepUpload, isMarkJpgUpload){
	var uploadAnalysisInfoCommandObj = generateUploadAnalysisInfoCommand(name, path, isMarkUpload,isStepUpload, isMarkJpgUpload);
	util.viProbeOperation.sendCommand(uploadAnalysisInfoCommandObj)
}
/**
 * 用户在ViProbe中变换的最终图像
 * @param name
 * 		图像名称
 * @returns
 */
function getImageInViProbeBase64(name){
	var getImageBase64CommandObj = generateGetImageBase64Command(name)
	util.viProbeOperation.sendCommand(getImageBase64CommandObj)
}

/**
 * 打开指定路径的图像
 * @returns
 */
function openRemoteImageInViProbe (name, path, imageFiles, markFile, stepFile, markDeleteable) { 
	if (!imageFiles || imageFiles.length === 0) {
		return
	}
	console.log(imageFiles)
	var ext = imageFiles[0].name.substr(imageFiles[0].name.lastIndexOf('.') + 1)
	var deleteable = markDeleteable || false
	var param = {
		mode: 'default',
		images: [{
			name: name,
			path: path,
			files: imageFiles,
			ext: ext,
			type: 'auto',
			trans: 'https',
			closable: false
		}]
	}
	var openRemoteImageCommandObj = util.viProbeJsonUtil.generateCommandObj('open', param)
	console.debug('generateOpenRemoteImageCommandObj: ' + JSON.stringify(openRemoteImageCommandObj))
	var flag = util.viProbeOperation.sendCommand(openRemoteImageCommandObj);
	if (flag) {
	  return
	}
	//加载嫌疑标记文件
	if(markFile){
		var showMarkCommandObj = generateShowHistoryMarkCommandObj(name, path + 'suspects_json.mark', deleteable)
		util.viProbeOperation.sendCommand(showMarkCommandObj);
	}
	//加载操作步骤文件
	if(stepFile){
		var loadStepCommandObj = generateLoadStepCommandObj(name, path + 'history.steps')
		util.viProbeOperation.sendCommand(loadStepCommandObj);
	}
	// 指定默认激活窗口
	var activeDefaultWindow = defaultWindowCommandObj(name)
	util.viProbeOperation.sendCommand(activeDefaultWindow);
}

/**
 * 重写调用打开本地图像后的onMessage方法
 */
util.viProbeWsCallback.open_local = function (jsonObj) {
	console.debug('OnMessage call .open_local #'+ jsonObj.command +'(rewrite) method')
	if (jsonObj.result && jsonObj.error === 0) {
		openLocalResult.flag = true
		openLocalResult.result = jsonObj.result
		console.log(openLocalResult)
	} else {
		openLocalResult.flag = false
		errorCode = jsonObj.error
	}
	window.viprobeReturn.openLocalResult = openLocalResult
	window.viprobeReturn.errorCode = errorCode
}
/**
 * 重写调用保存tip图后的onMessage方法
 */
util.viProbeWsCallback.saveTip = function (jsonObj) {
	console.debug('OnMessage call .open_local #'+ jsonObj.command +'(rewrite) method')
	switch(jsonObj.error){
		case 0: break;
		case 24578:
		vm.$NotifError(vm.$t('vicenter.common.viprobe.notCutImg'), () => {});break;
	}
	if (jsonObj.result && jsonObj.error === 0) {
		saveTipResult.flag = true
		saveTipResult.result = jsonObj.result
		console.log(saveTipResult)
	} else {
		saveTipResult.flag = false
		errorCode = jsonObj.error
	}
	window.viprobeReturn.saveTipResult = saveTipResult
	window.viprobeReturn.errorCode = errorCode
}
//根据需要重写viProbeWsCallback对象中的某些方法，覆盖viProbeUtil.js中的方法
//即各动作操作成功后需要的操作，可以写在相应的回调函数中
/**
 * 重写调用打开图像后的onMessage方法
 */
util.viProbeWsCallback.open = function (jsonObj) {
  console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
  window.viprobeReturn.errorCode = jsonObj.error
  switch(jsonObj.error){
	  case 0: 
	//   openHistoryImg = true;
	  break;
	  case 2:
	  vm.$NotifError(vm.$t('vicenter.common.viprobe.memoryNotEnough'));break;
	  case 4096:
	  vm.$NotifError(vm.$t('vicenter.common.viprobe.fileNotExist'));break; 
	  case 4106: 
	  vm.$NotifError(vm.$t('vicenter.common.viprobe.openFileOverLimit'));break; 
	  case 12288:
	  vm.$NotifError(vm.$t('vicenter.common.viprobe.downLoadFailed'));break; 
	  case 32768:
	  vm.$NotifError(vm.$t('vicenter.common.viprobe.sysBusy'));break;
	  case 24578:
	  vm.$NotifError(vm.$t('vicenter.common.viprobe.notCutImg'));break; 
  }
}
/**
 * 重写调用获取嫌疑标记后的onMessage方法
 */
util.viProbeWsCallback.get_mark_as_base64 = function (jsonObj) {
	console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
	if(jsonObj.error === 0){
		getMarkBase64Success = true; 
		markBase64 = jsonObj.result; 
	}else{
		getMarkBase64Success = false; 
		markBase64 = null; 
		errorCode = jsonObj.error;
	}
	window.viprobeReturn.getMarkBase64Success = getMarkBase64Success
	window.viprobeReturn.markBase64 = markBase64
	window.viprobeReturn.errorCode = errorCode
}
/**
 * 重写调用上传ViProbe中审图信息后的onMessage方法
 */
util.viProbeWsCallback.upload = function (jsonObj) {
  console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
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
 * 重写调用获取嫌疑标记后的onMessage方法
 */
util.viProbeWsCallback.get_image_as_base64 = function (jsonObj) {
  console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
  if (jsonObj.error === 0) {
    getImageInViProbeBase64Success = true
    imageInViProbeBase64 = jsonObj.result
  } else {
    getImageInViProbeBase64Success = false
    imageInViProbeBase64 = null
    errorCode = jsonObj.error
  }
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
  
var viProbe = {
  editTipInViProbe: editTipInViProbe,
  saveTipInViProbe: saveTipInViProbe,
  openLocalImageInViProbe: openLocalImageInViProbe,
  openImageAndAnalysisInfoInViProbe: openImageAndAnalysisInfoInViProbe,
	closeImageInViProbe: closeImageInViProbe,
	closeAllImageInViProbe: closeAllImageInViProbe,
  openImageInViProbe: openImageInViProbe,
  getMarkAsBase64: getMarkAsBase64,
  imageInViProbeBase64: imageInViProbeBase64,
  markBase64: markBase64,
  uploadImageAnalysisInfo: uploadImageAnalysisInfo,
  getMarkBase64Success: getMarkBase64Success,
  openRemoteImageInViProbe: openRemoteImageInViProbe
}
export default viProbe
