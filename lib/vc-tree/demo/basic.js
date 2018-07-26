'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

require('./basic.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint no-console:0 */
/* eslint no-alert:0 */
exports['default'] = {
  props: {
    keys: _vueTypes2['default'].array.def(['0-0-0-0'])
  },
  data: function data() {
    var keys = this.keys;
    return {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      switchIt: true
    };
  },

  methods: {
    onExpand: function onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys, arguments);
    },
    onSelect: function onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info);
      this.selKey = info.node.$options.propsData.eventKey;
    },
    onCheck: function onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info);
    },
    onEdit: function onEdit() {
      var _this = this;

      setTimeout(function () {
        console.log('current key: ', _this.selKey);
      }, 0);
    },
    onDel: function onDel(e) {
      if (!window.confirm('sure to delete?')) {
        return;
      }
      e.stopPropagation();
    },
    toggleChildren: function toggleChildren() {
      this.showMore = !this.showMore;
    }
  },

  render: function render() {
    var h = arguments[0];

    var customLabel = h(
      'span',
      { 'class': 'cus-label' },
      [h('span', ['operations: ']), h(
        'span',
        { style: { color: 'blue' }, on: {
            'click': this.onEdit
          }
        },
        ['Edit']
      ), '\xA0', h(
        'label',
        {
          on: {
            'click': function click(e) {
              return e.stopPropagation();
            }
          }
        },
        [h('input', {
          attrs: { type: 'checkbox' }
        }), ' checked']
      ), ' \xA0', h(
        'span',
        { style: { color: 'red' }, on: {
            'click': this.onDel
          }
        },
        ['Delete']
      )]
    );
    return h(
      'div',
      { style: { margin: '0 20px' } },
      [h('h2', ['simple']), h(
        _index2['default'],
        {
          'class': 'myCls', attrs: { showLine: true, checkable: true, defaultExpandAll: true,
            defaultExpandedKeys: this.defaultExpandedKeys,

            defaultSelectedKeys: this.defaultSelectedKeys,
            defaultCheckedKeys: this.defaultCheckedKeys
          },
          on: {
            'expand': this.onExpand,
            'select': this.onSelect,
            'check': this.onCheck
          }
        },
        [h(
          _index.TreeNode,
          {
            attrs: { title: 'parent 1' },
            key: '0-0' },
          [h(
            _index.TreeNode,
            {
              attrs: { title: customLabel },
              key: '0-0-0' },
            [h(_index.TreeNode, {
              attrs: { title: 'leaf' },
              key: '0-0-0-0' }), h(_index.TreeNode, {
              attrs: { title: 'leaf' },
              key: '0-0-0-1' })]
          ), h(
            _index.TreeNode,
            {
              attrs: { title: 'parent 1-1' },
              key: '0-0-1' },
            [h(_index.TreeNode, {
              attrs: { title: 'parent 1-1-0', disableCheckbox: true },
              key: '0-0-1-0' }), h(_index.TreeNode, {
              attrs: { title: 'parent 1-1-1' },
              key: '0-0-1-1' })]
          ), h(
            _index.TreeNode,
            {
              attrs: { title: 'parent 1-2', disabled: true },
              key: '0-0-2' },
            [h(_index.TreeNode, {
              attrs: { title: 'parent 1-2-0', disabled: true },
              key: '0-0-2-0' }), h(_index.TreeNode, {
              attrs: { title: 'parent 1-2-1' },
              key: '0-0-2-1' })]
          )]
        )]
      ), h('h2', ['Check on Click TreeNode']), h(
        _index2['default'],
        {
          'class': 'myCls',
          attrs: { showLine: true,
            checkable: true,
            selectable: false,
            defaultExpandAll: true,

            defaultSelectedKeys: this.defaultSelectedKeys,
            defaultCheckedKeys: this.defaultCheckedKeys
          },
          on: {
            'expand': this.onExpand,
            'select': this.onSelect,
            'check': this.onCheck
          }
        },
        [h(
          _index.TreeNode,
          {
            attrs: { title: 'parent 1' },
            key: '0-0' },
          [h(
            _index.TreeNode,
            {
              attrs: { title: 'parent 1-1' },
              key: '0-0-1' },
            [h(_index.TreeNode, {
              attrs: { title: 'parent 1-1-0', disableCheckbox: true },
              key: '0-0-1-0' }), h(_index.TreeNode, {
              attrs: { title: 'parent 1-1-1' },
              key: '0-0-1-1' })]
          )]
        )]
      )]
    );
  }
};
module.exports = exports['default'];