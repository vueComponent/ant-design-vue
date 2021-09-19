import { mount } from '@vue/test-utils';
import { h } from 'vue';
import MockDate from 'mockdate';
import Descriptions from '..';
import { resetWarned } from '../../_util/warning';
import { asyncExpect } from '../../../tests/utils';

describe('Descriptions', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    MockDate.reset();
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('when typeof column is object', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions ref="descriptions" column={{ xs: 8, sm: 16, md: 24 }}>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(
        wrapper.findAll('td').reduce((total, td) => total + parseInt(td.attributes().colspan), 0),
      ).toBe(8);
    }, 100);
    wrapper.unmount();
  });

  it('column is number', () => {
    // eslint-disable-next-line global-require
    const wrapper = mount({
      render() {
        return (
          <Descriptions column={3}>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('warning if ecceed the row span', () => {
    resetWarned();

    mount({
      render() {
        return (
          <Descriptions column={3}>
            <Descriptions.Item label="Product" span={2}>
              Cloud Database
            </Descriptions.Item>
            <Descriptions.Item label="Billing" span={2}>
              Prepaid
            </Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antdv: Descriptions] Sum of column `span` in a line not match `column` of Descriptions.',
    );
  });

  it('when item is rendered conditionally', () => {
    const hasDiscount = false;
    const wrapper = mount({
      render() {
        return (
          <Descriptions>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            {hasDiscount && <Descriptions.Item label="Discount">$20.00</Descriptions.Item>}
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('vertical layout', () => {
    // eslint-disable-next-line global-require
    const wrapper = mount({
      render() {
        return (
          <Descriptions layout="vertical">
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('Descriptions.Item support className', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions>
            <Descriptions.Item label="Product" class="my-class">
              Cloud Database
            </Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Descriptions support colon', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions colon={false}>
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Descriptions support style', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions style={{ backgroundColor: '#e8e8e8' }}>
            <Descriptions.Item>Cloud Database</Descriptions.Item>
          </Descriptions>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('when max-width: 575px，column=1', async () => {
    // eslint-disable-next-line global-require
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
              <Descriptions.Item>No-Label</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('tr')).toHaveLength(5);
      expect(wrapper.findAll('.ant-descriptions-item-label')).toHaveLength(4);
    });

    wrapper.unmount();
  });

  it('when max-width: 575px，column=2', async () => {
    const wrapper = mount(
      {
        render() {
          return (
            <Descriptions column={{ xs: 2 }}>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
              <Descriptions.Item label="time">18:00:00</Descriptions.Item>
              <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            </Descriptions>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    await asyncExpect(() => {
      expect(wrapper.findAll('tr')).toHaveLength(2);
    });
    wrapper.unmount();
  });

  it('columns 5 with customize', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions layout="vertical" column={4}>
            {/* 1 1 1 1 */}
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
            {/* 2 2 */}
            <Descriptions.Item label="bamboo" span={2}>
              bamboo
            </Descriptions.Item>
            <Descriptions.Item label="bamboo" span={2}>
              bamboo
            </Descriptions.Item>
            {/* 3 1 */}
            <Descriptions.Item label="bamboo" span={3}>
              bamboo
            </Descriptions.Item>
            <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
          </Descriptions>
        );
      },
    });

    function matchSpan(rowIndex, spans) {
      const tr = wrapper.findAll('tr')[rowIndex];
      const tds = tr.findAll('th');
      expect(tds.length).toEqual(spans.length);
      tds.forEach((td, index) => {
        expect(parseInt(td.attributes().colspan)).toEqual(spans[index]);
      });
    }

    matchSpan(0, [1, 1, 1, 1]);
    matchSpan(2, [2, 2]);
    matchSpan(4, [3, 1]);
  });

  it('number value should render correct', () => {
    const wrapper = mount({
      render() {
        return (
          <Descriptions bordered>
            <Descriptions.Item label={0}>{0}</Descriptions.Item>
          </Descriptions>
        );
      },
    });

    expect(wrapper.find('th').classes()).toContain('ant-descriptions-item-label');
    expect(wrapper.find('td').classes()).toContain('ant-descriptions-item-content');
  });

  it('Descriptions support extra', async () => {
    const wrapper = mount(Descriptions, {
      props: {
        extra: 'Edit',
      },
      slots: {
        default: h(
          Descriptions.Item,
          {
            label: 'UserName',
          },
          'Zhou Maomao',
        ),
      },
    });

    await asyncExpect(() => {
      expect(wrapper.find('.ant-descriptions-extra').exists()).toBe(true);
    });

    wrapper.setProps({ extra: undefined });

    await asyncExpect(() => {
      expect(wrapper.find('.ant-descriptions-extra').exists()).toBe(false);
    });
  });
});
