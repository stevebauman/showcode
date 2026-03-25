<template>
    <div class="flex-col items-center justify-center hidden w-10 h-full lg:flex">
        <span
            class="block bg-zinc-300 dark:bg-zinc-600"
            :style="{ width: `${zoomScale * 8}px`, height: `${zoomScale * 1}px` }"
        ></span>

        <span
            class="block h-full bg-zinc-300 dark:bg-zinc-600 strikethrough"
            :style="{ width: `${zoomScale * 1}px` }"
        ></span>

        <div
            class="tracking-widest text-center uppercase z-[2] rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-sm whitespace-nowrap"
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
            class="block h-full bg-zinc-300 dark:bg-zinc-600 strikethrough"
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
