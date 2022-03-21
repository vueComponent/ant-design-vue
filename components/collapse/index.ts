import Collapse, { collapseProps } from './Collapse';
import CollapsePanel, { collapsePanelProps } from './CollapsePanel';
export type { CollapseProps } from './Collapse';
export type { CollapsePanelProps } from './CollapsePanel';

/* istanbul ignore next */

export { CollapsePanel, collapseProps, collapsePanelProps };

export default Object.assign(Collapse, {
  Panel: CollapsePanel,
});
