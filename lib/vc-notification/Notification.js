'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _createChainedFunction = require('../_util/createChainedFunction');

var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _Notice = require('./Notice');

var _Notice2 = _interopRequireDefault(_Notice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var seed = 0;
var now = Date.now();

function getUuid() {
  return 'rcNotification_' + now + '_' + seed++;
}

var Notification = {
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string.def('rc-notification'),
    transitionName: _vueTypes2['default'].string,
    animation: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]).def('fade')
  },
  data: function data() {
    return {
      notices: []
    };
  },

  methods: {
    getTransitionName: function getTransitionName() {
      var props = this.$props;
      var transitionName = props.transitionName;
      if (!transitionName && props.animation) {
        transitionName = props.prefixCls + '-' + props.animation;
      }
      return transitionName;
    },
    add: function add(notice) {
      var key = notice.key = notice.key || getUuid();
      this.setState(function (previousState) {
        var notices = previousState.notices;
        if (!notices.filter(function (v) {
          return v.key === key;
        }).length) {
          return {
            notices: notices.concat(notice)
          };
        }
      });
    },
    remove: function remove(key) {
      this.setState(function (previousState) {
        return {
          notices: previousState.notices.filter(function (notice) {
            return notice.key !== key;
          })
        };
      });
    }
  },

  render: function render(h) {
    var _this = this;

    var prefixCls = this.prefixCls,
        notices = this.notices,
        remove = this.remove,
        getTransitionName = this.getTransitionName;

    var transitionProps = (0, _getTransitionProps2['default'])(getTransitionName());
    var noticeNodes = notices.map(function (notice) {
      var content = notice.content,
          duration = notice.duration,
          closable = notice.closable,
          onClose = notice.onClose,
          key = notice.key,
          style = notice.style,
          className = notice['class'];

      var close = (0, _createChainedFunction2['default'])(remove.bind(_this, key), onClose);
      var noticeProps = {
        props: {
          prefixCls: prefixCls,
          duration: duration,
          closable: closable
        },
        on: {
          close: close
        },
        style: style,
        'class': className,
        key: key
      };
      return h(
        _Notice2['default'],
        noticeProps,
        [content(h)]
      );
    });
    var className = (0, _defineProperty3['default'])({}, prefixCls, 1);
    var style = (0, _propsUtil.getStyle)(this);
    return h(
      'div',
      { 'class': className, style: style || {
          top: '65px',
          left: '50%'
        } },
      [h(
        'transition-group',
        transitionProps,
        [noticeNodes]
      )]
    );
  }
};

Notification.newInstance = function newNotificationInstance(properties, callback) {
  var _ref = properties || {},
      getContainer = _ref.getContainer,
      style = _ref.style,
      className = _ref['class'],
      props = (0, _objectWithoutProperties3['default'])(_ref, ['getContainer', 'style', 'class']);

  var div = document.createElement('div');
  if (getContainer) {
    var root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
  new _vue2['default']({
    el: div,
    mounted: function mounted() {
      var self = this;
      this.$nextTick(function () {
        callback({
          notice: function notice(noticeProps) {
            self.$refs.notification.add(noticeProps);
          },
          removeNotice: function removeNotice(key) {
            self.$refs.notification.remove(key);
          },

          component: self,
          destroy: function destroy() {
            self.$destroy();
            self.$el.parentNode.removeChild(self.$el);
          }
        });
      });
    },
    render: function render() {
      var h = arguments[0];

      var p = {
        props: props,
        ref: 'notification',
        style: style,
        'class': className
      };
      return h(Notification, p);
    }
  });
};

exports['default'] = Notification;
module.exports = exports['default'];