<template>
    <button @click="handleClick" aria-label="Toggle Darkmode" title="Toggle Darkmode">
        <slot :dark="isDarkMode" />
    </button>
</template>

<script>
export const LIGHTS_OUT = 'lights-out';

export default {
    data() {
        return {
            isDarkMode: false,
        };
    },

    methods: {
        handleClick() {
            const hasDarkMode = document.documentElement.hasAttribute(LIGHTS_OUT);

            // Toggle dark mode on click.
            return this.toggleDarkMode(!hasDarkMode);
        },

        toggleDarkMode(shouldBeDark) {
            document.documentElement.toggleAttribute(LIGHTS_OUT, shouldBeDark);

            this.isDarkMode = shouldBeDark;

            this.writeToStorage(shouldBeDark);

            this.$nuxt.$emit('update:dark-mode', shouldBeDark);

            return shouldBeDark;
        },

        detectPrefered() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        },

        async hasInStorage() {
            return await this.$memory.settings.has(LIGHTS_OUT);
        },

        writeToStorage(prefersDark) {
            this.$memory.settings.set(LIGHTS_OUT, prefersDark ? true : false);
        },

        async getFromStorage() {
            const setting = await this.$memory.settings.get(LIGHTS_OUT);

            return setting.all();
        },
    },

    async mounted() {
        if (await this.hasInStorage()) {
            this.toggleDarkMode(await this.getFromStorage());
        } else if (process.isClient && window.matchMedia) {
            this.toggleDarkMode(this.detectPrefered());
        }
    },
};
</script>
