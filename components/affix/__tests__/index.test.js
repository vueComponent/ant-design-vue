import Affix from '..';
import Button from '../../button';
import { mount } from '@vue/test-utils';
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
      <div
        style={{
          height: '100px',
          overflowY: 'scroll',
        }}
        ref="container"
      >
        <div
          className="background"
          style={{
            paddingTop: '60px',
            height: '300px',
          }}
        >
          <Affix target={() => this.$refs.container} ref="affix" {...{ props: this.$props }}>
            <Button type="primary">Fixed at the top of container</Button>
          </Affix>
        </div>
      </div>
    );
  },
};
describe('Affix Render', () => {
  let wrapper;
  beforeAll(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  const scrollTo = top => {
    wrapper.vm.$refs.affix.$refs.fixedNode.parentNode.getBoundingClientRect = jest.fn(() => {
      return {
        bottom: 100,
        height: 28,
        left: 0,
        right: 0,
        top: 50 - top,
        width: 195,
      };
    });
    wrapper.vm.$refs.container.scrollTop = top;
    events.scroll({
      type: 'scroll',
    });
    jest.runAllTimers();
  };
  it('Anchor render perfectly', () => {
    wrapper = mount(AffixMounter, { attachToDocument: true });
    jest.runAllTimers();

    scrollTo(0);
    expect(wrapper.vm.$refs.affix.affixStyle).toBe(null);

    scrollTo(100);
    expect(wrapper.vm.$refs.affix.affixStyle).not.toBe(null);

    scrollTo(0);
    expect(wrapper.vm.$refs.affix.affixStyle).toBe(null);
  });
  it('support offsetBottom', () => {
    wrapper = mount(AffixMounter, {
      attachToDocument: true,
      propsData: {
        offsetBottom: 0,
      },
    });

    jest.runAllTimers();

    scrollTo(0);
    expect(wrapper.vm.$refs.affix.affixStyle).not.toBe(null);

    scrollTo(100);
    expect(wrapper.vm.$refs.affix.affixStyle).toBe(null);

    scrollTo(0);
    expect(wrapper.vm.$refs.affix.affixStyle).not.toBe(null);
  });

  it('updatePosition when offsetTop changed', () => {
    wrapper = mount(AffixMounter, {
      attachToDocument: true,
      propsData: {
        offsetTop: 0,
      },
    });

    jest.runAllTimers();

    scrollTo(100);
    expect(wrapper.vm.$refs.affix.affixStyle.top).toBe('0px');
    wrapper.setProps({
      offsetTop: 10,
    });
    jest.runAllTimers();
    expect(wrapper.vm.$refs.affix.affixStyle.top).toBe('10px');
  });
});
