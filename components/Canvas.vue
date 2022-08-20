<template>
    <Interact
        :style="{
            touchAction: 'none',
            width: `${width}px`,
            height: `${height}px`,
        }"
        :resize="resize"
        @resizemove="onResize"
    >
        <div class="absolute inset-0 z-[2] w-full h-full bg-overlay pointer-events-none"></div>

        <div
            v-bind="backgroundAttributes"
            class="absolute inset-0"
            :dusk="`background-${background}`"
            :data-hide="background === 'transparent'"
        ></div>

        <!-- Optional grid. Left out for a future implementation. -->
        <!-- <div class="absolute z-[2] w-full h-full bg-grid pointer-events-none"></div> -->

        <template v-if="resizable">
            <ButtonResize
                ref="top"
                data-hide
                :style="{ transform: `scale(${zoomScale})` }"
                class="absolute top-0 left-1/2 -m-1.5 cursor-resize-height resize-top"
            />

            <ButtonResize
                ref="bottom"
                data-hide
                :style="{ transform: `scale(${zoomScale})` }"
                class="absolute bottom-0 left-1/2 -m-1.5 cursor-resize-height resize-bottom"
            />

            <ButtonResize
                ref="left"
                data-hide
                :style="{ transform: `scale(${zoomScale})` }"
                class="absolute left-0 top-1/2 -m-1.5 cursor-resize-width resize-left"
            />

            <ButtonResize
                data-hide
                ref="right"
                :style="{ transform: `scale(${zoomScale})` }"
                class="absolute right-0 top-1/2 -m-1.5 cursor-resize-width resize-right"
            />
        </template>

        <div
            class="relative flex flex-1"
            :class="{
                'items-center justify-center': position === 'center',
                'items-start justify-center': position === 'top',
                'items-end justify-center': position === 'bottom',
                'items-center justify-start': position === 'left',
                'items-center justify-end': position === 'right',
            }"
        >
            <slot />

            <Divider
                data-hide
                dusk="canvas-height"
                :number="height"
                :zoom-scale="zoomScale"
                :style="{ marginRight: `-${3.5 * Math.pow(zoomScale, 0.5)}rem` }"
                class="absolute top-0 right-0 mx-4 text-xs font-semibold text-ui-gray-300"
            />
        </div>

        <Separator
            dusk="canvas-width"
            :number="width"
            :zoom-scale="zoomScale"
            :style="{ marginBottom: `-${3.5 * Math.pow(zoomScale, 0.5)}rem` }"
            class="absolute bottom-0 w-full text-xs font-semibold text-ui-gray-300"
        />
    </Interact>
</template>

<script>
import interact from 'interactjs';
import { ref, toRefs, computed } from '@nuxtjs/composition-api';

export default {
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        resizable: {
            type: Boolean,
            default: true,
            required: false,
        },
        zoom: {
            type: [Number, String],
            required: true,
        },
        aspectRatio: {
            type: Array,
            required: false,
        },
        background: {
            type: String,
            required: true,
        },
        backgroundAttributes: {
            type: Object,
            required: true,
        },
    },

    setup(props, { emit }) {
        const x = ref(null);
        const y = ref(null);

        const top = ref(null);
        const right = ref(null);
        const bottom = ref(null);
        const left = ref(null);

        const { zoom, aspectRatio } = toRefs(props);

        const ratio = computed(() => {
            if (aspectRatio.value) {
                const [ratioX, ratioY] = aspectRatio.value;

                return ratioX / ratioY;
            }
        });

        const zoomScale = computed(() => 1 / new Number(zoom.value));

        const resize = computed(() => ({
            edges: {
                top: top.value?.$el,
                right: right.value?.$el,
                bottom: bottom.value?.$el,
                left: left.value?.$el,
            },
            modifiers: [
                interact.modifiers.aspectRatio({
                    ratio: ratio.value,
                }),
            ],
        }));

        const onResize = (event) => {
            const container = event.target.parentNode;

            if (event.rect.width) {
                const scaleX = container.getBoundingClientRect().width / container.offsetWidth;

                const x = event.rect.width / scaleX;

                emit('update:width', x);
            }

            if (event.rect.height) {
                const scaleY = container.getBoundingClientRect().height / container.offsetHeight;

                const y = event.rect.height / scaleY;

                emit('update:height', y);
            }
        };

        return { x, y, top, right, bottom, left, resize, onResize, zoomScale };
    },
};
</script>
