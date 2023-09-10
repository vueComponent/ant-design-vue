import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';
import KeyCode from '../../_util/KeyCode';
import copy from '../../_util/copy-to-clipboard';
import Typography from '..';
import Title from '../Title';
import Paragraph from '../Paragraph';
import Link from '../Link';
import mountTest from '../../../tests/shared/mountTest';
import { nextTick, createTextVNode, ref } from 'vue';

const Base = Typography.Base;
describe('Typography', () => {
  mountTest(Paragraph);
  mountTest(Base);
  mountTest(Title);
  mountTest(Link);

  const LINE_STR_COUNT = 20;
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  // Mock offsetHeight
  const originOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  ).get;
  const mockGetBoundingClientRect = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get() {
        let html = this.innerHTML;
        html = html.replace(/<[^>]*>/g, '');
        const lines = Math.ceil(html.length / LINE_STR_COUNT);
        return lines * 16;
      },
    });
    mockGetBoundingClientRect.mockImplementation(function fn() {
      let html = this.innerHTML;
      html = html.replace(/<[^>]*>/g, '');
      const lines = Math.ceil(html.length / LINE_STR_COUNT);
      return { height: lines * 16 };
    });
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
    mockGetBoundingClientRect.mockRestore();
    window.getComputedStyle = originGetComputedStyle;
  });

  describe('Base', () => {
    describe('trigger ellipsis update', () => {
      const fullStr =
        'Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light';

      // xit('should trigger update', async () => {
      //   const onEllipsis = jest.fn();
      //   const wrapper = mount(Base, {
      //     props: {
      //       ellipsis: { onEllipsis },
      //       component: 'p',
      //       editable: true,
      //       content: fullStr,
      //     },
      //   });

      //   await sleep(20);

      //   expect(wrapper.text()).toEqual('Bamboo is Little ...');
      //   expect(onEllipsis).toHaveBeenCalledWith(true);
      //   onEllipsis.mockReset();
      //   wrapper.setProps({ ellipsis: { rows: 2, onEllipsis } });
      //   await sleep(300);
      //   expect(wrapper.text()).toEqual('Bamboo is Little Light Bamboo is Litt...');
      //   expect(onEllipsis).not.toHaveBeenCalled();

      //   wrapper.setProps({ ellipsis: { rows: 99, onEllipsis } });
      //   await sleep(20);
      //   expect(wrapper.find('p').text()).toEqual(fullStr);
      //   expect(onEllipsis).toHaveBeenCalledWith(false);
      // });

      it('should middle ellipsis', async () => {
        const suffix = '--suffix';
        const wrapper = mount(Base, {
          props: {
            ellipsis: {
              rows: 1,
              suffix,
            },
            component: 'p',
            content: fullStr,
          },
        });

        await sleep(20);
        expect(wrapper.find('p').text()).toEqual('Bamboo is...--suffix');
      });

      it('should front or middle ellipsis', async () => {
        const suffix = '--The information is very important';
        const wrapper = mount(Base, {
          props: {
            ellipsis: {
              rows: 1,
              suffix,
            },
            component: 'p',
            content: fullStr,
          },
        });

        await sleep(20);
        expect(wrapper.find('p').text()).toEqual('...--The information is very important');

        wrapper.setProps({ ellipsis: { rows: 2, suffix } });
        await sleep(20);
        expect(wrapper.find('p').text()).toEqual('Ba...--The information is very important');

        wrapper.setProps({ ellipsis: { rows: 99, suffix } });
        await sleep(20);
        expect(wrapper.find('p').text()).toEqual(fullStr + suffix);
      });

      // it('connect children', async () => {
      //   const bamboo = 'Bamboo';
      //   const is = ' is ';

      //   const wrapper = mount(Base, {
      //     props: {
      //       ellipsis: true,
      //       component: 'p',
      //       editable: true,
      //     },
      //     slots: {
      //       default: [
      //         createTextVNode(bamboo),
      //         createTextVNode(is),
      //         createVNode('code', null, 'Little'),
      //         createVNode('code', null, 'Light'),
      //       ],
      //     },
      //   });

      //   await sleep(20);
      //   expect(wrapper.find('span').text()).toEqual('Bamboo is Little...');
      // });

      it('should expandable work', async () => {
        const onExpand = jest.fn();
        const wrapper = mount(Base, {
          props: {
            ellipsis: {
              expandable: true,
              onExpand,
            },
            component: 'p',
            copyable: true,
            editable: true,
            content: fullStr,
          },
        });

        await sleep(20);
        wrapper.find('.ant-typography-expand').trigger('click');
        expect(onExpand).toHaveBeenCalled();
        await sleep(20);

        expect(wrapper.find('p').text()).toEqual(fullStr);
      });

      it('should have custom expand style', async () => {
        const symbol = 'more';
        const wrapper = mount(Base, {
          props: {
            ellipsis: {
              expandable: true,
              symbol,
            },
            component: 'p',
            content: fullStr,
          },
        });

        await sleep(20);
        expect(wrapper.find('.ant-typography-expand').text()).toEqual('more');
      });

      it('can use css ellipsis', async () => {
        const wrapper = mount(Base, {
          props: {
            ellipsis: true,
            component: 'p',
          },
        });

        await sleep(20);
        expect(wrapper.findAll('.ant-typography-ellipsis-single-line').length).toBeTruthy();
      });
    });

    describe('copyable', () => {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      function copyTest(name, text, target, icon) {
        it(name, async () => {
          jest.useFakeTimers();
          const onCopy = jest.fn();
          const wrapper = mount(Base, {
            props: {
              component: 'p',
              copyable: { text, onCopy },
            },
            slots: {
              default: [createTextVNode('test copy')],
              copyableIcon: icon ? () => icon : undefined,
            },
          });

          if (icon) {
            expect(wrapper.findAll('.anticon-smile').length).toBeTruthy();
          } else {
            expect(wrapper.findAll('.anticon-copy').length).toBeTruthy();
          }

          wrapper.find('.ant-typography-copy').trigger('click');

          await asyncExpect(() => {
            expect(copy.lastStr).toEqual(target);
          });

          await asyncExpect(() => {
            expect(onCopy).toHaveBeenCalled();
          });

          expect(wrapper.findAll('.anticon-check').length).toBeTruthy();

          jest.runAllTimers();

          // Will set back when 3 seconds pass
          await nextTick();
          expect(wrapper.findAll('.anticon-check').length).toBeFalsy();

          jest.useRealTimers();
        });
      }

      //copyTest('basic copy', undefined, 'test copy');
      //copyTest('customize copy', 'bamboo', 'bamboo');
    });

    describe('editable', () => {
      function testStep(name, submitFunc, expectFunc) {
        it(name, async () => {
          const onStart = jest.fn();
          const onChange = jest.fn();

          const className = 'test';

          const content = ref('');

          const Component = {
            setup() {
              return () => (
                <Paragraph
                  content={content.value}
                  onUpdate:content={val => (content.value = val)}
                  class={className}
                  style={{ color: 'red' }}
                >
                  Bamboo
                </Paragraph>
              );
            },
          };

          const wrapper = mount(Component, {
            props: {
              editable: { onChange, onStart },
            },
            attachTo: 'body',
          });
          await sleep(20);

          // Should have class
          const component = wrapper.find('div');
          expect(component.element.style.color).toEqual('red');
          expect(component.classes()).toContain(className);

          wrapper.find('.ant-typography-edit').trigger('click');
          await sleep(20);
          expect(onStart).toHaveBeenCalled();

          await sleep(20);
          wrapper.find('textarea').element.value = 'Bamboo';
          wrapper.find('textarea').trigger('change');
          await sleep();
          if (submitFunc) {
            submitFunc(wrapper);
          } else {
            return;
          }
          await sleep(20);
          if (expectFunc) {
            expectFunc(onChange);
          } else {
            expect(onChange).toHaveBeenCalledWith('Bamboo');
            expect(onChange).toHaveBeenCalledTimes(1);
          }
        });
      }

      testStep('by key up', async wrapper => {
        // Not trigger when inComposition
        wrapper.find('textarea').trigger('compositionstart');
        wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ENTER });
        wrapper.find('textarea').trigger('compositionend');
        wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ENTER });

        // // Now trigger
        wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ENTER });
        await sleep();
        wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ENTER });
      });
      testStep('by esc key', async wrapper => {
        wrapper.find('textarea').trigger('keydown', { keyCode: KeyCode.ESC });
        await sleep();
        wrapper.find('textarea').trigger('keyup', { keyCode: KeyCode.ESC });
      });

      testStep('by blur', wrapper => {
        wrapper.find('textarea').trigger('blur');
      });
    });

    xit('should focus at the end of textarea', async () => {
      const wrapper = mount(Paragraph, {
        props: {
          editable: true,
          content: 'content',
        },
      });
      await sleep();
      wrapper.find('.ant-typography-edit').trigger('click');
      await sleep();
      const textareaNode = wrapper.find('textarea').element;
      expect(textareaNode.selectionStart).toBe(7);
      expect(textareaNode.selectionEnd).toBe(7);
    });
  });
});
