import { FunctionalComponent } from 'vue';

import { OptionCoreData } from './interface';

export interface OptionProps extends Omit<OptionCoreData, 'label'> {
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
