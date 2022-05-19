<template>
    <div class="relative bg-pattern bg-ui-gray-800">
        <Hotkeys :shortcuts="['S']" @triggered="copyToClipboard" />

        <portal-target name="modal" />

        <div class="absolute z-20 flex items-center justify-between w-full p-4">
            <a href="https://github.com/stevebauman/showcode" target="_blank">
                <Logo class="flex-shrink-0 w-12 h-12" />
            </a>

            <div class="flex flex-wrap items-center justify-center h-10 gap-2">
                <Button
                    size="sm"
                    type="button"
                    class="shadow"
                    dusk="button-copy"
                    variant="secondary"
                    @click.native="copyToClipboard"
                >
                    <CheckCircleIcon v-if="copied" class="w-4 h-4 text-green-400" />
                    <ClipboardIcon v-else class="w-4 h-4" />
                    <span class="hidden sm:inline">
                        {{ copied ? 'Copied!' : 'Copy Image' }}
                    </span>
                </Button>

                <Dropdown
                    size="sm"
                    variant="primary"
                    :items="fileTypes"
                    dusk="button-export"
                    class="inline-flex rounded-lg shadow"
                >
                    <ShareIcon class="w-4 h-4" />
                    <span class="hidden sm:inline"> Export Image </span>
                </Dropdown>

                <Button
                    v-if="!$config.isDesktop && $config.isDistributing"
                    size="sm"
                    href="/buy"
                    class="shadow"
                    target="_blank"
                    variant="primary"
                >
                    <ShoppingBagIcon class="w-4 h-4" />
                    <span class="hidden sm:inline"> Desktop App </span>
                </Button>
            </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center">
            <div ref="preview" class="absolute">
                <div ref="canvas" class="relative flex items-center justify-center">
                    <component
                        v-for="element in project.elements"
                        v-bind="element"
                        :code="code"
                        :languages="languages"
                        :key="element.id"
                        :element="element"
                        :ref="element.name"
                        :is="element.component"
                        @update:element="
                            (attributes) => project.updateElement(element.id, attributes)
                        "
                    />
                </div>
            </div>
        </div>

        <div class="absolute bottom-0 z-20 w-full">
            <div
                class="flex flex-row-reverse flex-wrap items-center justify-between gap-2 p-4 md:flex-row"
            >
                <div class="flex items-stretch flex-shrink-0 gap-2">
                    <Button size="xs" class="shadow" @click.native="resetWindowSize">
                        <MinimizeIcon class="w-4 h-4" />
                        <span class="hidden md:inline">Fit to Window</span>
                    </Button>

                    <Button size="xs" class="shadow" @click.native="resetViewport">
                        <RefreshCwIcon class="w-4 h-4" />
                        <span class="hidden md:inline">Reset Viewport</span>
                    </Button>
                </div>

                <div class="flex flex-col justify-center space-y-2">
                    <div class="justify-center hidden md:flex">
                        <div
                            class="flex items-center justify-center gap-2 rounded-lg shadow bg-ui-gray-700 py-0.5"
                        >
                            <div class="flex items-center">
                                <div class="px-2 text-xs font-semibold text-ui-gray-500">W</div>

                                <Input
                                    size="xs"
                                    type="number"
                                    min="1"
                                    max="5000"
                                    class="text-center appearance-none w-14"
                                    :value="settings.width"
                                    @input="(value) => setWidth(value, true)"
                                />
                            </div>

                            <div><XIcon class="w-3 h-3 text-ui-gray-500" /></div>

                            <div class="flex items-center">
                                <Input
                                    size="xs"
                                    type="number"
                                    min="1"
                                    max="5000"
                                    class="text-center appearance-none w-14"
                                    :value="settings.height"
                                    @input="(value) => setHeight(value)"
                                />

                                <div class="px-2 text-xs font-semibold text-ui-gray-500">H</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            class="justify-center flex-shrink-0 hidden divide-x rounded-lg shadow divide-ui-gray-800 md:flex"
                        >
                            <Button
                                v-for="([x, y], index) in aspectRatios"
                                size="xs"
                                :key="index"
                                :rounded="false"
                                :active="isEqual(settings.aspectRatio, [x, y])"
                                class="justify-center w-16"
                                :class="{ 'rounded-l-lg': index === 0 }"
                                @click.native="setAspectRatio(x, y)"
                            >
                                {{ x }}:{{ y }}
                            </Button>

                            <Button
                                size="xs"
                                :rounded="false"
                                :active="settings.aspectRatio === null"
                                class="justify-center rounded-r-lg"
                                @click.native="settings.aspectRatio = null"
                            >
                                Custom
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center h-full gap-2 px-2 py-1 rounded-lg shadow bg-ui-gray-700"
                >
                    <ZoomOutIcon class="w-4 h-4 text-ui-gray-400" />

                    <Range
                        max="2"
                        min="0.1"
                        step="0.01"
                        class="w-44"
                        :value="zoom"
                        @input="(value) => zoomTo(value)"
                    />

                    <ZoomInIcon class="w-4 h-4 text-ui-gray-400" />
                </div>
            </div>

            <ControlTabs :tabs="elementTabs" #default="{ active }">
                <template v-for="tab in elementTabs">
                    <portal-target v-if="tab.name === active" :key="tab.name" :name="active" />
                </template>
            </ControlTabs>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import download from 'downloadjs';
