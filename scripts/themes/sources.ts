export interface ThemeSource {
    /**
     * The theme ID used as the filename and identifier.
     */
    name: string;

    /**
     * GitHub blob URL pointing to the theme JSON file.
     */
    source: string;

    /**
     * Theme type. If omitted, will be auto-detected.
     */
    type?: 'dark' | 'light';

    /**
     * VS Code Marketplace reference for themes distributed via extensions.
     *
     * The `name` is the publisher.extId (e.g. 'wesbos.theme-cobalt2').
     * The `path` is the file path inside the VSIX zip
     * (e.g. 'extension/themes/cobalt2.json').
     */
    marketplace?: {
        name: string;
        path: string;
    };
}

/**
 * Themes sourced directly from GitHub repositories.
 */
export const githubSources: ThemeSource[] = [
    {
        name: 'bluloco-light',
        source: 'https://github.com/uloco/theme-bluloco-light/blob/main/themes/bluloco-light-color-theme.json',
        type: 'light',
    },
    {
        name: 'min-dark',
        source: 'https://github.com/misolori/min-theme/blob/master/themes/min-dark.json',
    },
    {
        name: 'min-light',
        source: 'https://github.com/misolori/min-theme/blob/master/themes/min-light.json',
        type: 'light',
    },
    {
        name: 'nord',
        source: 'https://github.com/arcticicestudio/nord-visual-studio-code/blob/develop/themes/nord-color-theme.json',
    },
    {
        name: 'poimandres',
        source: 'https://github.com/drcmda/poimandres-theme/blob/main/themes/poimandres-color-theme.json',
    },
    {
        name: 'rose-pine',
        source: 'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-color-theme.json',
    },
    {
        name: 'rose-pine-dawn',
        source: 'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-dawn-color-theme.json',
        type: 'light',
    },
    {
        name: 'rose-pine-moon',
        source: 'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-moon-color-theme.json',
    },
    {
        name: 'slack-dark',
        source: 'https://github.com/slack-theme/visual-studio-code/blob/master/themes/dark-mode.json',
    },
    {
        name: 'slack-ochin',
        source: 'https://github.com/slack-theme/visual-studio-code/blob/master/themes/ochin.json',
        type: 'light',
    },
    {
        name: 'tailwind-dark',
        source: 'https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/assets/tailwind/dark.json',
    },
    {
        name: 'tailwind-light',
        source: 'https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/assets/tailwind/light.json',
        type: 'light',
    },
];

/**
 * Themes sourced from VS Code Marketplace extensions.
 *
 * Some themes have a compilation step and do not include
 * the built theme on GitHub, so we pull from the
 * VS Code marketplace instead.
 */
