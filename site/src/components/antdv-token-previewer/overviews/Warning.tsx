import { Card, Space } from 'ant-design-vue';
import { defineComponent } from 'vue';

import Alert from '../component-demos/alert/warning';
import Message from '../component-demos/message/warning';
import Popconfirm from '../component-demos/popconfirm/popconfirm';
import Modal from '../component-demos/modal/warning';
import Badge from '../component-demos/badge/warning';
import Text from '../component-demos/typography/warningText';
import Title from '../component-demos/typography/warningTitle';
import Tag from '../component-demos/tag/warning';
import Input from '../component-demos/input/warning';
import Result from '../component-demos/result/warning';
import Notification from '../component-demos/notification/warning';

export const Warning = defineComponent({
  name: 'Warning',
  setup() {
    return () => {
      return (
        <Card size={'small'}>
          <Space align={'start'} size={'large'}>
            <Space direction={'vertical'} size={'large'}>
              <Space size={'large'}>
                <div style={{ width: '200px' }}>{Title.demo}</div>
                <div style={{ width: '100%' }}>{Input.demo}</div>
              </Space>
              {Alert.demo}
            </Space>
            <Space direction={'vertical'} align={'center'} size={'large'}>
              {Message.demo}
              {Popconfirm.demo}
              <Space size={'large'}>
                {Badge.demo}
                {Tag.demo}
                {Text.demo}
              </Space>
            </Space>
          </Space>
          <Space size={'large'} style={{ marginTop: '32px' }}>
            <div>{Notification.demo}</div>
            <div>{Modal.demo}</div>
          </Space>
          {Result.demo}
        </Card>
      );
    };
  },
});
