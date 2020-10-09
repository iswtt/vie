// import Vue from 'vue'
import welcome from '@/views/tip/welcome'

describe('welcome.vue', () => {
  it('标题是否正确', () => {
    expect(welcome.data().message).toBe('危险图像投影系统')
  })
})
