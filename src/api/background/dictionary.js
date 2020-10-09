import $axios from '@/components/axios.js'
let pre = '/management'
export default {
  dictionaryTreeParams () { // 查询运行参数
    const service = {
      method: 'GET',
      url: pre + '/dictionary/typetree'
    }
    return $axios(service)
  },
  getDictionaryList (data) { // 查询运行参数
    const service = {
      method: 'POST',
      url: pre + '/dictionary/list'
    }
    return $axios(service, data)
  },
  addDictionaryList (data) { // 查询运行参数
    const service = {
      method: 'POST',
      url: pre + '/dictionary/add'
    }
    return $axios(service, data)
  },
  updateDictionaryList (data) {
    const service = {
      method: 'POST',
      url: pre + '/dictionary/update'
    }
    return $axios(service, data)
  },
  deleteDictionaryList (data) { // 查询运行参数
    const service = {
      method: 'POST',
      url: pre + '/dictionary/delete'
    }
    return $axios(service, data)
  },
  getDataByTypecode (data) {
    const service = {
      method: 'POST',
      url: pre + '/dictionary/finddicbytypecode'
    }
    return $axios(service, data)
  },
  getDictionaryDetail (data) {
    const service = {
      method: 'POST',
      url: pre + '/dictionary/detail'
    }
    return $axios(service, data)
  }
}
