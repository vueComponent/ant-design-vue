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
        <VcPagination defaultCurrent={3} total={450} />
      </div>
    );
  },
};
</script>