export const marketplaceSources: ThemeSource[] = [
    {
        name: 'brackets-light-pro',
        source: 'https://marketplace.visualstudio.com/items?itemName=fehey.brackets-light-pro',
        type: 'light',
        marketplace: {
            name: 'fehey.brackets-light-pro',
            path: 'extension/themes/Brackets Light Pro-color-theme.json',
        },
    },
    {
        name: 'cobalt2',
        source: 'https://marketplace.visualstudio.com/items?itemName=wesbos.theme-cobalt2',
        marketplace: {
            name: 'wesbos.theme-cobalt2',
            path: 'extension/theme/cobalt2.json',
        },
    },
    {
        name: 'dracula',
        source: 'https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula',
        marketplace: {
            name: 'dracula-theme.theme-dracula',
            path: 'extension/theme/dracula.json',
        },
    },
    {
        name: 'dracula-soft',
        source: 'https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula',
        marketplace: {
            name: 'dracula-theme.theme-dracula',
            path: 'extension/theme/dracula-soft.json',
        },
    },
    {
        name: 'github-dark',
        source: 'https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme',
        marketplace: {
            name: 'GitHub.github-vscode-theme',
            path: 'extension/themes/dark-default.json',
        },
    },
    {
        name: 'github-dark-dimmed',
        source: 'https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme',
        marketplace: {
            name: 'GitHub.github-vscode-theme',
            path: 'extension/themes/dark-dimmed.json',
        },
    },
    {
        name: 'github-light',
        source: 'https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme',
        type: 'light',
        marketplace: {
            name: 'GitHub.github-vscode-theme',
            path: 'extension/themes/light-default.json',
        },
    },
    {
        name: 'material-darker',
        source: 'https://marketplace.visualstudio.com/items?itemName=equinusocio.vsc-material-theme',
        marketplace: {
            name: 'equinusocio.vsc-material-theme',
            path: 'extension/build/themes/Material-Theme-Darker.json',
        },
    },
    {
        name: 'material-default',
        source: 'https://marketplace.visualstudio.com/items?itemName=equinusocio.vsc-material-theme',
        marketplace: {
            name: 'equinusocio.vsc-material-theme',
            path: 'extension/build/themes/Material-Theme-Default.json',
        },
    },
    {
        name: 'material-lighter',
        source: 'https://marketplace.visualstudio.com/items?itemName=equinusocio.vsc-material-theme',
        type: 'light',
        marketplace: {
            name: 'equinusocio.vsc-material-theme',
            path: 'extension/build/themes/Material-Theme-Lighter.json',
        },
    },
    {
        name: 'material-ocean',
        source: 'https://marketplace.visualstudio.com/items?itemName=equinusocio.vsc-material-theme',
        marketplace: {
            name: 'equinusocio.vsc-material-theme',
            path: 'extension/build/themes/Material-Theme-Ocean.json',
        },
    },
    {
        name: 'material-palenight',
        source: 'https://marketplace.visualstudio.com/items?itemName=equinusocio.vsc-material-theme',
        marketplace: {
            name: 'equinusocio.vsc-material-theme',
            path: 'extension/build/themes/Material-Theme-Palenight.json',
        },
    },
    {
        name: 'one-dark',
        source: 'https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark',
        marketplace: {
            name: 'akamud.vscode-theme-onedark',
            path: 'extension/themes/OneDark.json',
        },
    },
    {
        name: 'one-dark-pro',
        source: 'https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.material-theme',
        marketplace: {
            name: 'zhuangtongfa.material-theme',
            path: 'extension/themes/OneDark-Pro.json',
        },
    },
    {
        name: 'one-light',
        source: 'https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onelight',
        type: 'light',
        marketplace: {
            name: 'akamud.vscode-theme-onelight',
            path: 'extension/themes/OneLight.json',
        },
    },
    {
        name: 'rajoyish',
        source: 'https://marketplace.visualstudio.com/items?itemName=RajeshBudhathoki.rajoyish',
        marketplace: {
            name: 'RajeshBudhathoki.rajoyish',
            path: 'extension/themes/Rajoyish-color-theme.json',
        },
    },
    {
        name: 'synthwave-84',
        source: 'https://marketplace.visualstudio.com/items?itemName=RobbOwen.synthwave-vscode',
        marketplace: {
            name: 'RobbOwen.synthwave-vscode',
            path: 'extension/themes/synthwave-color-theme.json',
        },
    },
    {
        name: 'synthwave-80s',
        source: 'https://marketplace.visualstudio.com/items?itemName=sanchodelniglo.synthwave-80s-color-theme',
        marketplace: {
            name: 'sanchodelniglo.synthwave-80s-color-theme',
            path: 'extension/themes/synthwave-80s-blue.json',
        },
    },
    {
        name: 'synthwave-x',
        source: 'https://marketplace.visualstudio.com/items?itemName=OhaiHFO.synthwave-x-fluoromachine-avant-noir',
        marketplace: {
            name: 'OhaiHFO.synthwave-x-fluoromachine-avant-noir',
            path: 'extension/themes/synthwave-x-fluoromachine-avant-noir.json',
        },
    },
    {
        name: 'vitesse-dark',
        source: 'https://marketplace.visualstudio.com/items?itemName=antfu.theme-vitesse',
        marketplace: {
            name: 'antfu.theme-vitesse',
            path: 'extension/themes/vitesse-dark.json',
        },
    },
    {
        name: 'vitesse-light',
        source: 'https://marketplace.visualstudio.com/items?itemName=antfu.theme-vitesse',
        type: 'light',
        marketplace: {
            name: 'antfu.theme-vitesse',
            path: 'extension/themes/vitesse-light.json',
        },
    },
];

/**
 * All theme sources combined.
 */
export const sources: ThemeSource[] = [...githubSources, ...marketplaceSources];
