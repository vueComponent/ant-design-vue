import type { Key } from '../_util/type';
import type { RawValueType } from './BaseSelect';

export interface FlattenOptionData<OptionType> {
  label?: any;
  data: OptionType;
  key: Key;
  value?: RawValueType;
  groupOption?: boolean;
  group?: boolean;
}
