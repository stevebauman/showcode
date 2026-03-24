<template>
    <div class="flex items-stretch shadow group overflow-hidden rounded-lg">
        <Button
            variant="secondary"
            class="rounded-none rounded-l-lg"
            @click="$emit('apply')"
        >
            <MinimizeIcon class="w-4 h-4" />
            <span class="hidden md:inline">Fit to Window</span>
        </Button>

        <ButtonLock
            variant="secondary"
            class="rounded-none"
            :locked="lockWindowSize"
            :class="{ 'rounded-r-lg': !lockWindowSize }"
            v-tooltip="lockWindowSize ? 'Unlock Fit to Window' : 'Lock Fit to Window'"
            @click="$emit('update:lock-window-size', !lockWindowSize)"
        />

        <PopoverPanel title="Fitting Properties">
            <template #trigger>
                <Button
                    v-if="lockWindowSize"
                    variant="secondary"
                    class="rounded-none rounded-r-lg"
                >
                    <SettingsIcon class="w-4 h-4" />
                </Button>
            </template>

            <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                <div class="grid grid-cols-2 gap-2 divide-x divide-zinc-200 dark:divide-zinc-800">
                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Padding X </Label>

                        <Input
                            type="number"
                            class="w-16 text-center"
                            :model-value="lockWindowPaddingX"
                           
                            @update:model-value="$emit('update:lock-window-padding-x', $event)"
                        />
                    </div>

                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Padding Y </Label>

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

defineEmits(['apply', 'update:lock-window-size', 'update:lock-window-padding-x', 'update:lock-window-padding-y']);
</script>
