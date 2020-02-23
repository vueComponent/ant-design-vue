// based on vc-select 9.2.2
import ProxySelect, { Select } from './Select';
import Option from './Option';
import { SelectPropTypes } from './PropTypes';
import OptGroup from './OptGroup';
Select.Option = Option;
Select.OptGroup = OptGroup;
ProxySelect.Option = Option;
ProxySelect.OptGroup = OptGroup;
export { Select, Option, OptGroup, SelectPropTypes };
export default ProxySelect;
