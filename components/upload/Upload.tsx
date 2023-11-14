import type { UploadProps as RcUploadProps } from '../vc-upload';
import VcUpload from '../vc-upload';
import UploadList from './UploadList';
import type { UploadFile, UploadChangeParam, ShowUploadListInterface, FileType } from './interface';
import { uploadProps } from './interface';
import { file2Obj, getFileItem, removeFileItem, updateFileList } from './utils';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import type { CSSProperties } from 'vue';
import { computed, defineComponent, onMounted, ref, toRef } from 'vue';
import { flattenChildren, initDefaultProps } from '../_util/props-util';
import useMergedState from '../_util/hooks/useMergedState';
import devWarning from '../vc-util/devWarning';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { VueNode } from '../_util/type';
import classNames from '../_util/classNames';
import { useInjectFormItemContext } from '../form';

// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';

export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AUpload',
  inheritAttrs: false,
  props: initDefaultProps(uploadProps(), {
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    showUploadList: true,
    listType: 'text', // or picture
    supportServerRender: true,
  }),
  setup(props, { slots, attrs, expose }) {
    const formItemContext = useInjectFormItemContext();
    const { prefixCls, direction, disabled } = useConfigInject('upload', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => disabled.value ?? disabledContext.value);

    const [mergedFileList, setMergedFileList] = useMergedState(props.defaultFileList || [], {
      value: toRef(props, 'fileList'),
      postState: list => {
        const timestamp = Date.now();
        return (list ?? []).map((file, index) => {
          if (!file.uid && !Object.isFrozen(file)) {
            file.uid = `__AUTO__${timestamp}_${index}__`;
          }
          return file;
        });
      },
    });
    const dragState = ref('drop');

    const upload = ref(null);
    onMounted(() => {
      devWarning(
        props.fileList !== undefined || attrs.value === undefined,
        'Upload',
        '`value` is not a valid prop, do you mean `fileList`?',
      );

      devWarning(
        props.transformFile === undefined,
        'Upload',
        '`transformFile` is deprecated. Please use `beforeUpload` directly.',
      );
      devWarning(
        props.remove === undefined,
        'Upload',
        '`remove` props is deprecated. Please use `remove` event.',
      );
    });

    const onInternalChange = (
      file: UploadFile,
      changedFileList: UploadFile[],
      event?: { percent: number },
    ) => {
      let cloneList = [...changedFileList];

      // Cut to match count
      if (props.maxCount === 1) {
        cloneList = cloneList.slice(-1);
      } else if (props.maxCount) {
        cloneList = cloneList.slice(0, props.maxCount);
      }

      setMergedFileList(cloneList);

      const changeInfo: UploadChangeParam<UploadFile> = {
        file: file as UploadFile,
        fileList: cloneList,
      };

      if (event) {
        changeInfo.event = event;
      }
      props['onUpdate:fileList']?.(changeInfo.fileList);
      props.onChange?.(changeInfo);
      formItemContext.onFieldChange();
    };

    const mergedBeforeUpload = async (file: FileType, fileListArgs: FileType[]) => {
      const { beforeUpload, transformFile } = props;

      let parsedFile: FileType | Blob | string = file;
      if (beforeUpload) {
        const result = await beforeUpload(file, fileListArgs);

        if (result === false) {
          return false;
        }

        // Hack for LIST_IGNORE, we add additional info to remove from the list
        delete (file as any)[LIST_IGNORE];
        if ((result as any) === LIST_IGNORE) {
          Object.defineProperty(file, LIST_IGNORE, {
            value: true,
            configurable: true,
          });
          return false;
        }

        if (typeof result === 'object' && result) {
          parsedFile = result as File;
        }
      }

      if (transformFile) {
        parsedFile = await transformFile(parsedFile as any);
      }

      return parsedFile as File;
    };

    const onBatchStart: RcUploadProps['onBatchStart'] = batchFileInfoList => {
      // Skip file which marked as `LIST_IGNORE`, these file will not add to file list
      const filteredFileInfoList = batchFileInfoList.filter(
        info => !(info.file as any)[LIST_IGNORE],
      );

      // Nothing to do since no file need upload
      if (!filteredFileInfoList.length) {
        return;
      }

      const objectFileList = filteredFileInfoList.map(info => file2Obj(info.file as FileType));

      // Concat new files with prev files
      let newFileList = [...mergedFileList.value];

      objectFileList.forEach(fileObj => {
        // Replace file if exist
        newFileList = updateFileList(fileObj, newFileList);
      });

      objectFileList.forEach((fileObj, index) => {
        // Repeat trigger `onChange` event for compatible
        let triggerFileObj: UploadFile = fileObj;

        if (!filteredFileInfoList[index].parsedFile) {
          // `beforeUpload` return false
          const { originFileObj } = fileObj;
          let clone;

          try {
            clone = new File([originFileObj], originFileObj.name, {
              type: originFileObj.type,
            }) as any as UploadFile;
          } catch (e) {
            clone = new Blob([originFileObj], {
              type: originFileObj.type,
            }) as any as UploadFile;
            clone.name = originFileObj.name;
            clone.lastModifiedDate = new Date();
            clone.lastModified = new Date().getTime();
          }

          clone.uid = fileObj.uid;
          triggerFileObj = clone;
        } else {
          // Inject `uploading` status
          fileObj.status = 'uploading';
        }

        onInternalChange(triggerFileObj, newFileList);
      });
    };

    const onSuccess = (response: any, file: FileType, xhr: any) => {
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
      } catch (e) {
        /* do nothing */
      }

      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return;
      }

      const targetItem = file2Obj(file);
      targetItem.status = 'done';
      targetItem.percent = 100;
      targetItem.response = response;
      targetItem.xhr = xhr;

      const nextFileList = updateFileList(targetItem, mergedFileList.value);

      onInternalChange(targetItem, nextFileList);
    };

    const onProgress = (e: { percent: number }, file: FileType) => {
      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return;
      }

      const targetItem = file2Obj(file);
      targetItem.status = 'uploading';
      targetItem.percent = e.percent;

      const nextFileList = updateFileList(targetItem, mergedFileList.value);

      onInternalChange(targetItem, nextFileList, e);
    };

    const onError = (error: Error, response: any, file: FileType) => {
      // removed
      if (!getFileItem(file, mergedFileList.value)) {
        return;
      }

      const targetItem = file2Obj(file);
      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';

      const nextFileList = updateFileList(targetItem, mergedFileList.value);

      onInternalChange(targetItem, nextFileList);
    };

    const handleRemove = (file: UploadFile) => {
      let currentFile: UploadFile;
      const mergedRemove = props.onRemove || props.remove;
      Promise.resolve(typeof mergedRemove === 'function' ? mergedRemove(file) : mergedRemove).then(
        ret => {
          // Prevent removing file
          if (ret === false) {
            return;
          }

          const removedFileList = removeFileItem(file, mergedFileList.value);

          if (removedFileList) {
            currentFile = { ...file, status: 'removed' };
            mergedFileList.value?.forEach(item => {
              const matchKey = currentFile.uid !== undefined ? 'uid' : 'name';
              if (item[matchKey] === currentFile[matchKey] && !Object.isFrozen(item)) {
                item.status = 'removed';
              }
            });
            upload.value?.abort(currentFile);

            onInternalChange(currentFile, removedFileList);
          }
        },
      );
    };

    const onFileDrop = (e: DragEvent) => {
      dragState.value = e.type;
      if (e.type === 'drop') {
        props.onDrop?.(e);
      }
    };
    expose({
      onBatchStart,
      onSuccess,
      onProgress,
      onError,
      fileList: mergedFileList,
      upload,
    });

    const [locale] = useLocaleReceiver(
      'Upload',
      defaultLocale.Upload,
      computed(() => props.locale),
    );
    const renderUploadList = (button?: () => VueNode, buttonVisible?: boolean) => {
      const {
        removeIcon,
        previewIcon,
        downloadIcon,
        previewFile,
        onPreview,
        onDownload,
        isImageUrl,
        progress,
        itemRender,
        iconRender,
        showUploadList,
      } = props;
      const { showDownloadIcon, showPreviewIcon, showRemoveIcon } =
        typeof showUploadList === 'boolean' ? ({} as ShowUploadListInterface) : showUploadList;
      return showUploadList ? (
        <UploadList
          prefixCls={prefixCls.value}
          listType={props.listType}
          items={mergedFileList.value}
          previewFile={previewFile}
          onPreview={onPreview}
          onDownload={onDownload}
          onRemove={handleRemove}
          showRemoveIcon={!mergedDisabled.value && showRemoveIcon}
          showPreviewIcon={showPreviewIcon}
          showDownloadIcon={showDownloadIcon}
          removeIcon={removeIcon}
          previewIcon={previewIcon}
          downloadIcon={downloadIcon}
          iconRender={iconRender}
          locale={locale.value}
          isImageUrl={isImageUrl}
          progress={progress}
          itemRender={itemRender}
          appendActionVisible={buttonVisible}
          appendAction={button}
          v-slots={{ ...slots }}
        />
      ) : (
        button?.()
      );
    };
    return () => {
      const { listType, type } = props;
      const { class: className, style: styleName, ...transAttrs } = attrs;
      const rcUploadProps = {
        onBatchStart,
        onError,
        onProgress,
        onSuccess,
        ...transAttrs,
        ...(props as RcUploadProps),
        id: props.id ?? formItemContext.id.value,
        prefixCls: prefixCls.value,
        beforeUpload: mergedBeforeUpload,
        onChange: undefined,
        disabled: mergedDisabled.value,
      };
      delete (rcUploadProps as any).remove;

      // Remove id to avoid open by label when trigger is hidden
      // !children: https://github.com/ant-design/ant-design/issues/14298
      // disabled: https://github.com/ant-design/ant-design/issues/16478
      //           https://github.com/ant-design/ant-design/issues/24197
      if (!slots.default || mergedDisabled.value) {
        delete rcUploadProps.id;
      }

      const rtlCls = {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      };

      if (type === 'drag') {
        const dragCls = classNames(
          prefixCls.value,
          {
            [`${prefixCls.value}-drag`]: true,
            [`${prefixCls.value}-drag-uploading`]: mergedFileList.value.some(
              file => file.status === 'uploading',
            ),
            [`${prefixCls.value}-drag-hover`]: dragState.value === 'dragover',
            [`${prefixCls.value}-disabled`]: mergedDisabled.value,
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
          attrs.class,
          hashId.value,
        );

        return wrapSSR(
          <span
            {...attrs}
            class={classNames(`${prefixCls.value}-wrapper`, rtlCls, className, hashId.value)}
          >
            <div
              class={dragCls}
              onDrop={onFileDrop}
              onDragover={onFileDrop}
              onDragleave={onFileDrop}
              style={attrs.style as CSSProperties}
            >
              <VcUpload
                {...rcUploadProps}
                ref={upload}
                class={`${prefixCls.value}-btn`}
                v-slots={slots}
              >
                <div class={`${prefixCls.value}-drag-container`}>{slots.default?.()}</div>
              </VcUpload>
            </div>
            {renderUploadList()}
          </span>,
        );
      }

      const uploadButtonCls = classNames(prefixCls.value, {
        [`${prefixCls.value}-select`]: true,
        [`${prefixCls.value}-select-${listType}`]: true,
        [`${prefixCls.value}-disabled`]: mergedDisabled.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      });
      const children = flattenChildren(slots.default?.());
      const renderUploadButton = (uploadButtonStyle?: CSSProperties) => (
        <div class={uploadButtonCls} style={uploadButtonStyle}>
          <VcUpload {...rcUploadProps} ref={upload} v-slots={slots} />
        </div>
      );

      if (listType === 'picture-card') {
        return wrapSSR(
          <span
            {...attrs}
            class={classNames(
              `${prefixCls.value}-wrapper`,
              `${prefixCls.value}-picture-card-wrapper`,
              rtlCls,
              attrs.class,
              hashId.value,
            )}
          >
            {renderUploadList(renderUploadButton, !!(children && children.length))}
          </span>,
        );
      }
      return wrapSSR(
        <span
          {...attrs}
          class={classNames(`${prefixCls.value}-wrapper`, rtlCls, attrs.class, hashId.value)}
        >
          {renderUploadButton(children && children.length ? undefined : { display: 'none' })}
          {renderUploadList()}
        </span>,
      );
    };
  },
});
