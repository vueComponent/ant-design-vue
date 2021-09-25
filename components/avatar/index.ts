import type { App, Plugin } from 'vue';
import Avatar from './Avatar';
import Group from './Group';
export { avatarProps } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';
export type { AvatarGroupProps } from './Group';

Avatar.Group = Group;

/* istanbul ignore next */
Avatar.install = function (app: App) {
  app.component(Avatar.name, Avatar);
  app.component(Group.name, Group);
  return app;
};
export { Group as AvatarGroup };
export default Avatar as typeof Avatar &
  Plugin & {
    readonly Group: typeof Group;
  };
