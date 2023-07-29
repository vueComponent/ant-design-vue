import { Card, Space } from 'ant-design-vue';
import { defineComponent } from 'vue';

import Alert from '../component-demos/alert/success';
import Message from '../component-demos/message/success';
import Progress from '../component-demos/progress/success';
import Tag from '../component-demos/tag/success';
import Input from '../component-demos/input/success';
import Result from '../component-demos/result/success';
import Notification from '../component-demos/notification/success';
import Timeline from '../component-demos/timeline/success';

export const Success = defineComponent({
  name: 'Success',
  setup() {
    return () => {
      return (
        <Card size={'small'}>
          <Space align={'start'} size={'large'}>
            <Space direction={'vertical'} size={'large'}>
              <Space align={'center'} size={'large'}>
                <div>{Tag.demo}</div>
                {Input.demo}
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
          {Result.demo}
        </Card>
      );
    };
  },
});
