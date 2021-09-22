import classNames from '../_util/classNames';
import uniqBy from 'lodash-es/uniqBy';
import findIndex from 'lodash-es/findIndex';
import VcUpload from '../vc-upload';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, hasProp, getSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';
import { defaultConfigProvider } from '../config-provider';
import Dragger from './Dragger';
import UploadList from './UploadList';
import { UploadProps } from './interface';
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from './utils';
import { defineComponent, inject } from 'vue';
import { getDataAndAriaProps } from '../_util/util';
import { useInjectFormItemContext } from '../form/FormItemContext';

export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';
export interface UploadFile<T = any> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: any;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}

export default defineComponent({
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
  setup() {
    const formItemContext = useInjectFormItemContext();
    return {
      upload: null,
      progressTimer: null,
      configProvider: inject('configProvider', defaultConfigProvider),
      formItemContext,
    };
  },
  // recentUploadStatus: boolean | PromiseLike<any>;
  data() {
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
  beforeUnmount() {
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
      this.handleChange({
        file: targetItem,
        fileList: nextFileList,
      });
      // fix ie progress
      if (!window.File || (typeof process === 'object' && process.env.TEST_IE)) {
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
      this.handleChange({
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
      this.handleChange({
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
      this.handleChange({
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

          this.handleChange({
            file,
            fileList: removedFileList,
          });
        }
      });
    },
    handleManualRemove(file) {
      if (this.$refs.uploadRef) {
        (this.$refs.uploadRef as any).abort(file);
      }
      this.handleRemove(file);
    },
    handleChange(info) {
      if (!hasProp(this, 'fileList')) {
        this.setState({ sFileList: info.fileList });
      }
      this.$emit('update:fileList', info.fileList);
      this.$emit('change', info);
      this.formItemContext.onFieldChange();
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
        this.handleChange({
          file,
          fileList: uniqBy(
            stateFileList.concat(fileList.map(fileToObject)),
            (item: UploadFile) => item.uid,
          ),
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
      const { onDownload, onPreview } = this.$props;
      const uploadListProps = {
        listType,
        items: fileList,
        previewFile,
        showRemoveIcon: !disabled && showRemoveIcon,
        showPreviewIcon,
        showDownloadIcon,
        locale: { ...locale, ...propLocale },
        onRemove: this.handleManualRemove,
        onDownload,
        onPreview,
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
    const { class: className, style } = this.$attrs;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('upload', customizePrefixCls);

    const vcUploadProps = {
      ...this.$props,
      id: this.$props.id ?? this.formItemContext.id.value,
      prefixCls,
      beforeUpload: this.reBeforeUpload,
      onStart: this.onStart,
      onError: this.onError,
      onProgress: this.onProgress,
      onSuccess: this.onSuccess,
      onReject: this.onReject,
      ref: 'uploadRef',
    };

    const uploadList = showUploadList ? (
      <LocaleReceiver
        componentName="Upload"
        defaultLocale={defaultLocale.Upload}
        children={this.renderUploadList}
      />
    ) : null;

    const children = getSlot(this);

    if (type === 'drag') {
      const dragCls = classNames(prefixCls, {
        [`${prefixCls}-drag`]: true,
        [`${prefixCls}-drag-uploading`]: fileList.some((file: any) => file.status === 'uploading'),
        [`${prefixCls}-drag-hover`]: dragState === 'dragover',
        [`${prefixCls}-disabled`]: disabled,
      });
      return (
        <span class={className} {...getDataAndAriaProps(this.$attrs)}>
          <div
            class={dragCls}
            onDrop={this.onFileDrop}
            onDragover={this.onFileDrop}
            onDragleave={this.onFileDrop}
            style={style}
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

    // Remove id to avoid open by label when trigger is hidden
    // https://github.com/ant-design/ant-design/issues/14298
    if (!children.length || disabled) {
      delete vcUploadProps.id;
    }

    const uploadButton = (
      <div class={uploadButtonCls} style={children.length ? undefined : { display: 'none' }}>
        <VcUpload {...vcUploadProps}>{children}</VcUpload>
      </div>
    );

    if (listType === 'picture-card') {
      return (
        <span class={classNames(`${prefixCls}-picture-card-wrapper`, className)}>
          {uploadList}
          {uploadButton}
        </span>
      );
    }
    return (
      <span class={className}>
        {uploadButton}
        {uploadList}
      </span>
    );
  },
});
