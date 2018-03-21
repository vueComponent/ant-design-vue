
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
  hoverChange: PropTypes.func,
  character: PropTypes.any,
}

export default {
  name: 'Rate',
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

