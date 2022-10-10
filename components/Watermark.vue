<template>
    <div
        v-if="watermark"
        class="absolute inset-0 flex flex-col"
        :class="{
            'items-start justify-start': watermarkPosition === 'top-left',
            'items-center justify-start': watermarkPosition === 'top-center',
            'items-end justify-start': watermarkPosition === 'top-right',
            'items-start justify-end': watermarkPosition === 'bottom-left',
            'items-center justify-end': watermarkPosition === 'bottom-center',
            'items-end justify-end': watermarkPosition === 'bottom-right',
        }"
    >
        <div
            class="flex items-center gap-2"
            :style="{
                margin: `${watermarkMargin}px`,
                backgroundColor: `rgba(${backgroundColor})`,
                borderRadius: `${settings.watermarkBorderRadius}px`,
            }"
        >
            <div v-if="imageUrl">
                <img :src="imageUrl" class="w-10 h-10 rounded-full" />
            </div>

            <div class="pr-4 font-semibold" :style="{ color: `rgba(${color})` }">
                @{{ watermarkUsername }}
            </div>
        </div>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { computed } from '@nuxtjs/composition-api';
import usePreferencesStore from '@/composables/usePreferencesStore';

export default {
    props: {
        settings: Object,
    },

    setup(props) {
        const {
            watermark,
            watermarkUsername,
            watermarkScale,
            watermarkPosition,
            watermarkMargin,
            watermarkPlatform,
        } = storeToRefs(usePreferencesStore());

        const imageUrl = computed(() => {
            if (watermarkPlatform.value && watermarkUsername.value) {
                return `https://unavatar.io/${watermarkPlatform.value}/${watermarkUsername.value}`;
            }
        });

        const color = computed(() => {
            return `${props.settings.watermarkColor.red}, ${props.settings.watermarkColor.green}, ${props.settings.watermarkColor.blue}, ${props.settings.watermarkColor.alpha}`;
        });

        const backgroundColor = computed(() => {
            return `${props.settings.watermarkBackgroundColor.red}, ${props.settings.watermarkBackgroundColor.green}, ${props.settings.watermarkBackgroundColor.blue}, ${props.settings.watermarkBackgroundColor.alpha}`;
        });

        console.log(backgroundColor.value);

        return {
            color,
            backgroundColor,
            watermark,
            imageUrl,
            watermarkScale,
            watermarkPosition,
            watermarkMargin,
            watermarkUsername,
        };
    },
};
</script>
