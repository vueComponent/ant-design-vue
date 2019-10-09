<script>
import Align from '../index';

const align = {
  points: ['cc', 'cc'],
};

export default {
  data() {
    return {
      point: null,
    };
  },

  methods: {
    onClick({ pageX, pageY }) {
      this.point = { pageX, pageY };
    },
  },

  render() {
    return (
      <div style={{ marginBottom: '170px' }}>
        <div
          style={{
            margin: '20px',
            border: '1px solid red',
            padding: '100px 0',
            textAlign: 'center',
          }}
          onClick={this.onClick}
        >
          Click this region please : )
        </div>

        <Align target={this.point} align={align}>
          <div
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              background: 'rgba(0, 255, 0, 0.5)',
              pointerEvents: 'none',
            }}
          >
            Align
          </div>
        </Align>
      </div>
    );
  },
};
</script>
