import { defineComponent } from 'vue';
import { List, Avatar } from 'ant-design-vue';
import type { ComponentDemo } from '../../interface';

const data = [
  { title: 'Ant Design Title 1' },
  { title: 'Ant Design Title 2' },
  { title: 'Ant Design Title 3' },
  { title: 'Ant Design Title 4' },
];
const Demo = defineComponent({
  setup() {
    return () => (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: [],
  key: 'default',
};

export default componentDemo;
