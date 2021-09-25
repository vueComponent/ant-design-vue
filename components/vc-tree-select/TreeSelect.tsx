import generate from './generate';
import OptionList from './OptionList';

const TreeSelect = generate({ prefixCls: 'vc-tree-select', optionList: OptionList as any });

export default TreeSelect;
