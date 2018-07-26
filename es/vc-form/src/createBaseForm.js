import _typeof from 'babel-runtime/helpers/typeof';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import AsyncValidator from 'async-validator';
import warning from 'warning';
import get from 'lodash/get';
import set from 'lodash/set';
import omit from 'lodash/omit';
import createFieldsStore from './createFieldsStore';
import { cloneElement } from '../../_util/vnode';
import BaseMixin from '../../_util/BaseMixin';
import { getOptionProps, getEvents } from '../../_util/props-util';
import PropTypes from '../../_util/vue-types';

import { argumentContainer, identity, normalizeValidateRules, getValidateTriggers, getValueFromEvent, hasRules, getParams, isEmptyObject, flattenArray } from './utils';

var DEFAULT_TRIGGER = 'change';

function createBaseForm() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mixins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var validateMessages = option.validateMessages,
      onFieldsChange = option.onFieldsChange,
      onValuesChange = option.onValuesChange,
      _option$mapProps = option.mapProps,
      mapProps = _option$mapProps === undefined ? identity : _option$mapProps,
      mapPropsToFields = option.mapPropsToFields,
      fieldNameProp = option.fieldNameProp,
      fieldMetaProp = option.fieldMetaProp,
      fieldDataProp = option.fieldDataProp,
      _option$formPropName = option.formPropName,
      formPropName = _option$formPropName === undefined ? 'form' : _option$formPropName,
      _option$props = option.props,
      props = _option$props === undefined ? {} : _option$props,
      templateContext = option.templateContext;


  return function decorate(WrappedComponent) {
    var formProps = {};
    if (Array.isArray(props)) {
      props.forEach(function (prop) {
        formProps[prop] = PropTypes.any;
      });
    } else {
      formProps = props;
    }
    var Form = {
      mixins: [BaseMixin].concat(_toConsumableArray(mixins)),
      props: _extends({}, formProps, {
        wrappedComponentRef: PropTypes.func.def(function () {})
      }),
      data: function data() {
        var _this = this;

        var fields = mapPropsToFields && mapPropsToFields(this.$props);
        this.fieldsStore = createFieldsStore(fields || {});

        this.instances = {};
        this.cachedBind = {};
        this.clearedFieldMetaCache = {};
        // HACK: https://github.com/ant-design/ant-design/issues/6406
        ['getFieldsValue', 'getFieldValue', 'setFieldsInitialValue', 'getFieldsError', 'getFieldError', 'isFieldValidating', 'isFieldsValidating', 'isFieldsTouched', 'isFieldTouched'].forEach(function (key) {
          _this[key] = function () {
            var _fieldsStore;

            return (_fieldsStore = _this.fieldsStore)[key].apply(_fieldsStore, arguments);
          };
        });

        return {
          submitting: false
        };
      },

      watch: {
        '$props': {
          handler: function handler(nextProps) {
            if (mapPropsToFields) {
              this.fieldsStore.updateFields(mapPropsToFields(nextProps));
            }
          },
          deep: true
        }
      },
      mounted: function mounted() {
        this.wrappedComponentRef(this.$refs.WrappedComponent);
      },
      updated: function updated() {
        this.wrappedComponentRef(this.$refs.WrappedComponent);
      },
      destroyed: function destroyed() {
        this.wrappedComponentRef(null);
      },

      methods: {
        onCollectCommon: function onCollectCommon(name, action, args) {
          var fieldMeta = this.fieldsStore.getFieldMeta(name);
          if (fieldMeta[action]) {
            fieldMeta[action].apply(fieldMeta, _toConsumableArray(args));
          } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
            var _fieldMeta$originalPr;

            (_fieldMeta$originalPr = fieldMeta.originalProps)[action].apply(_fieldMeta$originalPr, _toConsumableArray(args));
          }
          var value = fieldMeta.getValueFromEvent ? fieldMeta.getValueFromEvent.apply(fieldMeta, _toConsumableArray(args)) : getValueFromEvent.apply(undefined, _toConsumableArray(args));
          if (onValuesChange && value !== this.fieldsStore.getFieldValue(name)) {
            var valuesAll = this.fieldsStore.getAllValues();
            var valuesAllSet = {};
            valuesAll[name] = value;
            Object.keys(valuesAll).forEach(function (key) {
              return set(valuesAllSet, key, valuesAll[key]);
            });
            onValuesChange(this, set({}, name, value), valuesAllSet);
          }
          var field = this.fieldsStore.getField(name);
          return { name: name, field: _extends({}, field, { value: value, touched: true }), fieldMeta: fieldMeta };
        },
        onCollect: function onCollect(name_, action) {
          for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }

          var _onCollectCommon = this.onCollectCommon(name_, action, args),
              name = _onCollectCommon.name,
              field = _onCollectCommon.field,
              fieldMeta = _onCollectCommon.fieldMeta;

          var validate = fieldMeta.validate;

          var newField = _extends({}, field, {
            dirty: hasRules(validate)
          });
          this.setFields(_defineProperty({}, name, newField));
        },
        onCollectValidate: function onCollectValidate(name_, action) {
          for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          var _onCollectCommon2 = this.onCollectCommon(name_, action, args),
              field = _onCollectCommon2.field,
              fieldMeta = _onCollectCommon2.fieldMeta;

          var newField = _extends({}, field, {
            dirty: true
          });
          this.validateFieldsInternal([newField], {
            action: action,
            options: {
              firstFields: !!fieldMeta.validateFirst
            }
          });
        },
        getCacheBind: function getCacheBind(name, action, fn) {
          if (!this.cachedBind[name]) {
            this.cachedBind[name] = {};
          }
          var cache = this.cachedBind[name];
          if (!cache[action]) {
            cache[action] = fn.bind(this, name, action);
          }
          return cache[action];
        },
        recoverClearedField: function recoverClearedField(name) {
          if (this.clearedFieldMetaCache[name]) {
            this.fieldsStore.setFields(_defineProperty({}, name, this.clearedFieldMetaCache[name].field));
            this.fieldsStore.setFieldMeta(name, this.clearedFieldMetaCache[name].meta);
            delete this.clearedFieldMetaCache[name];
          }
        },
        getFieldDecorator: function getFieldDecorator(name, fieldOption) {
          var _this2 = this;

          var _getFieldProps = this.getFieldProps(name, fieldOption),
              props = _getFieldProps.props,
              restProps = _objectWithoutProperties(_getFieldProps, ['props']);

          return function (fieldElem) {
            var fieldMeta = _this2.fieldsStore.getFieldMeta(name);
            var originalProps = getOptionProps(fieldElem);
            var originalEvents = getEvents(fieldElem);
            if (process.env.NODE_ENV !== 'production') {
              var valuePropName = fieldMeta.valuePropName;
              warning(!(valuePropName in originalProps), '`getFieldDecorator` will override `' + valuePropName + '`, ' + ('so please don\'t set `' + valuePropName + ' and v-model` directly ') + 'and use `setFieldsValue` to set it.');
              var defaultValuePropName = 'default' + valuePropName[0].toUpperCase() + valuePropName.slice(1);
              warning(!(defaultValuePropName in originalProps), '`' + defaultValuePropName + '` is invalid ' + ('for `getFieldDecorator` will set `' + valuePropName + '`,') + ' please use `option.initialValue` instead.');
            }
            fieldMeta.originalProps = originalProps;
            // fieldMeta.ref = fieldElem.data && fieldElem.data.ref
            var newProps = _extends({
              props: _extends({}, props, _this2.fieldsStore.getFieldValuePropValue(fieldMeta))
            }, restProps);
            newProps.domProps.value = newProps.props.value;
            var newEvents = {};
            Object.keys(newProps.on).forEach(function (key) {
              if (originalEvents[key]) {
                var triggerEvents = newProps.on[key];
                newEvents[key] = function () {
                  originalEvents[key].apply(originalEvents, arguments);
                  triggerEvents.apply(undefined, arguments);
                };
              } else {
                newEvents[key] = newProps.on[key];
              }
            });
            return cloneElement(fieldElem, _extends({}, newProps, { on: newEvents }));
          };
        },
        getFieldProps: function getFieldProps(name) {
          var _this3 = this;

          var usersFieldOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          if (!name) {
            throw new Error('Must call `getFieldProps` with valid name string!');
          }
          if (process.env.NODE_ENV !== 'production') {
            warning(this.fieldsStore.isValidNestedFieldName(name), 'One field name cannot be part of another, e.g. `a` and `a.b`.');
            warning(!('exclusive' in usersFieldOption), '`option.exclusive` of `getFieldProps`|`getFieldDecorator` had been remove.');
          }

          delete this.clearedFieldMetaCache[name];

          var fieldOption = _extends({
            name: name,
            trigger: DEFAULT_TRIGGER,
            valuePropName: 'value',
            validate: []
          }, usersFieldOption);

          var rules = fieldOption.rules,
              trigger = fieldOption.trigger,
              _fieldOption$validate = fieldOption.validateTrigger,
              validateTrigger = _fieldOption$validate === undefined ? trigger : _fieldOption$validate,
              validate = fieldOption.validate;


          var fieldMeta = this.fieldsStore.getFieldMeta(name);
          if ('initialValue' in fieldOption) {
            fieldMeta.initialValue = fieldOption.initialValue;
          }

          var inputProps = _extends({}, this.fieldsStore.getFieldValuePropValue(fieldOption));
          var inputListeners = {};
          var inputAttrs = {};
          if (fieldNameProp) {
            inputProps[fieldNameProp] = name;
          }

          var validateRules = normalizeValidateRules(validate, rules, validateTrigger);
          var validateTriggers = getValidateTriggers(validateRules);
          validateTriggers.forEach(function (action) {
            if (inputListeners[action]) return;
            inputListeners[action] = _this3.getCacheBind(name, action, _this3.onCollectValidate);
          });

          // make sure that the value will be collect
          if (trigger && validateTriggers.indexOf(trigger) === -1) {
            inputListeners[trigger] = this.getCacheBind(name, trigger, this.onCollect);
          }

          var meta = _extends({}, fieldMeta, fieldOption, {
            validate: validateRules
          });
          this.fieldsStore.setFieldMeta(name, meta);
          if (fieldMetaProp) {
            inputAttrs[fieldMetaProp] = meta;
          }

          if (fieldDataProp) {
            inputAttrs[fieldDataProp] = this.fieldsStore.getField(name);
          }

          return {
            props: omit(inputProps, ['id']),
            // id: inputProps.id,
            domProps: {
              value: inputProps.value
            },
            attrs: _extends({}, inputAttrs, {
              id: inputProps.id
            }),
            directives: [{
              name: 'ant-ref',
              value: this.getCacheBind(name, name + '__ref', this.saveRef)
            }],
            on: inputListeners
          };
        },
        getFieldInstance: function getFieldInstance(name) {
          return this.instances[name];
        },
        getRules: function getRules(fieldMeta, action) {
          var actionRules = fieldMeta.validate.filter(function (item) {
            return !action || item.trigger.indexOf(action) >= 0;
          }).map(function (item) {
            return item.rules;
          });
          return flattenArray(actionRules);
        },
        setFields: function setFields(maybeNestedFields, callback) {
          var _this4 = this;

          var fields = this.fieldsStore.flattenRegisteredFields(maybeNestedFields);
          this.fieldsStore.setFields(fields);
          if (onFieldsChange) {
            var changedFields = Object.keys(fields).reduce(function (acc, name) {
              return set(acc, name, _this4.fieldsStore.getField(name));
            }, {});
            onFieldsChange(this, changedFields, this.fieldsStore.getNestedAllFields());
          }
          if (templateContext) {
            templateContext.$forceUpdate();
          } else {
            this.$forceUpdate();
          }
          this.$nextTick(function () {
            callback && callback();
          });
        },
        resetFields: function resetFields(ns) {
          var _this5 = this;

          var newFields = this.fieldsStore.resetFields(ns);
          if (Object.keys(newFields).length > 0) {
            this.setFields(newFields);
          }
          if (ns) {
            var names = Array.isArray(ns) ? ns : [ns];
            names.forEach(function (name) {
              return delete _this5.clearedFieldMetaCache[name];
            });
          } else {
            this.clearedFieldMetaCache = {};
          }
        },
        setFieldsValue: function setFieldsValue(changedValues, callback) {
          var fieldsMeta = this.fieldsStore.fieldsMeta;

          var values = this.fieldsStore.flattenRegisteredFields(changedValues);
          var newFields = Object.keys(values).reduce(function (acc, name) {
            var isRegistered = fieldsMeta[name];
            if (process.env.NODE_ENV !== 'production') {
              warning(isRegistered, 'Cannot use `setFieldsValue` until ' + 'you use `getFieldDecorator` or `getFieldProps` to register it.');
            }
            if (isRegistered) {
              var value = values[name];
              acc[name] = {
                value: value
              };
            }
            return acc;
          }, {});
          this.setFields(newFields, callback);
          if (onValuesChange) {
            var allValues = this.fieldsStore.getAllValues();
            onValuesChange(this, changedValues, allValues);
          }
        },
        saveRef: function saveRef(name, _, component) {
          if (!component) {
            // after destroy, delete data
            this.clearedFieldMetaCache[name] = {
              field: this.fieldsStore.getField(name),
              meta: this.fieldsStore.getFieldMeta(name)
            };
            this.fieldsStore.clearField(name);
            delete this.instances[name];
            delete this.cachedBind[name];
            return;
          }
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
        validateFieldsInternal: function validateFieldsInternal(fields, _ref, callback) {
          var _this6 = this;

          var fieldNames = _ref.fieldNames,
              action = _ref.action,
              _ref$options = _ref.options,
              options = _ref$options === undefined ? {} : _ref$options;

          var allRules = {};
          var allValues = {};
          var allFields = {};
          var alreadyErrors = {};
          fields.forEach(function (field) {
            var name = field.name;
            if (options.force !== true && field.dirty === false) {
              if (field.errors) {
                set(alreadyErrors, name, { errors: field.errors });
              }
              return;
            }
            var fieldMeta = _this6.fieldsStore.getFieldMeta(name);
            var newField = _extends({}, field);
            newField.errors = undefined;
            newField.validating = true;
            newField.dirty = true;
            allRules[name] = _this6.getRules(fieldMeta, action);
            allValues[name] = newField.value;
            allFields[name] = newField;
          });
          this.setFields(allFields);
          // in case normalize
          Object.keys(allValues).forEach(function (f) {
            allValues[f] = _this6.fieldsStore.getFieldValue(f);
          });
          if (callback && isEmptyObject(allFields)) {
            callback(isEmptyObject(alreadyErrors) ? null : alreadyErrors, this.fieldsStore.getFieldsValue(fieldNames));
            return;
          }
          var validator = new AsyncValidator(allRules);
          if (validateMessages) {
            validator.messages(validateMessages);
          }
          validator.validate(allValues, options, function (errors) {
            var errorsGroup = _extends({}, alreadyErrors);
            if (errors && errors.length) {
              errors.forEach(function (e) {
                var fieldName = e.field;
                var field = get(errorsGroup, fieldName);
                if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) !== 'object' || Array.isArray(field)) {
                  set(errorsGroup, fieldName, { errors: [] });
                }
                var fieldErrors = get(errorsGroup, fieldName.concat('.errors'));
                fieldErrors.push(e);
              });
            }
            var expired = [];
            var nowAllFields = {};
            Object.keys(allRules).forEach(function (name) {
              var fieldErrors = get(errorsGroup, name);
              var nowField = _this6.fieldsStore.getField(name);
              // avoid concurrency problems
              if (nowField.value !== allValues[name]) {
                expired.push({
                  name: name
                });
              } else {
                nowField.errors = fieldErrors && fieldErrors.errors;
                nowField.value = allValues[name];
                nowField.validating = false;
                nowField.dirty = false;
                nowAllFields[name] = nowField;
              }
            });
            _this6.setFields(nowAllFields);
            if (callback) {
              if (expired.length) {
                expired.forEach(function (_ref2) {
                  var name = _ref2.name;

                  var fieldErrors = [{
                    message: name + ' need to revalidate',
                    field: name
                  }];
                  set(errorsGroup, name, {
                    expired: true,
                    errors: fieldErrors
                  });
                });
              }

              callback(isEmptyObject(errorsGroup) ? null : errorsGroup, _this6.fieldsStore.getFieldsValue(fieldNames));
            }
          });
        },
        validateFields: function validateFields(ns, opt, cb) {
          var _this7 = this;

          var _getParams = getParams(ns, opt, cb),
              names = _getParams.names,
              callback = _getParams.callback,
              options = _getParams.options;

          var fieldNames = names ? this.fieldsStore.getValidFieldsFullName(names) : this.fieldsStore.getValidFieldsName();
          var fields = fieldNames.filter(function (name) {
            var fieldMeta = _this7.fieldsStore.getFieldMeta(name);
            return hasRules(fieldMeta.validate);
          }).map(function (name) {
            var field = _this7.fieldsStore.getField(name);
            field.value = _this7.fieldsStore.getFieldValue(name);
            return field;
          });
          if (!fields.length) {
            if (callback) {
              callback(null, this.fieldsStore.getFieldsValue(fieldNames));
            }
            return;
          }
          if (!('firstFields' in options)) {
            options.firstFields = fieldNames.filter(function (name) {
              var fieldMeta = _this7.fieldsStore.getFieldMeta(name);
              return !!fieldMeta.validateFirst;
            });
          }
          this.validateFieldsInternal(fields, {
            fieldNames: fieldNames,
            options: options
          }, callback);
        },
        isSubmitting: function isSubmitting() {
          if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            warning(false, '`isSubmitting` is deprecated. ' + 'Actually, it\'s more convenient to handle submitting status by yourself.');
          }
          return this.submitting;
        },
        submit: function submit(callback) {
          var _this8 = this;

          if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            warning(false, '`submit` is deprecated.' + 'Actually, it\'s more convenient to handle submitting status by yourself.');
          }
          var fn = function fn() {
            _this8.setState({
              submitting: false
            });
          };
          this.setState({
            submitting: true
          });
          callback(fn);
        }
      },

      render: function render() {
        var h = arguments[0];
        var $listeners = this.$listeners,
            $slots = this.$slots;

        var formProps = _defineProperty({}, formPropName, this.getForm());
        var props = getOptionProps(this);
        var wrappedComponentProps = {
          props: mapProps.call(this, _extends({}, formProps, props)),
          on: $listeners,
          ref: 'WrappedComponent'
        };
        return h(
          WrappedComponent,
          wrappedComponentProps,
          [$slots['default']]
        );
      }
    };
    if (Array.isArray(WrappedComponent.props)) {
      var newProps = {};
      WrappedComponent.props.forEach(function (prop) {
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