import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Mentions from '..';
import focusTest from '../../../tests/shared/focusTest';

const { getMentions } = Mentions;

function $$(className) {
  return document.body.querySelectorAll(className);
}

function triggerInput(wrapper, text = '') {
  wrapper.find('textarea').element.value = text;
  wrapper.find('textarea').element.selectionStart = text.length;
  wrapper.find('textarea').trigger('keydown');
  wrapper.find('textarea').trigger('change');
  wrapper.find('textarea').trigger('keyup');
}

describe('Mentions', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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

  it('focus', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const wrapper = mount({
      render() {
        return <Mentions onFocus={onFocus} onBlur={onBlur} />;
      },
    });
    wrapper.find('textarea').trigger('focus');
    expect(wrapper.find('.ant-mentions').classes('ant-mentions-focused')).toBeTruthy();
    expect(onFocus).toHaveBeenCalled();

    wrapper.find('textarea').trigger('blur');
    jest.runAllTimers();
    expect(wrapper.classes()).not.toContain('ant-mentions-focused');
    expect(onBlur).toHaveBeenCalled();
  });

  it('loading', done => {
    const wrapper = mount(
      {
        render() {
          return <Mentions loading />;
        },
      },
      { sync: false },
    );
    triggerInput(wrapper, '@');
    Vue.nextTick(() => {
      mount(
        {
          render() {
            return wrapper.find({ name: 'Trigger' }).vm.getComponent();
          },
        },
        { sync: false },
      );
      Vue.nextTick(() => {
        expect($$('.ant-mentions-dropdown-menu-item').length).toBeTruthy();
        expect($$('.ant-spin')).toBeTruthy();
        done();
      });
    });
  });

  focusTest(Mentions);
});
