'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

require('../assets/index.less');

exports['default'] = {
  data: function data() {
    return {
      percent: 0
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.increase();
    });
  },

  methods: {
    increase: function increase() {
      var percent = this.percent + 1;
      if (percent >= 100) {
        clearTimeout(this.tm);
        return;
      }
      this.percent = percent;
      this.tm = setTimeout(this.increase, 10);
    },
    restart: function restart() {
      var _this2 = this;

      clearTimeout(this.tm);
      this.percent = 0;
      this.$nextTick(function () {
        _this2.increase();
      });
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 10px;width: 200px' },
      [h(_index.Circle, {
        attrs: { strokeWidth: '6', percent: this.percent }
      }), h(_index.Line, {
        attrs: { strokeWidth: '4', percent: this.percent }
      }), h(
        'button',
        {
          on: {
            'click': this.restart
          }
        },
        ['Restart']
      )]
    );
  }
};
module.exports = exports['default'];