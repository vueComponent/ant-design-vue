import { inject, provide, Transition } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import getTransitionProps from '../_util/getTransitionProps';
import Row from '../grid/Row';
import Col, { ColProps } from '../grid/Col';
import {
  initDefaultProps,
  findDOMNode,
  getComponent,
  getOptionProps,
  getEvents,
  isValidElement,
  getSlot,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider';
import { cloneElement } from '../_util/vnode';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { validateRules } from './utils/validateUtil';
import { getNamePath } from './utils/valueUtil';
import { toArray } from './utils/typeUtil';

const iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined,
};

function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null,
  };
}
export const FormItemProps = {
  id: PropTypes.string,
  htmlFor: PropTypes.string,
  prefixCls: PropTypes.string,
  label: PropTypes.any,
  help: PropTypes.any,
  extra: PropTypes.any,
  labelCol: PropTypes.shape(ColProps).loose,
  wrapperCol: PropTypes.shape(ColProps).loose,
  hasFeedback: PropTypes.bool,
  colon: PropTypes.bool,
  labelAlign: PropTypes.oneOf(['left', 'right']),
  prop: PropTypes.string,
  rules: PropTypes.oneOfType([Array, Object]),
  autoLink: PropTypes.bool,
  required: PropTypes.bool,
  validateFirst: PropTypes.bool,
  validateStatus: PropTypes.oneOf(['', 'success', 'warning', 'error', 'validating']),
};

