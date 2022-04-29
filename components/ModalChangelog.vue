<template>
    <Modal v-bind="$attrs" v-on="$listeners" size="sm" class="space-y-4" header="Changelog">
        <div class="overflow-y-scroll max-h-[40rem] rounded-lg">
            <nuxt-content :document="content" />
        </div>
    </Modal>
</template>

<script>
export default {
    data: () => ({ content: null }),

    async fetch() {
        this.content = await this.$content('changelog').fetch();
    },
};
</script>
