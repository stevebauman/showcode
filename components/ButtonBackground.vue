<template>
    <button
        class="relative w-20 h-10 transition-all rounded hover:shadow-lg hover:-translate-y-0.5"
    >
        <button
            v-if="custom"
            @click="$emit('delete')"
            class="absolute inline-flex items-center justify-center w-5 h-5 rounded-full shadow active:bg-ui-gray-500 bg-ui-gray-400 -top-2 -left-2"
        >
            <Icon type="x" class="w-4 h-4 text-white" />
        </button>

        <div
            v-if="active"
            class="absolute inline-flex items-center justify-center w-5 h-5 bg-green-400 rounded-full shadow -top-2 -right-2"
        >
            <Icon type="check" class="w-4 h-4 text-white" />
        </div>

        <slot />
    </button>
</template>

<script>
export default {
    props: {
        custom: Boolean,
        active: Boolean,
    },
};
</script>
