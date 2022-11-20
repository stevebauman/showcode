<template>
    <Button v-bind="$attrs" v-on="$listeners" :active="locked">
        <Icon type="lock" v-if="locked" class="w-4 h-4" />
        <Icon type="unlock" v-else class="w-4 h-4" />
    </Button>
</template>

<script>
export default {
    props: {
        locked: {
            type: Boolean,
            required: true,
        },
    }
};
</script>
