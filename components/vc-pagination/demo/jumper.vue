<script>
import VcPagination from '../index';
import VcSelect from '../../vc-select';
import '../assets/index.less';
import '../../vc-select/assets/index.less';

export default {
  data() {
    return {};
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      console.log(current);
      console.log(pageSize);
    },
    onChange(current, pageSize) {
      console.log('onChange:current=', current);
      console.log('onChange:pageSize=', pageSize);
    },
  },
  render() {
    return (
      <div>
        <VcPagination
          selectComponentClass={VcSelect}
          showQuickJumper
          showSizeChanger
          defaultPageSize={20}
          defaultCurrent={5}
          onShowSizeChange={this.onShowSizeChange}
          onChange={this.onChange}
          total={450}
        />
        <br />
        <VcPagination
          selectComponentClass={VcSelect}
          showQuickJumper={{ goButton: true }}
          showSizeChanger
          defaultPageSize={20}
          defaultCurrent={5}
          onShowSizeChange={this.onShowSizeChange}
          onChange={this.onChange}
          total={450}
          disabled
        />
      </div>
    );
  },
};
</script>
