import { getOptionProps } from '../_util/props-util';
import Upload from './Upload';
import { UploadProps } from './interface';

export default {
  name: 'AUploadDragger',
  props: UploadProps,
  render() {
    const props = getOptionProps(this);
    const draggerProps = {
      props: {
        ...props,
        type: 'drag',
      },
      on: this.$listeners,
      style: { height: this.height },
    };
    return <Upload {...draggerProps}>{this.$slots.default}</Upload>;
  },
};
