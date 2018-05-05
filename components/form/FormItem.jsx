
import PropTypes from '../_util/vue-types'
import classNames from 'classnames'
import Row from '../grid/Row'
import Col, { ColProps } from '../grid/Col'
import warning from '../_util/warning'
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants'
import { initDefaultProps, getComponentFromProp, filterEmpty, getSlotOptions, getSlots } from '../_util/props-util'
import getTransitionProps from '../_util/getTransitionProps'
import BaseMixin from '../_util/BaseMixin'
export const FormItemProps = {
  id: PropTypes.string,
  prefixCls: PropTypes.string,
  label: PropTypes.any,
  labelCol: PropTypes.shape(ColProps).loose,
  wrapperCol: PropTypes.shape(ColProps).loose,
  help: PropTypes.any,
  extra: PropTypes.any,
  validateStatus: PropTypes.oneOf(['', 'success', 'warning', 'error', 'validating']),
  hasFeedback: PropTypes.bool,
  required: PropTypes.bool,
  colon: PropTypes.bool,
}

export default {
  name: 'AFormItem',
  __ANT_FORM_ITEM: true,
  mixins: [BaseMixin],
  props: initDefaultProps(FormItemProps, {
    hasFeedback: false,
    prefixCls: 'ant-form',
    colon: true,
  }),
  inject: {
    FormProps: { default: {}},
  },
  data () {
    return { helpShow: false }
  },
  mounted () {
    warning(
      this.getControls(this.$slots.default, true).length <= 1,
      '`Form.Item` cannot generate `validateStatus` and `help` automatically, ' +
      'while there are more than one `getFieldDecorator` in it.',
    )
  },

  // shouldComponentUpdate(...args: any[]) {
  //   return PureRenderMixin.shouldComponentUpdate.apply(this, args);
  // }
  methods: {
    getHelpMsg () {
      const help = getComponentFromProp(this, 'help')
      const onlyControl = this.getOnlyControl()
      if (help === undefined && onlyControl) {
        const errors = this.getField().errors
        return errors ? errors.map((e) => e.message).join(', ') : ''
      }

      return help
    },

    getControls (childrenArray = [], recursively) {
      let controls = []
      for (let i = 0; i < childrenArray.length; i++) {
        if (!recursively && controls.length > 0) {
          break
        }

        const child = childrenArray[i]
        if (!child.tag && child.text.trim() === '') {
          continue
        }

        if (getSlotOptions(child).__ANT_FORM_ITEM) {
          continue
        }
        const attrs = child.data && child.data.attrs
        if (!attrs) {
          continue
        }
        const slots = getSlots(child)
        if (FIELD_META_PROP in attrs) { // And means FIELD_DATA_PROP in chidl.props, too.
          controls.push(child)
        } else if (slots.default) {
          controls = controls.concat(this.getControls(slots.default, recursively))
        }
      }
      return controls
    },

    getOnlyControl () {
      const child = this.getControls(this.$slots.default, false)[0]
      return child !== undefined ? child : null
    },

    getChildAttr (prop) {
      const child = this.getOnlyControl()
      let data = {}
      if (child.data) {
        data = child.data
      } else if (child.$vnode && child.$vnode.data) {
        data = child.$vnode.data
      }
      return data[prop] || data.attrs[prop]
    },

    getId () {
      return this.getChildAttr('id')
    },

    getMeta () {
      return this.getChildAttr(FIELD_META_PROP)
    },

    getField () {
      return this.getChildAttr(FIELD_DATA_PROP)
    },

    onHelpAnimEnd  () {
      this.setState({ helpShow: false })
    },

    renderHelp () {
      const prefixCls = this.prefixCls
      const help = this.getHelpMsg()
      const children = help ? (
        <div class={`${prefixCls}-explain`} key='help'>
          {help}
        </div>
      ) : null
      const transitionProps = getTransitionProps('show-help', {
        afterLeave: this.onHelpAnimEnd,
      })
      if (children) {
        this.setState({ helpShow: true })
      }
      return (
        <transition
          {...transitionProps}
          key='help'
        >
          {children}
        </transition>
      )
    },

    renderExtra () {
      const { prefixCls } = this
      const extra = getComponentFromProp(this, 'extra')
      return extra ? (
        <div class={`${prefixCls}-extra`}>{extra}</div>
      ) : null
    },

    getValidateStatus () {
      const onlyControl = this.getOnlyControl()
      if (!onlyControl) {
        return ''
      }
      const field = this.getField()
      if (field.validating) {
        return 'validating'
      }
      if (field.errors) {
        return 'error'
      }
      const fieldValue = 'value' in field ? field.value : this.getMeta().initialValue
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        return 'success'
      }
      return ''
    },

    renderValidateWrapper (c1, c2, c3) {
      const props = this.$props
      const onlyControl = this.getOnlyControl
      const validateStatus = (props.validateStatus === undefined && onlyControl)
        ? this.getValidateStatus()
        : props.validateStatus

      let classes = `${props.prefixCls}-item-control`
      if (validateStatus) {
        classes = classNames(`${props.prefixCls}-item-control`, {
          'has-feedback': props.hasFeedback || validateStatus === 'validating',
          'has-success': validateStatus === 'success',
          'has-warning': validateStatus === 'warning',
          'has-error': validateStatus === 'error',
          'is-validating': validateStatus === 'validating',
        })
      }
      return (
        <div class={classes}>
          <span class={`${props.prefixCls}-item-children`}>{c1}</span>
          {c2}{c3}
        </div>
      )
    },

    renderWrapper (children) {
      const { prefixCls, wrapperCol = {}} = this
      const { class: cls, style, id, on, ...restProps } = wrapperCol
      const className = classNames(
        `${prefixCls}-item-control-wrapper`,
        cls,
      )
      const colProps = {
        props: restProps,
        class: className,
        key: 'wrapper',
        style,
        id,
        on,
      }
      return (
        <Col {...colProps}>
          {children}
        </Col>
      )
    },

    isRequired () {
      const { required } = this
      if (required !== undefined) {
        return required
      }
      if (this.getOnlyControl()) {
        const meta = this.getMeta() || {}
        const validate = meta.validate || []

        return validate.filter((item) => !!item.rules).some((item) => {
          return item.rules.some((rule) => rule.required)
        })
      }
      return false
    },

    // Resolve duplicated ids bug between different forms
    // https://github.com/ant-design/ant-design/issues/7351
    onLabelClick (e) {
      const label = getComponentFromProp(this, 'label')
      const id = this.id || this.getId()
      if (!id) {
        return
      }
      const controls = document.querySelectorAll(`[id="${id}"]`)
      if (controls.length !== 1) {
        // Only prevent in default situation
        // Avoid preventing event in `label={<a href="xx">link</a>}``
        if (typeof label === 'string') {
          e.preventDefault()
        }
        const control = this.$el.querySelector(`[id="${id}"]`)
        if (control && control.focus) {
          control.focus()
        }
      }
    },

    renderLabel () {
      const { prefixCls, labelCol = {}, colon, id } = this
      const label = getComponentFromProp(this, 'label')
      const required = this.isRequired()
      const { class: labelColClass, style: labelColStyle, id: labelColId, on, ...restProps } = labelCol
      const labelColClassName = classNames(
        `${prefixCls}-item-label`,
        labelColClass,
      )
      const labelClassName = classNames({
        [`${prefixCls}-item-required`]: required,
      })

      let labelChildren = label
      // Keep label is original where there should have no colon
      const haveColon = colon && this.FormProps.layout !== 'vertical'
      // Remove duplicated user input colon
      if (haveColon && typeof label === 'string' && label.trim() !== '') {
        labelChildren = label.replace(/[：|:]\s*$/, '')
      }
      const colProps = {
        props: restProps,
        class: labelColClassName,
        key: 'label',
        style: labelColStyle,
        id: labelColId,
        on,
      }

      return label ? (
        <Col {...colProps} >
          <label
            for={id || this.getId()}
            class={labelClassName}
            title={typeof label === 'string' ? label : ''}
            onClick={this.onLabelClick}
          >
            {labelChildren}
          </label>
        </Col>
      ) : null
    },
    renderChildren () {
      const { $slots } = this
      return [
        this.renderLabel(),
        this.renderWrapper(
          this.renderValidateWrapper(
            filterEmpty($slots.default || []),
            this.renderHelp(),
            this.renderExtra(),
          ),
        ),
      ]
    },
    renderFormItem (children) {
      const props = this.$props
      const prefixCls = props.prefixCls
      const itemClassName = {
        [`${prefixCls}-item`]: true,
        [`${prefixCls}-item-with-help`]: !!this.getHelpMsg() || this.helpShow,
        [`${prefixCls}-item-no-colon`]: !props.colon,
      }

      return (
        <Row class={classNames(itemClassName)}>
          {children}
        </Row>
      )
    },
  },

  render () {
    const children = this.renderChildren()
    return this.renderFormItem(children)
  },
}
