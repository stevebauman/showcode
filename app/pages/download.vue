<template>
    <div class="download-page">
        <a href="#download-content" class="download-skip-link">Skip to content</a>

        <header class="download-nav">
            <NuxtLink to="/" class="download-brand" aria-label="Showcode home">
                <Logo class="h-6 w-8" aria-hidden="true" />
                <span>Showcode</span>
            </NuxtLink>

            <nav aria-label="Main navigation" class="flex items-center gap-6">
                <a href="https://github.com/stevebauman/showcode" class="download-nav-link">
                    GitHub
                </a>
                <NuxtLink to="/" class="download-nav-link inline-flex items-center gap-1.5">
                    Open in browser
                    <ArrowUpRightIcon class="size-4" aria-hidden="true" />
                </NuxtLink>
            </nav>
        </header>

        <main id="download-content">
            <section class="download-hero" aria-labelledby="download-title">
                <div class="download-release">
                    <span class="download-release-dot" aria-hidden="true"></span>
                    Introducing Showcode 3.0
                </div>
                <h1 id="download-title">
                    Completely
                    <br class="sm:hidden" />
                    <span>redesigned.</span>
                </h1>
                <p class="download-intro">
                    Beautiful code screenshots, with a workspace to match.
                    <br class="hidden sm:block" />
                    A fresh look. Thoughtful controls. More room to create.
                </p>

                <div class="download-actions">
                    <a :href="downloadUrl" class="download-button download-button-primary">
                        <DownloadIcon class="size-4" aria-hidden="true" />
                        Download for {{ osName }}
                    </a>
                    <NuxtLink to="/" class="download-button download-button-secondary">
                        Try in your browser
                        <ArrowUpRightIcon class="size-4" aria-hidden="true" />
                    </NuxtLink>
                </div>
                <p class="download-availability">
                    Free for macOS, Windows &amp; Linux.
                    <a href="https://github.com/stevebauman/showcode-app/releases/latest">
                        All downloads
                        <span aria-hidden="true">↗</span>
                    </a>
                </p>

                <figure class="download-workspace">
                    <div class="download-workspace-frame">
                        <img
                            src="/images/download/workspace-v3@2x.png"
                            srcset="
                                /images/download/workspace-v3.png    1x,
                                /images/download/workspace-v3@2x.png 2x
                            "
                            alt="Showcode 3.0 with its code editor, a purple code screenshot canvas, floating toolbars, and style inspector"
                            width="1280"
                            height="720"
                            fetchpriority="high"
                            class="block h-auto w-full"
                        />
                    </div>
                    <figcaption>A familiar workspace. A fresh perspective.</figcaption>
                </figure>
            </section>

            <section class="download-features" aria-labelledby="features-title">
                <div class="download-section-heading">
                    <p class="download-eyebrow">DESIGNED AROUND YOUR CODE</p>
                    <h2 id="features-title">
                        Less in the way.
                        <br />
                        More at your fingertips.
                    </h2>
                </div>
                <div class="download-feature-grid">
                    <article class="download-feature">
                        <PanelsTopLeftIcon class="download-feature-icon" aria-hidden="true" />
                        <h3>A workspace that fits</h3>
                        <p>
                            Arrange your editor and preview your way. Tuck panels away when you want
                            a little more room.
                        </p>
                    </article>
                    <article class="download-feature">
                        <PaletteIcon class="download-feature-icon" aria-hidden="true" />
                        <h3>Make every detail yours</h3>
                        <p>
                            Find your theme, choose a backdrop, and fine-tune the details with
                            clear, considered controls.
                        </p>
                    </article>
                    <article class="download-feature">
                        <CopyIcon class="download-feature-icon" aria-hidden="true" />
                        <h3>Ready when you are</h3>
                        <p>
                            Frame the perfect shot, then copy or export it. Everything you need,
                            right there on the canvas.
                        </p>
                    </article>
                </div>
            </section>

            <section class="download-closing" aria-labelledby="closing-title">
                <div>
                    <p class="download-eyebrow">YOURS TO CREATE</p>
                    <h2 id="closing-title">Give your code a better frame.</h2>
                    <p>Free for macOS, Windows, and Linux.</p>
                </div>
                <a :href="downloadUrl" class="download-button download-button-primary">
                    <DownloadIcon class="size-4" aria-hidden="true" />
                    Download for {{ osName }}
                </a>
            </section>
        </main>

        <footer class="download-footer">
            <p>&copy; {{ new Date().getFullYear() }} Showcode</p>
            <a href="https://github.com/stevebauman/showcode-app/releases/latest">Release notes</a>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { UAParser } from 'ua-parser-js';
