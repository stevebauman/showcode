<template>
    <Dialog :open="!!modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent
            class="flex h-[560px] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[900px] flex-col gap-0 overflow-hidden p-0"
        >
            <Tabs v-model="type" :unmount-on-hide="false" class="flex min-h-0 flex-1 flex-col">
                <DialogHeader class="shrink-0 px-5 pt-4 pb-4">
                    <DialogTitle class="text-sm font-medium">Custom background</DialogTitle>
                    <DialogDescription class="sr-only">
                        Create a CSS background or upload and crop an image. Preview it with your
                        code before adding it.
                    </DialogDescription>
                    <TabsList aria-label="Background source" class="bg-ui-canvas mt-4 w-fit">
                        <TabsTrigger value="css" class="gap-2">
                            <CodeIcon class="size-3.5" />
                            CSS
                        </TabsTrigger>
                        <TabsTrigger value="image" class="gap-2">
                            <ImageIcon class="size-3.5" />
                            Image
                        </TabsTrigger>
                    </TabsList>
                </DialogHeader>

                <div class="background-workspace min-h-0 flex-1">
                    <div
                        class="background-controls min-h-0"
                        :class="{ 'background-controls-css': type === 'css' }"
                    >
                        <TabsContent value="css" class="m-0 flex h-full min-h-0 flex-col gap-3">
                            <div
                                class="flex h-8 shrink-0 items-center gap-1"
                                aria-label="CSS starters"
                            >
                                <Button
                                    v-for="preset in presets"
                                    :key="preset.name"
                                    variant="ghost"
                                    size="sm"
                                    @click="css = preset.css"
                                >
                                    {{ preset.name }}
                                </Button>
                            </div>
                            <div
                                ref="monacoWrapper"
                                class="background-editor rounded-control border-ui-line min-h-0 flex-1 border"
                            >
                                <Monaco
                                    compact
                                    :value="css"
                                    @update:model-value="css = $event"
                                    :width="monacoWidth"
                                    :height="monacoHeight"
                                    language="css"
                                    :tab-size="2"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="image" class="m-0 flex flex-col gap-4">
                            <div
                                v-if="uploadedImage"
                                class="rounded-control border-ui-line flex items-center gap-3 border p-3"
                            >
                                <img
                                    :src="uploadedImage.src"
                                    alt=""
                                    class="rounded-control size-12 shrink-0 object-cover"
                                />
                                <div class="min-w-0 flex-1">
                                    <p
                                        class="text-ui-text truncate text-xs"
                                        :title="uploadedImage.name"
                                    >
                                        {{ uploadedImage.name }}
                                    </p>
                                    <p class="text-ui-muted mt-1 text-xs tabular-nums">
                                        {{ uploadedImage.width }} × {{ uploadedImage.height }}
                                    </p>
                                </div>
                            </div>
                            <button
                                v-else
                                class="background-dropzone rounded-control flex min-h-44 w-full flex-col items-center justify-center gap-3 border border-dashed px-4 py-6"
                                @click="importBackground"
                                @dragover.prevent
                                @drop.prevent="dropImage"
                            >
                                <UploadIcon class="size-6" />
                                <span class="text-ui-text text-xs">Drop an image here</span>
                                <span class="text-xs">or choose a file</span>
                            </button>
                            <div class="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    :disabled="imageLoading"
                                    @click="importBackground"
                                >
                                    <ImageIcon class="size-3.5" />
                                    {{ uploadedImage ? 'Replace image' : 'Choose image' }}
                                </Button>
                                <Button
                                    v-if="uploadedImage && editingImage"
                                    variant="ghost"
                                    @click="cropper?.reset()"
                                >
                                    <RefreshCwIcon class="size-3.5" />
                                    Reset crop
                                </Button>
                            </div>
                            <p class="text-ui-muted text-xs leading-relaxed">
                                Drag to position your image and resize the crop. Transparency is
                                preserved.
                            </p>
                            <p v-if="imageLoading" role="status" class="text-ui-muted text-xs">
                                Loading image…
                            </p>
                            <p
                                v-if="imageError"
                                role="alert"
                                class="text-xs text-red-500 dark:text-red-400"
                            >
                                {{ imageError }}
                            </p>
                        </TabsContent>
                    </div>

                    <section class="background-preview min-h-0" aria-label="Background preview">
                        <div class="flex h-8 shrink-0 items-center justify-between gap-2">
                            <span class="text-ui-muted text-xs">
                                {{ isCropping ? 'Adjust crop' : 'Preview' }}
                            </span>
                            <Button
                                v-if="type === 'image' && uploadedImage"
                                variant="ghost"
                                size="sm"
                                :disabled="!cropReady || imageLoading"
                                @click="toggleCrop"
                            >
                                <CropIcon class="size-3.5" />
                                {{ editingImage ? 'Done' : 'Edit crop' }}
                            </Button>
                        </div>
                        <div
                            ref="previewViewport"
                            class="background-preview-viewport bg-ui-canvas relative min-h-0 flex-1 overflow-hidden rounded-xl"
                        >
                            <Cropper
                                v-if="uploadedImage"
                                v-show="isCropping"
                                ref="cropper"
                                class="absolute inset-0 size-full"
                                :src="uploadedImage.src"
                                :stencil-props="{
                                    aspectRatio: canvasWidth / canvasHeight,
                                    handlersClasses: { default: 'rounded-full shadow-xs' },
                                }"
                                @change="cropReady = !!$event.canvas"
                                @error="imageError = 'This image could not be opened.'"
                            />
                            <div
                                v-show="!isCropping"
                                class="background-artwork absolute top-1/2 left-1/2 overflow-hidden rounded-xl"
                                :style="{
                                    width: `${canvasWidth}px`,
                                    height: `${canvasHeight}px`,
                                    transform: `translate(-50%, -50%) scale(${previewScale})`,
                                }"
                            >
                                <div class="background-checkerboard absolute inset-0" />
                                <Canvas
                                    preview
                                    class="relative"
                                    :width="canvasWidth"
                                    :height="canvasHeight"
                                    :position="settings.position"
                                    background="custom"
                                    :background-attributes="backgroundAttrs"
                                    :theme-type="settings.themeType"
                                >
                                    <Window
                                        preview
                                        class="z-10 shrink-0"
                                        :blocks="blocks"
                                        :settings="previewSettings"
                                    />
                                </Canvas>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="background-captions shrink-0">
                    <div class="space-y-1">
                        <template v-if="type === 'css'">
                            <p class="text-ui-muted text-xs leading-4">
                                Style the
                                <code class="text-ui-text">el</code>
                                selector. Changes appear in the preview.
                            </p>
                            <p
                                v-if="cssResult.error"
                                role="alert"
                                class="text-xs leading-4 text-red-500 dark:text-red-400"
                            >
                                {{ cssResult.error }}
                            </p>
                        </template>
                    </div>
                    <p class="text-ui-muted text-center text-[11px] leading-4 tabular-nums">
                        {{ canvasWidth }} × {{ canvasHeight }}
                    </p>
                </div>

                <div class="flex shrink-0 items-center justify-between gap-3 px-5 py-4">
                    <Button variant="ghost" @click="cancel">Cancel</Button>
                    <Button :disabled="!canSave" @click="save">Add background</Button>
                </div>
            </Tabs>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import 'vue-advanced-cropper/dist/style.css';
