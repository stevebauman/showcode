<template>
    <div
        class="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a2540]"
        aria-hidden="true"
    >
        <div class="showcode-stripe-background">
            <div class="showcode-stripe-gridline-container" :style="containerStyle">
                <div
                    v-for="line in 5"
                    :key="`stripe-background-${line}`"
                    class="showcode-stripe-gridline"
                ></div>
            </div>
        </div>

        <div class="showcode-stripe-band">
            <div class="showcode-stripe-gridline-container" :style="containerStyle">
                <div
                    v-for="line in 5"
                    :key="`stripe-band-${line}`"
                    class="showcode-stripe-gridline"
                ></div>

                <div class="showcode-stripe-set" :class="{ 'is-small': frameHeight < 240 }">
                    <div class="showcode-stripe-layer-1"></div>
                    <div class="showcode-stripe-layer-2"></div>
                    <div class="showcode-stripe-intersection"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    windowWidth: { type: Number, default: 0 },
    frameHeight: { type: Number, required: true },
});

const containerStyle = computed(() => ({
    '--window-width': `${Math.max(props.windowWidth, 1)}px`,
}));
</script>

<style scoped>
.showcode-stripe-background {
    position: absolute;
    inset: 0;
}

.showcode-stripe-gridline-container {
    position: relative;
    width: var(--window-width);
    height: 100%;
    margin: 0 auto;
}

.showcode-stripe-gridline {
    position: absolute;
    z-index: 1;
    width: 1px;
    height: 100%;
    border-left: 1px dashed rgba(255, 255, 255, 0.1);
    pointer-events: none;
}

.showcode-stripe-gridline:nth-child(1) {
    left: 0;
    border-style: solid;
}

.showcode-stripe-gridline:nth-child(2) {
    left: 25%;
}

.showcode-stripe-gridline:nth-child(3) {
    left: 50%;
}

.showcode-stripe-gridline:nth-child(4) {
    left: 75%;
}

.showcode-stripe-gridline:nth-child(5) {
    left: calc(100% - 1px);
    border-style: solid;
}

.showcode-stripe-band {
    position: absolute;
    z-index: 0;
    top: 60%;
    left: 0;
    width: 100%;
    height: 40%;
    background: hsl(213.69deg 52% 97.828%);
    transform: skewY(-6deg);
    transform-origin: 100% 0;
}

.showcode-stripe-band .showcode-stripe-gridline {
    border-color: rgba(66, 71, 112, 0.15);
}

.showcode-stripe-set {
    position: absolute;
    z-index: 1;
    bottom: 65px;
    left: calc(var(--window-width) * 0.75 - 50px);
    width: 500px;
    height: 50px;
    transform-origin: 100% 0;
}

.showcode-stripe-set.is-small {
    top: -49px;
    bottom: auto;
}

.showcode-stripe-layer-1,
.showcode-stripe-layer-2,
.showcode-stripe-intersection {
    position: absolute;
    width: 100%;
}

.showcode-stripe-layer-1 {
    height: 100%;
    background: rgb(17, 239, 227);
}

.showcode-stripe-layer-2 {
    height: 32px;
    background: rgb(153, 102, 255);
    transform: translate(50px, 50px);
}

.showcode-stripe-intersection {
    height: 18px;
    background: hsl(221.1deg 99.822% 44.876%);
    transform: translate(50px, 32px);
}
</style>
