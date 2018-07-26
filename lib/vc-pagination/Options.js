'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _KeyCode = require('./KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: {
    rootPrefixCls: _vueTypes2['default'].String,
    selectPrefixCls: _vueTypes2['default'].String,
    changeSize: _vueTypes2['default'].func,
    quickGo: _vueTypes2['default'].func,
    selectComponentClass: _vueTypes2['default'].any,
    current: _vueTypes2['default'].number,
    pageSizeOptions: _vueTypes2['default'].array.def(['10', '20', '30', '40']),
    pageSize: _vueTypes2['default'].number,
    buildOptionText: _vueTypes2['default'].func,
    locale: _vueTypes2['default'].object,
    goButton: _vueTypes2['default'].any
  },
  data: function data() {
    return {
      goInputText: '',
      stateCurrent: this.current
    };
  },

  methods: {
    defaultBuildOptionText: function defaultBuildOptionText(opt) {
      return opt.value + ' ' + this.locale.items_per_page;
    },
    handleChange: function handleChange(e) {
      this.setState({
        goInputText: e.target.value
      });
    },
    go: function go(e) {
      var val = this.goInputText;
      if (val === '') {
        return;
      }
      val = Number(val);
      if (isNaN(val)) {
        val = this.stateCurrent;
      }
      if (e.keyCode === _KeyCode2['default'].ENTER || e.type === 'click') {
        this.setState({
          goInputText: '',
          stateCurrent: this.quickGo(val)
        });
      }
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var rootPrefixCls = this.rootPrefixCls,
        locale = this.locale,
        changeSize = this.changeSize,
        quickGo = this.quickGo,
        goButton = this.goButton,
        Select = this.selectComponentClass,
        defaultBuildOptionText = this.defaultBuildOptionText;

    var prefixCls = rootPrefixCls + '-options';
    var changeSelect = null;
    var goInput = null;
    var gotoButton = null;

    if (!(changeSize || quickGo)) {
      return null;
    }

    if (changeSize && Select) {
      var Option = Select.Option;
      var pageSize = this.pageSize || this.pageSizeOptions[0];
      var buildOptionText = this.buildOptionText || defaultBuildOptionText;
      var options = this.pageSizeOptions.map(function (opt, i) {
        return h(
          Option,
          { key: i, attrs: { value: opt }
          },
          [buildOptionText({ value: opt })]
        );
      });

      changeSelect = h(
        Select,
        {
          attrs: {
            prefixCls: this.selectPrefixCls,
            showSearch: false,

            optionLabelProp: 'children',
            dropdownMatchSelectWidth: false,
            value: pageSize.toString(),

            getPopupContainer: function getPopupContainer(triggerNode) {
              return triggerNode.parentNode;
            }
          },
          'class': prefixCls + '-size-changer', on: {
            'change': function change(value) {
              return _this.changeSize(Number(value));
            }
          }
        },
        [options]
      );
    }

    if (quickGo) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = h(
            'button',
            {
              attrs: {
                type: 'button'
              },
              on: {
                'click': this.go,
                'keyup': this.go
              }
            },
            [locale.jump_to_confirm]
          );
        } else {
          gotoButton = h(
            'span',
            {
              on: {
                'click': this.go,
                'keyup': this.go
              }
            },
            [goButton]
          );
        }
      }
      goInput = h(
        'div',
        { 'class': prefixCls + '-quick-jumper' },
        [locale.jump_to, h('input', {
          attrs: {
            type: 'text'
          },
          domProps: {
            'value': this.goInputText
          },
          on: {
            'input': this.handleChange,
            'keyup': this.go
          }
        }), locale.page, gotoButton]
      );
    }

    return h(
      'li',
      { 'class': '' + prefixCls },
      [changeSelect, goInput]
    );
  }
};
module.exports = exports['default'];