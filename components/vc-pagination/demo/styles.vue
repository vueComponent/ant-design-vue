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
        <VcPagination defaultCurrent={1} total={25} style={{ margin: '100px' }} />
      </div>
    );
  },
};
</script>
