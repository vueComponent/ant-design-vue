import { Card, Space } from 'ant-design-vue';
import { defineComponent } from 'vue';

import Menu from '../component-demos/menu/menu';
import SelectTag from '../component-demos/select/selectTag';
import Button from '../component-demos/button/button-icon';
import Switch from '../component-demos/switch/switch';
import Radio from '../component-demos/radio/radio';
import RadioButton from '../component-demos/radio/button';
import Checkbox from '../component-demos/checkbox/checkbox';
import Tabs from '../component-demos/tabs/tabs';
import Pagination from '../component-demos/pagination/outline';
import Steps from '../component-demos/steps/steps';
import Popconfirm from '../component-demos/popconfirm/popconfirm';
import Timeline from '../component-demos/timeline/timeline';
import Table from '../component-demos/table/table';

export const Primary = defineComponent({
  name: 'Primary',
  setup() {
    return () => {
      return (
        <Card size={'small'}>
          <Space direction={'vertical'}>
            <Space align={'start'} size={'large'}>
              {Menu.demo}
              <Space direction={'vertical'} size={'large'}>
                <Space size={'large'} align={'start'}>
                  <Space direction={'vertical'} size={'large'}>
                    <div>{Button.demo}</div>
                    <div>
                      <span>{Radio.demo}</span>
                      {Checkbox.demo}
                      {Switch.demo}
                    </div>
                    <div>{RadioButton.demo}</div>
                    {Tabs.demo}
                  </Space>
                  {SelectTag.demo}
                </Space>
                {Pagination.demo}
                <div style={{ padding: '12px' }}>{Steps.demo}</div>
                <Space size={'large'} align={'start'}>
                  {Popconfirm.demo}
                  {Timeline.demo}
                </Space>
              </Space>
            </Space>
            {Table.demo}
          </Space>
        </Card>
      );
    };
  },
});
