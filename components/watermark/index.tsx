import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export interface WatermarkFontType {
  color?: string;
  fontSize?: number | string;
  fontWeight?: 'normal' | 'light' | 'weight' | number;
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
  fontFamily?: string;
}
export const watermarkProps = () => ({
  zIndex: Number,
  rotate: Number,
  width: Number,
  height: Number,
  image: String,
  content: [String, Array],
  font: {
    type: Object as PropType<WatermarkFontType>,
    default: () => ({}),
  },
  rootClassName: String,
  gap: {
    type: Array as PropType<Array<number>>,
    default: undefined,
  },
  offset: {
    type: Array as PropType<Array<number>>,
    default: undefined,
  },
});
export default defineComponent({
  name: 'AWatermark',
  props: watermarkProps(),
  setup(props) {
    return () => <div>{/*  */}</div>;
  },
});
