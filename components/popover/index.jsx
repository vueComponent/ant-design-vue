import { inject } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

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
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
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
      ...props,
      prefixCls,
      ref: 'tooltip',
      title: (
        <div>
          {(title || $slots.title) && (
            <div class={`${prefixCls}-title`}>{getComponent(this, 'title')}</div>
          )}
          <div class={`${prefixCls}-inner-content`}>{getComponent(this, 'content')}</div>
        </div>
      ),
    };
    return <Tooltip {...tooltipProps}>{getSlot(this)}</Tooltip>;
  },
};

/* istanbul ignore next */
Popover.install = function(app) {
  app.component(Popover.name, Popover);
};

export default Popover;
