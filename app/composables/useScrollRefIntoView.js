export default function () {
    function scrollRefIntoView(refName) {
        const el = document.querySelector(`[data-ref="${refName}"]`);

        if (!el) return;

        el.scrollIntoView({
            block: 'nearest',
            inline: 'center',
        });
    }

    return { scrollRefIntoView };
}
