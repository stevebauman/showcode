<template>
    <div class="flex-col items-center justify-center hidden w-10 h-full lg:flex">
        <span
            class="block h-full bg-ui-gray-500 strikethrough"
            :style="{ width: `${zoomScale * 2}px` }"
        >
        </span>

        <div
            class="tracking-widest text-center uppercase z-[2]"
            :style="{
                transform: `scale(${zoomScale})`,
                paddingTop: `${zoomScale}rem`,
                paddingBottom: `${zoomScale}rem`,
            }"
        >
            {{ number }}
            <br />
            px
        </div>

        <span
            class="block h-full bg-ui-gray-500 strikethrough"
            :style="{ width: `${zoomScale * 2}px` }"
        >
        </span>
    </div>
</template>

<script>
export default {
    props: {
        number: {
            type: [String, Number],
            required: true,
        },
        zoomScale: {
            type: [String, Number],
            required: true,
        },
    },
};
</script>
