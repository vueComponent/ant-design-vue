import { VNodeTypes, HTMLAttributes, FunctionalComponent } from 'vue';

function notEmpty(val: any) {
  return val !== undefined && val !== null;
}

interface CellProps extends HTMLAttributes {
  itemPrefixCls: string;
  span: number;
  component: string;
  bordered?: boolean;
  label?: VNodeTypes;
  content?: VNodeTypes;
  colon?: boolean;
}

const Cell: FunctionalComponent<CellProps> = props => {
  const { itemPrefixCls, component, span, bordered, label, content, colon } = props;
  const Component = component as any;
  if (bordered) {
    return (
      <Component
        class={[
          {
            [`${itemPrefixCls}-item-label`]: notEmpty(label),
            [`${itemPrefixCls}-item-content`]: notEmpty(content),
          },
        ]}
        colSpan={span}
      >
        {notEmpty(label) ? label : content}
      </Component>
    );
  }

  return (
    <Component class={[`${itemPrefixCls}-item`]} colSpan={span}>
      {label && (
        <span
          class={[
            `${itemPrefixCls}-item-label`,
            {
              [`${itemPrefixCls}-item-no-colon`]: !colon,
            },
          ]}
        >
          {label}
        </span>
      )}
      {content && <span class={`${itemPrefixCls}-item-content`}>{content}</span>}
    </Component>
  );
};

export default Cell;
