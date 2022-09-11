<template>
    <div
        v-bind="backgroundAttrs"
        class="flex items-center justify-center w-full h-full p-4"
        :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
    >
        <Window v-if="blocks" preview class="my-6" :blocks="blocks" :settings="settings" />
    </div>
</template>

<script>
import useShiki from '@/composables/useShiki';
import { default as useBackgrounds, DEFAULT_BACKGROUND } from '@/composables/useBackgrounds';
import { ref, reactive, computed, useContext, onMounted, watch } from '@nuxtjs/composition-api';

export default {
    setup() {
        const { $shiki } = useContext();
        const { buildCodeBlocks } = useShiki();
        const { getBackgroundAttrs } = useBackgrounds();

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
            background: DEFAULT_BACKGROUND,
            borderRadius: 16,
            borderRadiusLocked: true,
            fontSize: 16,
            fontFamily: 'font-mono-lisa',
            lineHeight: 20,
            padding: 16,
            width: 500,
            height: 500,
            paddingLocked: true,
            image: null,
            scale: 1.0,
        });

        window.loadSettings = (values) => Object.assign(settings, values);

        const backgroundAttrs = computed(() => getBackgroundAttrs(settings.background));

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

        onMounted(generateTokens);

        watch(settings, generateTokens);

        return { settings, blocks, backgroundAttrs };
    },
};
</script>
