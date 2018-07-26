'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../../_util/props-util');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _AjaxUploader = require('./AjaxUploader');

var _AjaxUploader2 = _interopRequireDefault(_AjaxUploader);

var _IframeUploader = require('./IframeUploader');

var _IframeUploader2 = _interopRequireDefault(_IframeUploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function empty() {}

var uploadProps = {
  componentTag: _vueTypes2['default'].string,
  prefixCls: _vueTypes2['default'].string,
  action: _vueTypes2['default'].string,
  name: _vueTypes2['default'].string,
  multipart: _vueTypes2['default'].bool,
  // onError: PropTypes.func,
  // onSuccess: PropTypes.func,
  // onProgress: PropTypes.func,
  // onStart: PropTypes.func,
  data: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].func]),
  headers: _vueTypes2['default'].object,
  accept: _vueTypes2['default'].string,
  multiple: _vueTypes2['default'].bool,
  disabled: _vueTypes2['default'].bool,
  beforeUpload: _vueTypes2['default'].func,
  customRequest: _vueTypes2['default'].func,
  // onReady: PropTypes.func,
  withCredentials: _vueTypes2['default'].bool,
  supportServerRender: _vueTypes2['default'].bool
};
exports['default'] = {
  name: 'Upload',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(uploadProps, {
    componentTag: 'span',
    prefixCls: 'rc-upload',
    data: {},
    headers: {},
    name: 'file',
    multipart: false,
    // onReady: empty,
    // onStart: empty,
    // onError: empty,
    // onSuccess: empty,
    supportServerRender: false,
    multiple: false,
    beforeUpload: empty,
    withCredentials: false
  }),
  data: function data() {
    return {
      Component: null
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.supportServerRender) {
        /* eslint react/no-did-mount-set-state:0 */
        _this.setState({
          Component: _this.getComponent()
        }, function () {
          _this.$emit('ready');
        });
      }
    });
  },

  methods: {
    getComponent: function getComponent() {
      return typeof File !== 'undefined' ? _AjaxUploader2['default'] : _IframeUploader2['default'];
    },
    abort: function abort(file) {
      this.$refs.uploaderRef.abort(file);
    }
  },

  render: function render() {
    var h = arguments[0];

    var componentProps = {
      props: (0, _extends3['default'])({}, this.$props),
      on: this.$listeners,
      ref: 'uploaderRef'
    };
    if (this.supportServerRender) {
      var _ComponentUploader = this.Component;
      if (_ComponentUploader) {
        return h(
          _ComponentUploader,
          componentProps,
          [this.$slots['default']]
        );
      }
      return null;
    }
    var ComponentUploader = this.getComponent();
    return h(
      ComponentUploader,
      componentProps,
      [this.$slots['default']]
    );
  }
};
module.exports = exports['default'];