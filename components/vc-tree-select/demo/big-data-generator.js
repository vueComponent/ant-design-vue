import PropTypes from '../../_util/vue-types';
import { generateData, calcTotal } from './util';

const Gen = {
  props: {
    x: PropTypes.number.def(20),
    y: PropTypes.number.def(18),
    z: PropTypes.number.def(1),
  },
  data() {
    return {
      nums: '',
    };
  },

  mounted() {
    this.$refs.x.value = this.x;
    this.$refs.y.value = this.y;
    this.$refs.z.value = this.z;
    const vals = this.getVals();
    this.$emit('gen', generateData(vals.x, vals.y, vals.z));
  },
  methods: {
    onGen(e) {
      e.preventDefault();
      const vals = this.getVals();
      this.$emit('gen', generateData(vals.x, vals.y, vals.z));
      this.nums = calcTotal(vals.x, vals.y, vals.z);
    },
    getVals() {
      return {
        x: parseInt(this.$refs.x.value, 10),
        y: parseInt(this.$refs.y.value, 10),
        z: parseInt(this.$refs.z.value, 10),
      };
    },
  },

  render() {
    const { x, y, z } = this;
    return (
      <div style={{ padding: '0 20px' }}>
        <h2>big data generator</h2>
        <form onSubmit={this.onGen}>
          <span style={{ marginRight: '10px' }}>
            x: <input ref="x" type="number" min="1" required style={{ width: '50px' }} />
          </span>
          <span style={{ marginRight: '10px' }}>
            y: <input ref="y" type="number" min="1" required style={{ width: '50px' }} />
          </span>
          <span style={{ marginRight: '10px' }}>
            z: <input ref="z" type="number" min="1" required style={{ width: '50px' }} />
          </span>
          <button type="submit">Generate</button>
          <p>total nodes: {this.nums || calcTotal(x, y, z)}</p>
        </form>
        <p style={{ fontSize: '12px' }}>
          x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
        </p>
      </div>
    );
  },
};

export default Gen;
