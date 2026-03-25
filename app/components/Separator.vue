<template>
    <div class="items-center justify-between hidden lg:flex">
        <span
            class="relative inline-block bg-zinc-300 dark:bg-zinc-600 flex-shrink-0"
            :style="{ width: `${zoomScale * 1}px`, height: `${zoomScale * 8}px` }"
        ></span>

        <span
            class="relative inline-block w-full align-middle bg-zinc-300 dark:bg-zinc-600"
            :style="{ height: `${zoomScale * 1}px` }"
        ></span>

        <div
            class="tracking-widest text-center uppercase z-[2] rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-sm whitespace-nowrap"
            :style="{
                transform: `scale(${zoomScale})`,
                paddingLeft: `${zoomScale * 0.5}rem`,
                paddingRight: `${zoomScale * 0.5}rem`,
                paddingTop: `${zoomScale * 0.25}rem`,
                paddingBottom: `${zoomScale * 0.25}rem`,
            }"
        >
            {{ number }} px
        </div>

        <span
            class="relative inline-block w-full align-middle bg-zinc-300 dark:bg-zinc-600"
            :style="{ height: `${zoomScale * 1}px` }"
        ></span>

        <span
            class="relative inline-block bg-zinc-300 dark:bg-zinc-600 flex-shrink-0"
            :style="{ width: `${zoomScale * 1}px`, height: `${zoomScale * 8}px` }"
        ></span>
    </div>
</template>

<script setup>
defineProps({
    number: { type: [String, Number], required: true },
    zoomScale: { type: [String, Number], required: true },
});
</script>
