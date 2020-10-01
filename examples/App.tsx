import Empty from '../components/empty';
import '../components/empty/style';

type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object';

type T10 = TypeName<string | (() => void)>;

export default {
  render() {
    return <Empty />;
  },
};
