export default function () {
    const types = [
        { title: 'X', name: 'x' },
        { title: 'Twitter', name: 'twitter' },
        { title: 'GitHub', name: 'github' },
        { title: 'Facebook', name: 'facebook' },
        { title: 'LinkedIn', name: 'linkedin' },
    ];

    const positions = [
        { title: 'Inside Left', name: 'inside-left' },
        { title: 'Inside Center', name: 'inside-center' },
        { title: 'Inside Right', name: 'inside-right' },

        { title: 'Bottom Left', name: 'bottom-left' },
        { title: 'Bottom Center', name: 'bottom-center' },
        { title: 'Bottom Right', name: 'bottom-right' },
    ];

    return {
        types,
        positions,
    };
}
