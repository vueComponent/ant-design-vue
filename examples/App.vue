<script>
/* eslint-disable no-console */
import Comp from './Comp';
export default {
  name: 'Demo',
  components: {
    Comp,
  },
  data() {
    return {
      value: 0,
    };
  },
  methods: {
    onChange(e) {
      console.log(e);
    },
  },
  render() {
    return (
      <div>
        <Comp
        // scopedSlots={{
        //   default: ({ age }) => <h1>{age}</h1>,
        //   name: props => <div>{props}</div>,
        // }}
        >
          <h1>11</h1>
        </Comp>
      </div>
    );
  },
};
</script>
