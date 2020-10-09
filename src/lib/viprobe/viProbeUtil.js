/*
 * 版权所有 ( c ) 同方威视技术股份有限公司 2018 保留所有权利。
 * 项目：ViCenter-WEB
 * 文件名：viProbeUtil.js
 * 描述：viProbeUtil通用工具类，供各与viProbe交互的页面使用
 *
 */
/* eslint-disable */
import vm from '@/main.js'
import { Notification } from 'element-ui'
var viProbeWsUrlDefault = 'wss://ws.iiat.nuctech:19998'// 与ViProbe通讯的websocket地址
var viProbeWebsocket = null
//重连ViProbe是否失败，若重连10次连接不上，则失败，此值为true
window.viprobeUtilReturn = {}
window.viprobeUtilReturn.reconnectToViProbeFailed = null
var reconnectToViProbeFailed = null
window.viprobeUtilReturn.errorCode = null
/**
 * 初始化WEBSOCKET
 * @param wsUrl
 * 		可以为空，若为空，则使用默认的‘wss://ws.iiat.nuctech:19998’。
 * @returns
 */
function initViProbeWebSocket (wsUrl) {
  var viProbeWsUrl = viProbeWsUrlDefault
  if (wsUrl !== undefined && wsUrl !== null && wsUrl !== '') {
    viProbeWsUrl = wsUrl
  }
  viProbeWebsocket = new WebSocket(viProbeWsUrl)
  viProbeWebsocket.onopen = function (evt) {
    onViProbeWsOpen(evt)
    viProbeHeartCheck.start();
  }
  viProbeWebsocket.onclose = function (evt) {
	viProbeHeartCheck.stop();
	onViProbeWsClose(evt)
  }
  viProbeWebsocket.onmessage = function (evt) {
    onViProbeWsMessage(evt)
    viProbeHeartCheck.reset();
  }
  viProbeWebsocket.onerror = function (evt) {
	viProbeHeartCheck.stop();
    onViProbeWsError(evt)
  }
}
//与ViProbe之间的心跳检测及保持
var viProbeHeartCheck={
    timeout: 15000,// 15ms
    timeoutObj: null,
    sendTime:-1,
    reset: function(){
    	// console.debug('reset viProbe heart beat check');
        clearTimeout(this.timeoutObj);
        this.start(); 
    }, 
    start: function(){ 
    	var thiz = this;
    	this.timeoutObj=setTimeout(function(){ 
    		// console.debug('send viProbe heart beat command');
    		thiz.sendTime = new Date().getTime();
    		var heartBeatCommand = viProbeJsonUtil.generateCommandObj('heartbeat');
			heartBeatCommand.sendTime = thiz.sendTime;
    		viProbeOperation.sendCommand(heartBeatCommand); 
    	}, this.timeout) 
    },
    stop:function(){
    	// console.debug('stop viProbe heart beat check');
    	clearTimeout(this.timeoutObj);
    }
} 

function onViProbeWsOpen (evt) {
  console.info('VIPROBE CONNECTED SUCCESS')
}

function onViProbeWsClose (evt) {
  console.info('VIPROBE DISCONNECTED')
}

function onViProbeWsMessage (evt) {
//   console.debug('OnMessage evt: ' + evt.data)
  var json = JSON.parse(evt.data)
  if(json.command !== 'heartbeat'){
	  if(json.error === 0){
		  console.info('viprobe execute success, command: ' + json.command );
	  }else{
		  console.error('viprobe execute fail, command:'+ json.command +' Error Code:' + json.error);
	  }
	  window.viprobeUtilReturn.errorCode = json.error
  }
  if (json.command_id && viProbeWsCallback[json.command_id]) {
	viProbeWsCallback[json.command_id](json)
  } else {
	viProbeWsCallback['commonFun'](json)
  }
}

