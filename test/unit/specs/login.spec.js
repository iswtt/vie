// // import Vue from 'vue'
// import { shallowMount, createLocalVue } from '@vue/test-utils'
// import Vuex from 'vuex'
// import login from '@/views/common/login'

// const localVue = createLocalVue()

// localVue.use(Vuex)

// describe('开始登录界面测试', () => {
//   // 评估登录组件原始类型值
//   it('判断数据类型是否正确', () => {
//     let actions
//     let store

//     beforeEach(() => {
//       actions = {
//         actionClick: jest.fn(),
//         actionInput: jest.fn()
//       }
//       store = new Vuex.Store({
//         state: {},
//         actions
//       })
//     })
//     expect(typeof login.data).toBe('function')
//     expect(typeof login.beforeCreate).toBe('function')
//     expect(typeof login.activated).toBe('function')
//     expect(loginCom.data.abc).toEqual('123')
//     // const DefaultData = login.data()
//     // expect(typeof DefaultData.rule.username).toBe('array')
//     // expect(typeof DefaultData.loginRule).toBe('object')
//     // expect(typeof DefaultData.LangOption).toBe('array')
//   })
//   it('mounted类型是否正确', () => {
//     expect(typeof login.mounted).toBe('function')
//     // let vm = new Vue(login).$mount()
//     // expect( vm.abc).toEqual('123')
//     // expect(vm.loginRule).toEqual(expect.arrayContaining(['zh-CN', 'en-US']))
//   })
//   it('methods类型是否正确', () => {
//     expect(typeof login.methods).toBe('object')
//   })
//   it('components类型是否正确', () => {
//     expect(typeof login.components).toBe('object')
//   })
//   it('watch类型是否正确', () => {
//     expect(typeof login.watch).toBe('object')
//   })
// })
