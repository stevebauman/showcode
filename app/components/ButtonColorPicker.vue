<template>
    <ColorPicker
        v-bind="$attrs"
        class="flex justify-center"
        popover-inner-class="overflow-hidden border-2 rounded-lg shadow-xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        #default="{ solid }"
    >
        <Button class="w-full tooltip-target">
            <span class="w-6 h-6 rounded-full" :style="{ backgroundColor: solid }" />

            Pick Color
        </Button>
    </ColorPicker>
</template>
