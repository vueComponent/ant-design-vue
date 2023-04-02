import { Card, Space } from 'ant-design-vue';
import { defineComponent } from 'vue';

import Alert from '../component-demos/alert/error';
import Button from '../component-demos/button/dangerButton';
import Message from '../component-demos/message/error';
import Progress from '../component-demos/progress/danger';
import Tag from '../component-demos/tag/error';
import Badge from '../component-demos/badge/badge';
import Menu from '../component-demos/menu/menuDanger';
import Upload from '../component-demos/upload/danger';
import Dropdown from '../component-demos/dropdown/dropdownError';
import Notification from '../component-demos/notification/error';
import Timeline from '../component-demos/timeline/danger';

export const Error = defineComponent({
  name: 'Error',
  setup() {
    return () => {
      return (
        <Card size={'small'}>
          <Space align={'start'} size={'large'}>
            <Space direction={'vertical'} size={'large'}>
              <Space align={'center'} size={'large'} style={{ marginTop: '8px' }}>
                {Button.demo}
                <div>{Tag.demo}</div>
                {Badge.demo}
              </Space>
              {Alert.demo}
            </Space>
            <Space direction={'vertical'} align={'center'} size={'large'}>
              {Message.demo}
              {Progress.demo}
            </Space>
          </Space>
          <Space size={'large'} style={{ marginTop: '32px' }}>
            <div>{Notification.demo}</div>
            <div>{Timeline.demo}</div>
          </Space>
          <Space size={'large'}>
            {Menu.demo}
            <div style={{ width: 300 }}>{Upload.demo}</div>
            {Dropdown.demo}
          </Space>
        </Card>
      );
    };
  },
});
