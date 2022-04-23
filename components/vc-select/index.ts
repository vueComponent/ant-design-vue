// base rc-select 14.1.1
import type { SelectProps } from './Select';
import Select, { selectProps } from './Select';
import Option from './Option';
import OptGroup from './OptGroup';
import BaseSelect from './BaseSelect';
import type { BaseSelectProps, BaseSelectRef, BaseSelectPropsWithoutPrivate } from './BaseSelect';
import useBaseProps from './hooks/useBaseProps';

export { Option, OptGroup, selectProps, BaseSelect, useBaseProps };
export type { BaseSelectProps, BaseSelectRef, BaseSelectPropsWithoutPrivate, SelectProps };

export default Select;
