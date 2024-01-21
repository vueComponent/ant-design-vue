import type { CSSInterpolation } from './hooks/useStyleRegister';

class Keyframe {
  private name: string;
  style: CSSInterpolation;

  constructor(name: string, style: CSSInterpolation) {
    this.name = name;
    this.style = style;
  }

  getName(hashId = ''): string {
    return hashId ? `${hashId}-${this.name}` : this.name;
  }

  _keyframe = true;
}

export default Keyframe;
