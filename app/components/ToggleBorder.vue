<template>
    <Toggle v-bind="$attrs" popover-title="Border Properties" settings-tooltip="Configure Border">
        <template #popover>
            <div class="property-fields">
                <PropertyField label="Width" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="number"
                        :model-value="borderWidth"
                        @update:model-value="$emit('update:border-width', Number($event))"
                    />
                </PropertyField>
                <PropertyField label="Color" v-slot="{ id }">
                    <ButtonColorPicker
                        :id="id"
                        :model-value="borderColor"
                        @change="$emit('update:border-color', $event)"
                    />
                </PropertyField>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
defineProps({
    borderColor: { type: Object, required: true },
    borderWidth: { type: [Number, String], required: true },
});

defineEmits(['update:border-width', 'update:border-color']);
</script>
