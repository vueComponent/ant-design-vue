'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('./simple.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: { marginBottom: 12 } },
      [h(
        _index2['default'],
        {
          attrs: { activeClassName: 'active', activeStyle: { color: 'red' } }
        },
        [h(
          'div',
          { 'class': 'normal', style: {
              backgroundColor: 'yellow'
            },
            on: {
              'click': function click() {
                return console.log('click div');
              }
            }
          },
          ['click to active']
        )]
      )]
    );
  }
};
module.exports = exports['default'];