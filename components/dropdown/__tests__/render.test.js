import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, onMounted, onUnmounted, ref } from 'vue';
import Dropdown from '..';
import Menu from '../../menu';

describe('Dropdown overlay rendering', () => {
  let wrapper;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  async function settle() {
    for (let i = 0; i < 20; i += 1) {
      await nextTick();
      jest.advanceTimersByTime(20);
    }
    await nextTick();
  }

  it('does not repeatedly render the overlay while opening', async () => {
    const overlay = jest.fn(() => <div class="overlay-content">content</div>);
    wrapper = mount(Dropdown, {
      props: { trigger: ['click'] },
      slots: { default: () => <button>Open</button>, overlay },
      attachTo: document.body,
    });
    expect(overlay).not.toHaveBeenCalled();
    await wrapper.find('button').trigger('click');
    await settle();
    expect(document.querySelector('.overlay-content').textContent).toBe('content');
    expect(overlay).toHaveBeenCalledTimes(1);
  });

  it('keeps reactive overlay content up to date', async () => {
    const content = ref('first');
    wrapper = mount(Dropdown, {
      props: { trigger: ['click'] },
      slots: {
        default: () => <button>Open</button>,
        overlay: () => <div class="overlay-content">{content.value}</div>,
      },
      attachTo: document.body,
    });
    await wrapper.find('button').trigger('click');
    await settle();
    content.value = 'second';
    await nextTick();
    expect(document.querySelector('.overlay-content').textContent).toBe('second');
  });

  it('updates an overlay replaced by the parent', async () => {
    wrapper = mount(
      {
        props: ['content'],
        render() {
          const content = this.content;
          return (
            <Dropdown
              open
              v-slots={{
                default: () => <button>Open</button>,
                overlay: () => <div class="overlay-content">{content}</div>,
              }}
            />
          );
        },
      },
      { props: { content: 'first' }, attachTo: document.body },
    );
    await settle();
    await wrapper.setProps({ content: 'second' });
    expect(document.querySelector('.overlay-content').textContent).toBe('second');
  });

  it.each([false, true])('preserves destroyPopupOnHide=%s', async destroyPopupOnHide => {
    const mounted = jest.fn();
    const unmounted = jest.fn();
    const Content = defineComponent({
      setup() {
        onMounted(mounted);
        onUnmounted(unmounted);
        return () => <div class="overlay-content">content</div>;
      },
    });
    wrapper = mount(Dropdown, {
      props: { trigger: ['click'], destroyPopupOnHide },
      slots: { default: () => <button>Open</button>, overlay: () => <Content /> },
      attachTo: document.body,
    });
    await wrapper.find('button').trigger('click');
    await settle();
    expect(mounted).toHaveBeenCalledTimes(1);
    await wrapper.find('button').trigger('click');
    await settle();
    expect(unmounted).toHaveBeenCalledTimes(destroyPopupOnHide ? 1 : 0);
    await wrapper.find('button').trigger('click');
    await settle();
    expect(mounted).toHaveBeenCalledTimes(destroyPopupOnHide ? 2 : 1);
    expect(document.querySelector('.overlay-content').textContent).toBe('content');
  });

  it('preserves menu clicks and the arrow', async () => {
    const onClick = jest.fn();
    wrapper = mount(Dropdown, {
      props: { trigger: ['click'], arrow: true },
      slots: {
        default: () => <button>Open</button>,
        overlay: () => (
          <Menu onClick={onClick}>
            <Menu.Item key="item">Item</Menu.Item>
          </Menu>
        ),
      },
      attachTo: document.body,
    });
    await wrapper.find('button').trigger('click');
    await settle();
    expect(document.querySelector('.ant-dropdown-arrow')).not.toBeNull();
    document.querySelector('.ant-dropdown-menu-item').click();
    await settle();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.ant-dropdown').style.display).toBe('none');
  });
});
