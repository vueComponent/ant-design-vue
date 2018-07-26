import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
export default {
  mixins: [BaseMixin],
  name: 'ExpandIcon',
  props: {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    expandable: PropTypes.any,
    expanded: PropTypes.bool,
    needIndentSpaced: PropTypes.bool
  },
  methods: {
    onExpand: function onExpand(e) {
      this.__emit('expand', this.record, e);
    }
  },

  render: function render() {
    var h = arguments[0];
    var expandable = this.expandable,
        prefixCls = this.prefixCls,
        onExpand = this.onExpand,
        needIndentSpaced = this.needIndentSpaced,
        expanded = this.expanded;

    if (expandable) {
      var expandClassName = expanded ? 'expanded' : 'collapsed';
      return h('span', {
        'class': prefixCls + '-expand-icon ' + prefixCls + '-' + expandClassName,
        on: {
          'click': onExpand
        }
      });
    } else if (needIndentSpaced) {
      return h('span', { 'class': prefixCls + '-expand-icon ' + prefixCls + '-spaced' });
    }
    return null;
  }
};