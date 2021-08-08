import type { VNodeTypes } from 'vue';
import { isFragment } from '../../_util/props-util';

export interface Option {
  keepEmpty?: boolean;
}

export default function toArray(children: any[], option: Option = {}): any[] {
  let ret: VNodeTypes[] = [];

  children.forEach((child: any) => {
    if ((child === undefined || child === null) && !option.keepEmpty) {
      return;
    }
    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });

  return ret;
}
