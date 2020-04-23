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
          <h2>1234</h2>
          <h2>h3</h2>
        </Comp>
      </div>
    );
  },
};
</script>
