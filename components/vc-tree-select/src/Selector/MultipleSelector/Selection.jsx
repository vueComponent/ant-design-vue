import PropTypes from '../../../../_util/vue-types';
import { toTitle, UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE } from '../../util';
import { getComponentFromProp, getListeners } from '../../../../_util/props-util';
import BaseMixin from '../../../../_util/BaseMixin';

const Selection = {
  mixins: [BaseMixin],
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

    return (
      <li
        style={UNSELECTABLE_STYLE}
        {...{ attrs: UNSELECTABLE_ATTRIBUTE }}
        role="menuitem"
        class={`${prefixCls}-selection__choice`}
        title={toTitle(label)}
      >
        {getListeners(this).remove && (
          <span class={`${prefixCls}-selection__choice__remove`} onClick={this.onRemove}>
            {getComponentFromProp(this, 'removeIcon')}
          </span>
        )}
        <span class={`${prefixCls}-selection__choice__content`}>{content}</span>
      </li>
    );
  },
};

export default Selection;
