import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { hasProp } from '../../../_util/props-util';
import moment from 'moment';
import { isAllowedDate as _isAllowedDate, getTodayTime } from '../util/index';
function noop() {}
function getNow() {
  return moment();
}

function getNowByCurrentStateValue(value) {
  var ret = void 0;
  if (value) {
    ret = getTodayTime(value);
  } else {
    ret = getNow();
  }
  return ret;
}
function isMoment(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex(function (val) {
      return val === undefined || moment.isMoment(val);
    }) !== -1;
  } else {
    return value === undefined || moment.isMoment(value);
  }
}
var MomentType = PropTypes.custom(isMoment);
var CalendarMixin = {
  mixins: [BaseMixin],
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

      var className = (_className = {}, _defineProperty(_className, prefixCls, 1), _defineProperty(_className, prefixCls + '-hidden', !props.visible), _defineProperty(_className, newProps['class'], !!newProps['class']), _className);
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
      if (!hasProp(this, 'selectedValue')) {
        this.setState({
          sSelectedValue: selectedValue
        });
      }
      this.__emit('select', selectedValue, cause);
      // }
    },
    setValue: function setValue(value) {
      var originalValue = this.sValue;
      if (!hasProp(this, 'value')) {
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
      return _isAllowedDate(value, disabledDate, disabledTime);
    }
  }

};

export default CalendarMixin;