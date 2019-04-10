import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import partition from 'lodash/partition';
import classNames from 'classnames';
import defaultRequest from './request';
import getUid from './uid';
import attrAccept from './attr-accept';
import traverseFileTree from './traverseFileTree';

const upLoadPropTypes = {
  componentTag: PropTypes.string,
  // style: PropTypes.object,
  prefixCls: PropTypes.string,
  name: PropTypes.string,
  // className: PropTypes.string,
  multiple: PropTypes.bool,
  directory: PropTypes.bool,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  // children: PropTypes.any,
  // onStart: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  headers: PropTypes.object,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  // onProgress: PropTypes.func,
  withCredentials: PropTypes.bool,
  openFileDialogOnClick: PropTypes.bool,
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
  beforeDestroy() {
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
      e.preventDefault();
      if (e.type === 'dragover') {
        return;
      }
      if (this.directory) {
        traverseFileTree(e.dataTransfer.items, this.uploadFiles, _file =>
          attrAccept(_file, this.accept),
        );
      } else {
        const files = partition(Array.prototype.slice.call(e.dataTransfer.files), file =>
          attrAccept(file, this.accept),
        );
        this.uploadFiles(files[0]);
        if (files[1].length) {
          this.$emit('reject', files[1]);
        }
      }
    },
    uploadFiles(files) {
      const postFiles = Array.prototype.slice.call(files);
      postFiles.forEach(file => {
        file.uid = getUid();
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
      let { data } = this.$props;
      if (typeof data === 'function') {
        data = data(file);
      }
      new Promise(resolve => {
        const { action } = this;
        if (typeof action === 'function') {
          return resolve(action(file));
        }
        resolve(action);
      }).then(action => {
        const { uid } = file;
        const request = this.customRequest || defaultRequest;
        this.reqs[uid] = request({
          action,
          filename: this.name,
          file,
          data,
          headers: this.headers,
          withCredentials: this.withCredentials,
          onProgress: e => {
            this.$emit('progress', e, file);
          },
          onSuccess: (ret, xhr) => {
            delete this.reqs[uid];
            this.$emit('success', ret, file, xhr);
          },
          onError: (err, ret) => {
            delete this.reqs[uid];
            this.$emit('error', err, ret, file);
          },
        });
        this.$emit('start', file);
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
        if (reqs[uid]) {
          reqs[uid].abort();
          delete reqs[uid];
        }
      } else {
        Object.keys(reqs).forEach(uid => {
          if (reqs[uid]) {
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
    const cls = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
    });
    const events = disabled
      ? {}
      : {
          click: openFileDialogOnClick ? this.onClick : () => {},
          keydown: this.onKeyDown,
          drop: this.onFileDrop,
          dragover: this.onFileDrop,
        };
    const tagProps = {
      on: {
        ...this.$listeners,
        ...events,
      },
      attrs: {
        role: 'button',
        tabIndex: disabled ? null : '0',
      },
      class: cls,
    };
    return (
      <Tag {...tagProps}>
        <input
          id={$attrs.id}
          type="file"
          ref="fileInputRef"
          key={this.uid}
          style={{ display: 'none' }}
          accept={accept}
          directory={directory ? 'directory' : null}
          webkitdirectory={directory ? 'webkitdirectory' : null}
          multiple={multiple}
          onChange={this.onChange}
        />
        {this.$slots.default}
      </Tag>
    );
  },
};

export default AjaxUploader;