import { useElementSize } from '@vueuse/core';
import { Cropper } from 'vue-advanced-cropper';
import { computed, nextTick, ref, watch } from 'vue';
import { CodeIcon, CropIcon, ImageIcon, RefreshCwIcon, UploadIcon } from 'lucide-vue-next';
import useFileDialogs from '@/composables/useFileDialogs';
import useBackgrounds from '@/composables/useBackgrounds';

const props = defineProps({
    modelValue: { type: [Boolean, Object], default: false },
    blocks: Array,
    settings: Object,
});
const emit = defineEmits(['update:modelValue', 'cancelled', 'saved']);
const { addCustomBackground } = useBackgrounds();
const { openFile } = useFileDialogs();

const presets = [
    {
        name: 'Gradient',
        css: `el {
  background: linear-gradient(
    135deg,
    #312e81,
    #0f172a 70%
  );
}`,
    },
    {
        name: 'Mesh',
        css: `el {
  background:
    radial-gradient(
      at 15% 20%,
      #818cf8, transparent 55%
    ),
    radial-gradient(
      at 85% 80%,
      #c084fc, transparent 55%
    ),
    #0f172a;
}`,
    },
    {
        name: 'Pattern',
        css: `el {
  background-color: #18181b;
  background-image:
    radial-gradient(
      #52525b 1px,
      transparent 1px
    );
  background-size: 16px 16px;
}`,
    },
];
const css = ref(presets[0].css);
const type = ref('css');
const cropper = ref(null);
const monacoWrapper = ref(null);
const previewViewport = ref(null);
const uploadedImage = ref(null);
const croppedImage = ref(null);
const editingImage = ref(false);
const cropReady = ref(false);
const imageLoading = ref(false);
const imageError = ref('');
let imageRevision = 0;

const { width: monacoWidth, height: monacoHeight } = useElementSize(monacoWrapper);
const { width: previewWidth, height: previewHeight } = useElementSize(previewViewport);
const canvasWidth = computed(() => Number(props.settings.width));
const canvasHeight = computed(() => Number(props.settings.height));
const previewSettings = computed(() => ({ ...props.settings, scene: 'none' }));
const isCropping = computed(
    () => type.value === 'image' && editingImage.value && !!uploadedImage.value
);
const previewScale = computed(() =>
    Math.max(
        0,
        Math.min(
            (previewWidth.value - 40) / canvasWidth.value,
            (previewHeight.value - 40) / canvasHeight.value,
            1
        )
    )
);

