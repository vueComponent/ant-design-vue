'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Pager',
  props: {
    rootPrefixCls: _vueTypes2['default'].string,
    page: _vueTypes2['default'].number,
    active: _vueTypes2['default'].bool,
    last: _vueTypes2['default'].bool,
    locale: _vueTypes2['default'].object,
    showTitle: _vueTypes2['default'].bool,
    itemRender: {
      type: Function,
      'default': function _default() {}
    }
  },
  computed: {
    classes: function classes() {
      var prefixCls = this.rootPrefixCls + '-item';
      var cls = prefixCls + ' ' + prefixCls + '-' + this.page;
      if (this.active) {
        cls = cls + ' ' + prefixCls + '-active';
      }
      return cls;
    }
  },
  methods: {
    handleClick: function handleClick() {
      this.$emit('click', this.page);
    },
    handleKeyPress: function handleKeyPress(event) {
      this.$emit('keypress', event, this.handleClick, this.page);
    }
  },
  render: function render() {
    var h = arguments[0];
    var rootPrefixCls = this.rootPrefixCls,
        page = this.page,
        active = this.active;

    var prefixCls = rootPrefixCls + '-item';
    var cls = prefixCls + ' ' + prefixCls + '-' + page;

    if (active) {
      cls = cls + ' ' + prefixCls + '-active';
    }

    return h(
      'li',
      {
        'class': cls,
        on: {
          'click': this.handleClick,
          'keypress': this.handleKeyPress
        },
        attrs: {
          title: this.showTitle ? this.page : null,
          tabIndex: '0'
        }
      },
      [this.itemRender(this.page, 'page', h('a', [this.page]))]
    );
  }
};
module.exports = exports['default'];