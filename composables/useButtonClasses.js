import { computed, reactive, toRefs } from 'vue';

export default function (props = null) {
    const { active } = toRefs(props ?? reactive({ active: false }));

    const sizes = {
        none: null,
        xs: 'text-xs px-2.5 py-1.5',
        sm: 'text-sm px-3 py-2 leading-4',
        base: 'text-sm px-4 py-2',
        lg: 'text-base font-semibold px-4 py-3',
    };

    const variants = computed(() => ({
        primary: [
            'text-white bg-ui-violet-500 hover:bg-ui-violet-600 active:bg-ui-violet-700 focus:bg-ui-violet-600',
            active.value ? 'bg-ui-violet-600 font-bold' : null,
        ],
        secondary: [
            'text-ui-gray-300 disabled:text-ui-gray-500 bg-ui-gray-700 active:bg-ui-gray-900 active:text-ui-gray-400 hover:bg-ui-gray-800 disabled:bg-ui-gray-900',
            active.value ? 'bg-ui-gray-900 font-bold' : null,
        ],
    }));

    const classes = [
        'select-none inline-flex items-center gap-2 disabled:cursor-not-allowed transform leading-none transition duration-100 ease-in-out focus:outline-none focus:ring-0',
    ];

    return { sizes, variants, classes };
}
