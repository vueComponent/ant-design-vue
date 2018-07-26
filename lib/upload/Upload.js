'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uniqBy = require('lodash/uniqBy');

var _uniqBy2 = _interopRequireDefault(_uniqBy);

var _vcUpload = require('../vc-upload');

var _vcUpload2 = _interopRequireDefault(_vcUpload);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _default = require('../locale-provider/default');

var _default2 = _interopRequireDefault(_default);

var _Dragger = require('./Dragger');

var _Dragger2 = _interopRequireDefault(_Dragger);

var _UploadList = require('./UploadList');

var _UploadList2 = _interopRequireDefault(_UploadList);

var _interface = require('./interface');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports.UploadProps = _interface.UploadProps;
exports['default'] = {
  name: 'AUpload',
  Dragger: _Dragger2['default'],
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(_interface.UploadProps, {
    prefixCls: 'ant-upload',
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    beforeUpload: _utils.T,
    showUploadList: true,
    listType: 'text', // or pictrue
    disabled: false,
    supportServerRender: true
  }),
  // recentUploadStatus: boolean | PromiseLike<any>;
  data: function data() {
    this.progressTimer = null;
    return {
      sFileList: this.fileList || this.defaultFileList || [],
      dragState: 'drop'
    };
  },
  beforeDestroy: function beforeDestroy() {
    this.clearProgressTimer();
  },

  watch: {
    fileList: function fileList(val) {
      this.sFileList = val;
    }
  },
  methods: {
    onStart: function onStart(file) {
      var nextFileList = this.sFileList.concat();
      var targetItem = (0, _utils.fileToObject)(file);
      targetItem.status = 'uploading';
      nextFileList.push(targetItem);
      this.onChange({
        file: targetItem,
        fileList: nextFileList
      });
      // fix ie progress
      if (!window.FormData) {
        this.autoUpdateProgress(0, targetItem);
      }
    },
    autoUpdateProgress: function autoUpdateProgress(_, file) {
      var _this = this;

      var getPercent = (0, _utils.genPercentAdd)();
      var curPercent = 0;
      this.clearProgressTimer();
      this.progressTimer = setInterval(function () {
        curPercent = getPercent(curPercent);
        _this.onProgress({
          percent: curPercent
        }, file);
      }, 200);
    },
    onSuccess: function onSuccess(response, file) {
      this.clearProgressTimer();
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
      } catch (e) {/* do nothing */
      }
      var fileList = this.sFileList;
      var targetItem = (0, _utils.getFileItem)(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.status = 'done';
      targetItem.response = response;
      this.onChange({
        file: (0, _extends3['default'])({}, targetItem),
        fileList: fileList
      });
    },
    onProgress: function onProgress(e, file) {
      var fileList = this.sFileList;
      var targetItem = (0, _utils.getFileItem)(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.percent = e.percent;
      this.onChange({
        event: e,
        file: (0, _extends3['default'])({}, targetItem),
        fileList: this.sFileList
      });
    },
    onError: function onError(error, response, file) {
      this.clearProgressTimer();
      var fileList = this.sFileList;
      var targetItem = (0, _utils.getFileItem)(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';
      this.onChange({
        file: (0, _extends3['default'])({}, targetItem),
        fileList: fileList
      });
    },
    handleRemove: function handleRemove(file) {
      var _this2 = this;

      Promise.resolve(this.$emit('remove', file)).then(function (ret) {
        // Prevent removing file
        if (ret === false) {
          return;
        }

        var removedFileList = (0, _utils.removeFileItem)(file, _this2.sFileList);
        if (removedFileList) {
          _this2.onChange({
            file: file,
            fileList: removedFileList
          });
        }
      });
    },
    handleManualRemove: function handleManualRemove(file) {
      this.$refs.uploadRef.abort(file);
      file.status = 'removed'; // eslint-disable-line
      this.handleRemove(file);
    },
    onChange: function onChange(info) {
      if (!(0, _propsUtil.hasProp)(this, 'fileList')) {
        this.setState({ sFileList: info.fileList });
      }
      this.$emit('change', info);
    },
    onFileDrop: function onFileDrop(e) {
      this.setState({
        dragState: e.type
      });
    },
    reBeforeUpload: function reBeforeUpload(file, fileList) {
      if (!this.beforeUpload) {
        return true;
      }
      var result = this.beforeUpload(file, fileList);
      if (result === false) {
        this.onChange({
          file: file,
          fileList: (0, _uniqBy2['default'])(fileList.concat(this.sFileList), function (item) {
            return item.uid;
          })
        });
        return false;
      } else if (result && result.then) {
        return result;
      }
      return true;
    },
    clearProgressTimer: function clearProgressTimer() {
      clearInterval(this.progressTimer);
    },
    renderUploadList: function renderUploadList(locale) {
      var h = this.$createElement;

      var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
          _getOptionProps$showU = _getOptionProps.showUploadList,
          showUploadList = _getOptionProps$showU === undefined ? {} : _getOptionProps$showU,
          listType = _getOptionProps.listType;

      var showRemoveIcon = showUploadList.showRemoveIcon,
          showPreviewIcon = showUploadList.showPreviewIcon;

      var uploadListProps = {
        props: {
          listType: listType,
          items: this.sFileList,
          showRemoveIcon: showRemoveIcon,
          showPreviewIcon: showPreviewIcon,
          locale: (0, _extends3['default'])({}, locale, this.$props.locale)
        },
        on: {
          remove: this.handleManualRemove
        }
      };
      if (this.$listeners.preview) {
        uploadListProps.on.preview = this.$listeners.preview;
      }
      return h(_UploadList2['default'], uploadListProps);
    }
  },
  render: function render() {
    var _classNames2;

    var h = arguments[0];

    var _getOptionProps2 = (0, _propsUtil.getOptionProps)(this),
        _getOptionProps2$pref = _getOptionProps2.prefixCls,
        prefixCls = _getOptionProps2$pref === undefined ? '' : _getOptionProps2$pref,
        showUploadList = _getOptionProps2.showUploadList,
        listType = _getOptionProps2.listType,
        type = _getOptionProps2.type,
        disabled = _getOptionProps2.disabled;

    var vcUploadProps = {
      props: (0, _extends3['default'])({}, this.$props, {
        beforeUpload: this.reBeforeUpload
      }),
      on: {
        // ...this.$listeners,
        start: this.onStart,
        error: this.onError,
        progress: this.onProgress,
        success: this.onSuccess
      },
      ref: 'uploadRef',
      'class': prefixCls + '-btn'
    };

    var uploadList = showUploadList ? h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Upload',
        defaultLocale: _default2['default'].Upload,
        children: this.renderUploadList
      }
    }) : null;

    var children = this.$slots['default'];

    if (type === 'drag') {
      var _classNames;

      var dragCls = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-drag', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-drag-uploading', this.sFileList.some(function (file) {
        return file.status === 'uploading';
      })), (0, _defineProperty3['default'])(_classNames, prefixCls + '-drag-hover', this.dragState === 'dragover'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), _classNames));
      return h('span', [h(
        'div',
        {
          'class': dragCls,
          on: {
            'drop': this.onFileDrop,
            'dragover': this.onFileDrop,
            'dragleave': this.onFileDrop
          }
        },
        [h(
          _vcUpload2['default'],
          vcUploadProps,
          [h(
            'div',
            { 'class': prefixCls + '-drag-container' },
            [children]
          )]
        )]
      ), uploadList]);
    }

    var uploadButtonCls = (0, _classnames2['default'])(prefixCls, (_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-select', true), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-select-' + listType, true), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-disabled', disabled), _classNames2));
    var uploadButton = h(
      'div',
      { 'class': uploadButtonCls, style: { display: children ? '' : 'none' } },
      [h(
        _vcUpload2['default'],
        vcUploadProps,
        [children]
      )]
    );

    if (listType === 'picture-card') {
      return h('span', [uploadList, uploadButton]);
    }
    return h('span', [uploadButton, uploadList]);
  }
};