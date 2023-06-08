import type { ExtractPropTypes, PropType } from 'vue';
import { computed, toRef, defineComponent } from 'vue';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import DoubleLeftOutlined from '@ant-design/icons-vue/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons-vue/DoubleRightOutlined';
import VcSelect from '../select';
import MiniSelect from './MiniSelect';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import VcPagination from '../vc-pagination';
import enUS from '../vc-pagination/locale/en_US';
import classNames from '../_util/classNames';
import useConfigInject from '../_util/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';

export const paginationProps = () => ({
  total: Number,
  defaultCurrent: Number,
  disabled: { type: Boolean, default: undefined },
  current: Number,
  defaultPageSize: Number,
  pageSize: Number,
  hideOnSinglePage: { type: Boolean, default: undefined },
  showSizeChanger: { type: Boolean, default: undefined },
  pageSizeOptions: Array as PropType<(string | number)[]>,
  buildOptionText: Function as PropType<(opt: { value: any }) => any>,
  showQuickJumper: {
    type: [Boolean, Object] as PropType<boolean | { goButton?: any }>,
    default: undefined as boolean | { goButton?: any },
  },
  showTotal: Function as PropType<(total: number, range: [number, number]) => any>,
  size: String as PropType<'default' | 'small'>,
  simple: { type: Boolean, default: undefined },
  locale: Object,
  prefixCls: String,
  selectPrefixCls: String,
  totalBoundaryShowSizeChanger: Number,
  selectComponentClass: String,
  itemRender: Function as PropType<
    (opt: {
      page: number;
      type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';
      originalElement: any;
    }) => any
  >,
  role: String,
  responsive: Boolean,
  showLessItems: { type: Boolean, default: undefined },
  onChange: Function as PropType<(page: number, pageSize: number) => void>,
  onShowSizeChange: Function as PropType<(current: number, size: number) => void>,
  'onUpdate:current': Function as PropType<(current: number) => void>,
  'onUpdate:pageSize': Function as PropType<(size: number) => void>,
});

export type PaginationPosition = 'top' | 'bottom' | 'both';
export const paginationConfig = () => ({
  ...paginationProps(),
  position: String as PropType<PaginationPosition>,
});

export type PaginationProps = Partial<ExtractPropTypes<ReturnType<typeof paginationProps>>>;
export type PaginationConfig = Partial<ExtractPropTypes<ReturnType<typeof paginationConfig>>>;

export interface PaginationLocale {
  items_per_page?: string;
  jump_to?: string;
  jump_to_confirm?: string;
  page?: string;
  prev_page?: string;
  next_page?: string;
  prev_5?: string;
  next_5?: string;
  prev_3?: string;
  next_3?: string;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'APagination',
  inheritAttrs: false,
  props: paginationProps(),
  // emits: ['change', 'showSizeChange', 'update:current', 'update:pageSize'],
  setup(props, { slots, attrs }) {
    const { prefixCls, configProvider, direction } = useConfigInject('pagination', props);
    const selectPrefixCls = computed(() =>
      configProvider.getPrefixCls('select', props.selectPrefixCls),
    );
    const breakpoint = useBreakpoint();
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
        <a rel="nofollow" class={`${pre}-item-link`}>
          {/* You can use transition effects in the container :) */}
          <div class={`${pre}-item-container`}>
            <DoubleLeftOutlined class={`${pre}-item-link-icon`} />
            {ellipsis}
          </div>
        </a>
      );
      let jumpNextIcon = (
        <a rel="nofollow" class={`${pre}-item-link`}>
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
        selectComponentClass,
        responsive,
        ...restProps
      } = props;

      const isSmall = size === 'small' || !!(breakpoint.value?.xs && !size && responsive);
      const paginationProps = {
        ...restProps,
        ...getIconsProps(prefixCls.value),
        prefixCls: prefixCls.value,
        selectPrefixCls: selectPrefixCls.value,
        selectComponentClass: selectComponentClass || (isSmall ? MiniSelect : VcSelect),
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
