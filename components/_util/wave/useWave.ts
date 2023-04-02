import type { ComponentInternalInstance, Ref } from 'vue';
import { findDOMNode } from '../props-util';
import showWaveEffect from './WaveEffect';

export default function useWave(
  instance: ComponentInternalInstance | null,
  className: Ref<string>,
): VoidFunction {
  function showWave() {
    const node = findDOMNode(instance);

    showWaveEffect(node, className.value);
  }

  return showWave;
}
