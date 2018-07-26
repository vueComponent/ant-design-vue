'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _dropdown = require('../dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _menu = require('../menu');

var _menu2 = _interopRequireDefault(_menu);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _interface = require('./interface');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  props: _interface.SelectionCheckboxAllProps,
  name: 'SelectionCheckboxAll',
  mixins: [_BaseMixin2['default']],
  data: function data() {
    var props = this.$props;

    this.defaultSelections = props.hideDefaultSelections ? [] : [{
      key: 'all',
      text: props.locale.selectAll,
      onSelect: function onSelect() {}
    }, {
      key: 'invert',
      text: props.locale.selectInvert,
      onSelect: function onSelect() {}
    }];

    return {
      checked: this.getCheckState(props),
      indeterminate: this.getIndeterminateState(props)
    };
  },
  mounted: function mounted() {
    this.subscribe();
  },


  watch: {
    '$props': {
      handler: function handler() {
        this.setCheckState();
      },
      deep: true
    }
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
        _this.setCheckState();
      });
    },
    checkSelection: function checkSelection(data, type, byDefaultChecked) {
      var store = this.store,
          getCheckboxPropsByItem = this.getCheckboxPropsByItem,
          getRecordKey = this.getRecordKey;
      // type should be 'every' | 'some'

      if (type === 'every' || type === 'some') {
        return byDefaultChecked ? data[type](function (item, i) {
          return getCheckboxPropsByItem(item, i).props.defaultChecked;
        }) : data[type](function (item, i) {
          return store.getState().selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0;
        });
      }
      return false;
    },
    setCheckState: function setCheckState() {
      var checked = this.getCheckState();
      var indeterminate = this.getIndeterminateState();
      if (checked !== this.checked) {
        this.setState({ checked: checked });
      }
      if (indeterminate !== this.indeterminate) {
        this.setState({ indeterminate: indeterminate });
      }
    },
    getCheckState: function getCheckState() {
      var store = this.store,
          data = this.data;

      var checked = void 0;
      if (!data.length) {
        checked = false;
      } else {
        checked = store.getState().selectionDirty ? this.checkSelection(data, 'every', false) : this.checkSelection(data, 'every', false) || this.checkSelection(data, 'every', true);
      }
      return checked;
    },
    getIndeterminateState: function getIndeterminateState() {
      var store = this.store,
          data = this.data;

      var indeterminate = void 0;
      if (!data.length) {
        indeterminate = false;
      } else {
        indeterminate = store.getState().selectionDirty ? this.checkSelection(data, 'some', false) && !this.checkSelection(data, 'every', false) : this.checkSelection(data, 'some', false) && !this.checkSelection(data, 'every', false) || this.checkSelection(data, 'some', true) && !this.checkSelection(data, 'every', true);
      }
      return indeterminate;
    },
    handleSelectAllChagne: function handleSelectAllChagne(e) {
      var checked = e.target.checked;
      this.$emit('select', checked ? 'all' : 'removeAll', 0, null);
    },
    renderMenus: function renderMenus(selections) {
      var _this2 = this;

      var h = this.$createElement;

      return selections.map(function (selection, index) {
        return h(
          _menu2['default'].Item,
          {
            key: selection.key || index
          },
          [h(
            'div',
            {
              on: {
                'click': function click() {
                  _this2.$emit('select', selection.key, index, selection.onSelect);
                }
              }
            },
            [selection.text]
          )]
        );
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var disabled = this.disabled,
        prefixCls = this.prefixCls,
        selections = this.selections,
        getPopupContainer = this.getPopupContainer,
        checked = this.checked,
        indeterminate = this.indeterminate;


    var selectionPrefixCls = prefixCls + '-selection';

    var customSelections = null;

    if (selections) {
      var newSelections = Array.isArray(selections) ? this.defaultSelections.concat(selections) : this.defaultSelections;

      var menu = h(
        _menu2['default'],
        {
          'class': selectionPrefixCls + '-menu',
          attrs: { selectedKeys: []
          }
        },
        [this.renderMenus(newSelections)]
      );

      customSelections = newSelections.length > 0 ? h(
        _dropdown2['default'],
        {
          attrs: {
            getPopupContainer: getPopupContainer
          }
        },
        [h(
          'template',
          { slot: 'overlay' },
          [menu]
        ), h(
          'div',
          { 'class': selectionPrefixCls + '-down' },
          [h(_icon2['default'], {
            attrs: { type: 'down' }
          })]
        )]
      ) : null;
    }

    return h(
      'div',
      { 'class': selectionPrefixCls },
      [h(_checkbox2['default'], {
        'class': (0, _classnames2['default'])((0, _defineProperty3['default'])({}, selectionPrefixCls + '-select-all-custom', customSelections)),
        attrs: { checked: checked,
          indeterminate: indeterminate,
          disabled: disabled
        },
        on: {
          'change': this.handleSelectAllChagne
        }
      }), customSelections]
    );
  }
};
module.exports = exports['default'];