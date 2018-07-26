'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getNumberArray(num) {
  return num ? num.toString().split('').reverse().map(function (i) {
    return Number(i);
  }) : [];
}

var ScrollNumberProps = {
  prefixCls: _vueTypes2['default'].string.def('ant-scroll-number'),
  count: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string, null]).def(null),
  component: _vueTypes2['default'].string,
  title: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string])
};

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: ScrollNumberProps,
  data: function data() {
    return {
      animateStarted: true,
      sCount: this.count
    };
  },

  watch: {
    count: function count(val) {
      var _this = this;

      if (this.sCount !== val) {
        this.lastCount = this.sCount;
        // 复原数字初始位置
        this.setState({
          animateStarted: true
        }, function () {
          // 等待数字位置复原完毕
          // 开始设置完整的数字
          setTimeout(function () {
            _this.setState({
              animateStarted: false,
              sCount: val
            }, function () {
              _this.$emit('animated');
            });
          }, 5);
        });
      }
    }
  },
  methods: {
    getPositionByNum: function getPositionByNum(num, i) {
      if (this.animateStarted) {
        return 10 + num;
      }
      var currentDigit = getNumberArray(this.sCount)[i];
      var lastDigit = getNumberArray(this.lastCount)[i];
      // 同方向则在同一侧切换数字
      if (this.sCount > this.lastCount) {
        if (currentDigit >= lastDigit) {
          return 10 + num;
        }
        return 20 + num;
      }
      if (currentDigit <= lastDigit) {
        return 10 + num;
      }
      return num;
    },
    renderNumberList: function renderNumberList(position) {
      var h = this.$createElement;

      var childrenToReturn = [];
      for (var i = 0; i < 30; i++) {
        var currentClassName = position === i ? 'current' : '';
        childrenToReturn.push(h(
          'p',
          { key: i.toString(), 'class': currentClassName },
          [i % 10]
        ));
      }
      return childrenToReturn;
    },
    renderCurrentNumber: function renderCurrentNumber(num, i) {
      var h = this.$createElement;

      var position = this.getPositionByNum(num, i);
      var removeTransition = this.animateStarted || getNumberArray(this.lastCount)[i] === undefined;
      var style = {
        transition: removeTransition ? 'none' : undefined,
        msTransform: 'translateY(' + -position * 100 + '%)',
        WebkitTransform: 'translateY(' + -position * 100 + '%)',
        transform: 'translateY(' + -position * 100 + '%)'
      };
      return h(
        'span',
        { 'class': this.prefixCls + '-only', style: style, key: i },
        [this.renderNumberList(position)]
      );
    },
    renderNumberElement: function renderNumberElement() {
      var _this2 = this;

      var sCount = this.sCount;

      if (!sCount || isNaN(sCount)) {
        return sCount;
      }
      return getNumberArray(sCount).map(function (num, i) {
        return _this2.renderCurrentNumber(num, i);
      }).reverse();
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        title = this.title,
        _component = this.component,
        Tag = _component === undefined ? 'sup' : _component;

    var style = (0, _propsUtil.getStyle)(this, true);
    // fix https://fb.me/react-unknown-prop
    var restProps = (0, _omit2['default'])(this.$props, ['count', 'component', 'prefixCls']);
    var newProps = {
      props: (0, _extends3['default'])({}, restProps, {
        title: title
      }),
      'class': prefixCls,
      style: style
      // allow specify the border
      // mock border-color by box-shadow for compatible with old usage:
      // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />
    };if (style && style.borderColor) {
      newProps.style.boxShadow = '0 0 0 1px ' + style.borderColor + ' inset';
    }
    return h(
      Tag,
      newProps,
      [this.renderNumberElement()]
    );
  }
};
module.exports = exports['default'];