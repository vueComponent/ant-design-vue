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

  it('does not select the active option when Enter only confirms an IME composition', async () => {
    jest.useRealTimers();
    const onSelect = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <Mentions onSelect={onSelect}>
              <Option value="bamboo">Bamboo</Option>
              <Option value="cat">Cat</Option>
            </Mentions>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await sleep();
    triggerInput(wrapper, '@');
    await sleep();

    const textarea = wrapper.find('textarea').element;
    // BaseInput flags the element as composing on compositionstart. Some browsers
    // (e.g. Safari) still report `which === ENTER` for the keydown that confirms it.
    textarea.composing = true;
    const composingEnter = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(composingEnter, 'which', { get: () => KeyCode.ENTER });
    textarea.dispatchEvent(composingEnter);
    await sleep();

    expect(onSelect).not.toHaveBeenCalled();
    expect(wrapper.find('textarea').element.value).toBe('@');

    // A normal Enter still selects the active option.
    textarea.composing = false;
    const normalEnter = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
    Object.defineProperty(normalEnter, 'which', { get: () => KeyCode.ENTER });
    textarea.dispatchEvent(normalEnter);
    await sleep();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(wrapper.find('textarea').element.value).toBe('@bamboo ');
  });
});
