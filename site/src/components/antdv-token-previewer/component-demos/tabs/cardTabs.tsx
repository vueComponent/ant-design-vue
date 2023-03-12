import { defineComponent } from 'vue';
import { Tabs } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const { TabPane } = Tabs;

const Demo = defineComponent({
  setup() {
    return () => (
      <Tabs type={'card'} defaultActiveKey="1">
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
  tokens: ['colorFillAlter'],
  key: 'cardTabs',
};

export default componentDemo;
