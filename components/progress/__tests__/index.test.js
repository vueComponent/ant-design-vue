import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Progress from '..'

describe('Progress', () => {
  it('successPercent should decide the progress status when it exists', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 100,
        successPercent: 50,
      },
      sync: false,
    })
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(0)
    })

    wrapper.setProps({ percent: 50, successPercent: 100 })
    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-progress-status-success')).toHaveLength(1)
    })
  })
})
