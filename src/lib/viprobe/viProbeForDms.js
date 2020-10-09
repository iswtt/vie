/*
 * 版权所有 ( c ) 同方威视技术股份有限公司 2018 保留所有权利。
 * 项目：ViCenter-WEB
 * 文件名：viProbeForDms.js
 * 描述：监管子系统 与viProbe交互的页面使用，依赖viProbeUtil.js文件
 */
/* eslint-disable */
//初始化WebSocket连接
//由于浏览器限制的原因，每个页面可以建立的WebSocket连接有限制，故建议一个页面共用同一个socket连接
import util from  '@/lib/viprobe/viProbeUtil'
import vm from '@/main.js'
import { Notification } from 'element-ui'
util.initViProbeWebSocket()
//传输协议，ViProbe与文件服务器之间的传输协议
var transType = 'https';
var openImgSuccess = null
var errorCode = 0
// 是否成功激活指定窗口
var activeWindowSuccess = false
window.viprobeReturn = {
	errorCode: errorCode,
	openImgSuccess: openImgSuccess
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
	var type = 'auto';
	var trans = transType;
	var rep_name = null;
	var closable = true;
	var imageObj = {};
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
 * 生成加载历史操作步骤命令
 * @param name
 * 		图像名称
 * @param stepFilePath
 * 		操作步骤文件的绝对路径
 * @returns
 */
function generateLoadStepCommandObj(name, stepFilePath, isAutoPlay){
	var type = transType;
	var content = stepFilePath;
	//不自动播放历史操作步骤，false
	//20180907由于设置为false时viprobe有bug，此值暂时设计为null，此bug在viprobe的下一版本中修改
	var autoPlay = isAutoPlay || window.config.viprobeAutoPlay;
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
 * 打开（一个手检或历史任务的）扫描图像
 * 仅支持同时打开一个扫描图像，且扫描图像与任务详情页面同步打开，同步关闭
 * 图像打开方式，不允许用户通过ViProbe手动关闭
 * 打开图像时，需要同时以只读的方式打开嫌疑标记信息、历史操作步骤等。
 * @returns
 */
function openImageAndAnalysisInfoInViProbe(name,path,imageFiles,markFilePath,stepFilePath,markColor,isUff){
	//打开图像
	var openCommandObj = generateOpenImageCommandObj(name,path,imageFiles,null,null,markColor,isUff);
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
}
/**
 * 历史步骤自动播放
 * @param name {string} 图像名称
 * @param stepFilePath {string} 历史步骤文件路径
 */
function loadStepAutoplay (name, stepFilePath) {
	var loadStepCommandObj = generateLoadStepCommandObj(name, stepFilePath, true);
	util.viProbeOperation.sendCommand(loadStepCommandObj);
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
//根据需要重写viProbeWsCallback对象中的某些方法，覆盖viProbeUtil.js中的方法
//即各动作操作成功后需要的操作，可以写在相应的回调函数中
//重写关闭所有图像的onMessage方法,示例如下：
/**
 * 重写调用打开图像后的onMessage方法
 */
util.viProbeWsCallback.open = function (jsonObj) {
  console.debug('OnMessage call #'+ jsonObj.command +'(rewrite) method')
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
 * 重写关闭图像的onMessage方法
 */
util.viProbeWsCallback.close = function (jsonObj) {
	console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
	if (jsonObj.error === 0 && jsonObj.result) {
		window.viprobeReturn.openImgSuccess = false
	}
}
/**
 * 重写关闭所有图像的onMessage方法
 */
util.viProbeWsCallback.close_all = function (jsonObj) {
	console.debug('OnMessage call #' + jsonObj.command + '(rewrite) method')
	if (jsonObj.error === 0 && jsonObj.result) {
		window.viprobeReturn.openImgSuccess = false
	}
}

var viProbe = {
	generateOpenImageCommandObj: generateOpenImageCommandObj,
	openImageAndAnalysisInfoInViProbe: openImageAndAnalysisInfoInViProbe,
	closeImageInViProbe: closeImageInViProbe,
	closeAllImageInViProbe: closeAllImageInViProbe,
	showIntelligentAnalysis: showIntelligentAnalysis,
	loadStepAutoplay: loadStepAutoplay
}
export default viProbe