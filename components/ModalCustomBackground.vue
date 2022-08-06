<template>
    <Modal v-bind="$attrs" v-on="$listeners" header="Add Custom Background">
        <div class="flex items-stretch justify-between gap-2 mt-8">
            <template v-if="type === 'image'">
                <div
                    v-show="uploadedImage"
                    class="relative flex items-center justify-center w-full h-full overflow-hidden bg-pattern"
                >
                    <Cropper
                        ref="cropper"
                        class="w-full"
                        @change="updateImageDimensions"
                        :src="uploadedImage"
                        :stencil-props="{
                            handlersClasses: {
                                default: 'rounded-full shadow-sm',
                            },
                        }"
                        :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
                    />

                    <Button
                        size="sm"
                        @click.native="reset"
                        class="absolute bottom-0 right-0 m-4 shadow"
                        v-tooltip.right="{ content: 'Reset', delay: 500 }"
                    >
                        <RefreshCwIcon class="w-4 h-4" />
                    </Button>
                </div>

                <ButtonPlaceholder v-show="!uploadedImage" @click.native="importBackground">
                    <UploadCloudIcon class="w-5 h-5" /> Choose an image
                </ButtonPlaceholder>
            </template>

            <template v-else-if="type === 'css'">
                <div
                    ref="monacoWrapper"
                    class="relative w-full min-h-full overflow-hidden border rounded-xl border-ui-gray-800"
                >
                    <Monaco v-model="css" :height="monacoHeight" language="css" tab-size="2" />

                    <div
                        class="absolute bottom-0 w-full p-1 text-sm italic font-medium text-center bg-ui-gray-600 text-ui-gray-300"
                    >
                        Tip: CSS rules must be placed within an "el" target.
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="flex flex-col justify-between w-full min-h-full gap-2">
                    <ButtonPlaceholder @click.native="type = 'css'" class="w-full h-full">
                        <CodeIcon class="w-5 h-5" /> Custom CSS
                    </ButtonPlaceholder>

                    <ButtonPlaceholder @click.native="type = 'image'" class="w-full h-full">
                        <UploadCloudIcon class="w-5 h-5" /> Upload an Image
                    </ButtonPlaceholder>
                </div>
            </template>

            <div
                v-bind="backgroundAttrs"
                class="relative flex items-center justify-center w-full overflow-hidden"
            >
                <div
                    v-bind="backgroundAttrs"
                    class="flex items-center justify-center w-full h-full p-4"
                    :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
                >
                    <Window class="z-10" preview :blocks="blocks" :settings="settings" />
                </div>
            </div>
        </div>

        <div class="flex justify-between mt-4">
            <Button size="lg" @click.native="cancel">
                {{ type ? 'Back' : 'Cancel' }}
            </Button>

            <Button
                v-if="type"
                size="lg"
                @click.native="save"
                :variant="backgroundAttrs ? 'primary' : 'secondary'"
                v-tooltip.bottom="{
                    content: backgroundAttrs ? null : 'Create a background first.',
                }"
            >
                Save
            </Button>
        </div>
    </Modal>
</template>

<script>
import 'vue-advanced-cropper/dist/style.css';
import collect from 'collect.js';
import { toJSON } from 'cssjson';
import { get, head, debounce } from 'lodash';
import { useElementSize } from '@vueuse/core';
import { Cropper } from 'vue-advanced-cropper';
import { fileDialog } from 'file-select-dialog';
import useBackgrounds from '@/composables/useBackgrounds';
import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api';
import { CodeIcon, UploadCloudIcon, RefreshCwIcon } from 'vue-feather-icons';

export default {
    props: {
        blocks: Array,
        settings: Object,
    },

    components: { CodeIcon, Cropper, UploadCloudIcon, RefreshCwIcon },

    setup(props, { emit }) {
        const { backgrounds, addCustomBackground } = useBackgrounds();

        const transparentBackground = computed(() =>
            collect(backgrounds.value).where('id', '=', 'transparent').first()
        );

        const defaultCssValue = `el {\n  // background-color:\n}`;

        const css = ref(defaultCssValue);

        const type = ref(null);
        const cropper = ref(null);
        const monacoHeight = ref(0);
        const monacoWrapper = ref(null);
        const uploadedImage = ref(null);
        const backgroundAttrs = ref(null);
        const croppedUploadedImage = ref(null);

        const { height: monacoWrapperHeight } = useElementSize(monacoWrapper);

        const importBackground = async () => {
            reset();

            const files = await fileDialog({ accept: ['.png', '.jpg', '.gif'] });

            const file = head(files);

            if (!file) {
                return;
            }

            const blob = await new Response(file).blob();

            const reader = new FileReader();

            reader.onload = () => (uploadedImage.value = reader.result);

            reader.readAsDataURL(blob);
        };

        const updateImageDimensions = ({ canvas }) => {
            croppedUploadedImage.value = canvas?.toDataURL('image/jpeg', 0.7);
        };

        const reset = () => {
            css.value = defaultCssValue;

            cropper.value?.reset();

            uploadedImage.value = null;

            backgroundAttrs.value = transparentBackground.value;
        };

        const cancel = () => {
            reset();

            if (type.value) {
                return (type.value = null);
            }

            emit('cancelled');
        };

        const save = () => {
            const id = addCustomBackground(backgroundAttrs.value);

            emit('saved', id);

            reset();
        };

        watch(croppedUploadedImage, (value) => {
            if (type.value !== 'image') {
                return;
            }

            backgroundAttrs.value = {
                style: {
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${value})`,
                },
            };
        });

        watch(
            css,
            debounce((value) => {
                if (type.value !== 'css') {
                    return;
                }

                let style = '';
                let attributes = {};

                try {
                    attributes = get(toJSON(value), 'children.el.attributes', {});
                } catch (e) {
                    return;
                }

                Object.keys(attributes).forEach(
                    (attribute) => (style += `${attribute}:${attributes[attribute]};`)
                );

                style = style.replace(/(\r\n|\n|\r)/gm, '');

                backgroundAttrs.value = { style };
            }, 500)
        );

        watch(monacoWrapperHeight, (value) => (monacoHeight.value = value));

        onMounted(reset);

        return {
            css,
            type,
            save,
            cancel,
            reset,
            cropper,
            monacoHeight,
            monacoWrapper,
            uploadedImage,
            backgroundAttrs,
            importBackground,
            updateImageDimensions,
        };
    },
};
</script>
