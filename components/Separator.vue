<template>
    <div class="overflow-hidden font-medium tracking-widest text-center uppercase strikethrough">
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
    @apply bg-gray-300 inline-block relative align-middle w-1/2;
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
