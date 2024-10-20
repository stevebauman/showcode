<template>
    <div class="p-1 flex items-center border">
        <SocialBadgeIcon class="w-8" :type="type" />

        <div class="px-2 space-y-0.5">
            <div v-if="displayName" class="text-xs font-semibold leading-none">
                {{ displayName }}
            </div>

            <div v-if="username" class="font-medium leading-none text-[11px] opacity-75">
                @{{ username }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    type: String,
    username: String,
    displayName: String,
});
</script>
