import Upload from './Upload';
import Dragger from './Dragger';

export { UploadProps, UploadListProps, UploadChangeParam } from './interface';

Upload.Dragger = Dragger;

/* istanbul ignore next */
Upload.install = function(app) {
  app.component(Upload.name, Upload);
  app.component(Dragger.name, Dragger);
};

export default Upload;
