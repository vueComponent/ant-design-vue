import PropTypes from '../_util/vue-types';
import VcSelect from '../select';
import MiniSelect from './MiniSelect';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { getOptionProps } from '../_util/props-util';
import VcPagination from '../vc-pagination';
import enUS from '../vc-pagination/locale/en_US';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import DoubleLeftOutlined from '@ant-design/icons-vue/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons-vue/DoubleRightOutlined';
import { ConfigConsumerProps } from '../config-provider';
import { inject } from 'vue';
import classNames from '../_util/classNames';

export const PaginationProps = () => ({
  total: PropTypes.number,
  defaultCurrent: PropTypes.number,
  disabled: PropTypes.bool,
  current: PropTypes.number,
  defaultPageSize: PropTypes.number,
  pageSize: PropTypes.number,
  hideOnSinglePage: PropTypes.bool,
  showSizeChanger: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  buildOptionText: PropTypes.func,
  showSizeChange: PropTypes.func,
  showQuickJumper: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  showTotal: PropTypes.any,
  size: PropTypes.string,
  simple: PropTypes.bool,
  locale: PropTypes.object,
  prefixCls: PropTypes.string,
  selectPrefixCls: PropTypes.string,
  itemRender: PropTypes.func,
  role: PropTypes.string,
  showLessItems: PropTypes.bool,
});

export const PaginationConfig = () => ({
  ...PaginationProps(),
  position: PropTypes.oneOf(['top', 'bottom', 'both']),
});

export default {
  name: 'APagination',
  inheritAttrs: false,
  props: {
    ...PaginationProps(),
  },

  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },

  methods: {
    getIconsProps(prefixCls) {
      const prevIcon = (
        <a class={`${prefixCls}-item-link`}>
          <LeftOutlined />
        </a>
      );
      const nextIcon = (
        <a class={`${prefixCls}-item-link`}>
          <RightOutlined />
        </a>
      );
      const jumpPrevIcon = (
        <a class={`${prefixCls}-item-link`}>
          {/* You can use transition effects in the container :) */}
          <div class={`${prefixCls}-item-container`}>
            <DoubleLeftOutlined class={`${prefixCls}-item-link-icon`} />
            <span class={`${prefixCls}-item-ellipsis`}>•••</span>
          </div>
        </a>
      );
      const jumpNextIcon = (
        <a class={`${prefixCls}-item-link`}>
          {/* You can use transition effects in the container :) */}
          <div class={`${prefixCls}-item-container`}>
            <DoubleRightOutlined class={`${prefixCls}-item-link-icon`} />
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
        prefixCls,
        selectPrefixCls,
        ...restProps,
        ...this.getIconsProps(prefixCls),
        selectComponentClass: isSmall ? MiniSelect : VcSelect,
        locale: { ...contextLocale, ...customLocale },
        buildOptionText: buildOptionText || this.$slots.buildOptionText,
        ...this.$attrs,
        class: classNames({ mini: isSmall }, this.$attrs.class),
        itemRender: this.itemRender || this.$slots.itemRender,
      };

      return <VcPagination {...paginationProps} />;
    },
  },
  render() {
    return (
      <LocaleReceiver
        componentName="Pagination"
        defaultLocale={enUS}
        children={this.renderPagination}
      ></LocaleReceiver>
    );
  },
};
