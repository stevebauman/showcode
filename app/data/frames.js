export const FRAME_NONE = 'none';

export const FRAME_BROWSERBASE = 'browserbase';
export const FRAME_CLERK = 'clerk';
export const FRAME_CLOUDFLARE = 'cloudflare';
export const FRAME_ELEVENLABS = 'elevenlabs';
export const FRAME_FIRECRAWL = 'firecrawl';
export const FRAME_GEMINI = 'gemini';
export const FRAME_MINTLIFY = 'mintlify';
export const FRAME_NUXT = 'nuxt';
export const FRAME_OPENAI = 'openai';
export const FRAME_PRISMA = 'prisma';
export const FRAME_RESEND = 'resend';
export const FRAME_STRIPE = 'stripe';
export const FRAME_SUPABASE = 'supabase';
export const FRAME_TAILWIND = 'tailwind';
export const FRAME_TRIGGERDEV = 'triggerdev';
export const FRAME_VERCEL = 'vercel';

const DEFAULT_FRAME_SETTINGS = {
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

function frameSettings(frame, settings = {}) {
    const padding = settings.padding ?? DEFAULT_FRAME_SETTINGS.padding;

    return {
        ...DEFAULT_FRAME_SETTINGS,
        frame,
        padding,
        paddingTop: padding,
        paddingBottom: padding,
        paddingLeft: padding,
        paddingRight: padding,
        ...settings,
    };
}

function frame(id, title, settings, preview) {
    return {
        id,
        title,
        settings: frameSettings(id, settings),
        preview,
    };
}

const darkWindow = '#111827';

export default [
    {
        id: FRAME_NONE,
        title: 'None',
        settings: {
            frame: FRAME_NONE,
        },
        preview: {
            background: 'checker',
            window: '#f4f4f5',
            accent: '#a1a1aa',
        },
    },
    frame(
        FRAME_BROWSERBASE,
        'Browserbase',
        {
            showHeader: true,
            showTitle: true,
            showMenu: true,
            borderRadius: 0,
            padding: 32,
        },
        { background: '#080808', window: '#101010', accent: '#ffffff' }
    ),
    frame(
        FRAME_CLERK,
        'Clerk',
        {
            borderRadius: 8,
            padding: 28,
        },
        { background: '#222222', window: '#111111', accent: '#6c47ff' }
    ),
    frame(
        FRAME_CLOUDFLARE,
        'Cloudflare',
        {
            showHeader: true,
            showTitle: true,
            themeName: 'github-dark',
            borderRadius: 0,
            padding: 28,
        },
        { background: '#0c0c0c', window: '#0f0f0f', accent: '#f6821f' }
    ),
    frame(
        FRAME_ELEVENLABS,
        'ElevenLabs',
        {
            borderRadius: 0,
            padding: 34,
        },
        { background: '#111111', window: '#111111', accent: '#ffffff' }
    ),
    frame(
        FRAME_FIRECRAWL,
        'Firecrawl',
        {
            themeName: 'github-dark',
            borderRadius: 0,
            padding: 24,
        },
        { background: '#000000', window: '#111827', accent: '#f97316' }
    ),
    frame(
        FRAME_GEMINI,
        'Gemini',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 26,
            padding: 30,
        },
        { background: '#0e1016', window: '#16181d', accent: '#5c9ec7' }
    ),
    frame(
        FRAME_MINTLIFY,
        'Mintlify',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 12,
            padding: 30,
        },
        { background: '#121212', window: '#070a08', accent: '#55d799' }
    ),
    frame(
        FRAME_NUXT,
        'Nuxt',
        {
            borderRadius: 10,
            padding: 32,
        },
        { background: '#0b0c11', window: '#0b0c11', accent: '#00dc82' }
    ),
    frame(
        FRAME_OPENAI,
        'OpenAI',
        {
            borderRadius: 8,
            padding: 28,
        },
        { background: '#121a29', window: '#232b41', accent: '#7d89a6' }
    ),
    frame(
        FRAME_PRISMA,
        'Prisma',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 10,
            padding: 34,
        },
        {
            background: 'linear-gradient(140deg, #0c1d26, #0a0c17)',
            window: '#0b1020',
            accent: '#31baaf',
        }
    ),
    frame(
        FRAME_RESEND,
        'Resend',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 8,
            padding: 30,
        },
        { background: '#050505', window: 'rgba(0, 0, 0, 0.88)', accent: '#00ccb0' }
    ),
    frame(
        FRAME_STRIPE,
        'Stripe',
        {
            showBorder: true,
            showShadow: true,
            themeName: 'material-ocean',
            borderRadius: 8,
            padding: 20,
            borderColor: {
                red: 15,
                green: 57,
                blue: 94,
                alpha: 1,
            },
        },
        { background: '#0a2540', window: '#0c2e4e', accent: '#11efe3' }
    ),
    frame(
        FRAME_SUPABASE,
        'Supabase',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 6,
            padding: 28,
        },
        { background: '#121212', window: '#171717', accent: '#3ecf8e' }
    ),
    frame(
        FRAME_TAILWIND,
        'Tailwind',
        {
            showHeader: true,
            showMenu: true,
            borderRadius: 8,
            padding: 32,
        },
        { background: '#0f172a', window: '#1e293b', accent: '#38bdf8' }
    ),
    frame(
        FRAME_TRIGGERDEV,
        'Trigger.dev',
        {
            showHeader: true,
            showTitle: true,
            borderRadius: 0,
            padding: 32,
        },
        { background: '#121317', window: '#121317', accent: '#f59e0b' }
    ),
    frame(
        FRAME_VERCEL,
        'Vercel',
        {
            themeName: 'github-dark',
            borderRadius: 0,
            padding: 34,
        },
        { background: '#000000', window: darkWindow, accent: '#ffffff' }
    ),
];