function onViProbeWsError (evt) {
  console.error('OnError evt: ' + evt.data +' viProbeWebsocket.readyState='+ viProbeWebsocket.readyState)	
}
// 定义回调函数，可以在每个页面上根据需要重写相关方法
var viProbeWsCallback = {
  // 回调函数通用处理方法
  commonFun: function (json) {
    console.warn('Not find OnMessage call #'+ json.command +' method')
  },
  // 打开文件
  open: function (json) {
	console.debug('OnMessage call #'+ json.command +' method')
	},
	// 打开文件增强版
	open_v2: function (json) {
		console.debug('OnMessage call #'+ json.command +' method')
	},
  // 打开本地文件
  open_local: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 激活指定窗口
  active: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 图像替换
  replace: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 菜单控制
  menus: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 获取嫌疑标记（Json）
  get_mark_as_json: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 获取嫌疑标记（Base64）
  get_mark_as_base64: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 获取新增嫌疑标记
  get_new_marks: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 添加嫌疑标记
  add_mark: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 清空嫌疑标记
  clear_mark: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 隐藏嫌疑标记
  hide_marks: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 显示嫌疑标记
  show_marks: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 计算嫌疑标记比值
  get_shape_ratio_by_color: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 获取历史记录
  get_history: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 设置历史记录
  set_history: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 获取图像
  get_image_as_base64: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 关闭图像
  close: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 关闭所有图像
  close_all: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 获取当前图像位置
  get_current_image_name: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 切换显示模式
  switch_mode: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 运行环境检测接口
  get_running_info: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 退出应用
  exit: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 上传并关闭
  upload_close: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 上传
  upload: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 上传Tip
  commitTip: function (json) {
	console.debug('OnMessage call #'+ json.command +' method')
  },
  // 上传本地图像文件
  upload_images: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  //心跳检测
  heartbeat: function (json) {
	//   console.debug('OnMessage call #'+ json.command +' method')
  },
  // 打开本地文件
  saveTip: function (json) {
	  console.debug('OnMessage call #'+ json.command +' method')
  },
  // 打开本地文件
  editTip: function (json) {
	console.debug('OnMessage call #'+ json.command +' method')
	},
  upload_images_v2: function (json) {
	console.debug('OnMessage call #'+ json.command +' method')
  },
  // 打开本地文件
  get_shape_ratio_by_json: function (json) {
	console.debug('OnMessage call #'+ json.command +' method')
  }
}
//ViProbe对外提供的所有操作，供外部JS文件调用，来发送指令给ViProbe
var viProbeOperation = {
  // 发送指令给ViProbe
  sendCommand: function (jsonObj,callback) {
    // console.debug('viProbeOperation.'+jsonObj.command +':' + JSON.stringify(jsonObj))
    var reConnectionCount = 0;
	reconnectToViProbeFailed = false;
	window.viprobeUtilReturn.reconnectToViProbeFailed = reconnectToViProbeFailed
	sendMessageToViProbe(jsonObj)
    
    /**
	 * 发送指令给ViProbe
	 * 仅供此js文件内相互调用，外部js文件不建议调用此方法
	 *
	 * @param message
	 *            指令内容JSON格式串
	 * @param callback
	 * @returns
	 */
	function sendMessageToViProbe (messageObj) {
	  if(reconnectToViProbeFailed){
		  window.viprobeUtilReturn.reconnectToViProbeFailed = reconnectToViProbeFailed
		  return reconnectToViProbeFailed
	  }
	  var message = JSON.stringify(messageObj)
	  if(messageObj.command === 'heartbeat'){
		  console.debug('begin to send message,readyState=' + viProbeWebsocket.readyState + ';message=' + message)
	  }else{
		  console.info('begin to send message,readyState=' + viProbeWebsocket.readyState + ';message=' + message)
	  }
	  if(viProbeWebsocket.readyState == WebSocket.OPEN){
		  viProbeWebsocket.send(message)
	  }else if(viProbeWebsocket.readyState == WebSocket.CONNECTING){
		  console.warn('web socket is connecting, please waiting......');
		  setTimeout(function(){sendMessageToViProbe (messageObj)}, 1000);
	  }else if(viProbeWebsocket.readyState == WebSocket.CLOSING){
		  console.warn('web socket is closing, please waiting......');
		  setTimeout(function(){sendMessageToViProbe (messageObj)}, 1000);
	  }else if(viProbeWebsocket.readyState == WebSocket.CLOSED){
		  console.warn('web socket is closed, please waiting for reconnection');
		  if(reConnectionCount <=10){//若连接不上viprobe的话，重试10次。若想重连可重新发送消息，即可自动再试10次
			  initViProbeWebSocket()
			  reConnectionCount++;
			  setTimeout(function(){sendMessageToViProbe (messageObj)}, 1000);
		  }else{
			  console.error('Can not connect to ViProbe, Please confirm is ViProbe opened');
			  reconnectToViProbeFailed = true;
			  //TODO 修改为框架样式，并国际化展示！
			  // alert('连接ViProbe失败，请确认ViProbe是否启动');
			  vm.$NotifError(vm.$t('vicenter.common.viprobe.connectFail'))
			  window.viprobeUtilReturn.reconnectToViProbeFailed = reconnectToViProbeFailed
			  return reconnectToViProbeFailed
		  }
	  }
	  
	}   
  }
}

