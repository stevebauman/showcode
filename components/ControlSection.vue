<template>
    <div
        class="relative flex items-stretch justify-between my-4 bg-gray-700 rounded-lg  bg-opacity-60"
    >
        <div v-if="title" class="absolute top-0 flex justify-center w-full">
            <div
                class="
                    px-4
                    py-0.5
                    -mt-3
                    text-xs
                    font-bold
                    tracking-widest
                    text-gray-300
                    uppercase
                    bg-gray-700
                    shadow
                    rounded-lg
                "
            >
                {{ title }}
            </div>
        </div>

        <slot />
    </div>
</template>

<script>
export default {
    props: { title: String },
};
</script>
