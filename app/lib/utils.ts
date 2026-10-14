import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formControlFocusClasses =
    'ring-offset-white focus:bg-white focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 focus:outline-hidden dark:ring-offset-zinc-950 dark:focus:bg-white/[0.07] dark:focus:ring-zinc-300';

export const formControlGroupFocusClasses =
    'ring-offset-white focus-within:ring-2 focus-within:ring-zinc-950 focus-within:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-within:ring-zinc-300';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
