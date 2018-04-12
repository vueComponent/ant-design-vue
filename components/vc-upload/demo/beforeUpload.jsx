import Upload from '../index'

export default {
  render () {
    const uploaderProps = {
      props: {
        action: '/upload.do',
        multiple: true,
        beforeUpload (file, fileList) {
          console.log(file, fileList)
          return new Promise((resolve) => {
            console.log('start check')
            setTimeout(() => {
              console.log('check finshed')
              resolve(file)
            }, 3000)
          })
        },
      },
      on: {
        start: (file) => {
          console.log('onStart', file.name)
        },
        success (file) {
          console.log('onSuccess', file)
        },
        error (err) {
          console.log('onError', err)
        },
      },
    }
    return (
      <div
        style={{
          margin: '100px',
        }}
      >
        <div>
          <Upload {...uploaderProps}><a>开始上传</a></Upload>
        </div>
      </div>
    )
  },
}
