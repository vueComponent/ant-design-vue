'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _uid = require('./uid');

var _uid2 = _interopRequireDefault(_uid);

var _attrAccept = require('./attr-accept');

var _attrAccept2 = _interopRequireDefault(_attrAccept);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var upLoadPropTypes = {
  componentTag: _vueTypes2['default'].string,
  // style: PropTypes.object,
  prefixCls: _vueTypes2['default'].string,
  action: _vueTypes2['default'].string,
  name: _vueTypes2['default'].string,
  // className: PropTypes.string,
  multiple: _vueTypes2['default'].bool,
  disabled: _vueTypes2['default'].bool,
  accept: _vueTypes2['default'].string,
  // children: PropTypes.any,
  // onStart: PropTypes.func,
  data: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].func]),
  headers: _vueTypes2['default'].object,
  beforeUpload: _vueTypes2['default'].func,
  customRequest: _vueTypes2['default'].func,
  // onProgress: PropTypes.func,
  withCredentials: _vueTypes2['default'].bool
};

var AjaxUploader = {
  name: 'ajaxUploader',
  mixins: [_BaseMixin2['default']],
  props: upLoadPropTypes,
  data: function data() {
    this.reqs = {};
    return {
      uid: (0, _uid2['default'])()
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
        return (0, _attrAccept2['default'])(file, _this.accept);
      });
      this.uploadFiles(files);

      e.preventDefault();
    },
    uploadFiles: function uploadFiles(files) {
      var _this2 = this;

      var postFiles = Array.prototype.slice.call(files);
      postFiles.forEach(function (file) {
        file.uid = (0, _uid2['default'])();
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

      var request = this.customRequest || _request2['default'];
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
        uid: (0, _uid2['default'])()
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

    var cls = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls, true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), _classNames));
    var events = disabled ? {} : {
      click: this.onClick,
      keydown: this.onKeyDown,
      drop: this.onFileDrop,
      dragover: this.onFileDrop
    };
    var tagProps = {
      on: (0, _extends3['default'])({}, events, this.$listeners),
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

exports['default'] = AjaxUploader;
module.exports = exports['default'];