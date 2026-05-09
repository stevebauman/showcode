<template>
    <Interact
        :style="{
            touchAction: 'none',
            width: `${width}px`,
            height: `${height}px`,
        }"
        :resize="resize"
        @resizestart="onResizeStart"
        @resizeend="onResizeEnd"
        @resizemove="onResize"
    >
        <div class="pointer-events-none absolute inset-0 z-[2] h-full w-full"></div>

        <div
            v-if="frame === 'none'"
            v-bind="backgroundAttributes"
            class="absolute inset-0"
            :data-hide="background === 'transparent' ? '' : undefined"
        ></div>

        <FrameStripeBackground
            v-if="frame === 'stripe'"
            :window-width="frameWindowWidth"
            :frame-height="height"
        />

        <!-- Optional grid. Left out for a future implementation. -->
        <!-- <div class="absolute z-[2] w-full h-full bg-grid pointer-events-none"></div> -->

        <template v-if="resizable && !preview">
            <span class="absolute -mt-2 flex h-full w-full items-start justify-center">
                <ButtonResize
                    ref="top"
                    data-hide
                    :zoom-scale="zoomScale"
                    class="resize-top cursor-resize-height absolute h-2 w-8"
                />
            </span>

            <span class="absolute mt-2 flex h-full w-full items-end justify-center">
                <ButtonResize
                    ref="bottom"
                    data-hide
                    :zoom-scale="zoomScale"
                    class="resize-bottom cursor-resize-height absolute h-2 w-8"
                />
            </span>

            <span class="absolute -ml-2 flex h-full w-full items-center justify-start">
                <ButtonResize
                    ref="left"
                    data-hide
                    :zoom-scale="zoomScale"
                    class="resize-left cursor-resize-width absolute h-8 w-2"
                />
            </span>

            <span class="absolute ml-2 flex h-full w-full items-center justify-end">
                <ButtonResize
                    data-hide
                    ref="right"
                    :zoom-scale="zoomScale"
                    class="resize-right cursor-resize-width absolute h-8 w-2"
                />
            </span>
        </template>

        <div
            ref="stage"
            class="group relative flex flex-1"
            :class="{
                'items-center justify-center': position === 'center',
                'items-start justify-center': position === 'top',
                'items-end justify-center': position === 'bottom',
                'items-center justify-start': position === 'left',
                'items-center justify-end': position === 'right',
            }"
        >
            <slot />
        </div>

        <Transition name="ruler">
            <Divider
                v-if="!preview && resizingHeight"
                data-hide
                :number="height"
                :zoom-scale="zoomScale"
                :style="{ marginRight: `-${3.5 * Math.pow(zoomScale, 0.5)}rem` }"
                class="absolute top-0 right-0 mx-4 text-[10px] font-medium text-zinc-400 dark:text-zinc-500"
            />
        </Transition>

        <Transition name="ruler">
            <Separator
                v-if="!preview && resizingWidth"
                :number="width"
                :zoom-scale="zoomScale"
                :style="{ marginBottom: `-${3.5 * Math.pow(zoomScale, 0.5)}rem` }"
                class="absolute bottom-0 w-full text-[10px] font-medium text-zinc-400 dark:text-zinc-500"
            />
        </Transition>
    </Interact>
</template>

<script setup>
import interact from 'interactjs';
import { ref, watch, toRefs, nextTick, computed, onMounted, onUpdated, onBeforeUnmount } from 'vue';

const props = defineProps({
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    position: { type: String, required: true },
    resizable: { type: Boolean, default: true },
    zoom: { type: [Number, String], default: 1 },
    preview: { type: Boolean, default: false },
    aspectRatio: { type: Array, required: false },
    background: { type: String, required: true },
    backgroundAttributes: { type: Object, required: true },
    frame: { type: String, default: 'none' },
});

const emit = defineEmits(['update:width', 'update:height']);

const x = ref(null);
const y = ref(null);
const resizingWidth = ref(false);
const resizingHeight = ref(false);
const stage = ref(null);
const top = ref(null);
const right = ref(null);
const bottom = ref(null);
const left = ref(null);
const frameWindowWidth = ref(0);

const { zoom, aspectRatio } = toRefs(props);

let resizeObserver = null;
let observedFrameWindow = null;
let frameMetricsRequest = null;

const ratio = computed(() => {
    if (aspectRatio.value) {
        const [ratioX, ratioY] = aspectRatio.value;
        return ratioX / ratioY;
    }
});

const zoomScale = computed(() => 1 / Number(zoom.value));

const resize = computed(() => ({
    edges: {
        top: top.value?.$el,
        right: right.value?.$el,
        bottom: bottom.value?.$el,
        left: left.value?.$el,
    },
    modifiers: [interact.modifiers.aspectRatio({ ratio: ratio.value })],
}));

function onResizeStart(event) {
    const edges = event.edges;
    const hasWidth = !!(edges.left || edges.right);
    const hasHeight = !!(edges.top || edges.bottom);

    resizingWidth.value = hasWidth || !!ratio.value;
    resizingHeight.value = hasHeight || !!ratio.value;
}

function onResizeEnd() {
    resizingWidth.value = false;
    resizingHeight.value = false;
}

function onResize(event) {
    const container = event.target.parentNode;
    if (event.rect.width) {
        const scaleX = container.getBoundingClientRect().width / container.offsetWidth;
        emit('update:width', event.rect.width / scaleX);
    }
    if (event.rect.height) {
        const scaleY = container.getBoundingClientRect().height / container.offsetHeight;
        emit('update:height', event.rect.height / scaleY);
    }
}

function scheduleFrameMetricsUpdate() {
    if (frameMetricsRequest) {
        cancelAnimationFrame(frameMetricsRequest);
    }

    frameMetricsRequest = requestAnimationFrame(updateFrameMetrics);
}

function updateFrameMetrics() {
    frameMetricsRequest = null;

    const frameWindow = stage.value?.querySelector('[data-frame-window]');

    frameWindowWidth.value = frameWindow?.offsetWidth ?? 0;

    if (!resizeObserver || observedFrameWindow === frameWindow) {
        return;
    }

    if (observedFrameWindow) {
        resizeObserver.unobserve(observedFrameWindow);
    }

    observedFrameWindow = frameWindow;

    if (observedFrameWindow) {
        resizeObserver.observe(observedFrameWindow);
    }
}

onMounted(() => {
    resizeObserver = new ResizeObserver(scheduleFrameMetricsUpdate);

    if (stage.value) {
        resizeObserver.observe(stage.value);
    }

    nextTick(scheduleFrameMetricsUpdate);
});

onUpdated(scheduleFrameMetricsUpdate);

watch(() => [props.frame, props.width, props.height], scheduleFrameMetricsUpdate);

onBeforeUnmount(() => {
    if (frameMetricsRequest) {
        cancelAnimationFrame(frameMetricsRequest);
    }

    resizeObserver?.disconnect();
});
</script>
