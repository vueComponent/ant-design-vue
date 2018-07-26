import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import Upload from '../index';

export default {
  data: function data() {
    return {
      destroyed: false
    };
  },

  methods: {
    destroy: function destroy() {
      this.destroyed = true;
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.destroyed) {
      return null;
    }
    var propsObj = {
      action: '/upload.do',
      data: { a: 1, b: 2 },
      headers: {
        Authorization: 'xxxxxxx'
      },
      multiple: true,
      beforeUpload: function beforeUpload(file) {
        console.log('beforeUpload', file.name);
      }
    };
    var propsEvent = {
      start: function start(file) {
        console.log('onStart', file.name);
        // this.refs.inner.abort(file);
      },
      success: function success(file) {
        console.log('onSuccess', file);
      },
      progress: function progress(step, file) {
        console.log('onProgress', Math.round(step.percent), file.name);
      },
      error: function error(err) {
        console.log('onError', err);
      }
    };
    var uploaderProps = {
      props: _extends({}, propsObj),
      on: _extends({}, propsEvent),
      ref: 'inner'
    };
    var uploaderProps1 = {
      props: _extends({}, propsObj, {
        componentTag: 'div'
      }),
      on: _extends({}, propsEvent)
    };
    var style = '\n        .rc-upload-disabled {\n           opacity:0.5;\n        ';
    return h(
      'div',
      {
        style: {
          margin: '100px'
        }
      },
      [h('h2', ['\u56FA\u5B9A\u4F4D\u7F6E']), h('style', [style]), h('div', [h(
        Upload,
        uploaderProps,
        [h('a', ['\u5F00\u59CB\u4E0A\u4F20'])]
      )]), h('h2', ['\u6EDA\u52A8']), h(
        'div',
        {
          style: {
            height: '200px',
            overflow: 'auto',
            border: '1px solid red'
          }
        },
        [h(
          'div',
          {
            style: {
              height: '500px'
            }
          },
          [h(
            Upload,
            _mergeJSXProps([uploaderProps1, { style: { display: 'inline-block' } }]),
            [h('a', ['\u5F00\u59CB\u4E0A\u4F202'])]
          )]
        )]
      ), h(
        'button',
        {
          on: {
            'click': this.destroy
          }
        },
        ['destroy']
      )]
    );
  }
};