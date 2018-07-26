'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint react/no-multi-comp:0, no-console:0 */

var Form1 = {
  mixins: [_BaseMixin2['default']],
  props: {
    form: Object
  },
  data: function data() {
    return {
      useInput: true
    };
  },

  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    changeUseInput: function changeUseInput(e) {
      this.setState({
        useInput: e.target.checked
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldError = _form.getFieldError,
        getFieldDecorator = _form.getFieldDecorator;


    return h(
      'form',
      {
        on: {
          'submit': this.onSubmit
        }
      },
      [h('h2', ['situation 1']), this.useInput ? getFieldDecorator('name', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s your name 1?'
        }]
      })(h('input')) : null, h('span', ['text content']), this.useInput ? null : getFieldDecorator('name', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s your name 2?'
        }]
      })(h('input')), h('div', [h('label', [h('input', {
        attrs: { type: 'checkbox' },
        domProps: {
          'checked': this.useInput
        },
        on: {
          'input': this.changeUseInput
        }
      }), 'change input']), (getFieldError('name') || []).join(', ')]), h('button', ['Submit'])]
    );
  }
};

var Form2 = {
  mixins: [_BaseMixin2['default']],
  props: {
    form: Object
  },
  data: function data() {
    return {
      useInput: true
    };
  },
  beforeMount: function beforeMount() {
    var getFieldDecorator = this.form.getFieldDecorator;

    this.nameDecorator = getFieldDecorator('name', {
      initialValue: '',
      rules: [{
        required: true,
        message: 'What\'s your name?'
      }]
    });
  },

  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    changeUseInput: function changeUseInput(e) {
      this.setState({
        useInput: e.target.checked
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var getFieldError = this.form.getFieldError;

    return h(
      'form',
      {
        on: {
          'submit': this.onSubmit
        }
      },
      [h('h2', ['situation 2']), this.useInput ? this.nameDecorator(h('input')) : null, h('span', ['text content']), this.useInput ? null : this.nameDecorator(h('input')), h('div', [h('label', [h('input', {
        attrs: { type: 'checkbox' },
        domProps: {
          'checked': this.useInput
        },
        on: {
          'input': this.changeUseInput
        }
      }), 'change input']), (getFieldError('name') || []).join(', ')]), h('button', ['Submit'])]
    );
  }
};

var Form3 = {
  mixins: [_BaseMixin2['default']],
  props: {
    form: Object
  },
  data: function data() {
    return {
      useInput: false
    };
  },

  methods: {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(function (error, values) {
        if (!error) {
          console.log('ok', values);
        } else {
          console.log('error', error, values);
        }
      });
    },
    changeUseInput: function changeUseInput(e) {
      this.setState({
        useInput: e.target.checked
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form2 = this.form,
        getFieldError = _form2.getFieldError,
        getFieldDecorator = _form2.getFieldDecorator;

    return h(
      'form',
      {
        on: {
          'submit': this.onSubmit
        }
      },
      [h('h2', ['situation 3']), getFieldDecorator('name', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s your name 1?'
        }]
      })(h('input')), this.useInput ? null : getFieldDecorator('name2', {
        initialValue: '',
        rules: [{
          required: true,
          message: 'What\'s your name 2?'
        }]
      })(h('input')), h('div', [h('label', [h('input', {
        attrs: { type: 'checkbox' },
        domProps: {
          'checked': this.useInput
        },
        on: {
          'input': this.changeUseInput
        }
      }), 'Hide second input']), (getFieldError('name') || []).join(', ')]), h('button', ['Submit'])]
    );
  }
};

var WrappedForm1 = (0, _index.createForm)()(Form1);
var WrappedForm2 = (0, _index.createForm)()(Form2);
var WrappedForm3 = (0, _index.createForm)()(Form3);

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h('div', [h(WrappedForm1), h(WrappedForm2), h(WrappedForm3)]);
  }
};
module.exports = exports['default'];