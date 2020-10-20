import classNames from '../../../../_util/classNames';
import PropTypes from '../../../../_util/vue-types';
import { toTitle, UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE } from '../../util';
import { getComponent } from '../../../../_util/props-util';
import BaseMixin from '../../../../_util/BaseMixin';

const Selection = {
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    maxTagTextLength: PropTypes.number,
    // onRemove: PropTypes.func,

    label: PropTypes.any,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    removeIcon: PropTypes.any,
  },
  methods: {
    onRemove(event) {
      const { value } = this.$props;
      this.__emit('remove', event, value);
      event.stopPropagation();
    },
  },

  render() {
    const { prefixCls, maxTagTextLength, label, value } = this.$props;
    let content = label || value;
    if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
      content = `${content.slice(0, maxTagTextLength)}...`;
    }
    const { class: className, style, onRemove } = this.$attrs;
    return (
      <span
        style={{ ...UNSELECTABLE_STYLE, ...style }}
        {...UNSELECTABLE_ATTRIBUTE}
        role="menuitem"
        class={classNames(`${prefixCls}-selection-item`, className)}
        title={toTitle(label)}
      >
        <span class={`${prefixCls}-selection-item-content`}>{content}</span>
        {onRemove && (
          <span class={`${prefixCls}-selection-item-remove`} onClick={this.onRemove}>
            {getComponent(this, 'removeIcon')}
          </span>
        )}
      </span>
    );
  },
};

export default Selection;
