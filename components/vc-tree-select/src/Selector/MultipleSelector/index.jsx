import PropTypes from '../../../../_util/vue-types';
import { createRef } from '../../util';
import generateSelector, { selectorPropTypes } from '../../Base/BaseSelector';
import SearchInput from '../../SearchInput';
import Selection from './Selection';
import { getComponentFromProp, getListeners } from '../../../../_util/props-util';
import getTransitionProps from '../../../../_util/getTransitionProps';
import BaseMixin from '../../../../_util/BaseMixin';
const TREE_SELECT_EMPTY_VALUE_KEY = 'RC_TREE_SELECT_EMPTY_VALUE_KEY';

const Selector = generateSelector('multiple');

// export const multipleSelectorContextTypes = {
//   onMultipleSelectorRemove: PropTypes.func.isRequired,
// }

const MultipleSelector = {
  mixins: [BaseMixin],
  props: {
    ...selectorPropTypes(),
    ...SearchInput.props,
    selectorValueList: PropTypes.array,
    disabled: PropTypes.bool,
    searchValue: PropTypes.string,
    labelInValue: PropTypes.bool,
    maxTagCount: PropTypes.number,
    maxTagPlaceholder: PropTypes.any,

    // onChoiceAnimationLeave: PropTypes.func,
  },
  inject: {
    vcTreeSelect: { default: () => ({}) },
  },
  created() {
    this.inputRef = createRef();
  },
  methods: {
    onPlaceholderClick() {
      this.inputRef.current.focus();
    },

    focus() {
      this.inputRef.current.focus();
    },
    blur() {
      this.inputRef.current.blur();
    },

    _renderPlaceholder() {
      const {
        prefixCls,
        placeholder,
        searchPlaceholder,
        searchValue,
        selectorValueList,
      } = this.$props;

      const currentPlaceholder = placeholder || searchPlaceholder;

      if (!currentPlaceholder) return null;

      const hidden = searchValue || selectorValueList.length;

      // [Legacy] Not remove the placeholder
      return (
        <span
          style={{
            display: hidden ? 'none' : 'block',
          }}
          onClick={this.onPlaceholderClick}
          class={`${prefixCls}-search__field__placeholder`}
        >
          {currentPlaceholder}
        </span>
      );
    },
    onChoiceAnimationLeave(...args) {
      this.__emit('choiceAnimationLeave', ...args);
    },
    renderSelection() {
      const {
        selectorValueList,
        choiceTransitionName,
        prefixCls,
        labelInValue,
        maxTagCount,
      } = this.$props;
      const {
        vcTreeSelect: { onMultipleSelectorRemove },
        $slots,
      } = this;
      const listeners = getListeners(this);
      // Check if `maxTagCount` is set
      let myValueList = selectorValueList;
      if (maxTagCount >= 0) {
        myValueList = selectorValueList.slice(0, maxTagCount);
      }
      // Selector node list
      const selectedValueNodes = myValueList.map(({ label, value }) => (
        <Selection
          {...{
            props: {
              ...this.$props,
              label,
              value,
            },
            on: { ...listeners, remove: onMultipleSelectorRemove },
          }}
          key={value || TREE_SELECT_EMPTY_VALUE_KEY}
        >
          {$slots.default}
        </Selection>
      ));

      // Rest node count
      if (maxTagCount >= 0 && maxTagCount < selectorValueList.length) {
        let content = `+ ${selectorValueList.length - maxTagCount} ...`;
        const maxTagPlaceholder = getComponentFromProp(this, 'maxTagPlaceholder', {}, false);
        if (typeof maxTagPlaceholder === 'string') {
          content = maxTagPlaceholder;
        } else if (typeof maxTagPlaceholder === 'function') {
          const restValueList = selectorValueList.slice(maxTagCount);
          content = maxTagPlaceholder(
            labelInValue ? restValueList : restValueList.map(({ value }) => value),
          );
        }

        const restNodeSelect = (
          <Selection
            {...{
              props: {
                ...this.$props,
                label: content,
                value: null,
              },
              on: listeners,
            }}
            key="rc-tree-select-internal-max-tag-counter"
          >
            {$slots.default}
          </Selection>
        );

        selectedValueNodes.push(restNodeSelect);
      }

      selectedValueNodes.push(
        <li class={`${prefixCls}-search ${prefixCls}-search--inline`} key="__input">
          <SearchInput
            {...{
              props: {
                ...this.$props,
                needAlign: true,
              },
              on: listeners,
              directives: [
                {
                  name: 'ant-ref',
                  value: this.inputRef,
                },
              ],
            }}
          >
            {$slots.default}
          </SearchInput>
        </li>,
      );
      const className = `${prefixCls}-selection__rendered`;
      if (choiceTransitionName) {
        const transitionProps = getTransitionProps(choiceTransitionName, {
          tag: 'ul',
          afterLeave: this.onChoiceAnimationLeave,
        });
        return (
          <transition-group class={className} {...transitionProps}>
            {selectedValueNodes}
          </transition-group>
        );
      }
      return (
        <ul class={className} role="menubar">
          {selectedValueNodes}
        </ul>
      );
    },
  },

  render() {
    const { $slots } = this;
    const listeners = getListeners(this);
    return (
      <Selector
        {...{
          props: {
            ...this.$props,
            tabIndex: -1,
            showArrow: false,
            renderSelection: this.renderSelection,
            renderPlaceholder: this._renderPlaceholder,
          },
          on: listeners,
        }}
      >
        {$slots.default}
      </Selector>
    );
  },
};

export default MultipleSelector;
