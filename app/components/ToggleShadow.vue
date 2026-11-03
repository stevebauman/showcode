<template>
    <Toggle v-bind="$attrs" popover-title="Shadow Properties" settings-tooltip="Configure Shadow">
        <template #popover>
            <div
                class="property-preview mx-3 mt-3 flex h-28 items-center justify-center"
                aria-label="Shadow preview"
            >
                <div
                    class="rounded-control border-ui-line bg-ui-field h-12 w-20 border"
                    :style="{
                        boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(${shadowColor.red}, ${shadowColor.green}, ${shadowColor.blue}, ${shadowColor.alpha})`,
                    }"
                />
            </div>
            <div class="property-fields">
                <div class="grid grid-cols-2 gap-2">
                    <label class="property-diagram-field !text-left">
                        Horizontal offset
                        <Input
                            type="number"
                            aria-label="Horizontal shadow offset"
                            :model-value="shadowX"
                            @update:model-value="$emit('update:shadow-x', Number($event))"
                        />
                    </label>
                    <label class="property-diagram-field !text-left">
                        Vertical offset
                        <Input
                            type="number"
                            aria-label="Vertical shadow offset"
                            :model-value="shadowY"
                            @update:model-value="$emit('update:shadow-y', Number($event))"
                        />
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <label class="property-diagram-field !text-left">
                        Blur
                        <Input
                            type="number"
                            min="0"
                            :model-value="shadowBlur"
                            @update:model-value="$emit('update:shadow-blur', Number($event))"
                        />
                    </label>
                    <label class="property-diagram-field !text-left">
                        Spread
                        <Input
                            type="number"
                            :model-value="shadowSpread"
                            @update:model-value="$emit('update:shadow-spread', Number($event))"
                        />
                    </label>
                </div>
                <PropertyField label="Color" v-slot="{ id }">
                    <ButtonColorPicker
                        :id="id"
                        :model-value="shadowColor"
                        @change="$emit('update:shadow-color', $event)"
                    />
                </PropertyField>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
defineProps({
    shadowColor: { type: Object, required: true },
    shadowX: { type: [Number, String], required: true },
    shadowY: { type: [Number, String], required: true },
    shadowBlur: { type: [Number, String], required: true },
    shadowSpread: { type: [Number, String], required: true },
});

defineEmits([
    'update:shadow-x',
    'update:shadow-y',
    'update:shadow-blur',
    'update:shadow-spread',
    'update:shadow-color',
]);
</script>
