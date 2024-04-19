import type { Ref } from 'vue';
import { reactive, watch, nextTick, unref, shallowRef, toRaw, ref } from 'vue';
import cloneDeep from 'lodash-es/cloneDeep';
import intersection from 'lodash-es/intersection';
import isEqual from 'lodash-es/isEqual';
import debounce from 'lodash-es/debounce';
import omit from 'lodash-es/omit';
import { validateRules } from './utils/validateUtil';
import { defaultValidateMessages } from './utils/messages';
import { allPromiseFinish } from './utils/asyncUtil';
import type { Callbacks, RuleError, ValidateMessages } from './interface';
import type { ValidateStatus } from './FormItem';

interface DebounceSettings {
  leading?: boolean;

  wait?: number;

  trailing?: boolean;
}

function isRequired(rules: any[]) {
  let isRequired = false;
  if (rules && rules.length) {
    rules.every((rule: { required: any }) => {
      if (rule.required) {
        isRequired = true;
        return false;
      }
      return true;
    });
  }
  return isRequired;
}

function toArray(value: string | string[]) {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export interface Props {
  [key: string]: any;
}

export interface validateOptions {
  validateFirst?: boolean;
  validateMessages?: ValidateMessages;
  trigger?: 'change' | 'blur' | string | string[];
}

type namesType = string | string[];
export interface ValidateInfo {
  autoLink?: boolean;
  required?: boolean;
  validateStatus?: ValidateStatus;
  help?: any;
}

export interface validateInfos {
  [key: string]: ValidateInfo;
}

function getPropByPath(obj: Props, path: string, strict: boolean) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  const keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid name path to validate!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null,
    isValid: tempObj && keyArr[i] in tempObj,
  };
}

