<template>
    <div class="items-center justify-between hidden lg:flex">
        <span
            class="relative inline-block w-full h-px align-middle bg-ui-gray-500"
            :style="{ height: `${zoomScale * 1}px` }"
        ></span>

        <div
            class="tracking-widest text-center uppercase z-[2]"
            :style="{
                transform: `scale(${zoomScale})`,
                paddingLeft: `${zoomScale}rem`,
                paddingRight: `${zoomScale}rem`,
            }"
        >
            {{ number }}
            <br />
            px
        </div>

        <span
            class="relative inline-block w-full h-px align-middle bg-ui-gray-500"
            :style="{ height: `${zoomScale * 1}px` }"
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
