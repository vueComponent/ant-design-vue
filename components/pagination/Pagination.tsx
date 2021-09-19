import type { ExtractPropTypes } from 'vue';
import { computed, toRef, defineComponent } from 'vue';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import DoubleLeftOutlined from '@ant-design/icons-vue/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons-vue/DoubleRightOutlined';
import { tuple } from '../_util/type';
import PropTypes, { withUndefined } from '../_util/vue-types';
import VcSelect from '../select';
import MiniSelect from './MiniSelect';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import VcPagination from '../vc-pagination';
import enUS from '../vc-pagination/locale/en_US';
import classNames from '../_util/classNames';
import useConfigInject from '../_util/hooks/useConfigInject';

export const paginationProps = () => ({
  total: PropTypes.number,
  defaultCurrent: PropTypes.number,
  disabled: PropTypes.looseBool,
  current: PropTypes.number,
  defaultPageSize: PropTypes.number,
  pageSize: PropTypes.number,
  hideOnSinglePage: PropTypes.looseBool,
  showSizeChanger: PropTypes.looseBool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  buildOptionText: PropTypes.func,
  showSizeChange: PropTypes.func,
  showQuickJumper: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.object])),
  showTotal: PropTypes.any,
  size: PropTypes.string,
  simple: PropTypes.looseBool,
  locale: PropTypes.object,
  prefixCls: PropTypes.string,
  selectPrefixCls: PropTypes.string,
  itemRender: PropTypes.func,
  role: PropTypes.string,
  showLessItems: PropTypes.looseBool,
  onChange: PropTypes.func,
  onShowSizeChange: PropTypes.func,
  'onUpdate:current': PropTypes.func,
  'onUpdate:pageSize': PropTypes.func,
});

export const paginationConfig = () => ({
  ...paginationProps(),
  position: PropTypes.oneOf(tuple('top', 'bottom', 'both')),
});

export type PaginationProps = Partial<ExtractPropTypes<ReturnType<typeof paginationProps>>>;
export type PaginationConfig = Partial<ExtractPropTypes<ReturnType<typeof paginationConfig>>>;

export type PaginationLocale = any;
export default defineComponent({
  name: 'APagination',
  inheritAttrs: false,
  props: paginationProps(),
  emits: ['change', 'showSizeChange', 'update:current', 'update:pageSize'],
  setup(props, { slots, attrs }) {
    const { prefixCls, configProvider, direction } = useConfigInject('pagination', props);
    const selectPrefixCls = computed(() =>
      configProvider.getPrefixCls('select', props.selectPrefixCls),
    );
    const [locale] = useLocaleReceiver('Pagination', enUS, toRef(props, 'locale'));
    const getIconsProps = (pre: string) => {
      const ellipsis = <span class={`${pre}-item-ellipsis`}>•••</span>;
      let prevIcon = (
        <button class={`${pre}-item-link`} type="button" tabindex={-1}>
          <LeftOutlined />
        </button>
      );
      let nextIcon = (
        <button class={`${pre}-item-link`} type="button" tabindex={-1}>
          <RightOutlined />
        </button>
      );
      let jumpPrevIcon = (
        <a class={`${pre}-item-link`}>
          {/* You can use transition effects in the container :) */}
          <div class={`${pre}-item-container`}>
            <DoubleLeftOutlined class={`${pre}-item-link-icon`} />
            {ellipsis}
          </div>
        </a>
      );
      let jumpNextIcon = (
        <a class={`${pre}-item-link`}>
          {/* You can use transition effects in the container :) */}
          <div class={`${pre}-item-container`}>
            <DoubleRightOutlined class={`${pre}-item-link-icon`} />
            {ellipsis}
          </div>
        </a>
      );
      // change arrows direction in right-to-left direction
      if (direction.value === 'rtl') {
        [prevIcon, nextIcon] = [nextIcon, prevIcon];
        [jumpPrevIcon, jumpNextIcon] = [jumpNextIcon, jumpPrevIcon];
      }
      return {
        prevIcon,
        nextIcon,
        jumpPrevIcon,
        jumpNextIcon,
      };
    };

    return () => {
      const {
        size,
        itemRender = slots.itemRender,
        buildOptionText = slots.buildOptionText,
        ...restProps
      } = props;

      const isSmall = size === 'small';
      const paginationProps = {
        ...restProps,
        ...getIconsProps(prefixCls.value),
        prefixCls: prefixCls.value,
        selectPrefixCls: selectPrefixCls.value,
        selectComponentClass: isSmall ? MiniSelect : VcSelect,
        locale: locale.value,
        buildOptionText,
        ...attrs,
        class: classNames(
          { mini: isSmall, [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
          attrs.class,
        ),
        itemRender,
      };

      return <VcPagination {...paginationProps} />;
    };
  },
});
