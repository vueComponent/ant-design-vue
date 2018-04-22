import Button from '../index'
import {mount} from 'avoriaz'

describe('Button', () => {
  let wrapper

  afterEach(() => {
    wrapper && wrapper.destroy()
  })
  it('create primary button', () => {
    wrapper = mount(Button, {
      propsData: {
        type: 'primary',
      },
    })
    expect(wrapper.hasClass('ant-btn-primary')).to.equal(true)
  })
})
