import type { CSSProperties } from 'vue';

interface ImageSettings {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
  x?: number;
  y?: number;
}

interface QRProps {
  value: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
  includeMargin?: boolean;
  imageSettings?: ImageSettings;
}

export type QRPropsCanvas = QRProps;

export interface QRCodeProps extends QRProps {
  className?: string;
  rootClassName?: string;
  prefixCls?: string;
  icon?: string;
  iconSize?: number;
  bordered?: boolean;
  errorLevel?: 'L' | 'M' | 'Q' | 'H';
  status?: 'active' | 'expired' | 'loading';
  onRefresh?: () => void;
}
