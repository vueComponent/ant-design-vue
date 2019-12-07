import { mount } from '@vue/test-utils';
import Icon from '..';
import VueIcon from '@ant-design/icons-vue';
import { getThemeFromTypeName, withThemeSuffix } from '../utils';
import { cloneElement } from '../../_util/vnode';

describe('Icon', () => {
  it('should render to a <i class="xxx"><svg>...</svg></i>', () => {
    const wrapper = mount({
      render() {
        return <Icon type="message" class="my-icon-classname" />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support basic usage', () => {
    const wrapper = mount({
      render() {
        return (
          <div>
            <Icon type="home" />
            <Icon type="setting" theme="filled" />
            <Icon type="smile" theme="outlined" />
            <Icon type="sync" spin />
            <Icon type="loading" />
          </div>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support older usage', () => {
    const wrapper = mount({
      render() {
        return (
          <div>
            <Icon type="home-o" />
            <Icon type="setting-fill" />
            <Icon type="smile-o" />
            <Icon type="check-circle-twotone" />
          </div>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support two-tone icon', () => {
    const wrapper = mount({
      render() {
        return <Icon type="check-circle" theme="twoTone" twoToneColor="#f5222d" />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support config global two-tone primary color', () => {
    const colors = VueIcon.getTwoToneColors();
    Icon.setTwoToneColor('#1890ff');
    expect(Icon.getTwoToneColor()).toBe('#1890ff');
    const wrapper = mount({
      render() {
        return <Icon type="check-circle" theme="twoTone" />;
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
    VueIcon.setTwoToneColors(colors);
  });

  it('should support pass svg paths as children', () => {
    const wrapper = mount({
      render() {
        return (
          <Icon viewBox="0 0 24 24">
            <title>Cool Home</title>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </Icon>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should give warning and render <i>{null}</i>', () => {
    const wrapper = mount({
      render() {
        return <Icon viewBox="0 0 24 24" />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should support custom usage of children', () => {
    expect(() => {
      mount({
        render() {
          return <Icon type="custom">&E648</Icon>;
        },
      });
    }).not.toThrow();
  });

  describe('warning on conflicting theme', () => {
    let errorSpy;
    beforeEach(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      errorSpy.mockRestore();
    });

    it('does not warn', () => {
      mount({
        render() {
          return <Icon type="clock-circle-o" theme="outlined" />;
        },
      });
      expect(errorSpy).not.toBeCalled();
    });

    it('warns', () => {
      mount({
        render() {
          return <Icon type="clock-circle-o" theme="filled" />;
        },
      });
      expect(errorSpy).toBeCalledWith(
        "Warning: The icon name 'clock-circle-o' already specify a theme 'outlined', the 'theme' prop 'filled' will be ignored.",
      );
    });
  });

  describe('`component` prop', () => {
    it('can access to svg defs if has children', () => {
      const wrapper = mount({
        render() {
          const component = {
            render() {
              return (
                <svg>
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="20%" stopColor="#39F" />
                      <stop offset="90%" stopColor="#F3F" />
                    </linearGradient>
                  </defs>
                  {this.$slots.default.map(child => {
                    cloneElement(child, {
                      attrs: child.type === 'path' ? { fill: 'scriptUrl(#gradient)' } : {},
                    });
                  })}
                </svg>
              );
            },
          };
          return (
            <Icon class="my-home-icon" component={component}>
              <title>Cool Home</title>
              <path d="'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'" />
            </Icon>
          );
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('should support svg vue component', () => {
    const SvgComponent = {
      render() {
        return (
          <svg viewBox="0 0 24 24">
            <title>Cool Home</title>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        );
      },
    };

    const wrapper = mount({
      render() {
        return (
          <Icon class="my-home-icon" component={SvgComponent}>
            <title>Cool Home</title>
            <path d="'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'" />
          </Icon>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('utils', () => {
  it('getThemeFromTypeName() should work', () => {
    const testCases = [
      'check-circle',
      'check-circle-o',
      'check-circle-fill',
      'check-circle-twotone',
    ];
    const result = testCases.map(type => getThemeFromTypeName(type));
    expect(result).toEqual([null, 'outlined', 'filled', 'twoTone']);
  });

  it('withThemeSuffix() should work', () => {
    const testCases = [
      { type: 'home', theme: 'filled' },
      { type: 'home', theme: 'outlined' },
      { type: 'home', theme: 'twoTone' },
      { type: 'home', theme: 'This-is-the-secret' },
      { type: 'home-o', theme: 'filled' },
      { type: 'home-fill', theme: 'outlined' },
      { type: 'home-o', theme: 'twoTone' },
      { type: 'home-o', theme: 'This-is-the-secret' },
    ];
    const result = testCases.map(({ type, theme }) => withThemeSuffix(type, theme));
    expect(result).toEqual([
      'home-fill',
      'home-o',
      'home-twotone',
      'home',
      'home-o-fill',
      'home-fill-o',
      'home-o-twotone',
      'home-o',
    ]);
  });
});
