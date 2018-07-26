import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
/* eslint react/no-multi-comp:0, no-console:0 */

import '../assets/index.less';
import TreeSelect from '../index';
import { getNewTreeData, generateTreeNodes } from './util';

export default {
  data: function data() {
    return {
      treeData: [{ label: 'pNode 01', value: '0-0', key: '0-0' }, { label: 'pNode 02', value: '0-1', key: '0-1' }, { label: 'pNode 03', value: '0-2', key: '0-2', isLeaf: true }],
      // value: '0-0',
      value: { value: '0-0-0-value', label: '0-0-0-label' }
    };
  },


  methods: {
    onChange: function onChange(value) {
      console.log(value);
      this.value = value;
    },
    onLoadData: function onLoadData(treeNode) {
      var _this = this;

      console.log(treeNode);
      return new Promise(function (resolve) {
        setTimeout(function () {
          var treeData = [].concat(_toConsumableArray(_this.treeData));
          getNewTreeData(treeData, treeNode.eventKey, generateTreeNodes(treeNode), 2);
          _this.treeData = treeData;
          resolve();
        }, 500);
      });
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: { padding: '10px 30px' } },
      [h('h2', ['dynamic render']), h(TreeSelect, {
        style: { width: '300px' },
        attrs: { treeData: this.treeData,
          labelInValue: true,
          value: this.value,

          loadData: this.onLoadData
        },
        on: {
          'change': this.onChange
        }
      })]
    );
  }
};