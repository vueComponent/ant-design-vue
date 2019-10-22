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
        <VcPagination defaultCurrent={2} total={25} />
      </div>
    );
  },
};
</script>