function useForm(
  modelRef: Props | Ref<Props>,
  rulesRef: Props | Ref<Props> = ref({}),
  options?: {
    immediate?: boolean;
    deep?: boolean;
    validateOnRuleChange?: boolean;
    debounce?: DebounceSettings;
    onValidate?: Callbacks['onValidate'];
  },
): {
  modelRef: Props | Ref<Props>;
  rulesRef: Props | Ref<Props>;
  initialModel: Props;
  validateInfos: validateInfos;
  resetFields: (newValues?: Props) => void;
  validate: <T = any>(names?: namesType, option?: validateOptions) => Promise<T>;

  /** This is an internal usage. Do not use in your prod */
  validateField: (
    name: string,
    value: any,
    rules: Record<string, unknown>[],
    option?: validateOptions,
  ) => Promise<RuleError[]>;
  mergeValidateInfo: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo;
  clearValidate: (names?: namesType) => void;
} {
  const initialModel = cloneDeep(unref(modelRef));
  const validateInfos = reactive<validateInfos>({});

  const rulesKeys = shallowRef([]);

  const resetFields = (newValues: Props) => {
    Object.assign(unref(modelRef), {
      ...cloneDeep(initialModel),
      ...newValues,
    });
    nextTick(() => {
      Object.keys(validateInfos).forEach(key => {
        validateInfos[key] = {
          autoLink: false,
          required: isRequired(unref(rulesRef)[key]),
        };
      });
    });
  };
  const filterRules = (rules = [], trigger: string[]) => {
    if (!trigger.length) {
      return rules;
    } else {
      return rules.filter(rule => {
        const triggerList = toArray(rule.trigger || 'change');
        return intersection(triggerList, trigger).length;
      });
    }
  };

  let lastValidatePromise = null;
  const validateFields = (names: string[], option: validateOptions = {}, strict: boolean) => {
    // Collect result in promise list
    const promiseList: Promise<{
      name: string;
      errors: string[];
    }>[] = [];
    const values = {};
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const prop = getPropByPath(unref(modelRef), name, strict);
      if (!prop.isValid) continue;
      values[name] = prop.v;
      const rules = filterRules(unref(rulesRef)[name], toArray(option && option.trigger));
      if (rules.length) {
        promiseList.push(
          validateField(name, prop.v, rules, option || {})
            .then(() => ({
              name,
              errors: [],
              warnings: [],
            }))
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
                  name,
                  errors: mergedErrors,
                  warnings: mergedWarnings,
                });
              }

              return {
                name,
                errors: mergedErrors,
                warnings: mergedWarnings,
              };
            }),
        );
      }
    }

    const summaryPromise = allPromiseFinish(promiseList);
    lastValidatePromise = summaryPromise;

    const returnPromise = summaryPromise
      .then(() => {
        if (lastValidatePromise === summaryPromise) {
          return Promise.resolve(values);
        }
        return Promise.reject([]);
      })
      .catch((results: any[]) => {
        const errorList = results.filter(
          (result: { errors: string | any[] }) => result && result.errors.length,
        );
        return errorList.length
          ? Promise.reject({
              values,
              errorFields: errorList,
              outOfDate: lastValidatePromise !== summaryPromise,
            })
          : Promise.resolve(values);
      });

    // Do not throw in console
    returnPromise.catch((e: any) => e);

    return returnPromise;
  };
  const validateField = (
    name: string,
    value: any,
    rules: Record<string, unknown>[],
    option: validateOptions = {},
  ): Promise<RuleError[]> => {
    const promise = validateRules(
      [name],
      value,
      rules,
      {
        validateMessages: defaultValidateMessages,
        ...option,
      },
      !!option.validateFirst,
    );
    if (!validateInfos[name]) {
      return promise.catch((e: any) => e);
    }
    validateInfos[name].validateStatus = 'validating';
    promise
      .catch((e: any) => e)
      .then((results: RuleError[] = []) => {
        if (validateInfos[name].validateStatus === 'validating') {
          const res = results.filter(result => result && result.errors.length);
          validateInfos[name].validateStatus = res.length ? 'error' : 'success';
          validateInfos[name].help = res.length ? res.map(r => r.errors) : null;
          options?.onValidate?.(
            name,
            !res.length,
            res.length ? toRaw(validateInfos[name].help[0]) : null,
          );
        }
      });
    return promise;
  };

  const validate = (names?: namesType, option?: validateOptions): Promise<any> => {
    let keys = [];
    let strict = true;
    if (!names) {
      strict = false;
      keys = rulesKeys.value;
    } else if (Array.isArray(names)) {
      keys = names;
    } else {
      keys = [names];
    }
    const promises = validateFields(keys, option || {}, strict);
    // Do not throw in console
    promises.catch((e: any) => e);
    return promises;
  };

  const clearValidate = (names?: namesType) => {
    let keys = [];
    if (!names) {
      keys = rulesKeys.value;
    } else if (Array.isArray(names)) {
      keys = names;
    } else {
      keys = [names];
    }
    keys.forEach(key => {
      validateInfos[key] &&
        Object.assign(validateInfos[key], {
          validateStatus: '',
          help: null,
        });
    });
  };

  const mergeValidateInfo = (items: ValidateInfo[] | ValidateInfo) => {
    const info = { autoLink: false } as ValidateInfo;
    const help = [];
    const infos = Array.isArray(items) ? items : [items];
    for (let i = 0; i < infos.length; i++) {
      const arg = infos[i] as ValidateInfo;
      if (arg?.validateStatus === 'error') {
        info.validateStatus = 'error';
        arg.help && help.push(arg.help);
      }
      info.required = info.required || arg?.required;
    }
    info.help = help;
    return info;
  };
  let oldModel = initialModel;
  let isFirstTime = true;
  const modelFn = (model: { [x: string]: any }) => {
    const names = [];
    rulesKeys.value.forEach(key => {
      const prop = getPropByPath(model, key, false);
      const oldProp = getPropByPath(oldModel, key, false);
      const isFirstValidation = isFirstTime && options?.immediate && prop.isValid;

      if (isFirstValidation || !isEqual(prop.v, oldProp.v)) {
        names.push(key);
      }
    });
    validate(names, { trigger: 'change' });
    isFirstTime = false;
    oldModel = cloneDeep(toRaw(model));
  };

  const debounceOptions = options?.debounce;

  let first = true;
  watch(
    rulesRef,
    () => {
      rulesKeys.value = rulesRef ? Object.keys(unref(rulesRef)) : [];
      if (!first && options && options.validateOnRuleChange) {
        validate();
      }
      first = false;
    },
    { deep: true, immediate: true },
  );

  watch(
    rulesKeys,
    () => {
      const newValidateInfos = {};
      rulesKeys.value.forEach(key => {
        newValidateInfos[key] = Object.assign({}, validateInfos[key], {
          autoLink: false,
          required: isRequired(unref(rulesRef)[key]),
        });
        delete validateInfos[key];
      });
      for (const key in validateInfos) {
        if (Object.prototype.hasOwnProperty.call(validateInfos, key)) {
          delete validateInfos[key];
        }
      }
      Object.assign(validateInfos, newValidateInfos);
    },
    { immediate: true },
  );
  watch(
    modelRef,
    debounceOptions && debounceOptions.wait
      ? debounce(modelFn, debounceOptions.wait, omit(debounceOptions, ['wait']))
      : modelFn,
    { immediate: options && !!options.immediate, deep: true },
  );

  return {
    modelRef,
    rulesRef,
    initialModel,
    validateInfos,
    resetFields,
    validate,
    validateField,
    mergeValidateInfo,
    clearValidate,
  };
}

export default useForm;
