<template>
    <div class="grid grid-cols-2 gap-x-12 gap-y-3 p-3">
        <label
            v-for="corner in corners.slice(0, 2)"
            :key="corner.key"
            class="property-diagram-field"
        >
            {{ corner.label }}
            <Input
                type="number"
                min="0"
                :model-value="values[corner.key]"
                @update:model-value="$emit('change', corner.key, Number($event))"
            />
        </label>
        <div class="relative col-span-2 mx-auto flex h-20 w-32 items-center justify-center">
            <span
                aria-hidden="true"
                class="border-ui-muted/60 bg-ui-field absolute inset-0 border"
                :style="{
                    borderTopLeftRadius: `${Math.min(values.topLeft, 32)}px`,
                    borderTopRightRadius: `${Math.min(values.topRight, 32)}px`,
                    borderBottomLeftRadius: `${Math.min(values.bottomLeft, 32)}px`,
                    borderBottomRightRadius: `${Math.min(values.bottomRight, 32)}px`,
                }"
            />
            <Button
                variant="ghost"
                size="icon"
                class="relative"
                :aria-label="linked ? 'Unlink corners' : 'Link corners'"
                :aria-pressed="linked"
                v-tooltip="linked ? 'Unlink corners' : 'Link corners'"
                @click="$emit('update:linked', !linked)"
            >
                <LinkIcon v-if="linked" />
                <UnlinkIcon v-else />
            </Button>
        </div>
        <label v-for="corner in corners.slice(2)" :key="corner.key" class="property-diagram-field">
            <Input
                type="number"
                min="0"
                :model-value="values[corner.key]"
                @update:model-value="$emit('change', corner.key, Number($event))"
            />
            {{ corner.label }}
        </label>
    </div>
</template>

<script setup>
import { LinkIcon, UnlinkIcon } from 'lucide-vue-next';

defineProps({
    values: { type: Object, required: true },
    linked: { type: Boolean, required: true },
});
defineEmits(['change', 'update:linked']);

const corners = [
    { key: 'topLeft', label: 'Top left' },
    { key: 'topRight', label: 'Top right' },
    { key: 'bottomLeft', label: 'Bottom left' },
    { key: 'bottomRight', label: 'Bottom right' },
];
</script>
