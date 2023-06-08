import { mount } from '@vue/test-utils';
import { sleep } from '../../../tests/utils';
import Radio from '../Radio';
import RadioGroup from '../Group';

describe('Radio', () => {
  function createRadioGroup(props) {
    return {
      props: ['value'],
      render() {
        const groupProps = { ...props };
        if (this.value !== undefined) {
          groupProps.value = this.value;
        }
        return (
          <RadioGroup ref="radioGroup" {...groupProps}>
            <Radio value="A">A</Radio>
            <Radio value="B">B</Radio>
            <Radio value="C">C</Radio>
          </RadioGroup>
        );
      },
    };
  }

  function createRadioGroupByOption() {
    const options = [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
    ];
    return {
      render() {
        return <RadioGroup options={options} />;
      },
    };
  }

  it('responses hover events', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();

    const wrapper = mount({
      render() {
        return (
          <RadioGroup onMouseenter={onMouseEnter} onMouseleave={onMouseLeave}>
            <Radio />
          </RadioGroup>
        );
      },
    });

    wrapper.findAll('div')[0].trigger('mouseenter');
    expect(onMouseEnter).toHaveBeenCalled();

    wrapper.findAll('div')[0].trigger('mouseleave');
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('fire change events when value changes', async () => {
    const onChange = jest.fn();
    const props = { onChange };
    const wrapper = mount(createRadioGroup(props), { sync: false });
    let radios = null;
    await sleep();
    radios = wrapper.findAll('input');
    // uncontrolled component
    wrapper.vm.$refs.radioGroup.stateValue = 'B';
    // wrapper.setData({ value: 'B' })
    radios[0].trigger('change');
    expect(onChange.mock.calls.length).toBe(1);
    await sleep();
    expect(wrapper.html()).toMatchSnapshot();
    // controlled component
    wrapper.setProps({ value: 'A' });
    radios[1].trigger('change');
    expect(onChange.mock.calls.length).toBe(2);
    await sleep();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('both of radio and radioGroup will trigger onchange event when they exists', async () => {
    const onChange = jest.fn();
    const onChangeRadioGroup = jest.fn();

    const wrapper = mount(
      {
        props: ['value'],
        render() {
          const groupProps = {};
          if (this.value !== undefined) {
            groupProps.value = this.value;
          }
          return (
            <RadioGroup ref="radioGroup" {...groupProps} onChange={onChangeRadioGroup}>
              <Radio value="A" onChange={onChange}>
                A
              </Radio>
              <Radio value="B" onChange={onChange}>
                B
              </Radio>
              <Radio value="C" onChange={onChange}>
                C
              </Radio>
            </RadioGroup>
          );
        },
      },
      { sync: false },
    );
    const radios = wrapper.findAll('input');

    // uncontrolled component
    wrapper.vm.$refs.radioGroup.stateValue = 'B';
    radios[0].trigger('change');
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChangeRadioGroup.mock.calls.length).toBe(1);

    // controlled component
    wrapper.setProps({ value: 'A' });
    radios[1].trigger('change');
    expect(onChange.mock.calls.length).toBe(2);
  });

  it('Trigger onChange when both of radioButton and radioGroup exists', async () => {
    const onChange = jest.fn();
    const props = { onChange };
    const wrapper = mount(createRadioGroup(props), { sync: false });
    const radios = wrapper.findAll('input');

    // uncontrolled component
    wrapper.vm.$refs.radioGroup.stateValue = 'B';
    radios[0].trigger('change');
    expect(onChange.mock.calls.length).toBe(1);

    await sleep();
    // controlled component
    wrapper.setProps({ value: 'A' });
    radios[1].trigger('change');
    expect(onChange.mock.calls.length).toBe(2);
  });

  // it('should only trigger once when in group with options', () => {
  //   const onChange = jest.fn();
  //   const options = [{ label: 'Bamboo', value: 'Bamboo' }];
  //   const wrapper = mount(<RadioGroup options={options} onChange={onChange} />);

  //   wrapper.find('input').trigger('change');
  //   expect(onChange).toHaveBeenCalledTimes(1);
  // });

  // it('won\'t fire change events when value not changes', async () => {
  //   const onChange = jest.fn()

  //   const wrapper = mount(
  //     createRadioGroup({}, {
  //       change: onChange,
  //     }),
  //     { sync: false }
  //   )
  //   const radios = wrapper.findAll('input')
  //   await asyncExpect(() => {
  //     // uncontrolled component
  //     wrapper.vm.$refs.radioGroup.stateValue = 'B'
  //     radios[1].trigger('change')
  //     expect(onChange.mock.calls.length).toBe(0)
  //   })

  //   await asyncExpect(() => {

  //   }, 0)

  //   // // controlled component
  //   // wrapper.setProps({ value: 'A' })
  //   // radios[0].trigger('change')
  //   // expect(onChange.mock.calls.length).toBe(0)
  // })

  it('optional should correct render', () => {
    const wrapper = mount(createRadioGroupByOption());
    const radios = wrapper.findAll('input');

    expect(radios.length).toBe(3);
  });

  it('all children should have a name property', () => {
    const GROUP_NAME = 'radiogroup';
    const wrapper = mount(createRadioGroup({ name: GROUP_NAME }));
    expect(wrapper.html()).toMatchSnapshot();
    expect(
      wrapper.findAll('input[type="radio"]').forEach(el => {
        expect(el.element.name).toEqual(GROUP_NAME);
      }),
    );
  });

  it('passes prefixCls down to radio', () => {
    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Orange', value: 'Orange' },
    ];

    const wrapper = mount(RadioGroup, {
      props: {
        prefixCls: 'my-radio',
        options,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  fit('when onChange do not change the value, change event can be also triggered.', async () => {
    const onChange = jest.fn();
    const onChangeRadioGroup = () => {
      onChange();
      wrapper.setProps({ value: 'A' });
    };

    const wrapper = mount(
      {
        props: ['value'],
        render() {
          const value = this.value || 'A';
          return (
            <RadioGroup ref="radioGroup" value={value} onChange={onChangeRadioGroup}>
              <Radio value="A">A</Radio>
              <Radio value="B">B</Radio>
              <Radio value="C">C</Radio>
            </RadioGroup>
          );
        },
      },
      { sync: false },
    );
    await sleep();
    const radios = wrapper.findAll('input');
    radios[1].trigger('click');
    radios[1].trigger('change');
    await sleep(10);
    expect(onChange).toHaveBeenCalled();
  });
});
