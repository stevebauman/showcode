<template>
    <div
        class="relative flex flex-col items-stretch justify-between my-4 overflow-hidden bg-gray-700 rounded-lg shadow-xl bg-opacity-60"
    >
        <div
            v-if="title"
            class="flex justify-center w-full py-2 text-xs font-bold tracking-widest text-gray-400 uppercase bg-gray-800"
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
