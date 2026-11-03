<template>
    <Toggle v-bind="$attrs" popover-title="Shine Properties" settings-tooltip="Configure Shine">
        <template #popover>
            <div
                class="property-preview mx-3 mt-3 flex h-28 items-center justify-center"
                aria-label="Shine preview"
            >
                <div
                    class="rounded-control border-ui-line bg-ui-field relative h-16 w-32 overflow-hidden border"
                >
                    <svg
                        aria-hidden="true"
                        class="absolute inset-0"
                        viewBox="0 0 100 172"
                        fill="none"
                        :style="{ width: `${shineWidth}%` }"
                    >
                        <path d="M0 0H100L47 172H0V0Z" :fill="`url(#${gradientId})`" />
                        <defs>
                            <linearGradient
                                :id="gradientId"
                                x1="50"
                                y1="0"
                                x2="50"
                                :y2="shineHeight"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="white" :stop-opacity="shineOpacity" />
                                <stop offset="1" stop-color="white" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div aria-hidden="true" class="absolute inset-x-3 top-5 space-y-2">
                        <div class="bg-ui-muted/30 h-1 w-12 rounded" />
                        <div class="bg-ui-muted/20 h-1 w-20 rounded" />
                    </div>
                </div>
            </div>
            <div class="property-fields">
                <div class="grid grid-cols-2 gap-2">
                    <label class="property-diagram-field !text-left">
                        Width %
                        <Input
                            type="number"
                            min="0"
                            :model-value="shineWidth"
                            @update:model-value="$emit('update:shine-width', Number($event))"
                        />
                    </label>
                    <label class="property-diagram-field !text-left">
                        Fade height
                        <Input
                            type="number"
                            min="0"
                            :model-value="shineHeight"
                            @update:model-value="$emit('update:shine-height', Number($event))"
                        />
                    </label>
                </div>
                <PropertyField label="Opacity" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        :model-value="Math.round(shineOpacity * 100)"
                        @update:model-value="$emit('update:shine-opacity', Number($event) / 100)"
                    />
                    <span class="text-ui-muted text-xs">%</span>
                </PropertyField>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
import { useId } from 'vue';

const gradientId = useId();
defineProps({
    shineWidth: {
        type: Number,
        required: true,
    },
    shineHeight: {
        type: Number,
        required: true,
    },
    shineOpacity: {
        type: Number,
        required: true,
    },
});
defineEmits(['update:shine-width', 'update:shine-height', 'update:shine-opacity']);
</script>
