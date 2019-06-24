import Upload from '../index';
import axios from 'axios';

export default {
  render() {
    const uploaderProps = {
      props: {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        multiple: false,
        data: {
          a: 1,
          b: 2,
        },
        headers: {
          Authorization: '$prefix $token',
        },
        customRequest({
          action,
          data,
          file,
          filename,
          headers,
          onError,
          onProgress,
          onSuccess,
          withCredentials,
        }) {
          // EXAMPLE: post form-data with 'axios'
          const formData = new FormData();
          if (data) {
            Object.keys(data).map(key => {
              formData.append(key, data[key]);
            });
          }
          formData.append(filename, file);

          axios
            .post(action, formData, {
              withCredentials,
              headers,
              onUploadProgress: ({ total, loaded }) => {
                onProgress(
                  {
                    percent: Math.round((loaded / total) * 100).toFixed(2),
                  },
                  file,
                );
              },
            })
            .then(({ data: response }) => {
              onSuccess(response, file);
            })
            .catch(onError);

          return {
            abort() {
              console.log('upload progress is aborted.');
            },
          };
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
        progress({ percent }, file) {
          console.log('progress', `${percent}%`, file.name);
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
