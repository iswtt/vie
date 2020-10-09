/**
 * 格式化数据
 * @param {*} filterFields 过滤的字段
 * @param {*} jsonData 数组数据
 */
const formatJson = (filterFields, jsonData) => {
  return jsonData.map(v => filterFields.map(j => v[j]))
}
/**
 * 导出excel工具方法
 * @param {*} exportArray 需要导出的数组
 * @param {*} tHeader 导出excel的表头
 * @param {*} filterFields 过滤数组的字段
 */
const export2Excel = ({ exportArray, tHeader, filterFields, fileName, multipleTables = [] }) => {
  // console.log('is coming')
  require.ensure([], () => {
    const { exportJson2Excel } = require('./excel/Export2Excel')
    const data = formatJson(filterFields, exportArray)
    data.forEach(e => {
      e.forEach((content, index) => {
        e[index] = content + ''
      })
    })
    if (multipleTables && multipleTables.length > 0) {
      multipleTables.forEach(item => {
        item.data = formatJson(item.filterFields, item.exportArray)
      })
    }
    exportJson2Excel(tHeader, data, fileName, multipleTables)
  })
}
export default export2Excel
