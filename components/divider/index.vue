<script>
import PropTypes from '../_util/vue-types'
export default {
  props: {
    prefixCls: PropTypes.string.def('ant'),
    type: PropTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
    dashed: PropTypes.bool,
  },
  computed: {
    classString () {
      const { prefixCls, type, $slots, dashed } = this
      return {
        [`${prefixCls}-divider`]: true, [`${prefixCls}-divider-${type}`]: true,
        [`${prefixCls}-divider-with-text`]: $slots.default,
        [`${prefixCls}-divider-dashed`]: !!dashed,
      }
    },
  },
  render () {
    const { classString, prefixCls, $slots } = this
    return (
      <div class={classString}>
        {$slots.default && <span className={`${prefixCls}-divider-inner-text`}>{$slots.default}</span>}
      </div>
    )
  },
}
</script>
