'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable no-console,func-names,react/no-multi-comp */
var onRowClick = function onRowClick(record, index, event) {
  console.log('Click nth(' + index + ') row of parent, record.name: ' + record.name);
  // See https://facebook.github.io/react/docs/events.html for original click event details.
  if (event.shiftKey) {
    console.log('Shift + mouse click triggered.');
  }
};

var onRowDoubleClick = function onRowDoubleClick(record, index, e) {
  console.log('Double click nth(' + index + ') row of parent, record.name: ' + record.name, e);
};

var data = [{
  key: 1,
  name: 'a',
  age: 32,
  address: 'I am a',
  children: [{
    key: 11,
    name: 'aa',
    age: 33,
    address: 'I am aa'
  }, {
    key: 12,
    name: 'ab',
    age: 33,
    address: 'I am ab',
    children: [{
      key: 121,
      name: 'aba',
      age: 33,
      address: 'I am aba'
    }]
  }, {
    key: 13,
    name: 'ac',
    age: 33,
    address: 'I am ac',
    children: [{
      key: 131,
      name: 'aca',
      age: 33,
      address: 'I am aca',
      children: [{
        key: 1311,
        name: 'acaa',
        age: 33,
        address: 'I am acaa'
      }, {
        key: 1312,
        name: 'acab',
        age: 33,
        address: 'I am acab'
      }]
    }]
  }]
}, {
  key: 2,
  name: 'b',
  age: 32,
  address: 'I am b'
}];

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 400
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      customRender: function customRender(text) {
        return h('span', [text, ' (Trigger Cell Click)']);
      },
      customCell: function customCell(record) {
        return {
          on: {
            click: function click(e) {
              console.log('Click cell', record, e.target);
            }
          }
        };
      }
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200
    }];
    return h(_index2['default'], {
      attrs: {
        columns: columns,
        data: data,
        customRow: function customRow(record, index) {
          return {
            on: {
              click: onRowClick.bind(null, record, index),
              dblclick: onRowDoubleClick.bind(null, record, index)
            }
          };
        }
      }
    });
  }
};
module.exports = exports['default'];