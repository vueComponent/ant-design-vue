'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../../_util/props-util');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _index = require('../util/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
function getNow() {
  return (0, _moment2['default'])();
}

function getNowByCurrentStateValue(value) {
  var ret = void 0;
  if (value) {
    ret = (0, _index.getTodayTime)(value);
  } else {
    ret = getNow();
  }
  return ret;
}
function isMoment(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex(function (val) {
      return val === undefined || _moment2['default'].isMoment(val);
    }) !== -1;
  } else {
    return value === undefined || _moment2['default'].isMoment(value);
  }
}
var MomentType = _vueTypes2['default'].custom(isMoment);
var CalendarMixin = {
  mixins: [_BaseMixin2['default']],
  props: {
    value: MomentType,
    defaultValue: MomentType
  },

  data: function data() {
    var props = this.$props;
    var sValue = props.value || props.defaultValue || getNow();
    return {
      sValue: sValue,
      sSelectedValue: props.selectedValue || props.defaultSelectedValue
    };
  },

  watch: {
    value: function value(val) {
      var sValue = val || this.defaultValue || getNowByCurrentStateValue(this.sValue);
      this.setState({
        sValue: sValue
      });
    },
    selectedValue: function selectedValue(val) {
      this.setState({
        sSelectedValue: val
      });
    }
  },
  methods: {
    onSelect: function onSelect(value, cause) {
      if (value) {
        this.setValue(value);
      }
      this.setSelectedValue(value, cause);
    },
    renderRoot: function renderRoot(newProps) {
      var _className;

      var h = this.$createElement;

      var props = this.$props;
      var prefixCls = props.prefixCls;

      var className = (_className = {}, (0, _defineProperty3['default'])(_className, prefixCls, 1), (0, _defineProperty3['default'])(_className, prefixCls + '-hidden', !props.visible), (0, _defineProperty3['default'])(_className, newProps['class'], !!newProps['class']), _className);
      return h(
        'div',
        {
          ref: 'rootInstance',
          'class': className,
          attrs: { tabIndex: '0'
          },
          on: {
            'keydown': this.onKeyDown || noop
          }
        },
        [newProps.children]
      );
    },
    setSelectedValue: function setSelectedValue(selectedValue, cause) {
      // if (this.isAllowedDate(selectedValue)) {
      if (!(0, _propsUtil.hasProp)(this, 'selectedValue')) {
        this.setState({
          sSelectedValue: selectedValue
        });
      }
      this.__emit('select', selectedValue, cause);
      // }
    },
    setValue: function setValue(value) {
      var originalValue = this.sValue;
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({
          sValue: value
        });
      }
      if (originalValue && value && !originalValue.isSame(value) || !originalValue && value || originalValue && !value) {
        this.__emit('change', value);
      }
    },
    isAllowedDate: function isAllowedDate(value) {
      var disabledDate = this.disabledDate;
      var disabledTime = this.disabledTime;
      return (0, _index.isAllowedDate)(value, disabledDate, disabledTime);
    }
  }

};

exports['default'] = CalendarMixin;
module.exports = exports['default'];