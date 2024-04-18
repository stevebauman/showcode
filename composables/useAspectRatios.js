export default function () {
    const aspectRatios = [
        [16, 9],
        [4, 3],
        [1, 1],
    ];

    function calculateAspectRatio([x, y], height) {
        return Math.round((height / y) * x);
    }

    return {
        aspectRatios,
        calculateAspectRatio,
    };
}
