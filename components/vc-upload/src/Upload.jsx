import PropTypes from '../../_util/vue-types';
import { initDefaultProps, getListeners } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import AjaxUpload from './AjaxUploader';
import IframeUpload from './IframeUploader';

function empty() {}

const uploadProps = {
  componentTag: PropTypes.string,
  prefixCls: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  name: PropTypes.string,
  multipart: PropTypes.bool,
  directory: PropTypes.bool,
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
  supportServerRender: PropTypes.bool,
  openFileDialogOnClick: PropTypes.bool,
};
export default {
  name: 'Upload',
  mixins: [BaseMixin],
  inheritAttrs: false,
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
    withCredentials: false,
    openFileDialogOnClick: true,
  }),
  data() {
    return {
      Component: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.supportServerRender) {
        this.setState(
          {
            Component: this.getComponent(),
          },
          () => {
            this.$emit('ready');
          },
        );
      }
    });
  },
  methods: {
    getComponent() {
      return typeof File !== 'undefined' ? AjaxUpload : IframeUpload;
    },
    abort(file) {
      this.$refs.uploaderRef.abort(file);
    },
  },

  render() {
    const componentProps = {
      props: {
        ...this.$props,
      },
      on: getListeners(this),
      ref: 'uploaderRef',
      attrs: this.$attrs,
    };
    if (this.supportServerRender) {
      const ComponentUploader = this.Component;
      if (ComponentUploader) {
        return <ComponentUploader {...componentProps}>{this.$slots.default}</ComponentUploader>;
      }
      return null;
    }
    const ComponentUploader = this.getComponent();
    return <ComponentUploader {...componentProps}>{this.$slots.default}</ComponentUploader>;
  },
};