import { detect } from 'detect-browser';
import * as htmlToImage from 'html-to-image';
import { head, debounce, isEqual } from 'lodash';
import {
    XIcon,
    ZoomInIcon,
    ZoomOutIcon,
    ShareIcon,
    EyeOffIcon,
    MinimizeIcon,
    ClipboardIcon,
    RefreshCwIcon,
    PlusCircleIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
    ExternalLinkIcon,
} from 'vue-feather-icons';
import useShiki from '../composables/useShiki';
import usePanZoom from '../composables/usePanZoom';
import usePreview from '../composables/usePreview';
import useClipboard from '../composables/useClipboard';
import useBackgrounds from '../composables/useBackgrounds';
import useAspectRatios from '../composables/useAspectRatios';
import {
    ref,
    watch,
    toRefs,
    provide,
    nextTick,
    computed,
    onMounted,
    useContext,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';
import usePreferencesStore from '../composables/usePreferencesStore';

export default {
    props: {
        project: {
            type: Object,
            required: true,
        },
        name: {
            type: String,
            required: false,
        },
        code: {
            type: Array,
            required: true,
        },
        defaults: {
            type: Object,
            required: true,
        },
        languages: {
            type: Array,
            required: true,
        },
    },

    components: {
        XIcon,
        ShareIcon,
        ZoomInIcon,
        ZoomOutIcon,
        EyeOffIcon,
        MinimizeIcon,
        RefreshCwIcon,
        ClipboardIcon,
        PlusCircleIcon,
        ShoppingBagIcon,
        CheckCircleIcon,
        ExternalLinkIcon,
    },

    setup(props, context) {
        const object = ref(null);
        const preview = ref(null);
        const canvas = ref(null);
        const blocks = ref([]);
        const exportAs = ref('png');
        const resizing = ref(false);
        const backgroundButtons = ref([]);
        const showingBackgroundsModal = ref(false);

        const { $bus, $queue } = useContext();

        const { buildCodeBlocks } = useShiki();

        const { copy, copied } = useClipboard();

        const preferences = usePreferencesStore();

        const { zoom, zoomTo, createPanZoom, resetViewport } = usePanZoom({
            startY: -150,
            cursor: 'grab',
            excludeClass: 'exclude-from-panzoom',
        });

        const { backgrounds, getBackgroundAttrs, deleteCustomBackground } = useBackgrounds();

        const { name, code, languages } = toRefs(props);

        const { settings, setDefaultBackground, ...restOfPreview } = usePreview(props, context);

        const { title, image, background, themeName, themeType, themeOpacity, themeBackground } =
            toRefs(settings);

        const generateTokens = () => {
            $queue.push(async () => {
                await buildCodeBlocks(
                    {
                        code: code.value,
                        languages: languages.value,
                        theme: themeName.value,
                        opacity: themeOpacity.value,
                    },
                    ({ blocks: code, themeType: type, themeBackground: bg }) => {
                        blocks.value = code;
                        themeType.value = type;
                        themeBackground.value = bg;
                    }
                );
            });
        };

        const generateImageFromPreview = async (method, pixelRatio = 3) => {
            const filter = (node) => !(node.dataset && node.dataset.hasOwnProperty('hide'));

            return await htmlToImage[method](canvas.value, {
                filter,
                pixelRatio,
            });
        };

        const generateTemplateImage = async () => {
            try {
                const jpg = await generateImageFromPreview('toJpeg', 0.5);

                image.value = jpg;
            } catch (e) {
                console.error('Unable to generate template image.');
            }
        };

        const scrollSelectedThemeIntoView = () =>
            scrollRefIntoView(`button-theme-${themeName.value}`);

        const scrollSelectedBackgroundIntoView = () =>
            scrollRefIntoView(`button-background-${background.value}`);

        const scrollRefIntoView = (ref) => {
            const component = head(context.refs[ref] ?? []);

            if (!component) {
                return;
            }

            const el = component instanceof Vue ? component.$el : component;

            el.scrollIntoView({
                block: 'nearest',
                inline: 'center',
            });
        };

        const controlTabChanged = (tab) => {
            if (tab === 'backgrounds') {
                return nextTick(scrollSelectedBackgroundIntoView);
            }

            if (tab === 'themes') {
                return nextTick(scrollSelectedThemeIntoView);
            }
        };

        const saveAs = (method) => {
            const extension = {
                toPng: 'png',
                toJpeg: 'jpg',
                toSvg: 'svg',
            }[method];

            generateImageFromPreview(method, preferences.exportPixelRatio).then((dataUrl) => {
                const filename = name.value || title.value || 'Untitled-1';

                download(dataUrl, `${filename}.${extension}`);
            });
        };

        const copyToClipboard = () => {
            const browser = detect();

            const promise = generateImageFromPreview('toBlob', preferences.exportPixelRatio);

            switch (browser && browser.name) {
                case 'safari':
                    return copy(promise);
                case 'firefox':
                    return typeof ClipboardItem !== 'undefined'
                        ? promise.then(copy)
                        : $bus.$emit(
                              'alert',
                              'danger',
                              'In order to copy images to the clipboard, Showcode.app needs access to the ClipboardItem web API, which is not accessible in Firefox. Please use the "Export" button instead.'
                          );
                default:
                    return promise.then(copy);
            }
        };

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

        const fileTypes = computed(() => [
            {
                name: 'png',
                title: 'PNG',
                click: () => saveAs('toPng'),
            },
            {
                name: 'jpg',
                title: 'JPEG',
                click: () => saveAs('toJpeg'),
            },
            {
                name: 'svg',
                title: 'HTML',
                click: () => saveAs('toSvg'),
            },
        ]);

        const backgroundAttrs = computed(() => getBackgroundAttrs(background.value));

        let templateGenerationDebounce = null;

        watch(settings, (values) => context.emit('update:settings', values));

        onMounted(() => {
            nextTick(() => createPanZoom(preview));

            generateTokens();
            generateTemplateImage();

            // Our code will change quickly. We will make
            // sure to debounce the token generation
            // so performance doesn't take a hit.
            watch(code, debounce(generateTokens, 500));

            watch([languages, themeName, themeOpacity], generateTokens);

            watch(
                () => [settings, code],
                (templateGenerationDebounce = debounce(generateTemplateImage, 5000)),
                { deep: true }
            );
        });

        onBeforeUnmount(() => templateGenerationDebounce?.cancel());

        provide('preview', {
            blocks,
            generateImageFromPreview,
        });

        const elementTabs = computed(() =>
            props.project.elements.map((element) => ({ name: element.id, title: element.title }))
        );

        return {
            object,
            zoom,
            isEqual,
            canvas,
            preview,
            settings,
            fileTypes,
            copied,
            copyToClipboard,
            blocks,
            zoomTo,
            exportAs,
            resizing,
            backgrounds,
            resetViewport,
            backgroundAttrs,
            deleteBackground,
            backgroundButtons,
            controlTabChanged,
            showingBackgroundsModal,
            updateWithCustomBackground,
            elementTabs,
            ...restOfPreview,
            ...useAspectRatios(),
        };
    },
};
</script>
