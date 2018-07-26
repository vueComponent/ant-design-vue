import _extends from 'babel-runtime/helpers/extends';
import { getOptionProps } from '../_util/props-util';
import Upload from './Upload';
import { UploadProps } from './interface';

export default {
  name: 'AUploadDragger',
  props: UploadProps,
  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);
    var draggerProps = {
      props: _extends({}, props, {
        type: 'drag'
      }),
      on: this.$listeners,
      style: { height: this.height }
    };
    return h(
      Upload,
      draggerProps,
      [this.$slots['default']]
    );
  }
};