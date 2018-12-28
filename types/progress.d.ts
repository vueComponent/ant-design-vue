import { AntdVueComponent } from './component';

declare enum position { 'top', 'bottom', 'left', 'right' }

declare enum strokeLinecap { 'round', 'square' }

/** AProgress Layout Component */
export declare class AProgress extends AntdVueComponent {
  format: (percent: number) => string

  gapDegree: number

  gapPosition: position

  percent: number

  showInfo: boolean

  status: 'success' | 'exception' | 'active'

  strokeWidth: number

  type: 'line' | 'circle' | 'dashboard'

  width: number

  successPercent: number

  strokeColor: string

  strokeLinecap: strokeLinecap
}

