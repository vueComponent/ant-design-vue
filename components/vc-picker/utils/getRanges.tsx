import { VueNode } from '../../_util/type';
import type { Components, RangeList, Locale } from '../interface';

export type RangesProps = {
  prefixCls: string;
  rangeList?: RangeList;
  components?: Components;
  needConfirmButton: boolean;
  onNow?: null | (() => void) | false;
  onOk?: null | (() => void) | false;
  okDisabled?: boolean;
  showNow?: boolean;
  locale: Locale;
};

export default function getRanges({
  prefixCls,
  rangeList = [],
  components = {},
  needConfirmButton,
  onNow,
  onOk,
  okDisabled,
  showNow,
  locale,
}: RangesProps) {
  let presetNode: VueNode;
  let okNode: VueNode;

  if (rangeList.length) {
    const Item = (components.rangeItem || 'span') as any;

    presetNode = (
      <>
        {rangeList.map(({ label, onClick, onMouseEnter, onMouseLeave }) => (
          <li key={label} class={`${prefixCls}-preset`}>
            <Item onClick={onClick} onMouseenter={onMouseEnter} onMouseleave={onMouseLeave}>
              {label}
            </Item>
          </li>
        ))}
      </>
    );
  }

  if (needConfirmButton) {
    const Button = (components.button || 'button') as any;

    if (onNow && !presetNode && showNow !== false) {
      presetNode = (
        <li class={`${prefixCls}-now`}>
          <a class={`${prefixCls}-now-btn`} onClick={onNow}>
            {locale.now}
          </a>
        </li>
      );
    }

    okNode = needConfirmButton && (
      <li class={`${prefixCls}-ok`}>
        <Button disabled={okDisabled} onClick={onOk}>
          {locale.ok}
        </Button>
      </li>
    );
  }

  if (!presetNode && !okNode) {
    return null;
  }

  return (
    <ul class={`${prefixCls}-ranges`}>
      {presetNode}
      {okNode}
    </ul>
  );
}