const cssResult = computed(() => {
    if (!props.modelValue) return { attributes: null, error: '' };

    try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css.value);
        const rules = Array.from(sheet.cssRules).filter((rule) => rule.selectorText === 'el');
        const style = rules.map((rule) => rule.style.cssText).join(' ');
        if (style) return { attributes: { style }, error: '' };
    } catch {
        return { attributes: null, error: 'Check your CSS for a syntax error.' };
    }

    return { attributes: null, error: 'Add valid CSS declarations inside el { … }.' };
});
const backgroundAttrs = computed(() =>
    type.value === 'css' ? (cssResult.value.attributes ?? {}) : imageAttributes()
);
const canSave = computed(() =>
    type.value === 'css'
        ? !!cssResult.value.attributes
        : !!uploadedImage.value &&
          !imageLoading.value &&
          !imageError.value &&
          (!editingImage.value || cropReady.value)
);

function imageAttributes() {
    const image = croppedImage.value ?? uploadedImage.value?.src;
    return image
        ? {
              style: {
                  backgroundImage: `url(${image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
              },
          }
        : {};
}

async function importBackground() {
    const revision = imageRevision;
    const file = await openFile('background');
    if (file && revision === imageRevision && props.modelValue) await loadImage(file);
}

function dropImage(event) {
    const file = event.dataTransfer.files[0];
    if (file) loadImage(file);
}

async function loadImage(file) {
    const revision = ++imageRevision;
    imageLoading.value = true;
    imageError.value = '';

    try {
        if (file.type && !file.type.startsWith('image/')) throw new Error('Invalid image');
        const src = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const image = new Image();
        image.src = src;
        await image.decode();
        if (revision !== imageRevision || !props.modelValue) return;

        uploadedImage.value = {
            src,
            name: file.name,
            width: image.naturalWidth,
            height: image.naturalHeight,
        };
        croppedImage.value = null;
        cropReady.value = false;
        editingImage.value = true;
    } catch {
        if (revision === imageRevision)
            imageError.value = 'Choose a valid PNG, JPEG, WebP, or GIF image.';
    } finally {
        if (revision === imageRevision) imageLoading.value = false;
    }
}

function applyCrop() {
    const { canvas } = cropper.value.getResult();
    croppedImage.value = canvas.toDataURL('image/png');
}

function toggleCrop() {
    if (editingImage.value) applyCrop();
    editingImage.value = !editingImage.value;
}

function cancel() {
    emit('update:modelValue', false);
    emit('cancelled');
}

function save() {
    if (!canSave.value) return;
    if (type.value === 'image' && editingImage.value) applyCrop();
    emit('saved', addCustomBackground(backgroundAttrs.value));
}

watch(
    () => props.modelValue,
    (open) => {
        imageRevision++;
        if (!open) return;
        type.value = 'css';
        css.value = presets[0].css;
        uploadedImage.value = null;
        croppedImage.value = null;
        editingImage.value = false;
        cropReady.value = false;
        imageLoading.value = false;
        imageError.value = '';
    },
    { immediate: true }
);

watch(isCropping, async (cropping) => {
    if (cropping) {
        await nextTick();
        cropper.value?.refresh();
    }
});
</script>

<style scoped>
.background-workspace,
.background-captions {
    display: grid;
    grid-template-columns: minmax(240px, 0.85fr) minmax(0, 1.15fr);
    padding: 0 20px;
    gap: 20px;
}
.background-workspace {
    height: 400px;
}
.background-captions {
    padding-top: 12px;
}
.background-controls {
    overflow-y: auto;
}
.background-controls-css {
    overflow: visible;
}
.background-editor {
    min-height: 180px;
    background: var(--ui-canvas);
}
.background-editor :deep(.monaco-editor),
.background-editor :deep(.monaco-editor-background),
.background-editor :deep(.margin) {
    border-radius: var(--radius-control);
}
.background-preview {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.background-dropzone {
    color: var(--ui-muted);
    border-color: var(--ui-line);
    background: var(--ui-canvas);
    transition:
        border-color 120ms ease,
        background-color 120ms ease;
}
.background-dropzone:hover {
    border-color: var(--ui-focus);
    background: var(--ui-hover);
}
.background-dropzone:focus-visible {
    outline: 2px solid var(--ui-focus);
    outline-offset: 2px;
}
.background-checkerboard {
    background-color: var(--ui-panel);
    background-image: conic-gradient(
        var(--ui-line) 25%,
        transparent 0 50%,
        var(--ui-line) 0 75%,
        transparent 0
    );
    background-size: 16px 16px;
}
.background-preview-viewport :deep(.vue-advanced-cropper) {
    background: var(--ui-canvas);
}
@media (max-width: 640px) {
    .background-captions {
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
    }
    .background-workspace {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        height: auto;
    }
    .background-controls {
        flex: none;
        overflow: visible;
    }
    .background-editor {
        height: 220px;
        flex: none;
    }
    .background-preview {
        min-height: 280px;
        flex: none;
    }
}
</style>
