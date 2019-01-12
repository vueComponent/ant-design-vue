import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import Tooltip from '../../vc-tooltip';
import { getOptionProps } from '../../_util/props-util';
import Handle from './Handle';

export default function createSliderWithTooltip(Component) {
  return {
    mixins: [BaseMixin, Component],
    props: {
      ...Component.props,
      tipFormatter: PropTypes.func.def(value => {
        return value;
      }),
      handleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
      tipProps: PropTypes.object.def({}),
    },
    data() {
      return {
        visibles: {},
      };
    },
    methods: {
      handleTooltipVisibleChange(index, visible) {
        this.setState(prevState => {
          return {
            visibles: {
              ...prevState.visibles,
              [index]: visible,
            },
          };
        });
      },
      handleWithTooltip({ value, dragging, index, disabled, ...restProps }) {
        const { tipFormatter, tipProps, handleStyle } = this.$props;

        const {
          prefixCls = 'rc-slider-tooltip',
          overlay = tipFormatter(value),
          placement = 'top',
          visible = false,
          ...restTooltipProps
        } = tipProps;

        let handleStyleWithIndex;
        if (Array.isArray(handleStyle)) {
          handleStyleWithIndex = handleStyle[index] || handleStyle[0];
        } else {
          handleStyleWithIndex = handleStyle;
        }

        const tooltipProps = {
          props: {
            ...restTooltipProps,
            prefixCls,
            overlay,
            placement,
            visible: (!disabled && (this.visibles[index] || dragging)) || visible,
          },
          key: index,
        };
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
        };

        return (
          <Tooltip {...tooltipProps}>
            <Handle {...handleProps} />
          </Tooltip>
        );
      },
    },
    render() {
      const componentProps = {
        props: {
          ...getOptionProps(this),
          handle: this.handleWithTooltip,
        },
      };
      return <Component {...componentProps} />;
    },
  };
}
