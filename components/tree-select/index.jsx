import VcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from '../vc-tree-select';
import classNames from 'classnames';
import { TreeSelectProps } from './interface';
import warning from '../_util/warning';
import {
  initDefaultProps,
  getOptionProps,
  getComponentFromProp,
  filterEmpty,
  getListeners,
} from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

export { TreeData, TreeSelectProps } from './interface';
import Icon from '../icon';
import omit from 'omit.js';

const TreeSelect = {
  TreeNode: { ...TreeNode, name: 'ATreeSelectNode' },
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD,
  name: 'ATreeSelect',
  props: initDefaultProps(TreeSelectProps(), {
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false,
  }),
  model: {
    prop: 'value',
    event: 'change',
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  created() {
    warning(
      this.multiple !== false || !this.treeCheckable,
      'TreeSelect',
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
    renderSwitcherIcon(prefixCls, { isLeaf, loading }) {
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
      const defaultFields = {
        children: 'children',
        title: 'title',
        key: 'key',
        label: 'label',
        value: 'value',
      };
      const replaceFields = { ...defaultFields, ...this.$props.replaceFields };
      return treeData.map(item => {
        const { scopedSlots = {} } = item;
        const label = item[replaceFields.label];
        const title = item[replaceFields.title];
        const value = item[replaceFields.value];
        const key = item[replaceFields.key];
        const children = item[replaceFields.children];
        let newLabel = typeof label === 'function' ? label(this.$createElement) : label;
        let newTitle = typeof title === 'function' ? title(this.$createElement) : title;
        if (!newLabel && scopedSlots.label && $scopedSlots[scopedSlots.label]) {
          newLabel = $scopedSlots[scopedSlots.label](item);
        }
        if (!newTitle && scopedSlots.title && $scopedSlots[scopedSlots.title]) {
          newTitle = $scopedSlots[scopedSlots.title](item);
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

  render(h) {
    const props = getOptionProps(this);
    const {
      prefixCls: customizePrefixCls,
      size,
      dropdownStyle,
      dropdownClassName,
      getPopupContainer,
      ...restProps
    } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('select', customizePrefixCls);

    const renderEmpty = this.configProvider.renderEmpty;
    const notFoundContent = getComponentFromProp(this, 'notFoundContent');
    const removeIcon = getComponentFromProp(this, 'removeIcon');
    const clearIcon = getComponentFromProp(this, 'clearIcon');
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

    // showSearch: single - false, multiple - true
    let { showSearch } = restProps;
    if (!('showSearch' in restProps)) {
      showSearch = !!(restProps.multiple || restProps.treeCheckable);
    }

    let checkable = getComponentFromProp(this, 'treeCheckable');
    if (checkable) {
      checkable = <span class={`${prefixCls}-tree-checkbox-inner`} />;
    }

    const inputIcon = suffixIcon || <Icon type="down" class={`${prefixCls}-arrow-icon`} />;

    const finalRemoveIcon = removeIcon || <Icon type="close" class={`${prefixCls}-remove-icon`} />;

    const finalClearIcon = clearIcon || (
      <Icon type="close-circle" class={`${prefixCls}-clear-icon`} theme="filled" />
    );
    const VcTreeSelectProps = {
      props: Object.assign(
        {
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
          notFoundContent: notFoundContent || renderEmpty(h, 'Select'),
          __propsSymbol__: Symbol(),
        },
        treeData ? { treeData } : {},
      ),
      class: cls,
      on: { ...getListeners(this), change: this.onChange },
      ref: 'vcTreeSelect',
      scopedSlots: this.$scopedSlots,
    };
    return <VcTreeSelect {...VcTreeSelectProps}>{filterEmpty(this.$slots.default)}</VcTreeSelect>;
  },
};

/* istanbul ignore next */
TreeSelect.install = function(Vue) {
  Vue.use(Base);
  Vue.component(TreeSelect.name, TreeSelect);
  Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode);
};

export default TreeSelect;
