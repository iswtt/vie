/* eslint-disable */
/**
 * 封装axios请求方法
 */
const axios  = require('axios')
const qs = require('qs')
import { Notification } from 'element-ui'
const config = window.config // config配置文件
import vm from '@/main.js'
var cancel
var errorCodeArr = []
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
    // if (promiseArr[config.url]) {
    //   promiseArr[config.url]('操作取消')
    //   promiseArr[config.url] = cancel
    // } else {
    //   promiseArr[config.url] = cancel
    // }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // delete(promiseArr[response.config.url.replace(response.config.baseURL,'')])
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
      title: '错误',
      message: '网络有误'
    })
    return response
      // 如果不需要除了data之外的数据，可以直接 return response.data
  }else{
    // 这里做一些提示 根据不同的status  如果需要处理的细致的话
  }

}
function success(res) {
  // E020004: 表示没有登录,Token为空 (需跳转到登录页)
  // E020001: 表示Token不为空，但已经失效或不合法 (需跳转到登录页)
  // E020003: 用户无权限 (需跳转到登录页)
  // I010117: 登录错误，n次后将锁定
  // I010104: 初始账户登录时，强制修改密码，去掉右上角的错误提示，对应VICENTER-11727
  if (!res.data.flag && errorCodeArr.indexOf(res.data.errorCode) === -1 && res.config.url.indexOf('upmsapi/user/isLogon') === -1) {
    errorCodeArr.push(res.data.errorCode)
    let message = vm.$t('vicenter.error.'+ res.data.errorCode)
    if (res.data.errorCode === 'I010117') {
      message = vm.$t('vicenter.error.'+ res.data.errorCode, {msg: res.data.result.leftTimes})
    }
    if (res.data.errorCode === 'I010104') {
      return
    }
    Notification.error({
      title: vm.$t('vicenter.common.dataError'),
      message: message,
      onClose: () => {
        for (var i = 0; i < errorCodeArr.length; i++) {
          if(errorCodeArr[i] === res.data.errorCode) {
            errorCodeArr.splice(i, 1)
          }
        }
      }
    })
    if (res.data.errorCode === 'E020001' || res.data.errorCode === 'E020004' || res.data.errorCode === 'E020003') {
      // sessionStorage.clear()
      vm.$clearSession()
      vm.$router.push({path: '/login'})
    }
  }
}
const $axios = (opts, data) => {
    // 去除字符串参数的左右空格
    if (data != null) {
      let keys = Object.keys(data)
      keys.forEach(e => {
        if (typeof(data[e]) === 'string') {
          data[e] = data[e].replace(/(^\s*)|(\s*$)/g, '')
        }
      })
    }
    let Public = {}  //用于存放公共参数，类似于当前用户id等
    let httpTimeout = ''
    if (opts.url.indexOf('/imagelibrary/statistics/getDataForChart') !== -1 || opts.url.indexOf('/imagelibrary/statistics/getDataForTable') !== -1 || opts.url.indexOf('/supervise/tasksearch/exportimgtotil')) {
      httpTimeout = 120000
    } else {
      httpTimeout = config.timeout
    }
    let httpDefaultOpts = { //http默认配置
          baseURL: opts.baseUrl ? opts.baseUrl : config.baseUrl,
          timeout: httpTimeout,
          method:opts.method,
          url: opts.url,
          responseType: "json", // 一般一个网站的responseType 都是一样的
          withCredentials: true, // 是否允许带cookie这些
          arrayFormat: opts.arrayFormat,  //有三个参数 'indices' id[0]=b&id[1]=c  'brackets' 'id[]=b&id[]=c' 'repeat' 'id=b&id=c'
          params:Object.assign(Public, data),
          data:Object.assign(Public, data),
          headers:opts.method === 'post'||opts.method === 'POST'||opts.method === 'put'||opts.method === 'delete'?{
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'X-CSRF-TOKEN': localStorage.getItem('Xcsrftoken'),
            'X-APP-UACCOUNT':sessionStorage.getItem('account')
          }:
          {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'X-CSRF-TOKEN': localStorage.getItem('Xcsrftoken'),
            'X-APP-UACCOUNT':sessionStorage.getItem('account')
          },
          cancelToken: new axios.CancelToken(function (c) {
            cancel = c // 记录当前请求的取消方法
          })
    }
    if(opts.method=='get'){
      delete httpDefaultOpts.data
    }else if(opts.method=='delete'){
      delete httpDefaultOpts.data
    }else{
      delete httpDefaultOpts.params
      httpDefaultOpts.data = qs.stringify(httpDefaultOpts.data,{arrayFormat: httpDefaultOpts.arrayFormat||'indices'})
    }
    // if (httpDefaultOpts.url.indexOf('/api')>-1){
    //   httpDefaultOpts.baseURL = 'http://localhost:8082'
    // } 
    let promise = new Promise(function(resolve, reject) {
      axios(httpDefaultOpts).then(
        (res) => {
          success(res)
          resolve(res)
        }
      ).catch(
        (response) => {
          if(response.code != undefined && response.code === 'ECONNABORTED'){
            Notification.error({
              title: vm.$t('vicenter.common.dataError'),
              message: vm.$t('vicenter.common.timeout'),
              onClose: () => {}
            })
            vm.$closeLoading()
          }
          error(response)
          reject(response)
        }
      )

    })
  return promise
}
export default $axios
