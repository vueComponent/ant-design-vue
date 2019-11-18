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
        <p> customize node </p>
        <VcPagination
          selectComponentClass={VcSelect}
          showSizeChanger
          showQuickJumper={{ goButton: <button>确定</button> }}
          defaultPageSize={20}
          defaultCurrent={5}
          onShowSizeChange={this.onShowSizeChange}
          onChange={this.onChange}
          total={450}
        />
        <p> default node </p>
        <VcPagination simple showQuickJumper={{ goButton: true }} defaultCurrent={1} total={50} />
      </div>
    );
  },
};
</script>
