import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

const props = abstractTooltipProps();
const Popover = {
  name: 'APopover',
  props: {
    ...props,
    prefixCls: PropTypes.string,
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
  },
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
  },

  render() {
    const { title, prefixCls: customizePrefixCls, $slots } = this;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('popover', customizePrefixCls);

    const props = getOptionProps(this);
    delete props.title;
    delete props.content;
    const tooltipProps = {
      props: {
        ...props,
        prefixCls,
      },
      ref: 'tooltip',
      on: this.$listeners,
    };
    return (
      <Tooltip {...tooltipProps}>
        <template slot="title">
          <div>
            {(title || $slots.title) && (
              <div class={`${prefixCls}-title`}>{getComponentFromProp(this, 'title')}</div>
            )}
            <div class={`${prefixCls}-inner-content`}>{getComponentFromProp(this, 'content')}</div>
          </div>
        </template>
        {this.$slots.default}
      </Tooltip>
    );
  },
};

/* istanbul ignore next */
Popover.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Popover.name, Popover);
};

export default Popover;
