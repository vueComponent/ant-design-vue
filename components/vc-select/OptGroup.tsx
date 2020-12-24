import { FunctionalComponent } from 'vue';

import { OptionGroupData } from './interface';

export type OptGroupProps = Omit<OptionGroupData, 'options'>;

export interface OptionGroupFC extends FunctionalComponent<OptGroupProps> {
  /** Legacy for check if is a Option Group */
  isSelectOptGroup: boolean;
}

const OptGroup: OptionGroupFC = () => null;
OptGroup.isSelectOptGroup = true;
OptGroup.displayName = 'ASelectOptGroup';
export default OptGroup;
