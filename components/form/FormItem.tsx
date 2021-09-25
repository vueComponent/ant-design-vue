import type { PropType, ExtractPropTypes, ComputedRef } from 'vue';
import { watch, defineComponent, computed, nextTick, ref, watchEffect, onBeforeUnmount } from 'vue';
import cloneDeep from 'lodash-es/cloneDeep';
import PropTypes from '../_util/vue-types';
import Row from '../grid/Row';
import type { ColProps } from '../grid/Col';
import { filterEmpty } from '../_util/props-util';
import { validateRules as validateRulesUtil } from './utils/validateUtil';
import { getNamePath } from './utils/valueUtil';
import { toArray } from './utils/typeUtil';
import { warning } from '../vc-util/warning';
import find from 'lodash-es/find';
import { tuple } from '../_util/type';
import type { InternalNamePath, RuleError, RuleObject, ValidateOptions } from './interface';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useInjectForm } from './context';
import FormItemLabel from './FormItemLabel';
import FormItemInput from './FormItemInput';
import type { ValidationRule } from './Form';
import { useProvideFormItemContext } from './FormItemContext';

const ValidateStatuses = tuple('success', 'warning', 'error', 'validating', '');
export type ValidateStatus = typeof ValidateStatuses[number];

export interface FieldExpose {
  fieldValue: ComputedRef<any>;
  fieldId: ComputedRef<any>;
  fieldName: ComputedRef<any>;
  resetField: () => void;
  clearValidate: () => void;
  namePath: ComputedRef<InternalNamePath>;
  rules?: ComputedRef<ValidationRule[]>;
  validateRules: (options: ValidateOptions) => Promise<void> | Promise<RuleError[]>;
}

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
export const formItemProps = {
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
  hidden: Boolean,
};

export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>;

let indexGuid = 0;

// default form item id prefix.
const defaultItemNamePrefixCls = 'form_item';

