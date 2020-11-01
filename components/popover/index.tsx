import { defineComponent, inject } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import { defaultConfigProvider } from '../config-provider';
import { withInstall } from '../_util/type';

const props = abstractTooltipProps();
const Popover = defineComponent({
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
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  methods: {
    getPopupDomNode() {
      return (this.$refs.tooltip as any).getPopupDomNode();
    },
  },

  render() {
    const { title, prefixCls: customizePrefixCls, $slots } = this;
    const { getPrefixCls } = this.configProvider;
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
});

export default withInstall(Popover);
