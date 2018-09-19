
import PropTypes from '../_util/vue-types'
import { initDefaultProps, getOptionProps } from '../_util/props-util'
import VcRate from '../vc-rate'
import Icon from '../icon'

export const RateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.value,
  defaultValue: PropTypes.value,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  character: PropTypes.any,
  autoFocus: PropTypes.bool,
}

const Rate = {
  name: 'ARate',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(RateProps, {
    prefixCls: 'ant-rate',
  }),
  methods: {
    focus () {
      this.$refs.refRate.focus()
    },
    blur () {
      this.$refs.refRate.blur()
    },
  },
  render () {
    const { character, ...restProps } = getOptionProps(this)
    const slotCharacter = this.$slots.character
    const rateProps = {
      props: {
        character,
        ...restProps,
      },
      on: this.$listeners,
      ref: 'refRate',
    }
    const slotCharacterHtml = slotCharacter !== undefined ? (
      <template slot='character'>{slotCharacter}</template>
    ) : <Icon slot='character' type='star' />
    return (
      <VcRate
        {...rateProps}
      >
        {
          character === undefined ? slotCharacterHtml : null
        }
      </VcRate>
    )
  },
}

/* istanbul ignore next */
Rate.install = function (Vue) {
  Vue.component(Rate.name, Rate)
}
export default Rate
