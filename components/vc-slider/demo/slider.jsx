import Slider from '../index';
import Tooltip from '../../vc-tooltip';
import '../assets/index.less';
import '../../vc-tooltip/assets/bootstrap.less';

const { createSliderWithTooltip } = Slider;

function log(value) {
  console.log(value); //eslint-disable-line
}

const CustomizedSlider = {
  data() {
    return {
      value: 50,
    };
  },
  methods: {
    onSliderChange(value) {
      log(value);
      this.value = value;
    },
    onAfterChange(value) {
      log(value);
    },
  },
  render() {
    return (
      <Slider
        value={this.value}
        onChange={this.onSliderChange}
        onAfterChange={this.onAfterChange}
      />
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
      this.value = value;
    },
    onAfterChange(value) {
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
        <Slider defaultValue={50} min={this.min} max={this.max} onChange={this.onSliderChange} />
      </div>
    );
  },
};

const SliderWithTooltip = createSliderWithTooltip(Slider);

export default {
  render() {
    const style = { width: '400px', margin: '50px' };
    const pStyle = { margin: '20px 0' };

    return (
      <div>
        <div style={style}>
          <p style={pStyle}>Basic Slider</p>
          <Slider onChange={log} />
        </div>
        <div style={style}>
          <p style={pStyle}>Basic Slider，`step=20`</p>
          <Slider step={20} defaultValue={50} onBeforeChange={log} />
        </div>

        <div style={style}>
          <p style={pStyle}>Basic Slider，`step=20, dots`</p>
          <Slider dots step={20} defaultValue={100} onAfterChange={log} />
        </div>
        <div style={style}>
          <p style={pStyle}>
            Basic Slider，`step=20, dots, dotStyle={"{borderColor: 'orange'}"}, activeDotStyle=
            {"{borderColor: 'yellow'}"}`
          </p>
          <Slider
            dots
            step={20}
            defaultValue={100}
            onAfterChange={log}
            dotStyle={{ borderColor: 'orange' }}
            activeDotStyle={{ borderColor: 'yellow' }}
          />
        </div>
        <div style={style}>
          <p style={pStyle}>Slider with tooltip, with custom `tipFormatter`</p>
          <SliderWithTooltip
            tipFormatter={v => `${v} %`}
            tipProps={{ overlayClassName: 'foo' }}
            onChange={log}
          />
        </div>
        <div style={style}>
          <p style={pStyle}>
            Slider with custom handle and track style.<strong>(old api, will be deprecated)</strong>
          </p>
          <Slider
            defaultValue={30}
            maximumTrackStyle={{ backgroundColor: 'red', height: '10px' }}
            minimumTrackStyle={{ backgroundColor: 'blue', height: '10px' }}
            handleStyle={{
              borderColor: 'blue',
              height: '28px',
              width: '28px',
              marginLeft: '-14px',
              marginTop: '-9px',
              backgroundColor: 'black',
            }}
          />
        </div>
        <div style={style}>
          <p style={pStyle}>
            Slider with custom handle and track style.<strong>(The recommended new api)</strong>
          </p>
          <Slider
            defaultValue={30}
            trackStyle={{ backgroundColor: 'blue', height: '10px' }}
            handleStyle={{
              borderColor: 'blue',
              height: '28px',
              width: '28px',
              marginLeft: '-14px',
              marginTop: '-9px',
              backgroundColor: 'black',
            }}
            railStyle={{ backgroundColor: 'red', height: '10px' }}
          />
        </div>
        <div style={style}>
          <p style={pStyle}>Basic Slider, disabled</p>
          <Slider onChange={log} disabled />
        </div>
        <div style={style}>
          <p style={pStyle}>Controlled Slider</p>
          <Slider value={50} />
        </div>
        <div style={style}>
          <p style={pStyle}>Customized Slider</p>
          <CustomizedSlider />
        </div>
        <div style={style}>
          <p style={pStyle}>Slider with dynamic `min` `max`</p>
          <DynamicBounds />
        </div>
      </div>
    );
  },
};
