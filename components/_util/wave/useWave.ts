import type { ComponentInternalInstance, ComputedRef, Ref } from 'vue';
import { findDOMNode } from '../props-util';
import showWaveEffect from './WaveEffect';

export default function useWave(
  instance: ComponentInternalInstance | null,
  className: Ref<string>,
  wave?: ComputedRef<{ disabled?: boolean }>,
): VoidFunction {
  function showWave() {
    const node = findDOMNode(instance);

    if (wave?.value?.disabled || !node) {
      return;
    }

    showWaveEffect(node, className.value);
  }

  return showWave;
}
