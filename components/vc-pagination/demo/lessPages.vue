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
    return (
      <div>
        <VcPagination onChange={this.onChange} current={this.current} total={80} showLessItems />
        <VcPagination showLessItems defaultCurrent={1} total={60} />
      </div>
    );
  },
};
</script>
