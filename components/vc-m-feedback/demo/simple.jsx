import TouchFeedback from '../index';
import './simple.less';

export default {
  render() {
    return (
      <div style={{ marginBottom: 12 }}>
        <TouchFeedback activeClassName="active" activeStyle={{ color: 'red' }}>
          <div
            class="normal"
            style={{
              backgroundColor: 'yellow',
            }}
            onClick={() => console.log('click div')}
          >
            click to active
          </div>
        </TouchFeedback>
      </div>
    );
  },
};
