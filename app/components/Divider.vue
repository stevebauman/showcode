<template>
    <div class="hidden h-full w-10 flex-col items-center justify-center lg:flex">
        <span
            class="block bg-zinc-300 dark:bg-zinc-600"
            :style="{ width: `${zoomScale * 8}px`, height: `${zoomScale * 1}px` }"
        ></span>

        <span
            class="strikethrough block h-full bg-zinc-300 dark:bg-zinc-600"
            :style="{ width: `${zoomScale * 1}px` }"
        ></span>

        <div
            class="z-[2] whitespace-nowrap rounded-full border border-zinc-200 bg-white/80 text-center uppercase tracking-widest shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80"
            :style="{
                transform: `scale(${zoomScale})`,
                paddingTop: `${zoomScale * 0.25}rem`,
                paddingBottom: `${zoomScale * 0.25}rem`,
                paddingLeft: `${zoomScale * 0.5}rem`,
                paddingRight: `${zoomScale * 0.5}rem`,
            }"
        >
            {{ number }} px
        </div>

        <span
            class="strikethrough block h-full bg-zinc-300 dark:bg-zinc-600"
            :style="{ width: `${zoomScale * 1}px` }"
        ></span>

        <span
            class="block bg-zinc-300 dark:bg-zinc-600"
            :style="{ width: `${zoomScale * 8}px`, height: `${zoomScale * 1}px` }"
        ></span>
    </div>
</template>

<script setup>
defineProps({
    number: { type: [String, Number], required: true },
    zoomScale: { type: [String, Number], required: true },
});
</script>
