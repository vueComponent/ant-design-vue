import { mount } from '@vue/test-utils'
import Checkbox from '../index'

describe('CheckboxGroup', () => {
  it('should work basically', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      {
        render () {
          return <Checkbox.Group options={['Apple', 'Pear', 'Orange']} onChange={onChange} />
        },
      }
    )
    wrapper.findAll('.ant-checkbox-input').at(0).trigger('change')
    expect(onChange).toBeCalledWith(['Apple'])
    wrapper.findAll('.ant-checkbox-input').at(1).trigger('change')
    expect(onChange).toBeCalledWith(['Apple', 'Pear'])
    wrapper.findAll('.ant-checkbox-input').at(2).trigger('change')
    expect(onChange).toBeCalledWith(['Apple', 'Pear', 'Orange'])
    wrapper.findAll('.ant-checkbox-input').at(1).trigger('change')
    expect(onChange).toBeCalledWith(['Apple', 'Orange'])
  })

  it('does not trigger onChange callback of both Checkbox and CheckboxGroup when CheckboxGroup is disabled', () => {
    const onChangeGroup = jest.fn()

    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
    ]

    const groupWrapper = mount(
      {
        render () {
          return <Checkbox.Group options={options} onChange={onChangeGroup} disabled />
        },
      }
    )
    groupWrapper.findAll('.ant-checkbox-input').at(0).trigger('change')
    expect(onChangeGroup).not.toBeCalled()
    groupWrapper.findAll('.ant-checkbox-input').at(1).trigger('change')
    expect(onChangeGroup).not.toBeCalled()
  })

  it('does not prevent onChange callback from Checkbox when CheckboxGroup is not disabled', () => {
    const onChangeGroup = jest.fn()

    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Orange', value: 'Orange', disabled: true },
    ]

    const groupWrapper = mount(
      {
        render () {
          return <Checkbox.Group options={options} onChange={onChangeGroup} />
        },
      }
    )
    groupWrapper.findAll('.ant-checkbox-input').at(0).trigger('change')
    expect(onChangeGroup).toBeCalledWith(['Apple'])
    groupWrapper.findAll('.ant-checkbox-input').at(1).trigger('change')
    expect(onChangeGroup).toBeCalledWith(['Apple'])
  })
})
