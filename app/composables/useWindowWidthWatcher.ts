
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useWindowWidthWatcher() {
    const width = ref(0);

    const updateWidth = () => {
        width.value = window.innerWidth;
    };

    onMounted(() => {
        if (import.meta.client) {
            width.value = window.innerWidth;
            window.addEventListener('resize', updateWidth);
        }
    });

    onBeforeUnmount(() => {
        if (import.meta.client) {
            window.removeEventListener('resize', updateWidth);
        }
    });

    return () => width.value;
}
