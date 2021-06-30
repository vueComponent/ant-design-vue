import type { App, Plugin } from 'vue';
import Upload from './Upload';
import Dragger from './Dragger';

export { UploadProps, UploadListProps, UploadChangeParam } from './interface';

Upload.Dragger = Dragger;

/* istanbul ignore next */
Upload.install = function (app: App) {
  app.component(Upload.name, Upload);
  app.component(Dragger.name, Dragger);
  return app;
};

export const UploadDragger = Dragger;

export default Upload as typeof Upload &
  Plugin & {
    readonly Dragger: typeof Dragger;
  };
