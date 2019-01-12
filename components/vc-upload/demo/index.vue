<script>
import Simple from '../vc-upload/demo/simple';
import Drag from '../vc-upload/demo/drag';
import AsyncAction from '../vc-upload/demo/asyncAction';
import BeforeUpload from '../vc-upload/demo/beforeUpload';
import CustomRequest from '../vc-upload/demo/customRequest';
import DirectoryUpload from '../vc-upload/demo/directoryUpload';

export default {
  render () {
    return (
      <div>
        <Simple />
        <Drag />
        <AsyncAction />
        <BeforeUpload />
        <CustomRequest />
        <DirectoryUpload />
      </div>
    );
  },
};
</script>
