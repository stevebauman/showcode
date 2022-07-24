<template>
    <Button v-bind="$attrs" v-on="$listeners" :active="locked">
        <LockIcon v-if="locked" class="w-4 h-4" />
        <UnlockIcon v-else class="w-4 h-4" />
    </Button>
</template>

<script>
import { LockIcon, UnlockIcon } from 'vue-feather-icons';

export default {
    props: {
        locked: {
            type: Boolean,
            required: true,
        },
    },

    components: { LockIcon, UnlockIcon },
};
</script>
