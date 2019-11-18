<script>
import VcPagination from '../index';
import '../assets/index.less';

export default {
  data() {
    return {
      current: 3,
    };
  },
  methods: {
    onChange(page) {
      console.log(page);
      this.current = page;
    },
  },
  render() {
    return <VcPagination onChange={this.onChange} current={this.current} total={25} />;
  },
};
</script>
