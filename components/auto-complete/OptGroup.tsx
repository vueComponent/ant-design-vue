import type { FunctionalComponent } from 'vue';
import type { DefaultOptionType } from '../select';

export type OptGroupProps = Omit<DefaultOptionType, 'options'>;

export interface OptionGroupFC extends FunctionalComponent<OptGroupProps> {
  /** Legacy for check if is a Option Group */
  isSelectOptGroup: boolean;
}

const OptGroup: OptionGroupFC = () => null;
OptGroup.isSelectOptGroup = true;
OptGroup.displayName = 'AAutoCompleteOptGroup';
export default OptGroup;
