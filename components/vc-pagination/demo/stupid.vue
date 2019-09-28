<script>
import VcPagination from '../index';
import '../assets/index.less';

export default {
  data() {
    return {};
  },
  render() {
    return (
      <div>
        <VcPagination simple defaultCurrent={1} total={50} />
      </div>
    );
  },
};
</script>
