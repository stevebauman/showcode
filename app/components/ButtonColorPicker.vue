<template>
    <ColorPicker
        v-bind="$attrs"
        :value="modelValue"
        class="flex justify-center"
        popover-inner-class="overflow-hidden border-2 rounded-lg shadow-xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        #default="{ solid }"
    >
        <Button class="tooltip-target w-full">
            <span class="h-6 w-6 rounded-full" :style="{ backgroundColor: solid }" />

            Pick Color
        </Button>
    </ColorPicker>
</template>

<script setup>
defineProps({
    modelValue: { type: Object, required: true },
});
</script>
