import { cva } from 'class-variance-authority';

export { default as Button } from './Button.vue';

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ui-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90',
                destructive:
                    'bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90',
                outline: 'border border-ui-line bg-ui-field text-ui-text hover:bg-ui-hover',
                secondary: 'bg-ui-field text-ui-text hover:bg-ui-hover',
                ghost: 'text-ui-muted hover:bg-ui-hover hover:text-ui-text',
                link: 'text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50',
            },
            size: {
                default: 'h-8 px-3 py-1 text-xs',
                sm: 'h-6 rounded-control px-2 text-xs',
                lg: 'h-9 rounded-control px-6',
                icon: 'size-8',
                'icon-sm': 'size-6',
                'icon-lg': 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
