<template>
    <Button v-bind="$attrs" v-on="$listeners">
        <SettingsIcon class="w-4 h-4" />
    </Button>
</template>

<script>
import { SettingsIcon } from 'vue-feather-icons';

export default {
    components: { SettingsIcon },
};
</script>
