import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Progress from '..';

describe('Progress', () => {
  it('successPercent should decide the progress status when it exists', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 100,
        successPercent: 50,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(0);
    });

    wrapper.setProps({ percent: 50, successPercent: 100 });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(1);
    });

    wrapper.setProps({ percent: 100, successPercent: 0 });
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(0);
    });
  });

  it('render out-of-range progress', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 120,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render out-of-range progress with info', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 120,
        showInfo: true,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render negetive progress', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: -20,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render negetive successPercent', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 50,
        successPercent: -20,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render negetive successPercent', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 50,
        successPercent: 10,
        format: (percent, successPercent) => `${percent} ${successPercent}`,
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render format', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 50,
        type: 'circle',
        strokeColor: 'red',
      },
      sync: false,
    });
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('render normal progress', () => {
    const wrapper = mount(Progress, { propsData: { status: 'normal' } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
