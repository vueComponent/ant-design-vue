import Button from '../index'
import Icon from '../../icon'
import { mount } from 'avoriaz'
import Vue from 'vue'

describe('Button', () => {
  it('create primary button', () => {
    const wrapper = mount({
      render (h) {
        return <Button type='primary'>按钮</Button>
      },
    })
    expect(wrapper.hasClass('ant-btn-primary')).to.equal(true)
  })
  it('renders Chinese characters correctly', (done) => {
    const wrapper = mount(
      {
        render (h) {
          return <Button>按钮</Button>
        },
      }
    )
    expect(wrapper.text()).to.equal('按 钮')

    const wrapper1 = mount(
      {
        render (h) {
          return <Button icon='search'>按钮</Button>
        },
      }
    )
    expect(wrapper1.text()).to.equal('按钮')

    const wrapper2 = mount(
      {
        render (h) {
          return <Button><Icon type="search" />按钮</Button>
        },
      }
    )
    expect(wrapper2.text()).to.equal('按钮')

    const wrapper3 = mount(
      {
        render (h) {
          return <Button><span>按钮</span></Button>
        },
      }
    )
    Vue.nextTick(() => {
      expect(wrapper3.find('.ant-btn')[0].hasClass('ant-btn-two-chinese-chars')).to.equal(true);
      done()
    })
  })

})
