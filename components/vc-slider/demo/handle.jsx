import Slider from '../index'
import Tooltip from '../../vc-tooltip'
import '../assets/index.less'
import '../../vc-tooltip/assets/bootstrap.less'

const { createSliderWithTooltip, Handle } = Slider
const Range = createSliderWithTooltip(Slider.Range)

export default {
  data () {
    return {
    }
  },
  render () {
    const handle = (props) => {
      const { value, dragging, index, ...restProps } = props
      const handleProps = {
        props: {
          ...restProps,
          value,
        },
        key: index,
      }
      return (
        <Tooltip
          prefixCls='rc-slider-tooltip'
          overlay={value}
          visible={dragging}
          placement='top'
          key={index}
        >
          <Handle {...handleProps} />
        </Tooltip>
      )
    }
    const wrapperStyle = 'width: 400px; margin: 50px'

    return (
      <div>
        <div style={wrapperStyle}>
          <p>Slider with custom handle</p>
          <Slider min={0} max={20} defaultValue={3} handle={handle} />
        </div>
        {/* <div style={wrapperStyle}>
          <p>Range with custom handle</p>
          <Range min={0} max={20} defaultValue={[3, 10]} tipFormatter={value => `${value}%`} />
        </div> */}
      </div>
    )
  },
}
