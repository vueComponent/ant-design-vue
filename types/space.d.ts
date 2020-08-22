import { AntdComponent } from './component';
export type SizeType = 'small' | 'middle' | 'large' | undefined;
export declare class Space extends AntdComponent {
  $props: {
    prefixCls?: string;
    size?: SizeType | number;
    direction?: 'horizontal' | 'vertical';
    // No `stretch` since many components do not support that.
    align?: 'start' | 'end' | 'center' | 'baseline';
  };
}