//供外js文件调用 ，来生成ViProbe可以接收的参数JSON对象
var viProbeJsonUtil = {
	/**
	 * 生成调用ViPorbe的指令，command_id属性暂时没有用，故设置为与command一样
	 * @param command
	 * 		ViProbe可接收的指令名称
	 * @param paramObj
	 * 		执行指令需要的参数对象，Json Obj
	 * @param commandId
	 * 		执行指令Id，可不传，默认与command一致
	 */
	generateCommandObj: function(command,paramObj,commandId){
		var commandJsonObj = {};
		if(command){
			commandJsonObj.command = command;
			commandJsonObj.command_id = command;
		}
		if(paramObj){
			commandJsonObj.param = paramObj;
		}
		//若参数传了commandId，则以传递的参数设置commandId
		if(commandId){
			commandJsonObj.command_id = commandId;
		}
		console.debug('generateCommandObj:' + JSON.stringify(commandJsonObj));
		return commandJsonObj;
	},
	/**
	 * 生成操作步骤的json对象
	  * @param type 必须
	 * 		传输协议类型，jsonstr /default/http/https/ftp/ftps
	 *  @param content 必须
	 * 		操作步骤对象，或是操作步骤json文件
	 *  @param autoPlay 
	 * 		是否自动加载历史记录(可选项),默认不自动加载
	 * 		20180907：自动加载功能尚未实现
	 */
	generateStepObj: function(type, content, autoPlay){
		var stepObj = {};
		if(type){
			stepObj.type = type;
		}
		if(content){
			stepObj.content = content;
		}
		if(autoPlay !== null){
			stepObj.autoPlay = autoPlay;
		}
		console.debug('generateStepObj:' + JSON.stringify(stepObj));
		return stepObj;
	},
	/**
	 * 生成嫌疑标记对象
	 * @param type
	 * 		传输协议：jsonstr/default/http/https/ftp/ftps
	 * @param content
	 * 		嫌疑标记json对象或，嫌疑标记文件路径
	 * @param show
	 * 		true/false，可选，默认显示
	 * @param color
	 * 		可选
	 * @param editable
	 * 		true/false，可选,默认可编辑
	 * @param deleteable
	 * 		true/false，可选,默认可删除
	 * @returns
	 */
	generateMarkObj: function(type,content,show,color,editable,deleteable){
		var markObj = {};
		if(type){
			markObj.type = type;
		}
		if(content){
			markObj.content = content;
		}
		if(type){
			markObj.type = type;
		}
		if(show !== null){
			markObj.show = show;
		}
		if(color){
			markObj.color = color;
		}
		if(editable !== null){
			markObj.editable = editable;
		}
		if(deleteable !== null){
			markObj.deletable = deleteable;
		}
		console.debug('generateMarkObj:' + JSON.stringify(markObj));
		return markObj;
	},
	/**
	 * 生成上传文件参数对象
	 * @param trans
	 * 		传输协议：http/https/ftp/ftps
	 * @param name
	 * 		图像名称
	 * @param serverPath
	 * 		图像要上传到的文件夹路径
	 * @param markColor
	 * 		自定义嫌疑标记颜色，若不传，则使用默认
	 * @param uploadMark
	 * 		嫌疑标记是否上传，true/false
	 * @param uploadStep
	 * 		操作步骤是否上传，true/false
	 * @param UploadMarkJpg
	 * 		带嫌疑标记的jpg图像是否上传，true/false
	 * @returns
	 */
	generateUploadObj: function(trans,name,serverPath,markColor,uploadMark,uploadStep,UploadMarkJpg,markSign,stepSign,markJpgSign){
		var uploadObj = {};
		if(trans){
			uploadObj.trans = trans;
		}
		if(name){
			uploadObj.name = name;
		}
		if(serverPath){
			uploadObj.server_path = serverPath;
		}
		if(markColor){
			uploadObj.mark_color = markColor;
		}
		
		if(uploadMark !== null){
			uploadObj.mark={
				"upload":uploadMark,
				"sign":markSign
			}
		}
		if(uploadStep !== null){
			uploadObj.step={
				"upload":uploadStep,
				"sign":stepSign
			}
		}
		if(UploadMarkJpg !== null){
			uploadObj.mark_jpg={
				"upload":UploadMarkJpg,
				"sign":markJpgSign
			}
		}
		console.debug('generateUploadObj:' + JSON.stringify(uploadObj));
		return uploadObj;
	},
	generateTipObj: function(name,serverPath){
		var uploadObj = {}
		if(name){
			uploadObj.name = name;
		}
		if(serverPath){
			uploadObj.path = serverPath;
		}
		console.debug('generateTipObj:' + JSON.stringify(uploadObj));
		return uploadObj;
	},
	generateUploadJpgObj: function(name,serverPath){
		var uploadObj = {}
		if(name){
			uploadObj.name = name;
		}
		if(serverPath){
			uploadObj.server_path = serverPath;
		}
		console.debug('generateUploadJpgObj:' + JSON.stringify(uploadObj));
		return uploadObj;
	},
	/**
	 * 生成获取图像的BASE64编码对象
	 * @param name
	 * 		图像名称
	 * @param original
	 * 		是否原图
	 * @param lineWidth
	 * 		嫌疑标记线宽
	 * @param viewport
	 * 		当前可视区域true，还是整副图像false
	 * 		仅当original=false时生效
	 * @param includeMark
	 * 		是否包括嫌疑标记
	 * @param includeRuler
	 * 		是否包括测试标尺
	 * @returns
	 */
	generateGetImageBase64Obj: function(name,original,lineWidth,viewport,includeMark,includeRuler){
		var getImageBase64Obj = {};
		if(name){
			getImageBase64Obj.name = name;
		}
		if(original !== null){
			getImageBase64Obj.original = original;
		}
		if(lineWidth){
			getImageBase64Obj.line_width = lineWidth;
		}
		if(viewport !== null){
			getImageBase64Obj.viewport = viewport;
		}
		if(includeMark !== null){
			getImageBase64Obj.include_mark = includeMark;
		}
		if(includeRuler !== null){
			getImageBase64Obj.include_ruler = includeRuler;
		}
		console.debug('getImageBase64Obj:' + JSON.stringify(getImageBase64Obj));
		return getImageBase64Obj;
	},
	
	/**
	 * 生成图像的json对象，若无须某参数，请传入null对象
	 * 
	 * @param name 必须
	 * 		文件名称(也是用于识别图像的唯一标识符)
	 * @param path 必须
	 * 		路径到文件夹级别即可，支持本地路径、FTP(S)、HTTP(S)
	 * @param imageFiles 必须
	 * 		文件数组，其中sign和md5根据项目可选
	 * 		[{"name":"file1","sign":"xxxx","md5":"md5code"},…,{ "name":"fileN","sign":"xxxx","md5":"md5code"}]
	 * @param tipImageObj 需要融合Tip图是必须
	 * 		对象类型
	 * 		{
	 *        path: '',
	 *        difficultyLevel: -1/0/1/2, // -1或0表示随机难度，难度级别包括1容易，2困难
	 *        files: [{"name":"file1","sign":"xxxx","md5":"md5code"},…,{ "name":"fileN","sign":"xxxx","md5":"md5code"}]
	 *      }
	 * @param ext
	 * 		要打开的文件的后缀名,可以是urf,img,jpg,png,bmp,tiff等
	 * @param type
	 * 		文件类型 2ENERGY1VIEW/2ENERGY2VIEW/1ENERGY1VIEW/1ENERGY2VIEW
	 * @param trans
	 * 		支持local/ftp/ftps/http/https
	 * @param rep_name
	 * 		替换对应名称的打开图像（可选）,默认没有此属性表示顺序追加打开
	 * @param closable
	 * 		是否可通过ViProbe界面操作来关闭图像（可选）,默认为true可关闭
	 * @param color
	 * 		当前图像下的嫌疑标记颜色,（可选）,默认使用系统设置的颜色
	 * @param line_width
	 * 		嫌疑标记线宽（可选）,默认使用系统设置的线宽
	 * @returns
	 */	
	generateImageObj: function(name,path,imageFiles,tipImageObj,ext,type,trans,rep_name,closable,isUff,color,line_width){
		var imageJsonObj = {};
		if(name){
			imageJsonObj.name = name;
		}
		if(path){
			imageJsonObj.path = path;
		}
		if(imageFiles && imageFiles.length >0){
			imageJsonObj.files = imageFiles;
		}
		if(ext){
			imageJsonObj.ext = ext;
		}
		if(type){
			imageJsonObj.type =type ;
		}
		if(trans){
			imageJsonObj.trans =trans ;
		}
		if(rep_name){
			imageJsonObj.rep_name= rep_name;
		}
		if(closable !== null){
			imageJsonObj.closable = closable;
		}
		if(color){
			imageJsonObj.color = color;
		}
		if(line_width){
			imageJsonObj.line_width = line_width;
		}
		if (tipImageObj) {
			imageJsonObj.tip = tipImageObj;
		}
		if (isUff) {
			imageJsonObj.uff = true;
		} else {
			imageJsonObj.uff = false;
		}
		console.debug('generateImageObj:' + JSON.stringify(imageJsonObj));
		return imageJsonObj;
	}
	
}

var util = {
	initViProbeWebSocket: initViProbeWebSocket,
	viProbeWsCallback: viProbeWsCallback,
	viProbeJsonUtil: viProbeJsonUtil,
	viProbeOperation: viProbeOperation,
}
export default util