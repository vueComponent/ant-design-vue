import type { PropType, ExtractPropTypes, HTMLAttributes } from 'vue';
import { defineComponent, computed, watch, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import warning from '../_util/warning';
import type { FieldExpose } from './FormItem';
import FormItem from './FormItem';
import { getNamePath, containsNamePath } from './utils/valueUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
import { toArray } from './utils/typeUtil';
import isEqual from 'lodash-es/isEqual';
import type { Options } from 'scroll-into-view-if-needed';
import scrollIntoView from 'scroll-into-view-if-needed';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { VueNode } from '../_util/type';
import { tuple } from '../_util/type';
import type { ColProps } from '../grid/Col';
import type {
  InternalNamePath,
  NamePath,
  RuleError,
  ValidateErrorEntity,
  ValidateOptions,
  Callbacks,
} from './interface';
import { useInjectSize } from '../_util/hooks/useSize';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useProvideForm } from './context';
import type { SizeType } from '../config-provider';
import useForm from './useForm';

export type RequiredMark = boolean | 'optional';
export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export type ValidationRule = {
  /** validation error message */
  message?: VueNode;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: string;
  /** indicates whether field is required */
  required?: boolean;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** validate the exact length of a field */
  len?: number;
  /** validate the min length of a field */
  min?: number;
  /** validate the max length of a field */
  max?: number;
  /** validate the value from a list of possible values */
  enum?: string | string[];
  /** validate from a regular expression */
  pattern?: RegExp;
  /** transform a value before validation */
  transform?: (value: any) => any;
  /** custom validate function (Note: callback must be called) */
  validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;

  trigger?: string;
};

export const formProps = {
  layout: PropTypes.oneOf(tuple('horizontal', 'inline', 'vertical')),
  labelCol: { type: Object as PropType<ColProps & HTMLAttributes> },
  wrapperCol: { type: Object as PropType<ColProps & HTMLAttributes> },
  colon: PropTypes.looseBool,
  labelAlign: PropTypes.oneOf(tuple('left', 'right')),
  prefixCls: PropTypes.string,
  requiredMark: { type: [String, Boolean] as PropType<RequiredMark | ''>, default: undefined },
  /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
  hideRequiredMark: PropTypes.looseBool,
  model: PropTypes.object,
  rules: { type: Object as PropType<{ [k: string]: ValidationRule[] | ValidationRule }> },
  validateMessages: PropTypes.object,
  validateOnRuleChange: PropTypes.looseBool,
  // 提交失败自动滚动到第一个错误字段
  scrollToFirstError: { type: [Boolean, Object] as PropType<boolean | Options> },
  onSubmit: PropTypes.func,
  name: PropTypes.string,
  validateTrigger: { type: [String, Array] as PropType<string | string[]> },
  size: { type: String as PropType<SizeType> },
  onValuesChange: { type: Function as PropType<Callbacks['onValuesChange']> },
  onFieldsChange: { type: Function as PropType<Callbacks['onFieldsChange']> },
  onFinish: { type: Function as PropType<Callbacks['onFinish']> },
  onFinishFailed: { type: Function as PropType<Callbacks['onFinishFailed']> },
};

export type FormProps = Partial<ExtractPropTypes<typeof formProps>>;

function isEqualName(name1: NamePath, name2: NamePath) {
  return isEqual(toArray(name1), toArray(name2));
}

