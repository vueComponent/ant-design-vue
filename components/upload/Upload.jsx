import classNames from 'classnames';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import pick from 'lodash/pick';
import VcUpload from '../vc-upload';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, initDefaultProps, hasProp, getListeners } from '../_util/props-util';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Dragger from './Dragger';
import UploadList from './UploadList';
import { UploadProps } from './interface';
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from './utils';

export { UploadProps };

export default {
  name: 'AUpload',
  mixins: [BaseMixin],
  inheritAttrs: false,
  Dragger,
  props: initDefaultProps(UploadProps, {
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    beforeUpload: T,
    showUploadList: true,
    listType: 'text', // or pictrue
    disabled: false,
    supportServerRender: true,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  // recentUploadStatus: boolean | PromiseLike<any>;
  data() {
    this.progressTimer = null;
    return {
      sFileList: this.fileList || this.defaultFileList || [],
      dragState: 'drop',
    };
  },
  watch: {
    fileList(val) {
      this.sFileList = val || [];
    },
  },
  beforeDestroy() {
    this.clearProgressTimer();
  },
  methods: {
    onStart(file) {
      const targetItem = fileToObject(file);
      targetItem.status = 'uploading';
      const nextFileList = this.sFileList.concat();
      const fileIndex = findIndex(nextFileList, ({ uid }) => uid === targetItem.uid);
      if (fileIndex === -1) {
        nextFileList.push(targetItem);
      } else {
        nextFileList[fileIndex] = targetItem;
      }
      this.onChange({
        file: targetItem,
        fileList: nextFileList,
      });
      // fix ie progress
      if (!window.File || process.env.TEST_IE) {
        this.autoUpdateProgress(0, targetItem);
      }
    },

    onSuccess(response, file, xhr) {
      this.clearProgressTimer();
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
      } catch (e) {
        /* do nothing */
      }
      const fileList = this.sFileList;
      const targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.status = 'done';
      targetItem.response = response;
      targetItem.xhr = xhr;
      this.onChange({
        file: { ...targetItem },
        fileList,
      });
    },
    onProgress(e, file) {
      const fileList = this.sFileList;
      const targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.percent = e.percent;
      this.onChange({
        event: e,
        file: { ...targetItem },
        fileList: this.sFileList,
      });
    },
    onError(error, response, file) {
      this.clearProgressTimer();
      const fileList = this.sFileList;
      const targetItem = getFileItem(file, fileList);
      // removed
      if (!targetItem) {
        return;
      }
      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';
      this.onChange({
        file: { ...targetItem },
        fileList,
      });
    },
    onReject(fileList) {
      this.$emit('reject', fileList);
    },
    handleRemove(file) {
      const { remove: onRemove } = this;
      const { sFileList: fileList } = this.$data;

      Promise.resolve(typeof onRemove === 'function' ? onRemove(file) : onRemove).then(ret => {
        // Prevent removing file
        if (ret === false) {
          return;
        }

        const removedFileList = removeFileItem(file, fileList);

        if (removedFileList) {
          file.status = 'removed'; // eslint-disable-line

          if (this.upload) {
            this.upload.abort(file);
          }

          this.onChange({
            file,
            fileList: removedFileList,
          });
        }
      });
    },
    handleManualRemove(file) {
      if (this.$refs.uploadRef) {
        this.$refs.uploadRef.abort(file);
      }
      this.handleRemove(file);
    },
    onChange(info) {
      if (!hasProp(this, 'fileList')) {
        this.setState({ sFileList: info.fileList });
      }
      this.$emit('change', info);
    },
    onFileDrop(e) {
      this.setState({
        dragState: e.type,
      });
    },
    reBeforeUpload(file, fileList) {
      const { beforeUpload } = this.$props;
      const { sFileList: stateFileList } = this.$data;
      if (!beforeUpload) {
        return true;
      }
      const result = beforeUpload(file, fileList);
      if (result === false) {
        this.onChange({
          file,
          fileList: uniqBy(stateFileList.concat(fileList.map(fileToObject)), item => item.uid),
        });
        return false;
      }
      if (result && result.then) {
        return result;
      }
      return true;
    },
    clearProgressTimer() {
      clearInterval(this.progressTimer);
    },
    autoUpdateProgress(_, file) {
      const getPercent = genPercentAdd();
      let curPercent = 0;
      this.clearProgressTimer();
      this.progressTimer = setInterval(() => {
        curPercent = getPercent(curPercent);
        this.onProgress(
          {
            percent: curPercent * 100,
          },
          file,
        );
      }, 200);
    },
    renderUploadList(locale) {
      const {
        showUploadList = {},
        listType,
        previewFile,
        disabled,
        locale: propLocale,
      } = getOptionProps(this);
      const { showRemoveIcon, showPreviewIcon, showDownloadIcon } = showUploadList;
      const { sFileList: fileList } = this.$data;
      const uploadListProps = {
        props: {
          listType,
          items: fileList,
          previewFile,
          showRemoveIcon: !disabled && showRemoveIcon,
          showPreviewIcon,
          showDownloadIcon,
          locale: { ...locale, ...propLocale },
        },
        on: {
          remove: this.handleManualRemove,
          ...pick(getListeners(this), ['download', 'preview']), // 如果没有配置该事件，不要传递， uploadlist 会有相应逻辑
        },
      };
      return <UploadList {...uploadListProps} />;
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      showUploadList,
      listType,
      type,
      disabled,
    } = getOptionProps(this);
    const { sFileList: fileList, dragState } = this.$data;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('upload', customizePrefixCls);

    const vcUploadProps = {
      props: {
        ...this.$props,
        prefixCls,
        beforeUpload: this.reBeforeUpload,
      },
      on: {
        start: this.onStart,
        error: this.onError,
        progress: this.onProgress,
        success: this.onSuccess,
        reject: this.onReject,
      },
      ref: 'uploadRef',
      attrs: { ...this.$attrs },
    };
    const children = this.$slots.default;
    // Remove id to avoid open by label when trigger is hidden
    // https://github.com/ant-design/ant-design/issues/14298
    if (!children || disabled) {
      delete vcUploadProps.props.id;
      delete vcUploadProps.attrs.id;
    }
    const uploadList = showUploadList ? (
      <LocaleReceiver
        componentName="Upload"
        defaultLocale={defaultLocale.Upload}
        scopedSlots={{ default: this.renderUploadList }}
      />
    ) : null;

    if (type === 'drag') {
      const dragCls = classNames(prefixCls, {
        [`${prefixCls}-drag`]: true,
        [`${prefixCls}-drag-uploading`]: fileList.some(file => file.status === 'uploading'),
        [`${prefixCls}-drag-hover`]: dragState === 'dragover',
        [`${prefixCls}-disabled`]: disabled,
      });
      return (
        <span>
          <div
            class={dragCls}
            onDrop={this.onFileDrop}
            onDragover={this.onFileDrop}
            onDragleave={this.onFileDrop}
          >
            <VcUpload {...vcUploadProps} class={`${prefixCls}-btn`}>
              <div class={`${prefixCls}-drag-container`}>{children}</div>
            </VcUpload>
          </div>
          {uploadList}
        </span>
      );
    }

    const uploadButtonCls = classNames(prefixCls, {
      [`${prefixCls}-select`]: true,
      [`${prefixCls}-select-${listType}`]: true,
      [`${prefixCls}-disabled`]: disabled,
    });

    const uploadButton = (
      <div class={uploadButtonCls} style={children ? undefined : { display: 'none' }}>
        <VcUpload {...vcUploadProps}>{children}</VcUpload>
      </div>
    );

    if (listType === 'picture-card') {
      return (
        <span class={`${prefixCls}-picture-card-wrapper`}>
          {uploadList}
          {uploadButton}
        </span>
      );
    }
    return (
      <span>
        {uploadButton}
        {uploadList}
      </span>
    );
  },
};
