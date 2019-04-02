import React from 'react';
import axios from 'utils/api';
import { Upload } from 'antd';

const UPLOAD_URL = 'api/content/create-upload';

export default class UploadWrapper extends React.PureComponent {
  render() {
    const newProps = {
      ...{
        name: 'file',
        action: UPLOAD_URL + `?isWatermark=${!!this.props.isWatermark}`,
        accept: 'image/*',
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
          const formData = new FormData();
          if (data) {
            Object.keys(data).forEach(key => {
              formData.append(key, data[key]);
            });
          }
          formData.append(filename, file);

          axios
            .post(action, formData, {
              withCredentials,
              headers,
              onUploadProgress: ({ total, loaded }) => {
                onProgress({ percent: Number(Math.round(loaded / total * 100).toFixed(2)) }, file);
              },
            })
            .then((res) => {
              onSuccess(res, file);
            })
            .catch(onError);

          return {
            abort() {
              console.log('upload progress is aborted.');
            },
          };
        }
      }, ...this.props
    }
    return (<Upload {...newProps} />)
  }
} 