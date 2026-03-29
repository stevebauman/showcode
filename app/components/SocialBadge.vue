<template>
    <div class="flex items-center p-1">
        <SocialBadgeIcon class="w-8" :type="type" />

        <div class="space-y-0.5 px-2">
            <div v-if="displayName" class="text-xs font-semibold leading-none">
                {{ displayName }}
            </div>

            <div v-if="username" class="text-[11px] font-medium leading-none opacity-75">
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
