import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, initDefaultProps, getListeners } from '../_util/props-util';
import getTransitionProps from '../_util/getTransitionProps';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { previewImage, isImageUrl } from './utils';
import Icon from '../icon';
import Tooltip from '../tooltip';
import Progress from '../progress';
import classNames from 'classnames';
import { UploadListProps } from './interface';

export default {
  name: 'AUploadList',
  mixins: [BaseMixin],
  props: initDefaultProps(UploadListProps, {
    listType: 'text', // or picture
    progressAttr: {
      strokeWidth: 2,
      showInfo: false,
    },
    showRemoveIcon: true,
    showDownloadIcon: false,
    showPreviewIcon: true,
    previewFile: previewImage,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  updated() {
    this.$nextTick(() => {
      const { listType, items, previewFile } = this.$props;
      if (listType !== 'picture' && listType !== 'picture-card') {
        return;
      }
      (items || []).forEach(file => {
        if (
          typeof document === 'undefined' ||
          typeof window === 'undefined' ||
          !window.FileReader ||
          !window.File ||
          !(file.originFileObj instanceof File || file.originFileObj instanceof Blob) ||
          file.thumbUrl !== undefined
        ) {
          return;
        }
        /*eslint-disable */
        file.thumbUrl = '';
        if (previewFile) {
          previewFile(file.originFileObj).then(previewDataUrl => {
            // Need append '' to avoid dead loop
            file.thumbUrl = previewDataUrl || '';
            this.$forceUpdate();
          });
        }
      });
    });
  },
  methods: {
    handlePreview(file, e) {
      const { preview } = getListeners(this);
      if (!preview) {
        return;
      }
      e.preventDefault();
      return this.$emit('preview', file);
    },
    handleDownload(file) {
      const { download } = getListeners(this);
      if (typeof download === 'function') {
        download(file);
      } else if (file.url) {
        window.open(file.url);
      }
    },

    handleClose(file) {
      this.$emit('remove', file);
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      items = [],
      listType,
      showPreviewIcon,
      showRemoveIcon,
      showDownloadIcon,
      locale,
      progressAttr,
    } = getOptionProps(this);
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('upload', customizePrefixCls);

    const list = items.map(file => {
      let progress;
      let icon = <Icon type={file.status === 'uploading' ? 'loading' : 'paper-clip'} />;

      if (listType === 'picture' || listType === 'picture-card') {
        if (listType === 'picture-card' && file.status === 'uploading') {
          icon = <div class={`${prefixCls}-list-item-uploading-text`}>{locale.uploading}</div>;
        } else if (!file.thumbUrl && !file.url) {
          icon = <Icon class={`${prefixCls}-list-item-thumbnail`} type="picture" theme="twoTone" />;
        } else {
          const thumbnail = isImageUrl(file) ? (
            <img
              src={file.thumbUrl || file.url}
              alt={file.name}
              class={`${prefixCls}-list-item-image`}
            />
          ) : (
            <Icon type="file" class={`${prefixCls}-list-item-icon`} theme="twoTone" />
          );
          icon = (
            <a
              class={`${prefixCls}-list-item-thumbnail`}
              onClick={e => this.handlePreview(file, e)}
              href={file.url || file.thumbUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {thumbnail}
            </a>
          );
        }
      }

      if (file.status === 'uploading') {
        const progressProps = {
          props: {
            ...progressAttr,
            type: 'line',
            percent: file.percent,
          },
        };
        // show loading icon if upload progress listener is disabled
        const loadingProgress = 'percent' in file ? <Progress {...progressProps} /> : null;

        progress = (
          <div class={`${prefixCls}-list-item-progress`} key="progress">
            {loadingProgress}
          </div>
        );
      }
      const infoUploadingClass = classNames({
        [`${prefixCls}-list-item`]: true,
        [`${prefixCls}-list-item-${file.status}`]: true,
        [`${prefixCls}-list-item-list-type-${listType}`]: true,
      });
      const linkProps =
        typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;

      const removeIcon = showRemoveIcon ? (
        <Icon type="delete" title={locale.removeFile} onClick={() => this.handleClose(file)} />
      ) : null;
      const downloadIcon =
        showDownloadIcon && file.status === 'done' ? (
          <Icon
            type="download"
            title={locale.downloadFile}
            onClick={() => this.handleDownload(file)}
          />
        ) : null;
      const downloadOrDelete = listType !== 'picture-card' && (
        <span
          key="download-delete"
          class={`${prefixCls}-list-item-card-actions ${listType === 'picture' ? 'picture' : ''}`}
        >
          {downloadIcon && <a title={locale.downloadFile}>{downloadIcon}</a>}
          {removeIcon && <a title={locale.removeFile}>{removeIcon}</a>}
        </span>
      );
      const listItemNameClass = classNames({
        [`${prefixCls}-list-item-name`]: true,
        [`${prefixCls}-list-item-name-icon-count-${
          [downloadIcon, removeIcon].filter(x => x).length
        }`]: true,
      });

      const preview = file.url
        ? [
            <a
              target="_blank"
              rel="noopener noreferrer"
              class={listItemNameClass}
              title={file.name}
              {...linkProps}
              href={file.url}
              onClick={e => this.handlePreview(file, e)}
            >
              {file.name}
            </a>,
            downloadOrDelete,
          ]
        : [
            <span
              key="view"
              class={`${prefixCls}-list-item-name`}
              onClick={e => this.handlePreview(file, e)}
              title={file.name}
            >
              {file.name}
            </span>,
            downloadOrDelete,
          ];
      const style =
        file.url || file.thumbUrl
          ? undefined
          : {
              pointerEvents: 'none',
              opacity: 0.5,
            };
      const previewIcon = showPreviewIcon ? (
        <a
          href={file.url || file.thumbUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={style}
          onClick={e => this.handlePreview(file, e)}
          title={locale.previewFile}
        >
          <Icon type="eye-o" />
        </a>
      ) : null;
      const actions = listType === 'picture-card' && file.status !== 'uploading' && (
        <span class={`${prefixCls}-list-item-actions`}>
          {previewIcon}
          {file.status === 'done' && downloadIcon}
          {removeIcon}
        </span>
      );
      let message;
      if (file.response && typeof file.response === 'string') {
        message = file.response;
      } else {
        message = (file.error && file.error.statusText) || locale.uploadError;
      }
      const iconAndPreview = (
        <span>
          {icon}
          {preview}
        </span>
      );
      const transitionProps = getTransitionProps('fade');
      const dom = (
        <div class={infoUploadingClass} key={file.uid}>
          <div class={`${prefixCls}-list-item-info`}>{iconAndPreview}</div>
          {actions}
          <transition {...transitionProps}>{progress}</transition>
        </div>
      );
      const listContainerNameClass = classNames({
        [`${prefixCls}-list-picture-card-container`]: listType === 'picture-card',
      });
      return (
        <div key={file.uid} class={listContainerNameClass}>
          {file.status === 'error' ? <Tooltip title={message}>{dom}</Tooltip> : <span>{dom}</span>}
        </div>
      );
    });
    const listClassNames = classNames({
      [`${prefixCls}-list`]: true,
      [`${prefixCls}-list-${listType}`]: true,
    });
    const animationDirection = listType === 'picture-card' ? 'animate-inline' : 'animate';
    const transitionGroupProps = getTransitionProps(`${prefixCls}-${animationDirection}`);
    return (
      <transition-group {...transitionGroupProps} tag="div" class={listClassNames}>
        {list}
      </transition-group>
    );
  },
};
