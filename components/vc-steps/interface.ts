export type Status = 'error' | 'process' | 'finish' | 'wait';
export type StepIconRender = (info: {
  index: number;
  status: Status;
  title: any;
  description: any;
  node: any;
}) => any;

export type ProgressDotRender = (info: {
  iconDot: any;
  index: number;
  status: Status;
  title: any;
  description: any;
}) => any;
