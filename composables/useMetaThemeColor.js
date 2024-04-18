export default function () {
    function update() {
        const themeColor = getComputedStyle(document.documentElement).getPropertyValue(
            '--color-ui-gray-800'
        );

        document.querySelector('meta[name=theme-color]').setAttribute('content', themeColor);
    }

    return { update };
}
