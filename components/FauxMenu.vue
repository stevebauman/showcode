<template>
    <div class="flex items-center gap-2">
        <div
            class="w-3 h-3 rounded-full"
            v-for="(dot, index) in dots"
            :key="index"
            :class="classes[theme][index]"
        ></div>
    </div>
</template>

<script>
export default {
    props: ['theme'],

    data() {
        return { dots: [0, 1, 2] }
    },

    computed: {
        classes() {
            return {
                dark: ['bg-gray-700', 'bg-gray-700', 'bg-gray-700'],
                light: ['bg-gray-300', 'bg-gray-300', 'bg-gray-300'],
                color: ['bg-red-500', 'bg-yellow-400', 'bg-green-400'],
            }
        },
    },
}
</script>
