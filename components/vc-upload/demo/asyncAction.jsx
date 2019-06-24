import Upload from '../index';

export default {
  render() {
    const uploaderProps = {
      props: {
        action: () => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve('https://www.mocky.io/v2/5cc8019d300000980a055e76');
            }, 2000);
          });
        },
      },
      on: {
        start(file) {
          console.log('start', file, file.name);
        },
        success(file) {
          console.log('success', file);
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
