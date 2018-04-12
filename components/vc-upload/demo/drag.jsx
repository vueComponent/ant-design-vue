import Upload from '../index'

export default {
  render () {
    const uploaderProps = {
      props: {
        action: '/upload.do',
        type: 'drag',
        accept: '.png',
        beforeUpload (file) {
          console.log('beforeUpload', file.name)
        },
      },
      on: {
        start: (file) => {
          console.log('onStart', file.name)
        },
        success (file) {
          console.log('onSuccess', file)
        },
        progress (step, file) {
          console.log('onProgress', Math.round(step.percent), file.name)
        },
        error (err) {
          console.log('onError', err)
        },
      },
      style: { display: 'inline-block', width: '200px', height: '200px', background: '#eee' },
    }
    return <Upload {...uploaderProps}></Upload>
  },
}
