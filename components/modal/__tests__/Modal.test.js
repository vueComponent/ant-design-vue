import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Modal from '..';
import mountTest from '../../../tests/shared/mountTest';

const ModalTester = {
  props: ['footer', 'visible'],
  methods: {
    getContainer() {
      return this.$refs.container;
    },
  },
  render() {
    const modalProps = {
      props: {
        ...this.$props,
        getContainer: this.getContainer,
      },
    };
    return (
      <div>
        <div ref="container" />
        <Modal {...modalProps}>Here is content of Modal</Modal>
      </div>
    );
  },
};

describe('Modal', () => {
  mountTest(Modal);
  it('render correctly', done => {
    const wrapper = mount({
      render() {
        return <ModalTester visible />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    // https://github.com/vuejs/vue-test-utils/issues/624
    const wrapper1 = mount(ModalTester, {
      sync: false,
    });
    wrapper1.setProps({ visible: true });
    setTimeout(() => {
      expect(wrapper1.html()).toMatchSnapshot();
      done();
    }, 10);
  });

  it('render without footer', () => {
    const wrapper = mount({
      render() {
        return <ModalTester visible footer={null} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
