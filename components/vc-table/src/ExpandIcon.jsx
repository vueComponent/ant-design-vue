import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
export default {
  name: 'ExpandIcon',
  mixins: [BaseMixin],
  props: {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    expandable: PropTypes.any,
    expanded: PropTypes.bool,
    needIndentSpaced: PropTypes.bool,
  },
  methods: {
    onExpand(e) {
      this.__emit('expand', this.record, e);
    },
  },

  render() {
    const { expandable, prefixCls, onExpand, needIndentSpaced, expanded } = this;
    if (expandable) {
      const expandClassName = expanded ? 'expanded' : 'collapsed';
      return (
        <span
          class={`${prefixCls}-expand-icon ${prefixCls}-${expandClassName}`}
          onClick={onExpand}
        />
      );
    } else if (needIndentSpaced) {
      return <span class={`${prefixCls}-expand-icon ${prefixCls}-spaced`} />;
    }
    return null;
  },
};
