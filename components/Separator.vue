<template>
    <div class="items-center justify-between hidden lg:flex">
        <span
            class="relative inline-block w-full h-px align-middle bg-ui-gray-500"
            :style="{ height: `${zoomScale * 2}px` }"
        ></span>

        <div
            class="px-2 tracking-widest text-center uppercase z-[2]"
            :style="{
                transform: `scale(${zoomScale})`,
                paddingLeft: `${1 * zoomScale}rem`,
                paddingRight: `${1 * zoomScale}rem`,
            }"
        >
            {{ number }}
            <br />
            px
        </div>

        <span
            class="relative inline-block w-full h-px align-middle bg-ui-gray-500"
            :style="{ height: `${zoomScale * 2}px` }"
        ></span>
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
