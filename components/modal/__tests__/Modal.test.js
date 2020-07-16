import { mount } from '@vue/test-utils';
import Modal from '..';
import mountTest from '../../../tests/shared/mountTest';
import { asyncExpect } from '@/tests/utils';

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
  it('render correctly', async () => {
    const wrapper = mount(
      {
        render() {
          return <ModalTester visible />;
        },
      },
      {
        sync: false,
        attachToDocument: true,
      },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
    // https://github.com/vuejs/vue-test-utils/issues/624
    const wrapper1 = mount(ModalTester, {
      sync: false,
      attachToDocument: true,
    });
    wrapper1.setProps({ visible: true });
    await asyncExpect(() => {
      expect(wrapper1.html()).toMatchSnapshot();
    });
  });

  it('render without footer', async () => {
    const wrapper = mount(
      {
        render() {
          return <ModalTester visible footer={null} />;
        },
      },
      { attachToDocument: true, sync: true },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
