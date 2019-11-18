<script>
import VcSwitch from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    toggle() {
      this.disabled = !this.disabled;
    },
    onChange(value) {
      console.log(`switch checked: ${value}`); // eslint-disable-line
    },
  },
  render() {
    return (
      <div style="margin: 20px">
        <VcSwitch
          onChange={this.onChange}
          disabled={this.disabled}
          checkedChildren={'开'}
          unCheckedChildren={'关'}
        />
        <div style="margin-top: 20px">
          <button onClick={this.toggle}>toggle disabled</button>
        </div>
      </div>
    );
  },
};
</script>
