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
        <VcPagination showTotal={total => `Total ${total} items`} total={455} />
        <VcPagination
          showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
          total={455}
        />
      </div>
    );
  },
};
</script>
