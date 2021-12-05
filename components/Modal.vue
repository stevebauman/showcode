<template>
    <TModal
        v-bind="$attrs"
        v-on="$listeners"
        :classes="{
            overlay: 'z-40 bg-black fixed inset-0 bg-opacity-50',
            wrapper: 'z-50 max-w-2xl px-3 py-12 flex h-full items-center justify-center',
            modal: 'bg-ui-gray-700 shadow rounded-lg w-full',
            body: 'p-3',
            header: 'border-b border-ui-gray-100 p-3 rounded-t',
            footer: 'bg-ui-gray-100 p-3 rounded-b',
            close: 'bg-ui-gray-800 text-ui-gray-600 rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out hover:bg-ui-gray-900 focus:ring-2 focus:ring-ui-focus focus:outline-none',
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
        <slot />
    </TModal>
</template>
