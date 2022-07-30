<template>
    <div
        class="overflow-hidden text-xs font-semibold tracking-widest text-center uppercase text-ui-gray-500 strikethrough"
    >
        {{ title }}
    </div>
</template>

<script>
export default {
    props: {
        title: String,
    },
};
</script>

<style scoped>
.strikethrough:before,
.strikethrough:after {
    @apply bg-ui-gray-600 inline-block relative align-middle w-1/2;
    content: '';
    height: 1px;
}
.strikethrough:before {
    right: 0.5em;
    margin-left: -50%;
}
.strikethrough:after {
    left: 0.5em;
    margin-right: -50%;
}
</style>
