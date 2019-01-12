import Slider from '../index';
import '../assets/index.less';
const { Range } = Slider;
function log(value) {
  console.log(value); //eslint-disable-line
}

const CustomizedRange = {
  data() {
    return {
      lowerBound: 20,
      upperBound: 40,
      value: [20, 40],
    };
  },
  methods: {
    onLowerBoundChange(e) {
      this.lowerBound = +e.target.value;
    },
    onUpperBoundChange(e) {
      this.upperBound = +e.target.value;
    },
    onSliderChange(value) {
      log(value);
      this.value = value;
    },
    handleApply() {
      this.value = [this.lowerBound, this.upperBound];
    },
  },
  render() {
    return (
      <div>
        <label>LowerBound: </label>
        <input type="number" value={this.lowerBound} onChange={this.onLowerBoundChange} />
        <br />
        <label>UpperBound: </label>
        <input type="number" value={this.upperBound} onChange={this.onUpperBoundChange} />
        <br />
        <button onClick={this.handleApply}>Apply</button>
        <br />
        <br />
        <Range allowCross={false} value={this.value} onChange={this.onSliderChange} />
      </div>
    );
  },
};

const DynamicBounds = {
  data() {
    return {
      min: 0,
      max: 100,
    };
  },
  methods: {
    onSliderChange(value) {
      log(value);
    },
    onMinChange(e) {
      this.min = +e.target.value || 0;
    },
    onMaxChange(e) {
      this.max = +e.target.value || 100;
    },
  },
  render() {
    return (
      <div>
        <label>Min: </label>
        <input type="number" value={this.min} onInput={this.onMinChange} />
        <br />
        <label>Max: </label>
        <input type="number" value={this.max} onInput={this.onMaxChange} />
        <br />
        <br />
        <Range
          defaultValue={[20, 50]}
          min={this.min}
          max={this.max}
          onChange={this.onSliderChange}
        />
      </div>
    );
  },
};

const ControlledRange = {
  data() {
    return {
      value: [20, 40, 60, 80],
    };
  },
  methods: {
    handleChange(value) {
      this.value = value;
    },
  },
  render() {
    return <Range value={this.value} onChange={this.handleChange} />;
  },
};

const ControlledRangeDisableAcross = {
  props: {
    pushable: [Number, Boolean],
  },
  data() {
    return {
      value: [20, 40, 60, 80],
    };
  },
  methods: {
    handleChange(value) {
      this.value = value;
    },
  },
  render() {
    const rangeRange = {
      props: {
        value: this.value,
        allowCross: false,
        ...this.$props,
      },
      on: {
        change: this.handleChange,
      },
    };
    return <Range {...rangeRange} />;
  },
};

const PureRenderRange = {
  data() {
    return {
      foo: false,
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
      this.foo = !this.foo;
    },
  },
  render() {
    return (
      <Range defaultValue={[20, 40, 60, 80]} onChange={this.handleChange} allowCross={false} />
    );
  },
};

export default {
  render() {
    const style = { width: '400px', margin: '50px' };
    const pStyle = { margin: '20px 0' };

    return (
      <div>
        <div style={style}>
          <p style={pStyle}>Basic Range，`allowCross=false`</p>
          <Range allowCross={false} defaultValue={[0, 20]} onChange={log} />
        </div>
        <div style={style}>
          <p style={pStyle}>Basic Range，`step=20` </p>
          <Range step={20} defaultValue={[20, 20]} onBeforeChange={log} />
        </div>
        <div style={style}>
          <p style={pStyle}>Basic Range，`step=20, dots` </p>
          <Range dots step={20} defaultValue={[20, 40]} onAfterChange={log} />
        </div>
        <div style={style}>
          <p style={pStyle}>Basic Range，disabled</p>
          <Range allowCross={false} defaultValue={[0, 20]} onChange={log} disabled />
        </div>
        <div style={style}>
          <p style={pStyle}>Controlled Range</p>
          <ControlledRange />
        </div>
        <div style={style}>
          <p style={pStyle}>Controlled Range, not allow across</p>
          <ControlledRangeDisableAcross />
        </div>
        <div style={style}>
          <p style={pStyle}>Controlled Range, not allow across, pushable=5</p>
          <ControlledRangeDisableAcross pushable={5} />
        </div>
        <div style={style}>
          <p style={pStyle}>Multi Range</p>
          <Range count={3} defaultValue={[20, 40, 60, 80]} pushable />
        </div>
        <div style={style}>
          <p style={pStyle}>Multi Range with custom track and handle style</p>
          <Range
            count={3}
            defaultValue={[20, 40, 60, 80]}
            pushable
            trackStyle={[{ backgroundColor: 'red' }, { backgroundColor: 'green' }]}
            handleStyle={[{ backgroundColor: 'yellow' }, { backgroundColor: 'gray' }]}
            railStyle={{ backgroundColor: 'black' }}
          />
        </div>
        <div style={style}>
          <p style={pStyle}>Customized Range</p>
          <CustomizedRange />
        </div>
        <div style={style}>
          <p style={pStyle}>Range with dynamic `max` `min`</p>
          <DynamicBounds />
        </div>
        <div style={style}>
          <p style={pStyle}>Range as child component</p>
          <PureRenderRange />
        </div>
      </div>
    );
  },
};
