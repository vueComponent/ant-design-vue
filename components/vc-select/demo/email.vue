<script>
import Select, { Option } from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
      options: [],
    };
  },
  methods: {
    onChange(value) {
      console.log('onChange', value);
      let options = [];
      if (value) {
        if (value.indexOf('@') >= 0) {
          options = <Option key={value}>{value}</Option>;
        } else {
          options = ['gmail.com', 'yahoo.com', 'outlook.com'].map(domain => {
            const email = `${value}@${domain}`;
            return <Option key={email}>{email}</Option>;
          });
        }
      }
      this.options = options;
    },
    onSelect(v) {
      console.log('onSelect', v);
    },
  },

  render() {
    return (
      <Select
        combobox
        notFoundContent={false}
        style="width: 200px"
        onChange={this.onChange}
        onSelect={this.onSelect}
        placeholder="请输入账户名"
      >
        {this.options}
      </Select>
    );
  },
};
</script>
