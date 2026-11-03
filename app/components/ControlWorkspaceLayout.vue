<template>
    <PopoverPanel title="Workspace layout" :resets="false">
        <template #trigger>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="size-7 shrink-0 rounded-full"
                aria-label="Workspace layout"
                v-tooltip="'Workspace layout'"
            >
                <PanelsTopLeftIcon class="!size-3.5" />
            </Button>
        </template>

        <div role="group" aria-label="Choose workspace layout" class="grid grid-cols-2 gap-2 p-3">
            <button
                v-for="layout in layouts"
                :key="layout.value"
                type="button"
                :aria-label="layout.description"
                :aria-pressed="orientation === layout.value"
                class="rounded-control focus-visible:outline-ui-focus flex flex-col gap-2 border p-2 text-left transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-1"
                :class="
                    orientation === layout.value
                        ? 'border-ui-focus bg-ui-hover text-ui-text'
                        : 'border-ui-line text-ui-muted hover:bg-ui-hover hover:text-ui-text'
                "
                @click="$emit('update:orientation', layout.value)"
            >
                <span
                    aria-hidden="true"
                    class="bg-ui-canvas flex h-14 w-full gap-1 rounded p-1.5"
                    :class="layout.direction"
                >
                    <span
                        class="bg-ui-selected text-ui-text flex basis-1/3 items-center justify-center rounded-sm"
                    >
                        <Code2Icon class="size-3.5" />
                    </span>
                    <span
                        class="border-ui-line bg-ui-field flex flex-1 items-center justify-center rounded-sm border"
                    >
                        <ImageIcon class="size-3.5" />
                    </span>
                </span>
                <span
                    class="flex w-full items-center justify-between gap-1 text-[11px] font-medium"
                >
                    {{ layout.label }}
                    <CheckIcon v-if="orientation === layout.value" class="size-3 shrink-0" />
                </span>
            </button>
        </div>
    </PopoverPanel>
</template>

<script setup>
import { CheckIcon, Code2Icon, ImageIcon, PanelsTopLeftIcon } from 'lucide-vue-next';

defineProps({ orientation: { type: String, required: true } });
defineEmits(['update:orientation']);

const layouts = [
    {
        value: 'left',
        label: 'Code left',
        description: 'Code left, preview right',
        direction: 'flex-row',
    },
    {
        value: 'right',
        label: 'Code right',
        description: 'Code right, preview left',
        direction: 'flex-row-reverse',
    },
    {
        value: 'top',
        label: 'Code above',
        description: 'Code above, preview below',
        direction: 'flex-col',
    },
    {
        value: 'bottom',
        label: 'Code below',
        description: 'Code below, preview above',
        direction: 'flex-col-reverse',
    },
];
</script>
