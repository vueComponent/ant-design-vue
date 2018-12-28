import Vue from 'vue';

/** AntdVue component common definition */
export declare class AntdVueComponent extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
}

/** Component size definition for button, input, etc */
export type AntdVueComponentSize = 'large' | 'default' | 'small';

/** Horizontal alignment */
export type AntdVueHorizontalAlignment = 'left' | 'center' | 'right';