export default {
  name: 'AFormModelItem',
  mixins: [BaseMixin],
  inheritAttrs: false,
  __ANT_NEW_FORM_ITEM: true,
  props: initDefaultProps(FormItemProps, {
    hasFeedback: false,
    autoLink: true,
  }),
  setup() {
    return {
      isFormItemChildren: inject('isFormItemChildren', false),
      configProvider: inject('configProvider', ConfigConsumerProps),
      FormContext: inject('FormContext', {}),
    };
  },
  data() {
    return {
      validateState: this.validateStatus,
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      helpShow: false,
      errors: [],
    };
  },

  computed: {
    fieldId() {
      return this.id || (this.FormContext.name && this.prop)
        ? `${this.FormContext.name}_${this.prop}`
        : undefined;
    },
    fieldValue() {
      const model = this.FormContext.model;
      if (!model || !this.prop) {
        return;
      }
      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/g, '.');
      }
      return getPropByPath(model, path, true).v;
    },
    isRequired() {
      let rules = this.getRules();
      let isRequired = false;
      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired || this.required;
    },
  },
  watch: {
    validateStatus(val) {
      this.validateState = val;
    },
  },
  created() {
    provide('isFormItemChildren', true);
  },
  mounted() {
    if (this.prop) {
      const { addField } = this.FormContext;
      addField && addField(this);
      this.initialValue = cloneDeep(this.fieldValue);
    }
  },
  beforeUnmount() {
    const { removeField } = this.FormContext;
    removeField && removeField(this);
  },
  methods: {
    getNamePath() {
      const { prop } = this.$props;
      const { prefixName = [] } = this.FormContext;

      return prop !== undefined ? [...prefixName, ...getNamePath(prop)] : [];
    },
    validateRules(options) {
      const { validateFirst = false, messageVariables } = this.$props;
      const { triggerName } = options || {};
      const namePath = this.getNamePath();

      let filteredRules = this.getRules();
      if (triggerName) {
        filteredRules = filteredRules.filter(rule => {
          const { validateTrigger } = rule;
          if (!validateTrigger) {
            return true;
          }
          const triggerList = toArray(validateTrigger);
          return triggerList.includes(triggerName);
        });
      }

      const promise = validateRules(
        namePath,
        this.fieldValue,
        filteredRules,
        options,
        validateFirst,
        messageVariables,
      );
      this.validateState = 'validating';
      this.errors = [];

      promise
        .catch(e => e)
        .then((errors = []) => {
          if (this.validateState === 'validating') {
            this.validateState = errors.length ? 'error' : 'success';
            this.validateMessage = errors[0];
            this.errors = errors;
          }
        });

      return promise;
    },
    getRules() {
      let formRules = this.FormContext.rules;
      const selfRules = this.rules;
      const requiredRule =
        this.required !== undefined ? { required: !!this.required, trigger: 'change' } : [];
      const prop = getPropByPath(formRules, this.prop || '');
      formRules = formRules ? prop.o[this.prop || ''] || prop.v : [];
      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    getFilteredRule(trigger) {
      const rules = this.getRules();
      return rules
        .filter(rule => {
          if (!rule.trigger || trigger === '') return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        })
        .map(rule => ({ ...rule }));
    },
    onFieldBlur() {
      this.validateRules({ triggerName: 'blur' });
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      this.validateRules({ triggerName: 'change' });
    },
    clearValidate() {
      this.validateState = '';
      this.validateMessage = '';
      this.validateDisabled = false;
    },
    resetField() {
      this.validateState = '';
      this.validateMessage = '';
      let model = this.FormContext.model || {};
      let value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      let prop = getPropByPath(model, path, true);
      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }
      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(() => {
        this.validateDisabled = false;
      });
    },
    getHelpMessage() {
      const help = getComponent(this, 'help');

      return this.validateMessage || help;
    },

    onLabelClick() {
      const id = this.fieldId;
      if (!id) {
        return;
      }
      const formItemNode = findDOMNode(this);
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
        onAfterEnter: () => this.onHelpAnimEnd('help', true),
        onAfterLeave: () => this.onHelpAnimEnd('help', false),
      });
      return (
        <Transition {...transitionProps} key="help">
          {children}
        </Transition>
      );
    },

    renderExtra(prefixCls) {
      const extra = getComponent(this, 'extra');
      return extra ? <div class={`${prefixCls}-extra`}>{extra}</div> : null;
    },

    renderValidateWrapper(prefixCls, c1, c2, c3) {
      const validateStatus = this.validateState;

      let classes = `${prefixCls}-item-control`;
      if (validateStatus) {
        classes = classNames(`${prefixCls}-item-control`, {
          'has-feedback': this.hasFeedback || validateStatus === 'validating',
          'has-success': validateStatus === 'success',
          'has-warning': validateStatus === 'warning',
          'has-error': validateStatus === 'error',
          'is-validating': validateStatus === 'validating',
        });
      }
      const IconNode = validateStatus && iconMap[validateStatus];

      const icon =
        this.hasFeedback && IconNode ? (
          <span class={`${prefixCls}-item-children-icon`}>
            <IconNode />
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
      const { style, id, ...restProps } = mergedWrapperCol;
      const className = classNames(`${prefixCls}-item-control-wrapper`, mergedWrapperCol.class);
      const colProps = {
        ...restProps,
        class: className,
        key: 'wrapper',
        style,
        id,
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
      const { labelAlign, labelCol, colon, fieldId, htmlFor } = this;
      const label = getComponent(this, 'label');
      const required = this.isRequired;
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
        ...restProps,
        class: labelColClassName,
        key: 'label',
        style: labelColStyle,
        id: labelColId,
      };

      return label ? (
        <Col {...colProps}>
          <label
            for={htmlFor || fieldId}
            class={labelClassName}
            title={typeof label === 'string' ? label : ''}
            onClick={this.onLabelClick}
          >
            {labelChildren}
          </label>
        </Col>
      ) : null;
    },
    renderChildren(prefixCls, child) {
      return [
        this.renderLabel(prefixCls),
        this.renderWrapper(
          prefixCls,
          this.renderValidateWrapper(
            prefixCls,
            child,
            this.renderHelp(prefixCls),
            this.renderExtra(prefixCls),
          ),
        ),
      ];
    },
    renderFormItem(child) {
      const { prefixCls: customizePrefixCls } = this.$props;
      const { class: className, ...restProps } = this.$attrs;
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('form', customizePrefixCls);
      const children = this.renderChildren(prefixCls, child);
      const itemClassName = {
        [className]: className,
        [`${prefixCls}-item`]: true,
        [`${prefixCls}-item-with-help`]: this.helpShow,
      };

      return (
        <Row class={classNames(itemClassName)} key="row" {...restProps}>
          {children}
        </Row>
      );
    },
  },
  render() {
    const { autoLink } = getOptionProps(this);
    const children = getSlot(this);
    let firstChildren = children[0];
    if (this.prop && autoLink && isValidElement(firstChildren)) {
      const originalEvents = getEvents(firstChildren);
      const originalBlur = originalEvents.onBlur;
      const originalChange = originalEvents.onChange;
      firstChildren = cloneElement(firstChildren, {
        ...(this.fieldId ? { id: this.fieldId } : undefined),
        onBlur: (...args) => {
          originalBlur && originalBlur(...args);
          this.onFieldBlur();
        },
        onChange: (...args) => {
          if (Array.isArray(originalChange)) {
            for (let i = 0, l = originalChange.length; i < l; i++) {
              originalChange[i](...args);
            }
          } else if (originalChange) {
            originalChange(...args);
          }
          this.onFieldChange();
        },
      });
    }
    return this.renderFormItem([firstChildren, children.slice(1)]);
  },
};
