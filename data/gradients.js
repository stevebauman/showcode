export const gradients = [
    {
        name: 'transparent',
        style: {
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
            backgroundImage: `linear-gradient(45deg, var(--color-ui-gray-900) 25%, transparent 0),
                    linear-gradient(-45deg, var(--color-ui-gray-900) 25%, transparent 0),
                    linear-gradient(45deg, transparent 75%, var(--color-ui-gray-900) 0),
                    linear-gradient(-45deg, transparent 75%, var(--color-ui-gray-900) 0)`
        }
    },
    {
        name: 'teal',
        class: 'bg-gradient-to-bl from-green-400 to-blue-500',
    },
    {
        name: 'ocean',
        class: 'bg-gradient-to-tl from-sky-800 to-sky-400',
    }
];