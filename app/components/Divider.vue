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

        <div class="relative flex w-full items-center justify-center">
            <div
                class="absolute left-1/2 z-[2] origin-left rounded-r-full border border-zinc-200 bg-white/80 px-2 py-1 text-center tracking-widest whitespace-nowrap uppercase shadow-xs backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-900/80"
                :style="{
                    transform: `scale(${zoomScale})`,
                }"
            >
                {{ number }} px
            </div>
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
