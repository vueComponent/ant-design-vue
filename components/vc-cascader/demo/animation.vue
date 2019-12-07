<script>
/* eslint-disable no-console */
import '../assets/index.less';
import Cascader from '../index';

const addressOptions = [
  {
    label: '福建',
    value: 'fj',
    children: [
      {
        label: '福州',
        value: 'fuzhou',
        children: [
          {
            label: '马尾',
            value: 'mawei',
          },
        ],
      },
      {
        label: '泉州',
        value: 'quanzhou',
      },
    ],
  },
  {
    label: '浙江',
    value: 'zj',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          {
            label: '余杭',
            value: 'yuhang',
          },
        ],
      },
    ],
  },
  {
    label: '北京',
    value: 'bj',
    children: [
      {
        label: '朝阳区',
        value: 'chaoyang',
      },
      {
        label: '海淀区',
        value: 'haidian',
      },
    ],
  },
];

export default {
  data() {
    return {
      inputValue: '',
    };
  },
  methods: {
    onChange(value, selectedOptions) {
      console.log(value, selectedOptions);
      this.inputValue = selectedOptions.map(o => o.label).join(', ');
    },
  },

  render() {
    return (
      <Cascader options={addressOptions} onChange={this.onChange} transitionName="slide-up">
        <input value={this.inputValue} />
      </Cascader>
    );
  },
};
</script>
