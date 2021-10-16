<template>
    <div>
        <div
            ref="monaco"
            :style="{ height: `${height}px`, width: `${width}px` }"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: true,
        },
        theme: {
            type: String,
            default: "vs",
        },
        height: Number,
        width: Number,
        language: String,
        options: Object,
    },

    model: {
        event: "change",
    },

    watch: {
        value(newValue) {
            if (this.editor) {
                if (newValue !== this.editor.getValue()) {
                    this.editor.setValue(newValue);
                }
            }
        },

        language(language) {
            if (this.editor) {
                this.monaco.editor.setModelLanguage(
                    this.editor.getModel(),
                    language
                );
            }
        },

        height() {
            this.updateDimensions();
        },
    },

    data() {
        return { windowWidth: window.innerWidth };
    },

    mounted() {
        const waitForMonaco = () => {
            typeof window.monaco !== "undefined"
                ? this.initMonaco()
                : setTimeout(waitForMonaco, 250);
        };

        waitForMonaco();
    },

    beforeDestroy() {
        this.editor && this.editor.dispose();
    },

    destroyed() {
        window.removeEventListener("resize", this.updateDimensions);
    },

    methods: {
        initMonaco() {
            this.monaco = window.monaco;

            this.editor = this.monaco.editor.create(this.$refs.monaco, {
                value: this.value,
                language: "php",
                theme: "vs-light",
                fontSize: "16px",
                automaticLayout: true,
                minimap: {
                    enabled: false,
                },
            });

            this.editor.onDidChangeModelContent((event) => {
                const value = this.editor.getValue();

                if (this.value !== value) {
                    this.$emit("change", value, event);
                }
            });

            window.addEventListener("resize", this.updateDimensions);
        },

        updateDimensions() {
            this.editor.layout();
        },
    },
};
</script>
