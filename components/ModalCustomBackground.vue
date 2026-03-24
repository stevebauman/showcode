<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="max-w-4xl max-h-[80vh] flex flex-col gap-0 p-0">
            <DialogHeader class="px-5 pt-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <DialogTitle class="text-sm font-semibold">Add Custom Background</DialogTitle>
            </DialogHeader>

            <div class="flex items-stretch gap-3 p-5 min-h-[300px]">
                <template v-if="type === 'image'">
                    <div
                        v-show="uploadedImage"
                        class="relative flex items-center justify-center w-full h-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-pattern"
                    >
                        <Cropper
                            ref="cropper"
                            class="w-full"
                            @change="updateImageDimensions"
                            :src="uploadedImage"
                            :stencil-props="{ handlersClasses: { default: 'rounded-full shadow-sm' } }"
                            :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
                        />

                        <Button
                            size="sm"
                            @click="reset"
                            class="absolute bottom-0 right-0 m-3 shadow"
                            v-tooltip.right="{ content: 'Reset', delay: 500 }"
                        >
                            <RefreshCwIcon class="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <ButtonPlaceholder v-show="!uploadedImage" @click="importBackground">
                        <UploadCloudIcon class="w-4 h-4" /> Choose an image
                    </ButtonPlaceholder>
                </template>

                <template v-else-if="type === 'css'">
                    <div
                        ref="monacoWrapper"
                        class="relative w-full min-h-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                        <Monaco v-model="css" :height="monacoHeight" language="css" tab-size="2" />

                        <div class="absolute bottom-0 w-full p-1 text-[10px] italic text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                            Tip: CSS rules must be placed within an "el" target.
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="flex flex-col justify-between w-full min-h-full gap-2">
                        <ButtonPlaceholder @click="type = 'css'" class="w-full h-full">
                            <CodeIcon class="w-4 h-4" /> Custom CSS
                        </ButtonPlaceholder>

                        <ButtonPlaceholder @click="type = 'image'" class="w-full h-full">
                            <UploadCloudIcon class="w-4 h-4" /> Upload an Image
                        </ButtonPlaceholder>
                    </div>
                </template>

                <div
                    v-bind="backgroundAttrs"
                    class="relative flex items-center justify-center w-full overflow-hidden rounded-lg"
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

            <div class="flex justify-between px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                <Button variant="outline" @click="cancel">
                    {{ type ? 'Back' : 'Cancel' }}
                </Button>

                <Button
                    v-if="type"
                    @click="save"
                    :variant="backgroundAttrs ? 'default' : 'secondary'"
                    v-tooltip.bottom="{ content: backgroundAttrs ? null : 'Create a background first.' }"
                >
                    Save
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import 'vue-advanced-cropper/dist/style.css';
import postcss from 'postcss';
import collect from 'collect.js';
import { head, debounce } from 'lodash';
import { useElementSize } from '@vueuse/core';
import { Cropper } from 'vue-advanced-cropper';
import { fileDialog } from 'file-select-dialog';
import useBackgrounds from '@/composables/useBackgrounds';
import { computed, onMounted, ref, watch } from 'vue';
import { CodeIcon, UploadCloudIcon, RefreshCwIcon } from 'lucide-vue-next';

defineProps({
    modelValue: { type: [Boolean, Object], default: false },
    blocks: Array,
    settings: Object,
});
const emit = defineEmits(['update:modelValue', 'cancelled', 'saved']);

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

async function importBackground() {
    reset();
    const files = await fileDialog({ accept: ['.png', '.jpg', '.gif'] });
    const file = head(files);
    if (!file) return;
    const blob = await new Response(file).blob();
    const reader = new FileReader();
    reader.onload = () => (uploadedImage.value = reader.result);
    reader.readAsDataURL(blob);
}

function updateImageDimensions({ canvas }) {
    croppedUploadedImage.value = canvas?.toDataURL('image/jpeg', 0.7);
}

function reset() {
    css.value = defaultCssValue;
    cropper.value?.reset();
    uploadedImage.value = null;
    backgroundAttrs.value = transparentBackground.value;
}

function cancel() {
    reset();
    if (type.value) return (type.value = null);
    emit('cancelled');
}

function save() {
    emit('saved', addCustomBackground(backgroundAttrs.value));
    reset();
}

watch(croppedUploadedImage, (value) => {
    if (type.value !== 'image') return;
    backgroundAttrs.value = {
        style: { backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundImage: `url(${value})` },
    };
});

watch(css, debounce(async (value) => {
    if (type.value !== 'css') return;
    let style = '';
    let attributes = {};
    try {
        const result = await postcss().process(value, { from: undefined });
        result.root.walkRules('el', (rule) => {
            rule.walkDecls((decl) => { attributes[decl.prop] = decl.value; });
        });
    } catch (e) { return; }
    Object.keys(attributes).forEach((attr) => (style += `${attr}:${attributes[attr]};`));
    backgroundAttrs.value = { style: style.replace(/(\r\n|\n|\r)/gm, '') };
}, 500));

watch(monacoWrapperHeight, (value) => (monacoHeight.value = value));

onMounted(reset);
</script>
