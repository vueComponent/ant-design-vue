import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import AjaxUpload from './AjaxUploader';
import IframeUpload from './IframeUploader';

function empty() {}

var uploadProps = {
  componentTag: PropTypes.string,
  prefixCls: PropTypes.string,
  action: PropTypes.string,
  name: PropTypes.string,
  multipart: PropTypes.bool,
  // onError: PropTypes.func,
  // onSuccess: PropTypes.func,
  // onProgress: PropTypes.func,
  // onStart: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  headers: PropTypes.object,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  // onReady: PropTypes.func,
  withCredentials: PropTypes.bool,
  supportServerRender: PropTypes.bool
};
export default {
  name: 'Upload',
  mixins: [BaseMixin],
  props: initDefaultProps(uploadProps, {
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
      return typeof File !== 'undefined' ? AjaxUpload : IframeUpload;
    },
    abort: function abort(file) {
      this.$refs.uploaderRef.abort(file);
    }
  },

  render: function render() {
    var h = arguments[0];

    var componentProps = {
      props: _extends({}, this.$props),
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