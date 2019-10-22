<script>
import Align from '../index';
import BaseMixin from '../../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  data() {
    return {
      monitor: true,
      align: {
        points: ['tl', 'tc'],
      },
    };
  },
  methods: {
    getTarget() {
      const ref = this.$refs.container;
      if (!ref) {
        // parent ref not attached
        return document.getElementById('container');
      }
      return ref;
    },

    toggleMonitor() {
      this.setState({
        monitor: !this.$data.monitor,
      });
    },

    forceAlign() {
      this.$refs.align.forceAlign();
    },
  },

  render() {
    return (
      <div
        style={{
          margin: '50px',
        }}
      >
        <p>
          <button onClick={this.forceAlign}>Force align</button>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input type="checkbox" checked={this.monitor} onInput={this.toggleMonitor} />
            &nbsp; Monitor window resize
          </label>
        </p>
        <div
          ref="container"
          id="container"
          style={{
            width: '80%',
            height: '500px',
            border: '1px solid red',
          }}
        >
          <Align
            ref="align"
            target={this.getTarget}
            monitorWindowResize={this.$data.monitor}
            align={this.$data.align}
          >
            <div
              style={{
                position: 'absolute',
                width: '50px',
                height: '50px',
                background: 'yellow',
              }}
            >
              source
            </div>
          </Align>
        </div>
      </div>
    );
  },
};
</script>
