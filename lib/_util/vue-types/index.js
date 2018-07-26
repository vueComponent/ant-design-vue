'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var VuePropTypes = {

  get any() {
    return (0, _utils.toType)('any', {
      type: null
    });
  },

  get func() {
    return (0, _utils.toType)('function', {
      type: Function
    }).def(currentDefaults.func);
  },

  get bool() {
    return (0, _utils.toType)('boolean', {
      type: Boolean
    }).def(currentDefaults.bool);
  },

  get string() {
    return (0, _utils.toType)('string', {
      type: String
    }).def(currentDefaults.string);
  },

  get number() {
    return (0, _utils.toType)('number', {
      type: Number
    }).def(currentDefaults.number);
  },

  get array() {
    return (0, _utils.toType)('array', {
      type: Array
    }).def(currentDefaults.array);
  },

  get object() {
    return (0, _utils.toType)('object', {
      type: Object
    }).def(currentDefaults.object);
  },

  get integer() {
    return (0, _utils.toType)('integer', {
      type: Number,
      validator: function validator(value) {
        return (0, _utils.isInteger)(value);
      }
    }).def(currentDefaults.integer);
  },

  get symbol() {
    return (0, _utils.toType)('symbol', {
      type: null,
      validator: function validator(value) {
        return (typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) === 'symbol';
      }
    });
  },

  custom: function custom(validatorFn) {
    var warnMsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'custom validation failed';

    if (typeof validatorFn !== 'function') {
      throw new TypeError('[VueTypes error]: You must provide a function as argument');
    }

    return (0, _utils.toType)(validatorFn.name || '<<anonymous function>>', {
      validator: function validator() {
        var valid = validatorFn.apply(undefined, arguments);
        if (!valid) (0, _utils.warn)(this._vueTypes_name + ' - ' + warnMsg);
        return valid;
      }
    });
  },
  oneOf: function oneOf(arr) {
    if (!(0, _utils.isArray)(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }
    var msg = 'oneOf - value should be one of "' + arr.join('", "') + '"';
    var allowedTypes = arr.reduce(function (ret, v) {
      if (v !== null && v !== undefined) {
        ret.indexOf(v.constructor) === -1 && ret.push(v.constructor);
      }
      return ret;
    }, []);

    return (0, _utils.toType)('oneOf', {
      type: allowedTypes.length > 0 ? allowedTypes : null,
      validator: function validator(value) {
        var valid = arr.indexOf(value) !== -1;
        if (!valid) (0, _utils.warn)(msg);
        return valid;
      }
    });
  },
  instanceOf: function instanceOf(instanceConstructor) {
    return (0, _utils.toType)('instanceOf', {
      type: instanceConstructor
    });
  },
  oneOfType: function oneOfType(arr) {
    if (!(0, _utils.isArray)(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }

    var hasCustomValidators = false;

    var nativeChecks = arr.reduce(function (ret, type, i) {
      if ((0, _isPlainObject2['default'])(type)) {
        if (type._vueTypes_name === 'oneOf') {
          return ret.concat(type.type || []);
        }
        if (type.type && !(0, _utils.isFunction)(type.validator)) {
          if ((0, _utils.isArray)(type.type)) return ret.concat(type.type);
          ret.push(type.type);
        } else if ((0, _utils.isFunction)(type.validator)) {
          hasCustomValidators = true;
        }
        return ret;
      }
      ret.push(type);
      return ret;
    }, []);

    if (!hasCustomValidators) {
      // we got just native objects (ie: Array, Object)
      // delegate to Vue native prop check
      return (0, _utils.toType)('oneOfType', {
        type: nativeChecks
      }).def(undefined);
    }

    var typesStr = arr.map(function (type) {
      if (type && (0, _utils.isArray)(type.type)) {
        return type.type.map(_utils.getType);
      }
      return (0, _utils.getType)(type);
    }).reduce(function (ret, type) {
      return ret.concat((0, _utils.isArray)(type) ? type : [type]);
    }, []).join('", "');

    return this.custom(function oneOfType(value) {
      var valid = arr.some(function (type) {
        if (type._vueTypes_name === 'oneOf') {
          return type.type ? (0, _utils.validateType)(type.type, value, true) : true;
        }
        return (0, _utils.validateType)(type, value, true);
      });
      if (!valid) (0, _utils.warn)('oneOfType - value type should be one of "' + typesStr + '"');
      return valid;
    }).def(undefined);
  },
  arrayOf: function arrayOf(type) {
    return (0, _utils.toType)('arrayOf', {
      type: Array,
      validator: function validator(values) {
        var valid = values.every(function (value) {
          return (0, _utils.validateType)(type, value);
        });
        if (!valid) (0, _utils.warn)('arrayOf - value must be an array of "' + (0, _utils.getType)(type) + '"');
        return valid;
      }
    });
  },
  objectOf: function objectOf(type) {
    return (0, _utils.toType)('objectOf', {
      type: Object,
      validator: function validator(obj) {
        var valid = Object.keys(obj).every(function (key) {
          return (0, _utils.validateType)(type, obj[key]);
        });
        if (!valid) (0, _utils.warn)('objectOf - value must be an object of "' + (0, _utils.getType)(type) + '"');
        return valid;
      }
    });
  },
  shape: function shape(obj) {
    var keys = Object.keys(obj);
    var requiredKeys = keys.filter(function (key) {
      return obj[key] && obj[key].required === true;
    });

    var type = (0, _utils.toType)('shape', {
      type: Object,
      validator: function validator(value) {
        var _this = this;

        if (!(0, _isPlainObject2['default'])(value)) {
          return false;
        }
        var valueKeys = Object.keys(value);

        // check for required keys (if any)
        if (requiredKeys.length > 0 && requiredKeys.some(function (req) {
          return valueKeys.indexOf(req) === -1;
        })) {
          (0, _utils.warn)('shape - at least one of required properties "' + requiredKeys.join('", "') + '" is not present');
          return false;
        }

        return valueKeys.every(function (key) {
          if (keys.indexOf(key) === -1) {
            if (_this._vueTypes_isLoose === true) return true;
            (0, _utils.warn)('shape - object is missing "' + key + '" property');
            return false;
          }
          var type = obj[key];
          return (0, _utils.validateType)(type, value[key]);
        });
      }
    });

    Object.defineProperty(type, '_vueTypes_isLoose', {
      enumerable: false,
      writable: true,
      value: false
    });

    Object.defineProperty(type, 'loose', {
      get: function get() {
        this._vueTypes_isLoose = true;
        return this;
      },

      enumerable: false
    });

    return type;
  }
};

var typeDefaults = function typeDefaults() {
  return {
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    array: undefined,
    object: undefined,
    integer: undefined
  };
};

var currentDefaults = typeDefaults();

Object.defineProperty(VuePropTypes, 'sensibleDefaults', {
  enumerable: false,
  set: function set(value) {
    if (value === false) {
      currentDefaults = {};
    } else if (value === true) {
      currentDefaults = typeDefaults();
    } else if ((0, _isPlainObject2['default'])(value)) {
      currentDefaults = value;
    }
  },
  get: function get() {
    return currentDefaults;
  }
});

exports['default'] = VuePropTypes;
module.exports = exports['default'];