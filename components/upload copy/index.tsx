import type { App } from 'vue';
import Upload from './Upload';
import Dragger from './Dragger';

export type { UploadProps, UploadListProps, UploadChangeParam } from './interface';

/* istanbul ignore next */
export const UploadDragger = Dragger;

export default Object.assign(Upload, {
  Dragger,
  install(app: App) {
    app.component(Upload.name, Upload);
    app.component(Dragger.name, Dragger);
    return app;
  },
});
