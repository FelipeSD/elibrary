import { ref } from "vue";

export function useDebounce() {
  const isDebouncing = ref(false);

  const debouncedCallback = (callback, delay = 1000) => {
    if (isDebouncing.value) return;
    isDebouncing.value = true;
    setTimeout(() => {
      callback(...arguments);
      isDebouncing.value = false;
    }, delay);
  };

  return { debouncedCallback };
}
