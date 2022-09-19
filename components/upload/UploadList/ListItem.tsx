import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ExtractPropTypes, PropType, CSSProperties } from 'vue';
import EyeOutlined from '@ant-design/icons-vue/EyeOutlined';
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined';
import DownloadOutlined from '@ant-design/icons-vue/DownloadOutlined';
import Tooltip from '../../tooltip';
import Progress from '../../progress';

import type {
  ItemRender,
  UploadFile,
  UploadListProgressProps,
  UploadListType,
  UploadLocale,
} from '../interface';
import type { VueNode } from '../../_util/type';
import useConfigInject from '../../_util/hooks/useConfigInject';
import Transition, { getTransitionProps } from '../../_util/transition';
export const listItemProps = () => {
  return {
    prefixCls: String,
    locale: { type: Object as PropType<UploadLocale>, default: undefined as UploadLocale },
    file: Object as PropType<UploadFile>,
    items: Array as PropType<UploadFile[]>,
    listType: String as PropType<UploadListType>,
    isImgUrl: Function as PropType<(file: UploadFile) => boolean>,

    showRemoveIcon: { type: Boolean, default: undefined },
    showDownloadIcon: { type: Boolean, default: undefined },
    showPreviewIcon: { type: Boolean, default: undefined },
    removeIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    downloadIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    previewIcon: Function as PropType<(opt: { file: UploadFile }) => VueNode>,

    iconRender: Function as PropType<(opt: { file: UploadFile }) => VueNode>,
    actionIconRender: Function as PropType<
      (opt: {
        customIcon: VueNode;
        callback: () => void;
        prefixCls: string;
        title?: string | undefined;
      }) => VueNode
    >,
    itemRender: Function as PropType<ItemRender>,
    onPreview: Function as PropType<(file: UploadFile, e: Event) => void>,
    onClose: Function as PropType<(file: UploadFile) => void>,
    onDownload: Function as PropType<(file: UploadFile) => void>,
    progress: Object as PropType<UploadListProgressProps>,
  };
};

