'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  name: 'ExpandIcon',
  props: {
    record: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    expandable: _vueTypes2['default'].any,
    expanded: _vueTypes2['default'].bool,
    needIndentSpaced: _vueTypes2['default'].bool
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
module.exports = exports['default'];