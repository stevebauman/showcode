<template>
    <div
        class="group flex h-7 items-stretch overflow-hidden rounded-xl border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
    >
        <Button variant="ghost" class="rounded-none rounded-l-xl" @click="$emit('apply')">
            <MinimizeIcon class="h-4 w-4" />
            <span class="hidden md:inline">Fit to Window</span>
        </Button>

        <ButtonLock
            variant="ghost"
            class="rounded-none"
            :locked="lockWindowSize"
            :class="{ 'rounded-r-xl': !lockWindowSize }"
            v-tooltip="lockWindowSize ? 'Unlock Fit to Window' : 'Lock Fit to Window'"
            @click="$emit('update:lock-window-size', !lockWindowSize)"
        />

        <PopoverPanel v-if="lockWindowSize" title="Fitting Properties">
            <template #trigger>
                <Button variant="ghost" class="rounded-none rounded-r-xl">
                    <SettingsIcon class="h-4 w-4" />
                </Button>
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
    </div>
</template>

<script setup>
import { MinimizeIcon, SettingsIcon } from 'lucide-vue-next';

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
