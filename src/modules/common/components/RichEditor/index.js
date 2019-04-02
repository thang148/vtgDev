import React from 'react';
import injectIntl from 'intl';
import axios from 'utils/api';
import { RESOURCES_PATH } from 'consts';
import scriptLoader from 'react-async-script-loader';

const UPLOAD_URL = 'api/content/create-upload';

class HTMLEditor extends React.PureComponent {
  initizial = () => {
    const initProps = {
      target: this.element,
      readonly: this.props.disabled,
      toolbar: this.props.toolbar,
      plugins: this.props.plugins,
      height: this.props.height,
      file_picker_types: 'image',
      entity_encoding: 'utf-8',
      content_style: 'img {max-width: 100%;height: auto;}',
      image_caption: true,
      relative_urls: false,
      remove_script_host: false,
      setup: (editor) => {
        this.editor = editor;
        editor.on('init', this.onInit);
      }
    };
    if (this.props.allowUpload) {
      initProps.images_upload_handler = this.onUploadImage;
    }
    this.element.style.visibility = '';
    getTinymce().init(initProps);
  };

  onInit = () => {
    const value =
      typeof this.props.value === 'string' ? this.props.value : typeof this.props.initialValue === 'string' ? this.props.initialValue : '';
    this.editor.setContent(value);
    this.editor.on('change keyup setcontent', (e) => {
      this.currentContent = this.editor.getContent();
      this.onEditorChange(this.currentContent);
    });
  }

  onEditorChange = (e) => {
    if (this.props.onChange)
      this.props.onChange(e);
  }

  onUploadImage = (blobInfo, success, failure) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob());
    axios.post(UPLOAD_URL + '?isWatermark=true', formData)
      .then((data) => {
        if (data) {
          success(RESOURCES_PATH + data.name);
          if (this.props.onUploadImage) {
            this.onUploadImage(data);
          }
        } else {
          failure(this.props.t("ERROR"));
        }
      }).catch(() => {
        failure(this.props.t("ERROR"));
      });
  }

  componentDidUpdate({ isScriptLoadSucceed }) {
    if (!isScriptLoadSucceed && this.props.isScriptLoadSucceed) {
      this.initizial();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.editor && this.editor.initialized) {
      this.currentContent = this.currentContent || this.editor.getContent();

      if (typeof nextProps.value === 'string' && nextProps.value !== this.props.value && nextProps.value !== this.currentContent) {
        this.editor.setContent(nextProps.value);
      }
      if (typeof nextProps.disabled === 'boolean' && nextProps.disabled !== this.props.disabled) {
        this.editor.setMode(nextProps.disabled ? 'readonly' : 'design');
      }
    }
  }

  componentWillUnmount() {
    if (getTinymce() !== null) {
      getTinymce().remove(this.editor);
    }
  }

  render() {
    return (<textarea ref={(elm) => (this.element = elm)} style={{ visibility: 'hidden' }} id={this.id} name={this.props.textareaName} />);
  }
}

const getGlobal = () => (typeof window !== 'undefined' ? window : global);

const getTinymce = () => {
  const global = getGlobal();
  return global && global.tinymce ? global.tinymce : null;
};

HTMLEditor.defaultProps = {
  onChange: () => { },
  height: 480,
  plugins: 'fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools colorpicker textpattern',
  toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat'
}

export default injectIntl(scriptLoader(`${process.env.PUBLIC_URL}/js/tinymce/tinymce.min.js`)(HTMLEditor));
