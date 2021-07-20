import type { TagProps } from '../tag';
import Tag from '../tag';

export default function PickerTag(props: TagProps, { slots, attrs }) {
  return <Tag color="blue" {...props} {...attrs} v-slots={slots} />;
}
