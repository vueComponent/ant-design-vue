import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';

import { Store } from './createStore';

var BodyRowProps = {
  store: Store,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefixCls: PropTypes.string
};

export default function createTableRow() {
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

      var className = _defineProperty({}, this.prefixCls + '-row-selected', this.selected);

      return h(
        Component,
        _mergeJSXProps([{ 'class': className }, { on: this.$listeners }]),
        [this.$slots['default']]
      );
    }
  };

  return BodyRow;
}