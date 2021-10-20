<template>
    <div>
        <div
            ref="monaco"
            :style="{
                height: `${height - heightOffset}px`,
                width: `${width}px`,
            }"
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
        tabSize: {
            type: [Number, String],
            default: 4,
        },
        height: Number,
        heightOffset: Number,
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

        tabSize(size) {
            if (this.editor) {
                this.editor
                    .getModel()
                    .updateOptions({ tabSize: parseInt(size) });
            }
        },

        height() {
            this.updateDimensions();
        },
    },

    data() {
        return { windowWidth: 0 };
    },

    created() {
        if (process.isClient) {
            this.windowWidth = window.innerWidth;
        }
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
                scrollBeyondLastLine: false,
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
            this.editor && this.editor.layout();
        },
    },
};
</script>

<style>
.monaco-editor .parameter-hints-widget {
    border: 0px;
}
.monaco-editor .parameter-hints-widget .signature {
    padding: 0px;
}
.monaco-editor .suggest-widget {
    border: 0px;
}
.monaco-editor.vs-dark .suggest-widget {
    border: 0px;
}
.monaco-editor.rename-box,
.monaco-hover {
    top: 0;
}
</style>
