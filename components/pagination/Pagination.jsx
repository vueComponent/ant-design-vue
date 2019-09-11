import PropTypes from '../_util/vue-types';
import VcSelect from '../select';
import MiniSelect from './MiniSelect';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { getOptionProps } from '../_util/props-util';
import VcPagination from '../vc-pagination';
import enUS from '../vc-pagination/locale/en_US';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider';

export const PaginationProps = () => ({
  total: PropTypes.number,
  defaultCurrent: PropTypes.number,
  current: PropTypes.number,
  defaultPageSize: PropTypes.number,
  pageSize: PropTypes.number,
  hideOnSinglePage: PropTypes.bool,
  showSizeChanger: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  buildOptionText: PropTypes.func,
  showSizeChange: PropTypes.func,
  showQuickJumper: PropTypes.bool,
  showTotal: PropTypes.any,
  size: PropTypes.string,
  simple: PropTypes.bool,
  locale: PropTypes.object,
  prefixCls: PropTypes.string,
  selectPrefixCls: PropTypes.string,
  itemRender: PropTypes.any,
  role: PropTypes.string,
});

export const PaginationConfig = () => ({
  ...PaginationProps(),
  position: PropTypes.oneOf(['top', 'bottom', 'both']),
});

export default {
  name: 'APagination',
  model: {
    prop: 'current',
    event: 'change.current',
  },
  props: {
    ...PaginationProps(),
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    getIconsProps(prefixCls) {
      const prevIcon = (
        <a class={`${prefixCls}-item-link`}>
          <Icon type="left" />
        </a>
      );
      const nextIcon = (
        <a class={`${prefixCls}-item-link`}>
          <Icon type="right" />
        </a>
      );
      const jumpPrevIcon = (
        <a class={`${prefixCls}-item-link`}>
          {/* You can use transition effects in the container :) */}
          <div class={`${prefixCls}-item-container`}>
            <Icon class={`${prefixCls}-item-link-icon`} type="double-left" />
            <span class={`${prefixCls}-item-ellipsis`}>•••</span>
          </div>
        </a>
      );
      const jumpNextIcon = (
        <a class={`${prefixCls}-item-link`}>
          {/* You can use transition effects in the container :) */}
          <div class={`${prefixCls}-item-container`}>
            <Icon class={`${prefixCls}-item-link-icon`} type="double-right" />
            <span class={`${prefixCls}-item-ellipsis`}>•••</span>
          </div>
        </a>
      );
      return {
        prevIcon,
        nextIcon,
        jumpPrevIcon,
        jumpNextIcon,
      };
    },
    renderPagination(contextLocale) {
      const {
        prefixCls: customizePrefixCls,
        selectPrefixCls: customizeSelectPrefixCls,
        buildOptionText,
        size,
        locale: customLocale,
        ...restProps
      } = getOptionProps(this);
      const getPrefixCls = this.configProvider.getPrefixCls;
      const prefixCls = getPrefixCls('pagination', customizePrefixCls);
      const selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls);

      const isSmall = size === 'small';
      const paginationProps = {
        props: {
          prefixCls,
          selectPrefixCls,
          ...restProps,
          ...this.getIconsProps(prefixCls),
          selectComponentClass: isSmall ? MiniSelect : VcSelect,
          locale: { ...contextLocale, ...customLocale },
          buildOptionText: buildOptionText || this.$scopedSlots.buildOptionText,
        },
        class: {
          mini: isSmall,
        },
        on: this.$listeners,
      };

      return <VcPagination {...paginationProps} />;
    },
  },
  render() {
    return (
      <LocaleReceiver
        componentName="Pagination"
        defaultLocale={enUS}
        scopedSlots={{ default: this.renderPagination }}
      />
    );
  },
};
