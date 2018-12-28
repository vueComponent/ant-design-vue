import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

/** ASKeleton Layout Component */
export declare class ASKeleton extends AntdVueComponent {
  active: boolean

  avatar: boolean | SkeletonAvatarProps

  loading: boolean

  paragraph: boolean | SkeletonParagraphProps

  title: boolean | SkeletonTitleProps
}

declare enum Size { 'large', 'small', 'default' }

declare enum Shape { 'circle', 'square' }

interface SkeletonAvatarProps {
  size: Size,
  shape: Shape
}

interface SkeletonTitleProps {
  width: number | string
}

interface SkeletonParagraphProps {
  rows: number

  width: number | string | Array<number | string>
}