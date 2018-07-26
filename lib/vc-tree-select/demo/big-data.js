'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

require('../assets/index.less');

require('./demo.less');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _bigDataGenerator = require('./big-data-generator');

var _bigDataGenerator2 = _interopRequireDefault(_bigDataGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint react/no-multi-comp:0, no-console:0 */

exports['default'] = {
  data: function data() {
    return {
      gData: [],
      gData1: [],
      value: '',
      value1: ''
    };
  },

  methods: {
    onChange: function onChange(value) {
      console.log('onChange', arguments);
      this.value = value;
    },
    onChangeStrictly: function onChangeStrictly(value1) {
      console.log('onChangeStrictly', arguments);
      var ind = parseInt(Math.random() * 3, 10);
      value1.push({ value: '0-0-0-' + ind + '-value', label: '0-0-0-' + ind + '-label', halfChecked: true });
      this.value1 = value1;
    },
    onGen: function onGen(data) {
      (0, _extends3['default'])(this.$data, {
        gData: data,
        gData1: [].concat((0, _toConsumableArray3['default'])(data)),
        value: '0-0-0-value',
        value1: [{ value: '0-0-value', label: '0-0-label', halfChecked: true }, { value: '0-0-0-value', label: '0-0-0-label' }]
        // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      });
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: { padding: '0 20px' } },
      [h(_bigDataGenerator2['default'], {
        on: {
          'gen': this.onGen
        }
      }), h(
        'div',
        { style: { display: 'flex' } },
        [h(
          'div',
          { style: { marginRight: '20px' } },
          [h('h3', ['normal check']), h(_index2['default'], {
            style: { width: '300px' },
            attrs: { dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
              treeData: this.gData, treeLine: true,
              value: this.value,
              placeholder: h('i', ['\u8BF7\u4E0B\u62C9\u9009\u62E9']),
              treeCheckable: true,
              showCheckedStrategy: _index.SHOW_PARENT
            },
            on: {
              'change': this.onChange
            }
          })]
        ), h('div', [h('h3', ['checkStrictly']), h(_index2['default'], {
          style: { width: '300px' },
          attrs: { dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
            treeData: this.gData1, treeLine: true,
            value: this.value1,
            placeholder: h('i', ['\u8BF7\u4E0B\u62C9\u9009\u62E9']),
            treeCheckable: true,
            treeCheckStrictly: true,
            showCheckedStrategy: _index.SHOW_PARENT
          },
          on: {
            'change': this.onChangeStrictly
          }
        })])]
      )]
    );
  }
};
module.exports = exports['default'];