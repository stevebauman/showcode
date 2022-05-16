<template>
    <Interact
        v-bind="$attrs"
        v-on="$listeners"
        @dragmove="onDrag"
        :draggable="draggable"
        @click.native="foo"
    />
</template>

<script>
import interact from 'interactjs';
import { computed, ref } from '@nuxtjs/composition-api';

export default {
    setup() {
        const x = ref(0);
        const y = ref(0);

        const onDrag = (event) => {
            x.value += event.dx;
            y.value += event.dy;

            event.target.style.transform = `translate(${x.value}px, ${y.value}px)`;
        };

        const draggable = computed(() => ({
            modifiers: [
                interact.modifiers.snapSize({
                    targets: [{ width: 100 }, interact.snappers.grid({ width: 25, height: 25 })],
                }),
            ],
        }));

        return { draggable, onDrag, foo: (event) => console.log(event) };
    },
};
</script>
