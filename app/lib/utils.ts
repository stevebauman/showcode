import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formControlFocusClasses =
    'focus:ring-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ui-focus';

export const formControlGroupFocusClasses =
    'focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-ui-focus';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
