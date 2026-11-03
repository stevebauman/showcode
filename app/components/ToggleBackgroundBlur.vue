<template>
    <Toggle
        v-bind="$attrs"
        popover-title="Background Blur Properties"
        settings-tooltip="Configure Background Blur"
    >
        <template #popover>
            <div class="property-fields">
                <PropertyField label="Amount" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="number"
                        min="0"
                        max="100"
                        :model-value="backgroundBlur"
                        @update:model-value="$emit('update:background-blur', Number($event))"
                    />
                </PropertyField>
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
defineEmits(['update:background-blur']);
</script>
