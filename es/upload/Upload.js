import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import classNames from 'classnames';
import uniqBy from 'lodash/uniqBy';
import VcUpload from '../vc-upload';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, initDefaultProps, hasProp } from '../_util/props-util';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import Dragger from './Dragger';
import UploadList from './UploadList';
import { UploadProps } from './interface';
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from './utils';

export { UploadProps };

export default {
  name: 'AUpload',
  Dragger: Dragger,
  mixins: [BaseMixin],
  props: initDefaultProps(UploadProps, {
    prefixCls: 'ant-upload',
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    beforeUpload: T,
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
      var targetItem = fileToObject(file);
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

      var getPercent = genPercentAdd();
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
      var targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.status = 'done';
      targetItem.response = response;
      this.onChange({
        file: _extends({}, targetItem),
        fileList: fileList
      });
    },
    onProgress: function onProgress(e, file) {
      var fileList = this.sFileList;
      var targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.percent = e.percent;
      this.onChange({
        event: e,
        file: _extends({}, targetItem),
        fileList: this.sFileList
      });
    },
    onError: function onError(error, response, file) {
      this.clearProgressTimer();
      var fileList = this.sFileList;
      var targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';
      this.onChange({
        file: _extends({}, targetItem),
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

        var removedFileList = removeFileItem(file, _this2.sFileList);
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
      if (!hasProp(this, 'fileList')) {
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
          fileList: uniqBy(fileList.concat(this.sFileList), function (item) {
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

      var _getOptionProps = getOptionProps(this),
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
          locale: _extends({}, locale, this.$props.locale)
        },
        on: {
          remove: this.handleManualRemove
        }
      };
      if (this.$listeners.preview) {
        uploadListProps.on.preview = this.$listeners.preview;
      }
      return h(UploadList, uploadListProps);
    }
  },
  render: function render() {
    var _classNames2;

    var h = arguments[0];

    var _getOptionProps2 = getOptionProps(this),
        _getOptionProps2$pref = _getOptionProps2.prefixCls,
        prefixCls = _getOptionProps2$pref === undefined ? '' : _getOptionProps2$pref,
        showUploadList = _getOptionProps2.showUploadList,
        listType = _getOptionProps2.listType,
        type = _getOptionProps2.type,
        disabled = _getOptionProps2.disabled;

    var vcUploadProps = {
      props: _extends({}, this.$props, {
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

    var uploadList = showUploadList ? h(LocaleReceiver, {
      attrs: {
        componentName: 'Upload',
        defaultLocale: defaultLocale.Upload,
        children: this.renderUploadList
      }
    }) : null;

    var children = this.$slots['default'];

    if (type === 'drag') {
      var _classNames;

      var dragCls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-drag', true), _defineProperty(_classNames, prefixCls + '-drag-uploading', this.sFileList.some(function (file) {
        return file.status === 'uploading';
      })), _defineProperty(_classNames, prefixCls + '-drag-hover', this.dragState === 'dragover'), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _classNames));
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
          VcUpload,
          vcUploadProps,
          [h(
            'div',
            { 'class': prefixCls + '-drag-container' },
            [children]
          )]
        )]
      ), uploadList]);
    }

    var uploadButtonCls = classNames(prefixCls, (_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-select', true), _defineProperty(_classNames2, prefixCls + '-select-' + listType, true), _defineProperty(_classNames2, prefixCls + '-disabled', disabled), _classNames2));
    var uploadButton = h(
      'div',
      { 'class': uploadButtonCls, style: { display: children ? '' : 'none' } },
      [h(
        VcUpload,
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