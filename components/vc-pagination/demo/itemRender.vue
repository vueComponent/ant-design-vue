<script>
import VcPagination from '../index';
import '../assets/index.less';

export default {
  data() {
    return {};
  },
  methods: {
    itemRender(current, type, element) {
      if (type === 'page') {
        return <a href={`#${current}`}>{current}</a>;
      }
      return element;
    },
    textItemRender(current, type, element) {
      if (type === 'prev') {
        return 'Prev';
      }
      if (type === 'next') {
        return 'Next';
      }
      return element;
    },
  },
  render() {
    return (
      <div>
        <VcPagination total={100} itemRender={this.itemRender} />
        <VcPagination total={100} itemRender={this.textItemRender} />
      </div>
    );
  },
};
</script>
