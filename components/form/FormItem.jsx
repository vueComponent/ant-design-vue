import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import find from 'lodash/find';
import Row from '../grid/Row';
import Col, { ColProps } from '../grid/Col';
import warning from '../_util/warning';
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants';
import {
  initDefaultProps,
  getComponentFromProp,
  filterEmpty,
  getSlotOptions,
  isValidElement,
  getAllChildren,
} from '../_util/props-util';
import getTransitionProps from '../_util/getTransitionProps';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement, cloneVNodes } from '../_util/vnode';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

function noop() {}

function intersperseSpace(list) {
  return list.reduce((current, item) => [...current, ' ', item], []).slice(1);
}
export const FormItemProps = {
  id: PropTypes.string,
  htmlFor: PropTypes.string,
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
  fieldDecoratorId: PropTypes.string,
  fieldDecoratorOptions: PropTypes.object,
  selfUpdate: PropTypes.bool,
  labelAlign: PropTypes.oneOf(['left', 'right']),
};
function comeFromSlot(vnodes = [], itemVnode) {
  let isSlot = false;
  for (let i = 0, len = vnodes.length; i < len; i++) {
    const vnode = vnodes[i];
    if (vnode && (vnode === itemVnode || vnode.$vnode === itemVnode)) {
      isSlot = true;
    } else {
      const componentOptions =
        vnode.componentOptions || (vnode.$vnode && vnode.$vnode.componentOptions);
      const children = componentOptions ? componentOptions.children : vnode.$children;
      isSlot = comeFromSlot(children, itemVnode);
    }
    if (isSlot) {
      break;
    }
  }
  return isSlot;
}

