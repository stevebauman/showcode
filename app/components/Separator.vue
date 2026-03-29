<template>
    <div class="hidden items-center justify-between lg:flex">
        <span
            class="relative inline-block flex-shrink-0 bg-zinc-300 dark:bg-zinc-600"
            :style="{ width: `${zoomScale * 1}px`, height: `${zoomScale * 8}px` }"
        ></span>

        <span
            class="relative inline-block w-full bg-zinc-300 align-middle dark:bg-zinc-600"
            :style="{ height: `${zoomScale * 1}px` }"
        ></span>

        <div
            class="z-[2] whitespace-nowrap rounded-full border border-zinc-200 bg-white/80 text-center uppercase tracking-widest shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80"
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
            class="relative inline-block w-full bg-zinc-300 align-middle dark:bg-zinc-600"
            :style="{ height: `${zoomScale * 1}px` }"
        ></span>

        <span
            class="relative inline-block flex-shrink-0 bg-zinc-300 dark:bg-zinc-600"
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
