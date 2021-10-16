<template>
    <div
        class="grid min-h-screen"
        :class="{ 'grid-cols-2': sideBySide, 'grid-rows-2': !sideBySide }"
    >
        <div>
            <div class="p-1 border-b">
                <select v-model="language" class="border-gray-300 rounded-md">
                    <option value="php">PHP</option>
                    <option value="javascript">JavaScript</option>
                </select>

                <button @click="toggleLayout">
                    Switch Layout
                </button>
            </div>

            <editor
                v-model="code"
                :language="language"
                :width="editorWidth"
                :height="editorHeight"
            />
        </div>

        <div ref="preview" class="flex items-center justify-center bg-ash">
            <preview :code="previewCode" :language="language" />
        </div>
    </div>
</template>

<script>
export default {
    metaInfo: {
        title: "Screenshot your code",
    },

    data() {
        return {
            code: "<?php",
            language: "php",
            sideBySide: true,
            editorWidth: window.innerWidth,
            editorHeight: window.innerHeight,
        };
    },

    created() {
        window.addEventListener("resize", this.handleWindowResize);
    },

    mounted() {
        this.handleWindowResize();
    },

    watch: {
        sideBySide() {
            this.handleWindowResize();
        },
    },

    computed: {
        previewCode() {
            return this.code.replace("<?php", "").trim();
        },
    },

    methods: {
        toggleLayout() {
            this.sideBySide = !this.sideBySide;
        },

        handleWindowResize() {
            this.editorHeight = this.sideBySide
                ? window.innerHeight
                : window.innerHeight / 2;

            this.editorWidth = this.sideBySide
                ? window.innerWidth / 2
                : window.innerWidth;
        },
    },
};
</script>
