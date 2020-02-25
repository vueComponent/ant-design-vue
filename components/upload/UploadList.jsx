import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, initDefaultProps, getListeners } from '../_util/props-util';
import getTransitionProps from '../_util/getTransitionProps';
import { ConfigConsumerProps } from '../config-provider';
import Icon from '../icon';
import Tooltip from '../tooltip';
import Progress from '../progress';
import classNames from 'classnames';
import { UploadListProps } from './interface';

const imageTypes = ['image', 'webp', 'png', 'svg', 'gif', 'jpg', 'jpeg', 'bmp', 'dpg', 'ico'];
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
const previewFile = (file, callback) => {
  if (file.type && !imageTypes.includes(file.type)) {
    callback('');
  }
  const reader = new window.FileReader();
  reader.onloadend = () => callback(reader.result);
  reader.readAsDataURL(file);
};

const extname = url => {
  if (!url) {
    return '';
  }
  const temp = url.split('/');
  const filename = temp[temp.length - 1];
  const filenameWithoutSuffix = filename.split(/#|\?/)[0];
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
};

const isImageUrl = file => {
  if (imageTypes.includes(file.type)) {
    return true;
  }
  const url = file.thumbUrl || file.url;
  const extension = extname(url);
  if (/^data:image\//.test(url) || /(webp|svg|png|gif|jpg|jpeg|bmp|dpg|ico)$/i.test(extension)) {
    return true;
  } else if (/^data:/.test(url)) {
    // other file types of base64
    return false;
  } else if (extension) {
    // other file types which have extension
    return false;
  }
  return true;
};

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
    showPreviewIcon: true,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  updated() {
    this.$nextTick(() => {
      if (this.listType !== 'picture' && this.listType !== 'picture-card') {
        return;
      }
      (this.items || []).forEach(file => {
        if (
          typeof document === 'undefined' ||
          typeof window === 'undefined' ||
          !window.FileReader ||
          !window.File ||
          !(file.originFileObj instanceof window.File) ||
          file.thumbUrl !== undefined
        ) {
          return;
        }
        /*eslint-disable */
        file.thumbUrl = '';
        /*eslint -enable */
        previewFile(file.originFileObj, previewDataUrl => {
          // Need append '' to avoid dead loop
          file.thumbUrl = previewDataUrl || '';
          /*eslint -enable */
          this.$forceUpdate();
        });
      });
    });
  },
  methods: {
    handleClose(file) {
      this.$emit('remove', file);
    },
    handlePreview(file, e) {
      const { preview } = getListeners(this);
      if (!preview) {
        return;
      }
      e.preventDefault();
      return this.$emit('preview', file);
    },
  },
  render() {
    const {
      prefixCls: customizePrefixCls,
      items = [],
      listType,
      showPreviewIcon,
      showRemoveIcon,
      locale,
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
            <img src={file.thumbUrl || file.url} alt={file.name} />
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
            ...this.progressAttr,
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
      });
      const linkProps =
        typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;
      const preview = file.url ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          class={`${prefixCls}-list-item-name`}
          title={file.name}
          {...linkProps}
          href={file.url}
          onClick={e => this.handlePreview(file, e)}
        >
          {file.name}
        </a>
      ) : (
        <span
          class={`${prefixCls}-list-item-name`}
          onClick={e => this.handlePreview(file, e)}
          title={file.name}
        >
          {file.name}
        </span>
      );
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
      const iconProps = {
        props: {
          type: 'delete',
          title: locale.removeFile,
        },
        on: {
          click: () => {
            this.handleClose(file);
          },
        },
      };
      const iconProps1 = { ...iconProps, ...{ props: { type: 'close' } } };
      const removeIcon = showRemoveIcon ? <Icon {...iconProps} /> : null;
      const removeIconClose = showRemoveIcon ? <Icon {...iconProps1} /> : null;
      const actions =
        listType === 'picture-card' && file.status !== 'uploading' ? (
          <span class={`${prefixCls}-list-item-actions`}>
            {previewIcon}
            {removeIcon}
          </span>
        ) : (
          removeIconClose
        );
      let message;
      if (file.response && typeof file.response === 'string') {
        message = file.response;
      } else {
        message = (file.error && file.error.statusText) || locale.uploadError;
      }
      const iconAndPreview =
        file.status === 'error' ? (
          <Tooltip title={message}>
            {icon}
            {preview}
          </Tooltip>
        ) : (
          <span>
            {icon}
            {preview}
          </span>
        );
      const transitionProps = getTransitionProps('fade');
      return (
        <div class={infoUploadingClass} key={file.uid}>
          <div class={`${prefixCls}-list-item-info`}>{iconAndPreview}</div>
          {actions}
          <transition {...transitionProps}>{progress}</transition>
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
