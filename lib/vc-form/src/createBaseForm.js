'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _createFieldsStore = require('./createFieldsStore');

var _createFieldsStore2 = _interopRequireDefault(_createFieldsStore);

var _vnode = require('../../_util/vnode');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DEFAULT_TRIGGER = 'change';

function createBaseForm() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mixins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var validateMessages = option.validateMessages,
      onFieldsChange = option.onFieldsChange,
      onValuesChange = option.onValuesChange,
      _option$mapProps = option.mapProps,
      mapProps = _option$mapProps === undefined ? _utils.identity : _option$mapProps,
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
        formProps[prop] = _vueTypes2['default'].any;
      });
    } else {
      formProps = props;
    }
    var Form = {
      mixins: [_BaseMixin2['default']].concat((0, _toConsumableArray3['default'])(mixins)),
      props: (0, _extends3['default'])({}, formProps, {
        wrappedComponentRef: _vueTypes2['default'].func.def(function () {})
      }),
      data: function data() {
        var _this = this;

        var fields = mapPropsToFields && mapPropsToFields(this.$props);
        this.fieldsStore = (0, _createFieldsStore2['default'])(fields || {});

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
            fieldMeta[action].apply(fieldMeta, (0, _toConsumableArray3['default'])(args));
          } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
            var _fieldMeta$originalPr;

            (_fieldMeta$originalPr = fieldMeta.originalProps)[action].apply(_fieldMeta$originalPr, (0, _toConsumableArray3['default'])(args));
          }
          var value = fieldMeta.getValueFromEvent ? fieldMeta.getValueFromEvent.apply(fieldMeta, (0, _toConsumableArray3['default'])(args)) : _utils.getValueFromEvent.apply(undefined, (0, _toConsumableArray3['default'])(args));
          if (onValuesChange && value !== this.fieldsStore.getFieldValue(name)) {
            var valuesAll = this.fieldsStore.getAllValues();
            var valuesAllSet = {};
            valuesAll[name] = value;
            Object.keys(valuesAll).forEach(function (key) {
              return (0, _set2['default'])(valuesAllSet, key, valuesAll[key]);
            });
            onValuesChange(this, (0, _set2['default'])({}, name, value), valuesAllSet);
          }
          var field = this.fieldsStore.getField(name);
          return { name: name, field: (0, _extends3['default'])({}, field, { value: value, touched: true }), fieldMeta: fieldMeta };
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

          var newField = (0, _extends3['default'])({}, field, {
            dirty: (0, _utils.hasRules)(validate)
          });
          this.setFields((0, _defineProperty3['default'])({}, name, newField));
        },
        onCollectValidate: function onCollectValidate(name_, action) {
          for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          var _onCollectCommon2 = this.onCollectCommon(name_, action, args),
              field = _onCollectCommon2.field,
              fieldMeta = _onCollectCommon2.fieldMeta;

          var newField = (0, _extends3['default'])({}, field, {
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
            this.fieldsStore.setFields((0, _defineProperty3['default'])({}, name, this.clearedFieldMetaCache[name].field));
            this.fieldsStore.setFieldMeta(name, this.clearedFieldMetaCache[name].meta);
            delete this.clearedFieldMetaCache[name];
          }
        },
        getFieldDecorator: function getFieldDecorator(name, fieldOption) {
          var _this2 = this;

          var _getFieldProps = this.getFieldProps(name, fieldOption),
              props = _getFieldProps.props,
              restProps = (0, _objectWithoutProperties3['default'])(_getFieldProps, ['props']);

          return function (fieldElem) {
            var fieldMeta = _this2.fieldsStore.getFieldMeta(name);
            var originalProps = (0, _propsUtil.getOptionProps)(fieldElem);
            var originalEvents = (0, _propsUtil.getEvents)(fieldElem);
            if (process.env.NODE_ENV !== 'production') {
              var valuePropName = fieldMeta.valuePropName;
              (0, _warning2['default'])(!(valuePropName in originalProps), '`getFieldDecorator` will override `' + valuePropName + '`, ' + ('so please don\'t set `' + valuePropName + ' and v-model` directly ') + 'and use `setFieldsValue` to set it.');
              var defaultValuePropName = 'default' + valuePropName[0].toUpperCase() + valuePropName.slice(1);
              (0, _warning2['default'])(!(defaultValuePropName in originalProps), '`' + defaultValuePropName + '` is invalid ' + ('for `getFieldDecorator` will set `' + valuePropName + '`,') + ' please use `option.initialValue` instead.');
            }
            fieldMeta.originalProps = originalProps;
            // fieldMeta.ref = fieldElem.data && fieldElem.data.ref
            var newProps = (0, _extends3['default'])({
              props: (0, _extends3['default'])({}, props, _this2.fieldsStore.getFieldValuePropValue(fieldMeta))
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
            return (0, _vnode.cloneElement)(fieldElem, (0, _extends3['default'])({}, newProps, { on: newEvents }));
          };
        },
        getFieldProps: function getFieldProps(name) {
          var _this3 = this;

          var usersFieldOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          if (!name) {
            throw new Error('Must call `getFieldProps` with valid name string!');
          }
          if (process.env.NODE_ENV !== 'production') {
            (0, _warning2['default'])(this.fieldsStore.isValidNestedFieldName(name), 'One field name cannot be part of another, e.g. `a` and `a.b`.');
            (0, _warning2['default'])(!('exclusive' in usersFieldOption), '`option.exclusive` of `getFieldProps`|`getFieldDecorator` had been remove.');
          }

          delete this.clearedFieldMetaCache[name];

          var fieldOption = (0, _extends3['default'])({
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

          var inputProps = (0, _extends3['default'])({}, this.fieldsStore.getFieldValuePropValue(fieldOption));
          var inputListeners = {};
          var inputAttrs = {};
          if (fieldNameProp) {
            inputProps[fieldNameProp] = name;
          }

          var validateRules = (0, _utils.normalizeValidateRules)(validate, rules, validateTrigger);
          var validateTriggers = (0, _utils.getValidateTriggers)(validateRules);
          validateTriggers.forEach(function (action) {
            if (inputListeners[action]) return;
            inputListeners[action] = _this3.getCacheBind(name, action, _this3.onCollectValidate);
          });

          // make sure that the value will be collect
          if (trigger && validateTriggers.indexOf(trigger) === -1) {
            inputListeners[trigger] = this.getCacheBind(name, trigger, this.onCollect);
          }

          var meta = (0, _extends3['default'])({}, fieldMeta, fieldOption, {
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
            props: (0, _omit2['default'])(inputProps, ['id']),
            // id: inputProps.id,
            domProps: {
              value: inputProps.value
            },
            attrs: (0, _extends3['default'])({}, inputAttrs, {
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
          return (0, _utils.flattenArray)(actionRules);
        },
        setFields: function setFields(maybeNestedFields, callback) {
          var _this4 = this;

          var fields = this.fieldsStore.flattenRegisteredFields(maybeNestedFields);
          this.fieldsStore.setFields(fields);
          if (onFieldsChange) {
            var changedFields = Object.keys(fields).reduce(function (acc, name) {
              return (0, _set2['default'])(acc, name, _this4.fieldsStore.getField(name));
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
              (0, _warning2['default'])(isRegistered, 'Cannot use `setFieldsValue` until ' + 'you use `getFieldDecorator` or `getFieldProps` to register it.');
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
                (0, _set2['default'])(alreadyErrors, name, { errors: field.errors });
              }
              return;
            }
            var fieldMeta = _this6.fieldsStore.getFieldMeta(name);
            var newField = (0, _extends3['default'])({}, field);
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
          if (callback && (0, _utils.isEmptyObject)(allFields)) {
            callback((0, _utils.isEmptyObject)(alreadyErrors) ? null : alreadyErrors, this.fieldsStore.getFieldsValue(fieldNames));
            return;
          }
          var validator = new _asyncValidator2['default'](allRules);
          if (validateMessages) {
            validator.messages(validateMessages);
          }
          validator.validate(allValues, options, function (errors) {
            var errorsGroup = (0, _extends3['default'])({}, alreadyErrors);
            if (errors && errors.length) {
              errors.forEach(function (e) {
                var fieldName = e.field;
                var field = (0, _get2['default'])(errorsGroup, fieldName);
                if ((typeof field === 'undefined' ? 'undefined' : (0, _typeof3['default'])(field)) !== 'object' || Array.isArray(field)) {
                  (0, _set2['default'])(errorsGroup, fieldName, { errors: [] });
                }
                var fieldErrors = (0, _get2['default'])(errorsGroup, fieldName.concat('.errors'));
                fieldErrors.push(e);
              });
            }
            var expired = [];
            var nowAllFields = {};
            Object.keys(allRules).forEach(function (name) {
              var fieldErrors = (0, _get2['default'])(errorsGroup, name);
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
                  (0, _set2['default'])(errorsGroup, name, {
                    expired: true,
                    errors: fieldErrors
                  });
                });
              }

              callback((0, _utils.isEmptyObject)(errorsGroup) ? null : errorsGroup, _this6.fieldsStore.getFieldsValue(fieldNames));
            }
          });
        },
        validateFields: function validateFields(ns, opt, cb) {
          var _this7 = this;

          var _getParams = (0, _utils.getParams)(ns, opt, cb),
              names = _getParams.names,
              callback = _getParams.callback,
              options = _getParams.options;

          var fieldNames = names ? this.fieldsStore.getValidFieldsFullName(names) : this.fieldsStore.getValidFieldsName();
          var fields = fieldNames.filter(function (name) {
            var fieldMeta = _this7.fieldsStore.getFieldMeta(name);
            return (0, _utils.hasRules)(fieldMeta.validate);
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
            (0, _warning2['default'])(false, '`isSubmitting` is deprecated. ' + 'Actually, it\'s more convenient to handle submitting status by yourself.');
          }
          return this.submitting;
        },
        submit: function submit(callback) {
          var _this8 = this;

          if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            (0, _warning2['default'])(false, '`submit` is deprecated.' + 'Actually, it\'s more convenient to handle submitting status by yourself.');
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

        var formProps = (0, _defineProperty3['default'])({}, formPropName, this.getForm());
        var props = (0, _propsUtil.getOptionProps)(this);
        var wrappedComponentProps = {
          props: mapProps.call(this, (0, _extends3['default'])({}, formProps, props)),
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
        newProps[prop] = _vueTypes2['default'].any;
      });
      newProps[formPropName] = Object;
      WrappedComponent.props = newProps;
    } else {
      WrappedComponent.props = WrappedComponent.props || {};
      if (!(formPropName in WrappedComponent.props)) {
        WrappedComponent.props[formPropName] = Object;
      }
    }
    return (0, _utils.argumentContainer)(Form, WrappedComponent);
  };
}

exports['default'] = createBaseForm;
module.exports = exports['default'];