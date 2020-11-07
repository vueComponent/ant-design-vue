import { inject, provide, PropType, defineComponent, computed, nextTick } from 'vue';
import cloneDeep from 'lodash-es/cloneDeep';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { getTransitionProps, Transition } from '../_util/transition';
import Row from '../grid/Row';
import Col, { ColProps } from '../grid/Col';
import hasProp, {
  findDOMNode,
  getComponent,
  getOptionProps,
  getEvents,
  isValidElement,
  getSlot,
} from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { defaultConfigProvider } from '../config-provider';
import { cloneElement } from '../_util/vnode';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import { validateRules } from './utils/validateUtil';
import { getNamePath } from './utils/valueUtil';
import { toArray } from './utils/typeUtil';
import { warning } from '../vc-util/warning';
import find from 'lodash-es/find';
import { tuple, VueNode } from '../_util/type';
import { ValidateOptions } from './interface';

const iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined,
};

function getPropByPath(obj: any, namePathList: any, strict?: boolean) {
  let tempObj = obj;

  const keyArr = namePathList;
  let i = 0;
  try {
    for (let len = keyArr.length; i < len - 1; ++i) {
      if (!tempObj && !strict) break;
      const key = keyArr[i];
      if (key in tempObj) {
        tempObj = tempObj[key];
      } else {
        if (strict) {
          throw Error('please transfer a valid name path to form item!');
        }
        break;
      }
    }
    if (strict && !tempObj) {
      throw Error('please transfer a valid name path to form item!');
    }
  } catch (error) {
    console.error('please transfer a valid name path to form item!');
  }

  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : undefined,
  };
}
export const FormItemProps = {
  id: PropTypes.string,
  htmlFor: PropTypes.string,
  prefixCls: PropTypes.string,
  label: PropTypes.VNodeChild,
  help: PropTypes.VNodeChild,
  extra: PropTypes.VNodeChild,
  labelCol: { type: Object as PropType<ColProps> },
  wrapperCol: { type: Object as PropType<ColProps> },
  hasFeedback: PropTypes.looseBool.def(false),
  colon: PropTypes.looseBool,
  labelAlign: PropTypes.oneOf(tuple('left', 'right')),
  prop: { type: [String, Number, Array] as PropType<string | number | string[] | number[]> },
  name: { type: [String, Number, Array] as PropType<string | number | string[] | number[]> },
  rules: PropTypes.oneOfType([Array, Object]),
  autoLink: PropTypes.looseBool.def(true),
  required: PropTypes.looseBool,
  validateFirst: PropTypes.looseBool,
  validateStatus: PropTypes.oneOf(tuple('', 'success', 'warning', 'error', 'validating')),
  validateTrigger: { type: [String, Array] as PropType<string | string[]> },
  messageVariables: { type: Object as PropType<Record<string, string>> },
};

