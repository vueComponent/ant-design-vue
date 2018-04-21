import Vue from 'vue'
import Button from '../index'

describe('Button.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Button)
    const ele = document.createElement('div')
    document.body.appendChild(ele)
    const vm = new Constructor({ propsData: { type: 'primary' }})
    vm.$mount(ele)
    expect(vm.$el.classList.contains('ant-btn-primary'))
      .to.equal(true)
  })
})
