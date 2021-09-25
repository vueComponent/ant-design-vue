import type { CustomizeComponent } from '../interface';
import Cell from '../Cell';
import { defineComponent } from 'vue';
import { useInjectTable } from '../context/TableContext';

export interface ExpandedRowProps {
  prefixCls: string;
  component: CustomizeComponent;
  cellComponent: CustomizeComponent;
  fixHeader: boolean;
  fixColumn: boolean;
  horizonScroll: boolean;
  componentWidth: number;
  expanded: boolean;
  colSpan: number;
}

export default defineComponent<ExpandedRowProps>({
  name: 'ExpandedRow',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'component',
    'cellComponent',
    'fixHeader',
    'fixColumn',
    'horizonScroll',
    'componentWidth',
    'expanded',
    'colSpan',
  ] as any,
  setup(props, { slots, attrs }) {
    const tableContext = useInjectTable();
    return () => {
      const {
        prefixCls,
        component: Component,
        cellComponent,
        fixHeader,
        fixColumn,
        expanded,
        componentWidth,
        colSpan,
      } = props;

      return (
        <Component
          class={attrs.class}
          style={{
            display: expanded ? null : 'none',
          }}
        >
          <Cell
            component={cellComponent}
            prefixCls={prefixCls}
            colSpan={colSpan}
            v-slots={{
              default: () => {
                let contentNode: any = slots.default?.();

                if (fixColumn) {
                  contentNode = (
                    <div
                      style={{
                        width: `${componentWidth - (fixHeader ? tableContext.scrollbarSize : 0)}px`,
                        position: 'sticky',
                        left: 0,
                        overflow: 'hidden',
                      }}
                      class={`${prefixCls}-expanded-row-fixed`}
                    >
                      {contentNode}
                    </div>
                  );
                }
                return contentNode;
              },
            }}
          ></Cell>
        </Component>
      );
    };
  },
});
