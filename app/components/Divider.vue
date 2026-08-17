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
                class="rounded-r-control absolute left-1/2 z-[2] origin-left border-y border-r border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium tracking-normal whitespace-nowrap text-zinc-500 normal-case tabular-nums dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-400"
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
