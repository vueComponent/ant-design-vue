import { mount } from '@vue/test-utils';
import { asyncExpect, sleep } from '../../../tests/utils';
import Checkbox from '../index';
import mountTest from '../../../tests/shared/mountTest';

describe('CheckboxGroup', () => {
  mountTest(Checkbox.Group);
  it('should work basically', async () => {
    const onChange = jest.fn();
    const wrapper = mount(
      {
        render() {
          return <Checkbox.Group options={['Apple', 'Pear', 'Orange']} onChange={onChange} />;
        },
      },
      {
        sync: false,
      },
    );
    wrapper.findAll('.ant-checkbox-input')[0].trigger('change');
    await sleep();
    expect(onChange).toHaveBeenCalledWith(['Apple']);
    wrapper.findAll('.ant-checkbox-input')[1].trigger('change');
    await sleep();
    expect(onChange).toHaveBeenCalledWith(['Apple', 'Pear']);
    wrapper.findAll('.ant-checkbox-input')[2].trigger('change');
    await sleep();
    expect(onChange).toHaveBeenCalledWith(['Apple', 'Pear', 'Orange']);
    wrapper.findAll('.ant-checkbox-input')[1].trigger('change');
    await sleep();
    expect(onChange).toHaveBeenCalledWith(['Apple', 'Orange']);
  });

  it('does not trigger onChange callback of both Checkbox and CheckboxGroup when CheckboxGroup is disabled', () => {
    const onChangeGroup = jest.fn();

    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
    ];

    const groupWrapper = mount(
      {
        render() {
          return <Checkbox.Group options={options} onChange={onChangeGroup} disabled />;
        },
      },
      {
        sync: false,
      },
    );
    groupWrapper.findAll('.ant-checkbox-input')[0].trigger('change');
    expect(onChangeGroup).not.toBeCalled();
    groupWrapper.findAll('.ant-checkbox-input')[1].trigger('change');
    expect(onChangeGroup).not.toBeCalled();
  });

  it('does not prevent onChange callback from Checkbox when CheckboxGroup is not disabled', () => {
    const onChangeGroup = jest.fn();

    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Orange', value: 'Orange', disabled: true },
    ];

    const groupWrapper = mount(
      {
        render() {
          return <Checkbox.Group options={options} onChange={onChangeGroup} />;
        },
      },
      {
        sync: false,
      },
    );
    groupWrapper.findAll('.ant-checkbox-input')[0].trigger('change');
    expect(onChangeGroup).toHaveBeenCalledWith(['Apple']);
    groupWrapper.findAll('.ant-checkbox-input')[1].trigger('change');
    expect(onChangeGroup).toHaveBeenCalledWith(['Apple']);
  });

  it('passes prefixCls down to checkbox', () => {
    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Orange', value: 'Orange' },
    ];

    const wrapper = mount({
      render() {
        return <Checkbox.Group prefixCls="my-checkbox" options={options} />;
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should be controlled by value', async () => {
    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Orange', value: 'Orange' },
    ];

    const wrapper = mount(Checkbox.Group, {
      props: { options },
      sync: false,
    });
    expect(wrapper.vm.mergedValue).toEqual([]);
    wrapper.setProps({ value: ['Apple'] });
    await asyncExpect(() => {
      expect(wrapper.vm.mergedValue).toEqual(['Apple']);
    });
  });

  // https://github.com/ant-design/ant-design/issues/12642
  it('should trigger onChange in sub Checkbox', () => {
    const onChange = jest.fn();
    const wrapper = mount({
      render() {
        return (
          <Checkbox.Group>
            <Checkbox value="my" onChange={onChange} />
          </Checkbox.Group>
        );
      },
    });
    wrapper.findAll('.ant-checkbox-input')[0].trigger('change');
    expect(onChange).toBeCalled();
    expect(onChange.mock.calls[0][0].target.value).toEqual('my');
  });
});
