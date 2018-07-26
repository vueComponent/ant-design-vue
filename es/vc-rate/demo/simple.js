import Rate from '../index';
import '../assets/index.less';

export default {
  data: function data() {
    return {};
  },

  methods: {
    onChange: function onChange(v) {
      console.log('selected star', v);
    },
    onFocus: function onFocus() {
      console.dir('focus');
    }
  },
  render: function render() {
    var h = arguments[0];
    var onChange = this.onChange,
        onFocus = this.onFocus;

    var rateProps = {
      props: {
        defaultValue: 2.5,
        allowHalf: true
      },
      on: {
        change: onChange
      },
      style: {
        fontSize: '50px', marginTop: '24px'
      }
    };
    var rateProps1 = {
      props: {
        defaultValue: 2
      },
      on: {
        change: onChange
      },
      style: {
        fontSize: '50px', marginTop: '24px'
      }
    };
    return h(
      'div',
      { style: 'margin: 100px' },
      [h(Rate, {
        attrs: {
          defaultValue: 2.5,

          allowHalf: true,
          allowClear: false,
          autoFocus: true,
          disabled: true
        },
        on: {
          'change': onChange,
          'focus': onFocus
        },

        style: 'fontSize: 40px' }), h('br'), h(Rate, {
        attrs: {
          defaultValue: 2.5,

          allowHalf: true,
          character: '$'
        },
        on: {
          'change': onChange
        },

        style: 'fontSize: 50px; marginTop: 24px' }), h('br'), h(
        Rate,
        rateProps,
        [h('i', { slot: 'character', 'class': 'anticon anticon-star' })]
      ), h('br'), h(
        Rate,
        rateProps1,
        [h('i', { slot: 'character', 'class': 'anticon anticon-star' })]
      )]
    );
  }
};