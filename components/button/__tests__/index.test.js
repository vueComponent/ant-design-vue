import Button from '../index'
import Icon from '../../icon'
import { mount } from '@vue/test-utils'
import Vue from 'vue'

describe('Button', () => {
  it('create primary button', () => {
    const wrapper = mount({
      render (h) {
        return <Button type='primary'>按钮</Button>
      },
    })
    expect(wrapper.contains('.ant-btn-primary')).toBe(true)
  })
  // it('renders Chinese characters correctly', (done) => {
  //   const wrapper = mount(
  //     {
  //       render (h) {
  //         return <Button>按钮</Button>
  //       },
  //     }
  //   )
  //   expect(wrapper.text()).to.equal('按 钮')

  //   const wrapper1 = mount(
  //     {
  //       render (h) {
  //         return <Button icon='search'>按钮</Button>
  //       },
  //     }
  //   )
  //   expect(wrapper1.text()).to.equal('按钮')

  //   const wrapper2 = mount(
  //     {
  //       render (h) {
  //         return <Button><Icon type="search" />按钮</Button>
  //       },
  //     }
  //   )
  //   expect(wrapper2.text()).to.equal('按钮')

  //   const wrapper3 = mount(
  //     {
  //       render (h) {
  //         return <Button><span>按钮</span></Button>
  //       },
  //     }
  //   )
  //   Vue.nextTick(() => {
  //     expect(wrapper3.find('.ant-btn')[0].hasClass('ant-btn-two-chinese-chars')).to.equal(true);
  //     done()
  //   })
  // })
  // it('should change loading state instantly by default', () => {
  //   const DefaultButton = {
  //     data(){
  //       return {
  //         loading: false,
  //       }
  //     },
  //     methods: {
  //       enterLoading () {
  //         this.loading = true
  //       }
  //     },

  //     render() {
  //       return <Button loading={this.loading} onClick={this.enterLoading}>Button</Button>;
  //     }
  //   }
  //   const wrapper = mount(DefaultButton)
  //   wrapper.trigger('click');
  //   Vue.nextTick(() => {
  //     expect(wrapper.find('.ant-btn-loading').length).to.equal(1);
  //   })
  // });

  // it('should change loading state with delay', () => {
  //   const DefaultButton = {
  //     data(){
  //       return {
  //         loading: false,
  //       }
  //     },
  //     methods: {
  //       enterLoading () {
  //         this.loading = { delay: 1000 }
  //       }
  //     },

  //     render() {
  //       return <Button loading={this.loading} onClick={this.enterLoading}>Button</Button>;
  //     }
  //   }
  //   const wrapper = mount(DefaultButton)
  //   wrapper.trigger('click');
  //   Vue.nextTick(() => {
  //     expect(wrapper.hasClass('ant-btn-loading').length).to.equal(false);
  //   })
  // });

  // it('should support link button', () => {
  //   const wrapper = mount({
  //     render (h) {
  //       return <Button target="_blank" href="http://ant.design">link button</Button>
  //     },
  //   })
  //   expect(wrapper.html()).to.matchSnapshot();
  // })

  // it('fixbug renders {0} , 0 and {false}', () => {
  //   const wrapper = mount({
  //     render (h) {
  //       return <Button>{0}</Button>
  //     },
  //   })
  //   expect(wrapper.html()).to.matchSnapshot();

  //   const wrapper1 = mount({
  //     render (h) {
  //       return <Button>0</Button>
  //     },
  //   })
  //   expect(wrapper1.html()).to.matchSnapshot();

  //   const wrapper2 = mount({
  //     render (h) {
  //       return <Button>{false}</Button>
  //     },
  //   })
  //   expect(wrapper2.html()).to.matchSnapshot();

  // })
})
