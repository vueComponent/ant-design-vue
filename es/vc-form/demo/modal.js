/* eslint react/no-multi-comp:0, no-console:0 */

import BaseMixin from '../../_util/BaseMixin';
import createDOMForm from '../src/createDOMForm';
import { Modal } from 'vue-antd-ui';
import { regionStyle, errorStyle } from './styles';

var Form = {
  mixins: [BaseMixin],
  props: {
    form: Object
  },

  data: function data() {
    return {
      visible: false
    };
  },

  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll(function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    onCancel: function onCancel() {
      this.setState({
        visible: false
      });
    },
    open: function open() {
      this.setState({
        visible: true
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldProps = _form.getFieldProps,
        getFieldError = _form.getFieldError;

    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['modal']), h(
        Modal,
        {
          attrs: {
            visible: this.visible,
            bodyStyle: {
              height: '200px',
              overflow: 'auto'
            },

            title: 'modal'
          },
          on: {
            'cancel': this.onCancel
          }
        },
        [h(
          'div',
          { ref: 'dialogContent' },
          [h(
            'form',
            {
              on: {
                'submit': this.onSubmit
              }
            },
            [h('input', getFieldProps('required', {
              rules: [{
                required: true,
                message: '必填'
              }]
            })), h(
              'div',
              { style: errorStyle },
              [getFieldError('required') ? getFieldError('required').join(',') : h(
                'b',
                { style: { visibility: 'hidden' } },
                ['1']
              )]
            ), h(
              'div',
              { style: { marginTop: '300px' } },
              [h('button', ['submit'])]
            )]
          )]
        )]
      ), h(
        'div',
        { style: regionStyle },
        [h(
          'button',
          {
            on: {
              'click': this.open
            }
          },
          ['open']
        )]
      )]
    );
  }
};

export default createDOMForm()(Form);