<template>
    <div
        class="relative flex flex-col items-center justify-between my-4 overflow-hidden rounded-lg shadow-xl  bg-ui-gray-700 bg-opacity-60"
    >
        <div
            v-if="title"
            class="flex justify-center w-full py-2 text-xs font-bold tracking-widest uppercase  text-ui-gray-400 bg-ui-gray-800"
        >
            {{ title }}
        </div>

        <slot />
    </div>
</template>

<script>
export default {
    props: { title: String },
};
</script>
