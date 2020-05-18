import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import KeyCode from '../../_util/KeyCode';
import copy from 'copy-to-clipboard';
import Title from '../Title';
import Paragraph from '../Paragraph';
import Base from '../Base';
import mountTest from '../../../tests/shared/mountTest';
import Vue from 'vue';

jest.mock('copy-to-clipboard');

describe('Typography', () => {
  mountTest(Paragraph);
  mountTest(Base);
  mountTest(Title);

  const LINE_STR_COUNT = 20;
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  // Mock offsetHeight
  const originOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
    .get;
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    get() {
      let html = this.innerHTML;
      html = html.replace(/<[^>]*>/g, '');
      const lines = Math.ceil(html.length / LINE_STR_COUNT);
      return lines * 16;
    },
  });

  // Mock getComputedStyle
  const originGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = ele => {
    const style = originGetComputedStyle(ele);
    style.lineHeight = '16px';
    return style;
  };

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: originOffsetHeight,
    });
    window.getComputedStyle = originGetComputedStyle;
  });

  describe('Title', () => {
    it('warning if `level` not correct', () => {
      mount({
        render() {
          return <Title level={5} />;
        },
      });

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: [antdv: Typography] Title only accept `1 | 2 | 3 | 4` as `level` value.',
      );
    });
  });

  describe('Base', () => {
    describe('trigger ellipsis update', () => {
      // const fullStr =
      //   'Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light';

      // it('should trigger update', async () => {
      //   const wrapper = mount({
      //     render() {
      //       return (
      //         <Base ellipsis component="p" editable>
      //           {fullStr}
      //         </Base>
      //       );
      //     },
      //   });

      //   await Vue.nextTick();
      //   expect(wrapper.find('span').text()).toEqual('Bamboo is Little ...');

      //   wrapper.setProps({ ellipsis: { rows: 2 } });
      //   await Vue.nextTick();
      //   expect(wrapper.find('span').text()).toEqual('Bamboo is Little Light Bamboo is Litt...');

      //   wrapper.setProps({ ellipsis: { rows: 99 } });
      //   await Vue.nextTick();
      //   expect(wrapper.find('p').text()).toEqual(fullStr);
      // });

      // it('should middle ellipsis', async () => {
      //   const suffix = '--suffix';
      //   const wrapper = mount({
      //     render() {
      //       return (
      //         <Base ellipsis={{ rows: 1, suffix }} component="p">
      //           {fullStr}
      //         </Base>
      //       );
      //     },
      //   });

      //   await Vue.nextTick();
      //   expect(wrapper.find('p').text()).toEqual('Bamboo is...--suffix');
      // });

      // it('connect children', async () => {
      //   const bamboo = 'Bamboo';
      //   const is = ' is ';

      //   const wrapper = mount({
      //     render() {
      //       return (
      //         <Base ellipsis component="p" editable>
      //           {bamboo}
      //           {is}
      //           <code>Little</code>
      //           <code>Light</code>
      //         </Base>
      //       );
      //     },
      //   });

      //   await Vue.nextTick();
      //   expect(wrapper.find('span').text()).toEqual('Bamboo is Little...');
      // });

      // it('should expandable work', async () => {
      //   const onExpand = jest.fn();
      //   const wrapper = mount({
      //     render() {
      //       return (
      //         <Base ellipsis={{ expandable: true, onExpand }} component="p" copyable editable>
      //           {fullStr}
      //         </Base>
      //       );
      //     },
      //   });

      //   await Vue.nextTick();
      //   wrapper.find('.ant-typography-expand').trigger('click');
      //   expect(onExpand).toHaveBeenCalled();
      //   await Vue.nextTick();

      //   expect(wrapper.find('p').text()).toEqual(fullStr);
      // });

      it('can use css ellipsis', async () => {
        const wrapper = mount({
          render() {
            return <Base ellipsis component="p" />;
          },
        });

        await Vue.nextTick();
        expect(wrapper.findAll('.ant-typography-ellipsis-single-line').length).toBeTruthy();
      });
    });

    describe('copyable', () => {
      function copyTest(name, text, target) {
        it(name, async () => {
          jest.useFakeTimers();
          const onCopy = jest.fn();
          const wrapper = mount({
            render() {
              return (
                <Base component="p" copyable={{ text, onCopy }}>
                  test copy
                </Base>
              );
            },
          });

          wrapper.find('.ant-typography-copy').trigger('click');
          expect(copy.lastStr).toEqual(target);

          await asyncExpect(() => {
            expect(onCopy).toHaveBeenCalled();
          });

          expect(wrapper.findAll('.anticon-check').length).toBeTruthy();

          jest.runAllTimers();

          // Will set back when 3 seconds pass
          await Vue.nextTick();
          expect(wrapper.findAll('.anticon-check').length).toBeFalsy();

          jest.useRealTimers();
        });
      }

      copyTest('basic copy', undefined, 'test copy');
      copyTest('customize copy', 'bamboo', 'bamboo');
    });

    describe('editable', () => {
      function testStep(name, submitFunc, expectFunc) {
        it(name, () => {
          const onStart = jest.fn();
          const onChange = jest.fn();

          const className = 'test';
          const style = { color: 'red' };

          const wrapper = mount({
            render() {
              return (
                <Paragraph editable={{ onChange, onStart }} class={className} style={style}>
                  Bamboo
                </Paragraph>
              );
            },
          });

          // Should have className
          const component = wrapper.find('div');
          expect(component.element.style.color).toEqual('red');
          expect(component.classes()).toContain(className);

          wrapper.find('.ant-typography-edit').trigger('click');

          expect(onStart).toHaveBeenCalled();

          wrapper.find('textarea').element.value = 'Bamboo';
          wrapper.find('textarea').trigger('change');

          submitFunc(wrapper);

          if (expectFunc) {
            expectFunc(onChange);
          } else {
            Vue.nextTick(() => {
              expect(onChange).toHaveBeenCalledWith('Bamboo');
              expect(onChange).toHaveBeenCalledTimes(1);
            });
          }
        });
      }

      testStep('by key up', wrapper => {
        // Not trigger when inComposition
        wrapper.find('TextArea').trigger('compositionStart');
        wrapper.find('TextArea').trigger('keyDown', { keyCode: KeyCode.ENTER });
        wrapper.find('TextArea').trigger('compositionEnd');
        wrapper.find('TextArea').trigger('keyUp', { keyCode: KeyCode.ENTER });

        // Now trigger
        wrapper.find('TextArea').trigger('keyDown', { keyCode: KeyCode.ENTER });
        wrapper.find('TextArea').trigger('keyUp', { keyCode: KeyCode.ENTER });
      });

      testStep(
        'by esc key',
        wrapper => {
          wrapper.find('TextArea').trigger('keyDown', { keyCode: KeyCode.ESC });
          wrapper.find('TextArea').trigger('keyUp', { keyCode: KeyCode.ESC });
        },
        onChange => {
          expect(onChange).not.toHaveBeenCalled();
        },
      );

      testStep('by blur', wrapper => {
        wrapper.find('TextArea').trigger('blur');
      });
    });

    it('should focus at the end of textarea', () => {
      const wrapper = mount({
        render() {
          return <Paragraph editable>content</Paragraph>;
        },
      });
      wrapper.find('.ant-typography-edit').trigger('click');
      const textareaNode = wrapper.find('textarea').element;
      expect(textareaNode.selectionStart).toBe(7);
      expect(textareaNode.selectionEnd).toBe(7);
    });
  });
});
