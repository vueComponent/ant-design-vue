import { withInstall } from '../_util/type';
import ToolTip, { tooltipProps } from './Tooltip';

export type {
  TooltipProps,
  AdjustOverflow,
  PlacementsConfig,
  TooltipAlignConfig,
  TooltipPlacement,
} from './Tooltip';

export { tooltipProps };

export default withInstall(ToolTip);
