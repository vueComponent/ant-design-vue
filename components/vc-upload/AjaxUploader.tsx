import defaultRequest from './request';
import getUid from './uid';
import attrAccept from './attr-accept';
import traverseFileTree from './traverseFileTree';
import type {
  RcFile,
  UploadProgressEvent,
  UploadRequestError,
  BeforeUploadFileType,
} from './interface';
import { uploadProps } from './interface';
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ChangeEvent } from '../_util/EventInterface';
import pickAttrs from '../_util/pickAttrs';
import partition from 'lodash-es/partition';

interface ParsedFileInfo {
  origin: RcFile;
  action: string;
  data: Record<string, unknown>;
  parsedFile: RcFile;
}
export default defineComponent({
  name: 'AjaxUploader',
  inheritAttrs: false,
  props: uploadProps(),
  setup(props, { slots, attrs, expose }) {
    const uid = ref(getUid());
    const reqs: any = {};

    const fileInput = ref<HTMLInputElement>();

    let isMounted = false;

    /**
     * Process file before upload. When all the file is ready, we start upload.
     */
    const processFile = async (file: RcFile, fileList: RcFile[]): Promise<ParsedFileInfo> => {
      const { beforeUpload } = props;

      let transformedFile: BeforeUploadFileType | void = file;
      if (beforeUpload) {
        try {
          transformedFile = await beforeUpload(file, fileList);
        } catch (e) {
          // Rejection will also trade as false
          transformedFile = false;
        }
        if (transformedFile === false) {
          return {
            origin: file,
            parsedFile: null,
            action: null,
            data: null,
          };
        }
      }

      // Get latest action
      const { action } = props;
      let mergedAction: string;
      if (typeof action === 'function') {
        mergedAction = await action(file);
      } else {
        mergedAction = action;
      }

      // Get latest data
      const { data } = props;
      let mergedData: Record<string, unknown>;
      if (typeof data === 'function') {
        mergedData = await data(file);
      } else {
        mergedData = data;
      }

      const parsedData =
        // string type is from legacy `transformFile`.
        // Not sure if this will work since no related test case works with it
        (typeof transformedFile === 'object' || typeof transformedFile === 'string') &&
        transformedFile
          ? transformedFile
          : file;

      let parsedFile: File;
      if (parsedData instanceof File) {
        parsedFile = parsedData;
      } else {
        parsedFile = new File([parsedData], file.name, { type: file.type });
      }

      const mergedParsedFile: RcFile = parsedFile as RcFile;
      mergedParsedFile.uid = file.uid;

      return {
        origin: file,
        data: mergedData,
        parsedFile: mergedParsedFile,
        action: mergedAction,
      };
    };

    const post = ({ data, origin, action, parsedFile }: ParsedFileInfo) => {
      if (!isMounted) {
        return;
      }

      const { onStart, customRequest, name, headers, withCredentials, method } = props;

      const { uid } = origin;
      const request = customRequest || defaultRequest;

      const requestOption = {
        action,
        filename: name,
        data,
        file: parsedFile,
        headers,
        withCredentials,
        method: method || 'post',
        onProgress: (e: UploadProgressEvent) => {
          const { onProgress } = props;
          onProgress?.(e, parsedFile);
        },
        onSuccess: (ret: any, xhr: XMLHttpRequest) => {
          const { onSuccess } = props;
          onSuccess?.(ret, parsedFile, xhr);

          delete reqs[uid];
        },
        onError: (err: UploadRequestError, ret: any) => {
          const { onError } = props;
          onError?.(err, ret, parsedFile);

          delete reqs[uid];
        },
      };

      onStart(origin);
      reqs[uid] = request(requestOption);
    };

    const reset = () => {
      uid.value = getUid();
    };

    const abort = (file?: any) => {
      if (file) {
        const uid = file.uid ? file.uid : file;
        if (reqs[uid] && reqs[uid].abort) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      } else {
        Object.keys(reqs).forEach(uid => {
          if (reqs[uid] && reqs[uid].abort) {
            reqs[uid].abort();
          }
          delete reqs[uid];
        });
      }
    };

    onMounted(() => {
      isMounted = true;
    });

    onBeforeUnmount(() => {
      isMounted = false;
      abort();
    });
    const uploadFiles = (files: File[]) => {
      const originFiles = [...files] as RcFile[];
      const postFiles = originFiles.map((file: RcFile & { uid?: string }) => {
        // eslint-disable-next-line no-param-reassign
        file.uid = getUid();
        return processFile(file, originFiles);
      });

      // Batch upload files
      Promise.all(postFiles).then(fileList => {
        const { onBatchStart } = props;

        onBatchStart?.(fileList.map(({ origin, parsedFile }) => ({ file: origin, parsedFile })));

        fileList
          .filter(file => file.parsedFile !== null)
          .forEach(file => {
            post(file);
          });
      });
    };

    const onChange = (e: ChangeEvent) => {
      const { accept, directory } = props;
      const { files } = e.target as any;
      const acceptedFiles = [...files].filter(
        (file: RcFile) => !directory || attrAccept(file, accept),
      );
      uploadFiles(acceptedFiles);
      reset();
    };

    const onClick = (e: MouseEvent | KeyboardEvent) => {
      const el = fileInput.value;
      if (!el) {
        return;
      }
      const { onClick } = props;
      // TODO
      // if (children && (children as any).type === 'button') {
      //   const parent = el.parentNode as HTMLInputElement;
      //   parent.focus();
      //   parent.querySelector('button').blur();
      // }
      el.click();
      if (onClick) {
        onClick(e);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onClick(e);
      }
    };

    const onFileDrop = (e: DragEvent) => {
      const { multiple } = props;

      e.preventDefault();

      if (e.type === 'dragover') {
        return;
      }

      if (props.directory) {
        traverseFileTree(
          Array.prototype.slice.call(e.dataTransfer.items),
          uploadFiles,
          (_file: RcFile) => attrAccept(_file, props.accept),
        );
      } else {
        const files: [RcFile[], RcFile[]] = partition(
          Array.prototype.slice.call(e.dataTransfer.files),
          (file: RcFile) => attrAccept(file, props.accept),
        );
        let successFiles = files[0];
        const errorFiles = files[1];
        if (multiple === false) {
          successFiles = successFiles.slice(0, 1);
        }

        uploadFiles(successFiles);
        if (errorFiles.length && props.onReject) props.onReject(errorFiles);
      }
    };
    expose({
      abort,
    });
    return () => {
      const {
        componentTag: Tag,
        prefixCls,
        disabled,
        id,
        multiple,
        accept,
        capture,
        directory,
        openFileDialogOnClick,
        onMouseenter,
        onMouseleave,
        ...otherProps
      } = props;
      const cls = {
        [prefixCls]: true,
        [`${prefixCls}-disabled`]: disabled,
        [attrs.class as string]: !!attrs.class,
      };
      // because input don't have directory/webkitdirectory type declaration
      const dirProps: any = directory
        ? { directory: 'directory', webkitdirectory: 'webkitdirectory' }
        : {};
      const events = disabled
        ? {}
        : {
            onClick: openFileDialogOnClick ? onClick : () => {},
            onKeydown: openFileDialogOnClick ? onKeyDown : () => {},
            onMouseenter,
            onMouseleave,
            onDrop: onFileDrop,
            onDragover: onFileDrop,
            tabindex: '0',
          };
      return (
        <Tag {...events} class={cls} role="button" style={attrs.style}>
          <input
            {...pickAttrs(otherProps, { aria: true, data: true })}
            id={id}
            type="file"
            ref={fileInput}
            onClick={e => e.stopPropagation()} // https://github.com/ant-design/ant-design/issues/19948
            key={uid.value}
            style={{ display: 'none' }}
            accept={accept}
            {...dirProps}
            multiple={multiple}
            onChange={onChange}
            {...(capture != null ? { capture } : {})}
          />
          {slots.default?.()}
        </Tag>
      );
    };
  },
});
