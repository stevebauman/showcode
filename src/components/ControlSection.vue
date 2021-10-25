<template>
    <div
        class="relative flex items-stretch justify-between gap-4 my-4 bg-gray-700 border-2 border-gray-600 rounded-lg bg-opacity-60"
    >
        <div v-if="title" class="absolute top-0 flex justify-center w-full">
            <div
                class="px-4 -mt-3 text-xs font-semibold tracking-widest text-gray-300 uppercase bg-gray-700 border-2 border-gray-600 shadow rounded-xl"
            >
                {{ title }}
            </div>
        </div>

        <div class="flex items-center justify-between w-full gap-4 p-4">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: ["title"],
};
</script>
