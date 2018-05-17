import Affix from '..'
import Button from '../../button'
import { mount } from '@vue/test-utils'
const events = {}

const AffixMounter = {
  mounted () {
    this.$refs.container.scrollTop = 100
    this.$refs.container.addEventListener = jest.fn().mockImplementation((event, cb) => {
      events[event] = cb
    })
  },
  methods: {
    getTarget () {
      return this.$refs.container
    },
  },

  render () {
    return (
      <div
        style={{
          height: '100px',
          overflowY: 'scroll',
        }}
        ref='container'
      >
        <div
          className='background'
          style={{
            paddingTop: '60px',
            height: '300px',
          }}
        >
          <Affix
            target={() => this.$refs.container}
            ref='affix'
          >
            <Button type='primary' >
              Fixed at the top of container
            </Button>
          </Affix>
        </div>
      </div>
    )
  },
}
describe('Affix Render', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  it('Affix render perfectly', () => {
    const wrapper = mount(AffixMounter, { attachToDocument: true })
    jest.runAllTimers()

    wrapper.vm.$refs.affix.$refs.fixedNode.parentNode.getBoundingClientRect = jest.fn(() => {
      return {
        bottom: 100, height: 28, left: 0, right: 0, top: -50, width: 195,
      }
    })
    events.scroll({
      type: 'scroll',
    })
    jest.runAllTimers()
    expect(wrapper.vm.$refs.affix.affixStyle).not.toBe(null)
  })
})
