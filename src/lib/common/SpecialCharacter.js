/* 特殊字符 */
import vm from '@/main.js'

const specialCharaters = {
  common: '@#$%^&*{}[]<>?￥……',
  email: '#$%^&*{}[]<>?￥……',
  tel: /^((00|\+)\d{2,3}[- ])?\d{3,4}[- ]?\d{4}$/
}
const validator = {
  common: (rule, value, callback) => {
    if (value && value.length > 0) {
      let msg = ''
      let arr = value.split('')
      for (let i in arr) {
        if (specialCharaters.common.indexOf(arr[i]) >= 0 && msg.indexOf(arr[i]) < 0) {
          msg += arr[i]
        }
      }
      if (msg) {
        callback(new Error(vm.$t('vicenter.common.notHave', {msg: msg})))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  email: (rule, value, callback) => {
    if (value && value.length > 0) {
      let msg = ''
      let arr = value.split('')
      for (let i in arr) {
        if (specialCharaters.email.indexOf(arr[i]) >= 0 && msg.indexOf(arr[i]) < 0) {
          msg += arr[i]
        }
      }
      if (msg) {
        callback(new Error(vm.$t('vicenter.common.notHave', {msg: msg})))
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
  tel: (rule, value, callback) => {
    if (!value) {
      return callback()
    }
    if (value) {
      setTimeout(() => {
        var reg = specialCharaters.tel
        if (!reg.test(value)) {
          callback(new Error(vm.$t('vicenter.common.telErr')))
        } else {
          callback()
        }
      }, 100)
    }
  }
}

export default validator
