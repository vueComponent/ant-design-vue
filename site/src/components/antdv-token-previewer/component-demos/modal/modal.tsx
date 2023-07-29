import { Button, Modal } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const isModalVisible = ref(false);
    const showModal = () => {
      isModalVisible.value = true;
    };
    const handleOk = () => {
      isModalVisible.value = false;
    };
    const handleCancel = () => {
      isModalVisible.value = false;
    };

    return () => {
      return (
        <>
          <Button type="primary" onClick={showModal}>
            Open Modal
          </Button>
          <Modal
            title="Basic Modal"
            open={isModalVisible.value}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Some contents...</p> <p>Some contents...</p> <p>Some contents...</p>
          </Modal>
        </>
      );
    };
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgMask', 'colorBgElevated'],
  key: 'default',
};
export default componentDemo;
