/* eslint-disable */
/**
 * 封装axios请求方法
 */
const axios  = require('axios')
const qs = require('qs')
import { Notification } from 'element-ui'

const config = window.config.Vitracking // config配置文件
import vm from '@/main.js'
var cancel
var promiseArr = {}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 系统设置保存之前设置将数据变为[]
    if (config.data) {
      for (let i in config.data) {
        if (i === 'updateSetting') {
          let arr = []
          Object.values(config.data).forEach(e => {
            arr.push(e)
          })
          arr.pop()
          config.data = arr
        }
      }
    }
    // 在发送请求之前做些什么
    // 能做的事如下 检查权限 增加页面loading  网络状态判断等
    if (config.url.indexOf('/bond') === '-1') {
      if (promiseArr[config.url]) {
        promiseArr[config.url](vm.$t('vitracking.error.cancelOperate'))
        promiseArr[config.url] = cancel
      } else {
        promiseArr[config.url] = cancel
      }
    }
    return config;
  }, function (error) {
    return Promise.reject(error) // 对请求错误做些什么
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    delete(promiseArr[response.config.url.replace(response.config.baseURL,'')])
    return response;
  }, function (error) {
    // 对响应错误做点什么
	// 例如用户请求失效，返回登录页什么的
    return Promise.reject(error);
  });

function error(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.netError')
    })
    return response
      // 如果不需要除了data之外的数据，可以直接 return response.data
  }else{
    // 这里做一些提示 根据不同的status  如果需要处理的细致的话
  }

}
function success(res) {
  if(!res.data.flag && res.data.errorCode === 'E202003'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.paramError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E000406'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.paramVoliaError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E202002'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.deleteAndbondError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E203001'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.systemError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E202004'){
    // Notification.error({
    //   title: vm.$t('vitracking.error.error'),
    //   message: vm.$t('vitracking.error.error404')
    // })
  }
  if(!res.data.flag && res.data.errorCode === 'E202005'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.queryError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E202006'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.addError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E202007'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.updateError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E202008'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.deleteError')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E202009'){
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.accessError')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '020001'){ // 登陆超时
    // vm.$router.push({path: '/login'})
    // Notification.error({
    //   title: vm.$t('vitracking.error.error'),
    //   message: vm.$t('vitracking.error.loginTimeout')
    // })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '020002'){ // 无权限
    // Notification.error({
    //   title: vm.$t('vitracking.error.error'),
    //   message: vm.$t('vitracking.error.noAuthority')
    // })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '020003'){ // 数据库无权限编码
    // Notification.error({
    //   title: vm.$t('vitracking.error.error'),
    //   message: vm.$t('vitracking.error.noAuthority')
    // })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010103'){ // 密码错误
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.passOrAccountError')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010100'){ // 用户不存在
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.passOrAccountError')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010105'){ // 用户不可用
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.userNotAvailable')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010104'){ // 用户必须更改密码后才能登录
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.mustChangePassword')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010106'){ // 用户被锁定
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.userlocked')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010109'){ // 用户过了有效激活期
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.userPassedVAP')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010110'){ // 密码不能为默认密码
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.passwordNotInit')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010107'){ // 密码不满足设定时间内的重复性要求
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.passwordNotMeetRepetitive')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010108'){ // 用户不满足设定次数重复性要求
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.userNotSatisfySettingTime')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010111'){ // 重置密码信息有误
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.resetPassIncorrect')
    })
  }
  if(!res.data.flag && res.data.errorCode.substr(1) === '010112'){ // 链接过期
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.linkExpired')
    })
  }
  if(!res.data.flag && res.data.errorCode === 'E029999'){ // 
    Notification.error({
      title: vm.$t('vitracking.error.error'),
      message: vm.$t('vitracking.error.commandException')
    })
  }
}
const $axios = (opts, data) => {
    let Public = {}  //用于存放公共参数，类似于当前用户id等
    if (!Array.isArray(data)) {
      data = Object.assign(Public, data)
    }
    // 参数前后的空格去除
    for (let i in data) {
      if (data[i] && typeof(data[i]) === 'string') {
        data[i] = data[i].replace(/(^\s*)|(\s*$)/g, "")
      }
    }
    let httpDefaultOpts = { //http默认配置
          baseURL: config.baseUrl,
          timeout: 0,
          method:opts.method,
          url: opts.url,
          responseType: "json", // 一般一个网站的responseType 都是一样的
          withCredentials: true, // 是否允许带cookie这些
          headers: opts.headers,
          arrayFormat: opts.arrayFormat,  //有三个参数 'indices' id[0]=b&id[1]=c  'brackets' 'id[]=b&id[]=c' 'repeat' 'id=b&id=c'
          params:Object.assign(Public, data),
          data: data,
          headers: opts.method == 'post'?{
            "Content-Type": "application/json;charset=utf-8",
            'X-CSRF-TOKEN': sessionStorage.getItem('Xcsrftoken')
          }:{
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': sessionStorage.getItem('Xcsrftoken')
          },
          cancelToken: new axios.CancelToken(function (c) {
            cancel = c // 记录当前请求的取消方法
          })
    }
    if(opts.method=='get'){
      delete httpDefaultOpts.data
      // httpDefaultOpts.params = qs.stringify(httpDefaultOpts.params,{arrayFormat: httpDefaultOpts.arrayFormat||'indices'})
    }else if(opts.method=='delete'){
      delete httpDefaultOpts.data
      //httpDefaultOpts.params = qs.stringify(httpDefaultOpts.params,{arrayFormat: httpDefaultOpts.arrayFormat||'indices'})
    }else{
      delete httpDefaultOpts.params
      // httpDefaultOpts.data = qs.stringify(httpDefaultOpts.data,{arrayFormat: httpDefaultOpts.arrayFormat||'indices'})
    }
    /* 
    urpm的请求头判断
     */
    if (httpDefaultOpts.url.indexOf(`${config.urpmUrl.api}`) !== -1) {
    // if (httpDefaultOpts.url.indexOf(`api`) !== -1) {
      httpDefaultOpts.headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        'X-CSRF-TOKEN': sessionStorage.getItem('Xcsrftoken')
      }
      httpDefaultOpts.data = qs.stringify(httpDefaultOpts.data,{arrayFormat: httpDefaultOpts.arrayFormat||'indices'})
      // httpDefaultOpts.baseURL = 'http://localhost:8080'
    }
    let promise = new Promise(function(resolve, reject) {
      axios(httpDefaultOpts).then(
        (res) => {
          success(res)
          resolve(res)
        }
      ).catch(
        (response) => {
          error(response)
          reject(response)
        }
      )

    })
  return promise
}

export default $axios



