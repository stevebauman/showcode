<template>
    <PopoverPanel title="Window position" :resets="false">
        <template #trigger>
            <Button
                v-bind="$attrs"
                variant="ghost"
                class="h-6 min-w-0 flex-1 justify-between px-1.5"
            >
                <span>
                    {{ positions.find((position) => position.value === modelValue)?.label }}
                </span>
                <ChevronsUpDownIcon class="text-ui-muted !size-3" />
            </Button>
        </template>

        <div role="group" aria-label="Window position" class="grid grid-cols-3 gap-2 p-3">
            <button
                v-for="position in positions"
                :key="position.value"
                type="button"
                class="property-choice"
                :class="position.cell"
                :aria-label="`Position window ${position.value}`"
                :aria-pressed="modelValue === position.value"
                @click="$emit('update:modelValue', position.value)"
            >
                <span
                    aria-hidden="true"
                    class="bg-ui-canvas border-ui-line relative h-10 w-full rounded-sm border"
                >
                    <span
                        class="bg-ui-selected border-ui-muted/50 absolute h-4 w-6 rounded-sm border"
                        :class="position.placement"
                    />
                </span>
                {{ position.label }}
            </button>
        </div>
    </PopoverPanel>
</template>

<script setup>
import { ChevronsUpDownIcon } from 'lucide-vue-next';

defineOptions({ inheritAttrs: false });
defineProps({ modelValue: { type: String, required: true } });
defineEmits(['update:modelValue']);

const positions = [
    {
        value: 'top',
        label: 'Top',
        cell: 'col-start-2',
        placement: 'top-1 left-1/2 -translate-x-1/2',
    },
    {
        value: 'left',
        label: 'Left',
        cell: 'row-start-2 col-start-1',
        placement: 'left-1 top-1/2 -translate-y-1/2',
    },
    {
        value: 'center',
        label: 'Center',
        cell: 'row-start-2 col-start-2',
        placement: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    },
    {
        value: 'right',
        label: 'Right',
        cell: 'row-start-2 col-start-3',
        placement: 'right-1 top-1/2 -translate-y-1/2',
    },
    {
        value: 'bottom',
        label: 'Bottom',
        cell: 'row-start-3 col-start-2',
        placement: 'bottom-1 left-1/2 -translate-x-1/2',
    },
];
</script>
