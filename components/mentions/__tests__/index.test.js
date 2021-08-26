import { mount } from '@vue/test-utils';
import Mentions from '..';
import focusTest from '../../../tests/shared/focusTest';
import { sleep } from '../../../tests/utils';
import KeyCode from '../../_util/KeyCode';

const { getMentions, Option } = Mentions;

function $$(className) {
  return document.body.querySelectorAll(className);
}

function triggerInput(wrapper, text = '') {
  const lastChar = text[text.length - 1];
  wrapper.find('textarea').element.value = text;
  wrapper.find('textarea').element.selectionStart = text.length;
  wrapper.find('textarea').trigger('keydown');
  wrapper.find('textarea').trigger('change');
  wrapper.find('textarea').trigger('keyup', { key: lastChar });
}

describe('Mentions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  focusTest(Mentions);
  it('getMentions', () => {
    const mentions = getMentions('@light #bamboo cat', { prefix: ['@', '#'] });
    expect(mentions).toEqual([
      {
        prefix: '@',
        value: 'light',
      },
      {
        prefix: '#',
        value: 'bamboo',
      },
    ]);
  });

  it('focus', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const wrapper = mount(
      {
        render() {
          return <Mentions onFocus={onFocus} onBlur={onBlur} />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await sleep();
    wrapper.find('textarea').trigger('focus');
    await sleep();
    expect(wrapper.find('.ant-mentions').classes('ant-mentions-focused')).toBeTruthy();
    expect(onFocus).toHaveBeenCalled();
    wrapper.find('textarea').trigger('blur');
    await sleep(500);
    expect(wrapper.classes()).not.toContain('ant-mentions-focused');
    expect(onBlur).toHaveBeenCalled();
  });

  it('loading', async () => {
    const wrapper = mount(
      {
        render() {
          return <Mentions loading />;
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await sleep(100);
    triggerInput(wrapper, '@');
    await sleep(100);
    expect($$('.ant-mentions-dropdown-menu-item').length).toBeTruthy();
    expect($$('.ant-spin')).toBeTruthy();
  });

  it('notExist', async () => {
    jest.useFakeTimers();
    const wrapper = mount({
      render() {
        return (
          <Mentions>
            <Option value="bamboo">Bamboo</Option>
            <Option value="light">Light</Option>
            <Option value="cat">Cat</Option>
          </Mentions>
        );
      },
    });

    triggerInput(wrapper, '@notExist');
    jest.runAllTimers();

    wrapper.find('textarea').element.keyCode = KeyCode.ENTER;
    wrapper.find('textarea').trigger('keydown');
    jest.runAllTimers();

    expect(wrapper.find('textarea').element.value).toBe('@notExist');
  });
});
