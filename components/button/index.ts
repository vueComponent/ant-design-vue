import Button from './button';
import ButtonGroup from './button-group';

import type { ButtonProps, ButtonShape, ButtonType } from './buttonTypes';
import type { ButtonGroupProps } from './button-group';
import type { SizeType as ButtonSize } from '../config-provider';

export type { ButtonProps, ButtonShape, ButtonType, ButtonGroupProps, ButtonSize };

/* istanbul ignore next */

export { ButtonGroup };

export default Object.assign(Button, {
  Group: ButtonGroup,
});
