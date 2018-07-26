'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports['default'] = createFieldsStore;

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

var _createFormField = require('./createFormField');

var _createFormField2 = _interopRequireDefault(_createFormField);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function partOf(a, b) {
  return b.indexOf(a) === 0 && ['.', '['].indexOf(b[a.length]) !== -1;
}

var FieldsStore = function () {
  function FieldsStore(fields) {
    (0, _classCallCheck3['default'])(this, FieldsStore);

    _initialiseProps.call(this);

    this.fields = this.flattenFields(fields);
    this.fieldsMeta = {};
  }

  (0, _createClass3['default'])(FieldsStore, [{
    key: 'updateFields',
    value: function updateFields(fields) {
      this.fields = this.flattenFields(fields);
    }
  }, {
    key: 'flattenFields',
    value: function flattenFields(fields) {
      return (0, _utils.flattenFields)(fields, function (_, node) {
        return (0, _createFormField.isFormField)(node);
      }, 'You must wrap field data with `createFormField`.');
    }
  }, {
    key: 'flattenRegisteredFields',
    value: function flattenRegisteredFields(fields) {
      var validFieldsName = this.getAllFieldsName();
      return (0, _utils.flattenFields)(fields, function (path) {
        return validFieldsName.indexOf(path) >= 0;
      }, 'You cannot set field before registering it.');
    }
  }, {
    key: 'setFields',
    value: function setFields(fields) {
      var _this = this;

      var fieldsMeta = this.fieldsMeta;
      var nowFields = (0, _extends3['default'])({}, this.fields, fields);
      var nowValues = {};
      Object.keys(fieldsMeta).forEach(function (f) {
        nowValues[f] = _this.getValueFromFields(f, nowFields);
      });
      Object.keys(nowValues).forEach(function (f) {
        var value = nowValues[f];
        var fieldMeta = _this.getFieldMeta(f);
        if (fieldMeta && fieldMeta.normalize) {
          var nowValue = fieldMeta.normalize(value, _this.getValueFromFields(f, _this.fields), nowValues);
          if (nowValue !== value) {
            nowFields[f] = (0, _extends3['default'])({}, nowFields[f], {
              value: nowValue
            });
          }
        }
      });
      this.fields = nowFields;
    }
  }, {
    key: 'resetFields',
    value: function resetFields(ns) {
      var fields = this.fields;

      var names = ns ? this.getValidFieldsFullName(ns) : this.getAllFieldsName();
      return names.reduce(function (acc, name) {
        var field = fields[name];
        if (field && 'value' in field) {
          acc[name] = {};
        }
        return acc;
      }, {});
    }
  }, {
    key: 'setFieldMeta',
    value: function setFieldMeta(name, meta) {
      this.fieldsMeta[name] = meta;
    }
  }, {
    key: 'getFieldMeta',
    value: function getFieldMeta(name) {
      this.fieldsMeta[name] = this.fieldsMeta[name] || {};
      return this.fieldsMeta[name];
    }
  }, {
    key: 'getValueFromFields',
    value: function getValueFromFields(name, fields) {
      var field = fields[name];
      if (field && 'value' in field) {
        return field.value;
      }
      var fieldMeta = this.getFieldMeta(name);
      return fieldMeta && fieldMeta.initialValue;
    }
  }, {
    key: 'getValidFieldsName',
    value: function getValidFieldsName() {
      var _this2 = this;

      var fieldsMeta = this.fieldsMeta;

      return fieldsMeta ? Object.keys(fieldsMeta).filter(function (name) {
        return !_this2.getFieldMeta(name).hidden;
      }) : [];
    }
  }, {
    key: 'getAllFieldsName',
    value: function getAllFieldsName() {
      var fieldsMeta = this.fieldsMeta;

      return fieldsMeta ? Object.keys(fieldsMeta) : [];
    }
  }, {
    key: 'getValidFieldsFullName',
    value: function getValidFieldsFullName(maybePartialName) {
      var maybePartialNames = Array.isArray(maybePartialName) ? maybePartialName : [maybePartialName];
      return this.getValidFieldsName().filter(function (fullName) {
        return maybePartialNames.some(function (partialName) {
          return fullName === partialName || (0, _utils.startsWith)(fullName, partialName) && ['.', '['].indexOf(fullName[partialName.length]) >= 0;
        });
      });
    }
  }, {
    key: 'getFieldValuePropValue',
    value: function getFieldValuePropValue(fieldMeta) {
      var name = fieldMeta.name,
          getValueProps = fieldMeta.getValueProps,
          valuePropName = fieldMeta.valuePropName;

      var field = this.getField(name);
      var fieldValue = 'value' in field ? field.value : fieldMeta.initialValue;
      if (getValueProps) {
        return getValueProps(fieldValue);
      }
      return (0, _defineProperty3['default'])({}, valuePropName, fieldValue);
    }
  }, {
    key: 'getField',
    value: function getField(name) {
      return (0, _extends3['default'])({}, this.fields[name], {
        name: name
      });
    }
  }, {
    key: 'getNotCollectedFields',
    value: function getNotCollectedFields() {
      var _this3 = this;

      return this.getValidFieldsName().filter(function (name) {
        return !_this3.fields[name];
      }).map(function (name) {
        return {
          name: name,
          dirty: false,
          value: _this3.getFieldMeta(name).initialValue
        };
      }).reduce(function (acc, field) {
        return (0, _set2['default'])(acc, field.name, (0, _createFormField2['default'])(field));
      }, {});
    }
  }, {
    key: 'getNestedAllFields',
    value: function getNestedAllFields() {
      var _this4 = this;

      return Object.keys(this.fields).reduce(function (acc, name) {
        return (0, _set2['default'])(acc, name, (0, _createFormField2['default'])(_this4.fields[name]));
      }, this.getNotCollectedFields());
    }
  }, {
    key: 'getFieldMember',
    value: function getFieldMember(name, member) {
      return this.getField(name)[member];
    }
  }, {
    key: 'getNestedFields',
    value: function getNestedFields(names, getter) {
      var fields = names || this.getValidFieldsName();
      return fields.reduce(function (acc, f) {
        return (0, _set2['default'])(acc, f, getter(f));
      }, {});
    }
  }, {
    key: 'getNestedField',
    value: function getNestedField(name, getter) {
      var fullNames = this.getValidFieldsFullName(name);
      if (fullNames.length === 0 || // Not registered
      fullNames.length === 1 && fullNames[0] === name // Name already is full name.
      ) {
          return getter(name);
        }
      var isArrayValue = fullNames[0][name.length] === '[';
      var suffixNameStartIndex = isArrayValue ? name.length : name.length + 1;
      return fullNames.reduce(function (acc, fullName) {
        return (0, _set2['default'])(acc, fullName.slice(suffixNameStartIndex), getter(fullName));
      }, isArrayValue ? [] : {});
    }
  }, {
    key: 'isValidNestedFieldName',


    // @private
    // BG: `a` and `a.b` cannot be use in the same form
    value: function isValidNestedFieldName(name) {
      var names = this.getAllFieldsName();
      return names.every(function (n) {
        return !partOf(n, name) && !partOf(name, n);
      });
    }
  }, {
    key: 'clearField',
    value: function clearField(name) {
      delete this.fields[name];
      delete this.fieldsMeta[name];
    }
  }]);
  return FieldsStore;
}();

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.setFieldsInitialValue = function (initialValues) {
    var flattenedInitialValues = _this5.flattenRegisteredFields(initialValues);
    var fieldsMeta = _this5.fieldsMeta;
    Object.keys(flattenedInitialValues).forEach(function (name) {
      if (fieldsMeta[name]) {
        _this5.setFieldMeta(name, (0, _extends3['default'])({}, _this5.getFieldMeta(name), {
          initialValue: flattenedInitialValues[name]
        }));
      }
    });
  };

  this.getAllValues = function () {
    var fieldsMeta = _this5.fieldsMeta,
        fields = _this5.fields;

    return Object.keys(fieldsMeta).reduce(function (acc, name) {
      return (0, _set2['default'])(acc, name, _this5.getValueFromFields(name, fields));
    }, {});
  };

  this.getFieldsValue = function (names) {
    return _this5.getNestedFields(names, _this5.getFieldValue);
  };

  this.getFieldValue = function (name) {
    var fields = _this5.fields;

    return _this5.getNestedField(name, function (fullName) {
      return _this5.getValueFromFields(fullName, fields);
    });
  };

  this.getFieldsError = function (names) {
    return _this5.getNestedFields(names, _this5.getFieldError);
  };

  this.getFieldError = function (name) {
    return _this5.getNestedField(name, function (fullName) {
      return (0, _utils.getErrorStrs)(_this5.getFieldMember(fullName, 'errors'));
    });
  };

  this.isFieldValidating = function (name) {
    return _this5.getFieldMember(name, 'validating');
  };

  this.isFieldsValidating = function (ns) {
    var names = ns || _this5.getValidFieldsName();
    return names.some(function (n) {
      return _this5.isFieldValidating(n);
    });
  };

  this.isFieldTouched = function (name) {
    return _this5.getFieldMember(name, 'touched');
  };

  this.isFieldsTouched = function (ns) {
    var names = ns || _this5.getValidFieldsName();
    return names.some(function (n) {
      return _this5.isFieldTouched(n);
    });
  };
};

function createFieldsStore(fields) {
  return new FieldsStore(fields);
}
module.exports = exports['default'];