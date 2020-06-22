import { getOptionProps } from '../_util/props-util';

const Col = (_, { attrs }) => {
  const { child = {}, bordered, colon, type, layout, colKey: key } = attrs;
  const { prefixCls, span = 1 } = getOptionProps(child);
  const { children = {} } = child;
  const label = children.label && children.label();
  const defaultSlot = children.default && children.default();

  const labelProps = {
    class: [
      `${prefixCls}-item-label`,
      {
        [`${prefixCls}-item-colon`]: colon,
        [`${prefixCls}-item-no-label`]: !label,
      },
    ],
    key: `${key}-label`,
  };

  if (layout === 'vertical') {
    labelProps.colSpan = span * 2 - 1;
  }

  if (bordered) {
    if (type === 'label') {
      return <th {...labelProps}>{label}</th>;
    }
    return (
      <td class={`${prefixCls}-item-content`} key={`${key}-content`} colSpan={span * 2 - 1}>
        {defaultSlot}
      </td>
    );
  }
  if (layout === 'vertical') {
    if (type === 'content') {
      return (
        <td colSpan={span} class={`${prefixCls}-item`}>
          <span class={`${prefixCls}-item-content`} key={`${key}-content`}>
            {defaultSlot}
          </span>
        </td>
      );
    }
    return (
      <td colSpan={span} class={`${prefixCls}-item`}>
        <span
          class={[`${prefixCls}-item-label`, { [`${prefixCls}-item-colon`]: colon }]}
          key={`${key}-label`}
        >
          {label}
        </span>
      </td>
    );
  }
  return (
    <td colSpan={span} class={`${prefixCls}-item`}>
      <span {...labelProps}>{label}</span>
      <span class={`${prefixCls}-item-content`} key={`${key}-content`}>
        {defaultSlot}
      </span>
    </td>
  );
};

export default Col;
