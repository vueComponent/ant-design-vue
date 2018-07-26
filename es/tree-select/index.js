import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import VcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from '../vc-tree-select';
import classNames from 'classnames';
import { TreeSelectProps } from './interface';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import warning from '../_util/warning';
import { initDefaultProps, getOptionProps, getComponentFromProp, filterEmpty } from '../_util/props-util';

export { TreeData, TreeSelectProps } from './interface';

export default {
  TreeNode: _extends({}, TreeNode, { name: 'ATreeSelectNode' }),
  SHOW_ALL: SHOW_ALL,
  SHOW_PARENT: SHOW_PARENT,
  SHOW_CHILD: SHOW_CHILD,
  name: 'ATreeSelect',
  props: initDefaultProps(TreeSelectProps(), {
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
    warning(this.multiple !== false || !this.treeCheckable, '`multiple` will alway be `true` when `treeCheckable` is true');
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
        _extends(list[i], item);
      }
    },
    renderTreeSelect: function renderTreeSelect(locale) {
      var _cls;

      var h = this.$createElement;

      var props = getOptionProps(this);

      var prefixCls = props.prefixCls,
          size = props.size,
          notFoundContent = props.notFoundContent,
          dropdownStyle = props.dropdownStyle,
          dropdownClassName = props.dropdownClassName,
          restProps = _objectWithoutProperties(props, ['prefixCls', 'size', 'notFoundContent', 'dropdownStyle', 'dropdownClassName']);

      this.updateTreeData(props.treeData || []);
      var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-lg', size === 'large'), _defineProperty(_cls, prefixCls + '-sm', size === 'small'), _cls);

      var checkable = getComponentFromProp(this, 'treeCheckable');
      if (checkable) {
        checkable = h('span', { 'class': prefixCls + '-tree-checkbox-inner' });
      }
      var VcTreeSelectProps = {
        props: _extends({}, restProps, {
          dropdownClassName: classNames(dropdownClassName, prefixCls + '-tree-dropdown'),
          prefixCls: prefixCls,
          dropdownStyle: _extends({ maxHeight: '100vh', overflow: 'auto' }, dropdownStyle),
          treeCheckable: checkable,
          notFoundContent: notFoundContent || locale.notFoundContent
        }),
        'class': cls,
        on: _extends({}, this.$listeners, { change: this.onChange }),
        ref: 'vcTreeSelect'
      };
      return h(
        VcTreeSelect,
        VcTreeSelectProps,
        [filterEmpty(this.$slots['default'])]
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'Select',
        defaultLocale: {}
      },
      scopedSlots: { 'default': this.renderTreeSelect }
    });
  }
};