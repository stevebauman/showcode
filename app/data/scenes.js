export const SCENE_NONE = 'none';

export const SCENE_BROWSERBASE = 'browserbase';
export const SCENE_CLERK = 'clerk';
export const SCENE_CLOUDFLARE = 'cloudflare';
export const SCENE_ELEVENLABS = 'elevenlabs';
export const SCENE_FIRECRAWL = 'firecrawl';
export const SCENE_GEMINI = 'gemini';
export const SCENE_LARAVEL = 'laravel';
export const SCENE_MINTLIFY = 'mintlify';
export const SCENE_NUXT = 'nuxt';
export const SCENE_OPENAI = 'openai';
export const SCENE_PRISMA = 'prisma';
export const SCENE_RESEND = 'resend';
export const SCENE_STRIPE = 'stripe';
export const SCENE_SUPABASE = 'supabase';
export const SCENE_TAILWIND = 'tailwind';
export const SCENE_TRIGGERDEV = 'triggerdev';
export const SCENE_VERCEL = 'vercel';

function color(hex, alpha = 1) {
    const value = hex.replace('#', '');

    return {
        red: parseInt(value.slice(0, 2), 16),
        green: parseInt(value.slice(2, 4), 16),
        blue: parseInt(value.slice(4, 6), 16),
        alpha,
    };
}

const DEFAULT_SCENE_SETTINGS = {
    background: 'transparent',
    backgroundColor: null,
    themeName: 'material-ocean',
    themeOpacity: 1,
    position: 'center',
    width: 800,
    height: 450,
    aspectRatio: [16, 9],
    lockWindowSize: false,
    lockWindowPaddingX: 224,
    lockWindowPaddingY: 180,
    scale: 1,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    showHeader: false,
    showHeaderAccent: false,
    showTitle: false,
    showMenu: false,
    showColorMenu: false,
    headerTitleColor: color('#9ca3af'),
    showBorder: false,
    showShadow: false,
    borderRadius: 8,
    borderRadiusLocked: true,
    borderWidth: 1,
    borderColor: {
        red: 255,
        green: 255,
        blue: 255,
        alpha: 0.1,
    },
    padding: 24,
    paddingLocked: true,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
};

function sceneSettings(scene, settings = {}) {
    const padding = settings.padding ?? DEFAULT_SCENE_SETTINGS.padding;

    return {
        ...DEFAULT_SCENE_SETTINGS,
        scene,
        padding,
        paddingTop: padding,
        paddingBottom: padding,
        paddingLeft: padding,
        paddingRight: padding,
        ...settings,
    };
}

function scene(id, title, settings, preview) {
    return {
        id,
        title,
        settings: sceneSettings(id, settings),
        preview,
    };
}

const darkWindow = '#111827';

