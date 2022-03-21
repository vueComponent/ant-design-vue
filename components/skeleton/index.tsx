import Skeleton from './Skeleton';
import SkeletonButton from './Button';
import SkeletonInput from './Input';
import SkeletonImage from './Image';
import SkeletonAvatar from './Avatar';
import SkeletonTitle from './Title';
export type { SkeletonButtonProps } from './Button';
export type { SkeletonInputProps } from './Input';
export type { SkeletonImageProps } from './Image';
export type { SkeletonAvatarProps } from './Avatar';
export type { SkeletonTitleProps } from './Title';

export type { SkeletonProps } from './Skeleton';
export { skeletonProps } from './Skeleton';

/* istanbul ignore next */

export { SkeletonButton, SkeletonAvatar, SkeletonInput, SkeletonImage, SkeletonTitle };

export default Object.assign(Skeleton, {
  Button: SkeletonButton,
  Avatar: SkeletonAvatar,
  Input: SkeletonInput,
  Image: SkeletonImage,
  Title: SkeletonTitle,
});
