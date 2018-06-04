import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Anchor from '..'

const { Link } = Anchor

describe('Anchor Render', () => {
  it('Anchor render perfectly', (done) => {
    const wrapper = mount({
      render () {
        return (
          <Anchor ref='anchor'>
            <Link href='#API' title='API' />
          </Anchor>
        )
      },
    }, { sync: false })
    Vue.nextTick(() => {
      wrapper.find('a[href="#API"]').trigger('click')
      wrapper.vm.$refs.anchor.handleScroll()
      expect(wrapper.vm.$refs.anchor.$data.activeLink).not.toBe(null)
      done()
    })
  })

  it('Anchor render perfectly for complete href - click', (done) => {
    const wrapper = mount({
      render () {
        return (
          <Anchor ref='anchor'>
            <Link href='http://www.example.com/#API' title='API' />
          </Anchor>
        )
      },
    }, { sync: false })
    Vue.nextTick(() => {
      wrapper.find('a[href="http://www.example.com/#API"]').trigger('click')
      expect(wrapper.vm.$refs.anchor.$data.activeLink).toBe('http://www.example.com/#API')
      done()
    })
  })

  it('Anchor render perfectly for complete href - scoll', (done) => {
    const wrapper = mount({
      render () {
        return (
          <div>
            <div id='API'>Hello</div>
            <Anchor ref='anchor'>
              <Link href='http://www.example.com/#API' title='API' />
            </Anchor>
          </div>
        )
      },
    }, { sync: false, attachToDocument: true })
    Vue.nextTick(() => {
      wrapper.vm.$refs.anchor.handleScroll()
      expect(wrapper.vm.$refs.anchor.$data.activeLink).toBe('http://www.example.com/#API')
      done()
    })
  })

  it('Anchor render perfectly for complete href - scollTo', (done) => {
    const wrapper = mount({
      render () {
        return (
          <div>
            <div id='API'>Hello</div>
            <Anchor ref='anchor'>
              <Link href='##API' title='API' />
            </Anchor>
          </div>
        )
      },
    }, { sync: false, attachToDocument: true })
    Vue.nextTick(() => {
      wrapper.vm.$refs.anchor.handleScrollTo('##API')
      expect(wrapper.vm.$refs.anchor.$data.activeLink).toBe('##API')
      done()
    })
  })
})
