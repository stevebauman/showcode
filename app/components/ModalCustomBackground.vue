<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent
            :class="type ? 'max-w-4xl' : 'max-w-md'"
            class="flex max-h-[80vh] flex-col gap-0 p-0"
        >
            <DialogHeader
                class="shrink-0 border-b border-zinc-200 px-5 pb-3 pt-4 dark:border-zinc-800"
            >
                <DialogTitle class="text-sm font-semibold">
                    {{
                        !type
                            ? 'Add Custom Background'
                            : type === 'css'
                              ? 'Custom CSS Background'
                              : 'Image Background'
                    }}
                </DialogTitle>
            </DialogHeader>

            <!-- Step 1: Choose type -->
            <div v-if="!type" class="flex flex-col gap-3 p-5">
                <button
                    @click="type = 'css'"
                    class="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                >
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800"
                    >
                        <CodeIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <div class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Custom CSS
                        </div>
                        <div class="text-xs text-zinc-500 dark:text-zinc-400">
                            Write CSS to create a gradient or pattern
                        </div>
                    </div>
                </button>

                <button
                    @click="type = 'image'"
                    class="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                >
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800"
                    >
                        <ImageIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <div class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Upload Image
                        </div>
                        <div class="text-xs text-zinc-500 dark:text-zinc-400">
                            Use a photo or image as the background
                        </div>
                    </div>
                </button>
            </div>

            <!-- Step 2: Create -->
            <div v-else class="flex min-h-[350px] flex-col gap-4 p-5">
                <!-- Editor area -->
                <template v-if="type === 'image'">
                    <div
                        v-if="uploadedImage"
                        class="bg-pattern relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                    >
                        <Cropper
                            ref="cropper"
                            class="w-full"
                            @change="updateImageDimensions"
                            :src="uploadedImage"
                            :stencil-props="{
                                handlersClasses: { default: 'rounded-full shadow-sm' },
                            }"
                            :style="{
                                width: `${settings.width}px`,
                                height: `${settings.height}px`,
                            }"
                        />

                        <Button
                            size="sm"
                            variant="ghost"
                            @click="reset"
                            class="absolute bottom-2 right-2 rounded-xl border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
                        >
                            <RefreshCwIcon class="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <button
                        v-else
                        @click="importBackground"
                        class="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
                    >
                        <ImageIcon class="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                        <span class="text-sm text-zinc-500 dark:text-zinc-400">
                            Click to choose an image
                        </span>
                    </button>
                </template>

                <template v-else-if="type === 'css'">
                    <div
                        ref="monacoWrapper"
                        class="relative h-48 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                    >
                        <Monaco
                            :value="css"
                            @update:model-value="css = $event"
                            :width="monacoWrapperWidth"
                            :height="192"
                            language="css"
                            tab-size="2"
                        />
                    </div>

                    <p class="text-center text-[11px] text-zinc-400 dark:text-zinc-500">
                        CSS rules must be placed within an
                        <code
                            class="rounded bg-zinc-100 px-1 py-0.5 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                            el
                        </code>
                        selector.
                    </p>
                </template>

                <!-- Live preview -->
                <div
                    v-bind="backgroundAttrs"
                    class="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                >
                    <div
                        v-bind="backgroundAttrs"
                        class="flex h-full w-full items-center justify-center p-4"
                        :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
                    >
                        <Window class="z-10" preview :blocks="blocks" :settings="settings" />
                    </div>
                </div>
            </div>

            <div
                class="flex shrink-0 justify-between border-t border-zinc-200 px-5 py-3 dark:border-zinc-800"
            >
                <Button variant="outline" @click="cancel">
                    {{ type ? 'Back' : 'Cancel' }}
                </Button>

                <Button
                    v-if="type"
                    @click="save"
                    :variant="backgroundAttrs ? 'default' : 'secondary'"
                    v-tooltip.bottom="{
                        content: backgroundAttrs ? null : 'Create a background first.',
                    }"
                >
                    Save
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import 'vue-advanced-cropper/dist/style.css';
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
        style: {
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${value})`,
        },
    };
});

watch(
    css,
    debounce(async (value) => {
        if (type.value !== 'css') return;
        let style = '';
        let attributes = {};
        try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(value);
            for (const rule of sheet.cssRules) {
                if (rule.selectorText === 'el') {
                    for (let i = 0; i < rule.style.length; i++) {
                        const prop = rule.style[i];
                        attributes[prop] = rule.style.getPropertyValue(prop);
                    }
                }
            }
        } catch (e) {
            return;
        }
        Object.keys(attributes).forEach((attr) => (style += `${attr}:${attributes[attr]};`));
        backgroundAttrs.value = { style: style.replace(/(\r\n|\n|\r)/gm, '') };
    }, 500)
);

onMounted(reset);
</script>
