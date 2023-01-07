<template>
    <TModal
        v-bind="$attrs"
        v-on="$listeners"
        :classes="{
            overlay: 'z-40 bg-black fixed inset-0 bg-opacity-50 glass',
            wrapper: {
                'z-50 py-12': true,
                'max-w-2xl': size === 'sm',
                'max-w-4xl': size === 'md',
                'max-w-6xl': size === 'lg',
            },
            modal: 'bg-ui-gray-700 shadow-xl rounded-xl w-full highlight',
            body: 'px-6 pb-6',
            header: 'py-3 px-6 rounded-t text-lg border-b font-medium text-ui-gray-100 border-ui-gray-800',
            footer: 'bg-ui-gray-100 p-3 rounded-b',
            close: 'close-modal highlight rounded-full m-3 absolute right-0 top-0 h-8 w-8 transition duration-100 ease-in-out hover:bg-ui-gray-900',
            closeIcon: 'text-ui-gray-300 h-4 w-4',
            overlayEnterClass: 'opacity-0',
            overlayEnterActiveClass: 'transition ease-out duration-100',
            overlayEnterToClass: 'opacity-100',
            overlayLeaveClass: 'opacity-100',
            overlayLeaveActiveClass: 'transition ease-in duration-75',
            overlayLeaveToClass: 'opacity-0',
            enterClass: '',
            enterActiveClass: '',
            enterToClass: '',
            leaveClass: '',
            leaveActiveClass: '',
            leaveToClass: '',
        }"
    >
        <Scrollbar class="max-h-[50rem]">
            <slot />
        </Scrollbar>
    </TModal>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: 'lg',
        },
    },
};
</script>

<style scoped>
[color-scheme='dark'] {
    --glass-lightness: 0%;
}

[color-scheme='light'] {
    --glass-lightness: 100%;
}

.glass {
    background: hsl(0 0% var(--glass-lightness) / 50%);
    backdrop-filter: blur(10px);
}
</style>
