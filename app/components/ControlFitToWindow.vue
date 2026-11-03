<template>
    <CanvasControlSurface
        class="group flex shrink-0 items-stretch"
        :class="compact ? 'gap-0.5 rounded-full border-0 bg-transparent' : 'overflow-hidden'"
    >
        <Button
            aria-label="Fit to Window"
            variant="ghost"
            class="h-full rounded-none px-2.5 text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.07] dark:hover:text-zinc-50"
            :class="{ 'px-1.5': compact }"
            v-tooltip="'Fit to window'"
            @click="$emit('apply')"
        >
            <MinimizeIcon class="!size-3.5" />
            <span v-if="!compact" class="hidden md:inline">Fit to Window</span>
        </Button>

        <ButtonLock
            :aria-label="lockWindowSize ? 'Unlock Fit to Window' : 'Lock Fit to Window'"
            :aria-pressed="lockWindowSize"
            variant="ghost"
            class="h-full rounded-none px-2 text-zinc-400 hover:bg-zinc-100/80 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200 [&_svg]:!size-3.5"
            :class="{
                'w-7 px-0': compact,
                'border-r border-zinc-200/80 dark:border-white/5': !compact && lockWindowSize,
            }"
            v-tooltip="lockWindowSize ? 'Unlock Fit to Window' : 'Lock Fit to Window'"
            :locked="lockWindowSize"
            @click="$emit('update:lock-window-size', !lockWindowSize)"
        />

        <PopoverPanel v-if="lockWindowSize" title="Fitting Properties">
            <template #trigger>
                <ButtonSettings
                    aria-label="Configure Fit to Window"
                    size="icon-sm"
                    variant="ghost"
                    class="h-full w-7 rounded-none text-zinc-400 hover:bg-zinc-100/80 hover:text-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0 dark:text-zinc-500 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-600"
                    v-tooltip="'Configure Fit to Window'"
                />
            </template>

            <div class="property-preview relative mx-3 mt-3 h-24" aria-label="Fit padding preview">
                <div
                    aria-hidden="true"
                    class="border-ui-muted/40 absolute inset-3 rounded border border-dashed"
                />
                <div
                    aria-hidden="true"
                    class="border-ui-muted/60 bg-ui-field absolute inset-x-14 inset-y-6 rounded border"
                />
                <MoveHorizontalIcon
                    aria-hidden="true"
                    class="text-ui-muted absolute top-1/2 left-5 size-7 -translate-y-1/2"
                />
                <MoveVerticalIcon
                    aria-hidden="true"
                    class="text-ui-muted absolute top-1 left-1/2 size-5 -translate-x-1/2"
                />
            </div>
            <div class="property-fields">
                <PropertyField label="Horizontal" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="number"
                        :model-value="lockWindowPaddingX"
                        @update:model-value="$emit('update:lock-window-padding-x', Number($event))"
                    />
                </PropertyField>
                <PropertyField label="Vertical" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="number"
                        :model-value="lockWindowPaddingY"
                        @update:model-value="$emit('update:lock-window-padding-y', Number($event))"
                    />
                </PropertyField>
            </div>
        </PopoverPanel>
    </CanvasControlSurface>
</template>

<script setup>
import { MinimizeIcon, MoveHorizontalIcon, MoveVerticalIcon } from 'lucide-vue-next';

defineProps({
    compact: { type: Boolean, default: false },
    lockWindowSize: { type: Boolean, required: true },
    lockWindowPaddingX: { type: Number, required: true },
    lockWindowPaddingY: { type: Number, required: true },
});

defineEmits([
    'apply',
    'update:lock-window-size',
    'update:lock-window-padding-x',
    'update:lock-window-padding-y',
]);
</script>
