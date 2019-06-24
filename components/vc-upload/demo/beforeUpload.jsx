import Upload from '../index';

export default {
  render() {
    const uploaderProps = {
      props: {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        multiple: true,
        beforeUpload(file, fileList) {
          console.log(file, fileList);
          return new Promise(resolve => {
            console.log('start check');
            setTimeout(() => {
              console.log('check finshed');
              resolve(file);
            }, 3000);
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
    };
    return (
      <div
        style={{
          margin: '100px',
        }}
      >
        <div>
          <Upload {...uploaderProps}>
            <a>开始上传</a>
          </Upload>
        </div>
      </div>
    );
  },
};
