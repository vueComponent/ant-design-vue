'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _radio = require('../radio');

var _radio2 = _interopRequireDefault(_radio);

var _interface = require('./interface');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  name: 'SelectionBox',
  props: _interface.SelectionBoxProps,
  data: function data() {
    return {
      checked: this.getCheckState(this.$props)
    };
  },
  mounted: function mounted() {
    this.subscribe();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  methods: {
    subscribe: function subscribe() {
      var _this = this;

      var store = this.store;

      this.unsubscribe = store.subscribe(function () {
        var checked = _this.getCheckState(_this.$props);
        _this.setState({ checked: checked });
      });
    },
    getCheckState: function getCheckState(props) {
      var store = props.store,
          defaultSelection = props.defaultSelection,
          rowIndex = props.rowIndex;

      var checked = false;
      if (store.getState().selectionDirty) {
        checked = store.getState().selectedRowKeys.indexOf(rowIndex) >= 0;
      } else {
        checked = store.getState().selectedRowKeys.indexOf(rowIndex) >= 0 || defaultSelection.indexOf(rowIndex) >= 0;
      }
      return checked;
    }
  },

  render: function render() {
    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        type = _getOptionProps.type,
        rowIndex = _getOptionProps.rowIndex,
        rest = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['type', 'rowIndex']);

    var checked = this.checked,
        $attrs = this.$attrs,
        $listeners = this.$listeners;

    var checkboxProps = {
      props: (0, _extends3['default'])({
        checked: checked
      }, rest),
      attrs: $attrs,
      on: $listeners
    };
    if (type === 'radio') {
      checkboxProps.props.value = rowIndex;
      return h(_radio2['default'], checkboxProps);
    } else {
      return h(_checkbox2['default'], checkboxProps);
    }
  }
};
module.exports = exports['default'];