export type ListItemProps = Partial<ExtractPropTypes<ReturnType<typeof listItemProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ListItem',
  inheritAttrs: false,
  props: listItemProps(),
  setup(props, { slots, attrs }) {
    const showProgress = ref(false);
    const progressRafRef = ref();
    onMounted(() => {
      progressRafRef.value = setTimeout(() => {
        showProgress.value = true;
      }, 300);
    });
    onBeforeUnmount(() => {
      clearTimeout(progressRafRef.value);
    });
    const { rootPrefixCls } = useConfigInject('upload', props);
    const transitionProps = computed(() => getTransitionProps(`${rootPrefixCls.value}-fade`));
    return () => {
      const {
        prefixCls,
        locale,
        listType,
        file,
        items,
        progress: progressProps,
        iconRender = slots.iconRender,
        actionIconRender = slots.actionIconRender,
        itemRender = slots.itemRender,
        isImgUrl,
        showPreviewIcon,
        showRemoveIcon,
        showDownloadIcon,
        previewIcon: customPreviewIcon = slots.previewIcon,
        removeIcon: customRemoveIcon = slots.removeIcon,
        downloadIcon: customDownloadIcon = slots.downloadIcon,
        onPreview,
        onDownload,
        onClose,
      } = props;
      const { class: className, style } = attrs;
      // This is used for legacy span make scrollHeight the wrong value.
      // We will force these to be `display: block` with non `picture-card`
      const spanClassName = `${prefixCls}-span`;

      const iconNode = iconRender({ file });
      let icon = <div class={`${prefixCls}-text-icon`}>{iconNode}</div>;
      if (listType === 'picture' || listType === 'picture-card') {
        if (file.status === 'uploading' || (!file.thumbUrl && !file.url)) {
          const uploadingClassName = {
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: file.status !== 'uploading',
          };
          icon = <div class={uploadingClassName}>{iconNode}</div>;
        } else {
          const thumbnail = isImgUrl?.(file) ? (
            <img
              src={file.thumbUrl || file.url}
              alt={file.name}
              class={`${prefixCls}-list-item-image`}
            />
          ) : (
            iconNode
          );
          const aClassName = {
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: isImgUrl && !isImgUrl(file),
          };
          icon = (
            <a
              class={aClassName}
              onClick={e => onPreview(file, e)}
              href={file.url || file.thumbUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {thumbnail}
            </a>
          );
        }
      }

      const infoUploadingClass = {
        [`${prefixCls}-list-item`]: true,
        [`${prefixCls}-list-item-${file.status}`]: true,
        [`${prefixCls}-list-item-list-type-${listType}`]: true,
      };
      const linkProps =
        typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;

      const removeIcon = showRemoveIcon
        ? actionIconRender({
            customIcon: customRemoveIcon ? customRemoveIcon({ file }) : <DeleteOutlined />,
            callback: () => onClose(file),
            prefixCls,
            title: locale.removeFile,
          })
        : null;
      const downloadIcon =
        showDownloadIcon && file.status === 'done'
          ? actionIconRender({
              customIcon: customDownloadIcon ? customDownloadIcon({ file }) : <DownloadOutlined />,
              callback: () => onDownload(file),
              prefixCls,
              title: locale.downloadFile,
            })
          : null;
      const downloadOrDelete = listType !== 'picture-card' && (
        <span
          key="download-delete"
          class={[
            `${prefixCls}-list-item-card-actions`,
            {
              picture: listType === 'picture',
            },
          ]}
        >
          {downloadIcon}
          {removeIcon}
        </span>
      );
      const listItemNameClass = `${prefixCls}-list-item-name`;
      const preview = file.url
        ? [
            <a
              key="view"
              target="_blank"
              rel="noopener noreferrer"
              class={listItemNameClass}
              title={file.name}
              {...linkProps}
              href={file.url}
              onClick={e => onPreview(file, e)}
            >
              {file.name}
            </a>,
            downloadOrDelete,
          ]
        : [
            <span
              key="view"
              class={listItemNameClass}
              onClick={e => onPreview(file, e)}
              title={file.name}
            >
              {file.name}
            </span>,
            downloadOrDelete,
          ];
      const previewStyle: CSSProperties = {
        pointerEvents: 'none',
        opacity: 0.5,
      };
      const previewIcon = showPreviewIcon ? (
        <a
          href={file.url || file.thumbUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={file.url || file.thumbUrl ? undefined : previewStyle}
          onClick={e => onPreview(file, e)}
          title={locale.previewFile}
        >
          {customPreviewIcon ? customPreviewIcon({ file }) : <EyeOutlined />}
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
        message = file.error?.statusText || file.error?.message || locale.uploadError;
      }
      const iconAndPreview = (
        <span class={spanClassName}>
          {icon}
          {preview}
        </span>
      );

      const dom = (
        <div class={infoUploadingClass}>
          <div class={`${prefixCls}-list-item-info`}>{iconAndPreview}</div>
          {actions}
          {showProgress.value && (
            <Transition {...transitionProps.value}>
              <div v-show={file.status === 'uploading'} class={`${prefixCls}-list-item-progress`}>
                {'percent' in file ? (
                  <Progress {...progressProps} type="line" percent={file.percent} />
                ) : null}
              </div>
            </Transition>
          )}
        </div>
      );
      const listContainerNameClass = {
        [`${prefixCls}-list-${listType}-container`]: true,
        [`${className}`]: !!className,
      };
      const item =
        file.status === 'error' ? (
          <Tooltip title={message} getPopupContainer={node => node.parentNode as HTMLElement}>
            {dom}
          </Tooltip>
        ) : (
          dom
        );

      return (
        <div class={listContainerNameClass} style={style as CSSProperties} ref={ref}>
          {itemRender
            ? itemRender({
                originNode: item,
                file,
                fileList: items,
                actions: {
                  download: onDownload.bind(null, file),
                  preview: onPreview.bind(null, file),
                  remove: onClose.bind(null, file),
                },
              })
            : item}
        </div>
      );
    };
  },
});
