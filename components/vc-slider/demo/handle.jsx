import Slider from '../index'
import Tooltip from '../../vc-tooltip'
import '../assets/index.less'
import '../../vc-tooltip/assets/bootstrap.less'

const { Handle, Range } = Slider

export default {
  data () {
    return {
      visibles: [],
    }
  },
  methods: {
    handleTooltipVisibleChange (index, visible) {
      this.visibles[index] = visible
      this.visibles = { ...this.visibles }
    },
  },
  render () {
    const handle = (h, props) => {
      const { value, dragging, index, refStr, ...restProps } = props
      const handleProps = {
        props: {
          ...restProps,
          value,
        },
        attrs: {
          refStr,
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

    const handleRange = (h, { value, dragging, index, disabled, ...restProps }) => {
      const tipFormatter = value => `${value}%`
      const handleStyle = [{}]
      const tipProps = {}

      const {
        prefixCls = 'rc-slider-tooltip',
        overlay = tipFormatter(value),
        placement = 'top',
        visible = visible || false,
        ...restTooltipProps } = tipProps

      let handleStyleWithIndex
      if (Array.isArray(handleStyle)) {
        handleStyleWithIndex = handleStyle[index] || handleStyle[0]
      } else {
        handleStyleWithIndex = handleStyle
      }

      const tooltipProps = {
        props: {
          prefixCls,
          overlay,
          placement,
          visible: (!disabled && (this.visibles[index] || dragging)) || visible,
          ...restTooltipProps,
        },
        key: index,
      }
      const handleProps = {
        props: {
          value,
          ...restProps,
        },
        on: {
          mouseenter: () => this.handleTooltipVisibleChange(index, true),
          mouseleave: () => this.handleTooltipVisibleChange(index, false),
        },
        style: {
          ...handleStyleWithIndex,
        },
      }

      return (
        <Tooltip
          {...tooltipProps}
        >

          <Handle
            {...handleProps}
          />
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
        <div style={wrapperStyle}>
          <p>Range with custom handle</p>
          <Range min={0} max={20} defaultValue={[3, 10]} handle={handleRange} />
        </div>
      </div>
    )
  },
}
