import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Select from '..'
import focusTest from '../../../tests/shared/focusTest'

describe('Select', () => {
  focusTest(Select)

  it('should have default notFoundContent', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: 'multiple',
      },
      sync: false,
    })
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click')
    })
    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })

    await asyncExpect(() => {
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).length).toBe(1)
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).at(0).text()).toBe('Not Found')
    })
  })

  it('should support set notFoundContent to null', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: 'multiple',
        notFoundContent: null,
      },
      sync: false,
    })
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click')
    })
    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    await asyncExpect(() => {
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).length).toBe(0)
    })
  })

  it('should not have default notFoundContent when mode is combobox', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
      },
      sync: false,
    })
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click')
    })

    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    await asyncExpect(() => {
      expect(dropdownWrapper.findAll('MenuItem').length).toBe(0)
    })
  })

  it('should not have notFoundContent when mode is combobox and notFoundContent is set', async () => {
    const wrapper = mount(Select, {
      propsData: {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
        notFoundContent: 'not at all',
      },
      sync: false,
    })
    await asyncExpect(() => {
      wrapper.find('.ant-select').trigger('click')
    })

    const dropdownWrapper = mount({
      render () {
        return wrapper.find({ name: 'Trigger' }).vm.getComponent()
      },
    }, { sync: false })
    await asyncExpect(() => {
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).length).toBe(1)
      expect(dropdownWrapper.findAll({ name: 'MenuItem' }).at(0).text()).toBe('not at all')
    })
  })
})
