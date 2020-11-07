import RawAsyncValidator from 'async-validator';
import { cloneVNode } from 'vue';
import { warning } from '../../vc-util/warning';

import { setValues } from './valueUtil';
import { defaultValidateMessages } from './messages';
import { isValidElement } from '../../_util/props-util';
import { InternalNamePath, RuleObject, ValidateMessages, ValidateOptions } from '../interface';

// Remove incorrect original ts define
const AsyncValidator: any = RawAsyncValidator;

/**
 * Replace with template.
 *   `I'm ${name}` + { name: 'bamboo' } = I'm bamboo
 */
function replaceMessage(template: string, kv: Record<string, string>): string {
  return template.replace(/\$\{\w+\}/g, str => {
    const key = str.slice(2, -1);
    return kv[key];
  });
}

/**
 * We use `async-validator` to validate rules. So have to hot replace the message with validator.
 * { required: '${name} is required' } => { required: () => 'field is required' }
 */
function convertMessages(
  messages: ValidateMessages,
  name: string,
  rule: RuleObject,
  messageVariables?: Record<string, string>,
): ValidateMessages {
  const kv = {
    ...(rule as Record<string, string | number>),
    name,
    enum: (rule.enum || []).join(', '),
  };

  const replaceFunc = (template: string, additionalKV?: Record<string, string>) => () =>
    replaceMessage(template, { ...kv, ...additionalKV });

  /* eslint-disable no-param-reassign */
  function fillTemplate(source: ValidateMessages, target: ValidateMessages = {}) {
    Object.keys(source).forEach(ruleName => {
      const value = source[ruleName];
      if (typeof value === 'string') {
        target[ruleName] = replaceFunc(value, messageVariables);
      } else if (value && typeof value === 'object') {
        target[ruleName] = {};
        fillTemplate(value, target[ruleName]);
      } else {
        target[ruleName] = value;
      }
    });

    return target;
  }
  /* eslint-enable */

  return fillTemplate(setValues({}, defaultValidateMessages, messages)) as ValidateMessages;
}

async function validateRule(
  name: string,
  value: any,
  rule: RuleObject,
  options: ValidateOptions,
  messageVariables?: Record<string, string>,
): Promise<string[]> {
  const cloneRule = { ...rule };
  // We should special handle array validate
  let subRuleField: RuleObject = null;
  if (cloneRule && cloneRule.type === 'array' && cloneRule.defaultField) {
    subRuleField = cloneRule.defaultField;
    delete cloneRule.defaultField;
  }
  if (!rule.type && typeof rule.validator !== 'function' && typeof value !== 'string') {
    warning(
      false,
      `Form rules must provide type property when validating a value which is not string type`,
    );
  }

  const validator = new AsyncValidator({
    [name]: [cloneRule],
  });

  const messages = convertMessages(options.validateMessages, name, cloneRule, messageVariables);
  validator.messages(messages);

  let result = [];

  try {
    await Promise.resolve(validator.validate({ [name]: value }, { ...options }));
  } catch (errObj) {
    if (errObj.errors) {
      result = errObj.errors.map(({ message }, index: number) =>
        // Wrap VueNode with `key`
        isValidElement(message) ? cloneVNode(message, { key: `error_${index}` }) : message,
      );
    } else {
      console.error(errObj);
      result = [(messages.default as () => string)()];
    }
  }

  if (!result.length && subRuleField) {
    const subResults: string[][] = await Promise.all(
      (value as any[]).map((subValue: any, i: number) =>
        validateRule(`${name}.${i}`, subValue, subRuleField, options, messageVariables),
      ),
    );

    return subResults.reduce((prev, errors) => [...prev, ...errors], []);
  }

  return result;
}

/**
 * We use `async-validator` to validate the value.
 * But only check one value in a time to avoid namePath validate issue.
 */
export function validateRules(
  namePath: InternalNamePath,
  value: any,
  rules: RuleObject[],
  options: ValidateOptions,
  validateFirst: boolean | 'parallel',
  messageVariables?: Record<string, string>,
) {
  const name = namePath.join('.');

  // Fill rule with context
  const filledRules: RuleObject[] = rules.map(currentRule => {
    const originValidatorFunc = currentRule.validator;

    if (!originValidatorFunc) {
      return currentRule;
    }
    return {
      ...currentRule,
      validator(rule: RuleObject, val: any, callback: (error?: string) => void) {
        let hasPromise = false;

        // Wrap callback only accept when promise not provided
        const wrappedCallback = (...args: string[]) => {
          // Wait a tick to make sure return type is a promise
          Promise.resolve().then(() => {
            warning(
              !hasPromise,
              'Your validator function has already return a promise. `callback` will be ignored.',
            );

            if (!hasPromise) {
              callback(...args);
            }
          });
        };

        // Get promise
        const promise = originValidatorFunc(rule, val, wrappedCallback);
        hasPromise =
          promise && typeof promise.then === 'function' && typeof promise.catch === 'function';

        /**
         * 1. Use promise as the first priority.
         * 2. If promise not exist, use callback with warning instead
         */
        warning(hasPromise, '`callback` is deprecated. Please return a promise instead.');

        if (hasPromise) {
          (promise as Promise<void>)
            .then(() => {
              callback();
            })
            .catch(err => {
              callback(err);
            });
        }
      },
    };
  });

  let summaryPromise: Promise<string[]>;

  if (validateFirst === true) {
    // >>>>> Validate by serialization
    summaryPromise = new Promise(async resolve => {
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < filledRules.length; i += 1) {
        const errors = await validateRule(name, value, filledRules[i], options, messageVariables);
        if (errors.length) {
          resolve(errors);
          return;
        }
      }
      /* eslint-enable */

      resolve([]);
    });
  } else {
    // >>>>> Validate by parallel
    const rulePromises = filledRules.map(rule =>
      validateRule(name, value, rule, options, messageVariables),
    );

    summaryPromise = (validateFirst
      ? finishOnFirstFailed(rulePromises)
      : finishOnAllFailed(rulePromises)
    ).then((errors: string[]): string[] | Promise<string[]> => {
      if (!errors.length) {
        return [];
      }

      return Promise.reject<string[]>(errors);
    });
  }

  // Internal catch error to avoid console error log.
  summaryPromise.catch(e => e);

  return summaryPromise;
}

async function finishOnAllFailed(rulePromises: Promise<string[]>[]): Promise<string[]> {
  return Promise.all(rulePromises).then(errorsList => {
    const errors = [].concat(...errorsList);

    return errors;
  });
}

async function finishOnFirstFailed(rulePromises: Promise<string[]>[]): Promise<string[]> {
  let count = 0;

  return new Promise(resolve => {
    rulePromises.forEach(promise => {
      promise.then(errors => {
        if (errors.length) {
          resolve(errors);
        }

        count += 1;
        if (count === rulePromises.length) {
          resolve([]);
        }
      });
    });
  });
}
