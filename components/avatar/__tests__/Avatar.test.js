import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Avatar from '..';
import useBreakpoint from '../../_util/hooks/useBreakpoint';

jest.mock('../../_util/hooks/useBreakpoint');

describe('Avatar Render', () => {
  let originOffsetWidth;
  const sizes = { xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 };

  beforeAll(() => {
    // Mock offsetHeight
    originOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth').get;
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get() {
        if (this.className === 'ant-avatar-string') {
          return 100;
        }
        return 80;
      },
    });
  });

  afterAll(() => {
    // Restore Mock offsetHeight
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get: originOffsetWidth,
    });
  });
  it('Render long string correctly', () => {
    const wrapper = mount(Avatar, {
      slots: {
        default: () => 'TestString',
      },
    });
    const children = wrapper.findAll('.ant-avatar-string');
    expect(children.length).toBe(1);
  });
  it('should render fallback string correctly', async () => {
    global.document.body.innerHTML = '';
    const wrapper = mount(Avatar, {
      slots: {
        default: () => 'Fallback',
      },
      props: {
        src: 'http://error.url',
      },
      attachTo: 'body',
    });
    await asyncExpect(() => {
      wrapper.find('img').trigger('error');
    }, 0);
    await asyncExpect(() => {
      const children = wrapper.findAll('.ant-avatar-string');
      expect(children.length).toBe(1);
      expect(children[0].text()).toBe('Fallback');
    });
  });
  it('should handle onError correctly', async () => {
    global.document.body.innerHTML = '';
    const LOAD_FAILURE_SRC = 'http://error.url';
    const LOAD_SUCCESS_SRC = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

    const Foo = {
      data() {
        return {
          src: LOAD_FAILURE_SRC,
        };
      },
      methods: {
        handleImgError() {
          this.src = LOAD_SUCCESS_SRC;
          return false;
        },
      },

      render() {
        const { src } = this;
        return <Avatar src={src} loadError={this.handleImgError} />;
      },
    };

    const wrapper = mount(Foo, { attachTo: 'body' });
    await asyncExpect(() => {
      // mock img load Error, since jsdom do not load resource by default
      // https://github.com/jsdom/jsdom/issues/1816
      wrapper.find('img').trigger('error');
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.find('img')).not.toBeNull();
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.find('img').attributes('src')).toBe(LOAD_SUCCESS_SRC);
    }, 0);
  });

  it('should show image on success after a failure state', async () => {
    global.document.body.innerHTML = '';
    const LOAD_FAILURE_SRC = 'http://error.url';
    const LOAD_SUCCESS_SRC = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

    const Foo = {
      data() {
        return {
          src: LOAD_FAILURE_SRC,
        };
      },
      render() {
        const { src } = this;
        return <Avatar src={src}>Fallback</Avatar>;
      },
    };

    const wrapper = mount(Foo, { sync: false, attachTo: 'body' });
    await asyncExpect(() => {
      wrapper.find('img').trigger('error');
    }, 0);
    await asyncExpect(() => {
      expect(wrapper.findComponent({ name: 'AAvatar' }).findAll('img').length).toBe(0);
      expect(wrapper.findAll('.ant-avatar-string').length).toBe(1);
    }, 0);

    await asyncExpect(() => {
      wrapper.vm.src = LOAD_SUCCESS_SRC;
    });
    await asyncExpect(() => {
      expect(wrapper.findComponent({ name: 'AAvatar' }).findAll('img').length).toBe(1);
      expect(wrapper.findAll('.ant-avatar-image').length).toBe(1);
    }, 0);
  });

  it('should calculate scale of avatar children correctly', async () => {
    let wrapper = mount({
      render() {
        return <Avatar>Avatar</Avatar>;
      },
    });

    await asyncExpect(() => {
      expect(wrapper.find('.ant-avatar-string').html()).toMatchSnapshot();
    }, 0);

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get() {
        if (this.className === 'ant-avatar-string') {
          return 100;
        }
        return 40;
      },
    });
    wrapper = mount({
      render() {
        return <Avatar>xx</Avatar>;
      },
    });
    await asyncExpect(() => {
      expect(wrapper.find('.ant-avatar-string').html()).toMatchSnapshot();
    }, 0);
  });

  it('should calculate scale of avatar children correctly with gap', async () => {
    const wrapper = mount({
      render() {
        return <Avatar gap={2}>Avatar</Avatar>;
      },
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    }, 0);
  });

  Object.entries(sizes).forEach(([key, value]) => {
    it(`adjusts component size to ${value} when window size is ${key}`, async () => {
      useBreakpoint.mockReturnValue({ value: { [key]: true } });

      const wrapper = mount({
        render() {
          return <Avatar size={sizes} />;
        },
      });

      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      }, 0);
    });
  });

  it('fallback', () => {
    const div = global.document.createElement('div');
    global.document.body.appendChild(div);
    const wrapper = mount(
      {
        render() {
          return (
            <Avatar shape="circle" src="http://error.url">
              A
            </Avatar>
          );
        },
      },
      { attachTo: div },
    );
    wrapper.find('img').trigger('error');
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
    global.document.body.removeChild(div);
  });
});
