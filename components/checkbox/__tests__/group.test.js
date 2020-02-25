import { mount } from '@vue/test-utils';
import { asyncExpect } from '@/tests/utils';
import Checkbox from '../index';

describe('CheckboxGroup', () => {
  it('should work basically', () => {
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
    wrapper
      .findAll('.ant-checkbox-input')
      .at(0)
      .trigger('change');
    expect(onChange).toBeCalledWith(['Apple']);
    wrapper
      .findAll('.ant-checkbox-input')
      .at(1)
      .trigger('change');
    expect(onChange).toBeCalledWith(['Apple', 'Pear']);
    wrapper
      .findAll('.ant-checkbox-input')
      .at(2)
      .trigger('change');
    expect(onChange).toBeCalledWith(['Apple', 'Pear', 'Orange']);
    wrapper
      .findAll('.ant-checkbox-input')
      .at(1)
      .trigger('change');
    expect(onChange).toBeCalledWith(['Apple', 'Orange']);
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
    groupWrapper
      .findAll('.ant-checkbox-input')
      .at(0)
      .trigger('change');
    expect(onChangeGroup).not.toBeCalled();
    groupWrapper
      .findAll('.ant-checkbox-input')
      .at(1)
      .trigger('change');
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
    groupWrapper
      .findAll('.ant-checkbox-input')
      .at(0)
      .trigger('change');
    expect(onChangeGroup).toBeCalledWith(['Apple']);
    groupWrapper
      .findAll('.ant-checkbox-input')
      .at(1)
      .trigger('change');
    expect(onChangeGroup).toBeCalledWith(['Apple']);
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
      propsData: { options },
      sync: false,
    });

    expect(wrapper.vm.sValue).toEqual([]);
    wrapper.setProps({ value: ['Apple'] });
    await asyncExpect(() => {
      expect(wrapper.vm.sValue).toEqual(['Apple']);
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
    wrapper
      .findAll('.ant-checkbox-input')
      .at(0)
      .trigger('change');
    expect(onChange).toBeCalled();
    expect(onChange.mock.calls[0][0].target.value).toEqual('my');
  });
});
