<script>
/* eslint-disable no-console */
import '../assets/index.less';
import Cascader from '../index';

const addressOptions = [
  {
    name: '福建',
    code: 'fj',
    nodes: [
      {
        name: '福州',
        code: 'fuzhou',
        nodes: [
          {
            name: '马尾',
            code: 'mawei',
          },
        ],
      },
      {
        name: '泉州',
        code: 'quanzhou',
      },
    ],
  },
  {
    name: '浙江',
    code: 'zj',
    nodes: [
      {
        name: '杭州',
        code: 'hangzhou',
        nodes: [
          {
            name: '余杭',
            code: 'yuhang',
          },
        ],
      },
    ],
  },
  {
    name: '北京',
    code: 'bj',
    nodes: [
      {
        name: '朝阳区',
        code: 'chaoyang',
      },
      {
        name: '海淀区',
        code: 'haidian',
        disabled: true,
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
      this.inputValue = selectedOptions.map(o => o.name).join(', ');
    },
  },

  render() {
    return (
      <Cascader
        options={addressOptions}
        onChange={this.onChange}
        fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
      >
        <input placeholder="please select address" value={this.inputValue} />
      </Cascader>
    );
  },
};
</script>
