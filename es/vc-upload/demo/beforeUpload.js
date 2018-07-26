import Upload from '../index';

export default {
  render: function render() {
    var h = arguments[0];

    var uploaderProps = {
      props: {
        action: '/upload.do',
        multiple: true,
        beforeUpload: function beforeUpload(file, fileList) {
          console.log(file, fileList);
          return new Promise(function (resolve) {
            console.log('start check');
            setTimeout(function () {
              console.log('check finshed');
              resolve(file);
            }, 3000);
          });
        }
      },
      on: {
        start: function start(file) {
          console.log('onStart', file.name);
        },
        success: function success(file) {
          console.log('onSuccess', file);
        },
        error: function error(err) {
          console.log('onError', err);
        }
      }
    };
    return h(
      'div',
      {
        style: {
          margin: '100px'
        }
      },
      [h('div', [h(
        Upload,
        uploaderProps,
        [h('a', ['\u5F00\u59CB\u4E0A\u4F20'])]
      )])]
    );
  }
};