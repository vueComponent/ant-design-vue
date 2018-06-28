
import classNames from 'classnames'
import Input from './Input'
import Icon from '../icon'
import inputProps from './inputProps'
import Button from '../button'
import { cloneElement } from '../_util/vnode'
import { getOptionProps, getComponentFromProp } from '../_util/props-util'
import PropTypes from '../_util/vue-types'

export default {
  name: 'AInputSearch',
  props: {
    ...inputProps,
    prefixCls: {
      default: 'ant-input-search',
      type: String,
    },
    inputPrefixCls: {
      default: 'ant-input',
      type: String,
    },
    enterButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object]),
  },
  model: {
    prop: 'value',
    event: 'change.value',
  },
  methods: {
    onSearch (e) {
      this.$emit('search', this.$refs.input.stateValue)
      this.$refs.input.focus()
    },
    focus () {
      this.$refs.input.focus()
    },

    blur () {
      this.$refs.input.blur()
    },
    getButtonOrIcon () {
      const { prefixCls, size } = this
      const enterButton = getComponentFromProp(this, 'enterButton')
      if (!enterButton) {
        return <Icon class={`${prefixCls}-icon`} type='search' key='searchIcon' />
      }
      const enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton
      if (enterButtonAsElement.componentOptions && enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON) {
        return cloneElement(enterButtonAsElement, {
          class: `${prefixCls}-button`,
          props: { size },
          on: {
            click: this.onSearch,
          },
        })
      } else if (enterButtonAsElement.tag === 'button') {
        return cloneElement(enterButtonAsElement, {
          on: {
            click: this.onSearch,
          },
        })
      }
      return (
        <Button
          class={`${prefixCls}-button`}
          type='primary'
          size={size}
          onClick={this.onSearch}
          key='enterButton'
        >
          {enterButton === true ? <Icon type='search' /> : enterButton}
        </Button>
      )
    },
  },
  render () {
    const { prefixCls, inputPrefixCls, size,
      suffix, ...others
    } = getOptionProps(this)
    const enterButton = getComponentFromProp(this, 'enterButton')
    const buttonOrIcon = this.getButtonOrIcon()
    const searchSuffix = suffix ? [suffix, buttonOrIcon] : buttonOrIcon
    const inputClassName = classNames(prefixCls, {
      [`${prefixCls}-enter-button`]: !!enterButton,
      [`${prefixCls}-${size}`]: !!size,
    })
    const inputProps = {
      props: {
        ...others,
        prefixCls: inputPrefixCls,
        size,
        suffix: searchSuffix,
      },
      attrs: this.$attrs,
      on: {
        ...this.$listeners,
        pressEnter: this.onSearch,
      },
    }
    return (
      <Input
        {...inputProps}
        class={inputClassName}
        ref='input'
      />
    )
  },
}

