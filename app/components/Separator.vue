<template>
    <div class="hidden items-center justify-between lg:flex">
        <span
            class="relative inline-block shrink-0 bg-zinc-300 dark:bg-zinc-600"
            :style="{ width: `${zoomScale * 1}px`, height: `${zoomScale * 8}px` }"
        ></span>

        <span
            class="relative inline-block w-full bg-zinc-300 align-middle dark:bg-zinc-600"
            :style="{ height: `${zoomScale * 1}px` }"
        ></span>

        <div
            class="rounded-control z-[2] -mx-px shrink-0 origin-center border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium tracking-normal whitespace-nowrap text-zinc-500 normal-case tabular-nums dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-400"
            :style="{
                transform: `scale(${zoomScale})`,
            }"
        >
            {{ number }} px
        </div>

        <span
            class="relative inline-block w-full bg-zinc-300 align-middle dark:bg-zinc-600"
            :style="{ height: `${zoomScale * 1}px` }"
        ></span>

        <span
            class="relative inline-block shrink-0 bg-zinc-300 dark:bg-zinc-600"
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
