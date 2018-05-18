import { mount } from '@vue/test-utils'
import Badge from '../index'

describe('Badge', () => {
  test('badge dot not scaling count > 9', () => {
    const badge = mount({
      render () {
        return <Badge count={10} dot />
      },
    })
    expect(badge.findAll('.ant-card-multiple-words').length).toBe(0)
  })
  test('badge dot not showing count == 0', () => {
    const badge = mount({
      render () {
        return <Badge count={0} dot />
      },
    })
    expect(badge.findAll('.ant-badge-dot').length).toBe(0)
  })
})
