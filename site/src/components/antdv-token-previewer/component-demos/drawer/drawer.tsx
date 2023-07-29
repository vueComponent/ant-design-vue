import { Button, Drawer } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    () => {
      const visible = ref(false);

      const showDrawer = () => {
        visible.value = true;
      };

      const onClose = () => {
        visible.value = false;
      };

      return (
        <>
          <Button type="primary" onClick={showDrawer}>
            Open
          </Button>
          <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={visible.value}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
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
