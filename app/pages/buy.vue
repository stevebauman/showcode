<template>
    <div
        class="dark min-h-screen bg-gradient-to-tl from-gray-900 via-gray-800 to-gray-700 pb-8 antialiased sm:pb-12 lg:pb-12"
    >
        <div class="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-48">
            <div
                class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8"
            >
                <div>
                    <div>
                        <Logo class="h-14 w-14" />
                    </div>

                    <div class="mt-20 space-y-6">
                        <div class="mt-6 sm:max-w-xl">
                            <h1
                                class="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
                            >
                                Design

                                <span
                                    class="bg-gradient-to-br from-purple-300 to-indigo-500 bg-clip-text text-transparent"
                                >
                                    beautiful
                                </span>

                                <br />

                                code screenshots
                            </h1>

                            <p class="mt-6 text-lg font-semibold text-gray-200">
                                Showcode gives you the tools to design
                                <br />
                                beautiful code screenshots that you'll love to share.
                            </p>
                        </div>

                        <div class="h-0.5 rounded-xl bg-gray-500"></div>

                        <div>
                            <div class="mt-1 flex items-center">
                                <p
                                    class="relative m-0 text-4xl font-black tracking-tight text-white"
                                >
                                    $20
                                </p>
                            </div>

                            <p class="text-sm text-gray-400">
                                <strong class="text-gray-300">
                                    Lifetime License. Free updates forever.
                                </strong>

                                <br />

                                Available for macOS, Windows, and Linux.
                            </p>

                            <a
                                href="https://anystack.sh/download/showcode"
                                class="text-sm text-zinc-800 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            >
                                Download the App
                            </a>
                        </div>

                        <div class="space-x-2">
                            <Button
                                as="a"
                                size="lg"
                                variant="secondary"
                                class="px-6 font-semibold"
                                href="/"
                            >
                                View Web Version
                            </Button>

                            <Button
                                as="a"
                                size="lg"
                                variant="default"
                                class="px-6 font-semibold"
                                href="https://checkout.anystack.sh/showcode"
                            >
                                Buy Desktop App
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-4 sm:mx-auto sm:max-w-3xl">
                <div
                    class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
                >
                    <div class="hidden sm:block">
                        <div
                            class="absolute inset-y-0 left-1/2 w-screen rounded-l-3xl bg-gray-700 lg:left-80 lg:right-0 lg:w-full"
                        ></div>

                        <svg
                            class="absolute right-1/2 top-8 -mr-3 lg:left-0 lg:-m-4"
                            width="404"
                            height="392"
                            fill="none"
                            viewBox="0 0 404 392"
                        >
                            <defs>
                                <pattern
                                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                                    x="0"
                                    y="0"
                                    width="20"
                                    height="20"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect
                                        x="0"
                                        y="0"
                                        width="4"
                                        height="4"
                                        class="text-gray-500"
                                        fill="currentColor"
                                    />
                                </pattern>
                            </defs>

                            <rect
                                width="404"
                                height="392"
                                fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                            />
                        </svg>
                    </div>

                    <div
                        class="relative mx-auto flex items-center justify-center lg:h-full lg:max-w-none lg:pl-12"
                    >
                        <canvas
                            ref="gradient"
                            class="absolute inset-0 h-full w-full rounded-2xl lg:rounded-l-2xl lg:rounded-r-none"
                        ></canvas>

                        <div class="scale-75 transform sm:scale-100">
                            <Window
                                v-if="blocks"
                                preview
                                class="my-6"
                                :blocks="blocks"
                                :settings="settings"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Granim from 'granim';
import chroma from 'chroma-js';
import { range, random, sample } from 'lodash';
import useShiki from '@/composables/useShiki';
import { ref, watch, reactive, onMounted, onBeforeUnmount } from 'vue';

const { $shiki } = useNuxtApp();
const { buildCodeBlocks } = useShiki();

const gradient = ref(null);
const blocks = ref(null);

let granimInstance = null;
let interval = null;

const settings = reactive({
    showHeader: true,
    showTitle: true,
    showShadow: true,
    showMenu: true,
    showColorMenu: false,
    showLineNumbers: true,
    title: 'Beautiful Code Screenshots',
    themeType: 'light',
    themeOpacity: 1.0,
    themeName: 'github-light',
    themeBackground: '#fff',
    aspectRatio: null,
    borderRadius: 16,
    borderRadiusLocked: true,
    borderColor: {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1,
    },
    fontSize: 16,
    fontFamily: 'font-mono-lisa',
    lineHeight: 20,
    padding: 16,
    paddingLocked: true,
    image: null,
    scale: 1.0,
});

const generateTokens = () =>
    buildCodeBlocks(
        {
            code: [
                {
                    id: '1',
                    value: `class UserController extends Controller
{
    public function index()
    {
        return view('users.index', [
            'users' => User::paginate(),
        ]);
    }
}`,
                },
                {
                    id: '2',
                    value: `@foreach($users as $user)
    <tr>
        <td>{{ $user->name }}</td>
        <td>{{ $user->email }}</td>
    </tr>
@endforeach`,
                },
            ],
            languages: [
                { id: '1', name: 'php' },
                { id: '2', name: 'blade' },
            ],
            theme: settings.themeName,
        },
        ({ blocks: code, themeType: type, themeBackground: background }) => {
            blocks.value = code;
            settings.themeType = type;
            settings.themeBackground = background;
        }
    );

const generateGradients = () => {
    return [...range(0, random(10, 20))].map(() => [
        chroma.random().hex(),
        chroma.random().hex(),
    ]);
};

const setRandomTheme = () => (settings.themeName = sample($shiki.themes()));

onMounted(() => {
    setRandomTheme();
    generateTokens();

    interval = setInterval(setRandomTheme, 5000);

    granimInstance = new Granim({
        element: gradient.value,
        name: 'granim',
        opacity: [1, 2],
        states: {
            'default-state': {
                gradients: generateGradients(),
                transitionSpeed: 2000,
            },
        },
    });

    watch(() => settings.themeName, generateTokens);
});

onBeforeUnmount(() => {
    granimInstance?.destroy();
    clearInterval(interval);
});
</script>
