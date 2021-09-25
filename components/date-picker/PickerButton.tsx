import type { FunctionalComponent } from 'vue';
import type { ButtonProps } from '../button';
import Button from '../button';

const PickerButton: FunctionalComponent<ButtonProps> = (props: ButtonProps, { attrs, slots }) => {
  return <Button size="small" type="primary" {...props} {...attrs} v-slots={slots}></Button>;
};
export default PickerButton;
