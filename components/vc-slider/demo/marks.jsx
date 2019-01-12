import Slider from '../index';
import '../assets/index.less';

export default {
  render() {
    const style = { width: '400px', margin: '50px' };
    const pStyle = { margin: '20px 0' };
    const marks = {
      '-10': '-10°C',
      0: <strong>0°C</strong>,
      26: '26°C',
      37: '37°C',
      50: '50°C',
      100: {
        style: {
          color: 'red',
        },
        label: <strong>100°C</strong>,
      },
    };

    function log(value) {
      console.log(value); //eslint-disable-line
    }
    return (
      <div>
        <div style={style}>
          <p style={pStyle}>Slider with marks, `step=null`</p>
          <Slider min={-10} marks={marks} step={null} onChange={log} defaultValue={20} />
        </div>
        <div style={style}>
          <p style={pStyle}>Slider with marks and steps</p>
          <Slider dots min={-10} marks={marks} step={10} onChange={log} defaultValue={20} />
        </div>

        <div style={style}>
          <p style={pStyle}>Slider with marks, `included=false`</p>
          <Slider min={-10} marks={marks} included={false} defaultValue={20} />
        </div>
        <div style={style}>
          <p style={pStyle}>Slider with marks and steps, `included=false`</p>
          <Slider min={-10} marks={marks} step={10} included={false} defaultValue={20} />
        </div>

        <div style={style}>
          <p style={pStyle}>Range with marks</p>
          <Slider.Range min={-10} marks={marks} onChange={log} defaultValue={[20, 25, 30, 40]} />
        </div>
        <div style={style}>
          <p style={pStyle}>Range with marks and steps</p>
          <Slider.Range min={-10} marks={marks} step={10} onChange={log} defaultValue={[20, 40]} />
        </div>
      </div>
    );
  },
};