export default [
    {
        id: SCENE_NONE,
        title: 'None',
        settings: {
            scene: SCENE_NONE,
        },
        preview: {
            background: 'checker',
            window: '#f4f4f5',
            accent: '#a1a1aa',
        },
    },
    scene(
        SCENE_BROWSERBASE,
        'Browserbase',
        {
            showHeader: true,
            showTitle: true,
            showMenu: true,
            headerTitleColor: color('#ffffff'),
            themeName: 'github-light',
            borderRadius: 10,
            padding: 32,
        },
        { background: '#f6f1e8', window: '#fffaf3', accent: '#f4511e' }
    ),
    scene(
        SCENE_CLERK,
        'Clerk',
        {
            borderRadius: 8,
            headerTitleColor: color('#bab1ff'),
            padding: 28,
        },
        { background: '#17151f', window: '#111111', accent: '#6c47ff' }
    ),
    scene(
        SCENE_CLOUDFLARE,
        'Cloudflare',
        {
            showHeader: false,
            showTitle: false,
            headerTitleColor: color('#fafafa'),
            themeName: 'github-dark',
            borderRadius: 0,
            padding: 28,
        },
        { background: '#0c0c0c', window: '#0f0f0f', accent: '#f6821f' }
    ),
    scene(
        SCENE_ELEVENLABS,
        'ElevenLabs',
        {
            borderRadius: 0,
            headerTitleColor: color('#ffffff'),
            padding: 34,
        },
        { background: '#111111', window: '#111111', accent: '#ffffff' }
    ),
    scene(
        SCENE_FIRECRAWL,
        'Firecrawl',
        {
            themeName: 'github-dark',
            borderRadius: 0,
            headerTitleColor: color('#f97316'),
            padding: 24,
        },
        { background: '#000000', window: '#111827', accent: '#f97316' }
    ),
    scene(
        SCENE_GEMINI,
        'Gemini',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 26,
            headerTitleColor: color('#d3d3d3'),
            padding: 30,
        },
        { background: '#0e1016', window: '#16181d', accent: '#5c9ec7' }
    ),
    scene(
        SCENE_LARAVEL,
        'Laravel',
        {
            showHeader: true,
            showMenu: true,
            themeName: 'github-dark',
            borderRadius: 12,
            headerTitleColor: color('#ff9b92'),
            padding: 32,
        },
        { background: '#140b0b', window: '#160f0f', accent: '#ff2d20' }
    ),
    scene(
        SCENE_MINTLIFY,
        'Mintlify',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 12,
            headerTitleColor: color('#d6ffeb'),
            padding: 30,
        },
        { background: '#101312', window: '#070a08', accent: '#55d799' }
    ),
    scene(
        SCENE_NUXT,
        'Nuxt',
        {
            borderRadius: 10,
            headerTitleColor: color('#00dc82'),
            padding: 32,
        },
        { background: '#0b0c11', window: '#0b0c11', accent: '#00dc82' }
    ),
    scene(
        SCENE_OPENAI,
        'OpenAI',
        {
            borderRadius: 18,
            headerTitleColor: color('#f5f5f0'),
            padding: 28,
        },
        { background: '#0e0f12', window: '#111111', accent: '#f5f5f0' }
    ),
    scene(
        SCENE_PRISMA,
        'Prisma',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 10,
            headerTitleColor: color('#31baaf'),
            padding: 34,
        },
        {
            background: 'linear-gradient(140deg, #0c1d26, #0a0c17)',
            window: '#0b1020',
            accent: '#31baaf',
        }
    ),
    scene(
        SCENE_RESEND,
        'Resend',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 8,
            headerTitleColor: color('#fafafa'),
            padding: 30,
        },
        { background: '#050505', window: 'rgba(0, 0, 0, 0.88)', accent: '#00ccb0' }
    ),
    scene(
        SCENE_STRIPE,
        'Stripe',
        {
            showBorder: true,
            showShadow: true,
            themeName: 'material-ocean',
            borderRadius: 8,
            headerTitleColor: color('#ffffff'),
            padding: 20,
            borderColor: {
                red: 15,
                green: 57,
                blue: 94,
                alpha: 1,
            },
        },
        { background: '#0a2540', window: '#ffffff', accent: '#ffffff' }
    ),
    scene(
        SCENE_SUPABASE,
        'Supabase',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 6,
            headerTitleColor: color('#fafafa'),
            padding: 28,
        },
        { background: '#0f0f0f', window: '#171717', accent: '#3ecf8e' }
    ),
    scene(
        SCENE_TAILWIND,
        'Tailwind',
        {
            showHeader: true,
            showMenu: true,
            borderRadius: 8,
            headerTitleColor: color('#ffffff'),
            padding: 32,
        },
        { background: '#0f172a', window: '#1e293b', accent: '#38bdf8' }
    ),
    scene(
        SCENE_TRIGGERDEV,
        'Trigger.dev',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 0,
            headerTitleColor: color('#b5b8c0'),
            padding: 32,
        },
        { background: '#121317', window: '#121317', accent: '#f59e0b' }
    ),
    scene(
        SCENE_VERCEL,
        'Vercel',
        {
            themeName: 'github-dark',
            borderRadius: 0,
            headerTitleColor: color('#ffffff'),
            padding: 34,
        },
        { background: '#000000', window: darkWindow, accent: '#ffffff' }
    ),
];
