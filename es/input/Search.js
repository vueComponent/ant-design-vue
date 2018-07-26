import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import classNames from 'classnames';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import { getOptionProps, getComponentFromProp } from '../_util/props-util';
import PropTypes from '../_util/vue-types';

export default {
  name: 'AInputSearch',
  props: _extends({}, inputProps, {
    prefixCls: {
      'default': 'ant-input-search',
      type: String
    },
    inputPrefixCls: {
      'default': 'ant-input',
      type: String
    },
    enterButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object])
  }),
  model: {
    prop: 'value',
    event: 'change.value'
  },
  methods: {
    onSearch: function onSearch(e) {
      this.$emit('search', this.$refs.input.stateValue);
      this.$refs.input.focus();
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    getButtonOrIcon: function getButtonOrIcon() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          size = this.size;

      var enterButton = getComponentFromProp(this, 'enterButton');
      if (!enterButton) {
        return h(Icon, { 'class': prefixCls + '-icon', attrs: { type: 'search' },
          key: 'searchIcon' });
      }
      var enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      if (enterButtonAsElement.componentOptions && enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON) {
        return cloneElement(enterButtonAsElement, {
          'class': prefixCls + '-button',
          props: { size: size },
          on: {
            click: this.onSearch
          }
        });
      } else if (enterButtonAsElement.tag === 'button') {
        return cloneElement(enterButtonAsElement, {
          on: {
            click: this.onSearch
          }
        });
      }
      return h(
        Button,
        {
          'class': prefixCls + '-button',
          attrs: { type: 'primary',
            size: size
          },
          on: {
            'click': this.onSearch
          },

          key: 'enterButton'
        },
        [enterButton === true ? h(Icon, {
          attrs: { type: 'search' }
        }) : enterButton]
      );
    }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        prefixCls = _getOptionProps.prefixCls,
        inputPrefixCls = _getOptionProps.inputPrefixCls,
        size = _getOptionProps.size,
        suffix = _getOptionProps.suffix,
        others = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'inputPrefixCls', 'size', 'suffix']);

    var enterButton = getComponentFromProp(this, 'enterButton');
    var buttonOrIcon = this.getButtonOrIcon();
    var searchSuffix = suffix ? [suffix, buttonOrIcon] : buttonOrIcon;
    var inputClassName = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-enter-button', !!enterButton), _defineProperty(_classNames, prefixCls + '-' + size, !!size), _classNames));
    var inputProps = {
      props: _extends({}, others, {
        prefixCls: inputPrefixCls,
        size: size,
        suffix: searchSuffix
      }),
      attrs: this.$attrs,
      on: _extends({}, this.$listeners, {
        pressEnter: this.onSearch
      })
    };
    return h(Input, _mergeJSXProps([inputProps, {
      'class': inputClassName,
      ref: 'input'
    }]));
  }
};