export default defineComponent({
  name: 'AFormItem',
  mixins: [BaseMixin],
  inheritAttrs: false,
  __ANT_NEW_FORM_ITEM: true,
  props: FormItemProps,
  setup(props) {
    const FormContext = inject('FormContext', {}) as any;
    const fieldName = computed(() => props.name || props.prop);
    const namePath = computed(() => {
      const val = fieldName.value;
      return getNamePath(val);
    });
    const fieldId = computed(() => {
      const { id } = props;
      if (id) {
        return id;
      } else if (!namePath.value.length) {
        return undefined;
      } else {
        const formName = FormContext.name;
        const mergedId = namePath.value.join('_');
        return formName ? `${formName}_${mergedId}` : mergedId;
      }
    });
    const fieldValue = computed(() => {
      const model = FormContext.model;
      if (!model || !fieldName.value) {
        return;
      }
      return getPropByPath(model, namePath.value, true).v;
    });
    const mergedValidateTrigger = computed(() => {
      let validateTrigger =
        props.validateTrigger !== undefined ? props.validateTrigger : FormContext.validateTrigger;
      validateTrigger = validateTrigger === undefined ? 'change' : validateTrigger;
      return toArray(validateTrigger);
    });
    const getRules = () => {
      let formRules = FormContext.rules;
      const selfRules = props.rules;
      const requiredRule =
        props.required !== undefined
          ? { required: !!props.required, trigger: mergedValidateTrigger.value }
          : [];
      const prop = getPropByPath(formRules, namePath.value);
      formRules = formRules ? prop.o[prop.k] || prop.v : [];
      const rules = [].concat(selfRules || formRules || []);
      if (find(rules, rule => rule.required)) {
        return rules;
      } else {
        return rules.concat(requiredRule);
      }
    };
    const isRequired = computed(() => {
      const rules = getRules();
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
      return isRequired || props.required;
    });
    return {
      isFormItemChildren: inject('isFormItemChildren', false),
      configProvider: inject('configProvider', defaultConfigProvider),
      FormContext,
      fieldId,
      fieldName,
      namePath,
      isRequired,
      getRules,
      fieldValue,
      mergedValidateTrigger,
    };
  },
  data() {
    warning(!hasProp(this, 'prop'), `\`prop\` is deprecated. Please use \`name\` instead.`);
    return {
      validateState: this.validateStatus,
      validateMessage: '',
      validateDisabled: false,
      validator: {},
      helpShow: false,
      errors: [],
      initialValue: undefined,
    };
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
    if (this.fieldName) {
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
      const { fieldName } = this;
      const { prefixName = [] } = this.FormContext;

      return fieldName !== undefined ? [...prefixName, ...this.namePath] : [];
    },
    validateRules(options: ValidateOptions) {
      const { validateFirst = false, messageVariables } = this.$props;
      const { triggerName } = options || {};
      const namePath = this.getNamePath();

      let filteredRules = this.getRules();
      if (triggerName) {
        filteredRules = filteredRules.filter(rule => {
          const { trigger } = rule;
          if (!trigger && !this.mergedValidateTrigger.length) {
            return true;
          }
          const triggerList = toArray(trigger || this.mergedValidateTrigger);
          return triggerList.includes(triggerName);
        });
      }
      if (!filteredRules.length) {
        return Promise.resolve();
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
      const model = this.FormContext.model || {};
      const value = this.fieldValue;
      const prop = getPropByPath(model, this.namePath, true);
      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }
      // reset validateDisabled after onFieldChange triggered
      nextTick(() => {
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

    onHelpAnimEnd(_key: string, helpShow: boolean) {
      this.helpShow = helpShow;
      if (!helpShow) {
        this.$forceUpdate();
      }
    },

    renderHelp(prefixCls: string) {
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

    renderExtra(prefixCls: string) {
      const extra = getComponent(this, 'extra');
      return extra ? <div class={`${prefixCls}-extra`}>{extra}</div> : null;
    },

    renderValidateWrapper(prefixCls: string, c1: VueNode, c2: VueNode, c3: VueNode) {
      const validateStatus = this.validateState;

      let classes = `${prefixCls}-item-control`;
      if (validateStatus) {
        classes = classNames(`${prefixCls}-item-control`, {
          'has-feedback': validateStatus && this.hasFeedback,
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

    renderWrapper(prefixCls: string, children: VueNode) {
      const { wrapperCol: contextWrapperCol } = (this.isFormItemChildren
        ? {}
        : this.FormContext) as any;
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

    renderLabel(prefixCls: string) {
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
    renderChildren(prefixCls: string, child: VueNode) {
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
    renderFormItem(child: any[]) {
      const { prefixCls: customizePrefixCls } = this.$props;
      const { class: className, ...restProps } = this.$attrs as any;
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
    if (this.fieldName && autoLink && isValidElement(firstChildren)) {
      const originalEvents = getEvents(firstChildren);
      const originalBlur = originalEvents.onBlur;
      const originalChange = originalEvents.onChange;
      firstChildren = cloneElement(firstChildren, {
        ...(this.fieldId ? { id: this.fieldId } : undefined),
        onBlur: (...args: any[]) => {
          originalBlur && originalBlur(...args);
          this.onFieldBlur();
        },
        onChange: (...args: any[]) => {
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
});
