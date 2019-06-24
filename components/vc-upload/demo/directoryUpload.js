import Upload from '../index';

export default {
  render() {
    const uploaderProps = {
      props: {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        data: {
          a: 1,
          b: 2,
        },
        headers: {
          Authorization: 'xxxxxxx',
        },
        directory: true,
        beforeUpload(file) {
          console.log('beforeUpload', file.name);
        },
      },
      on: {
        start(file) {
          console.log('start', file.name);
        },
        success(file) {
          console.log('success', file);
        },
        progress(step, file) {
          console.log('progress', Math.round(step.percent), file.name);
        },
        error(err) {
          console.log('error', err);
        },
      },
      style: {
        margin: '100px',
      },
    };
    return (
      <Upload {...uploaderProps}>
        <a>开始上传</a>
      </Upload>
    );
  },
};
