'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports['default'] = createTableRow;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _createStore = require('./createStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BodyRowProps = {
  store: _createStore.Store,
  rowKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  prefixCls: _vueTypes2['default'].string
};

function createTableRow() {
  var Component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tr';

  var BodyRow = {
    name: 'BodyRow',
    props: BodyRowProps,
    data: function data() {
      var _store$getState = this.store.getState(),
          selectedRowKeys = _store$getState.selectedRowKeys;

      return {
        selected: selectedRowKeys.indexOf(this.rowKey) >= 0
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

        var store = this.store,
            rowKey = this.rowKey;

        this.unsubscribe = store.subscribe(function () {
          var _store$getState2 = _this.store.getState(),
              selectedRowKeys = _store$getState2.selectedRowKeys;

          var selected = selectedRowKeys.indexOf(rowKey) >= 0;
          if (selected !== _this.selected) {
            _this.selected = selected;
          }
        });
      }
    },

    render: function render() {
      var h = arguments[0];

      var className = (0, _defineProperty3['default'])({}, this.prefixCls + '-row-selected', this.selected);

      return h(
        Component,
        (0, _babelHelperVueJsxMergeProps2['default'])([{ 'class': className }, { on: this.$listeners }]),
        [this.$slots['default']]
      );
    }
  };

  return BodyRow;
}
module.exports = exports['default'];