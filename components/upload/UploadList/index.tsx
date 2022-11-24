import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import PaperClipOutlined from '@ant-design/icons-vue/PaperClipOutlined';
import PictureTwoTone from '@ant-design/icons-vue/PictureTwoTone';
import FileTwoTone from '@ant-design/icons-vue/FileTwoTone';
import type { UploadListType, InternalUploadFile, UploadFile } from '../interface';
import { uploadListProps } from '../interface';
import { previewImage, isImageUrl } from '../utils';
import type { ButtonProps } from '../../button';
import Button from '../../button';
import ListItem from './ListItem';
import type { HTMLAttributes } from 'vue';
import { computed, defineComponent, getCurrentInstance, onMounted, ref, watchEffect } from 'vue';
import { filterEmpty, initDefaultProps, isValidElement } from '../../_util/props-util';
import type { VueNode } from '../../_util/type';
import useConfigInject from '../../_util/hooks/useConfigInject';
import { getTransitionGroupProps, TransitionGroup } from '../../_util/transition';
import collapseMotion from '../../_util/collapseMotion';

const HackSlot = (_, { slots }) => {
  return filterEmpty(slots.default?.())[0];
};

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AUploadList',
  props: initDefaultProps(uploadListProps(), {
    listType: 'text' as UploadListType, // or picture
    progress: {
      strokeWidth: 2,
      showInfo: false,
    },
    showRemoveIcon: true,
    showDownloadIcon: false,
    showPreviewIcon: true,
    previewFile: previewImage,
    isImageUrl,
    items: [],
    appendActionVisible: true,
  }),
  setup(props, { slots, expose }) {
    const motionAppear = ref(false);
    const instance = getCurrentInstance();
    onMounted(() => {
      motionAppear.value == true;
    });
    watchEffect(() => {
      if (props.listType !== 'picture' && props.listType !== 'picture-card') {
        return;
      }
      (props.items || []).forEach((file: InternalUploadFile) => {
        if (
          typeof document === 'undefined' ||
          typeof window === 'undefined' ||
          !(window as any).FileReader ||
          !(window as any).File ||
          !(file.originFileObj instanceof File || (file.originFileObj as Blob) instanceof Blob) ||
          file.thumbUrl !== undefined
        ) {
          return;
        }
        file.thumbUrl = '';
        if (props.previewFile) {
          props.previewFile(file.originFileObj as File).then((previewDataUrl: string) => {
            // Need append '' to avoid dead loop
            file.thumbUrl = previewDataUrl || '';
            instance.update();
          });
        }
      });
    });

    // ============================= Events =============================
    const onInternalPreview = (file: UploadFile, e?: Event) => {
      if (!props.onPreview) {
        return;
      }
      e?.preventDefault();
      return props.onPreview(file);
    };

    const onInternalDownload = (file: UploadFile) => {
      if (typeof props.onDownload === 'function') {
        props.onDownload(file);
      } else if (file.url) {
        window.open(file.url);
      }
    };

    const onInternalClose = (file: UploadFile) => {
      props.onRemove?.(file);
    };

    const internalIconRender = ({ file }: { file: UploadFile }) => {
      const iconRender = props.iconRender || slots.iconRender;
      if (iconRender) {
        return iconRender({ file, listType: props.listType });
      }
      const isLoading = file.status === 'uploading';
      const fileIcon =
        props.isImageUrl && props.isImageUrl(file) ? <PictureTwoTone /> : <FileTwoTone />;
      let icon: VueNode = isLoading ? <LoadingOutlined /> : <PaperClipOutlined />;
      if (props.listType === 'picture') {
        icon = isLoading ? <LoadingOutlined /> : fileIcon;
      } else if (props.listType === 'picture-card') {
        icon = isLoading ? props.locale.uploading : fileIcon;
      }
      return icon;
    };

    const actionIconRender = (opt: {
      customIcon: VueNode;
      callback: () => void;
      prefixCls: string;
      title?: string;
    }) => {
      const { customIcon, callback, prefixCls, title } = opt;
      const btnProps: ButtonProps & HTMLAttributes = {
        type: 'text',
        size: 'small',
        title,
        onClick: () => {
          callback();
        },
        class: `${prefixCls}-list-item-card-actions-btn`,
      };
      if (isValidElement(customIcon)) {
        return <Button {...btnProps} v-slots={{ icon: () => customIcon }} />;
      }
      return (
        <Button {...btnProps}>
          <span>{customIcon}</span>
        </Button>
      );
    };

    expose({
      handlePreview: onInternalPreview,
      handleDownload: onInternalDownload,
    });

    const { prefixCls, direction } = useConfigInject('upload', props);

    const listClassNames = computed(() => ({
      [`${prefixCls.value}-list`]: true,
      [`${prefixCls.value}-list-${props.listType}`]: true,
      [`${prefixCls.value}-list-rtl`]: direction.value === 'rtl',
    }));
    const transitionGroupProps = computed(() => ({
      ...collapseMotion(
        `${prefixCls.value}-${props.listType === 'picture-card' ? 'animate-inline' : 'animate'}`,
      ),
      ...getTransitionGroupProps(
        `${prefixCls.value}-${props.listType === 'picture-card' ? 'animate-inline' : 'animate'}`,
      ),
      class: listClassNames.value,
      appear: motionAppear.value,
    }));
    return () => {
      const {
        listType,
        locale,
        isImageUrl: isImgUrl,
        items = [],
        showPreviewIcon,
        showRemoveIcon,
        showDownloadIcon,
        removeIcon,
        previewIcon,
        downloadIcon,
        progress,
        appendAction,
        itemRender,
        appendActionVisible,
      } = props;
      const appendActionDom = appendAction?.();
      return (
        <TransitionGroup {...transitionGroupProps.value} tag="div">
          {items.map(file => {
            const { uid: key } = file;
            return (
              <ListItem
                key={key}
                locale={locale}
                prefixCls={prefixCls.value}
                file={file}
                items={items}
                progress={progress}
                listType={listType}
                isImgUrl={isImgUrl}
                showPreviewIcon={showPreviewIcon}
                showRemoveIcon={showRemoveIcon}
                showDownloadIcon={showDownloadIcon}
                onPreview={onInternalPreview}
                onDownload={onInternalDownload}
                onClose={onInternalClose}
                removeIcon={removeIcon}
                previewIcon={previewIcon}
                downloadIcon={downloadIcon}
                itemRender={itemRender}
                v-slots={{
                  ...slots,
                  iconRender: internalIconRender,
                  actionIconRender,
                }}
              />
            );
          })}
          {appendAction ? (
            <HackSlot
              key="__ant_upload_appendAction"
              v-show={!!appendActionVisible}
              v-slots={{ default: () => appendActionDom }}
            ></HackSlot>
          ) : null}
        </TransitionGroup>
      );
    };
  },
});
