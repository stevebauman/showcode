<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent :class="type ? 'max-w-4xl' : 'max-w-md'" class="max-h-[80vh] flex flex-col gap-0 p-0">
            <DialogHeader class="px-5 pt-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <DialogTitle class="text-sm font-semibold">
                    {{ !type ? 'Add Custom Background' : type === 'css' ? 'Custom CSS Background' : 'Image Background' }}
                </DialogTitle>
            </DialogHeader>

            <!-- Step 1: Choose type -->
            <div v-if="!type" class="flex flex-col gap-3 p-5">
                <button
                    @click="type = 'css'"
                    class="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
                >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <CodeIcon class="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <div class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Custom CSS</div>
                        <div class="text-xs text-zinc-500 dark:text-zinc-400">Write CSS to create a gradient or pattern</div>
                    </div>
                </button>

                <button
                    @click="type = 'image'"
                    class="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
                >
                    <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <ImageIcon class="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <div class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Upload Image</div>
                        <div class="text-xs text-zinc-500 dark:text-zinc-400">Use a photo or image as the background</div>
                    </div>
                </button>
            </div>

            <!-- Step 2: Create -->
            <div v-else class="flex flex-col gap-4 p-5 min-h-[350px]">
                <!-- Editor area -->
                <template v-if="type === 'image'">
                    <div
                        v-if="uploadedImage"
                        class="relative flex items-center justify-center w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-pattern"
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
                            variant="ghost"
                            @click="reset"
                            class="absolute bottom-2 right-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg"
                        >
                            <RefreshCwIcon class="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <button
                        v-else
                        @click="importBackground"
                        class="flex flex-col items-center justify-center gap-2 w-full h-48 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                        <ImageIcon class="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                        <span class="text-sm text-zinc-500 dark:text-zinc-400">Click to choose an image</span>
                    </button>
                </template>

                <template v-else-if="type === 'css'">
                    <div
                        ref="monacoWrapper"
                        class="relative w-full h-48 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                    >
                        <Monaco :value="css" @update:model-value="css = $event" :width="monacoWrapperWidth" :height="192" language="css" tab-size="2" />
                    </div>

                    <p class="text-[11px] text-zinc-400 dark:text-zinc-500 text-center">
                        CSS rules must be placed within an <code class="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">el</code> selector.
                    </p>
                </template>

                <!-- Live preview -->
                <div
                    v-bind="backgroundAttrs"
                    class="relative flex items-center justify-center w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
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
import { CodeIcon, ImageIcon, RefreshCwIcon } from 'lucide-vue-next';

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

const defaultCssValue = `el {\n  // Enter rules here.\n}`;
const css = ref(defaultCssValue);
const type = ref(null);
const cropper = ref(null);
const monacoWrapper = ref(null);
const uploadedImage = ref(null);
const backgroundAttrs = ref(null);
const croppedUploadedImage = ref(null);

const { width: monacoWrapperWidth } = useElementSize(monacoWrapper);

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

onMounted(reset);
</script>
