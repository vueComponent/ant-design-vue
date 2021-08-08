import type { App, Plugin } from 'vue';
import { defineComponent, inject } from 'vue';
import VcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from '../vc-tree-select';
import classNames from '../_util/classNames';
import { TreeSelectProps } from './interface';
import warning from '../_util/warning';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { defaultConfigProvider } from '../config-provider';

export { TreeData, TreeSelectProps } from './interface';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import CaretDownOutlined from '@ant-design/icons-vue/CaretDownOutlined';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import omit from 'omit.js';
import { convertChildrenToData } from './utils';

const TreeSelect = defineComponent({
  TreeNode,
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD,
  name: 'ATreeSelect',
  inheritAttrs: false,
  props: initDefaultProps(TreeSelectProps(), {
    transitionName: 'slide-up',
    choiceTransitionName: '',
  }),
  setup() {
    return {
      vcTreeSelect: null,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  created() {
    warning(
      this.multiple !== false || !this.treeCheckable,
      'TreeSelect',
      '`multiple` will alway be `true` when `treeCheckable` is true',
    );
  },
  methods: {
    saveTreeSelect(node: any) {
      this.vcTreeSelect = node;
    },
    focus() {
      this.vcTreeSelect.focus();
    },

    blur() {
      this.vcTreeSelect.blur();
    },
    renderSwitcherIcon(prefixCls: string, { isLeaf, loading }) {
      if (loading) {
        return <LoadingOutlined class={`${prefixCls}-switcher-loading-icon`} />;
      }
      if (isLeaf) {
        return null;
      }
      return <CaretDownOutlined class={`${prefixCls}-switcher-icon`} />;
    },
    handleChange(...args: any[]) {
      this.$emit('update:value', args[0]);
      this.$emit('change', ...args);
    },
    handleTreeExpand(...args: any[]) {
      this.$emit('update:treeExpandedKeys', args[0]);
      this.$emit('treeExpand', ...args);
    },
    handleSearch(...args: any[]) {
      this.$emit('update:searchValue', args[0]);
      this.$emit('search', ...args);
    },
    updateTreeData(treeData: any[]) {
      const { $slots } = this;
      const defaultFields = {
        children: 'children',
        title: 'title',
        key: 'key',
        label: 'label',
        value: 'value',
      };
      const replaceFields = { ...defaultFields, ...this.$props.replaceFields };
      return treeData.map(item => {
        const { slots = {} } = item;
        const label = item[replaceFields.label];
        const title = item[replaceFields.title];
        const value = item[replaceFields.value];
        const key = item[replaceFields.key];
        const children = item[replaceFields.children];
        let newLabel = typeof label === 'function' ? label() : label;
        let newTitle = typeof title === 'function' ? title() : title;
        if (!newLabel && slots.label && $slots[slots.label]) {
          newLabel = <>{$slots[slots.label](item)}</>;
        }
        if (!newTitle && slots.title && $slots[slots.title]) {
          newTitle = <>{$slots[slots.title](item)}</>;
        }
        const treeNodeProps = {
          ...item,
          title: newTitle || newLabel,
          value,
          dataRef: item,
          key,
        };
        if (children) {
          return { ...treeNodeProps, children: this.updateTreeData(children) };
        }
        return treeNodeProps;
      });
    },
  },

  render() {
    const props: any = getOptionProps(this);
    const {
      prefixCls: customizePrefixCls,
      size,
      dropdownStyle,
      dropdownClassName,
      getPopupContainer,
      ...restProps
    } = props;
    const { class: className } = this.$attrs;
    const { renderEmpty, getPrefixCls } = this.configProvider;
    const prefixCls = getPrefixCls('select', customizePrefixCls);

    const notFoundContent = getComponent(this, 'notFoundContent');
    const removeIcon = getComponent(this, 'removeIcon');
    const clearIcon = getComponent(this, 'clearIcon');
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const rest = omit(restProps, [
      'inputIcon',
      'removeIcon',
      'clearIcon',
      'switcherIcon',
      'suffixIcon',
    ]);
    let suffixIcon = getComponent(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    let treeData = props.treeData;
    if (treeData) {
      treeData = this.updateTreeData(treeData);
    }
    const cls = {
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
      [className as string]: className,
    };

    // showSearch: single - false, multiple - true
    let { showSearch } = restProps;
    if (!('showSearch' in restProps)) {
      showSearch = !!(restProps.multiple || restProps.treeCheckable);
    }

    let checkable = getComponent(this, 'treeCheckable');
    if (checkable) {
      checkable = <span class={`${prefixCls}-tree-checkbox-inner`} />;
    }

    const inputIcon = suffixIcon || <DownOutlined class={`${prefixCls}-arrow-icon`} />;

    const finalRemoveIcon = removeIcon || <CloseOutlined class={`${prefixCls}-remove-icon`} />;

    const finalClearIcon = clearIcon || <CloseCircleFilled class={`${prefixCls}-clear-icon`} />;
    const VcTreeSelectProps = {
      ...this.$attrs,
      switcherIcon: nodeProps => this.renderSwitcherIcon(prefixCls, nodeProps),
      inputIcon,
      removeIcon: finalRemoveIcon,
      clearIcon: finalClearIcon,
      ...rest,
      showSearch,
      getPopupContainer: getPopupContainer || getContextPopupContainer,
      dropdownClassName: classNames(dropdownClassName, `${prefixCls}-tree-dropdown`),
      prefixCls,
      dropdownStyle: { maxHeight: '100vh', overflow: 'auto', ...dropdownStyle },
      treeCheckable: checkable,
      notFoundContent: notFoundContent || renderEmpty('Select'),
      class: cls,
      onChange: this.handleChange,
      onSearch: this.handleSearch,
      onTreeExpand: this.handleTreeExpand,
      ref: this.saveTreeSelect,
      treeData: treeData ? treeData : convertChildrenToData(getSlot(this)),
    };
    return (
      <VcTreeSelect
        {...VcTreeSelectProps}
        v-slots={omit(this.$slots, ['default'])}
        __propsSymbol__={[]}
      />
    );
  },
});

/* istanbul ignore next */
TreeSelect.install = function (app: App) {
  app.component(TreeSelect.name, TreeSelect);
  app.component(TreeSelect.TreeNode.displayName, TreeSelect.TreeNode);
  return app;
};

export const TreeSelectNode = TreeSelect.TreeNode;

export default TreeSelect as typeof TreeSelect &
  Plugin & {
    readonly TreeNode: typeof TreeNode;

    readonly SHOW_ALL: typeof SHOW_ALL;

    readonly SHOW_PARENT: typeof SHOW_PARENT;

    readonly SHOW_CHILD: typeof SHOW_CHILD;
  };
