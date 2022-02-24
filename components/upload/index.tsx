import type { App } from 'vue';
import Upload, { LIST_IGNORE } from './Upload';
import Dragger from './Dragger';

export type { UploadProps, UploadListProps, UploadChangeParam, UploadFile } from './interface';

/* istanbul ignore next */
export const UploadDragger = Dragger;

export default Object.assign(Upload, {
  Dragger,
  LIST_IGNORE,
  install(app: App) {
    app.component(Upload.name, Upload);
    app.component(Dragger.name, Dragger);
    return app;
  },
});
