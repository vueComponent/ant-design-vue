'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable no-console,func-names,react/no-multi-comp */
var columns = [{ title: '手机号', dataIndex: 'a', colSpan: 2, width: 100, key: 'a', customRender: function customRender(o, row, index) {
    var h = this.$createElement;

    var obj = {
      children: o,
      props: {}
      // 设置第一行为链接
    };if (index === 0) {
      obj.children = h(
        'a',
        {
          attrs: { href: '#' }
        },
        [o]
      );
    }
    // 第5行合并两列
    if (index === 4) {
      obj.props.colSpan = 2;
    }

    if (index === 5) {
      obj.props.colSpan = 6;
    }
    return obj;
  }
}, { title: '电话', dataIndex: 'b', colSpan: 0, width: 100, key: 'b', customRender: function customRender(o, row, index) {
    var obj = {
      children: o,
      props: {}
      // 列合并掉的表格设置colSpan=0，不会去渲染
    };if (index === 4 || index === 5) {
      obj.props.colSpan = 0;
    }
    return obj;
  }
}, { title: 'Name', dataIndex: 'c', width: 100, key: 'c', customRender: function customRender(o, row, index) {
    var obj = {
      children: o,
      props: {}
    };

    if (index === 5) {
      obj.props.colSpan = 0;
    }
    return obj;
  }
}, { title: 'Address', dataIndex: 'd', width: 200, key: 'd', customRender: function customRender(o, row, index) {
    var obj = {
      children: o,
      props: {}
    };
    if (index === 0) {
      obj.props.rowSpan = 2;
    }
    if (index === 1 || index === 5) {
      obj.props.rowSpan = 0;
    }

    return obj;
  }
}, { title: 'Gender', dataIndex: 'e', width: 200, key: 'e', customRender: function customRender(o, row, index) {
    var obj = {
      children: o,
      props: {}
    };
    if (index === 5) {
      obj.props.colSpan = 0;
    }
    return obj;
  }
}, {
  title: 'Operations', dataIndex: '', key: 'f',
  customRender: function customRender(o, row, index) {
    var h = this.$createElement;

    if (index === 5) {
      return {
        props: {
          colSpan: 0
        }
      };
    }
    return h(
      'a',
      {
        attrs: { href: '#' }
      },
      ['Operations']
    );
  }
}];

var data = [{ a: '13812340987', b: '0571-12345678', c: '张三', d: '文一西路', e: 'Male', key: '1' }, { a: '13812340986', b: '0571-98787658', c: '张夫人', d: '文一西路', e: 'Female', key: '2' }, { a: '13812988888', b: '0571-099877', c: '李四', d: '文二西路', e: 'Male', key: '3' }, { a: '1381200008888', b: '0571-099877', c: '王五', d: '文二西路', e: 'Male', key: '4' }, { a: '0571-88888110', c: '李警官', d: '武林门', e: 'Male', key: '5' }, { a: '资料统计完毕于xxxx年xxx月xxx日', key: '6' }];

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h('div', [h('h2', ['colSpan & rowSpan']), h(_index2['default'], {
      attrs: {
        columns: columns,
        data: data
      },
      'class': 'table'
    })]);
  }
};
module.exports = exports['default'];