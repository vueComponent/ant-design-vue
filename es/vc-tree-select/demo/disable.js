/* eslint react/no-multi-comp:0, no-console:0 */
import '../assets/index.less';
import TreeSelect from '../index';

var SHOW_PARENT = TreeSelect.SHOW_PARENT;

var treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0'
  }]
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    label: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0'
  }, {
    label: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1'
  }, {
    label: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2'
  }]
}];

export default {
  data: function data() {
    return {
      value: ['0-0-0'],
      disabled: false
    };
  },


  methods: {
    onChange: function onChange(value) {
      console.log('onChange ', value, arguments);
      this.value = value;
    },
    'switch': function _switch(checked) {
      this.disabled = checked;
    }
  },

  render: function render() {
    var _this = this;

    var h = arguments[0];

    var tProps = {
      props: {
        treeData: treeData,
        disabled: this.disabled,
        value: this.value,
        multiple: true,
        allowClear: true,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        searchPlaceholder: 'Please select'
      },
      on: {
        change: this.onChange
      },
      style: {
        width: '300px'
      }
    };
    return h('div', [h(TreeSelect, tProps), h('input', {
      attrs: { type: 'checkbox' },
      on: {
        'change': function change(e) {
          return _this['switch'](e.target.checked);
        }
      }
    }), ' \u7981\u7528']);
  }
};