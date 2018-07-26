import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
/* eslint-disable no-console,func-names,react/no-multi-comp */
import Table from '../index';
import '../assets/index.less';
import BaseMixin from '../../_util/BaseMixin';

var ResizeableTitle = function ResizeableTitle(h, props, children) {
  console.log(props);

  var width = props.width,
      restProps = _objectWithoutProperties(props, ['width']);

  if (!width) {
    return h(
      'th',
      restProps,
      [children]
    );
  }
  return h(
    'th',
    _mergeJSXProps([restProps, {
      attrs: { width: width }
    }]),
    [children]
  );
};

export default {
  mixins: [BaseMixin],
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

          var nextColumns = [].concat(_toConsumableArray(columns));
          nextColumns[index] = _extends({}, nextColumns[index], {
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
      return _extends({}, col, {
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

    return h('div', [h('h2', ['Integrate with react-resizable']), h(Table, {
      attrs: { components: this.components, columns: columns, data: this.data }
    })]);
  }
};