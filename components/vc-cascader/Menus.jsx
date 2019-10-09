import { getComponentFromProp } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import arrayTreeFilter from 'array-tree-filter';
import BaseMixin from '../_util/BaseMixin';

export default {
  name: 'CascaderMenus',
  mixins: [BaseMixin],
  props: {
    value: PropTypes.array.def([]),
    activeValue: PropTypes.array.def([]),
    options: PropTypes.array,
    prefixCls: PropTypes.string.def('rc-cascader-menus'),
    expandTrigger: PropTypes.string.def('click'),
    // onSelect: PropTypes.func,
    visible: PropTypes.bool.def(false),
    dropdownMenuColumnStyle: PropTypes.object,
    defaultFieldNames: PropTypes.object,
    fieldNames: PropTypes.object,
    expandIcon: PropTypes.any,
    loadingIcon: PropTypes.any,
  },
  data() {
    this.menuItems = {};
    return {};
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.scrollActiveItemToView();
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollActiveItemToView();
    });
  },
  methods: {
    getFieldName(name) {
      const { fieldNames, defaultFieldNames } = this.$props;
      // 防止只设置单个属性的名字
      return fieldNames[name] || defaultFieldNames[name];
    },
    getOption(option, menuIndex) {
      const { prefixCls, expandTrigger } = this;
      const loadingIcon = getComponentFromProp(this, 'loadingIcon');
      const expandIcon = getComponentFromProp(this, 'expandIcon');
      const onSelect = e => {
        this.__emit('select', option, menuIndex, e);
      };
      const onItemDoubleClick = e => {
        this.__emit('itemDoubleClick', option, menuIndex, e);
      };
      const key = option[this.getFieldName('value')];
      const expandProps = {
        attrs: {
          role: 'menuitem',
        },
        on: {
          click: onSelect,
          doubleclick: onItemDoubleClick,
          mousedown: e => e.preventDefault(),
        },
        key: Array.isArray(key) ? key.join('__ant__') : key,
      };
      let menuItemCls = `${prefixCls}-menu-item`;
      let expandIconNode = null;
      const hasChildren =
        option[this.getFieldName('children')] && option[this.getFieldName('children')].length > 0;
      if (hasChildren || option.isLeaf === false) {
        menuItemCls += ` ${prefixCls}-menu-item-expand`;
        if (!option.loading) {
          expandIconNode = <span class={`${prefixCls}-menu-item-expand-icon`}>{expandIcon}</span>;
        }
      }
      if (expandTrigger === 'hover' && (hasChildren || option.isLeaf === false)) {
        expandProps.on = {
          mouseenter: this.delayOnSelect.bind(this, onSelect),
          mouseleave: this.delayOnSelect.bind(this),
          click: onSelect,
        };
      }
      if (this.isActiveOption(option, menuIndex)) {
        menuItemCls += ` ${prefixCls}-menu-item-active`;
        expandProps.ref = this.getMenuItemRef(menuIndex);
      }
      if (option.disabled) {
        menuItemCls += ` ${prefixCls}-menu-item-disabled`;
      }
      let loadingIconNode = null;
      if (option.loading) {
        menuItemCls += ` ${prefixCls}-menu-item-loading`;
        loadingIconNode = loadingIcon || null;
      }
      let title = '';
      if (option.title) {
        title = option.title;
      } else if (typeof option[this.getFieldName('label')] === 'string') {
        title = option[this.getFieldName('label')];
      }
      expandProps.attrs.title = title;
      expandProps.class = menuItemCls;
      return (
        <li {...expandProps}>
          {option[this.getFieldName('label')]}
          {expandIconNode}
          {loadingIconNode}
        </li>
      );
    },

    getActiveOptions(values) {
      const activeValue = values || this.activeValue;
      const options = this.options;
      return arrayTreeFilter(
        options,
        (o, level) => o[this.getFieldName('value')] === activeValue[level],
        { childrenKeyName: this.getFieldName('children') },
      );
    },

    getShowOptions() {
      const { options } = this;
      const result = this.getActiveOptions()
        .map(activeOption => activeOption[this.getFieldName('children')])
        .filter(activeOption => !!activeOption);
      result.unshift(options);
      return result;
    },

    delayOnSelect(onSelect, ...args) {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
      if (typeof onSelect === 'function') {
        this.delayTimer = setTimeout(() => {
          onSelect(args);
          this.delayTimer = null;
        }, 150);
      }
    },

    scrollActiveItemToView() {
      // scroll into view
      const optionsLength = this.getShowOptions().length;
      for (let i = 0; i < optionsLength; i++) {
        const itemComponent = this.$refs[`menuItems_${i}`];
        if (itemComponent) {
          const target = itemComponent;
          target.parentNode.scrollTop = target.offsetTop;
        }
      }
    },

    isActiveOption(option, menuIndex) {
      const { activeValue = [] } = this;
      return activeValue[menuIndex] === option[this.getFieldName('value')];
    },

    getMenuItemRef(index) {
      return `menuItems_${index}`;
    },
  },

  render() {
    const { prefixCls, dropdownMenuColumnStyle } = this;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) => (
          <ul class={`${prefixCls}-menu`} key={menuIndex} style={dropdownMenuColumnStyle}>
            {options.map(option => this.getOption(option, menuIndex))}
          </ul>
        ))}
      </div>
    );
  },
};
