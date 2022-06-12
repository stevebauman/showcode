<template></template>

<script>
import useHotkeys from '@/composables/useHotkeys';

export default {
    props: { shortcuts: Array },

    setup(props, context) {
        useHotkeys(props, context);
    },
};
</script>
