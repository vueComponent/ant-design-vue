import { asyncExpect } from '../../../tests/utils';
import notification, { getInstance } from '..';
import { StepBackwardOutlined } from '@ant-design/icons-vue';

describe('notification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.outerHTML = '';
  });

  afterEach(() => {
    jest.useRealTimers();
    notification.destroy();
  });

  fit('should be able to hide manually', async () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
      key: '1',
    });
    await asyncExpect(() => {
      notification.open({
        message: 'Notification Title',
        duration: 0,
        key: '2',
      });
    });
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-notification-notice').length).toBe(2);
    notification.close('1');
    jest.runAllTimers();
    expect(
      (await getInstance('ant-notification-topRight-false')).component.value.notices,
    ).toHaveLength(1);
    notification.close('2');
    jest.runAllTimers();
    expect(
      (await getInstance('ant-notification-topRight-false')).component.value.notices,
    ).toHaveLength(0);
  });

  it('should be able to destroy globally', async () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
    });
    await asyncExpect(() => {
      notification.open({
        message: 'Notification Title',
        duration: 0,
      });
    });
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-notification').length).toBe(1);
      expect(document.querySelectorAll('.ant-notification-notice').length).toBe(2);
      notification.destroy();
    }, 0);
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-notification').length).toBe(0);
      expect(document.querySelectorAll('.ant-notification-notice').length).toBe(0);
    }, 0);
  });

  it('should be able to destroy after config', () => {
    notification.config({
      bottom: 100,
    });
    notification.destroy();
  });

  it('should be able to open with icon', async () => {
    const openNotificationWithIcon = async type => {
      const iconPrefix = '.ant-notification-notice-icon';
      notification[type]({
        message: 'Notification Title',
        duration: 0,
        description: 'This is the content of the notification.',
      });
      await asyncExpect(() => {
        expect(document.querySelectorAll(`${iconPrefix}-${type}`).length).toBe(1);
      }, 0);
    };
    await openNotificationWithIcon('success');
    await openNotificationWithIcon('info');
    await openNotificationWithIcon('warning');
    await openNotificationWithIcon('error');
  });

  it('trigger onClick', () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
    });
    expect(document.querySelectorAll('.ant-notification').length).toBe(1);
  });

  it('support closeIcon', async () => {
    await asyncExpect(() => {
      notification.open({
        message: 'Notification Title',
        duration: 0,
        closeIcon: <StepBackwardOutlined />,
      });
    });
    await asyncExpect(() => {
      expect(document.querySelectorAll('.anticon-step-backward').length).toBe(1);
    }, 100);
  });

  it('support config closeIcon', async () => {
    notification.config({
      closeIcon: <StepBackwardOutlined />,
    });
    await asyncExpect(() => {
      notification.open({
        message: 'Notification Title',
        duration: 0,
        closeIcon: <StepBackwardOutlined />,
      });
    });
    await asyncExpect(() => {
      expect(document.querySelectorAll('.anticon-step-backward').length).toBe(1);
    }, 100);
  });
});
