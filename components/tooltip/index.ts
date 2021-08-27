import { withInstall } from '../_util/type';
import ToolTip, { tooltipProps } from './Tooltip';

export type {
  TooltipProps,
  AdjustOverflow,
  PlacementsConfig,
  TooltipAlignConfig,
  PlacementTypes,
} from './Tooltip';

export { tooltipProps };

export default withInstall(ToolTip);
