import Button from '../index'
import Icon from '../../icon'
import { mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
import Vue from 'vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = renderToString({
      render () {
        return <Button>Follow</Button>
      },
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('create primary button', () => {
    const wrapper = mount({
      render (h) {
        return <Button type='primary'>按钮</Button>
      },
    })
    expect(wrapper.contains('.ant-btn-primary')).toBe(true)
  })

  it('renders Chinese characters correctly', (done) => {
    const wrapper = mount(
      {
        render (h) {
          return <Button>按钮</Button>
        },
      }
    )
    expect(wrapper.text()).toBe('按 钮')

    const wrapper1 = renderToString(
      {
        render (h) {
          return <Button icon='search'>按钮</Button>
        },
      }
    )
    expect(wrapper1).toMatchSnapshot()

    const wrapper2 = renderToString(
      {
        render (h) {
          return <Button><Icon type='search' />按钮</Button>
        },
      }
    )
    expect(wrapper2).toMatchSnapshot()

    const wrapper3 = mount(
      {
        render (h) {
          return <Button><span>按钮</span></Button>
        },
      }
    )
    Vue.nextTick(() => {
      expect(wrapper3.find('.ant-btn').contains('.ant-btn-two-chinese-chars')).toBe(true)
      done()
    })
  })
  it('should change loading state instantly by default', () => {
    const DefaultButton = {
      data () {
        return {
          loading: false,
        }
      },
      methods: {
        enterLoading () {
          this.loading = true
        },
      },

      render () {
        return <Button loading={this.loading} onClick={this.enterLoading}>Button</Button>
      },
    }
    const wrapper = mount(DefaultButton)
    wrapper.trigger('click')
    Vue.nextTick(() => {
      expect(wrapper.findAll('.ant-btn-loading').length).toBe(1)
    })
  })

  it('should change loading state with delay', (done) => {
    const DefaultButton = {
      data () {
        return {
          loading: false,
        }
      },
      methods: {
        enterLoading () {
          this.loading = { delay: 1000 }
        },
      },

      render () {
        return <Button loading={this.loading} onClick={this.enterLoading}>Button</Button>
      },
    }
    const wrapper = mount(DefaultButton)
    wrapper.trigger('click')
    Vue.nextTick(() => {
      expect(wrapper.contains('.ant-btn-loading')).toBe(false)
      done()
    })
  })

  it('should support link button', () => {
    const wrapper = mount({
      render (h) {
        return <Button target='_blank' href='http://ant.design'>link button</Button>
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('fixbug renders {0} , 0 and {false}', () => {
    const wrapper = mount({
      render (h) {
        return <Button>{0}</Button>
      },
    })
    expect(wrapper.html()).toMatchSnapshot()

    const wrapper1 = mount({
      render (h) {
        return <Button>0</Button>
      },
    })
    expect(wrapper1.html()).toMatchSnapshot()

    const wrapper2 = mount({
      render (h) {
        return <Button>{false}</Button>
      },
    })
    expect(wrapper2.html()).toMatchSnapshot()
  })
})
