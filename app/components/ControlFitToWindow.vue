<template>
    <CanvasControlSurface class="group flex items-stretch overflow-hidden">
        <Button
            aria-label="Fit to Window"
            variant="ghost"
            class="h-full rounded-none px-2.5 text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/[0.07] dark:hover:text-zinc-50"
            @click="$emit('apply')"
        >
            <MinimizeIcon class="!size-3.5" />
            <span class="hidden md:inline">Fit to Window</span>
        </Button>

        <ButtonLock
            :aria-label="lockWindowSize ? 'Unlock Fit to Window' : 'Lock Fit to Window'"
            variant="ghost"
            class="h-full rounded-none px-2 text-zinc-400 hover:bg-zinc-100/80 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200 [&_svg]:!size-3.5"
            :class="{ 'border-r border-zinc-200/80 dark:border-white/5': lockWindowSize }"
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

            <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                <div class="grid grid-cols-2 gap-2 divide-x divide-zinc-200 dark:divide-zinc-800">
                    <div class="flex w-full items-center justify-between gap-2 px-3 py-2">
                        <Label class="w-full text-center">Padding X</Label>

                        <Input
                            type="number"
                            class="w-16 text-center"
                            :model-value="lockWindowPaddingX"
                            @update:model-value="$emit('update:lock-window-padding-x', $event)"
                        />
                    </div>

                    <div class="flex w-full items-center justify-between gap-2 px-3 py-2">
                        <Label class="w-full text-center">Padding Y</Label>

                        <Input
                            type="number"
                            class="w-16 text-center"
                            :model-value="lockWindowPaddingY"
                            @update:model-value="$emit('update:lock-window-padding-y', $event)"
                        />
                    </div>
                </div>
            </div>
        </PopoverPanel>
    </CanvasControlSurface>
</template>

<script setup>
import { MinimizeIcon } from 'lucide-vue-next';

defineProps({
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
