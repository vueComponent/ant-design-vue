<script>
import VcPagination from '../index';
import VcSelect from '../../vc-select';
import '../assets/index.less';
import '../../vc-select/assets/index.less';

export default {
  data() {
    return {
      pageSize: 20,
    };
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      console.log(current);
      this.pageSize = pageSize;
    },
  },
  render() {
    return (
      <div style={{ margin: 10 }}>
        <VcPagination
          selectComponentClass={VcSelect}
          showSizeChanger
          pageSize={this.pageSize}
          onShowSizeChange={this.onShowSizeChange}
          defaultCurrent={3}
          total={500}
        />
        <VcPagination
          selectComponentClass={VcSelect}
          showSizeChanger
          pageSize={this.pageSize}
          onShowSizeChange={this.onShowSizeChange}
          defaultCurrent={3}
          total={500}
        />
      </div>
    );
  },
};
</script>