import { isAppleSilicon } from 'ua-parser-js/device-detection';
import {
    ArrowUpRightIcon,
    CopyIcon,
    DownloadIcon,
    PaletteIcon,
    PanelsTopLeftIcon,
} from 'lucide-vue-next';

useHead({ titleTemplate: '%s' });

useSeoMeta({
    title: 'Download Showcode — Completely Redesigned',
    description:
        'Meet Showcode 3.0. A redesigned workspace for beautiful code screenshots, with floating controls, themes, and backdrops. Free for macOS, Windows, and Linux.',
    ogTitle: 'Showcode 3.0 — Completely Redesigned',
    ogDescription:
        'Beautiful code screenshots, with a workspace to match. Download Showcode for macOS, Windows, and Linux.',
    twitterCard: 'summary_large_image',
});

const osName = ref('Desktop');
const downloadUrl = ref('https://github.com/stevebauman/showcode-app/releases/latest');

onMounted(async () => {
    try {
        const response = await fetch(
            'https://api.github.com/repos/stevebauman/showcode-app/releases/latest'
        );

        const data = await response.json();

        if (!data.assets) {
            return;
        }

        const platform = navigator.userAgent.toLowerCase();

        if (platform.includes('win')) {
            osName.value = 'Windows';

            const asset = data.assets.find(
                (a) => a.name.endsWith('.exe') && !a.name.includes('arm64')
            );

            if (asset) {
                downloadUrl.value = asset.browser_download_url;
            }

            return;
        }

        if (platform.includes('linux')) {
            osName.value = 'Linux';

            const asset = data.assets.find(
                (a) => a.name.endsWith('.AppImage') && !a.name.includes('arm64')
            );

            if (asset) {
                downloadUrl.value = asset.browser_download_url;
            }

            return;
        }

        if (platform.includes('mac')) {
            osName.value = 'macOS';

            const result = await new UAParser().getResult().withClientHints();
            const arm = isAppleSilicon(result);

            const asset = arm
                ? data.assets.find((a) => a.name.endsWith('.dmg') && a.name.includes('arm64')) ||
                  data.assets.find((a) => a.name.includes('mac-arm64.zip'))
                : data.assets.find((a) => a.name.endsWith('.dmg') && a.name.includes('x64')) ||
                  data.assets.find((a) => a.name.endsWith('.dmg') && !a.name.includes('arm64'));

            if (asset) {
                downloadUrl.value = asset.browser_download_url;
            }
        }
    } catch (e) {
        console.error('Failed to fetch latest release', e);
    }
});
</script>