const Form = defineComponent({
  name: 'AForm',
  inheritAttrs: false,
  props: initDefaultProps(formProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true,
  }),
  Item: FormItem,
  useForm,
  emits: ['finishFailed', 'submit', 'finish'],
  setup(props, { emit, slots, expose, attrs }) {
    const size = useInjectSize(props);
    const { prefixCls, direction, form: contextForm } = useConfigInject('form', props);
    const requiredMark = computed(() => props.requiredMark === '' || props.requiredMark);
    const mergedRequiredMark = computed(() => {
      if (requiredMark.value !== undefined) {
        return requiredMark.value;
      }

      if (contextForm && contextForm.value?.requiredMark !== undefined) {
        return contextForm.value.requiredMark;
      }

      if (props.hideRequiredMark) {
        return false;
      }
      return true;
    });

    const formClassName = computed(() =>
      classNames(prefixCls.value, {
        [`${prefixCls.value}-${props.layout}`]: true,
        [`${prefixCls.value}-hide-required-mark`]: mergedRequiredMark.value === false,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-${size.value}`]: size.value,
      }),
    );
    const lastValidatePromise = ref();
    const fields: Record<string, FieldExpose> = {};

    const addField = (eventKey: string, field: FieldExpose) => {
      fields[eventKey] = field;
    };
    const removeField = (eventKey: string) => {
      delete fields[eventKey];
    };

    const getFieldsByNameList = (nameList: NamePath) => {
      const provideNameList = !!nameList;
      const namePathList = provideNameList ? toArray(nameList).map(getNamePath) : [];
      if (!provideNameList) {
        return Object.values(fields);
      } else {
        return Object.values(fields).filter(
          field =>
            namePathList.findIndex(namePath => isEqualName(namePath, field.fieldName.value)) > -1,
        );
      }
    };
    const resetFields = (name: NamePath) => {
      if (!props.model) {
        warning(false, 'Form', 'model is required for resetFields to work.');
        return;
      }
      getFieldsByNameList(name).forEach(field => {
        field.resetField();
      });
    };
    const clearValidate = (name: NamePath) => {
      getFieldsByNameList(name).forEach(field => {
        field.clearValidate();
      });
    };
    const handleFinishFailed = (errorInfo: ValidateErrorEntity) => {
      const { scrollToFirstError } = props;
      emit('finishFailed', errorInfo);
      if (scrollToFirstError && errorInfo.errorFields.length) {
        let scrollToFieldOptions: Options = {};
        if (typeof scrollToFirstError === 'object') {
          scrollToFieldOptions = scrollToFirstError;
        }
        scrollToField(errorInfo.errorFields[0].name, scrollToFieldOptions);
      }
    };
    const validate = (...args: any[]) => {
      return validateField(...args);
    };
    const scrollToField = (name: NamePath, options = {}) => {
      const fields = getFieldsByNameList(name);
      if (fields.length) {
        const fieldId = fields[0].fieldId.value;
        const node = fieldId ? document.getElementById(fieldId) : null;

        if (node) {
          scrollIntoView(node, {
            scrollMode: 'if-needed',
            block: 'nearest',
            ...options,
          });
        }
      }
    };
    // eslint-disable-next-line no-unused-vars
    const getFieldsValue = (nameList: NamePath[] | true = true) => {
      const values: any = {};
      Object.values(fields).forEach(({ fieldName, fieldValue }) => {
        values[fieldName.value] = fieldValue.value;
      });
      if (nameList === true) {
        return values;
      } else {
        const res: any = {};
        toArray(nameList as NamePath[]).forEach(
          namePath => (res[namePath as string] = values[namePath as string]),
        );
        return res;
      }
    };
    const validateFields = (nameList?: NamePath[], options?: ValidateOptions) => {
      warning(
        !(nameList instanceof Function),
        'Form',
        'validateFields/validateField/validate not support callback, please use promise instead',
      );
      if (!props.model) {
        warning(false, 'Form', 'model is required for validateFields to work.');
        return Promise.reject('Form `model` is required for validateFields to work.');
      }
      const provideNameList = !!nameList;
      const namePathList: InternalNamePath[] = provideNameList
        ? toArray(nameList).map(getNamePath)
        : [];

      // Collect result in promise list
      const promiseList: Promise<{
        name: InternalNamePath;
        errors: string[];
      }>[] = [];

      Object.values(fields).forEach(field => {
        // Add field if not provide `nameList`
        if (!provideNameList) {
          namePathList.push(field.namePath.value);
        }

        // Skip if without rule
        if (!field.rules?.value.length) {
          return;
        }

        const fieldNamePath = field.namePath.value;

        // Add field validate rule in to promise list
        if (!provideNameList || containsNamePath(namePathList, fieldNamePath)) {
          const promise = field.validateRules({
            validateMessages: {
              ...defaultValidateMessages,
              ...props.validateMessages,
            },
            ...options,
          });

          // Wrap promise with field
          promiseList.push(
            promise
              .then<any, RuleError>(() => ({ name: fieldNamePath, errors: [], warnings: [] }))
              .catch((ruleErrors: RuleError[]) => {
                const mergedErrors: string[] = [];
                const mergedWarnings: string[] = [];

                ruleErrors.forEach(({ rule: { warningOnly }, errors }) => {
                  if (warningOnly) {
                    mergedWarnings.push(...errors);
                  } else {
                    mergedErrors.push(...errors);
                  }
                });

                if (mergedErrors.length) {
                  return Promise.reject({
                    name: fieldNamePath,
                    errors: mergedErrors,
                    warnings: mergedWarnings,
                  });
                }

                return {
                  name: fieldNamePath,
                  errors: mergedErrors,
                  warnings: mergedWarnings,
                };
              }),
          );
        }
      });

      const summaryPromise = allPromiseFinish(promiseList);
      lastValidatePromise.value = summaryPromise;

      const returnPromise = summaryPromise
        .then(() => {
          if (lastValidatePromise.value === summaryPromise) {
            return Promise.resolve(getFieldsValue(namePathList));
          }
          return Promise.reject([]);
        })
        .catch(results => {
          const errorList = results.filter(result => result && result.errors.length);
          return Promise.reject({
            values: getFieldsValue(namePathList),
            errorFields: errorList,
            outOfDate: lastValidatePromise.value !== summaryPromise,
          });
        });

      // Do not throw in console
      returnPromise.catch(e => e);

      return returnPromise;
    };
    const validateField = (...args: any[]) => {
      return validateFields(...args);
    };

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      emit('submit', e);
      if (props.model) {
        const res = validateFields();
        res
          .then(values => {
            emit('finish', values);
          })
          .catch(errors => {
            handleFinishFailed(errors);
          });
      }
    };

    expose({
      resetFields,
      clearValidate,
      validateFields,
      getFieldsValue,
      validate,
      scrollToField,
    });

    useProvideForm({
      model: computed(() => props.model),
      name: computed(() => props.name),
      labelAlign: computed(() => props.labelAlign),
      labelCol: computed(() => props.labelCol),
      wrapperCol: computed(() => props.wrapperCol),
      vertical: computed(() => props.layout === 'vertical'),
      colon: computed(() => props.colon),
      requiredMark: mergedRequiredMark,
      validateTrigger: computed(() => props.validateTrigger),
      rules: computed(() => props.rules),
      addField,
      removeField,
    });

    watch(
      () => props.rules,
      () => {
        if (props.validateOnRuleChange) {
          validateFields();
        }
      },
    );

    return () => {
      return (
        <form {...attrs} onSubmit={handleSubmit} class={[formClassName.value, attrs.class]}>
          {slots.default?.()}
        </form>
      );
    };
  },
});

export default Form as typeof Form & {
  readonly Item: typeof FormItem;
  readonly useForm: typeof useForm;
};
