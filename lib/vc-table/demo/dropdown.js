'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

var _menu = require('../../menu');

var _menu2 = _interopRequireDefault(_menu);

var _dropdown = require('../../dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Item = _menu2['default'].Item; /* eslint-disable no-console,func-names,react/no-multi-comp */

var Divider = _menu2['default'].Divider;


var data = [];
for (var i = 0; i < 10; i++) {
  data.push({
    key: i,
    a: 'a' + i,
    b: 'b' + i,
    c: 'c' + i
  });
}

exports['default'] = {
  data: function data() {
    this.filters = [];
    return {
      visible: false
    };
  },

  methods: {
    handleVisibleChange: function handleVisibleChange(visible) {
      this.visible = visible;
    },
    handleSelect: function handleSelect(selected) {
      this.filters.push(selected);
    },
    handleDeselect: function handleDeselect(key) {
      var index = this.filters.indexOf(key);
      if (index !== -1) {
        this.filters.splice(index, 1);
      }
    },
    confirmFilter: function confirmFilter() {
      console.log(this.filters.join(','));
      this.visible = false;
    }
  },

  render: function render() {
    var h = arguments[0];

    var menu = h(
      _menu2['default'],
      {
        style: { width: '200px' },
        attrs: { multiple: true,
          selectable: true
        },
        on: {
          'select': this.handleSelect,
          'deselect': this.handleDeselect
        }
      },
      [h(
        Item,
        { key: '1' },
        ['one']
      ), h(
        Item,
        { key: '2' },
        ['two']
      ), h(
        Item,
        { key: '3' },
        ['three']
      ), h(Divider), h(
        Item,
        {
          attrs: { disabled: true }
        },
        [h(
          'button',
          {
            style: {
              cursor: 'pointer',
              color: '#000',
              pointerEvents: 'visible'
            },
            on: {
              'click': this.confirmFilter
            }
          },
          ['\u786E\u5B9A']
        )]
      )]
    );

    var columns = [{
      title: h('div', ['title1', h(
        _dropdown2['default'],
        {
          attrs: {
            trigger: ['click'],

            visible: this.visible
          },
          on: {
            'visibleChange': this.handleVisibleChange
          }
        },
        [h(
          'template',
          { slot: 'overlay' },
          [menu]
        ), h(
          'a',
          {
            attrs: { href: '#' }
          },
          ['filter']
        )]
      )]), key: 'a', dataIndex: 'a', width: 100
    }, { title: 'title2', key: 'b', dataIndex: 'b', width: 100 }, { title: 'title3', key: 'c', dataIndex: 'c', width: 200 }];

    return h('div', [h('h2', ['use dropdown']), h(_index2['default'], {
      attrs: {
        columns: columns,
        data: data,
        rowKey: function rowKey(record) {
          return record.key;
        }
      }
    })]);
  }
};
module.exports = exports['default'];