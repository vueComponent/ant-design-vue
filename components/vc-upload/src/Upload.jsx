import PropTypes from '../../_util/vue-types';
import { initDefaultProps, getSlot } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import AjaxUpload from './AjaxUploader';
import IframeUpload from './IframeUploader';
import { defineComponent, nextTick } from 'vue';

function empty() {}

const uploadProps = {
  componentTag: PropTypes.string,
  prefixCls: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  name: PropTypes.string,
  multipart: PropTypes.looseBool,
  directory: PropTypes.looseBool,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  onProgress: PropTypes.func,
  onStart: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  headers: PropTypes.object,
  accept: PropTypes.string,
  multiple: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  onReady: PropTypes.func,
  withCredentials: PropTypes.looseBool,
  supportServerRender: PropTypes.looseBool,
  openFileDialogOnClick: PropTypes.looseBool,
  method: PropTypes.string,
};
export default defineComponent({
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
    onReady: empty,
    onStart: empty,
    onError: empty,
    onSuccess: empty,
    supportServerRender: false,
    multiple: false,
    beforeUpload: empty,
    withCredentials: false,
    openFileDialogOnClick: true,
  }),
  data() {
    this.Component = null;
    return {
      // Component: null, // 组件作为响应式数据，性能比较低，采用强制刷新
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.supportServerRender) {
        this.Component = this.getComponent();
        this.$forceUpdate();
        nextTick(() => {
          this.__emit('ready');
        });
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
      ...this.$props,
      ref: 'uploaderRef',
      ...this.$attrs,
    };
    if (this.supportServerRender) {
      const ComponentUploader = this.Component;
      if (ComponentUploader) {
        return <ComponentUploader {...componentProps}>{getSlot(this)}</ComponentUploader>;
      }
      return null;
    }
    const ComponentUploader = this.getComponent();
    return <ComponentUploader {...componentProps}>{getSlot(this)}</ComponentUploader>;
  },
});
