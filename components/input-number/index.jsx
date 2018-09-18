import PropTypes from '../_util/vue-types'
import { initDefaultProps, getOptionProps } from '../_util/props-util'
import classNames from 'classnames'
import VcInputNumber from '../vc-input-number/src'

export const InputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  step: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  defaultValue: PropTypes.number,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'default']),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  precision: PropTypes.number,
  autoFocus: PropTypes.bool,
}

const InputNumber = {
  name: 'AInputNumber',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: initDefaultProps(InputNumberProps, {
    prefixCls: 'ant-input-number',
    step: 1,
  }),
  methods: {
    focus () {
      this.$refs.inputNumberRef.focus()
    },
    blur () {
      this.$refs.inputNumberRef.blur()
    },
  },

  render () {
    const { size, ...others } = getOptionProps(this)
    const inputNumberClass = classNames({
      [`${this.prefixCls}-lg`]: size === 'large',
      [`${this.prefixCls}-sm`]: size === 'small',
    })
    const vcInputNumberprops = {
      props: {
        ...others,
      },
      class: inputNumberClass,
      ref: 'inputNumberRef',
      on: this.$listeners,
    }
    return <VcInputNumber {...vcInputNumberprops} />
  },
}

/* istanbul ignore next */
InputNumber.install = function (Vue) {
  Vue.component(InputNumber.name, InputNumber)
}

export default InputNumber
