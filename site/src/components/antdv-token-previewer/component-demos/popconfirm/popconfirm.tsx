import { defineComponent, ref } from 'vue';
import { Popconfirm, message } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

function confirm() {
  message.success('Click on Yes');
}
function cancel() {
  message.error('Click on No');
}
const Demo = defineComponent({
  setup() {
    const open = ref(true);

    return () => (
      <div
        style={{
          width: '260px',
          paddingTop: '80px',
        }}
      >
        <Popconfirm
          title="Are you sure delete this task?"
          ok-text="Yes"
          cancel-text="No"
          onConfirm={confirm}
          onCancel={cancel}
          placement={'topLeft'}
          getPopupContainer={node => {
            if (node) {
              console.log(node.parentNode);
              return node.parentNode as HTMLElement;
            }
            return document.body;
          }}
        >
          <a href="#">Delete</a>
        </Popconfirm>
      </div>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorBgElevated', 'colorWarning'],
  key: 'default',
};

export default componentDemo;
