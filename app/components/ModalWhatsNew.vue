<template>
    <Dialog :open="modelValue" @update:open="(value) => !value && $emit('dismiss')">
        <DialogContent class="max-w-xl gap-0 overflow-hidden p-0">
            <div class="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain">
                <DialogHeader class="gap-2 px-6 pt-6 pb-5 text-left">
                    <div class="text-ui-muted flex items-center gap-2 pr-6 text-[11px]">
                        <span class="text-ui-text font-medium">What's new</span>
                        <span aria-hidden="true">·</span>
                        <span>Showcode {{ release.version }}</span>
                        <span class="ml-auto">{{ release.date }}</span>
                    </div>
                    <DialogTitle class="text-xl font-semibold tracking-tight">
                        {{ release.title }}
                    </DialogTitle>
                    <DialogDescription class="text-ui-muted text-[13px] leading-relaxed">
                        {{ release.description }}
                    </DialogDescription>
                </DialogHeader>

                <div v-if="release.image" class="px-6 pb-5">
                    <img
                        :src="release.image"
                        :alt="release.imageAlt"
                        class="border-ui-line w-full rounded-lg border"
                    />
                </div>

                <ReleaseNotesContent class="px-6 pb-6" :content="release.content" />
            </div>

            <div class="bg-ui-chrome flex flex-wrap items-center gap-3 px-6 py-4">
                <label class="text-ui-muted mr-auto flex items-center gap-2 text-[11px]">
                    <span
                        class="relative inline-flex size-3.5 shrink-0 items-center justify-center"
                    >
                        <input
                            type="checkbox"
                            :checked="showAfterUpdate"
                            class="peer border-ui-line bg-ui-field text-ui-text checked:border-ui-text checked:bg-ui-text hover:border-ui-muted focus-visible:outline-ui-focus m-0 size-3.5 appearance-none rounded-sm border shadow-none transition-colors checked:bg-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
                            @change="$emit('update:showAfterUpdate', $event.target.checked)"
                        />
                        <CheckIcon
                            aria-hidden="true"
                            :stroke-width="3"
                            class="text-ui-canvas pointer-events-none absolute size-2.5 opacity-0 peer-checked:opacity-100"
                        />
                    </span>
                    Show after updates
                </label>
                <Button variant="ghost" @click="$emit('changelog')">Full changelog</Button>
                <Button class="rounded-full px-4" @click="$emit('dismiss')">Continue</Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { CheckIcon } from 'lucide-vue-next';

defineProps({
    modelValue: { type: Boolean, default: false },
    release: { type: Object, required: true },
    showAfterUpdate: { type: Boolean, default: true },
});

defineEmits(['dismiss', 'changelog', 'update:showAfterUpdate']);
</script>
