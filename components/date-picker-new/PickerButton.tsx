import { FunctionalComponent } from 'vue';
import Button, { ButtonProps } from '../button';

const PickerButton: FunctionalComponent<ButtonProps> = (props: ButtonProps, { attrs, slots }) => {
  return <Button size="small" type="primary" {...props} {...attrs} v-slots={slots}></Button>;
};
export default PickerButton;
