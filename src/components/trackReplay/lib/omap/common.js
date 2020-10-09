/* eslint-disable */
/**
 * Created by liqingxian on 2017/11/27.
 */
/**
 *模拟唯一标识符
 */
function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
/**
 * 判断参数是否为空
 *
 * @param exp
 */
function isNotEmpty (exp) {
  if (exp && typeof (exp) !== 'undefined' && exp !== '') {
    return true
  }
  return false
}
export { guid, isNotEmpty }
