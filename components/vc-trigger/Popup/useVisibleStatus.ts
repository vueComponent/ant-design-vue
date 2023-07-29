import type { Ref } from 'vue';
import { onBeforeUnmount, shallowRef, watch, onMounted } from 'vue';
import raf from '../../_util/raf';

/**
 * Popup should follow the steps for each component work correctly:
 * measure - check for the value stretch size
 * align - let component align the position
 * aligned - re-align again in case additional className changed the size
 * afterAlign - choice next step is trigger motion or finished
 * beforeMotion - should reset motion to invisible so that CSSMotion can do normal motion
 * motion - play the motion
 * stable - everything is done
 */
type PopupStatus = null | 'measure' | 'align' | 'aligned' | 'motion' | 'stable';

type Func = () => void;

const StatusQueue: PopupStatus[] = ['measure', 'align', null, 'motion'];

export default (
  visible: Ref<boolean>,
  doMeasure: Func,
): [Ref<PopupStatus>, (callback?: () => void) => void] => {
  const status = shallowRef<PopupStatus>(null);
  const rafRef = shallowRef<number>();
  const destroyRef = shallowRef(false);
  function setStatus(nextStatus: PopupStatus) {
    if (!destroyRef.value) {
      status.value = nextStatus;
    }
  }

  function cancelRaf() {
    raf.cancel(rafRef.value);
  }

  function goNextStatus(callback?: () => void) {
    cancelRaf();
    rafRef.value = raf(() => {
      // Only align should be manually trigger
      let newStatus = status.value;
      switch (status.value) {
        case 'align':
          newStatus = 'motion';
          break;
        case 'motion':
          newStatus = 'stable';
          break;
        default:
      }
      setStatus(newStatus);

      callback?.();
    });
  }

  watch(
    visible,
    () => {
      setStatus('measure');
    },
    { immediate: true, flush: 'post' },
  );
  onMounted(() => {
    // Go next status
    watch(
      status,
      () => {
        switch (status.value) {
          case 'measure':
            doMeasure();
            break;
          default:
        }

        if (status.value) {
          rafRef.value = raf(async () => {
            const index = StatusQueue.indexOf(status.value);
            const nextStatus = StatusQueue[index + 1];
            if (nextStatus && index !== -1) {
              setStatus(nextStatus);
            }
          });
        }
      },
      { immediate: true, flush: 'post' },
    );
  });

  onBeforeUnmount(() => {
    destroyRef.value = true;
    cancelRaf();
  });

  return [status, goNextStatus];
};
