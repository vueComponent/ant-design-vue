import { useInjectCascader } from '../context';
import type { Ref } from 'vue';
import { watch } from 'vue';
import { useBaseProps } from '../../vc-select';
import type { Key } from '../../_util/type';
import useState from '../../_util/hooks/useState';

/**
 * Control the active open options path.
 */
export default (): [Ref<Key[]>, (activeValueCells: Key[]) => void] => {
  const baseProps = useBaseProps();
  const { values } = useInjectCascader();

  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = useState<Key[]>([]);

  watch(
    () => baseProps.open,
    () => {
      if (baseProps.open && !baseProps.multiple) {
        const firstValueCells = values.value[0];
        setActiveValueCells(firstValueCells || []);
      }
    },
    { immediate: true },
  );

  return [activeValueCells, setActiveValueCells];
};
