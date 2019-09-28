<script>
import Simple from './simple';
import Drag from './drag';
import AsyncAction from './asyncAction';
import BeforeUpload from './beforeUpload';
import CustomRequest from './customRequest';
import DirectoryUpload from './directoryUpload';

export default {
  render() {
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
