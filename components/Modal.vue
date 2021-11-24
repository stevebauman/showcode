<template>
    <TModal
        v-bind="$attrs"
        v-on="$listeners"
        :classes="{
            overlay: 'z-40 bg-black fixed inset-0 bg-opacity-50',
            wrapper: 'z-50 max-w-2xl px-3 py-12 flex h-full items-center justify-center',
            modal: 'bg-gray-700 shadow rounded-lg w-full',
            body: 'p-3',
            header: 'border-b border-gray-100 p-3 rounded-t',
            footer: 'bg-gray-100 p-3 rounded-b',
            close: 'bg-gray-700 text-gray-600 rounded-lg absolute right-0 top-0 -m-3 h-8 w-8 transition border border-gray-800 duration-100 ease-in-out hover:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:outline-none focus:ring-opacity-50',
            closeIcon: 'text-gray-300 h-4 w-4',
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
