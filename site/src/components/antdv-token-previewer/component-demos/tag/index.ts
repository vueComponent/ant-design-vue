import Default from './tag';
import error from './error';
import info from './info';
import success from './success';
import warning from './warning';
import multiTags from './multiTags';
import closable from './closable';

import type { ComponentDemo } from '../../interface';

const previewerDemo: ComponentDemo[] = [
  Default,
  error,
  info,
  success,
  warning,
  multiTags,
  closable,
];

export default previewerDemo;
