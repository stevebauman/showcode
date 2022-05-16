<template>
    <div>
        <portal to="modal">
            <ModalImageBackground
                v-model="showingBackgroundsModal"
                :width="attributes.width"
                :height="attributes.height"
                @saved="updateWithCustomBackground"
                @cancelled="showingBackgroundsModal = false"
            />
        </portal>

        <Canvas
            ref="canvas"
            dusk="canvas"
            class="relative flex"
            :width="attributes.width"
            :height="attributes.height"
            :aspect-ratio="attributes.aspectRatio"
            :background="attributes.background"
            :background-attributes="backgroundAttrs"
            @update:width="(width) => setWidth(width)"
            @update:height="(height) => setHeight(height)"
        />

        <portal to="controls">
            <ControlTabs :tabs="[{ name: 'backgrounds', title: 'Backgrounds' }]">
                <template #default="{ active }">
                    <div
                        v-show="active === 'backgrounds'"
                        dusk="control-backgrounds"
                        class="flex flex-col justify-start w-full gap-4"
                    >
                        <div
                            class="grid grid-flow-col grid-rows-3 gap-4 p-4 overflow-x-auto auto-cols-max scrollbar-hide"
                        >
                            <ButtonBackground
                                v-for="{ id, custom, ...attrs } in backgrounds"
                                v-bind="attrs"
                                :ref="`button-background-${id}`"
                                :dusk="`button-background-${id}`"
                                :key="id"
                                :custom="custom"
                                :active="attributes.background === id"
                                @delete="deleteBackground(id)"
                                @click.native="attributes.background = id"
                            />
                        </div>

                        <div class="mx-4 mb-4">
                            <ButtonPlaceholder
                                v-tooltip.bottom="{
                                    content: $config.isDesktop
                                        ? null
                                        : 'Download the desktop app to upload backgrounds.',
                                }"
                                @click.native="showingBackgroundsModal = true"
                            >
                                <PlusCircleIcon class="w-4 h-4" /> Upload
                            </ButtonPlaceholder>
                        </div>
                    </div>
                </template>
            </ControlTabs>
        </portal>
    </div>
</template>

<script>
import { PlusCircleIcon } from 'vue-feather-icons';
import { ref, reactive, computed, watch, toRefs } from '@nuxtjs/composition-api';
import { default as useBackgrounds, DEFAULT_BACKGROUND } from '../../composables/useBackgrounds';

export default {
    inheritAttrs: false,

    props: {
        element: {
            type: Object,
            required: true,
        },
    },

    components: { PlusCircleIcon },

    setup(props, { emit }) {
        const { element } = toRefs(props);

        const showingBackgroundsModal = ref(false);

        const attributes = reactive({
            scale: 1.0,
            width: 400,
            height: 200,
            aspectRatio: null,
            background: DEFAULT_BACKGROUND,
        });

        const { backgrounds, getBackgroundAttrs, deleteCustomBackground } = useBackgrounds();

        const updateWithCustomBackground = (id) => {
            background.value = id;
            showingBackgroundsModal.value = false;

            nextTick(() => {
                generateTemplateImage();
                scrollSelectedBackgroundIntoView();
            });
        };

        const deleteBackground = (id) => {
            if (!confirm('Delete this background?')) {
                return;
            }

            setDefaultBackground();

            deleteCustomBackground(id);

            nextTick(scrollSelectedBackgroundIntoView);
        };

        const setWidth = (width, manual = false) => {
            if (width >= 0) {
                attributes.width = Math.round(width);
            }

            if (manual) {
                attributes.aspectRatio = null;
            }
        };

        const setHeight = (height) => {
            if (height >= 0) {
                attributes.height = Math.round(height);
            }
        };

        const { background } = toRefs(attributes);

        const backgroundAttrs = computed(() => getBackgroundAttrs(background.value));

        watch(attributes, (values) => emit('update:element', values));

        return {
            setWidth,
            setHeight,
            attributes,
            backgrounds,
            backgroundAttrs,
            deleteBackground,
            showingBackgroundsModal,
            updateWithCustomBackground,
        };
    },
};
</script>
