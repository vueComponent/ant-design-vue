import type { FlattenDataNode, RawValueType, DataNode, TreeDataNode, Key } from './interface';
import { SelectContext } from './Context';
import { RefOptionListProps } from '../vc-select/OptionList';
import { ScrollTo } from '../vc-virtual-list/List';
import { defineComponent } from 'vue';
import { optionListProps } from './props';

const HIDDEN_STYLE = {
  width: 0,
  height: 0,
  display: 'flex',
  overflow: 'hidden',
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0,
};

interface TreeEventInfo {
  node: { key: Key };
  selected?: boolean;
  checked?: boolean;
}

type ReviseRefOptionListProps = Omit<RefOptionListProps, 'scrollTo'> & { scrollTo: ScrollTo };

export default defineComponent({
  name: 'OptionList',
  props: optionListProps(),
  slots: ['notFoundContent', 'menuItemSelectedIcon'],
});
