import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
  Transition,
} from 'vue';
import type { ExtractPropTypes, CSSProperties } from 'vue';
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
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { getTransitionProps } from '../../_util/transition';
import { booleanType, stringType, functionType, arrayType, objectType } from '../../_util/type';

export const listItemProps = () => {
  return {
    prefixCls: String,
    locale: objectType<UploadLocale>(undefined as UploadLocale),
    file: objectType<UploadFile>(),
    items: arrayType<UploadFile[]>(),
    listType: stringType<UploadListType>(),
    isImgUrl: functionType<(file: UploadFile) => boolean>(),

    showRemoveIcon: booleanType(),
    showDownloadIcon: booleanType(),
    showPreviewIcon: booleanType(),
    removeIcon: functionType<(opt: { file: UploadFile }) => VueNode>(),
    downloadIcon: functionType<(opt: { file: UploadFile }) => VueNode>(),
    previewIcon: functionType<(opt: { file: UploadFile }) => VueNode>(),

    iconRender: functionType<(opt: { file: UploadFile }) => VueNode>(),
    actionIconRender:
      functionType<
        (opt: {
          customIcon: VueNode;
          callback: () => void;
          prefixCls: string;
          title?: string | undefined;
        }) => VueNode
      >(),
    itemRender: functionType<ItemRender>(),
    onPreview: functionType<(file: UploadFile, e: Event) => void>(),
    onClose: functionType<(file: UploadFile) => void>(),
    onDownload: functionType<(file: UploadFile) => void>(),
    progress: objectType<UploadListProgressProps>(),
  };
};

export type ListItemProps = Partial<ExtractPropTypes<ReturnType<typeof listItemProps>>>;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ListItem',
  inheritAttrs: false,
  props: listItemProps(),
  setup(props, { slots, attrs }) {
    const showProgress = shallowRef(false);
    const progressRafRef = shallowRef();
    onMounted(() => {
      progressRafRef.value = setTimeout(() => {
        showProgress.value = true;
      }, 300);
    });
    onBeforeUnmount(() => {
      clearTimeout(progressRafRef.value);
    });
    const mergedStatus = shallowRef(props.file?.status);
    watch(
      () => props.file?.status,
      status => {
        if (status !== 'removed') {
          mergedStatus.value = status;
        }
      },
    );
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

      const iconNode = iconRender({ file });
      let icon = <div class={`${prefixCls}-text-icon`}>{iconNode}</div>;
      if (listType === 'picture' || listType === 'picture-card') {
        if (mergedStatus.value === 'uploading' || (!file.thumbUrl && !file.url)) {
          const uploadingClassName = {
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: mergedStatus.value !== 'uploading',
          };
          icon = <div class={uploadingClassName}>{iconNode}</div>;
        } else {
          const thumbnail = isImgUrl?.(file) ? (
            <img
              src={file.thumbUrl || file.url}
              alt={file.name}
              class={`${prefixCls}-list-item-image`}
              crossorigin={file.crossOrigin}
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
        [`${prefixCls}-list-item-${mergedStatus.value}`]: true,
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
        showDownloadIcon && mergedStatus.value === 'done'
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
            `${prefixCls}-list-item-actions`,
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
      const fileName = file.url
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

      const pictureCardActions = listType === 'picture-card' &&
        mergedStatus.value !== 'uploading' && (
          <span class={`${prefixCls}-list-item-actions`}>
            {previewIcon}
            {mergedStatus.value === 'done' && downloadIcon}
            {removeIcon}
          </span>
        );

      const dom = (
        <div class={infoUploadingClass}>
          {icon}
          {fileName}
          {pictureCardActions}
          {showProgress.value && (
            <Transition {...transitionProps.value}>
              <div
                v-show={mergedStatus.value === 'uploading'}
                class={`${prefixCls}-list-item-progress`}
              >
                {'percent' in file ? (
                  <Progress
                    {...(progressProps as UploadListProgressProps)}
                    type="line"
                    percent={file.percent}
                  />
                ) : null}
              </div>
            </Transition>
          )}
        </div>
      );
      const listContainerNameClass = {
        [`${prefixCls}-list-item-container`]: true,
        [`${className}`]: !!className,
      };
      const message =
        file.response && typeof file.response === 'string'
          ? file.response
          : file.error?.statusText || file.error?.message || locale.uploadError;
      const item =
        mergedStatus.value === 'error' ? (
          <Tooltip title={message} getPopupContainer={node => node.parentNode as HTMLElement}>
            {dom}
          </Tooltip>
        ) : (
          dom
        );

      return (
        <div class={listContainerNameClass} style={style as CSSProperties}>
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
