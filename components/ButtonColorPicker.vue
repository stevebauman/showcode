<template>
    <ColorPicker
        v-bind="$attrs"
        boundaries-element="body"
        class="flex justify-center"
        popover-inner-class="overflow-hidden border-2 rounded-lg shadow-xl bg-ui-gray-700 border-ui-gray-800"
        #default="{ backgroundColor }"
    >
        <Button class="w-full tooltip-target">
            <span class="w-6 h-6 rounded-full" :style="{ backgroundColor: backgroundColor }" />

            Pick Color
        </Button>
    </ColorPicker>
</template>
