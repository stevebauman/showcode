<template>
    <button
        :class="{
            'text-ui-gray-50 bg-ui-gray-700 bg-opacity-60': active,
            'text-ui-gray-500 bg-ui-gray-800 bg-opacity-60 hover:bg-ui-gray-900 hover:text-ui-gray-400':
                !active,
        }"
        class="flex items-center justify-center w-full h-8 gap-2 px-2 text-xs font-semibold leading-none tracking-widest uppercase"
    >
        <Dot v-if="active" class="hidden md:block" /> <slot />
    </button>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
