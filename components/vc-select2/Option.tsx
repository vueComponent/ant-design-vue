import type { FunctionalComponent } from 'vue';

import type { DefaultOptionType } from './Select';

export interface OptionProps extends Omit<DefaultOptionType, 'label'> {
  /** Save for customize data */
  [prop: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionFC extends FunctionalComponent<OptionProps> {
  /** Legacy for check if is a Option Group */
  isSelectOption: boolean;
}

const Option: OptionFC = () => null;
Option.isSelectOption = true;
Option.displayName = 'ASelectOption';
export default Option;
