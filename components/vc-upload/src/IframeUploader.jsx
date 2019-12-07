import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import classNames from 'classnames';
import getUid from './uid';
import warning from '../../_util/warning';

const IFRAME_STYLE = {
  position: 'absolute',
  top: 0,
  opacity: 0,
  filter: 'alpha(opacity=0)',
  left: 0,
  zIndex: 9999,
};

// diferent from AjaxUpload, can only upload on at one time, serial seriously
const IframeUploader = {
  mixins: [BaseMixin],
  props: {
    componentTag: PropTypes.string,
    // style: PropTypes.object,
    disabled: PropTypes.bool,
    prefixCls: PropTypes.string,
    // className: PropTypes.string,
    accept: PropTypes.string,
    // onStart: PropTypes.func,
    multiple: PropTypes.bool,
    // children: PropTypes.any,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    name: PropTypes.string,
  },
  data() {
    this.file = {};
    return {
      uploading: false,
    };
  },
  methods: {
    onLoad() {
      if (!this.uploading) {
        return;
      }
      const { file } = this;
      let response;
      try {
        const doc = this.getIframeDocument();
        const script = doc.getElementsByTagName('script')[0];
        if (script && script.parentNode === doc.body) {
          doc.body.removeChild(script);
        }
        response = doc.body.innerHTML;
        this.$emit('success', response, file);
      } catch (err) {
        warning(
          false,
          'cross domain error for Upload. Maybe server should return document.domain script. see Note from https://github.com/react-component/upload',
        );
        response = 'cross-domain';
        this.$emit('error', err, null, file);
      }
      this.endUpload();
    },
    onChange() {
      const target = this.getFormInputNode();
      // ie8/9 don't support FileList Object
      // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
      const file = (this.file = {
        uid: getUid(),
        name:
          target.value &&
          target.value.substring(target.value.lastIndexOf('\\') + 1, target.value.length),
      });
      this.startUpload();
      const { $props: props } = this;
      if (!props.beforeUpload) {
        return this.post(file);
      }
      const before = props.beforeUpload(file);
      if (before && before.then) {
        before.then(
          () => {
            this.post(file);
          },
          () => {
            this.endUpload();
          },
        );
      } else if (before !== false) {
        this.post(file);
      } else {
        this.endUpload();
      }
    },
    getIframeNode() {
      return this.$refs.iframeRef;
    },
    getIframeDocument() {
      return this.getIframeNode().contentDocument;
    },
    getFormNode() {
      return this.getIframeDocument().getElementById('form');
    },
    getFormInputNode() {
      return this.getIframeDocument().getElementById('input');
    },
    getFormDataNode() {
      return this.getIframeDocument().getElementById('data');
    },
    getFileForMultiple(file) {
      return this.multiple ? [file] : file;
    },
    getIframeHTML(domain) {
      let domainScript = '';
      let domainInput = '';
      if (domain) {
        const script = 'script';
        domainScript = `<${script}>document.domain="${domain}";</${script}>`;
        domainInput = `<input name="_documentDomain" value="${domain}" />`;
      }
      return `
      <!DOCTYPE html>
      <html>
      <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style>
      body,html {padding:0;margin:0;border:0;overflow:hidden;}
      </style>
      ${domainScript}
      </head>
      <body>
      <form method="post"
      encType="multipart/form-data"
      action="" id="form"
      style="display:block;height:9999px;position:relative;overflow:hidden;">
      <input id="input" type="file"
       name="${this.name}"
       style="position:absolute;top:0;right:0;height:9999px;font-size:9999px;cursor:pointer;"/>
      ${domainInput}
      <span id="data"></span>
      </form>
      </body>
      </html>
      `;
    },
    initIframeSrc() {
      if (this.domain) {
        this.getIframeNode().src = `javascript:void((function(){
          var d = document;
          d.open();
          d.domain='${this.domain}';
          d.write('');
          d.close();
        })())`;
      }
    },
    initIframe() {
      const iframeNode = this.getIframeNode();
      let win = iframeNode.contentWindow;
      let doc;
      this.domain = this.domain || '';
      this.initIframeSrc();
      try {
        doc = win.document;
      } catch (e) {
        this.domain = document.domain;
        this.initIframeSrc();
        win = iframeNode.contentWindow;
        doc = win.document;
      }
      doc.open('text/html', 'replace');
      doc.write(this.getIframeHTML(this.domain));
      doc.close();
      this.getFormInputNode().onchange = this.onChange;
    },
    endUpload() {
      if (this.uploading) {
        this.file = {};
        // hack avoid batch
        this.uploading = false;
        this.setState({
          uploading: false,
        });
        this.initIframe();
      }
    },
    startUpload() {
      if (!this.uploading) {
        this.uploading = true;
        this.setState({
          uploading: true,
        });
      }
    },
    updateIframeWH() {
      const rootNode = this.$el;
      const iframeNode = this.getIframeNode();
      iframeNode.style.height = `${rootNode.offsetHeight}px`;
      iframeNode.style.width = `${rootNode.offsetWidth}px`;
    },
    abort(file) {
      if (file) {
        let uid = file;
        if (file && file.uid) {
          uid = file.uid;
        }
        if (uid === this.file.uid) {
          this.endUpload();
        }
      } else {
        this.endUpload();
      }
    },
    post(file) {
      const formNode = this.getFormNode();
      const dataSpan = this.getFormDataNode();
      let { data } = this.$props;
      if (typeof data === 'function') {
        data = data(file);
      }
      const inputs = document.createDocumentFragment();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const input = document.createElement('input');
          input.setAttribute('name', key);
          input.value = data[key];
          inputs.appendChild(input);
        }
      }
      dataSpan.appendChild(inputs);
      new Promise(resolve => {
        const { action } = this;
        if (typeof action === 'function') {
          return resolve(action(file));
        }
        resolve(action);
      }).then(action => {
        formNode.setAttribute('action', action);
        formNode.submit();
        dataSpan.innerHTML = '';
        this.$emit('start', file);
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateIframeWH();
      this.initIframe();
    });
  },
  updated() {
    this.$nextTick(() => {
      this.updateIframeWH();
    });
  },

  render() {
    const { componentTag: Tag, disabled, prefixCls } = this.$props;
    const iframeStyle = {
      ...IFRAME_STYLE,
      display: this.uploading || disabled ? 'none' : '',
    };
    const cls = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
    });

    return (
      <Tag className={cls} style={{ position: 'relative', zIndex: 0 }}>
        <iframe ref="iframeRef" onLoad={this.onLoad} style={iframeStyle} />
        {this.$slots.default}
      </Tag>
    );
  },
};

export default IframeUploader;
