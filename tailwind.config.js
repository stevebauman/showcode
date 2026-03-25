import colors from 'tailwindcss/colors';
import forms from '@tailwindcss/forms';
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
    content: [
        'app/data/*.js',
        'safelist.txt',
        'app/pages/**/*.vue',
        'app/components/**/*.vue',
        'app/composables/**/*.js',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                'mono-lisa': 'MonoLisa',
                'mono-geist': 'GeistMono',
                'mono-jetbrains': 'JetbrainsMono',
            },
            cursor: {
                'resize-width': 'ew-resize',
                'resize-height': 'ns-resize',
            },
            colors: {
                sky: colors.sky,
                teal: colors.teal,
                rose: colors.rose,
                violet: colors.violet,
                orange: colors.orange,
                amber: colors.amber,
                lime: colors.lime,
                emerald: colors.emerald,
                teal: colors.teal,
                cyan: colors.cyan,
                sky: colors.sky,
                violet: colors.violet,
                purple: colors.purple,
                fuchsia: colors.fuchsia,
                rose: colors.rose,
                'blue-gray': colors.slate,
                'cool-gray': colors.gray,
                'true-gray': colors.neutral,
                'warm-gray': colors.stone,
            },
            backgroundImage: {
                conic: 'conic-gradient(var(--tw-gradient-stops))',
                'conic-to-t': 'conic-gradient(at top, var(--tw-gradient-stops))',
                'conic-to-b': 'conic-gradient(at bottom, var(--tw-gradient-stops))',
                'conic-to-l': 'conic-gradient(at left, var(--tw-gradient-stops))',
                'conic-to-r': 'conic-gradient(at right, var(--tw-gradient-stops))',
                'conic-to-tl': 'conic-gradient(at top left, var(--tw-gradient-stops))',
                'conic-to-tr': 'conic-gradient(at top right, var(--tw-gradient-stops))',
                'conic-to-bl': 'conic-gradient(at bottom left, var(--tw-gradient-stops))',
                'conic-to-br': 'conic-gradient(at bottom right, var(--tw-gradient-stops))',
                radial: 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
                'radial-at-t': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
                'radial-at-b': 'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
                'radial-at-l': 'radial-gradient(ellipse at left, var(--tw-gradient-stops))',
                'radial-at-r': 'radial-gradient(ellipse at right, var(--tw-gradient-stops))',
                'radial-at-tl': 'radial-gradient(ellipse at top left, var(--tw-gradient-stops))',
                'radial-at-tr': 'radial-gradient(ellipse at top right, var(--tw-gradient-stops))',
                'radial-at-bl': 'radial-gradient(ellipse at bottom left, var(--tw-gradient-stops))',
                'radial-at-br':
                    'radial-gradient(ellipse at bottom right, var(--tw-gradient-stops))',
            },
            rotate: {
                135: '135deg',
                '-135': '-135deg',
            },
            scale: {
                200: '2',
            },
        },
    },
    plugins: [forms, scrollbarHide],
};
