import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
/* eslint react/no-multi-comp:0, no-console:0 */

import '../assets/index.less';
import TreeSelect, { SHOW_PARENT } from '../index';
import { gData } from './util';

export default {
  data: function data() {
    return {
      value: '11',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      simpleTreeData: [{ key: 1, pId: 0, label: 'a', value: 'a' }, { key: 11, pId: 1, label: 'a12', value: 'a12', disabled: true }, { key: 111, pId: 11, label: 'a00', value: 'a00', selectable: false }, { key: 2, pId: 0, label: 'b', value: 'b' }, { key: 20, pId: 2, label: 'b10', value: 'b10' }, { key: 21, pId: 2, label: 'b1', value: 'b1' }, { key: 22, pId: 2, label: 'b12', value: 'b12' }],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0
      }
    };
  },

  methods: {
    onChange: function onChange(value) {
      if (value.length === 1) {
        // return;
      }
      console.log('onChange', arguments, this.simpleTreeData);
      this.value = value;
    },
    onSelect: function onSelect() {
      // use onChange instead
      // console.log(arguments);
    },
    onDataChange: function onDataChange() {
      var data = [].concat(_toConsumableArray(this.simpleTreeData));
      data.forEach(function (i) {
        if (i.key === 11) {
          delete i.disabled;
        }
        if (i.key === 20) {
          i.disabled = true;
        }
      });
      this.simpleTreeData = data;
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['check select']), h(TreeSelect, {
        style: { width: '300px' },
        attrs: { transitionName: 'rc-tree-select-dropdown-slide-up',
          choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
          dropdownStyle: { height: '200px', overflow: 'auto' },
          dropdownPopupAlign: { overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] },
          placeholder: h('i', ['\u8BF7\u4E0B\u62C9\u9009\u62E9']),
          searchPlaceholder: 'please search',
          treeLine: true, maxTagTextLength: 10,
          value: this.value,
          treeData: gData,
          treeNodeFilterProp: 'title',
          treeCheckable: true
        },
        on: {
          'change': this.onChange,
          'select': this.onSelect
        }
      }), h('h2', ['use treeDataSimpleMode']), h(TreeSelect, {
        style: { width: '300px' },
        attrs: { dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
          placeholder: h('i', ['\u8BF7\u4E0B\u62C9\u9009\u62E9']),
          searchPlaceholder: 'please search',
          treeLine: true, maxTagTextLength: 10,
          inputValue: null,
          value: this.value,
          treeData: this.simpleTreeData,
          treeDefaultExpandAll: true,
          treeNodeFilterProp: 'title',
          treeDataSimpleMode: this.treeDataSimpleMode,
          treeCheckable: true, showCheckedStrategy: SHOW_PARENT
        },
        on: {
          'change': this.onChange,
          'select': this.onSelect
        }
      }), h(
        'button',
        {
          on: {
            'click': this.onDataChange
          }
        },
        ['change data']
      )]
    );
  }
};