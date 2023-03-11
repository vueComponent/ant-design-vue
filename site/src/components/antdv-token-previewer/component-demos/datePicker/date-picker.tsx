import { defineComponent } from 'vue';
import { DatePicker, Space } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space direction="vertical">
        <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="week" />
        <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="month" />
        <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="quarter" />
        <DatePicker._InternalPanelDoNotUseOrYouWillBeFired picker="year" />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [
    'colorPrimary',
    'colorPrimaryBorder',
    'colorPrimaryHover',
    'controlOutline',
    'colorBgElevated',
    'colorBgContainer',
  ],
  key: 'default',
};

export default componentDemo;
