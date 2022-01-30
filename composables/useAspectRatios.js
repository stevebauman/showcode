export default function () {
    const aspectRatios = [
        [16, 9],
        [4, 3],
        [1, 1],
    ];

    const calculateAspectRatio = ([x, y], height) => Math.round((height / y) * x);

    return {
        aspectRatios,
        calculateAspectRatio,
    };
}
