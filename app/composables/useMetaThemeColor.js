export default function () {
    function update() {
        const isDark = document.documentElement.classList.contains('dark');
        const themeColor = isDark ? '#09090b' : '#e4e4e7';

        document.querySelector('meta[name=theme-color]')?.setAttribute('content', themeColor);
    }

    return { update };
}
