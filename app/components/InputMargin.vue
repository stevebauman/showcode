<template>
    <div class="grid grid-cols-[1fr_64px_1fr] items-center gap-2 p-3">
        <label class="property-diagram-field col-start-2">
            Top
            <Input
                type="number"
                :model-value="marginTop"
                @update:model-value="$emit('update:margin-top', Number($event))"
            />
        </label>
        <label class="property-diagram-field row-start-2">
            Left
            <Input
                type="number"
                :model-value="marginLeft"
                @update:model-value="$emit('update:margin-left', Number($event))"
            />
        </label>
        <div class="relative col-start-2 row-start-2 flex h-16 items-center justify-center">
            <span
                aria-hidden="true"
                class="rounded-control border-ui-muted/50 absolute inset-0 border"
                :class="inset ? 'bg-ui-selected' : 'border-dashed'"
            />
            <span
                aria-hidden="true"
                class="border-ui-line absolute inset-2 rounded-sm border"
                :class="inset ? 'bg-ui-canvas' : 'bg-ui-field'"
            />
            <Button
                v-if="linkable"
                variant="ghost"
                size="icon-sm"
                class="relative"
                :aria-label="linked ? 'Unlink padding sides' : 'Link padding sides'"
                :aria-pressed="linked"
                v-tooltip="linked ? 'Unlink sides' : 'Link sides'"
                @click="$emit('update:linked', !linked)"
            >
                <LinkIcon v-if="linked" class="!size-3.5" />
                <UnlinkIcon v-else class="!size-3.5" />
            </Button>
        </div>
        <label class="property-diagram-field col-start-3 row-start-2">
            Right
            <Input
                type="number"
                :model-value="marginRight"
                @update:model-value="$emit('update:margin-right', Number($event))"
            />
        </label>
        <label class="property-diagram-field col-start-2 row-start-3">
            Bottom
            <Input
                type="number"
                :model-value="marginBottom"
                @update:model-value="$emit('update:margin-bottom', Number($event))"
            />
        </label>
    </div>
</template>

<script setup>
import { LinkIcon, UnlinkIcon } from 'lucide-vue-next';

defineProps({
    marginTop: Number,
    marginLeft: Number,
    marginRight: Number,
    marginBottom: Number,
    inset: { type: Boolean, default: false },
    linkable: { type: Boolean, default: false },
    linked: { type: Boolean, default: false },
});

defineEmits([
    'update:margin-top',
    'update:margin-right',
    'update:margin-bottom',
    'update:margin-left',
    'update:linked',
]);
</script>
