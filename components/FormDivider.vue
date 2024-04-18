<template>
    <div
        class="overflow-hidden text-xs font-semibold tracking-widest text-center uppercase text-ui-gray-100 bg-ui-gray-600 rounded py-1"
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
