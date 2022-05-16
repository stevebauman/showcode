<template>
    <div class="items-center justify-between hidden lg:flex">
        <span class="relative inline-block w-full h-px align-middle bg-ui-gray-500"> </span>

        <div class="px-2 tracking-widest text-center uppercase z-[2]">
            {{ number }}
            <br />
            px
        </div>

        <span class="relative inline-block w-full h-px align-middle bg-ui-gray-500"></span>
    </div>
</template>

<script>
export default {
    props: ['number'],
};
</script>
