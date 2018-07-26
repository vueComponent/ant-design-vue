import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import classNames from 'classnames';
import defaultRequest from './request';
import getUid from './uid';
import attrAccept from './attr-accept';

var upLoadPropTypes = {
  componentTag: PropTypes.string,
  // style: PropTypes.object,
  prefixCls: PropTypes.string,
  action: PropTypes.string,
  name: PropTypes.string,
  // className: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  // children: PropTypes.any,
  // onStart: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  headers: PropTypes.object,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  // onProgress: PropTypes.func,
  withCredentials: PropTypes.bool
};

var AjaxUploader = {
  name: 'ajaxUploader',
  mixins: [BaseMixin],
  props: upLoadPropTypes,
  data: function data() {
    this.reqs = {};
    return {
      uid: getUid()
    };
  },

  methods: {
    onChange: function onChange(e) {
      var files = e.target.files;
      this.uploadFiles(files);
      this.reset();
    },
    onClick: function onClick() {
      var el = this.$refs.fileInputRef;
      if (!el) {
        return;
      }
      el.click();
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter') {
        this.onClick();
      }
    },
    onFileDrop: function onFileDrop(e) {
      var _this = this;

      if (e.type === 'dragover') {
        e.preventDefault();
        return;
      }
      var files = Array.prototype.slice.call(e.dataTransfer.files).filter(function (file) {
        return attrAccept(file, _this.accept);
      });
      this.uploadFiles(files);

      e.preventDefault();
    },
    uploadFiles: function uploadFiles(files) {
      var _this2 = this;

      var postFiles = Array.prototype.slice.call(files);
      postFiles.forEach(function (file) {
        file.uid = getUid();
        _this2.upload(file, postFiles);
      });
    },
    upload: function upload(file, fileList) {
      var _this3 = this;

      if (!this.beforeUpload) {
        // always async in case use react state to keep fileList
        return setTimeout(function () {
          return _this3.post(file);
        }, 0);
      }

      var before = this.beforeUpload(file, fileList);
      if (before && before.then) {
        before.then(function (processedFile) {
          var processedFileType = Object.prototype.toString.call(processedFile);
          if (processedFileType === '[object File]' || processedFileType === '[object Blob]') {
            _this3.post(processedFile);
          } else {
            _this3.post(file);
          }
        })['catch'](function (e) {
          console && console.log(e); // eslint-disable-line
        });
      } else if (before !== false) {
        setTimeout(function () {
          return _this3.post(file);
        }, 0);
      }
    },
    post: function post(file) {
      var _this4 = this;

      if (!this._isMounted) {
        return;
      }
      var data = this.$props.data;

      if (typeof data === 'function') {
        data = data(file);
      }
      var uid = file.uid;

      var request = this.customRequest || defaultRequest;
      this.reqs[uid] = request({
        action: this.action,
        filename: this.name,
        file: file,
        data: data,
        headers: this.headers,
        withCredentials: this.withCredentials,
        onProgress: function onProgress(e) {
          _this4.$emit('progress', e, file);
        },
        onSuccess: function onSuccess(ret, xhr) {
          delete _this4.reqs[uid];
          _this4.$emit('success', ret, file, xhr);
        },
        onError: function onError(err, ret) {
          delete _this4.reqs[uid];
          _this4.$emit('error', err, ret, file);
        }
      });
      this.$emit('start', file);
    },
    reset: function reset() {
      this.setState({
        uid: getUid()
      });
    },
    abort: function abort(file) {
      var reqs = this.reqs;

      if (file) {
        var uid = file;
        if (file && file.uid) {
          uid = file.uid;
        }
        if (reqs[uid]) {
          reqs[uid].abort();
          delete reqs[uid];
        }
      } else {
        Object.keys(reqs).forEach(function (uid) {
          if (reqs[uid]) {
            reqs[uid].abort();
          }

          delete reqs[uid];
        });
      }
    }
  },
  mounted: function mounted() {
    var _this5 = this;

    this.$nextTick(function () {
      _this5._isMounted = true;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this._isMounted = false;
    this.abort();
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];
    var _$props = this.$props,
        Tag = _$props.componentTag,
        prefixCls = _$props.prefixCls,
        disabled = _$props.disabled,
        multiple = _$props.multiple,
        accept = _$props.accept;

    var cls = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _classNames));
    var events = disabled ? {} : {
      click: this.onClick,
      keydown: this.onKeyDown,
      drop: this.onFileDrop,
      dragover: this.onFileDrop
    };
    var tagProps = {
      on: _extends({}, events, this.$listeners),
      attrs: {
        role: 'button',
        tabIndex: disabled ? null : '0'
      },
      'class': cls
    };
    return h(
      Tag,
      tagProps,
      [h('input', {
        attrs: {
          type: 'file',

          accept: accept,
          multiple: multiple
        },
        ref: 'fileInputRef',
        key: this.uid,
        style: { display: 'none' }, on: {
          'change': this.onChange
        }
      }), this.$slots['default']]
    );
  }
};

export default AjaxUploader;