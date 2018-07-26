'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeSelectProps = exports.TreeData = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _interface = require('./interface');

Object.defineProperty(exports, 'TreeData', {
  enumerable: true,
  get: function get() {
    return _interface.TreeData;
  }
});
Object.defineProperty(exports, 'TreeSelectProps', {
  enumerable: true,
  get: function get() {
    return _interface.TreeSelectProps;
  }
});

var _vcTreeSelect = require('../vc-tree-select');

var _vcTreeSelect2 = _interopRequireDefault(_vcTreeSelect);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  TreeNode: (0, _extends3['default'])({}, _vcTreeSelect.TreeNode, { name: 'ATreeSelectNode' }),
  SHOW_ALL: _vcTreeSelect.SHOW_ALL,
  SHOW_PARENT: _vcTreeSelect.SHOW_PARENT,
  SHOW_CHILD: _vcTreeSelect.SHOW_CHILD,
  name: 'ATreeSelect',
  props: (0, _propsUtil.initDefaultProps)((0, _interface.TreeSelectProps)(), {
    prefixCls: 'ant-select',
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false
  }),
  model: {
    prop: 'value',
    event: 'change'
  },

  created: function created() {
    (0, _warning2['default'])(this.multiple !== false || !this.treeCheckable, '`multiple` will alway be `true` when `treeCheckable` is true');
  },

  methods: {
    focus: function focus() {
      this.$refs.vcTreeSelect.focus();
    },
    blur: function blur() {
      this.$refs.vcTreeSelect.blur();
    },
    onChange: function onChange() {
      this.$emit.apply(this, ['change'].concat(Array.prototype.slice.call(arguments)));
    },
    updateTreeData: function updateTreeData() {
      var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      for (var i = 0, len = list.length; i < len; i++) {
        var _list$i = list[i],
            label = _list$i.label,
            title = _list$i.title,
            _list$i$scopedSlots = _list$i.scopedSlots,
            scopedSlots = _list$i$scopedSlots === undefined ? {} : _list$i$scopedSlots,
            children = _list$i.children;
        var $scopedSlots = this.$scopedSlots;

        var newLabel = typeof label === 'function' ? label(this.$createElement) : label;
        var newTitle = typeof title === 'function' ? title(this.$createElement) : title;
        if (!newLabel && scopedSlots.label && $scopedSlots[scopedSlots.label]) {
          newLabel = $scopedSlots.label(list[i]);
        }
        if (!newTitle && scopedSlots.title && $scopedSlots[scopedSlots.title]) {
          newTitle = $scopedSlots.title(list[i]);
        }
        var item = {
          // label: newLabel,
          title: newTitle || newLabel
        };
        this.updateTreeData(children || []);
        (0, _extends3['default'])(list[i], item);
      }
    },
    renderTreeSelect: function renderTreeSelect(locale) {
      var _cls;

      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      var prefixCls = props.prefixCls,
          size = props.size,
          notFoundContent = props.notFoundContent,
          dropdownStyle = props.dropdownStyle,
          dropdownClassName = props.dropdownClassName,
          restProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'size', 'notFoundContent', 'dropdownStyle', 'dropdownClassName']);

      this.updateTreeData(props.treeData || []);
      var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_cls, prefixCls + '-sm', size === 'small'), _cls);

      var checkable = (0, _propsUtil.getComponentFromProp)(this, 'treeCheckable');
      if (checkable) {
        checkable = h('span', { 'class': prefixCls + '-tree-checkbox-inner' });
      }
      var VcTreeSelectProps = {
        props: (0, _extends3['default'])({}, restProps, {
          dropdownClassName: (0, _classnames2['default'])(dropdownClassName, prefixCls + '-tree-dropdown'),
          prefixCls: prefixCls,
          dropdownStyle: (0, _extends3['default'])({ maxHeight: '100vh', overflow: 'auto' }, dropdownStyle),
          treeCheckable: checkable,
          notFoundContent: notFoundContent || locale.notFoundContent
        }),
        'class': cls,
        on: (0, _extends3['default'])({}, this.$listeners, { change: this.onChange }),
        ref: 'vcTreeSelect'
      };
      return h(
        _vcTreeSelect2['default'],
        VcTreeSelectProps,
        [(0, _propsUtil.filterEmpty)(this.$slots['default'])]
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Select',
        defaultLocale: {}
      },
      scopedSlots: { 'default': this.renderTreeSelect }
    });
  }
};