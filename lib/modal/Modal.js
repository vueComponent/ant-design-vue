'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcDialog = require('../vc-dialog');

var _vcDialog2 = _interopRequireDefault(_vcDialog);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _buttonTypes = require('../button/buttonTypes');

var _buttonTypes2 = _interopRequireDefault(_buttonTypes);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _locale = require('./locale');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ButtonType = (0, _buttonTypes2['default'])().type;


var mousePosition = null;
var mousePositionEventBinded = false;
function noop() {}
var modalProps = function modalProps() {
  var defaultProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: _vueTypes2['default'].string,
    /** 对话框是否可见*/
    visible: _vueTypes2['default'].bool,
    /** 确定按钮 loading*/
    confirmLoading: _vueTypes2['default'].bool,
    /** 标题*/
    title: _vueTypes2['default'].any,
    /** 是否显示右上角的关闭按钮*/
    closable: _vueTypes2['default'].bool,
    /** 点击确定回调*/
    // onOk: (e: React.MouseEvent<any>) => void,
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
    // onCancel: (e: React.MouseEvent<any>) => void,
    afterClose: _vueTypes2['default'].func.def(noop),
    /** 宽度*/
    width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    /** 底部内容*/
    footer: _vueTypes2['default'].any,
    /** 确认按钮文字*/
    okText: _vueTypes2['default'].string,
    /** 确认按钮类型*/
    okType: ButtonType,
    /** 取消按钮文字*/
    cancelText: _vueTypes2['default'].string,
    /** 点击蒙层是否允许关闭*/
    maskClosable: _vueTypes2['default'].bool,
    destroyOnClose: _vueTypes2['default'].bool,
    wrapClassName: _vueTypes2['default'].string,
    maskTransitionName: _vueTypes2['default'].string,
    transitionName: _vueTypes2['default'].string,
    getContainer: _vueTypes2['default'].func,
    zIndex: _vueTypes2['default'].number,
    bodyStyle: _vueTypes2['default'].object,
    maskStyle: _vueTypes2['default'].object,
    mask: _vueTypes2['default'].bool,
    keyboard: _vueTypes2['default'].bool
  };
  return (0, _propsUtil.initDefaultProps)(props, defaultProps);
};

exports['default'] = {
  name: 'AModal',
  props: modalProps({
    prefixCls: 'ant-modal',
    width: 520,
    transitionName: 'zoom',
    maskTransitionName: 'fade',
    confirmLoading: false,
    visible: false,
    okType: 'primary'
  }),
  model: {
    prop: 'visible',
    event: 'change'
  },
  // static info: ModalFunc;
  // static success: ModalFunc;
  // static error: ModalFunc;
  // static warn: ModalFunc;
  // static warning: ModalFunc;
  // static confirm: ModalFunc;
  methods: {
    handleCancel: function handleCancel(e) {
      this.$emit('cancel', e);
      this.$emit('change', false);
    },
    handleOk: function handleOk(e) {
      this.$emit('ok', e);
    },
    renderFooter: function renderFooter(locale) {
      var h = this.$createElement;
      var okType = this.okType,
          confirmLoading = this.confirmLoading;

      return h('div', [h(
        _button2['default'],
        {
          on: {
            'click': this.handleCancel
          }
        },
        [(0, _propsUtil.getComponentFromProp)(this, 'cancelText') || locale.cancelText]
      ), h(
        _button2['default'],
        {
          attrs: {
            type: okType,
            loading: confirmLoading
          },
          on: {
            'click': this.handleOk
          }
        },
        [(0, _propsUtil.getComponentFromProp)(this, 'okText') || locale.okText]
      )]);
    }
  },
  mounted: function mounted() {
    if (mousePositionEventBinded) {
      return;
    }
    // 只有点击事件支持从鼠标位置动画展开
    (0, _addEventListener2['default'])(document.documentElement, 'click', function (e) {
      mousePosition = {
        x: e.pageX,
        y: e.pageY
        // 100ms 内发生过点击事件，则从点击位置动画展示
        // 否则直接 zoom 展示
        // 这样可以兼容非点击方式展开
      };setTimeout(function () {
        mousePosition = null;
      }, 100);
    });
    mousePositionEventBinded = true;
  },
  render: function render() {
    var h = arguments[0];
    var visible = this.visible,
        $listeners = this.$listeners,
        $slots = this.$slots;


    var defaultFooter = h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Modal',
        defaultLocale: (0, _locale.getConfirmLocale)(),
        children: this.renderFooter
      }
    });
    var footer = (0, _propsUtil.getComponentFromProp)(this, 'footer');
    var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var dialogProps = {
      props: (0, _extends3['default'])({}, this.$props, {
        title: title,
        footer: footer === undefined ? defaultFooter : footer,
        visible: visible,
        mousePosition: mousePosition
      }),
      on: (0, _extends3['default'])({}, $listeners, {
        close: this.handleCancel
      }),
      'class': (0, _propsUtil.getClass)(this),
      style: (0, _propsUtil.getStyle)(this)
    };
    return h(
      _vcDialog2['default'],
      dialogProps,
      [$slots['default']]
    );
  }
};
module.exports = exports['default'];