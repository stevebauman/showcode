<template>
    <VDropdown class="flex justify-center">
        <slot :alpha="alphaColor" :solid="solidColor" />

        <template #popper>
            <div class="w-56 bg-zinc-100 p-2 dark:bg-zinc-900">
                <!-- Saturation/Brightness Picker -->
                <div
                    ref="saturationArea"
                    class="relative h-32 w-full cursor-crosshair overflow-hidden rounded-md"
                    :style="{ backgroundColor: hueColor }"
                    @mousedown="onSaturationMouseDown"
                >
                    <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div
                        class="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                        :style="{ left: `${saturation}%`, top: `${100 - brightness}%` }"
                    />
                </div>

                <!-- Hue Slider -->
                <div class="mt-2">
                    <div
                        ref="hueSlider"
                        class="hue-gradient relative h-3 cursor-pointer overflow-hidden rounded-md"
                        @mousedown="onHueMouseDown"
                    >
                        <div
                            class="absolute h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white shadow-md"
                            :style="{ left: `${(hue / 360) * 100}%`, backgroundColor: hueColor }"
                        />
                    </div>
                </div>

                <!-- Alpha Slider -->
                <div class="mt-2">
                    <div
                        ref="alphaSlider"
                        class="alpha-checkerboard relative h-3 cursor-pointer overflow-hidden rounded-md"
                        @mousedown="onAlphaMouseDown"
                    >
                        <div
                            class="absolute inset-0"
                            :style="{
                                background: `linear-gradient(to right, transparent, ${solidColor})`,
                            }"
                        />
                        <div
                            class="absolute h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white shadow-md"
                            :style="{ left: `${alpha * 100}%`, backgroundColor: alphaColor }"
                        />
                    </div>
                </div>

                <!-- RGBA Inputs -->
                <div class="mt-2 flex gap-1">
                    <div class="flex flex-1 flex-col items-center">
                        <input
                            type="number"
                            min="0"
                            max="255"
                            :value="rgba.red"
                            @input="updateChannel('red', $event)"
                            class="w-full rounded-md border-0 bg-zinc-200 px-1 py-1 text-center text-xs text-zinc-800 hover:bg-white focus:outline-hidden focus:ring-0 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-black"
                        />
                        <span class="mt-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            R
                        </span>
                    </div>
                    <div class="flex flex-1 flex-col items-center">
                        <input
                            type="number"
                            min="0"
                            max="255"
                            :value="rgba.green"
                            @input="updateChannel('green', $event)"
                            class="w-full rounded-md border-0 bg-zinc-200 px-1 py-1 text-center text-xs text-zinc-800 hover:bg-white focus:outline-hidden focus:ring-0 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-black"
                        />
                        <span class="mt-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            G
                        </span>
                    </div>
                    <div class="flex flex-1 flex-col items-center">
                        <input
                            type="number"
                            min="0"
                            max="255"
                            :value="rgba.blue"
                            @input="updateChannel('blue', $event)"
                            class="w-full rounded-md border-0 bg-zinc-200 px-1 py-1 text-center text-xs text-zinc-800 hover:bg-white focus:outline-hidden focus:ring-0 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-black"
                        />
                        <span class="mt-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            B
                        </span>
                    </div>
                    <div class="flex flex-1 flex-col items-center">
                        <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            :value="rgba.alpha.toFixed(2)"
                            @input="updateChannel('alpha', $event)"
                            class="w-full rounded-md border-0 bg-zinc-200 px-1 py-1 text-center text-xs text-zinc-800 hover:bg-white focus:outline-hidden focus:ring-0 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-black"
                        />
                        <span class="mt-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            A
                        </span>
                    </div>
                </div>
            </div>

            <slot name="popover" :alpha="alphaColor" :solid="solidColor" />
        </template>
    </VDropdown>
</template>

<style>
.hue-gradient {
    background: linear-gradient(
        to right,
        #ff0000 0%,
        #ffff00 17%,
        #00ff00 33%,
        #00ffff 50%,
        #0000ff 67%,
        #ff00ff 83%,
        #ff0000 100%
    );
}

