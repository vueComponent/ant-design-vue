/* eslint no-console:0 */
import Checkbox from '../index';
import '../assets/index.less';

function onChange(e) {
  console.log('Checkbox checked:', e.target.checked);
}

export default {
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    toggle() {
      this.disabled = !this.disabled;
    },
  },
  render() {
    return (
      <div style={{ margin: '20px' }}>
        <div>
          <p>
            <label>
              <Checkbox checked onChange={onChange} disabled={this.disabled} />
              &nbsp; controlled checked rc-checkbox
            </label>
            &nbsp;&nbsp;
          </p>
          <p>
            <label>
              <input checked type="checkbox" onChange={onChange} disabled={this.disabled} />
              &nbsp; controlled checked native
            </label>
            &nbsp;&nbsp;
          </p>
        </div>

        <div>
          <p>
            <label>
              <Checkbox defaultChecked onChange={onChange} disabled={this.disabled} />
              &nbsp; defaultChecked rc-checkbox
            </label>
            &nbsp;&nbsp;
          </p>
        </div>

        <div>
          <p>
            <label>
              <Checkbox
                name="my-checkbox"
                defaultChecked
                onChange={onChange}
                disabled={this.disabled}
                id="test"
              />
              &nbsp; defaultChecked rc-checkbox with name
            </label>
            &nbsp;&nbsp;
          </p>
        </div>

        <button onClick={this.toggle}>toggle disabled</button>
      </div>
    );
  },
};
