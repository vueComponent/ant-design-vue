// Project: https://github.com/vueComponent/ant-design-vue
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { Option } from './option';

export declare class Mentions extends AntdComponent {
  static Option: typeof Option;
  /**
   * Auto get focus when component mounted
   * @default false
   * @type boolean
   */
  autoFocus: boolean;

  /**
   * Default value
   * @type string
   */
  defaultValue: string;

  /**
   * Customize filter option logic
   * @type false | (input: string, option: OptionProps) => boolean
   */
  filterOption: false | ((input: string, option: Option) => boolean);

  /**
   * Set mentions content when not match
   * @type any (string | slot)
   */
  notFoundContent: any;

  /**
   * Set popup placement
   * @default 'top'
   * @type string
   */
  placement: 'top' | 'bottom';

  /**
   * Set trigger prefix keyword
   * @default '@'
   * @type string | string[]
   */
  prefix: string | string[];

  /**
   * Set split string before and after selected mention
   * @default ' '
   * @type string
   */
  split: string;

  /**
   * Customize trigger search logic
   * @type (text: string, props: MentionsProps) => void
   */
  validateSearch: (text: string, props: Mentions) => void;

  /**
   * Set value of mentions
   * @type string
   */
  value: string;

  /**
   * Set the mount HTML node for suggestions
   * @default () => HTMLElement
   */
  getPopupContainer: (triggerNode: HTMLElement) => HTMLElement;
}
