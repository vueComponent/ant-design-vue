// @ts-ignore
import type { App, PropType, Plugin, Ref, VNode, SlotsType } from 'vue';

// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
export const tuple = <T extends string[]>(...args: T) => args;

export const tupleNum = <T extends number[]>(...args: T) => args;

/**
 * https://stackoverflow.com/a/59187769
 * Extract the type of an element of an array/tuple without performing indexing
 */
export type ElementOf<T> = T extends (infer E)[] ? E : T extends readonly (infer F)[] ? F : never;

/**
 * https://github.com/Microsoft/TypeScript/issues/29729
 */
export type LiteralUnion<T extends string> = T | (string & {});

export type Data = Record<string, unknown>;

export type Key = string | number;

type DefaultFactory<T> = (props: Data) => T | null | undefined;

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null;
  required?: boolean;
  default?: D | DefaultFactory<D> | null | undefined | object;
  validator?(value: unknown): boolean;
}

declare type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void;

// eslint-disable-next-line no-undef
export type VueNode = VNodeChildAtom | VNodeChildAtom[] | VNode;

export const withInstall = <T>(comp: T) => {
  const c = comp as any;
  c.install = function (app: App) {
    app.component(c.displayName || c.name, comp);
  };

  return comp as T & Plugin;
};

export type MaybeRef<T> = T | Ref<T>;

export function eventType<T>() {
  return { type: [Function, Array] as PropType<T | T[]> };
}

export function objectType<T = {}>(defaultVal?: T) {
  return { type: Object as PropType<T>, default: defaultVal as T };
}

export function booleanType(defaultVal?: boolean) {
  return { type: Boolean, default: defaultVal as boolean };
}

export function functionType<T = () => {}>(defaultVal?: T) {
  return { type: Function as PropType<T>, default: defaultVal as T };
}

export function anyType<T = any>(defaultVal?: T, required?: boolean) {
  const type = { validator: () => true, default: defaultVal as T } as unknown;
  return required
    ? (type as {
        type: PropType<T>;
        default: T;
        required: true;
      })
    : (type as {
        default: T;
        type: PropType<T>;
      });
}
export function vNodeType<T = VueNode>() {
  return { validator: () => true } as unknown as { type: PropType<T> };
}

export function arrayType<T extends any[]>(defaultVal?: T) {
  return { type: Array as unknown as PropType<T>, default: defaultVal as T };
}

export function stringType<T extends string = string>(defaultVal?: T) {
  return { type: String as unknown as PropType<T>, default: defaultVal as T };
}

export function someType<T>(types?: any[], defaultVal?: T) {
  return types ? { type: types as PropType<T>, default: defaultVal as T } : anyType<T>(defaultVal);
}

export type CustomSlotsType<T> = SlotsType<T>;

export type AnyObject = Record<PropertyKey, any>;
