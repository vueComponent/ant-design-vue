'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var columns = [{ title: 'First Name', dataIndex: 'names.first', key: 'a', width: 100 }, { title: 'Last Name', dataIndex: 'names.last', key: 'b', width: 100 }, { title: 'Age', dataIndex: 'age', key: 'c', width: 100 }];

var data = [{
  age: '23',
  names: {
    first: 'John',
    last: 'Doe'
  },
  key: '1'
}, {
  age: '36',
  names: {
    first: 'Terry',
    last: 'Garner'
  },
  key: '2'
}, {
  age: '52',
  names: {
    first: 'Thomas',
    last: 'Goodwin'
  },
  key: '3'
}];
exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['Nested data table']), h(_index2['default'], {
      attrs: {
        columns: columns,
        data: data
      },
      'class': 'table'
    })]);
  }
};
module.exports = exports['default'];