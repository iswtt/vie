/* eslint-disable */
/**
 * Created by zzg on 2017/12/19.
 */
import Vue from 'vue'
import vm from '@/main.js'

Vue.filter('formatDate', function (value,fmts = vm.$t('vicenter.common.formatDate')) {
  // var fmt = 'yyyy-MM-dd HH:mm:ss' 
  var fmt = fmts
  if (value === null || value === '' || value === undefined) {
    return
  }
  var date = new Date(parseInt(value))
  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
    }
    let o = {
    'M+':date.getMonth() + 1,
    'd+':date.getDate(),
    'H+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds()
    };
    
    // 遍历这个对象
    for(let k in o){
    if(new RegExp(`(${k})`).test(fmt)){
     // console.log(`${k}`)
     let str = o[k] + '';
     fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
    }
    }
    return fmt;
})
function padLeftZero(str) {
  return ('00'+str).substr(str.length);
}
Vue.filter('getUTCTime', function (value) {
  if (value === null || value === '' || value === undefined) {
    return
  }
  var value = new Date(value);
  return value;
})
Vue.filter('FileSize', function (size) {
  var result
  switch (true) {
    case (size === null || size === '' || isNaN(size)):
      result = '-'
      break
    case (size >= 0 && size < 1024):
      result = size + ' B'
      break
    case (size >= 1024 && size < Math.pow(1024, 2)):
      result = Math.round(size / 1024 * 100) / 100 + ' K'
      break
    case (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)):
      result = Math.round(size / Math.pow(1024, 2) * 100) / 100 + ' M'
      break
    case (size >= Math.pow(1024, 3) && size < Math.pow(1024, 4)):
      result = Math.round(size / Math.pow(1024, 3) * 100) / 100 + ' G'
      break
    default:
      result = Math.round(size / Math.pow(1024, 4) * 100) / 100 + ' T'
  }
  return result
})
Vue.filter('SpecialFont', function (value) {
  return value.replace(/['"\\/\b\f\n\r\t]/g, '').replace(/[-_,!|~`()#$%^&*{}:;"<>?《》""@+.]/g, '').replace('[', '').replace(']', '')
})
/* MD5加密过滤器 */
Vue.filter('GetMD5', function (value, size) {
  return value.MD5(size)
})
/* 字符串反转过滤器 */
Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})
/* 百分比转换过滤器 */
Vue.filter('numToPercent', function (value, digits) {
  var result
  if (digits === null || digits === undefined) {
    digits = 2
  }
  digits = parseInt(digits)
  if (value === null || value === '' || value === undefined || isNaN(value)) {
    result = '-'
  } else {
    result = Math.round(value * Math.pow(10, digits) * 100) / Math.pow(10, digits) + '%'
  }
  return result
})
/* 货币过滤器 */
Vue.filter('formatAmount', function (value, symbol) {
  var result
  if (value === null || value === '' || value === undefined || isNaN(value) || /\D+\.\D+/.test(value)) {
    return '-'
  }
  value = value.replace(/^0*[-+]*0*/, '')
  value = value.replace(/\s/g, '')
  value = value.replace(/^(\d*)$/, '$1.')
  value = (value + '00').replace(/(\d*\.\d\d)\d*/, '$1')
  value = value.replace('.', ',')
  var re = /(\d)(\d{3},)/
  while (re.test(value)) {
    value = value.replace(re, '$1,$2')
  }
  value = value.replace(/,(\d\d)$/, '.$1')
  result = symbol + value.replace(/^\./, '0.')
  return result
})
Vue.filter('frequencyType', function (value) {
  var a = '';
  switch (value){
    case '0': a = vm.$t('vicenter.common.filter.frequencyType.time');break;
    case '1': a = vm.$t('vicenter.common.filter.frequencyType.num');break;
    default: a='未知错误'
  }
  return a;
})
Vue.filter('difficulty', function (value) {
  var a = '';
  switch (value){
    case '1': a = vm.$t('vicenter.common.filter.difficulty.easy');break;
    case '2': a = vm.$t('vicenter.common.filter.difficulty.diff');break;
    default: a= vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('status', function (value) {
  var a = '';
  switch (value){
    case '0': a = vm.$t('vicenter.common.filter.status.notstart');break;
    case '1': a = vm.$t('vicenter.common.filter.status.starting');break;
    case '2': a = vm.$t('vicenter.common.filter.status.expirestop');break;
    case '3': a = vm.$t('vicenter.common.filter.status.forcestop');break;
    default: a= vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('conclusion', function (value) {
  var a = '';
  switch (value){
    case '0': a = vm.$t('vicenter.common.filter.conclusion.suspect');break;
    case '1': a = vm.$t('vicenter.common.filter.conclusion.noSuspect');break;
    case '2': a = vm.$t('vicenter.common.filter.conclusion.quit');break;
    default: a= ''
  }
  return a;
})
Vue.filter('frequency', function (value,type) {
  var a = '';
  switch (type){
    case '0': a = value+ vm.$t('vicenter.common.filter.frequency.min');break;
    case '1': a = value+ vm.$t('vicenter.common.filter.frequency.time');break;
    default: a= vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('yesOrNo', function (value) {
  var a = '';
  switch (value){
    case '1': a = vm.$t('vicenter.common.filter.yesOrNo.yes');break;
    case '0': a = vm.$t('vicenter.common.filter.yesOrNo.no');break;
    default: a = ''
  }
  return a;
})
Vue.filter('attachType', function (value) {
  var a = '';
  switch (value){
    case 'jpg':
    // case 'tif':
    case 'png':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'JPG':
    case 'JPEG':
    case 'GIF':
    // case 'img': 
    case 'BMP': a = 'img';break;
    case 'avi':
    case 'rmvb':
    case 'rm':
    case 'mpg':
    case 'mpeg':
    case 'flv':
    case 'wmv': a = 'videoDownLoad';break;
    case 'webm':
    // case 'avi':
    case 'mp4': a = 'video';break;
    case 'txt': a = 'txt';break;
    case 'xml': a = 'xml';break;
    case 'pdf': a = 'pdf';break;
    case 'doc': a = 'doc';break;
    case 'docx': a = 'docx';break;
    case 'xls': a = 'xls';break;
    case 'xlsx': a = 'xlsx';break;
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'wma': a = 'audio';break;
    case 'rar':
    case 'zip':
    case '7z':
    case 'jar':
    case 'tar': a = 'compressedFile';break;
    default: a = 'other'
  }
  return a;
})
Vue.filter('taskStatus', function (value) {
  var a = '';
  switch (value){
    case 'SUBMIT': a = vm.$t('vicenter.common.filter.taskStatus.submit');break;
    case 'WAITING_SCAN': a = vm.$t('vicenter.common.filter.taskStatus.waitingScan');break;
    case 'WAITING_IMAGE_CHECK': a = vm.$t('vicenter.common.filter.taskStatus.waitingImgCheck');break;
    case 'IMAGE_CHECK_LOCKED': a = vm.$t('vicenter.common.filter.taskStatus.imgCheckLocked');break;
    default: a=vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('concImgcheckFlag', function (value) {
  var a = '';
  switch (value){
    case '2': a = vm.$t('vicenter.inspection.history.concImgcheckLocal');break;
    case '1': a = vm.$t('vicenter.inspection.history.concImgcheckCenter');break;
    default: a=vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('tipImgManageStatus', function (value) {
  var a = '';
  switch (value){
    case '0': a = vm.$t('vicenter.tip.imageStatistics.notRelease');break;
    case '1': a = vm.$t('vicenter.tip.imageStatistics.release');break;
    default: a=vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('tipImgManageType', function (value) {
  var a = '';
  switch (value){
    case '1': a = vm.$t('vicenter.tip.imageStatistics.singleEnergy');break;
    case '2': a = vm.$t('vicenter.tip.imageStatistics.doubleEnergy');break;
    default: a=vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('tipImgManageSource', function (value) {
  var a = '';
  switch (value){
    case 'local': a = vm.$t('vicenter.tip.imageManagement.local');break;
    case 'ins': a = vm.$t('vicenter.tip.imageManagement.ins');break;
    case 'imageLibrary': a = vm.$t('vicenter.tip.imageManagement.imageLibrary');break;
    default: a=vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('getTimeStamp', function (value, type) {
  let time = Date.parse(new Date(value))
  let format = 'MM/dd/yyyy'
  time = vm.$options.filters['formatDate'](time, format)
  switch (type){
    case 'day': time = time;break;
    case 'month': time = time;break;    
    case 'year': format = 'yyyy';break;
  }
  time = Date.parse(time)
  return time;
})
Vue.filter('tamperedPosition', function (value) {
  var a = '';
  switch (value){
    case '1': a = vm.$t('vicenter.inspection.tamperingRecord.center');break;
    case '2': a = vm.$t('vicenter.inspection.tamperingRecord.locale');break;
    case '3': a = vm.$t('vicenter.inspection.tamperingRecord.all');break;
    case '4': a = vm.$t('vicenter.inspection.tamperingRecord.notVerified');break;
    default: a=vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('noticeStatus', function (value) {
  var a = '';
  switch (value){
    case '1': a = vm.$t('vicenter.inspection.tamperingRecord.notice');break;
    case '0': a = vm.$t('vicenter.inspection.tamperingRecord.unNotice');break;
    default: a=vm.$t('vicenter.common.filter.error')
  }
  return a;
})
Vue.filter('deviceStatus', function (value) {
  var a = '';
  switch (value){
    case '0': a = vm.$t('vicenter.supervise.deviceStatus.running');break;
    case '1': a = vm.$t('vicenter.supervise.deviceStatus.ready');break;
    case '2': a = vm.$t('vicenter.supervise.deviceStatus.notReady');break;
    case '3': a = vm.$t('vicenter.supervise.deviceStatus.error');break;
    case '4': a = vm.$t('vicenter.supervise.deviceStatus.offline');break;
    default: a=''
  }
  return a;
})