<template>
    <Modal v-bind="$attrs" v-on="$listeners" size="sm" class="space-y-4" header="Help Guide">
        <nuxt-content :document="content" />
    </Modal>
</template>

<script>
export default {
    data: () => ({ content: null }),

    async fetch() {
        this.content = await this.$content('help').fetch();
    },
};
</script>
