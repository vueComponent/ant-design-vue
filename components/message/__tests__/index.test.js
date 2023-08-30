import { asyncExpect } from '../../../tests/utils';
import message, { getInstance } from '..';
import SmileOutlined from '@ant-design/icons-vue/SmileOutlined';

describe('message', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.outerHTML = '';
  });

  afterEach(() => {
    message.destroy();
  });

  afterEach(() => {
    message.destroy();
    jest.useRealTimers();
  });

  it('should be able to config top', async () => {
    message.config({
      top: '100px',
    });
    message.info('whatever');
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message')[0].style.top).toBe('100px');
    });
  });
  it('should be able to config getContainer', () => {
    message.config({
      getContainer: () => {
        const div = document.createElement('div');
        div.className = 'custom-container';
        document.body.appendChild(div);
        return div;
      },
    });
    message.info('whatever');
    expect(document.querySelectorAll('.custom-container').length).toBe(1);
  });

  it('should be able to config maxCount', async () => {
    message.config({
      maxCount: 5,
    });
    for (let i = 0; i < 10; i += 1) {
      message.info('test');
    }
    message.info('last');
    await Promise.resolve();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(5);
    expect(document.querySelectorAll('.ant-message-notice')[4].textContent).toBe('last');
  });

  it('should be able to hide manually', async () => {
    const hide1 = message.info('whatever', 0);
    const hide2 = message.info('whatever', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    hide1();
    jest.runAllTimers();
    expect(getInstance().component.value.notices).toHaveLength(1);
    hide2();
    jest.runAllTimers();
    expect(getInstance().component.value.notices).toHaveLength(0);
  });

  it('should be able to destroy globally', async () => {
    message.info('whatever', 0);
    message.info('whatever', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message').length).toBe(1);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    message.destroy();
    expect(document.querySelectorAll('.ant-message').length).toBe(0);
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });

  it('should not need to use duration argument when using the onClose arguments', () => {
    message.info('whatever', () => {});
  });

  it('should have the default duration when using the onClose arguments', done => {
    jest.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    message.info('whatever', () => {
      // calculate the approximately duration value
      const aboutDuration = parseInt((Date.now() - now) / 1000, 10);
      expect(aboutDuration).toBe(defaultDuration);
      done();
    });
  });

  it('should be called like promise', done => {
    jest.useRealTimers();
    const defaultDuration = 3;
    const now = Date.now();
    message.info('whatever').then(() => {
      // calculate the approximately duration value
      const aboutDuration = parseInt((Date.now() - now) / 1000, 10);
      expect(aboutDuration).toBe(defaultDuration);
      done();
    });
  });

  // https:// github.com/ant-design/ant-design/issues/8201
  it('should hide message correctly', async () => {
    const hide = message.loading('Action in progress..', 0);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(1);
    hide();
    await Promise.resolve();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });
  it('should allow custom icon', async () => {
    message.open({ content: 'Message', icon: <SmileOutlined /> });
    await Promise.resolve();
    expect(document.querySelectorAll('.anticon-smile').length).toBe(1);
  });

  it('should have no icon', async () => {
    message.open({ content: 'Message' });
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice .anticon').length).toBe(0);
  });
  // https://github.com/ant-design/ant-design/issues/8201
  it('should destroy messages correctly', async () => {
    message.loading('Action in progress1..', 0);
    message.loading('Action in progress2..', 0);
    setTimeout(() => message.destroy(), 1000);
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
  });
});
