<template>
    <Toggle
        v-bind="$attrs"
        popover-title="Background Blur Properties"
        settings-tooltip="Configure Background Blur"
    >
        <template #popover>
            <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                <div class="flex w-full items-center justify-between gap-2 px-3 py-2">
                    <Label class="w-full text-center">Amount</Label>

                    <Slider
                        :max="100"
                        :step="1"
                        :model-value="[backgroundBlur]"
                        @update:model-value="$emit('update:background-blur', Number($event[0]))"
                    />

                    <Input
                        type="number"
                        class="w-16 text-center"
                        :value="backgroundBlur"
                        @update:model-value="$emit('update:background-blur', Number($event))"
                    />
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
defineProps({
    backgroundBlur: {
        type: Number,
        required: true,
    },
});
</script>
