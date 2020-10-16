import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import partition from 'lodash-es/partition';
import classNames from '../../_util/classNames';
import defaultRequest from './request';
import getUid from './uid';
import attrAccept from './attr-accept';
import traverseFileTree from './traverseFileTree';
import { getSlot } from '../../_util/props-util';

const upLoadPropTypes = {
  componentTag: PropTypes.string,
  // style: PropTypes.object,
  prefixCls: PropTypes.string,
  name: PropTypes.string,
  // className: PropTypes.string,
  multiple: PropTypes.looseBool,
  directory: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  accept: PropTypes.string,
  // children: PropTypes.any,
  // onStart: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  headers: PropTypes.object,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  // onProgress: PropTypes.func,
  withCredentials: PropTypes.looseBool,
  openFileDialogOnClick: PropTypes.looseBool,
  transformFile: PropTypes.func,
  method: PropTypes.string,
};

const AjaxUploader = {
  inheritAttrs: false,
  name: 'ajaxUploader',
  mixins: [BaseMixin],
  props: upLoadPropTypes,
  data() {
    this.reqs = {};
    return {
      uid: getUid(),
    };
  },
  mounted() {
    this._isMounted = true;
  },
  beforeUnmount() {
    this._isMounted = false;
    this.abort();
  },
  methods: {
    onChange(e) {
      const files = e.target.files;
      this.uploadFiles(files);
      this.reset();
    },
    onClick() {
      const el = this.$refs.fileInputRef;
      if (!el) {
        return;
      }
      el.click();
    },
    onKeyDown(e) {
      if (e.key === 'Enter') {
        this.onClick();
      }
    },
    onFileDrop(e) {
      const { multiple } = this.$props;
      e.preventDefault();
      if (e.type === 'dragover') {
        return;
      }
      if (this.directory) {
        traverseFileTree(e.dataTransfer.items, this.uploadFiles, _file =>
          attrAccept(_file, this.accept),
        );
      } else {
        let files = partition(Array.prototype.slice.call(e.dataTransfer.files), file =>
          attrAccept(file, this.accept),
        );
        let successFiles = files[0];
        const errorFiles = files[1];
        if (multiple === false) {
          successFiles = successFiles.slice(0, 1);
        }
        this.uploadFiles(successFiles);

        if (errorFiles.length) {
          this.__emit('reject', errorFiles);
        }
      }
    },
    uploadFiles(files) {
      const postFiles = Array.prototype.slice.call(files);
      postFiles
        .map(file => {
          file.uid = getUid();
          return file;
        })
        .forEach(file => {
          this.upload(file, postFiles);
        });
    },
    upload(file, fileList) {
      if (!this.beforeUpload) {
        // always async in case use react state to keep fileList
        return setTimeout(() => this.post(file), 0);
      }

      const before = this.beforeUpload(file, fileList);
      if (before && before.then) {
        before
          .then(processedFile => {
            const processedFileType = Object.prototype.toString.call(processedFile);
            if (processedFileType === '[object File]' || processedFileType === '[object Blob]') {
              return this.post(processedFile);
            }
            return this.post(file);
          })
          .catch(e => {
            console && console.log(e); // eslint-disable-line
          });
      } else if (before !== false) {
        setTimeout(() => this.post(file), 0);
      }
    },
    post(file) {
      if (!this._isMounted) {
        return;
      }
      const { $props: props } = this;
      let { data } = props;
      const { transformFile = originFile => originFile } = props;

      new Promise(resolve => {
        const { action } = this;
        if (typeof action === 'function') {
          return resolve(action(file));
        }
        resolve(action);
      }).then(action => {
        const { uid } = file;
        const request = this.customRequest || defaultRequest;
        const transform = Promise.resolve(transformFile(file)).catch(e => {
          console.error(e); // eslint-disable-line no-console
        });
        transform.then(transformedFile => {
          if (typeof data === 'function') {
            data = data(file);
          }

          const requestOption = {
            action,
            filename: this.name,
            data,
            file: transformedFile,
            headers: this.headers,
            withCredentials: this.withCredentials,
            method: props.method || 'post',
            onProgress: e => {
              this.__emit('progress', e, file);
            },
            onSuccess: (ret, xhr) => {
              delete this.reqs[uid];
              this.__emit('success', ret, file, xhr);
            },
            onError: (err, ret) => {
              delete this.reqs[uid];
              this.__emit('error', err, ret, file);
            },
          };
          this.reqs[uid] = request(requestOption);
          this.__emit('start', file);
        });
      });
    },
    reset() {
      this.setState({
        uid: getUid(),
      });
    },
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file && file.uid) {
          uid = file.uid;
        }
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
    },
  },

  render() {
    const { $props, $attrs } = this;
    const {
      componentTag: Tag,
      prefixCls,
      disabled,
      multiple,
      accept,
      directory,
      openFileDialogOnClick,
    } = $props;
    const { class: className, style, id } = $attrs;
    const cls = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
      [className]: className,
    });
    const events = disabled
      ? {}
      : {
          onClick: openFileDialogOnClick ? this.onClick : () => {},
          onKeydown: openFileDialogOnClick ? this.onKeyDown : () => {},
          onDrop: this.onFileDrop,
          onDragover: this.onFileDrop,
        };
    const tagProps = {
      ...events,
      role: 'button',
      tabindex: disabled ? null : '0',
      class: cls,
      style,
    };
    return (
      <Tag {...tagProps}>
        <input
          id={id}
          type="file"
          ref="fileInputRef"
          onClick={e => e.stopPropagation()} // https://github.com/ant-design/ant-design/issues/19948
          key={this.uid}
          style={{ display: 'none' }}
          accept={accept}
          directory={directory ? 'directory' : null}
          webkitdirectory={directory ? 'webkitdirectory' : null}
          multiple={multiple}
          onChange={this.onChange}
        />
        {getSlot(this)}
      </Tag>
    );
  },
};

export default AjaxUploader;
