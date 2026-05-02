<template>
    <div class="relative min-h-screen overflow-hidden bg-[#09090b] text-white antialiased">
        <!-- Background Gradients -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div
                class="absolute -left-[10%] -top-[25%] h-[150%] w-[150%] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.15),transparent_40%)]"
            ></div>
            <div
                class="absolute -right-[10%] top-[10%] h-[100%] w-[100%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_40%)]"
            ></div>
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pb-24 sm:pt-24 lg:px-8">
            <!-- Header/Logo -->
            <div class="mb-12 flex justify-center sm:mb-16">
                <Logo class="h-16 w-16 drop-shadow-2xl" />
            </div>

            <!-- Hero Content -->
            <div class="mx-auto max-w-3xl text-center">
                <h1 class="mb-6 text-5xl font-black tracking-tight text-white sm:text-7xl">
                    Design beautiful
                    <br />
                    <span
                        class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    >
                        code screenshots
                    </span>
                </h1>

                <p class="mb-10 mt-6 text-lg leading-8 text-zinc-400 sm:text-xl">
                    Showcode for Desktop gives you the tools to create, edit, and share beautiful
                    code snippets directly from your machine.
                    <strong class="font-semibold text-white">Now completely free.</strong>
                </p>

                <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        as="a"
                        size="lg"
                        class="w-full rounded-full bg-white px-8 py-6 text-lg font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 sm:w-auto"
                        :href="downloadUrl"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="mr-2"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Download for {{ osName }}
                    </Button>

                    <Button
                        as="a"
                        size="lg"
                        variant="secondary"
                        class="w-full rounded-full bg-zinc-800 px-8 py-6 text-lg font-semibold text-white transition-colors hover:bg-zinc-700 sm:w-auto"
                        href="/"
                    >
                        Open Web Version
                    </Button>
                </div>
                <p class="mt-6 text-sm font-medium text-zinc-500">
                    Available for macOS, Windows, and Linux.
                </p>
            </div>

            <!-- Screenshot Placeholder -->
            <div class="relative mx-auto mt-16 max-w-5xl sm:mt-24">
                <div
                    class="rounded-xl border border-white/5 bg-zinc-800/40 p-2 backdrop-blur-3xl lg:rounded-2xl"
                >
                    <div
                        class="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-950/80 shadow-2xl ring-1 ring-white/10 sm:rounded-lg"
                    >
                        <!-- Inside App Placeholder -->
                        <div class="absolute inset-0 z-10 bg-[#1e1e1e]">
                            <img
                                src="~/assets/img/screenshot.png"
                                alt="Showcode App"
                                class="h-full w-full object-cover object-top"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features / Footer simple section -->
            <div class="mt-24 border-t border-white/10 pt-10 text-center">
                <p class="text-sm text-zinc-500">
                    &copy; {{ new Date().getFullYear() }} Showcode. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const osName = ref('Desktop');
const downloadUrl = ref('https://github.com/stevebauman/showcode-app/releases/latest');

onMounted(async () => {
    try {
        const response = await fetch('https://api.github.com/repos/stevebauman/showcode-app/releases/latest');
        const data = await response.json();

        const platform = navigator.userAgent.toLowerCase();
        let assetName = null;
        let isMac = false;

        if (platform.includes('win')) {
            osName.value = 'Windows';
            assetName = '.exe';
        } else if (platform.includes('mac')) {
            osName.value = 'macOS';
            isMac = true;
        } else if (platform.includes('linux')) {
            osName.value = 'Linux';
            assetName = '.AppImage';
        }

        if (data.assets) {
            let asset = null;

            if (isMac) {
                // Find Intel Mac asset (prefer .dmg, fallback to mac.zip)
                asset = data.assets.find(a => a.name.endsWith('.dmg') && !a.name.includes('arm64')) ||
                        data.assets.find(a => a.name.endsWith('mac.zip') && !a.name.includes('arm64'));

                // For Mac, try to detect Apple Silicon specifically if possible, otherwise use standard.
                if (navigator.userAgent.includes('AppleWebKit') && navigator.platform === 'MacIntel') {
                    // In some chromium browsers, `navigator.userAgentData` can indicate arm architecture
                    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
                        navigator.userAgentData.getHighEntropyValues(['architecture']).then(ua => {
                            if (ua.architecture === 'arm') {
                                const armAsset = data.assets.find(a => a.name.endsWith('.dmg') && a.name.includes('arm64')) ||
                                                 data.assets.find(a => a.name.includes('mac-arm64.zip'));
                                if (armAsset) downloadUrl.value = armAsset.browser_download_url;
                            }
                        });
                    }
                }
            } else if (assetName) {
                asset = data.assets.find(a => a.name.endsWith(assetName) && !a.name.includes('arm64'));
            }

            if (asset && (!isMac || !downloadUrl.value.includes('arm64'))) {
                downloadUrl.value = asset.browser_download_url;
            }
        }
    } catch (e) {
        console.error('Failed to fetch latest release', e);
    }
});
</script>