export default defineComponent({
  name: 'AFormItem',
  inheritAttrs: false,
  __ANT_NEW_FORM_ITEM: true,
  props: formItemProps,
  slots: ['help', 'label', 'extra'],
  setup(props, { slots, attrs, expose }) {
    warning(props.prop === undefined, `\`prop\` is deprecated. Please use \`name\` instead.`);
    const eventKey = `form-item-${++indexGuid}`;
    const { prefixCls } = useConfigInject('form', props);
    const formContext = useInjectForm();
    const fieldName = computed(() => props.name || props.prop);
    const errors = ref([]);
    const validateDisabled = ref(false);
    const domErrorVisible = ref(false);
    const inputRef = ref();
    const namePath = computed(() => {
      const val = fieldName.value;
      return getNamePath(val);
    });
    const fieldId = computed(() => {
      if (!namePath.value.length) {
        return undefined;
      } else {
        const formName = formContext.name.value;
        const mergedId = namePath.value.join('_');
        return formName ? `${formName}_${mergedId}` : `${defaultItemNamePrefixCls}_${mergedId}`;
      }
    });
    const fieldValue = computed(() => {
      const model = formContext.model.value;
      if (!model || !fieldName.value) {
        return;
      }
      return getPropByPath(model, namePath.value, true).v;
    });

    const initialValue = ref(cloneDeep(fieldValue.value));
    const mergedValidateTrigger = computed(() => {
      let validateTrigger =
        props.validateTrigger !== undefined
          ? props.validateTrigger
          : formContext.validateTrigger.value;
      validateTrigger = validateTrigger === undefined ? 'change' : validateTrigger;
      return toArray(validateTrigger);
    });
    const rulesRef = computed<ValidationRule[]>(() => {
      let formRules = formContext.rules.value;
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
    });
    const isRequired = computed(() => {
      const rules = rulesRef.value;
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

    const validateState = ref();
    watchEffect(() => {
      validateState.value = props.validateStatus;
    });

    const validateRules = (options: ValidateOptions) => {
      const { validateFirst = false, messageVariables } = props;
      const { triggerName } = options || {};

      let filteredRules = rulesRef.value;
      if (triggerName) {
        filteredRules = filteredRules.filter(rule => {
          const { trigger } = rule;
          if (!trigger && !mergedValidateTrigger.value.length) {
            return true;
          }
          const triggerList = toArray(trigger || mergedValidateTrigger.value);
          return triggerList.includes(triggerName);
        });
      }
      if (!filteredRules.length) {
        return Promise.resolve();
      }
      const promise = validateRulesUtil(
        namePath.value,
        fieldValue.value,
        filteredRules as RuleObject[],
        options,
        validateFirst,
        messageVariables,
      );
      validateState.value = 'validating';
      errors.value = [];

      promise
        .catch(e => e)
        .then((results: RuleError[] = []) => {
          if (validateState.value === 'validating') {
            const res = results.filter(result => result && result.errors.length);
            validateState.value = res.length ? 'error' : 'success';

            errors.value = res.map(r => r.errors);
          }
        });

      return promise;
    };

    const onFieldBlur = () => {
      validateRules({ triggerName: 'blur' });
    };
    const onFieldChange = () => {
      if (validateDisabled.value) {
        validateDisabled.value = false;
        return;
      }
      validateRules({ triggerName: 'change' });
    };
    const clearValidate = () => {
      validateState.value = '';
      validateDisabled.value = false;
      errors.value = [];
    };

    const resetField = () => {
      validateState.value = '';
      validateDisabled.value = true;
      errors.value = [];
      const model = formContext.model.value || {};
      const value = fieldValue.value;
      const prop = getPropByPath(model, namePath.value, true);
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(initialValue.value);
      } else {
        prop.o[prop.k] = initialValue.value;
      }
      // reset validateDisabled after onFieldChange triggered
      nextTick(() => {
        validateDisabled.value = false;
      });
    };

    const onLabelClick = () => {
      const id = fieldId.value;
      if (!id || !inputRef.value) {
        return;
      }
      const control = inputRef.value.$el.querySelector(`[id="${id}"]`);
      if (control && control.focus) {
        control.focus();
      }
    };
    expose({
      onFieldBlur,
      onFieldChange,
      clearValidate,
      resetField,
    });

    useProvideFormItemContext(
      {
        id: fieldId,
        onFieldBlur: () => {
          if (props.autoLink) {
            onFieldBlur();
          }
        },
        onFieldChange: () => {
          if (props.autoLink) {
            onFieldChange();
          }
        },
        clearValidate,
      },
      computed(() => {
        return !!(props.autoLink && formContext.model.value && fieldName.value);
      }),
    );
    let registered = false;
    watch(
      fieldName,
      val => {
        if (val) {
          if (!registered) {
            registered = true;
            formContext.addField(eventKey, {
              fieldValue,
              fieldId,
              fieldName,
              resetField,
              clearValidate,
              namePath,
              validateRules,
              rules: rulesRef,
            });
          }
        } else {
          registered = false;
          formContext.removeField(eventKey);
        }
      },
      { immediate: true },
    );
    onBeforeUnmount(() => {
      formContext.removeField(eventKey);
    });
    const itemClassName = computed(() => ({
      [`${prefixCls.value}-item`]: true,

      // Status
      [`${prefixCls.value}-item-has-feedback`]: validateState.value && props.hasFeedback,
      [`${prefixCls.value}-item-has-success`]: validateState.value === 'success',
      [`${prefixCls.value}-item-has-warning`]: validateState.value === 'warning',
      [`${prefixCls.value}-item-has-error`]: validateState.value === 'error',
      [`${prefixCls.value}-item-is-validating`]: validateState.value === 'validating',
      [`${prefixCls.value}-item-hidden`]: props.hidden,
    }));
    return () => {
      const help = props.help ?? (slots.help ? filterEmpty(slots.help()) : null);
      return (
        <Row
          {...attrs}
          class={[
            itemClassName.value,
            domErrorVisible.value || !!help ? `${prefixCls.value}-item-with-help` : '',
            attrs.class,
          ]}
          key="row"
          v-slots={{
            default: () => (
              <>
                {/* Label */}
                <FormItemLabel
                  {...props}
                  htmlFor={fieldId.value}
                  required={isRequired.value}
                  requiredMark={formContext.requiredMark.value}
                  prefixCls={prefixCls.value}
                  onClick={onLabelClick}
                  label={props.label ?? slots.label?.()}
                />
                {/* Input Group */}
                <FormItemInput
                  {...props}
                  errors={help !== undefined && help !== null ? toArray(help) : errors.value}
                  prefixCls={prefixCls.value}
                  status={validateState.value}
                  onDomErrorVisibleChange={(v: boolean) => (domErrorVisible.value = v)}
                  validateStatus={validateState.value}
                  ref={inputRef}
                  help={help}
                  extra={props.extra ?? slots.extra?.()}
                  v-slots={{ default: slots.default }}
                  // v-slots={{ default: () => [firstChildren, children.slice(1)] }}
                ></FormItemInput>
              </>
            ),
          }}
        ></Row>
      );
    };
  },
});
