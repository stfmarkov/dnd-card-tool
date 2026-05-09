import { ref, watch, computed } from "vue";
import type { SelectProps } from "../types/propTypes";
import type { SelectEmit } from "../types/emitTypes";

export const useSelectEssentials = (props: SelectProps, emit: SelectEmit) => {
    const value = ref(props.modelValue);

    watch(value, (newValue) => {
        if (newValue !== props.modelValue) {
            emit('update:modelValue', newValue);
        }
    });

    watch(() => props.modelValue, (newValue) => {
        if (newValue !== value.value) {
            value.value = newValue;
        }
    });

    const id = computed(() => 
        props.label ? props.label.toLowerCase().replace(/\s+/g, '-') : undefined
    );

    return {
        value,
        id,
    };
}