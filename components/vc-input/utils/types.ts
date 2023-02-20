/** https://github.com/Microsoft/TypeScript/issues/29729 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type LiteralUnion<T extends U, U> = T | (U & {});
