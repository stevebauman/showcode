<script setup>
import { reactiveOmit } from "@vueuse/core";
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from "reka-ui";
import { cn } from "@/lib/utils";
import { onMounted, onBeforeUnmount, ref } from "vue";
import ScrollBar from "./ScrollBar.vue";

const props = defineProps({
  type: { type: String, required: false, default: "hover" },
  dir: { type: String, required: false },
  scrollHideDelay: { type: Number, required: false, default: 300 },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
  orientation: { type: String, required: false, default: "vertical" },
  forceVerticalScroll: { type: Boolean, required: false, default: false },
});

const delegatedProps = reactiveOmit(props, "class", "orientation", "forceVerticalScroll");

const root = ref(null);
let scrollListener = null;

onMounted(() => {
  if (props.forceVerticalScroll && root.value) {
    const viewport = root.value.$el.querySelector("[data-reka-scroll-area-viewport]");

    if (viewport) {
      scrollListener = (e) => {
        const isTouchPad = e.wheelDeltaY
          ? e.wheelDeltaY === -3 * e.deltaY
          : e.deltaMode === 0;

        if (isTouchPad) return;

        e.preventDefault();
        viewport.scrollLeft += e.deltaY;
      };

      viewport.addEventListener("wheel", scrollListener);
    }
  }
});

onBeforeUnmount(() => {
  if (scrollListener && root.value) {
    const viewport = root.value.$el.querySelector("[data-reka-scroll-area-viewport]");
    viewport?.removeEventListener("wheel", scrollListener);
  }
});
</script>

<template>
  <ScrollAreaRoot
    ref="root"
    v-bind="delegatedProps"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar v-if="orientation === 'vertical' || orientation === 'both'" orientation="vertical" />
    <ScrollBar v-if="orientation === 'horizontal' || orientation === 'both'" orientation="horizontal" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
