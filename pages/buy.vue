<template>
    <div
        class="min-h-screen pb-8 antialiased bg-gradient-to-tl from-gray-900 via-gray-800 to-gray-700 sm:pb-12 lg:pb-12"
    >
        <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
            <div
                class="max-w-md px-4 mx-auto sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24"
            >
                <div>
                    <div>
                        <Logo class="w-14 h-14" />
                    </div>

                    <div class="mt-20 space-y-6">
                        <div class="mt-6 sm:max-w-xl">
                            <h1
                                class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
                            >
                                Design

                                <span
                                    class="text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-indigo-500"
                                >
                                    beautiful
                                </span>

                                <br />

                                code screenshots
                            </h1>

                            <p class="mt-6 text-lg font-semibold text-gray-200">
                                Showcode gives you the tools to design<br />
                                beautiful code screenshots that you'll love to share.
                            </p>
                        </div>

                        <div class="h-0.5 bg-gray-500 rounded-xl"></div>

                        <div>
                            <div class="flex">
                                <p
                                    class="my-0 ml-0 mr-2 text-3xl font-bold leading-9 text-white line-through opacity-50"
                                >
                                    $25.99
                                </p>

                                <p
                                    class="m-0 text-4xl font-black tracking-tight text-white selection:leading-10"
                                >
                                    US$19.99
                                </p>
                            </div>

                            <p class="text-sm text-gray-400">
                                One time purchase. Free updates forever. <br />
                                Available for macOS, Windows, and Linux.
                            </p>
                        </div>

                        <div class="mt-6">
                            <Button size="lg" class="px-6 font-semibold" href="/">
                                View Web Version
                            </Button>

                            <Button
                                size="lg"
                                variant="primary"
                                class="px-6 font-semibold"
                                href="https://checkout.unlock.sh/showcode"
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
                            class="absolute inset-y-0 w-screen bg-gray-700 left-1/2 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full"
                        ></div>

                        <svg
                            class="absolute -mr-3 top-8 right-1/2 lg:-m-4 lg:left-0"
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
                        class="relative flex items-center justify-center mx-auto lg:max-w-none lg:h-full lg:pl-12"
                    >
                        <canvas
                            ref="gradient"
                            class="absolute inset-0 w-full h-full rounded-2xl lg:rounded-l-2xl lg:rounded-r-none"
                        ></canvas>

                        <div class="transform scale-75 sm:scale-100">
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

<script>
import Granim from 'granim';
import chroma from 'chroma-js';
import { GithubIcon } from 'vue-feather-icons';
import { range, random, sample } from 'lodash';
import useShiki from '../composables/useShiki';
import {
    ref,
    watch,
    reactive,
    useContext,
    onMounted,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';

export default {
    components: { GithubIcon },

    setup() {
        const { $shiki } = useContext();
        const { buildCodeBlocks } = useShiki();

        const gradient = ref(null);
        const interval = ref(null);
        const granim = ref(null);
        const blocks = ref(null);

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
            fontSize: 16,
            fontFamily: 'font-mono-lisa',
            lineHeight: 20,
            padding: 16,
            image: null,
            scale: 1.0,
        });

        const generateTokens = async () => {
            await buildCodeBlocks(
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
        };

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

            interval.value = setInterval(setRandomTheme, 5000);

            granim.value = new Granim({
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
            granim.value?.destroy();
            clearInterval(interval.value);
        });

        return { settings, blocks, gradient };
    },
};
</script>
