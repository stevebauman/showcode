<script setup>
import { defineComponent, ref, watchEffect } from 'vue';
import { SelectValue as RekaSelectValue } from 'reka-ui';

const SelectValueLabel = defineComponent({
    props: {
        selectedLabel: { type: Array, default: () => [] },
        modelValue: { type: null, required: false },
        placeholder: { type: String, default: '' },
    },
    setup(props) {
        const label = ref(props.placeholder);

        watchEffect(() => {
            if (props.selectedLabel.length) {
                label.value = props.selectedLabel.join(', ');
            } else if (props.modelValue === undefined || props.modelValue === null) {
                label.value = props.placeholder;
            }
        });

        return () => label.value;
    },
});

const props = defineProps({
    placeholder: { type: String, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
});
</script>

<template>
    <RekaSelectValue v-bind="props" v-slot="{ selectedLabel, modelValue }">
        <SelectValueLabel
            :selected-label="selectedLabel"
            :model-value="modelValue"
            :placeholder="props.placeholder"
        />
    </RekaSelectValue>
</template>
