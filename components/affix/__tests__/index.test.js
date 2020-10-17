import Affix from '..';
import Button from '../../button';
import { mount } from '@vue/test-utils';
import { spyElementPrototype } from '../../__tests__/util/domHook';
const events = {};

const AffixMounter = {
  props: ['offsetBottom', 'offsetTop'],
  mounted() {
    this.$refs.container.addEventListener = jest.fn().mockImplementation((event, cb) => {
      events[event] = cb;
    });
  },
  methods: {
    getTarget() {
      return this.$refs.container;
    },
  },

  render() {
    return (
      <div ref="container" class="container">
        <Affix class="fixed" target={() => this.$refs.container} ref="affix">
          <Button type="primary">Fixed at the top of container</Button>
        </Affix>
      </div>
    );
  },
};
describe('Affix Render', () => {
  let wrapper;
  let domMock;
  const classRect = {
    container: {
      top: 1000,
      bottom: 100,
    },
  };
  beforeAll(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
    domMock = spyElementPrototype(HTMLElement, 'getBoundingClientRect', function mockBounding() {
      return (
        classRect[this.className] || {
          top: 0,
          bottom: 0,
        }
      );
    });
  });
  afterAll(() => {
    jest.useRealTimers();
    domMock.mockRestore();
  });
  const movePlaceholder = top => {
    classRect.fixed = {
      top,
      bottom: top,
    };
    events.scroll({
      type: 'scroll',
    });
    jest.runAllTimers();
  };
  it('Anchor render perfectly', () => {
    wrapper = mount(AffixMounter, { attachTo: 'body' });
    jest.runAllTimers();

    movePlaceholder(0);
    expect(wrapper.vm.$refs.affix.affixStyle).toBeFalsy();

    // movePlaceholder(100);
    // expect(wrapper.vm.$refs.affix.affixStyle).toBeTruthy();

    movePlaceholder(0);
    expect(wrapper.vm.$refs.affix.affixStyle).toBeFalsy();
  });
  it('support offsetBottom', () => {
    wrapper = mount(AffixMounter, {
      attachTo: 'body',
      props: {
        offsetBottom: 0,
      },
    });

    jest.runAllTimers();

    movePlaceholder(300);
    //expect(wrapper.vm.$refs.affix.affixStyle).toBeTruthy();

    movePlaceholder(0);
    expect(wrapper.vm.$refs.affix.affixStyle).toBeFalsy();

    // movePlaceholder(300);
    // expect(wrapper.vm.$refs.affix.affixStyle).toBeTruthy();
  });

  // it('updatePosition when offsetTop changed', () => {
  //   wrapper = mount(AffixMounter, {
  //     attachTo: 'body',
  //     props: {
  //       offsetTop: 0,
  //     },
  //   });

  //   jest.runAllTimers();

  //   movePlaceholder(-100);
  //   expect(wrapper.vm.$refs.affix.affixStyle.top).toBe('0px');
  //   wrapper.setProps({
  //     offsetTop: 10,
  //   });
  //   jest.runAllTimers();
  //   expect(wrapper.vm.$refs.affix.affixStyle.top).toBe('10px');
  // });
});
