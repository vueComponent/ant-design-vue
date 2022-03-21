import Avatar from './Avatar';
import Group from './Group';
export { avatarProps } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';
export type { AvatarGroupProps } from './Group';

/* istanbul ignore next */
export { Group as AvatarGroup };
export default Object.assign(Avatar, {
  Group,
});
