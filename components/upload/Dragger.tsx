import { defineComponent } from 'vue';
import { getOptionProps, getSlot } from '../_util/props-util';
import Upload from './Upload';
import { UploadProps } from './interface';

export default defineComponent({
  name: 'AUploadDragger',
  inheritAttrs: false,
  props: UploadProps,
  render() {
    const props = getOptionProps(this);
    const { height, ...restProps } = props;
    const { style, ...restAttrs } = this.$attrs;
    const draggerProps = {
      ...restProps,
      ...restAttrs,
      type: 'drag',
      style: { ...(style as any), height },
    } as any;
    return <Upload {...draggerProps}>{getSlot(this)}</Upload>;
  },
});
