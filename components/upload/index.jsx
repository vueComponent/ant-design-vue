import Upload from './Upload';
import Dragger from './Dragger';

export { UploadProps, UploadListProps, UploadChangeParam } from './interface';

Upload.Dragger = Dragger;

/* istanbul ignore next */
Upload.install = function(Vue) {
  Vue.component(Upload.name, Upload);
  Vue.component(Dragger.name, Dragger);
};

export default Upload;
