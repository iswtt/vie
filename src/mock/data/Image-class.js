const Mock = require('mockjs')

let imagecategoryList = []
const Count = [1, 2, 3, 4, 5]
for (let i = 1; i <= Count.length; i++) {
  imagecategoryList.push(Mock.mock({
    flag: true,
    message: 'ok',
    errorCode: '',
    'result|1-10': [{
      'pcode': Mock.Random.guid(),
      'code': Mock.Random.guid(),
      'name': '图像分类' + Mock.Random.integer(1, 10),
      'desc': '图像分类' + Mock.Random.integer(1, 10),
      'children': Count.map(() => {
        return {
          'pcode': Mock.Random.guid(),
          'code': Mock.Random.guid(),
          'name': '图像分类' + Mock.Random.integer(1, 10),
          'desc': '图像分类' + Mock.Random.integer(1, 10)
        }
      })
    }]
  }))
}
// 用户信息
let userList = []
for (let i = 1; i <= Count.length; i++) {
  userList.push(Mock.mock({
    userId: Mock.Random.guid(),
    examinee: Mock.Random.cfirst() + Mock.Random.cname(),
    account: 'admin' + i,
    password: '123456',
    id: Mock.Random.guid(),
    userName: Mock.Random.cfirst() + Mock.Random.cname(),
    orgId: Mock.Random.guid()
  }))
}
// 考核名称
let examList = []
let examNameData = []
let examNameData1 = []
for (let i = 1; i <= Count.length; i++) {
  examList.push(Mock.mock('考核' + i))
}
for (let i = 1; i <= Count.length; i++) {
  examNameData.push(Mock.mock(
    Mock.Random.natural(1, 100)
  ))
  examNameData1.push(Mock.mock(
    Mock.Random.natural(1, 100)
  ))
}

// 图像分类树
let ImageClass = []
for (let i = 1; i <= Count.length; i++) {
  let code = Mock.Random.guid()
  let children = []
  for (let k = 1; k <= Count.length; k++) {
    children.push(Mock.mock({
      'pcode': code,
      'code': Mock.Random.guid(),
      'name': '货物' + i + k + Mock.Random.integer(10, 100),
      'desc': '货物' + i + k + Mock.Random.integer(10, 100),
      children: []
    }))
  }
  ImageClass.push(Mock.mock({
    'pcode': 0,
    'code': code,
    'name': '图像分类' + i,
    'desc': '图像分类' + Mock.Random.integer(1, 10),
    children: children
  }))
}
export {
  imagecategoryList,
  examList,
  userList,
  examNameData,
  examNameData1,
  ImageClass
}
