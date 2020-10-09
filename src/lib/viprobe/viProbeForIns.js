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
// 获取嫌疑标记json信息成功与否，默认为null，
var getMarkJsonSuccess = null
// 添加嫌疑标记信息成功与否，默认为null
var addMarkSuccess = null
// 嫌疑标记信息的BASE64编码
var markBase64 = null
// 嫌疑标记信息的json信息
var marksJSON = null
// 获取嫌疑标记json信息成功与否，默认为null，
var getMarkJsonSuccess = null
// 嫌疑标记信息的json
var markJson = null
// 提交图像分析结果相关文件是否成功，根据调用方法后的返回结果，设置此字段值
var uploadImageAnalysisSuccess = null
var uploadTipImageAnalysisSuccess = null
// 提交图像分析结果相关文件成功之后返回的result，根据调用方法后的返回结果，设置此字段值
var uploadImageAnalysisBackResult = null
// 获取用户在ViProbe中变换的最终图像是否成功
var getImageInViProbeBase64Success = null
// 是否成功激活指定窗口
var activeWindowSuccess = false
// ViProbe中变换后的最终图像的BASE64编码，
// 是一个字符串数组，用逗号分隔，以支持双视角图像，如果是单视角图像则数组的大小为1，否则为双视角图像返回的数组大小为2
var imageInViProbeBase64 = null
// 打开文件成功标志位
var openImgSuccess = null
// 打开本地图像相关
var openLocalResult = {
	result: {},
	flag: null
}
// 上传本地图像文件是否成功
var uploadLocalImageSuccess = false
var errorCode = 0
var isOriginal = null
var uploadLocalv2Res = ''
// 上传jpg是否成功
var uploadJpgSuccess = null
var uploadJpgBackResult = ''
window.viprobeReturn = {
	getMarkBase64Success: getMarkBase64Success,
	getMarkJsonSuccess: getMarkJsonSuccess,
	addMarkSuccess: addMarkSuccess,
	markBase64: markBase64,
	marksJSON: marksJSON,
	markJson: markJson,
	getMarkJsonSuccess: getMarkJsonSuccess,
	errorCode: errorCode,
	uploadImageAnalysisSuccess: uploadImageAnalysisSuccess,
	uploadTipImageAnalysisSuccess: uploadTipImageAnalysisSuccess,
	uploadImageAnalysisBackResult: uploadImageAnalysisBackResult,
	getImageInViProbeBase64Success: getImageInViProbeBase64Success,
	imageInViProbeBase64: imageInViProbeBase64,
	activeWindowSuccess: activeWindowSuccess,
	openImgSuccess: openImgSuccess,
	isOriginal: isOriginal,
	openLocalResult: openLocalResult,
	uploadLocalImageSuccess: uploadLocalImageSuccess,
	uploadLocalv2Res: uploadLocalv2Res,
	uploadJpgSuccess: uploadJpgSuccess,
	uploadJpgBackResult: uploadJpgBackResult
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
function generateOpenImageCommandObj(name,path,imageFiles,tipImageObj,openMode,markColor,isUff){
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
	var closable = true
	var imageObj = {}
	if (tipImageObj) {
		imageObj = util.viProbeJsonUtil.generateImageObj(name, path, imageFiles,tipImageObj,ext,type,trans,rep_name,closable,isUff)
	} else {
		imageObj = util.viProbeJsonUtil.generateImageObj(name, path, imageFiles,null,ext,type,trans,rep_name,closable,isUff,markColor)
	}
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
 * 在图像上显示嫌疑标记命令，嫌疑标记不可编辑
 * @param name
 * 		图像名称
 * @param markFilePath
 * 		嫌疑标记文件的绝对路径
 * @returns
 */
function generateShowHistoryMarkCommandObj(name,markFilePath,markDeleteable,markColor){
	var type = transType;
	var content = markFilePath;
	// ips现场独立审像若是嫌疑图，content需要传递嫌疑标记内容，type为jsonstr
	if (typeof content === 'string') {
		type = transType
	} else {
		type = 'jsonstr'
	}
	var show = true;
	var color = markColor || null;
	var editable = false;	//不可编辑
	var deleteable = false;	//不可删除
	if (markDeleteable) {
		deleteable = true
	}
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
 * upload_jpg,上传给定name名称的图像的jpg原图(未经图像变换处理)，如果带嫌疑图片就包含嫌疑，否则不包含嫌疑
 * @param {*} name 
 * @param {*} path 
 */
function generateUploadJpgCommand(name, serverPath){
	var uploadObj = util.viProbeJsonUtil.generateUploadJpgObj(name,serverPath);
	var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('upload_jpg',uploadObj);
	return uploadCommandObj;
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
function generateUploadAnalysisInfoCommand(name, path, isMarkUpload,isStepUpload, isMarkJpgUpload, markSign, stepSign, markJpgSign, markColor){
	var trans = transType;
	var markColor = markColor || null;
	var uploadObj = util.viProbeJsonUtil.generateUploadObj(trans
			,name,path,markColor,isMarkUpload,isStepUpload,isMarkJpgUpload,markSign,stepSign,markJpgSign);
	var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('upload',uploadObj);
	return uploadCommandObj;
}
function generateUploadTipAnalysisInfoCommand(name, path){
	var uploadObj = util.viProbeJsonUtil.generateTipObj(name,path);
	var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('commitTip',uploadObj);
	return uploadCommandObj;
}
/**
 * 生成获取Viprobe中最终审图结果图像的命令
 * @param name
 * 		图像名称
 * @returns
 */
function generateGetImageBase64Command(name, original, includeMark){
	var original = original;
	var lineWidth = null;
	var viewport = false;
	var includeMark = includeMark;
	var includeRuler = true;
	var getImageBase64Obj = util.viProbeJsonUtil.generateGetImageBase64Obj(name,
			original,lineWidth,viewport,includeMark,includeRuler);
	var uploadCommandObj = util.viProbeJsonUtil.generateCommandObj('get_image_as_base64',getImageBase64Obj);
	return uploadCommandObj;
}

/**
 * 打开（一个扫描任务的）扫描图像
 * @returns
 */
function openImageInViProbe(name,path,imageFiles,tipImageObj,isUff){
	//仅支持同时打开 一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
	//图像打开方式，不允许用户通过ViProbe手动关闭，且仅打开图像即可
	var openCommandObj = {}
	if (tipImageObj) {
	  openCommandObj = generateOpenImageCommandObj(name,path,imageFiles,tipImageObj,null,null,isUff);
	} else {
	  openCommandObj = generateOpenImageCommandObj(name,path,imageFiles,null,null,null,isUff);
	}
	
	util.viProbeOperation.sendCommand(openCommandObj);
}

/**
 * 打开（一个手检或历史任务的）扫描图像
 * 仅支持同时打开一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
 * 图像打开方式，不允许用户通过ViProbe手动关闭
 * 打开图像时，需要同时以只读的方式打开嫌疑标记信息、历史操作步骤等。
 * @returns
 */
function openImageAndAnalysisInfoInViProbe(name,path,imageFiles,markFilePath,stepFilePath, markColor,isUff,markDeleteable){
	//打开图像
	var openCommandObj = generateOpenImageCommandObj(name,path,imageFiles,null,null,markColor,isUff);
	var flag = util.viProbeOperation.sendCommand(openCommandObj);
	if (flag) {
	  return
	}
	//加载嫌疑标记文件
	if(markFilePath){
		var showMarkCommandObj = generateShowHistoryMarkCommandObj(name,markFilePath,markDeleteable)
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
 * 获取嫌疑标记的json信息
 * @param name
 * 		图像名称
 * @returns
 */
function getMarkAsJson(name){
	var param = {"name":name, "visible": true};
	var getMarkJsonCommandObj = util.viProbeJsonUtil.generateCommandObj('get_mark_as_json',param);
	util.viProbeOperation.sendCommand(getMarkJsonCommandObj)
}
/**
 * 获取用户在viprobe上新增的嫌疑标记信息的json
 * @param name
 * 		图像名称
 * @returns
 */
function getNewMarkAsJson(name){
	var param = {"name":name, "visible": true};
	var getMarkBase64CommandObj = util.viProbeJsonUtil.generateCommandObj('get_new_marks',param);
	util.viProbeOperation.sendCommand(getMarkBase64CommandObj)
}
/**
 * 上传图像分析相关信息
 * @param name
 * 		图像名称
 * @returns
 */
function uploadImageAnalysisInfo(name, path, isMarkUpload,isStepUpload, isMarkJpgUpload, markSign, stepSign, markJpgSign, markColor){
	var uploadAnalysisInfoCommandObj = generateUploadAnalysisInfoCommand(name, path, isMarkUpload,isStepUpload, isMarkJpgUpload, markSign, stepSign, markJpgSign, markColor);
	util.viProbeOperation.sendCommand(uploadAnalysisInfoCommandObj)
}
/**
 * 上传Tip图像分析相关信息
 * @param name
 * 		图像名称
 * @returns
 */
function uploadTipImageAnalysisInfo(name, path){
	var uploadTipAnalysisInfoCommandObj = generateUploadTipAnalysisInfoCommand(name, path);
	util.viProbeOperation.sendCommand(uploadTipAnalysisInfoCommandObj)
}
/**
 * 显示智能审图结果接口
 * @param {*} param
 * "name": "86574FS01201401170065",
 * "type":"jsonstr"
 * "analysis_result": JSONCONTEXT
 */
function showIntelligentAnalysis (name, type, jsonData) {
	var param = {
		name: name,
		type: type,
		analysis_result: jsonData,
		color: '#008000'
	}
	var commandObj = util.viProbeJsonUtil.generateCommandObj('show_intelligent_analysis',param);
	util.viProbeOperation.sendCommand(commandObj)
}
/**
 * 用户在ViProbe中变换的最终图像
 * @param name
 * 		图像名称
 * @returns
 */
function getImageInViProbeBase64(name, original, includeMark){
	isOriginal = original
	var getImageBase64CommandObj = generateGetImageBase64Command(name, original, includeMark)
	util.viProbeOperation.sendCommand(getImageBase64CommandObj)
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
 * 上传本地图像调用方法
 * @param name
 *    图像流水号，即任务号
 * @param serverPath
 *    图像路径，到文件夹级别
 * @param imageFiles
 *    图像数组，文件数组，其中sign和md5根据项目可选
 *    [{"name":"XXXXX.img","sign":"xxxx","md5":"md5code"},…,{ "name":"XXXX.img","sign":"xxxx","md5":"md5code"}]
 * @returns
 */
function uploadLocalImage (name, serverPath, imageFiles, trans) {
	var uploadLocalImageObj = {}
	if (name) {
		uploadLocalImageObj.name = name
	}
	if (serverPath) {
		uploadLocalImageObj.server_path = serverPath
	}
	if (imageFiles) {
		uploadLocalImageObj.image_files = imageFiles
	}
	if (trans) {
		uploadLocalImageObj.trans = trans
	} else {
		uploadLocalImageObj.trans = 'https'
	}
	var uploadLocalImageCommandObj = util.viProbeJsonUtil.generateCommandObj('upload_images', uploadLocalImageObj)
	util.viProbeOperation.sendCommand(uploadLocalImageCommandObj)
}

//根据需要重写viProbeWsCallback对象中的某些方法，覆盖viProbeUtil.js中的方法
//即各动作操作成功后需要的操作，可以写在相应的回调函数中
/**
 * 重写调用打开图像后的onMessage方法
 */
util.viProbeWsCallback.open = function (jsonObj) {
  console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
  window.viprobeReturn.errorCode = jsonObj.error
  if (jsonObj.error === 0) {
	window.viprobeReturn.openImgSuccess = true
  } else {
	window.viprobeReturn.openImgSuccess = false
  }
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
  }
}
/**
 * 重写调用打开图像（增强版）后的onMessage方法
 */
util.viProbeWsCallback.open_v2 = function (jsonObj) {
	console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
	window.viprobeReturn.errorCode = jsonObj.error
	if (jsonObj.error === 0) {
		window.viprobeReturn.openImgSuccess = true
	} else {
		window.viprobeReturn.openImgSuccess = false
	}
	switch(jsonObj.error){
	  case 0: break;
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
	  case 4105:
	  vm.$NotifPrompt(vm.$t('vicenter.common.viprobe.tampered'));break; // 当前图像已经被篡改
	}
  }
/**
 * 重写调用添加嫌疑标记后的onMessage方法
 */
util.viProbeWsCallback.add_mark = function (jsonObj) {
	console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
	if(jsonObj.error === 0){
		addMarkSuccess = true; 
	}else{
		addMarkSuccess = false; 
		errorCode = jsonObj.error;
	}
	window.viprobeReturn.addMarkSuccess = addMarkSuccess
	window.viprobeReturn.errorCode = errorCode
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
 * 重写调用获取嫌疑标记json后的onMessage方法
 */
util.viProbeWsCallback.get_mark_as_json = function (jsonObj) {
	console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
	if(jsonObj.error === 0){
		getMarkJsonSuccess = true; 
		marksJSON = jsonObj.result; 
	}else{
		getMarkJsonSuccess = false; 
		marksJSON = null; 
		errorCode = jsonObj.error;
	}
	window.viprobeReturn.getMarkJsonSuccess = getMarkJsonSuccess
	window.viprobeReturn.marksJSON = marksJSON
	window.viprobeReturn.errorCode = errorCode
}
/**
 * 重写调用获取嫌疑标记后的onMessage方法
 */
util.viProbeWsCallback.get_new_marks = function (jsonObj) {
	console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
	if(jsonObj.error === 0){
		getMarkJsonSuccess = true; 
		markJson = jsonObj.result; 
	}else{
		getMarkJsonSuccess = false; 
		markJson = null; 
		errorCode = jsonObj.error;
	}
	window.viprobeReturn.getMarkJsonSuccess = getMarkJsonSuccess
	window.viprobeReturn.markJson = markJson
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
util.viProbeWsCallback.commitTip = function (jsonObj) {
	console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
	if (jsonObj.result && jsonObj.error === 0) {
	  uploadTipImageAnalysisSuccess = true
	  uploadImageAnalysisBackResult = jsonObj.result
	} else {
	  uploadTipImageAnalysisSuccess = false
	  errorCode = jsonObj.error
	}
	window.viprobeReturn.uploadTipImageAnalysisSuccess = uploadTipImageAnalysisSuccess
	window.viprobeReturn.uploadImageAnalysisBackResult = uploadImageAnalysisBackResult
	window.viprobeReturn.errorCode = errorCode
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
    imageInViProbeBase64 = []
    errorCode = jsonObj.error
  }
  window.viprobeReturn.getImageInViProbeBase64Success = getImageInViProbeBase64Success
  window.viprobeReturn.imageInViProbeBase64 = imageInViProbeBase64
  window.viprobeReturn.isOriginal = isOriginal
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
var viProbe = {
  generateOpenImageCommandObj: generateOpenImageCommandObj,
  openImageAndAnalysisInfoInViProbe: openImageAndAnalysisInfoInViProbe,
  closeImageInViProbe: closeImageInViProbe,
  closeAllImageInViProbe: closeAllImageInViProbe,
  openImageInViProbe: openImageInViProbe,
  getMarkAsBase64: getMarkAsBase64,
  getMarkAsJson: getMarkAsJson,
  getNewMarkAsJson: getNewMarkAsJson,
  imageInViProbeBase64: imageInViProbeBase64,
  markBase64: markBase64,
  uploadImageAnalysisInfo: uploadImageAnalysisInfo,
  uploadTipImageAnalysisInfo: uploadTipImageAnalysisInfo,
  getMarkBase64Success: getMarkBase64Success,
  showIntelligentAnalysis: showIntelligentAnalysis,
  getImageInViProbeBase64: getImageInViProbeBase64,
  openLocalImageInViProbe: openLocalImageInViProbe,
  uploadLocalImage: uploadLocalImage,
  openRemoteImageInViProbe: openRemoteImageInViProbe,
  uploadLocalImageNew: uploadLocalImageNew,
  generateUploadJpgCommand: generateUploadJpgCommand
}
export default viProbe
