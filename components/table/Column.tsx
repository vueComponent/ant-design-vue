import { defineComponent } from 'vue';
import { columnProps } from './interface';

export default defineComponent({
  name: 'ATableColumn',
  props: columnProps,
  render() {
    return null;
  },
});
