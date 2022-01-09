import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted } from 'vue';

export default function useSelectTriggerControl(
  refs: Ref[],
  open: Ref<boolean>,
  triggerOpen: (open: boolean) => void,
) {
  function onGlobalMouseDown(event: MouseEvent) {
    let target = event.target as HTMLElement;

    if (target.shadowRoot && event.composed) {
      target = (event.composedPath()[0] || target) as HTMLElement;
    }
    const elements = [refs[0]?.value, refs[1]?.value?.getPopupElement()];
    if (
      open.value &&
      elements.every(element => element && !element.contains(target) && element !== target)
    ) {
      // Should trigger close
      triggerOpen(false);
    }
  }

  onMounted(() => {
    window.addEventListener('mousedown', onGlobalMouseDown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('mousedown', onGlobalMouseDown);
  });
}
