import AsyncValidator from 'async-validator';
import warning from 'warning';
import get from 'lodash/get';
import set from 'lodash/set';
import eq from 'lodash/eq';
import omit from 'lodash/omit';
import createFieldsStore from './createFieldsStore';
import { cloneElement } from '../../_util/vnode';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, getEvents, slotHasProp, getComponentName } from '../../_util/props-util';
import PropTypes from '../../_util/vue-types';

import {
  argumentContainer,
  identity,
  normalizeValidateRules,
  getValidateTriggers,
  getValueFromEvent,
  hasRules,
  getParams,
  isEmptyObject,
  flattenArray,
} from './utils';

const DEFAULT_TRIGGER = 'change';

function createBaseForm(option = {}, mixins = []) {
  const {
    validateMessages,
    onFieldsChange,
    onValuesChange,
    mapProps = identity,
    mapPropsToFields,
    fieldNameProp,
    fieldMetaProp,
    fieldDataProp,
    formPropName = 'form',
    name: formName,
    props = {},
    templateContext,
  } = option;
  return function decorate(WrappedComponent) {
    let formProps = {};
    if (Array.isArray(props)) {
      props.forEach(prop => {
        formProps[prop] = PropTypes.any;
      });
    } else {
      formProps = props;
    }
    const Form = {
      mixins: [BaseMixin, ...mixins],
      props: {
        ...formProps,
        wrappedComponentRef: PropTypes.func.def(() => {}),
      },
      data() {
        const fields = mapPropsToFields && mapPropsToFields(this.$props);
        this.fieldsStore = createFieldsStore(fields || {});
        this.templateContext = templateContext;
        this.instances = {};
        this.cachedBind = {};
        this.clearedFieldMetaCache = {};
        this.formItems = {};
        this.renderFields = {};
        this.domFields = {};

        // HACK: https://github.com/ant-design/ant-design/issues/6406
        [
          'getFieldsValue',
          'getFieldValue',
          'setFieldsInitialValue',
          'getFieldsError',
          'getFieldError',
          'isFieldValidating',
          'isFieldsValidating',
          'isFieldsTouched',
          'isFieldTouched',
        ].forEach(key => {
          this[key] = (...args) => {
            return this.fieldsStore[key](...args);
          };
        });

        return {
          submitting: false,
        };
      },
      watch: templateContext
        ? {}
        : {
            $props: {
              handler: function(nextProps) {
                if (mapPropsToFields) {
                  this.fieldsStore.updateFields(mapPropsToFields(nextProps));
                }
              },
              deep: true,
            },
          },
      mounted() {
        this.cleanUpUselessFields();
      },
      updated() {
        // form updated add for template v-decorator
        this.cleanUpUselessFields();
      },
      methods: {
        updateFields(fields = {}) {
          this.fieldsStore.updateFields(mapPropsToFields(fields));
          if (templateContext) {
            templateContext.$forceUpdate();
          }
        },
        onCollectCommon(name, action, args) {
          const fieldMeta = this.fieldsStore.getFieldMeta(name);
          if (fieldMeta[action]) {
            fieldMeta[action](...args);
          } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
            fieldMeta.originalProps[action](...args);
          }
          const value = fieldMeta.getValueFromEvent
            ? fieldMeta.getValueFromEvent(...args)
            : getValueFromEvent(...args);
          if (onValuesChange && value !== this.fieldsStore.getFieldValue(name)) {
            const valuesAll = this.fieldsStore.getAllValues();
            const valuesAllSet = {};
            valuesAll[name] = value;
            Object.keys(valuesAll).forEach(key => set(valuesAllSet, key, valuesAll[key]));
            onValuesChange(
              {
                [formPropName]: this.getForm(),
                ...this.$props,
              },
              set({}, name, value),
              valuesAllSet,
            );
          }
          const field = this.fieldsStore.getField(name);
          return { name, field: { ...field, value, touched: true }, fieldMeta };
        },

        onCollect(name_, action, ...args) {
          const { name, field, fieldMeta } = this.onCollectCommon(name_, action, args);
          const { validate } = fieldMeta;
          this.fieldsStore.setFieldsAsDirty();
          const newField = {
            ...field,
            dirty: hasRules(validate),
          };
          this.setFields({
            [name]: newField,
          });
        },

        onCollectValidate(name_, action, ...args) {
          const { field, fieldMeta } = this.onCollectCommon(name_, action, args);
          const newField = {
            ...field,
            dirty: true,
          };
          this.fieldsStore.setFieldsAsDirty();
          this.validateFieldsInternal([newField], {
            action,
            options: {
              firstFields: !!fieldMeta.validateFirst,
            },
          });
        },

        getCacheBind(name, action, fn) {
          if (!this.cachedBind[name]) {
            this.cachedBind[name] = {};
          }
          const cache = this.cachedBind[name];
          if (!cache[action] || cache[action].oriFn !== fn) {
            cache[action] = {
              fn: fn.bind(this, name, action),
              oriFn: fn,
            };
          }
          return cache[action].fn;
        },

        getFieldDecorator(name, fieldOption, formItem) {
          const { props, ...restProps } = this.getFieldProps(name, fieldOption);
          this.formItems[name] = formItem;
          return fieldElem => {
            // We should put field in record if it is rendered
            this.renderFields[name] = true;

            const fieldMeta = this.fieldsStore.getFieldMeta(name);
            const originalProps = getOptionProps(fieldElem);
            const originalEvents = getEvents(fieldElem);
            if (process.env.NODE_ENV !== 'production') {
              const valuePropName = fieldMeta.valuePropName;
              warning(
                !slotHasProp(fieldElem, valuePropName),
                `\`getFieldDecorator\` will override \`${valuePropName}\`, ` +
                  `so please don't set \`${valuePropName} and v-model\` directly ` +
                  `and use \`setFieldsValue\` to set it.`,
              );
              warning(
                !(
                  !slotHasProp(fieldElem, valuePropName) &&
                  valuePropName in originalProps &&
                  !(fieldOption && 'initialValue' in fieldOption)
                ),
                `${getComponentName(
                  fieldElem.componentOptions,
                )} \`default value\` can not collect, ` +
                  ` please use \`option.initialValue\` to set default value.`,
              );
              const defaultValuePropName = `default${valuePropName[0].toUpperCase()}${valuePropName.slice(
                1,
              )}`;
              warning(
                !slotHasProp(fieldElem, defaultValuePropName),
                `\`${defaultValuePropName}\` is invalid ` +
                  `for \`getFieldDecorator\` will set \`${valuePropName}\`,` +
                  ` please use \`option.initialValue\` instead.`,
              );
            }
            fieldMeta.originalProps = originalProps;
            // fieldMeta.ref = fieldElem.data && fieldElem.data.ref
            const newProps = {
              props: {
                ...props,
                ...this.fieldsStore.getFieldValuePropValue(fieldMeta),
              },
              ...restProps,
            };
            newProps.domProps.value = newProps.props.value;
            const newEvents = {};
            Object.keys(newProps.on).forEach(key => {
              if (originalEvents[key]) {
                const triggerEvents = newProps.on[key];
                newEvents[key] = (...args) => {
                  originalEvents[key](...args);
                  triggerEvents(...args);
                };
              } else {
                newEvents[key] = newProps.on[key];
              }
            });
            return cloneElement(fieldElem, { ...newProps, on: newEvents });
          };
        },

        getFieldProps(name, usersFieldOption = {}) {
          if (!name) {
            throw new Error('Must call `getFieldProps` with valid name string!');
          }
          if (process.env.NODE_ENV !== 'production') {
            warning(
              this.fieldsStore.isValidNestedFieldName(name),
              `One field name cannot be part of another, e.g. \`a\` and \`a.b\`. Check field: ${name}`,
            );
            warning(
              !('exclusive' in usersFieldOption),
              '`option.exclusive` of `getFieldProps`|`getFieldDecorator` had been remove.',
            );
          }

          delete this.clearedFieldMetaCache[name];

          const fieldOption = {
            name,
            trigger: DEFAULT_TRIGGER,
            valuePropName: 'value',
            validate: [],
            ...usersFieldOption,
          };

          const { rules, trigger, validateTrigger = trigger, validate } = fieldOption;

          const fieldMeta = this.fieldsStore.getFieldMeta(name);
          if ('initialValue' in fieldOption) {
            fieldMeta.initialValue = fieldOption.initialValue;
          }

          const inputProps = {
            ...this.fieldsStore.getFieldValuePropValue(fieldOption),
            // ref: name,
          };
          const inputListeners = {};
          const inputAttrs = {};
          if (fieldNameProp) {
            inputProps[fieldNameProp] = formName ? `${formName}_${name}` : name;
          }

          const validateRules = normalizeValidateRules(validate, rules, validateTrigger);
          const validateTriggers = getValidateTriggers(validateRules);
          validateTriggers.forEach(action => {
            if (inputListeners[action]) return;
            inputListeners[action] = this.getCacheBind(name, action, this.onCollectValidate);
          });

          // make sure that the value will be collect
          if (trigger && validateTriggers.indexOf(trigger) === -1) {
            inputListeners[trigger] = this.getCacheBind(name, trigger, this.onCollect);
          }

          const meta = {
            ...fieldMeta,
            ...fieldOption,
            validate: validateRules,
          };
          this.fieldsStore.setFieldMeta(name, meta);
          if (fieldMetaProp) {
            inputAttrs[fieldMetaProp] = meta;
          }

          if (fieldDataProp) {
            inputAttrs[fieldDataProp] = this.fieldsStore.getField(name);
          }
          // This field is rendered, record it
          this.renderFields[name] = true;
          return {
            props: omit(inputProps, ['id']),
            // id: inputProps.id,
            domProps: {
              value: inputProps.value,
            },
            attrs: {
              ...inputAttrs,
              id: inputProps.id,
            },
            directives: [
              {
                name: 'ant-ref',
                value: this.getCacheBind(name, `${name}__ref`, this.saveRef),
              },
            ],
            on: inputListeners,
          };
        },

        getFieldInstance(name) {
          return this.instances[name];
        },

        getRules(fieldMeta, action) {
          const actionRules = fieldMeta.validate
            .filter(item => {
              return !action || item.trigger.indexOf(action) >= 0;
            })
            .map(item => item.rules);
          return flattenArray(actionRules);
        },

        setFields(maybeNestedFields, callback) {
          const fields = this.fieldsStore.flattenRegisteredFields(maybeNestedFields);
          this.fieldsStore.setFields(fields);
          const changedFields = Object.keys(fields).reduce(
            (acc, name) => set(acc, name, this.fieldsStore.getField(name)),
            {},
          );
          if (onFieldsChange) {
            const changedFields = Object.keys(fields).reduce(
              (acc, name) => set(acc, name, this.fieldsStore.getField(name)),
              {},
            );
            onFieldsChange(this, changedFields, this.fieldsStore.getNestedAllFields());
          }
          const formContext = templateContext || this;
          let allUpdate = false;
          Object.keys(changedFields).forEach(key => {
            let formItem = this.formItems[key];
            formItem = typeof formItem === 'function' ? formItem() : formItem;
            if (formItem && formItem.itemSelfUpdate) {
              formItem.$forceUpdate();
            } else {
              allUpdate = true;
            }
          });
          if (allUpdate) {
            formContext.$forceUpdate();
          }
          this.$nextTick(() => {
            callback && callback();
          });
        },

        setFieldsValue(changedValues, callback) {
          const { fieldsMeta } = this.fieldsStore;
          const values = this.fieldsStore.flattenRegisteredFields(changedValues);
          const newFields = Object.keys(values).reduce((acc, name) => {
            const isRegistered = fieldsMeta[name];
            if (process.env.NODE_ENV !== 'production') {
              warning(
                isRegistered,
                'Cannot use `setFieldsValue` until ' +
                  'you use `getFieldDecorator` or `getFieldProps` to register it.',
              );
            }
            if (isRegistered) {
              const value = values[name];
              acc[name] = {
                value,
              };
            }
            return acc;
          }, {});
          this.setFields(newFields, callback);
          if (onValuesChange) {
            const allValues = this.fieldsStore.getAllValues();
            onValuesChange(
              {
                [formPropName]: this.getForm(),
                ...this.$props,
              },
              changedValues,
              allValues,
            );
          }
        },

        saveRef(name, _, component) {
          if (!component) {
            const fieldMeta = this.fieldsStore.getFieldMeta(name);
            if (!fieldMeta.preserve) {
              // after destroy, delete data
              this.clearedFieldMetaCache[name] = {
                field: this.fieldsStore.getField(name),
                meta: fieldMeta,
              };
              this.clearField(name);
            }
            delete this.domFields[name];
            return;
          }
          this.domFields[name] = true;
          this.recoverClearedField(name);
          // const fieldMeta = this.fieldsStore.getFieldMeta(name)
          // if (fieldMeta) {
          //   const ref = fieldMeta.ref
          //   if (ref) {
          //     if (typeof ref === 'string') {
          //       throw new Error(`can not set ref string for ${name}`)
          //     }
          //     ref(component)
          //   }
          // }
          this.instances[name] = component;
        },

        cleanUpUselessFields() {
          const fieldList = this.fieldsStore.getAllFieldsName();
          const removedList = fieldList.filter(field => {
            const fieldMeta = this.fieldsStore.getFieldMeta(field);
            return !this.renderFields[field] && !this.domFields[field] && !fieldMeta.preserve;
          });
          if (removedList.length) {
            removedList.forEach(this.clearField);
          }
          this.renderFields = {};
        },

        clearField(name) {
          this.fieldsStore.clearField(name);
          delete this.instances[name];
          delete this.cachedBind[name];
        },

        resetFields(ns) {
          const newFields = this.fieldsStore.resetFields(ns);
          if (Object.keys(newFields).length > 0) {
            this.setFields(newFields);
          }
          if (ns) {
            const names = Array.isArray(ns) ? ns : [ns];
            names.forEach(name => delete this.clearedFieldMetaCache[name]);
          } else {
            this.clearedFieldMetaCache = {};
          }
        },

        recoverClearedField(name) {
          if (this.clearedFieldMetaCache[name]) {
            this.fieldsStore.setFields({
              [name]: this.clearedFieldMetaCache[name].field,
            });
            this.fieldsStore.setFieldMeta(name, this.clearedFieldMetaCache[name].meta);
            delete this.clearedFieldMetaCache[name];
          }
        },

        validateFieldsInternal(fields, { fieldNames, action, options = {} }, callback) {
          const allRules = {};
          const allValues = {};
          const allFields = {};
          const alreadyErrors = {};
          fields.forEach(field => {
            const name = field.name;
            if (options.force !== true && field.dirty === false) {
              if (field.errors) {
                set(alreadyErrors, name, { errors: field.errors });
              }
              return;
            }
            const fieldMeta = this.fieldsStore.getFieldMeta(name);
            const newField = {
              ...field,
            };
            newField.errors = undefined;
            newField.validating = true;
            newField.dirty = true;
            allRules[name] = this.getRules(fieldMeta, action);
            allValues[name] = newField.value;
            allFields[name] = newField;
          });
          this.setFields(allFields);
          // in case normalize
          Object.keys(allValues).forEach(f => {
            allValues[f] = this.fieldsStore.getFieldValue(f);
          });
          if (callback && isEmptyObject(allFields)) {
            callback(
              isEmptyObject(alreadyErrors) ? null : alreadyErrors,
              this.fieldsStore.getFieldsValue(fieldNames),
            );
            return;
          }
          const validator = new AsyncValidator(allRules);
          if (validateMessages) {
            validator.messages(validateMessages);
          }
          validator.validate(allValues, options, errors => {
            const errorsGroup = {
              ...alreadyErrors,
            };
            if (errors && errors.length) {
              errors.forEach(e => {
                const errorFieldName = e.field;
                let fieldName = errorFieldName;

                // Handle using array validation rule.
                // ref: https://github.com/ant-design/ant-design/issues/14275
                Object.keys(allRules).some(ruleFieldName => {
                  const rules = allRules[ruleFieldName] || [];

                  // Exist if match rule
                  if (ruleFieldName === errorFieldName) {
                    fieldName = ruleFieldName;
                    return true;
                  }

                  // Skip if not match array type
                  if (
                    rules.every(({ type }) => type !== 'array') &&
                    errorFieldName.indexOf(ruleFieldName) !== 0
                  ) {
                    return false;
                  }

                  // Exist if match the field name
                  const restPath = errorFieldName.slice(ruleFieldName.length + 1);
                  if (/^\d+$/.test(restPath)) {
                    fieldName = ruleFieldName;
                    return true;
                  }

                  return false;
                });

                const field = get(errorsGroup, fieldName);
                if (typeof field !== 'object' || Array.isArray(field)) {
                  set(errorsGroup, fieldName, { errors: [] });
                }
                const fieldErrors = get(errorsGroup, fieldName.concat('.errors'));
                fieldErrors.push(e);
              });
            }
            const expired = [];
            const nowAllFields = {};
            Object.keys(allRules).forEach(name => {
              const fieldErrors = get(errorsGroup, name);
              const nowField = this.fieldsStore.getField(name);
              // avoid concurrency problems
              if (!eq(nowField.value, allValues[name])) {
                expired.push({
                  name,
                });
              } else {
                nowField.errors = fieldErrors && fieldErrors.errors;
                nowField.value = allValues[name];
                nowField.validating = false;
                nowField.dirty = false;
                nowAllFields[name] = nowField;
              }
            });
            this.setFields(nowAllFields);
            if (callback) {
              if (expired.length) {
                expired.forEach(({ name }) => {
                  const fieldErrors = [
                    {
                      message: `${name} need to revalidate`,
                      field: name,
                    },
                  ];
                  set(errorsGroup, name, {
                    expired: true,
                    errors: fieldErrors,
                  });
                });
              }

              callback(
                isEmptyObject(errorsGroup) ? null : errorsGroup,
                this.fieldsStore.getFieldsValue(fieldNames),
              );
            }
          });
        },

        validateFields(ns, opt, cb) {
          const pending = new Promise((resolve, reject) => {
            const { names, options } = getParams(ns, opt, cb);
            let { callback } = getParams(ns, opt, cb);
            if (!callback || typeof callback === 'function') {
              const oldCb = callback;
              callback = (errors, values) => {
                if (oldCb) {
                  oldCb(errors, values);
                } else if (errors) {
                  reject({ errors, values });
                } else {
                  resolve(values);
                }
              };
            }
            const fieldNames = names
              ? this.fieldsStore.getValidFieldsFullName(names)
              : this.fieldsStore.getValidFieldsName();
            const fields = fieldNames
              .filter(name => {
                const fieldMeta = this.fieldsStore.getFieldMeta(name);
                return hasRules(fieldMeta.validate);
              })
              .map(name => {
                const field = this.fieldsStore.getField(name);
                field.value = this.fieldsStore.getFieldValue(name);
                return field;
              });
            if (!fields.length) {
              callback(null, this.fieldsStore.getFieldsValue(fieldNames));
              return;
            }
            if (!('firstFields' in options)) {
              options.firstFields = fieldNames.filter(name => {
                const fieldMeta = this.fieldsStore.getFieldMeta(name);
                return !!fieldMeta.validateFirst;
              });
            }
            this.validateFieldsInternal(
              fields,
              {
                fieldNames,
                options,
              },
              callback,
            );
          });
          pending.catch(e => {
            if (console.error && process.env.NODE_ENV !== 'production') {
              console.error(e);
            }
            return e;
          });
          return pending;
        },

        isSubmitting() {
          if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            warning(
              false,
              '`isSubmitting` is deprecated. ' +
                "Actually, it's more convenient to handle submitting status by yourself.",
            );
          }
          return this.submitting;
        },

        submit(callback) {
          if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            warning(
              false,
              '`submit` is deprecated. ' +
                "Actually, it's more convenient to handle submitting status by yourself.",
            );
          }
          const fn = () => {
            this.setState({
              submitting: false,
            });
          };
          this.setState({
            submitting: true,
          });
          callback(fn);
        },
      },

      render() {
        const { $listeners, $slots } = this;
        const formProps = {
          [formPropName]: this.getForm(),
        };
        const { wrappedComponentRef, ...restProps } = getOptionProps(this);
        const wrappedComponentProps = {
          props: mapProps.call(this, {
            ...formProps,
            ...restProps,
          }),
          on: $listeners,
          ref: 'WrappedComponent',
          directives: [
            {
              name: 'ant-ref',
              value: wrappedComponentRef,
            },
          ],
        };

        return WrappedComponent ? (
          <WrappedComponent {...wrappedComponentProps}>{$slots.default}</WrappedComponent>
        ) : null;
      },
    };
    if (!WrappedComponent) return Form;
    if (Array.isArray(WrappedComponent.props)) {
      const newProps = {};
      WrappedComponent.props.forEach(prop => {
        newProps[prop] = PropTypes.any;
      });
      newProps[formPropName] = Object;
      WrappedComponent.props = newProps;
    } else {
      WrappedComponent.props = WrappedComponent.props || {};
      if (!(formPropName in WrappedComponent.props)) {
        WrappedComponent.props[formPropName] = Object;
      }
    }
    return argumentContainer(Form, WrappedComponent);
  };
}

export default createBaseForm;
