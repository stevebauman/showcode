<template>
    <Toggle
        v-bind="$attrs"
        v-on="$listeners"
        popover-title="Background Blur Properties"
        settings-tooltip="Configure Background Blur"
    >
        <template #popover>
            <div class="flex flex-col divide-y divide-ui-gray-800">
                <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                    <Label class="w-full text-center"> Amount </Label>

                    <Range
                        max="100"
                        step="1"
                        dusk="range-amount"
                        :value="backgroundBlur"
                        @input="$emit('update:background-blur', Number($event))"
                    />

                    <Input
                        size="sm"
                        type="number"
                        class="w-16 text-center"
                        :value="backgroundBlur"
                        @input="$emit('update:background-blur', Number($event))"
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
