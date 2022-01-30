<template>
    <Modal v-bind="$attrs" v-on="$listeners" @opened="scrollToSelectedColors">
        <div class="space-y-4">
            <h1 class="text-lg font-semibold text-center text-ui-gray-50">Make a Background</h1>

            <div style="height: 250px" class="rounded-xl" :class="gradient"></div>

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
                        class="inline-flex items-center justify-center p-1.5 hover:text-ui-focus transition-colors"
                    >
                        <RadioIcon v-if="key === 'center'" class="w-5 h-5" />
                        <ArrowUpIcon v-else class="w-5 h-5 transform" :class="arrow" />
                    </Button>
                </template>
            </div>

            <ControlSection title="From Color" class="border-4 border-ui-gray-800">
                <ColorSection>
                    <ColorButton
                        v-for="color in colors"
                        :key="`from-${color}`"
                        :ref="`from-${color}`"
                        :class="`bg-${color}`"
                        :active="from === color"
                        @click.native="from = color"
                    />
                </ColorSection>
            </ControlSection>

            <ControlSection title="Via Color" class="border-4 border-ui-gray-800">
                <ColorSection>
                    <ColorButton
                        v-for="color in colors"
                        :key="`via-${color}`"
                        :ref="`via-${color}`"
                        :class="`bg-${color}`"
                        :active="via === color"
                        @click.native="via = color"
                    />
                </ColorSection>
            </ControlSection>

            <ControlSection title="To Color" class="border-4 border-ui-gray-800">
                <ColorSection>
                    <ColorButton
                        v-for="color in colors"
                        :key="`to-${color}`"
                        :ref="`to-${color}`"
                        :class="`bg-${color}`"
                        :active="to === color"
                        @click.native="to = color"
                    />
                </ColorSection>
            </ControlSection>

            <div class="flex justify-between">
                <Button> Cancel </Button>

                <Button variant="primary" @click.native="save"> Save </Button>
            </div>
        </div>
    </Modal>
</template>

<script>
import { head } from 'lodash';
import { v4 as uuid } from 'uuid';
import { colors } from '~/data/colors';
import { directions } from '~/data/directions';
import { RadioIcon, ArrowUpIcon, RefreshCwIcon } from 'vue-feather-icons';

const ColorSection = {
    render(h) {
        return h(
            'div',
            {
                class: 'grid grid-flow-col grid-rows-2 gap-2 p-2 overflow-x-auto scrollbar-hide w-full',
            },
            this.$slots.default
        );
    },
};

const ColorButton = {
    props: { active: Boolean },

    render(h) {
        return h(
            'button',
            {
                class: 'w-8 h-8 focus:outline-none focus:ring-2 focus:ring-ui-focus rounded-xl'.concat(
                    this.active ? ' ring-2 ring-offset-2 ring-offset-ui-gray-700 ring-ui-focus' : ''
                ),
            },
            this.$slots.default
        );
    },
};

export default {
    components: {
        RadioIcon,
        ArrowUpIcon,
        RefreshCwIcon,
        ColorButton,
        ColorSection,
    },

    mounted() {
        this.randomize();
    },

    data() {
        return {
            colors,
            directions,
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
                ? `${this.direction} from-${this.from} via-${this.via} to-${this.to}`
                : `${this.direction} from-${this.from} via-${this.to}`;
        },
    },

    methods: {
        async save() {
            await this.$memory.settings.sync('backgrounds', (record) => {
                record.set(uuid(), {
                    direction: this.direction,
                    style: this.style,
                    from: this.from,
                    via: this.via,
                    to: this.to,
                });
            });

            alert('Saved!');
        },

        scrollToSelectedColors() {
            ['from', 'via', 'to'].forEach((attribute) => {
                const ref = head(this.$refs[`${attribute}-${this[attribute]}`] || []);

                if (ref) {
                    ref.$el.scrollIntoView({
                        block: 'nearest',
                        inline: 'center',
                    });
                }
            });
        },

        randomize() {
            const direction = this.getRandom(this.directions);

            const availableDirectionStyles = this.styles.filter((style) => {
                return direction[style];
            });

            this.style = this.getRandom(availableDirectionStyles);
            this.direction = direction[this.style];
            this.from = this.getRandom(this.colors);
            this.via = this.getRandom(this.colors);
            this.to = this.getRandom(this.colors);
        },

        getRandom(array) {
            return array[Math.floor(Math.random() * array.length)];
        },
    },
};
</script>
