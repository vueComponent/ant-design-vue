import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { Key } from '../interface';

interface ResizeContextProps {
  onColumnResize: (columnKey: Key, width: number) => void;
}

export const ResizeContextKey: InjectionKey<ResizeContextProps> = Symbol('ResizeContextProps');

export const useProvideResize = (props: ResizeContextProps) => {
  provide(ResizeContextKey, props);
};

export const useInjectResize = () => {
  return inject(ResizeContextKey, { onColumnResize: () => {} });
};
