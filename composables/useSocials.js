export default function () {
    const types = [
        { title: 'X', name: 'x' },
        { title: 'Twitter', name: 'twitter' },
        { title: 'GitHub', name: 'github' },
        { title: 'Facebook', name: 'facebook' },
        { title: 'LinkedIn', name: 'linkedin' },
    ];

    const positions = [
        { title: 'Left', name: 'bottom-left' },
        { title: 'Center', name: 'bottom-center' },
        { title: 'Right', name: 'bottom-right' },
    ];

    return {
        types,
        positions,
    };
}
