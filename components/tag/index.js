import Tag from './Tag';
import CheckableTag from './CheckableTag';

Tag.CheckableTag = CheckableTag;

/* istanbul ignore next */
Tag.install = function(app) {
  app.component(Tag.name, Tag);
  app.component(Tag.CheckableTag.name, Tag.CheckableTag);
};

export default Tag;
