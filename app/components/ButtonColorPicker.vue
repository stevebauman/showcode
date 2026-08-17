<template>
    <ColorPicker
        v-bind="$attrs"
        :value="modelValue"
        class="flex justify-center"
        popover-inner-class="overflow-hidden !rounded-surface !border !border-zinc-200 !bg-white !p-2 !shadow-md dark:!border-zinc-800 dark:!bg-zinc-950"
        #default="{ solid }"
    >
        <Button
            variant="outline"
            class="tooltip-target h-7 w-full gap-1.5 border-zinc-200/80 bg-zinc-100/80 text-zinc-700 shadow-none hover:bg-zinc-200/70 hover:text-zinc-900 dark:border-white/5 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/[0.08] dark:hover:text-zinc-100"
        >
            <span
                class="size-4 rounded-full ring-1 ring-black/10 dark:ring-white/10"
                :style="{ backgroundColor: solid }"
            />

            Pick Color
        </Button>
    </ColorPicker>
</template>

<script setup>
defineProps({
    modelValue: { type: Object, default: null },
});
</script>
