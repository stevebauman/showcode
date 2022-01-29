<template>
    <button @click="handleClick" aria-label="Toggle Darkmode" title="Toggle Darkmode">
        <slot :dark="isDarkMode" />
    </button>
</template>

<script>
import { onMounted, ref, useContext } from '@nuxtjs/composition-api';

export const LIGHTS_OUT = 'lights-out';

export default {
    setup() {
        const { $bus, $memory } = useContext();

        const isDarkMode = ref(false);

        const detectPrefered = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

        const hasInStorage = async () => await $memory.settings.has(LIGHTS_OUT);

        const writeToStorage = (prefersDark) =>
            $memory.settings.set(LIGHTS_OUT, prefersDark ? true : false);

        const getFromStorage = async () => {
            const setting = await $memory.settings.get(LIGHTS_OUT);

            return setting.all();
        };

        const handleClick = () => {
            const hasDarkMode = document.documentElement.hasAttribute(LIGHTS_OUT);

            return toggleDarkMode(!hasDarkMode);
        };

        const toggleDarkMode = (shouldBeDark) => {
            document.documentElement.toggleAttribute(LIGHTS_OUT, shouldBeDark);

            isDarkMode.value = shouldBeDark;

            writeToStorage(shouldBeDark);

            $bus.$emit('update:dark-mode', shouldBeDark);

            return shouldBeDark;
        };

        onMounted(async () => {
            if (await hasInStorage()) {
                toggleDarkMode(await getFromStorage());
            } else if (process.client && window.matchMedia) {
                toggleDarkMode(detectPrefered());
            }
        });

        return { isDarkMode, handleClick };
    },
};
</script>
