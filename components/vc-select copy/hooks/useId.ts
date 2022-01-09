import { ref } from 'vue';
import canUseDom from '../../_util/canUseDom';

let uuid = 0;

/** Is client side and not jsdom */
export const isBrowserClient = process.env.NODE_ENV !== 'test' && canUseDom();

/** Get unique id for accessibility usage */
export function getUUID(): number | string {
  let retId: string | number;

  // Test never reach
  /* istanbul ignore if */
  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = 'TEST_OR_SSR';
  }

  return retId;
}

export default function useId(id = ref('')) {
  // Inner id for accessibility usage. Only work in client side
  const innerId = `rc_select_${getUUID()}`;

  return id.value || innerId;
}