export default {
  name: 'AFormItem',
  __ANT_FORM_ITEM: true,
  mixins: [BaseMixin],
  props: initDefaultProps(FormItemProps, {
    hasFeedback: false,
  }),
  provide() {
    return {
      isFormItemChildren: true,
    };
  },
  inject: {
    isFormItemChildren: { default: false },
    FormContext: { default: () => ({}) },
    decoratorFormProps: { default: () => ({}) },
    collectFormItemContext: { default: () => noop },
    configProvider: { default: () => ConfigConsumerProps },
  },
  data() {
    return { helpShow: false };
  },
  computed: {
    itemSelfUpdate() {
      return !!(this.selfUpdate === undefined ? this.FormContext.selfUpdate : this.selfUpdate);
    },
  },
  created() {
    this.collectContext();
  },
  beforeUpdate() {
    if (process.env.NODE_ENV !== 'production') {
      this.collectContext();
    }
  },
  beforeDestroy() {
    this.collectFormItemContext(this.$vnode && this.$vnode.context, 'delete');
  },
  mounted() {
    const { help, validateStatus } = this.$props;
    warning(
      this.getControls(this.slotDefault, true).length <= 1 ||
        help !== undefined ||
        validateStatus !== undefined,
      'Form.Item',
      'Cannot generate `validateStatus` and `help` automatically, ' +
        'while there are more than one `getFieldDecorator` in it.',
    );
    warning(
      !this.fieldDecoratorId,
      'Form.Item',
      '`fieldDecoratorId` is deprecated. please use `v-decorator={id, options}` instead.',
    );
  },
  methods: {
    collectContext() {
      if (this.FormContext.form && this.FormContext.form.templateContext) {
        const { templateContext } = this.FormContext.form;
        const vnodes = Object.values(templateContext.$slots || {}).reduce((a, b = []) => {
          return [...a, ...b];
        }, []);
        const isSlot = comeFromSlot(vnodes, this.$vnode);
        warning(!isSlot, 'You can not set FormItem from slot, please use slot-scope instead slot');
        let isSlotScope = false;
        // 进一步判断是否是通过slot-scope传递
        if (!isSlot && this.$vnode.context !== templateContext) {
          isSlotScope = comeFromSlot(this.$vnode.context.$children, templateContext.$vnode);
        }
        if (!isSlotScope && !isSlot) {
          this.collectFormItemContext(this.$vnode.context);
        }
      }
    },
    getHelpMessage() {
      const help = getComponentFromProp(this, 'help');
      const onlyControl = this.getOnlyControl();
      if (help === undefined && onlyControl) {
        const errors = this.getField().errors;
        if (errors) {
          return intersperseSpace(
            errors.map((e, index) => {
              let node = null;
              if (isValidElement(e)) {
                node = e;
              } else if (isValidElement(e.message)) {
                node = e.message;
              }
              return node ? cloneElement(node, { key: index }) : e.message;
            }),
          );
        } else {
          return '';
        }
      }

      return help;
    },

    getControls(childrenArray = [], recursively) {
      let controls = [];
      for (let i = 0; i < childrenArray.length; i++) {
        if (!recursively && controls.length > 0) {
          break;
        }

        const child = childrenArray[i];
        if (!child.tag && child.text.trim() === '') {
          continue;
        }

        if (getSlotOptions(child).__ANT_FORM_ITEM) {
          continue;
        }
        const children = getAllChildren(child);
        const attrs = (child.data && child.data.attrs) || {};
        if (FIELD_META_PROP in attrs) {
          // And means FIELD_DATA_PROP in child.props, too.
          controls.push(child);
        } else if (children) {
          controls = controls.concat(this.getControls(children, recursively));
        }
      }
      return controls;
    },

    getOnlyControl() {
      const child = this.getControls(this.slotDefault, false)[0];
      return child !== undefined ? child : null;
    },

    getChildAttr(prop) {
      const child = this.getOnlyControl();
      let data = {};
      if (!child) {
        return undefined;
      }
      if (child.data) {
        data = child.data;
      } else if (child.$vnode && child.$vnode.data) {
        data = child.$vnode.data;
      }
      return data[prop] || data.attrs[prop];
    },

    getId() {
      return this.getChildAttr('id');
    },

    getMeta() {
      return this.getChildAttr(FIELD_META_PROP);
    },

    getField() {
      return this.getChildAttr(FIELD_DATA_PROP);
    },

    getValidateStatus() {
      const onlyControl = this.getOnlyControl();
      if (!onlyControl) {
        return '';
      }
      const field = this.getField();
      if (field.validating) {
        return 'validating';
      }
      if (field.errors) {
        return 'error';
      }
      const fieldValue = 'value' in field ? field.value : this.getMeta().initialValue;
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        return 'success';
      }
      return '';
    },

    // Resolve duplicated ids bug between different forms
    // https://github.com/ant-design/ant-design/issues/7351
    onLabelClick() {
      const id = this.id || this.getId();
      if (!id) {
        return;
      }
      const formItemNode = this.$el;
      const control = formItemNode.querySelector(`[id="${id}"]`);
      if (control && control.focus) {
        control.focus();
      }
    },

    onHelpAnimEnd(_key, helpShow) {
      this.helpShow = helpShow;
      if (!helpShow) {
        this.$forceUpdate();
      }
    },

    isRequired() {
      const { required } = this;
      if (required !== undefined) {
        return required;
      }
      if (this.getOnlyControl()) {
        const meta = this.getMeta() || {};
        const validate = meta.validate || [];

        return validate
          .filter(item => !!item.rules)
          .some(item => {
            return item.rules.some(rule => rule.required);
          });
      }
      return false;
    },

    renderHelp(prefixCls) {
      const help = this.getHelpMessage();
      const children = help ? (
        <div class={`${prefixCls}-explain`} key="help">
          {help}
        </div>
      ) : null;
      if (children) {
        this.helpShow = !!children;
      }
      const transitionProps = getTransitionProps('show-help', {
        afterEnter: () => this.onHelpAnimEnd('help', true),
        afterLeave: () => this.onHelpAnimEnd('help', false),
      });
      return (
        <transition {...transitionProps} key="help">
          {children}
        </transition>
      );
    },

    renderExtra(prefixCls) {
      const extra = getComponentFromProp(this, 'extra');
      return extra ? <div class={`${prefixCls}-extra`}>{extra}</div> : null;
    },

    renderValidateWrapper(prefixCls, c1, c2, c3) {
      const props = this.$props;
      const onlyControl = this.getOnlyControl;
      const validateStatus =
        props.validateStatus === undefined && onlyControl
          ? this.getValidateStatus()
          : props.validateStatus;

      let classes = `${prefixCls}-item-control`;
      if (validateStatus) {
        classes = classNames(`${prefixCls}-item-control`, {
          'has-feedback': validateStatus && props.hasFeedback,
          'has-success': validateStatus === 'success',
          'has-warning': validateStatus === 'warning',
          'has-error': validateStatus === 'error',
          'is-validating': validateStatus === 'validating',
        });
      }
      let iconType = '';
      switch (validateStatus) {
        case 'success':
          iconType = 'check-circle';
          break;
        case 'warning':
          iconType = 'exclamation-circle';
          break;
        case 'error':
          iconType = 'close-circle';
          break;
        case 'validating':
          iconType = 'loading';
          break;
        default:
          iconType = '';
          break;
      }
      const icon =
        props.hasFeedback && iconType ? (
          <span class={`${prefixCls}-item-children-icon`}>
            <Icon type={iconType} theme={iconType === 'loading' ? 'outlined' : 'filled'} />
          </span>
        ) : null;
      return (
        <div class={classes}>
          <span class={`${prefixCls}-item-children`}>
            {c1}
            {icon}
          </span>
          {c2}
          {c3}
        </div>
      );
    },

    renderWrapper(prefixCls, children) {
      const { wrapperCol: contextWrapperCol } = this.isFormItemChildren ? {} : this.FormContext;
      const { wrapperCol } = this;
      const mergedWrapperCol = wrapperCol || contextWrapperCol || {};
      const { style, id, on, ...restProps } = mergedWrapperCol;
      const className = classNames(`${prefixCls}-item-control-wrapper`, mergedWrapperCol.class);
      const colProps = {
        props: restProps,
        class: className,
        key: 'wrapper',
        style,
        id,
        on,
      };
      return <Col {...colProps}>{children}</Col>;
    },

    renderLabel(prefixCls) {
      const {
        vertical,
        labelAlign: contextLabelAlign,
        labelCol: contextLabelCol,
        colon: contextColon,
      } = this.FormContext;
      const { labelAlign, labelCol, colon, id, htmlFor } = this;
      const label = getComponentFromProp(this, 'label');
      const required = this.isRequired();
      const mergedLabelCol = labelCol || contextLabelCol || {};

      const mergedLabelAlign = labelAlign || contextLabelAlign;
      const labelClsBasic = `${prefixCls}-item-label`;
      const labelColClassName = classNames(
        labelClsBasic,
        mergedLabelAlign === 'left' && `${labelClsBasic}-left`,
        mergedLabelCol.class,
      );
      const {
        class: labelColClass,
        style: labelColStyle,
        id: labelColId,
        on,
        ...restProps
      } = mergedLabelCol;
      let labelChildren = label;
      // Keep label is original where there should have no colon
      const computedColon = colon === true || (contextColon !== false && colon !== false);
      const haveColon = computedColon && !vertical;
      // Remove duplicated user input colon
      if (haveColon && typeof label === 'string' && label.trim() !== '') {
        labelChildren = label.replace(/[：:]\s*$/, '');
      }

      const labelClassName = classNames({
        [`${prefixCls}-item-required`]: required,
        [`${prefixCls}-item-no-colon`]: !computedColon,
      });
      const colProps = {
        props: restProps,
        class: labelColClassName,
        key: 'label',
        style: labelColStyle,
        id: labelColId,
        on,
      };

      return label ? (
        <Col {...colProps}>
          <label
            for={htmlFor || id || this.getId()}
            class={labelClassName}
            title={typeof label === 'string' ? label : ''}
            onClick={this.onLabelClick}
          >
            {labelChildren}
          </label>
        </Col>
      ) : null;
    },
    renderChildren(prefixCls) {
      return [
        this.renderLabel(prefixCls),
        this.renderWrapper(
          prefixCls,
          this.renderValidateWrapper(
            prefixCls,
            this.slotDefault,
            this.renderHelp(prefixCls),
            this.renderExtra(prefixCls),
          ),
        ),
      ];
    },
    renderFormItem() {
      const { prefixCls: customizePrefixCls } = this.$props;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('form', customizePrefixCls);
      const children = this.renderChildren(prefixCls);
      const itemClassName = {
        [`${prefixCls}-item`]: true,
        [`${prefixCls}-item-with-help`]: this.helpShow,
      };

      return (
        <Row class={classNames(itemClassName)} key="row">
          {children}
        </Row>
      );
    },
    decoratorOption(vnode) {
      if (vnode.data && vnode.data.directives) {
        const directive = find(vnode.data.directives, ['name', 'decorator']);
        warning(
          !directive || (directive && Array.isArray(directive.value)),
          'Form',
          `Invalid directive: type check failed for directive "decorator". Expected Array, got ${typeof (directive
            ? directive.value
            : directive)}. At ${vnode.tag}.`,
        );
        return directive ? directive.value : null;
      } else {
        return null;
      }
    },
    decoratorChildren(vnodes) {
      const { FormContext } = this;
      const getFieldDecorator = FormContext.form.getFieldDecorator;
      for (let i = 0, len = vnodes.length; i < len; i++) {
        const vnode = vnodes[i];
        if (getSlotOptions(vnode).__ANT_FORM_ITEM) {
          break;
        }
        if (vnode.children) {
          vnode.children = this.decoratorChildren(cloneVNodes(vnode.children));
        } else if (vnode.componentOptions && vnode.componentOptions.children) {
          vnode.componentOptions.children = this.decoratorChildren(
            cloneVNodes(vnode.componentOptions.children),
          );
        }
        const option = this.decoratorOption(vnode);
        if (option && option[0]) {
          vnodes[i] = getFieldDecorator(option[0], option[1], this)(vnode);
        }
      }
      return vnodes;
    },
  },

  render() {
    const {
      $slots,
      decoratorFormProps,
      fieldDecoratorId,
      fieldDecoratorOptions = {},
      FormContext,
    } = this;
    let child = filterEmpty($slots.default || []);
    if (decoratorFormProps.form && fieldDecoratorId && child.length) {
      const getFieldDecorator = decoratorFormProps.form.getFieldDecorator;
      child[0] = getFieldDecorator(fieldDecoratorId, fieldDecoratorOptions, this)(child[0]);
      warning(
        !(child.length > 1),
        'Form',
        '`autoFormCreate` just `decorator` then first children. but you can use JSX to support multiple children',
      );
      this.slotDefault = child;
    } else if (FormContext.form) {
      child = cloneVNodes(child);
      this.slotDefault = this.decoratorChildren(child);
    } else {
      this.slotDefault = child;
    }
    return this.renderFormItem();
  },
};
