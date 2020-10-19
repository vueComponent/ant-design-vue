import { onBeforeUnmount, onMounted, Ref } from 'vue';

export default function useSelectTriggerControl(
  refs: Ref[],
  open: Ref<boolean>,
  triggerOpen: (open: boolean) => void,
) {
  function onGlobalMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
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
