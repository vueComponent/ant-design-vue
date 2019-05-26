import Upload from '../index';

export default {
  render() {
    const uploaderProps = {
      props: {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        type: 'drag',
        accept: '.png',
        beforeUpload(file) {
          console.log('beforeUpload', file.name);
        },
        openFileDialogOnClick: false,
      },
      on: {
        start(file) {
          console.log('start', file, file.name);
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
        click() {
          alert('click');
        },
      },
      style: {
        display: 'inline-block',
        width: '200px',
        height: '200px',
        background: '#eee',
      },
    };
    return <Upload {...uploaderProps} />;
  },
};
