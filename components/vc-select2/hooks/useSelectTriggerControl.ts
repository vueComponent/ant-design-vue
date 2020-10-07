import { onBeforeUnmount, onMounted, Ref } from 'vue';

export default function useSelectTriggerControl(
  elements: (HTMLElement | undefined)[],
  open: Ref<boolean>,
  triggerOpen: (open: boolean) => void,
) {
  function onGlobalMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
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