.alpha-checkerboard {
    background-image:
        linear-gradient(45deg, #808080 25%, transparent 25%),
        linear-gradient(-45deg, #808080 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #808080 75%),
        linear-gradient(-45deg, transparent 75%, #808080 75%);
    background-size: 8px 8px;
    background-position:
        0 0,
        0 4px,
        4px -4px,
        -4px 0px;
}
</style>

<script setup>
import { ref, computed, watch } from 'vue';
import { Dropdown as VDropdown } from 'floating-vue';

const props = defineProps({
    value: { type: Object, required: false },
});

const emit = defineEmits(['change']);

const saturationArea = ref(null);
const hueSlider = ref(null);
const alphaSlider = ref(null);

const hue = ref(0);
const saturation = ref(100);
const brightness = ref(100);
const alpha = ref(1);

const rgba = computed(() => props.value ?? { red: 0, green: 0, blue: 0, alpha: 1 });
const solidColor = computed(
    () => `rgb(${rgba.value.red}, ${rgba.value.green}, ${rgba.value.blue})`
);
const alphaColor = computed(
    () => `rgba(${rgba.value.red}, ${rgba.value.green}, ${rgba.value.blue}, ${rgba.value.alpha})`
);
const hueColor = computed(() => `hsl(${hue.value}, 100%, 50%)`);

// Convert RGB to HSB
function rgbToHsb(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, b: v * 100 };
}

// Convert HSB to RGB
function hsbToRgb(h, s, b) {
    h /= 360;
    s /= 100;
    b /= 100;

    let r, g, bl;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = b * (1 - s);
    const q = b * (1 - f * s);
    const t = b * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = b;
            g = t;
            bl = p;
            break;
        case 1:
            r = q;
            g = b;
            bl = p;
            break;
        case 2:
            r = p;
            g = b;
            bl = t;
            break;
        case 3:
            r = p;
            g = q;
            bl = b;
            break;
        case 4:
            r = t;
            g = p;
            bl = b;
            break;
        case 5:
            r = b;
            g = p;
            bl = q;
            break;
    }

    return {
        red: Math.round(r * 255),
        green: Math.round(g * 255),
        blue: Math.round(bl * 255),
    };
}

// Sync internal HSB state from prop value
watch(
    rgba,
    (val) => {
        const hsb = rgbToHsb(val.red, val.green, val.blue);
        // Only update hue if saturation/brightness are non-zero (avoid hue jump on black/white)
        if (hsb.s > 0 && hsb.b > 0) {
            hue.value = hsb.h;
        }
        saturation.value = hsb.s;
        brightness.value = hsb.b;
        alpha.value = val.alpha;
    },
    { immediate: true }
);

function emitColor() {
    const rgb = hsbToRgb(hue.value, saturation.value, brightness.value);
    emit('change', { ...rgb, alpha: alpha.value });
}

function onSaturationMouseDown(e) {
    updateSaturation(e);
    document.addEventListener('mousemove', updateSaturation);
    document.addEventListener(
        'mouseup',
        () => {
            document.removeEventListener('mousemove', updateSaturation);
        },
        { once: true }
    );
}

function updateSaturation(e) {
    if (!saturationArea.value) return;
    const rect = saturationArea.value.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    saturation.value = (x / rect.width) * 100;
    brightness.value = 100 - (y / rect.height) * 100;
    emitColor();
}

function onHueMouseDown(e) {
    updateHue(e);
    document.addEventListener('mousemove', updateHue);
    document.addEventListener(
        'mouseup',
        () => {
            document.removeEventListener('mousemove', updateHue);
        },
        { once: true }
    );
}

function updateHue(e) {
    if (!hueSlider.value) return;
    const rect = hueSlider.value.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    hue.value = (x / rect.width) * 360;
    emitColor();
}

function onAlphaMouseDown(e) {
    updateAlpha(e);
    document.addEventListener('mousemove', updateAlpha);
    document.addEventListener(
        'mouseup',
        () => {
            document.removeEventListener('mousemove', updateAlpha);
        },
        { once: true }
    );
}

function updateAlpha(e) {
    if (!alphaSlider.value) return;
    const rect = alphaSlider.value.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    alpha.value = Math.round((x / rect.width) * 100) / 100;
    emitColor();
}

function updateChannel(channel, event) {
    let val = parseFloat(event.target.value);
    if (isNaN(val)) return;

    if (channel === 'alpha') {
        val = Math.max(0, Math.min(1, val));
    } else {
        val = Math.max(0, Math.min(255, Math.round(val)));
    }

    emit('change', { ...rgba.value, [channel]: val });
}
</script>
