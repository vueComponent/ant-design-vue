<script>
import Align from '../index'
import StateMixin from '../../_util/StateMixin'

export default {
  mixins: [StateMixin],
  data () {
    return {
      monitor: true,
      align: {
        points: ['tl', 'tc'],
      },
    }
  },
  methods: {
    getTarget () {
      const ref = this.$refs.container
      // if (!ref) {
      // // parent ref not attached
      //   ref = document.getElementById('container')
      // }
      return ref
    },

    toggleMonitor () {
      this.setState({
        monitor: !this.$data.monitor,
      })
    },

    forceAlign () {
      this.setState({
        align: Object.assign({}, this.$data.align),
      })
    },
  },

  render () {
    return (
      <div
        style={{
          margin: '50px',
        }}
      >
        <p>
          <button onClick={this.forceAlign}>force align</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={this.toggleMonitor}>toggle monitor</button>
        </p>
        <div
          ref='container'
          id='container'
          style={{
            width: '80%',
            height: '500px',
            border: '1px solid red',
          }}
        >
          <Align
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
    )
  },
}

</script>
