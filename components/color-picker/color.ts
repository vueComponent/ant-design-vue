/* eslint-disable class-methods-use-this */
import { getHex } from './util';
import type { ColorGenInput } from '../vc-color-picker';
import { Color as RcColor } from '../vc-color-picker';

export type Color = Pick<
  RcColor,
  'toHsb' | 'toHsbString' | 'toHex' | 'toHexString' | 'toRgb' | 'toRgbString'
>;

export class ColorFactory {
  /** Original Color object */
  private metaColor: RcColor;

  constructor(color: ColorGenInput<Color>) {
    this.metaColor = new RcColor(color as ColorGenInput);
  }

  toHsb() {
    return this.metaColor.toHsb();
  }

  toHsbString() {
    return this.metaColor.toHsbString();
  }

  toHex() {
    return getHex(this.toHexString(), this.metaColor.getAlpha() < 1);
  }

  toHexString() {
    return this.metaColor.getAlpha() === 1
      ? this.metaColor.toHexString()
      : this.metaColor.toHex8String();
  }

  toRgb() {
    return this.metaColor.toRgb();
  }

  toRgbString() {
    return this.metaColor.toRgbString();
  }
}
