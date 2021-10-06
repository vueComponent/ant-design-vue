import { scrollTo, waitElementReady } from '../../utils/uiUtil';
import { useInjectPanel } from '../../PanelContext';
import classNames from '../../../_util/classNames';
import { ref, onBeforeUnmount, watch, defineComponent, nextTick } from 'vue';

export type Unit = {
  label: any;
  value: number;
  disabled: boolean;
};

export type TimeUnitColumnProps = {
  prefixCls?: string;
  units?: Unit[];
  value?: number;
  active?: boolean;
  hideDisabledOptions?: boolean;
  onSelect?: (value: number) => void;
};

export default defineComponent<TimeUnitColumnProps>({
  name: 'TimeUnitColumn',
  props: ['prefixCls', 'units', 'onSelect', 'value', 'active', 'hideDisabledOptions'] as any,
  setup(props) {
    const { open } = useInjectPanel();

    const ulRef = ref<HTMLUListElement>(null);
    const liRefs = ref<Map<number, HTMLElement | null>>(new Map());
    const scrollRef = ref<Function>();

    watch(
      () => props.value,
      () => {
        const li = liRefs.value.get(props.value!);
        if (li && open.value !== false) {
          scrollTo(ulRef.value!, li.offsetTop, 120);
        }
      },
    );
    onBeforeUnmount(() => {
      scrollRef.value?.();
    });

    watch(
      open,
      () => {
        scrollRef.value?.();
        nextTick(() => {
          if (open.value) {
            const li = liRefs.value.get(props.value!);
            if (li) {
              scrollRef.value = waitElementReady(li, () => {
                scrollTo(ulRef.value!, li.offsetTop, 0);
              });
            }
          }
        });
      },
      { immediate: true, flush: 'post' },
    );
    return () => {
      const { prefixCls, units, onSelect, value, active, hideDisabledOptions } = props;
      const cellPrefixCls = `${prefixCls}-cell`;
      return (
        <ul
          class={classNames(`${prefixCls}-column`, {
            [`${prefixCls}-column-active`]: active,
          })}
          ref={ulRef}
          style={{ position: 'relative' }}
        >
          {units!.map(unit => {
            if (hideDisabledOptions && unit.disabled) {
              return null;
            }

            return (
              <li
                key={unit.value}
                ref={element => {
                  liRefs.value.set(unit.value, element as HTMLElement);
                }}
                class={classNames(cellPrefixCls, {
                  [`${cellPrefixCls}-disabled`]: unit.disabled,
                  [`${cellPrefixCls}-selected`]: value === unit.value,
                })}
                onClick={() => {
                  if (unit.disabled) {
                    return;
                  }
                  onSelect!(unit.value);
                }}
              >
                <div class={`${cellPrefixCls}-inner`}>{unit.label}</div>
              </li>
            );
          })}
        </ul>
      );
    };
  },
});
