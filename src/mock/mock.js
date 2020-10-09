import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Mock from 'mockjs'
import {
  userList,
  examList,
  examNameData,
  examNameData1,
  ImageClass
} from './data/Image-class'
import {
  portArray,
  typeArray,
  timeArray
} from './data/supervise-statics'
const Random = Mock.Random

function getUrlPrmt (url) {
  let _pa = url.substring(url.indexOf('?') + 1)
  let _arrS = _pa.split('&')
  let _rs = {}
  for (let i = 0, _len = _arrS.length; i < _len; i++) {
    let pos = _arrS[i].indexOf('=')
    if (pos === -1) {
      continue
    }
    let name = _arrS[i].substring(0, pos)
    let value = window.decodeURIComponent(_arrS[i].substring(pos + 1))
    _rs[name] = value
  }
  return _rs
}
var mock
export default {
  init () {
    mock = new MockAdapter(axios)
  },
  start () {
    /**
     *
     * @author zhuzhiguo
     * @description 用于模拟用户登录
     * @param {object} userInfo: 用于展示后台传递的数据
     */
    mock.onPost('/TIP/user/login').reply(config => {
      let {username, password} = getUrlPrmt(config.data)
      console.log(username, password)
      return new Promise((resolve, reject) => {
        let userInfo = null
        let hasUser = userList.some(e => {
          if (e.account === username && e.password === password) {
            userInfo = JSON.parse(JSON.stringify(e))
            delete e.password
            return true
          }
        })
        if (hasUser) {
          resolve([200, {
            flag: true,
            message: 'ok',
            errorCode: '',
            result: userInfo
          }])
        } else {
          resolve([200, {
            flag: false,
            message: '账号或密码错误',
            errorCode: '',
            result: ''
          }])
        }
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于模拟用户登出
     * @param {object} logOutData: 用于展示后台传递的数据
     */
    mock.onPost('/TIP/user/logout').reply(config => {
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: ''
        }])
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于模拟图像状态分布图
     * @param {object} ImageStatusData: 用于展示后台传递的数据
     */
    mock.onGet('/TIP/statistics/status').reply(config => {
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: {
            category: ['草稿', '已发布'],
            data: [Random.natural(0, 100), Random.natural(0, 100)]
          }
        }])
      })
    })

    /**
     *
     * @author zhuzhiguo
     * @description 用于模拟图像类型分布图
     * @param {object} ImageTypeData: 用于展示后台传递的数据
     */
    mock.onGet('/TIP/statistics/type').reply(config => {
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: {
            category: ['单能', '双能'],
            data: [Random.natural(0, 100), Random.natural(0, 100)]
          }
        }])
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于根据考核名称统计
     * @param {object} ImageTypeData: 用于展示后台传递的数据
     */
    mock.onGet('/TIP/statistics/examname').reply(config => {
      let {name} = config.params
      return new Promise((resolve, reject) => {
        let hasType = examList.some(e => {
          if (e === name) {
            return true
          }
        })
        let userName = []
        userList.forEach(e => {
          userName.push(e.userName)
        })
        if (name === undefined || name === '') {
          resolve([200, {
            flag: true,
            message: 'ok',
            errorCode: '',
            result: {
              'userid': userName,
              'data': examNameData
            }
          }])
        } else if (hasType) {
          resolve([200, {
            flag: true,
            message: 'ok',
            errorCode: '',
            result: {
              'userid': userName,
              'data': examNameData1
            }
          }])
        } else {
          resolve([200, {
            flag: true,
            message: 'ok',
            errorCode: '',
            result: {
              'userid': [],
              'data': []
            }
          }])
        }
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于根据考核名称统计
     * @param {Array} queryexamineelist: 用于展示后台传递的数据
     */
    mock.onGet('/TIP/exam/queryexamineelist').reply(config => {
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: userList
        }])
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于根据考核人员统计
     * @param {object} examineeData: 用于展示后台传递的数据
     */
    mock.onGet('/TIP/statistics/examinee').reply(config => {
      let {name} = config.params
      return new Promise((resolve, reject) => {
        let result = {
          examinee: [],
          date: ['2017-07', '2017-08', '2017-09', '2017-10', '2017-11']
        }
        if (name === undefined || name.length === 0) {
          userList.forEach(e => {
            result.examinee.push(e.examinee)
            result[e.examinee] = []
          })
        } else {
          userList.forEach(e => {
            for (var i in name) {
              if (name[i] === e.id) {
                result.examinee.push(e.examinee)
                result[e.examinee] = []
              }
            }
          })
        }
        for (var i = 0; i < 6; i++) {
          for (var k in result.examinee) {
            result[result.examinee[k]].push(Random.natural(1, 100))
          }
        }
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: result
        }])
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于获取图像类别树
     * @param {Array} queryListData: 用于展示后台传递的数据
     */
    mock.onGet('/TIP/imagecategory/queryList').reply(config => {
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: ImageClass
        }])
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于获取图像类别树详情
     * @param {object} queryData: 用于展示后台传递的数据
     */
    mock.onGet('/TIP/imagecategory/query').reply(config => {
      let {code} = config.params
      return new Promise((resolve, reject) => {
        var object
        function getTree (val) {
          for (var i in val) {
            if (val[i].children.length > 0) {
              getTree(val[i].children)
            }
            if (val[i].code === code) {
              object = val[i]
              return
            }
          }
        }
        getTree(ImageClass)
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: object
        }])
      })
    })
    /**
     *
     * @author zhuzhiguo
     * @description 用于获取图像类别树修改
     * @param {object} ImageAddData: 用于展示后台传递的数据
     */
    mock.onPost('/TIP/imagecategory/update').reply(config => {
      let {code, name, desc} = getUrlPrmt(config.data)
      return new Promise((resolve, reject) => {
        function getTree (val) {
          for (var i in val) {
            if (val[i].children.length > 0) {
              getTree(val[i].children)
            }
            if (val[i].code === code) {
              val[i].code = code
              val[i].name = name
              val[i].desc = desc
              return
            }
          }
        }
        getTree(ImageClass)
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: ''
        }])
      })
    })
    /**
      *
      * @author zhuzhiguo
      * @description 用于获取图像类别树添加
      * @param {object} queryData: 用于展示后台传递的数据
      */
    mock.onPost('/TIP/imagecategory/add').reply(config => {
      let {code, name, desc, pcode} = getUrlPrmt(config.data)
      return new Promise((resolve, reject) => {
        function getTree (val) {
          for (var i in val) {
            if (val[i].children.length > 0) {
              getTree(val[i].children)
            }
            if (val[i].code === pcode) {
              val[i].children.push({
                code: code,
                name: name,
                desc: desc,
                pcode: val[i].code,
                children: []
              })
              return
            }
          }
        }
        getTree(ImageClass)
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: ''
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于获取图像类别树删除
    * @param {object} ImageAddData: 用于展示后台传递的数据
    */
    mock.onDelete('/TIP/imagecategory/delete').reply(config => {
      let {code} = config.params
      return new Promise((resolve, reject) => {
        function getTree (val) {
          for (var i in val) {
            if (val[i].children.length > 0) {
              getTree(val[i].children)
            }
            if (val[i].code === code) {
              val.splice(i, 1)
              return
            }
          }
        }
        getTree(ImageClass)
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: ''
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于模拟业务量统计表的查询
    * @param {Array} staticsArray: 用于展示后台传递的数据
    */
    mock.onGet('/surpervise/task/Statistics').reply(config => {
      var staticsArray = {}
      var port = []
      var type = []
      var data = []
      if (config.params.dimension === 'type') {
        portArray.forEach(e => {
          port.push(e.label)
        })
        typeArray.forEach(e => {
          if (config.params.type.length === 0) {
            type.push(e.label)
          } else {
            for (var i in config.params.type) {
              if (e.value === config.params.type[i]) {
                type.push(e.label)
              }
            }
          }
        })
        for (var i = 0; i < type.length; i++) {
          var obj = {}
          for (var k in port) {
            obj[port[k]] = Random.natural(100, 500)
          }
          data.push(obj)
        }
        staticsArray = {
          dimension: config.params.dimension,
          type: type,
          port: port,
          data: data
        }
      } else {
        typeArray.forEach(e => {
          type.push(e.label)
        })
        portArray.forEach(e => {
          if (config.params.port.length === 0) {
            port.push(e.label)
          } else {
            for (var i in config.params.port) {
              if (e.value === config.params.port[i]) {
                port.push(e.label)
              }
            }
          }
        })
        for (var m = 0; m < port.length; m++) {
          var obj2 = {}
          for (var z in type) {
            obj2[type[z]] = Random.natural(100, 500)
          }
          data.push(obj2)
        }
        staticsArray = {
          dimension: config.params.dimension,
          port: port,
          type: type,
          data: data
        }
      }
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: staticsArray
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于模拟业务量表格的查询
    * @param {Array} staticsArray: 用于展示后台传递的数据
    */
    mock.onGet('/surpervise/task/table').reply(config => {
      var staticsArray = {}
      var port = []
      var type = []
      var data = []
      if (config.params.dimension === 'type') {
        if (config.params.type.length === 0) {
          type = typeArray
        } else {
          for (var q in config.params.type) {
            typeArray.forEach(e => {
              if (config.params.type[q] === e.value) {
                type.push(e)
              }
            })
          }
        }
        for (var i in portArray) {
          var obj = {}
          for (var k in type) {
            obj[[type[k].value]] = Random.natural(100, 500)
          }
          obj.port = portArray[i].label
          data.push(obj)
        }
        staticsArray = {
          dimension: config.params.dimension,
          data: data,
          type: type,
          port: portArray
        }
      } else if (config.params.dimension === 'port') {
        if (config.params.port.length === 0) {
          port = portArray
        } else {
          for (var w in config.params.port) {
            portArray.forEach(e => {
              if (config.params.port[w] === e.value) {
                port.push(e)
              }
            })
          }
        }
        for (var a in typeArray) {
          var obj2 = {}
          for (var s in port) {
            obj2[[port[s].value]] = Random.natural(100, 500)
          }
          obj2.type = typeArray[a].label
          data.push(obj2)
        }
        staticsArray = {
          dimension: config.params.dimension,
          data: data,
          port: port,
          type: typeArray
        }
      } else {
        if (config.params.port.length === 0) {
          port = portArray
        } else {
          for (var l in config.params.port) {
            portArray.forEach(e => {
              if (config.params.port[l] === e.value) {
                port.push(e)
              }
            })
          }
        }
        if (config.params.type.length === 0) {
          type = typeArray
        } else {
          for (var u in config.params.type) {
            typeArray.forEach(e => {
              if (config.params.type[u] === e.value) {
                type.push(e)
              }
            })
          }
        }
        for (var g in type) {
          var obj5 = {}
          for (var qw in port) {
            obj5[[port[qw].value]] = Random.natural(100, 500)
          }
          obj5.type = typeArray[g].label
          data.push(obj5)
        }
        staticsArray = {
          dimension: config.params.dimension,
          data: data,
          port: port,
          type: typeArray
        }
      }
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: staticsArray
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于模拟嫌疑量统计表的查询
    * @param {Array} staticsArray: 用于展示后台传递的数据
    */
    mock.onGet('/surpervise/suspicition/Statistics').reply(config => {
      var staticsArray = {}
      var port = []
      var type = []
      var data = []
      if (config.params.dimension === 'type') {
        typeArray.forEach(e => {
          if (config.params.type.length === 0) {
            type.push(e.label)
          } else {
            for (var i in config.params.type) {
              if (e.value === config.params.type[i]) {
                type.push(e.label)
              }
            }
          }
        })
        for (var i in type) {
          var obj = {
            'weid': type[i],
            'tongj': Random.natural(500, 2000)
          }
          data.push(obj)
        }
        staticsArray = {
          dimension: config.params.dimension,
          data: data
        }
      } else if (config.params.dimension === 'port') {
        portArray.forEach(e => {
          if (config.params.port.length === 0) {
            port.push(e.label)
          } else {
            for (var i in config.params.port) {
              if (e.value === config.params.port[i]) {
                port.push(e.label)
              }
            }
          }
        })
        for (var k in port) {
          var obj2 = {
            'weid': port[k],
            'tongj': Random.natural(500, 2000)
          }
          data.push(obj2)
        }
        staticsArray = {
          dimension: config.params.dimension,
          data: data
        }
      } else {
        portArray.forEach(e => {
          if (config.params.port.length === 0) {
            port.push(e.label)
          } else {
            for (var i in config.params.port) {
              if (e.value === config.params.port[i]) {
                port.push(e.label)
              }
            }
          }
        })
        typeArray.forEach(e => {
          if (config.params.type.length === 0) {
            type.push(e.label)
          } else {
            for (var i in config.params.type) {
              if (e.value === config.params.type[i]) {
                type.push(e.label)
              }
            }
          }
        })
        for (var m = 0; m < port.length; m++) {
          var obj3 = {}
          for (var n in type) {
            obj3[type[n]] = Random.natural(100, 500)
          }
          data.push(obj3)
        }
        staticsArray = {
          dimension: config.params.dimension,
          type: type,
          port: port,
          data: data
        }
      }
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: staticsArray
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于模拟物流统计表的查询
    * @param {Array} staticsArray: 用于展示后台传递的数据
    */
    mock.onGet('/surpervise/Logistics/Statistics').reply(config => {
      var staticsArray = {}
      var port = []
      var type = []
      var data = []
      portArray.forEach(e => {
        if (config.params.port.length === 0) {
          port.push(e.label)
        } else {
          for (var i in config.params.port) {
            if (e.value === config.params.port[i]) {
              port.push(e.label)
            }
          }
        }
      })
      for (var k in port) {
        var obj2 = {
          'diq': port[k],
          'tongj': Random.natural(500, 2000)
        }
        data.push(obj2)
      }
      staticsArray = {
        dimension: config.params.dimension,
        data: data
      }
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: staticsArray
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于模拟物流统计表格的查询
    * @param {Array} staticsArray: 用于展示后台传递的数据
    */
    mock.onGet('/surpervise/Logistics/table').reply(config => {
      var staticsArray = {}
      var port = []
      var data = []
      if (config.params.port.length === 0) {
        port = portArray
      } else {
        for (var q in config.params.port) {
          portArray.forEach(e => {
            if (config.params.port[q] === e.value) {
              port.push(e)
            }
          })
        }
      }
      for (var i in port) {
        var obj = {
          port: port[i].label,
          total: Random.natural(100, 500)
        }
        data.push(obj)
      }
      staticsArray = {
        dimension: config.params.dimension,
        data: data
      }
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: staticsArray
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于模拟通关效率统计表的查询
    * @param {Array} staticsArray: 用于展示后台传递的数据
    */
    mock.onGet('/surpervise/Clearance/Statistics').reply(config => {
      var staticsArray = {}
      var port = []
      var times = []
      var data = []
      timeArray.forEach(e => {
        if (config.params.type.length === 0) {
          times.push(e.label)
        } else {
          for (var i in config.params.type) {
            if (e.value === config.params.type[i]) {
              times.push(e.label)
            }
          }
        }
      })
      portArray.forEach(e => {
        if (config.params.port.length === 0) {
          port.push(e.label)
        } else {
          for (var i in config.params.port) {
            if (e.value === config.params.port[i]) {
              port.push(e.label)
            }
          }
        }
      })
      for (var m = 0; m < port.length; m++) {
        var obj2 = {}
        for (var z in times) {
          obj2['port'] = port[m]
          obj2[times[z]] = Random.natural(10, 30)
        }
        data.push(obj2)
      }
      staticsArray = {
        dimension: config.params.dimension,
        port: port,
        time: times,
        data: data
      }
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: staticsArray
        }])
      })
    })
    /**
    *
    * @author zhuzhiguo
    * @description 用于模拟通关效率表格的查询
    * @param {Array} staticsArray: 用于展示后台传递的数据
    */
    mock.onGet('/surpervise/Clearance/table').reply(config => {
      var staticsArray = {}
      var port = []
      var data = []
      var time = []
      portArray.forEach(e => {
        if (config.params.port.length === 0) {
          port.push(e)
        } else {
          for (var i in config.params.port) {
            if (e.value === config.params.port[i]) {
              port.push(e)
            }
          }
        }
      })
      if (config.params.type.length === 0) {
        time = timeArray
      } else {
        for (var w in config.params.type) {
          timeArray.forEach(e => {
            if (config.params.type[w] === e.value) {
              time.push(e)
            }
          })
        }
      }
      for (var a in time) {
        var obj2 = {}
        for (var s in port) {
          obj2[[port[s].value]] = Random.natural(10, 30)
        }
        obj2.type = time[a].label
        data.push(obj2)
      }
      staticsArray = {
        dimension: config.params.dimension,
        data: data,
        port: port
      }
      return new Promise((resolve, reject) => {
        resolve([200, {
          flag: true,
          message: 'ok',
          errorCode: '',
          result: staticsArray
        }])
      })
    })
    mock.onAny().passThrough()
  },
  destroyed () {
    mock.restore()
  }
}
