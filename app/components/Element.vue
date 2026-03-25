<template>
    <Interact
        v-bind="$attrs"
       
        @dragmove="onDrag"
        :draggable="draggable"
        @click="foo"
    />
</template>

<script setup>
import interact from 'interactjs';
import { computed, ref } from 'vue';

const x = ref(0);
const y = ref(0);

function onDrag(event) {
    x.value += event.dx;
    y.value += event.dy;
    event.target.style.transform = `translate(${x.value}px, ${y.value}px)`;
}

const draggable = computed(() => ({
    modifiers: [
        interact.modifiers.snapSize({
            targets: [{ width: 100 }, interact.snappers.grid({ width: 25, height: 25 })],
        }),
    ],
}));

const foo = (event) => console.log(event);
</script>
