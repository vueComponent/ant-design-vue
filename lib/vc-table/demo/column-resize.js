'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ResizeableTitle = function ResizeableTitle(h, props, children) {
  console.log(props);
  var width = props.width,
      restProps = (0, _objectWithoutProperties3['default'])(props, ['width']);


  if (!width) {
    return h(
      'th',
      restProps,
      [children]
    );
  }
  return h(
    'th',
    (0, _babelHelperVueJsxMergeProps2['default'])([restProps, {
      attrs: { width: width }
    }]),
    [children]
  );
}; /* eslint-disable no-console,func-names,react/no-multi-comp */
exports['default'] = {
  mixins: [_BaseMixin2['default']],
  data: function data() {
    var h = this.$createElement;

    return {
      columns: [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, {
        title: 'Operations', dataIndex: '', key: 'd', customRender: function customRender() {
          var h = this.$createElement;

          return h(
            'a',
            {
              attrs: { href: '#' }
            },
            ['Operations']
          );
        }
      }],
      data: [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }],
      components: {
        header: {
          cell: ResizeableTitle
        }
      }
    };
  },

  methods: {
    handleResize: function handleResize(index) {
      var _this = this;

      return function (e, _ref) {
        var size = _ref.size;

        _this.setState(function (_ref2) {
          var columns = _ref2.columns;

          var nextColumns = [].concat((0, _toConsumableArray3['default'])(columns));
          nextColumns[index] = (0, _extends3['default'])({}, nextColumns[index], {
            width: size.width
          });
          return { columns: nextColumns };
        });
      };
    }
  },

  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    var columns = this.columns.map(function (col, index) {
      return (0, _extends3['default'])({}, col, {
        customHeaderCell: function customHeaderCell(column) {
          return {
            props: {
              width: column.width
            },
            on: {
              resize: _this2.handleResize(index)
            }
          };
        }
      });
    });

    return h('div', [h('h2', ['Integrate with react-resizable']), h(_index2['default'], {
      attrs: { components: this.components, columns: columns, data: this.data }
    })]);
  }
};
module.exports = exports['default'];