<style scoped>
.download-page {
    min-height: 100vh;
    overflow: hidden;
    color: #f4f4f5;
    background: #101013;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
}
.download-page a {
    transition:
        color 150ms,
        background-color 150ms,
        border-color 150ms,
        box-shadow 150ms;
}
.download-page a:focus-visible {
    outline: 2px solid #b6a0ee;
    outline-offset: 5px;
}
.download-skip-link {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    padding: 12px 18px;
    border-radius: 8px;
    background: white;
    color: #101013;
    transform: translateY(-160%);
}
.download-skip-link:focus {
    transform: none;
}
.download-nav,
.download-footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: min(1200px, calc(100% - 64px));
    margin-inline: auto;
}
.download-nav {
    height: 92px;
}
.download-brand {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    font-size: 19px;
    font-weight: 550;
    letter-spacing: -0.6px;
}
.download-nav-link {
    color: #aaa9b3;
    font-size: 13px;
}
.download-nav-link:hover {
    color: #fff;
}
.download-hero {
    position: relative;
    isolation: isolate;
    padding: 56px 24px 0;
    text-align: center;
}
.download-hero::before,
.download-hero::after {
    position: absolute;
    z-index: -1;
    pointer-events: none;
    content: '';
}
.download-hero::before {
    inset: 0 -25% 0;
    background:
        radial-gradient(ellipse at 46% 38%, #7250bb20, transparent 38%),
        radial-gradient(ellipse at 80% 70%, #6b41a826, transparent 35%),
        radial-gradient(ellipse at 18% 68%, #415da924, transparent 32%);
}
.download-hero::after {
    top: 470px;
    left: 50%;
    width: min(940px, 90%);
    height: 360px;
    transform: translateX(-50%);
    border-radius: 50%;
    background: #8060c42b;
    filter: blur(100px);
}
.download-release {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid #d3c2ff1c;
    border-radius: 999px;
    background: #bca1f708;
    color: #c8bbdf;
    font-size: 12px;
    letter-spacing: 0.15px;
}
.download-release-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #b79be8;
    box-shadow: 0 0 12px #b79be866;
}
.download-hero h1 {
    margin: 25px 0 21px;
    font-size: clamp(52px, 6.6vw, 88px);
    line-height: 1.04;
    font-weight: 550;
    letter-spacing: -0.05em;
}
.download-hero h1 span {
    color: #bab4ca;
    background: linear-gradient(115deg, #d9d3e2 10%, #a98fcb 80%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.download-intro {
    max-width: 560px;
    margin: 0 auto;
    color: #a5a3ad;
    font-size: 16px;
    line-height: 1.8;
    text-wrap: pretty;
}
.download-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 28px;
}
.download-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 46px;
    padding: 12px 21px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 550;
    line-height: 20px;
}
.download-button-primary {
    color: #17151c;
    background: #f2eef7;
    box-shadow:
        0 2px 8px #0002,
        inset 0 1px 0 #fff;
}
.download-button-primary:hover {
    background: #fff;
    box-shadow: 0 0 24px #cbb8ef26;
}
.download-button-secondary {
    border-color: #ffffff12;
    background: #ffffff05;
    color: #d1ced8;
}
.download-button-secondary:hover {
    border-color: #ffffff26;
    background: #ffffff0c;
}
.download-availability {
    margin-top: 18px;
    font-size: 11px;
    line-height: 1.8;
    color: #7f7c89;
}
.download-availability a {
    margin-left: 8px;
    color: #a8a0b7;
    white-space: nowrap;
}
.download-availability a:hover {
    color: #e5dcee;
}
.download-workspace {
    max-width: 1120px;
    margin: 54px auto 0;
}
.download-workspace-frame {
    overflow: hidden;
    border: 1px solid #ffffff24;
    border-radius: 14px;
    background: #191919;
    box-shadow:
        0 32px 100px #0006,
        0 0 0 5px #ffffff03;
}
.download-workspace figcaption {
    margin-top: 20px;
    font-size: 12px;
    color: #777380;
}
.download-features {
    max-width: 1120px;
    margin: 115px auto 0;
    padding: 0 24px;
}
.download-section-heading {
    text-align: center;
}
.download-eyebrow {
    color: #a28dbf;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
}
.download-section-heading h2 {
    margin-top: 18px;
    font-size: clamp(30px, 4vw, 42px);
    line-height: 1.2;
    letter-spacing: -1.7px;
    font-weight: 500;
}
.download-feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 38px;
}
.download-feature {
    padding: 28px;
    border: 1px solid #ffffff0d;
    border-radius: 16px;
    background: linear-gradient(140deg, #ffffff06, #ffffff01);
}
.download-feature-icon {
    width: 21px;
    height: 21px;
    color: #b9a2d8;
    stroke-width: 1.4;
}
.download-feature h3 {
    margin-top: 24px;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.3px;
}
.download-feature p {
    margin-top: 10px;
    color: #8d8997;
    font-size: 13px;
    line-height: 1.8;
}
.download-closing {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    max-width: 1072px;
    margin: 96px auto 0;
    padding: 42px 0;
    border-top: 1px solid #ffffff0e;
    border-bottom: 1px solid #ffffff0e;
}
.download-closing h2 {
    margin-top: 12px;
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 500;
    letter-spacing: -1px;
}
.download-closing p:not(.download-eyebrow) {
    margin-top: 10px;
    font-size: 13px;
    color: #8d8997;
}
.download-closing .download-button {
    flex-shrink: 0;
}
.download-footer {
    padding: 28px 0;
    color: #6f6b78;
    font-size: 11px;
}
.download-footer a:hover {
    color: #d1ced8;
}
@media (max-width: 767px) {
    .download-nav,
    .download-footer {
        width: calc(100% - 40px);
    }
    .download-nav {
        height: 76px;
    }
    .download-nav nav {
        gap: 18px;
    }
    .download-hero {
        padding: 38px 20px 0;
    }
    .download-hero h1 {
        margin-top: 24px;
    }
    .download-intro {
        max-width: 340px;
        font-size: 14px;
    }
    .download-workspace {
        margin-top: 40px;
    }
    .download-workspace-frame {
        border-radius: 8px;
    }
    .download-features {
        margin-top: 76px;
        padding: 0 20px;
    }
    .download-feature-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-top: 28px;
    }
    .download-feature {
        padding: 24px;
    }
    .download-feature h3 {
        margin-top: 16px;
    }
    .download-closing {
        flex-direction: column;
        align-items: flex-start;
        margin: 64px 20px 0;
        padding: 32px 0;
    }
}
@media (max-width: 420px) {
    .download-actions {
        flex-direction: column;
        align-items: stretch;
    }
    .download-hero h1 {
        font-size: 49px;
    }
    .download-availability a {
        display: block;
        margin: 3px 0 0;
    }
}
@media (prefers-reduced-motion: reduce) {
    .download-page a {
        transition: none;
    }
}
</style>
