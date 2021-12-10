<template>
    <Modal v-bind="$attrs" v-on="$listeners">
        <div class="space-y-4">
            <h1 class="text-lg font-semibold text-center text-ui-gray-50">Make a Background</h1>

            <div style="height: 300px" class="rounded-xl" :class="gradient"></div>

            <div class="flex justify-center gap-2">
                <Select v-model="style" :options="styles" />

                <Button @click.native="randomize">
                    <RefreshCwIcon class="w-5 h-5" />
                </Button>

                <template v-for="{ key, arrow, ...rest } in directions">
                    <Button
                        @click.native="direction = rest[style]"
                        :key="key"
                        :disabled="!rest[style]"
                        class="
                            inline-flex
                            items-center
                            justify-center
                            p-1.5
                            hover:text-ui-focus
                            transition-colors
                        "
                    >
                        <RadioIcon v-if="key === 'center'" class="w-5 h-5" />
                        <ArrowUpIcon v-else class="w-5 h-5 transform" :class="arrow" />
                    </Button>
                </template>
            </div>

            <ControlSection title="From Color" class="border-4 border-ui-gray-800">
                <ColorSection>
                    <ColorButton
                        v-for="color in bgColors"
                        :key="color"
                        :class="color"
                        @click.native="from = color.replace('bg-', 'from-')"
                    />
                </ColorSection>
            </ControlSection>

            <ControlSection title="Via Color" class="border-4 border-ui-gray-800">
                <ColorSection>
                    <ColorButton
                        v-for="color in bgColors"
                        :key="color"
                        :class="color"
                        @click.native="via = color.replace('bg-', 'via-')"
                    />
                </ColorSection>
            </ControlSection>

            <ControlSection title="To Color" class="border-4 border-ui-gray-800">
                <ColorSection>
                    <ColorButton
                        v-for="color in bgColors"
                        :key="color"
                        :class="color"
                        @click.native="to = color.replace('bg-', 'to-')"
                    />
                </ColorSection>
            </ControlSection>

            <div class="flex justify-between">
                <Button> Cancel </Button>

                <ButtonPrimary> Save </ButtonPrimary>
            </div>
        </div>
    </Modal>
</template>

<script>
import Modal from './Modal';
import Label from './Label';
import Select from './Select';
import Button from './Button';
import ControlSection from './ControlSection';
import ButtonPrimary from './ButtonPrimary';
import { directions } from '~/data/directions';
import { RadioIcon, ArrowUpIcon, RefreshCwIcon } from 'vue-feather-icons';
import { bgColors, fromColors, viaColors, toColors } from '~/data/colors';

const ColorSection = {
    render(h) {
        return h(
            'div',
            { class: 'grid grid-flow-col grid-rows-2 gap-2 p-2 overflow-x-auto w-full' },
            this.$slots.default
        );
    },
};

const ColorButton = {
    render(h) {
        return h(
            'button',
            { class: 'w-10 h-10 focus:outline-none focus:ring-2 focus:ring-ui-focus rounded-xl' },
            this.$slots.default
        );
    },
};

export default {
    components: {
        Modal,
        ControlSection,
        Label,
        Select,
        Button,
        RadioIcon,
        ArrowUpIcon,
        RefreshCwIcon,
        ColorButton,
        ColorSection,
        ButtonPrimary,
    },

    mounted() {
        this.randomize();
    },

    data() {
        return {
            directions,
            bgColors,
            fromColors,
            viaColors,
            toColors,
            styles: ['gradient', 'radial', 'conic'],
            style: '',
            direction: '',
            from: '',
            via: '',
            to: '',
        };
    },

    watch: {
        style(style) {
            const direction = this.directions.filter((dir) => dir[style])[0];

            this.direction = direction[style];
        },
    },

    computed: {
        gradient() {
            return this.via !== 'none'
                ? `${this.direction} ${this.from} ${this.via} ${this.to}`
                : `${this.direction} ${this.from} ${this.to}`;
        },
    },

    methods: {
        getRandom(array) {
            return array[Math.floor(Math.random() * array.length)];
        },

        randomize() {
            const direction = this.getRandom(this.directions);

            const availableDirectionStyles = this.styles.filter((style) => {
                return direction[style];
            });

            this.style = this.getRandom(availableDirectionStyles);
            this.direction = direction[this.style];
            this.from = this.getRandom(this.fromColors);
            this.via = this.getRandom(this.viaColors);
            this.to = this.getRandom(this.toColors);
        },
    },
};
</script>
