import Tag, { TagProps } from '../tag';

export default function PickerTag(props: TagProps, { slots, attrs }) {
  return <Tag color="blue" {...props} {...attrs} v-slots={slots} />;
}
