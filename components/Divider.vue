<template>
    <div class="flex-col items-center justify-center hidden w-10 h-full lg:flex">
        <span class="block w-px h-full bg-gray-500 strikethrough"> </span>

        <div class="py-2 tracking-widest text-center uppercase">{{ title }}</div>

        <span class="block w-px h-full bg-gray-500 strikethrough"> </span>
    </div>
</template>

<script>
export default {
    props: { title: String },
};
</script>
