import PropTypes from '../../_util/vue-types';
import { generateData, calcTotal } from './util';

var Gen = {
  props: {
    x: PropTypes.number.def(20),
    y: PropTypes.number.def(18),
    z: PropTypes.number.def(1)
  },
  data: function data() {
    return {
      nums: ''
    };
  },
  mounted: function mounted() {
    this.$refs.x.value = this.x;
    this.$refs.y.value = this.y;
    this.$refs.z.value = this.z;
    var vals = this.getVals();
    this.$emit('gen', generateData(vals.x, vals.y, vals.z));
  },

  methods: {
    onGen: function onGen(e) {
      e.preventDefault();
      var vals = this.getVals();
      this.$emit('gen', generateData(vals.x, vals.y, vals.z));
      this.nums = calcTotal(vals.x, vals.y, vals.z);
    },
    getVals: function getVals() {
      return {
        x: parseInt(this.$refs.x.value, 10),
        y: parseInt(this.$refs.y.value, 10),
        z: parseInt(this.$refs.z.value, 10)
      };
    }
  },

  render: function render() {
    var h = arguments[0];
    var x = this.x,
        y = this.y,
        z = this.z;

    return h(
      'div',
      { style: { padding: '0 20px' } },
      [h('h2', ['big data generator']), h(
        'form',
        {
          on: {
            'submit': this.onGen
          }
        },
        [h(
          'span',
          { style: { marginRight: '10px' } },
          ['x: ', h('input', { ref: 'x', attrs: { type: 'number', min: '1', required: true },
            style: { width: '50px' } })]
        ), h(
          'span',
          { style: { marginRight: '10px' } },
          ['y: ', h('input', { ref: 'y', attrs: { type: 'number', min: '1', required: true },
            style: { width: '50px' } })]
        ), h(
          'span',
          { style: { marginRight: '10px' } },
          ['z: ', h('input', { ref: 'z', attrs: { type: 'number', min: '1', required: true },
            style: { width: '50px' } })]
        ), h(
          'button',
          {
            attrs: { type: 'submit' }
          },
          ['Generate']
        ), h('p', ['total nodes: ', this.nums || calcTotal(x, y, z)])]
      ), h(
        'p',
        { style: { fontSize: '12px' } },
        ['x\uFF1A\u6BCF\u4E00\u7EA7\u4E0B\u7684\u8282\u70B9\u603B\u6570\u3002y\uFF1A\u6BCF\u7EA7\u8282\u70B9\u91CC\u6709y\u4E2A\u8282\u70B9\u3001\u5B58\u5728\u5B50\u8282\u70B9\u3002z\uFF1A\u6811\u7684level\u5C42\u7EA7\u6570\uFF080\u8868\u793A\u4E00\u7EA7\uFF09']
      )]
    );
  }
};

export default Gen;