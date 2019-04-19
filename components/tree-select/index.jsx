import VcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from '../vc-tree-select';
import classNames from 'classnames';
import { TreeSelectProps } from './interface';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import warning from '../_util/warning';
import {
  initDefaultProps,
  getOptionProps,
  getComponentFromProp,
  filterEmpty,
  isValidElement,
} from '../_util/props-util';

export { TreeData, TreeSelectProps } from './interface';

import Icon from '../icon';
import omit from 'omit.js';
import { cloneElement } from '../_util/vnode';

const TreeSelect = {
  TreeNode: { ...TreeNode, name: 'ATreeSelectNode' },
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD,
  name: 'ATreeSelect',
  props: initDefaultProps(TreeSelectProps(), {
    prefixCls: 'ant-select',
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false,
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  inject: {
    configProvider: { default: () => ({}) },
  },
  created() {
    warning(
      this.multiple !== false || !this.treeCheckable,
      '`multiple` will alway be `true` when `treeCheckable` is true',
    );
  },
  methods: {
    focus() {
      this.$refs.vcTreeSelect.focus();
    },

    blur() {
      this.$refs.vcTreeSelect.blur();
    },
    renderSwitcherIcon({ isLeaf, loading }) {
      const { prefixCls } = this.$props;
      if (loading) {
        return <Icon type="loading" class={`${prefixCls}-switcher-loading-icon`} />;
      }
      if (isLeaf) {
        return null;
      }
      return <Icon type="caret-down" class={`${prefixCls}-switcher-icon`} />;
    },
    onChange() {
      this.$emit('change', ...arguments);
    },
    updateTreeData(treeData) {
      const { $scopedSlots } = this;
      return treeData.map(item => {
        const { label, title, scopedSlots = {}, children } = item;
        let newLabel = typeof label === 'function' ? label(this.$createElement) : label;
        let newTitle = typeof title === 'function' ? title(this.$createElement) : title;
        if (!newLabel && scopedSlots.label && $scopedSlots[scopedSlots.label]) {
          newLabel = $scopedSlots.label(item);
        }
        if (!newTitle && scopedSlots.title && $scopedSlots[scopedSlots.title]) {
          newTitle = $scopedSlots.title(item);
        }
        const treeNodeProps = {
          ...item,
          title: newTitle || newLabel,
          dataRef: item,
        };
        if (children) {
          return { ...treeNodeProps, children: this.updateTreeData(children) };
        }
        return treeNodeProps;
      });
    },
    renderTreeSelect(locale) {
      const props = getOptionProps(this);

      const {
        prefixCls,
        size,
        notFoundContent,
        dropdownStyle,
        dropdownClassName,
        getPopupContainer,
        ...restProps
      } = props;
      const { getPopupContainer: getContextPopupContainer } = this.configProvider;
      const rest = omit(restProps, [
        'inputIcon',
        'removeIcon',
        'clearIcon',
        'switcherIcon',
        'suffixIcon',
      ]);
      let suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      let treeData = props.treeData;
      if (treeData) {
        treeData = this.updateTreeData(treeData);
      }
      const cls = {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
      };

      let checkable = getComponentFromProp(this, 'treeCheckable');
      if (checkable) {
        checkable = <span class={`${prefixCls}-tree-checkbox-inner`} />;
      }

      const inputIcon = (suffixIcon &&
        (isValidElement(suffixIcon) ? cloneElement(suffixIcon) : suffixIcon)) || (
        <Icon type="down" class={`${prefixCls}-arrow-icon`} />
      );

      const removeIcon = <Icon type="close" class={`${prefixCls}-remove-icon`} />;

      const clearIcon = (
        <Icon type="close-circle" class={`${prefixCls}-clear-icon`} theme="filled" />
      );

      const VcTreeSelectProps = {
        props: Object.assign(
          {
            switcherIcon: this.renderSwitcherIcon,
            inputIcon,
            removeIcon,
            clearIcon,
            ...rest,
            getPopupContainer: getPopupContainer || getContextPopupContainer,
            dropdownClassName: classNames(dropdownClassName, `${prefixCls}-tree-dropdown`),
            prefixCls,
            dropdownStyle: { maxHeight: '100vh', overflow: 'auto', ...dropdownStyle },
            treeCheckable: checkable,
            notFoundContent: notFoundContent || locale.notFoundContent,
            __propsSymbol__: Symbol(),
          },
          treeData ? { treeData } : {},
        ),
        class: cls,
        on: { ...this.$listeners, change: this.onChange },
        ref: 'vcTreeSelect',
        scopedSlots: this.$scopedSlots,
      };
      return <VcTreeSelect {...VcTreeSelectProps}>{filterEmpty(this.$slots.default)}</VcTreeSelect>;
    },
  },

  render() {
    return (
      <LocaleReceiver
        componentName="Select"
        defaultLocale={{}}
        scopedSlots={{ default: this.renderTreeSelect }}
      />
    );
  },
};

/* istanbul ignore next */
TreeSelect.install = function(Vue) {
  Vue.component(TreeSelect.name, TreeSelect);
  Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode);
};

export default TreeSelect;
