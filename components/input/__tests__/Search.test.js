import { mount } from '@vue/test-utils'
import { asyncExpect } from '@/tests/utils'
import Input from '../index'
import Button from '../../button'
import focusTest from '../../../tests/shared/focusTest'

const { Search } = Input
describe('Input.Search', () => {
  focusTest(Search)

  it('should support custom button', async () => {
    const wrapper = mount({
      render () {
        return <Search enterButton={<button type='button'>ok</button>} />
      },
    }, { sync: false })
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  it('should support custom Button', async () => {
    const wrapper = mount({
      render () {
        return <Search enterButton={<Button>ok</Button>} />
      },
    }, { sync: false })
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
