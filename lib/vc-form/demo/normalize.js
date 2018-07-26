'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _styles = require('./styles');

/* eslint react/no-multi-comp:0, no-console:0 */

var CustomInput = {
  props: {
    form: Object
  },
  data: function data() {
    return {
      data: []
    };
  },

  methods: {
    checkUpper: function checkUpper(rule) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var callback = arguments[2];

      if (value !== value.toUpperCase()) {
        callback(new Error('need to be upper!'));
      } else {
        callback();
      }
    },
    toUpper: function toUpper(v, prev) {
      if (v === prev) {
        return v;
      }
      return v.toUpperCase();
    }
  },

  render: function render() {
    var h = arguments[0];
    var _form = this.form,
        getFieldProps = _form.getFieldProps,
        getFieldError = _form.getFieldError;

    var errors = getFieldError('upper');
    return h(
      'div',
      { style: _styles.regionStyle },
      [h('div', ['upper normalize']), h('div', [h('input', getFieldProps('upper', {
        normalize: this.toUpper,
        rules: [{
          validator: this.checkUpper
        }]
      }))]), h(
        'div',
        { style: _styles.errorStyle },
        [errors ? errors.join(',') : null]
      )]
    );
  }
};

var MaxMin = {
  props: {
    form: Object
  },
  methods: {
    normalizeMin: function normalizeMin(value, prevValue, allValues) {
      console.log('normalizeMin', allValues.min, allValues.max);
      var previousAllValues = this.form.getFieldsValue();
      if (allValues.max !== previousAllValues.max) {
        // max changed
        if (value === '' || Number(allValues.max) < Number(value)) {
          return allValues.max;
        }
      }
      return value;
    },
    normalizeMax: function normalizeMax(value, prevValue, allValues) {
      console.log('normalizeMax', allValues.min, allValues.max);
      var previousAllValues = this.form.getFieldsValue();
      if (allValues.min !== previousAllValues.min) {
        // min changed
        if (value === '' || Number(allValues.min) > Number(value)) {
          return allValues.min;
        }
      }
      return value;
    }
  },

  render: function render() {
    var h = arguments[0];
    var getFieldProps = this.form.getFieldProps;

    return h(
      'div',
      { style: _styles.regionStyle },
      [h('div', ['min: ', h(
        'select',
        getFieldProps('min', {
          normalize: this.normalizeMin,
          initialValue: ''
        }),
        [h(
          'option',
          {
            attrs: { value: '' }
          },
          ['empty']
        ), h(
          'option',
          {
            attrs: { value: '1' }
          },
          ['1']
        ), h(
          'option',
          {
            attrs: { value: '2' }
          },
          ['2']
        ), h(
          'option',
          {
            attrs: { value: '3' }
          },
          ['3']
        ), h(
          'option',
          {
            attrs: { value: '4' }
          },
          ['4']
        ), h(
          'option',
          {
            attrs: { value: '5' }
          },
          ['5']
        )]
      )]), h('div', ['max: ', h(
        'select',
        getFieldProps('max', {
          initialValue: '',
          normalize: this.normalizeMax
        }),
        [h(
          'option',
          {
            attrs: { value: '' }
          },
          ['empty']
        ), h(
          'option',
          {
            attrs: { value: '1' }
          },
          ['1']
        ), h(
          'option',
          {
            attrs: { value: '2' }
          },
          ['2']
        ), h(
          'option',
          {
            attrs: { value: '3' }
          },
          ['3']
        ), h(
          'option',
          {
            attrs: { value: '4' }
          },
          ['4']
        ), h(
          'option',
          {
            attrs: { value: '5' }
          },
          ['5']
        )]
      )])]
    );
  }
};

var Form = {
  // props: {
  //   form: Object,
  // },
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
    }
  },

  render: function render() {
    var h = arguments[0];
    var form = this.form;

    return h(
      'div',
      { style: { margin: '20px' } },
      [h('h2', ['normalize']), h(
        'form',
        {
          on: {
            'submit': this.onSubmit
          }
        },
        [h(CustomInput, {
          attrs: { form: form }
        }), h(MaxMin, {
          attrs: { form: form }
        }), h(
          'div',
          { style: _styles.regionStyle },
          [h('button', ['submit'])]
        )]
      )]
    );
  }
};

exports['default'] = (0, _index.createForm)()(Form);
module.exports = exports['default'];