'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, {
      title: 'Operations',
      dataIndex: '',
      key: 'd',
      customRender: function customRender() {
        var h = this.$createElement;

        return h(
          'a',
          {
            attrs: { href: '#' }
          },
          ['Operations']
        );
      }
    }];
    var row = {
      render: function render() {
        var h = arguments[0];

        return h(
          'tr',
          { style: { color: 'red' } },
          [this.$slots['default']]
        );
      }
    };
    var components = {
      body: {
        row: row
      }
    };
    return h('div', [h('h2', ['Integrate with styled-components']), h(_index2['default'], {
      attrs: { columns: columns, data: data, components: components }
    })]);
  }
};
module.exports = exports['default'];