import { defineComponent } from 'vue';
import { Tabs } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { TabPane } = Tabs;
function callback() {}
const Demo = defineComponent({
  setup() {
    return () => (
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Tab 1" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'colorPrimaryHover', 'colorPrimaryActive', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
