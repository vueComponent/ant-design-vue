import type { PanelMode } from '../interface';

export default function getExtraFooter(
  prefixCls: string,
  mode: PanelMode,
  renderExtraFooter?: (mode: PanelMode) => any,
) {
  if (!renderExtraFooter) {
    return null;
  }

  return <div class={`${prefixCls}-footer-extra`}>{renderExtraFooter(mode)}</div>;
}
