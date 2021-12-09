<template>
    <div
        class="relative flex flex-col items-center justify-between my-4 overflow-hidden rounded-lg  bg-ui-gray-700 bg-opacity-60"
    >
        <div
            v-if="title || $slots.title"
            class="relative flex justify-center w-full py-2 text-xs font-bold tracking-widest uppercase  text-ui-gray-400 bg-ui-gray-800"
        >
            <slot name="title">
                {{ title }}
            </slot>
        </div>

        <slot />
    </div>
</template>

<script>
export default {
    props: { title: String },
};
</script>
