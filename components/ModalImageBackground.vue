<template>
    <Modal v-bind="$attrs" v-on="$listeners">
        <ModalTitle>Upload Background</ModalTitle>

        <div class="flex items-stretch justify-between gap-2 mt-8">
            <div v-if="uploadedImage" class="relative w-full h-full overflow-hidden">
                <Cropper
                    class="w-full"
                    @change="updateImageDimensions"
                    :src="uploadedImage"
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

            <ButtonPlaceholder v-else @click.native="importBackground">
                <UploadCloudIcon class="w-5 h-5" /> Choose an image
            </ButtonPlaceholder>

            <div v-bind="backgroundAttrs" class="relative flex items-center justify-center w-full">
                <div
                    v-bind="backgroundAttrs"
                    class="flex items-center justify-center w-full h-full p-4"
                    :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
                >
                    <Window class="z-10" :blocks="blocks" :settings="settings" />
                </div>
            </div>
        </div>

        <div class="flex justify-between mt-4">
            <Button size="lg" @click.native="cancel">Cancel</Button>
            <Button @click.native="save" size="lg" variant="primary">Save</Button>
        </div>
    </Modal>
</template>

<script>
import 'vue-advanced-cropper/dist/style.css';
import { head } from 'lodash';
import collect from 'collect.js';
import { Cropper } from 'vue-advanced-cropper';
import { fileDialog } from 'file-select-dialog';
import useBackgrounds from '../composables/useBackgrounds';
import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api';
import { UploadCloudIcon, RefreshCwIcon } from 'vue-feather-icons';

export default {
    props: {
        blocks: Array,
        settings: Object,
    },

    components: { Cropper, UploadCloudIcon, RefreshCwIcon },

    setup(props, context) {
        const { emit } = context;

        const { backgrounds, loadBackgrounds, addCustomBackground } = useBackgrounds();

        const transparentBackground = computed(() =>
            collect(backgrounds.value).where('name', '=', 'transparent').first()
        );

        const uploadedImage = ref(null);
        const backgroundAttrs = ref(null);
        const croppedUploadedImage = ref(null);

        const importBackground = async () => {
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
            croppedUploadedImage.value = canvas.toDataURL('image/jpeg', 0.7);
        };

        watch(croppedUploadedImage, (value) => {
            backgroundAttrs.value = {
                style: {
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${value})`,
                },
            };
        });

        const reset = async () => {
            await loadBackgrounds();

            uploadedImage.value = null;

            backgroundAttrs.value = transparentBackground.value;
        };

        const cancel = () => {
            reset();

            emit('cancelled');
        };

        const save = async () => {
            const id = await addCustomBackground(backgroundAttrs.value);

            emit('saved', id);

            reset();
        };

        onMounted(reset);

        return {
            save,
            cancel,
            reset,
            uploadedImage,
            backgroundAttrs,
            importBackground,
            updateImageDimensions,
        };
    },
};
</script>
