import PropTypes from '../../_util/vue-types'
import BaseMixin from '../../_util/BaseMixin'
import classNames from 'classnames'
import defaultRequest from './request'
import getUid from './uid'
import attrAccept from './attr-accept'

const upLoadPropTypes = {
  component: PropTypes.string,
  // style: PropTypes.object,
  prefixCls: PropTypes.string,
  // className: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  // children: PropTypes.any,
  // onStart: PropTypes.func,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  headers: PropTypes.object,
  beforeUpload: PropTypes.func,
  customRequest: PropTypes.func,
  // onProgress: PropTypes.func,
  withCredentials: PropTypes.bool,
}

const AjaxUploader = {
  mixins: [BaseMixin],
  props: upLoadPropTypes,
  data () {
    this.reqs = {}
    return {
      uid: getUid(),
    }
  },
  methods: {
    onChange (e) {
      const files = e.target.files
      this.uploadFiles(files)
      this.reset()
    },
    onClick () {
      const el = this.$refs.fileInputRef
      if (!el) {
        return
      }
      el.click()
    },
    onKeyDown (e) {
      if (e.key === 'Enter') {
        this.onClick()
      }
    },
    onFileDrop (e) {
      if (e.type === 'dragover') {
        e.preventDefault()
        return
      }
      const files = Array.prototype.slice.call(e.dataTransfer.files).filter(
        file => attrAccept(file, this.accept)
      )
      this.uploadFiles(files)

      e.preventDefault()
    },
    uploadFiles (files) {
      const postFiles = Array.prototype.slice.call(files)
      postFiles.forEach((file) => {
        file.uid = getUid()
        this.upload(file, postFiles)
      })
    },
    upload (file, fileList) {
      if (!this.beforeUpload) {
        // always async in case use react state to keep fileList
        return setTimeout(() => this.post(file), 0)
      }

      const before = this.beforeUpload(file, fileList)
      if (before && before.then) {
        before.then((processedFile) => {
          const processedFileType = Object.prototype.toString.call(processedFile)
          if (processedFileType === '[object File]' || processedFileType === '[object Blob]') {
            this.post(processedFile)
          } else {
            this.post(file)
          }
        }).catch(e => {
          console && console.log(e); // eslint-disable-line
        })
      } else if (before !== false) {
        setTimeout(() => this.post(file), 0)
      }
    },
    post (file) {
      if (!this._isMounted) {
        return
      }
      let { data } = this.$props
      if (typeof data === 'function') {
        data = data(file)
      }
      const { uid } = file
      const request = this.customRequest || defaultRequest
      this.reqs[uid] = request({
        action: this.action,
        filename: this.name,
        file,
        data,
        headers: this.headers,
        withCredentials: this.withCredentials,
        onProgress: e => {
          this.$emit('progress', e, file)
        },
        onSuccess: (ret, xhr) => {
          delete this.reqs[uid]
          this.$emit('success', ret, file, xhr)
        },
        onError: (err, ret) => {
          delete this.reqs[uid]
          this.$emit('error', err, ret, file)
        },
      })
      this.$emit('start', file)
    },
    reset () {
      this.setState({
        uid: getUid(),
      })
    },
    abort (file) {
      const { reqs } = this
      if (file) {
        let uid = file
        if (file && file.uid) {
          uid = file.uid
        }
        if (reqs[uid]) {
          reqs[uid].abort()
          delete reqs[uid]
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) {
            reqs[uid].abort()
          }

          delete reqs[uid]
        })
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
      this._isMounted = true
    })
  },
  beforeDestroy () {
    this._isMounted = false
    this.abort()
  },
  render () {
    const {
      component: Tag, prefixCls, disabled, multiple, accept,
    } = this.$props
    const cls = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
    })
    const events = disabled ? {} : {
      onClick: this.onClick,
      onKeydown: this.onKeyDown,
      onDrop: this.onFileDrop,
      onDragover: this.onFileDrop,
      tabIndex: '0',
    }
    return (
      <Tag
        {...events}
        class={cls}
        role='button'
      >
        <input
          type='file'
          ref='fileInputRef'
          key={this.uid}
          style={{ display: 'none' }}
          accept={accept}
          multiple={multiple}
          onChange={this.onChange}
        />
        {this.$slots.default}
      </Tag>
    )
  },
}

export default AjaxUploader
