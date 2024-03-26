import type { App, Plugin } from 'vue';
import Skeleton from './Skeleton';
import SkeletonButton from './Button';
import SkeletonInput from './Input';
import SkeletonImage from './Image';
import SkeletonAvatar from './Avatar';
import SkeletonTitle from './Title';
import SkeletonCard from './Card';
export type { SkeletonButtonProps } from './Button';
export type { SkeletonInputProps } from './Input';
export type { SkeletonImageProps } from './Image';
export type { SkeletonAvatarProps } from './Avatar';
export type { SkeletonTitleProps } from './Title';

export type { SkeletonProps } from './Skeleton';
export { skeletonProps } from './Skeleton';

Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Title = SkeletonTitle;
Skeleton.Card = SkeletonCard;

/* istanbul ignore next */
Skeleton.install = function (app: App) {
  app.component(Skeleton.name, Skeleton);
  app.component(Skeleton.Button.name, SkeletonButton);
  app.component(Skeleton.Avatar.name, SkeletonAvatar);
  app.component(Skeleton.Input.name, SkeletonInput);
  app.component(Skeleton.Image.name, SkeletonImage);
  app.component(Skeleton.Title.name, SkeletonTitle);
  app.component(Skeleton.Card.name, SkeletonCard);

  return app;
};
export {
  SkeletonButton,
  SkeletonAvatar,
  SkeletonInput,
  SkeletonImage,
  SkeletonTitle,
  SkeletonCard,
};
export default Skeleton as typeof Skeleton &
  Plugin & {
    readonly Button: typeof SkeletonButton;
    readonly Avatar: typeof SkeletonAvatar;
    readonly Input: typeof SkeletonInput;
    readonly Image: typeof SkeletonImage;
    readonly Title: typeof SkeletonTitle;
    readonly Card: typeof SkeletonCard;
  };
