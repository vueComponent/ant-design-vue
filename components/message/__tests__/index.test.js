import { asyncExpect } from '../../../tests/utils';
import message from '..';
import SmileOutlined from '@ant-design/icons-vue/SmileOutlined';

describe('message', () => {
  beforeEach(() => {
    document.body.outerHTML = '';
  });

  afterEach(() => {
    message.destroy();
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
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(5);
      expect(document.querySelectorAll('.ant-message-notice')[4].textContent).toBe('last');
    }, 0);
  });

  it('should be able to hide manually', async () => {
    const hide1 = message.info('whatever', 0);
    const hide2 = message.info('whatever', 0);
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
      hide1();
    }, 0);
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(1);
      hide2();
    }, 0);
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
    }, 0);
  });

  it('should be able to destroy globally', async () => {
    await asyncExpect(() => {
      message.info('whatever', 0);
    });
    await asyncExpect(() => {
      message.info('whatever', 0);
    });
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message').length).toBe(1);
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    });
    await asyncExpect(() => {
      message.destroy();
    });
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message').length).toBe(0);
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
    });
  });

  it('should not need to use duration argument when using the onClose arguments', () => {
    message.info('whatever', () => {});
  });

  it('should have the default duration when using the onClose arguments', done => {
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
    let hide = message.loading('Action in progress..', 0);
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(1);
      hide();
    }, 0);
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
    }, 0);
  });
  it('should allow custom icon', async () => {
    message.open({ content: 'Message', icon: <SmileOutlined /> });
    await asyncExpect(() => {
      expect(document.querySelectorAll('.anticon-smile').length).toBe(1);
    }, 0);
  });

  it('should have no icon', async () => {
    message.open({ content: 'Message' });
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice .anticon').length).toBe(0);
    }, 0);
  });
  // https://github.com/ant-design/ant-design/issues/8201
  it('should destroy messages correctly', async () => {
    message.loading('Action in progress1..', 0);
    message.loading('Action in progress2..', 0);
    setTimeout(() => message.destroy(), 1000);

    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(2);
    }, 0);
    await asyncExpect(() => {
      expect(document.querySelectorAll('.ant-message-notice').length).toBe(0);
    }, 1500);
  });
});
