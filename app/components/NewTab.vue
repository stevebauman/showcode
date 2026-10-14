<template>
    <div
        data-new-tab
        class="rounded-surface overflow-y-auto bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white"
    >
        <main class="mx-auto min-h-full w-full max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
            <header class="flex items-end justify-between gap-6">
                <div>
                    <h1 class="text-xl font-semibold tracking-tight">New project</h1>
                    <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Choose a template or begin with a blank project.
                    </p>
                </div>

                <button
                    v-if="savedTemplates.length"
                    type="button"
                    data-manage-templates
                    class="rounded-control shrink-0 px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                    @click="$emit('manage-templates')"
                >
                    Manage templates
                </button>
            </header>

            <div class="mt-8 flex items-center gap-2">
                <h2 class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Start from</h2>
                <span class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
            </div>

            <section class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                    type="button"
                    data-start-from-scratch
                    class="group rounded-emphasis overflow-hidden border border-zinc-200 bg-white text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/70 dark:focus-visible:ring-offset-black"
                    @click="$emit('start')"
                >
                    <div
                        class="flex aspect-[16/10] items-center justify-center border-b border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/60"
                    >
                        <span
                            class="rounded-emphasis flex size-12 items-center justify-center border border-zinc-300 bg-white text-zinc-500 shadow-xs transition-colors group-hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:text-white"
                        >
                            <PlusIcon class="size-5" />
                        </span>
                    </div>

                    <div class="px-4 py-3.5">
                        <div class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            Blank project
                        </div>
                        <div class="mt-1 text-[11px] text-zinc-500">Use your editor defaults</div>
                    </div>
                </button>

                <button
                    v-for="template in savedTemplates"
                    :key="template.tab.id"
                    type="button"
                    :data-template-id="template.tab.id"
                    class="group rounded-emphasis overflow-hidden border border-zinc-200 bg-white text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/70 dark:focus-visible:ring-offset-black"
                    @click="$emit('template', template)"
                >
                    <div
                        class="relative aspect-[16/10] overflow-hidden border-b border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/60"
                    >
                        <div
                            v-if="template.settings?.image"
                            class="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
                            :style="{ backgroundImage: `url(${template.settings.image})` }"
                        />

                        <div v-else class="flex size-full items-center justify-center">
                            <LayoutTemplateIcon class="size-6 text-zinc-300 dark:text-zinc-700" />
                        </div>

                        <span
                            v-if="templates.isDefault(template)"
                            class="rounded-control absolute top-2.5 left-2.5 inline-flex items-center gap-1 border border-zinc-200 bg-white/90 px-1.5 py-1 text-[9px] font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300"
                        >
                            <StarIcon class="size-2.5 fill-current text-amber-400" />
                            Default
                        </span>
                    </div>

                    <div class="px-4 py-3.5">
                        <div
                            class="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                        >
                            {{ template.tab.name || 'Untitled Template' }}
                        </div>
                        <div class="mt-1 text-[11px] text-zinc-500">
                            {{ savedAt(template) }}
                        </div>
                    </div>
                </button>
            </section>

            <p v-if="!savedTemplates.length" class="mt-5 text-xs leading-5 text-zinc-500">
                Saved templates will appear here. Create one from File → Save As Template.
            </p>
        </main>
    </div>
</template>

<script setup>
import { LayoutTemplateIcon, PlusIcon, StarIcon } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps({
    templates: { type: Object, required: true },
});

defineEmits(['start', 'template', 'manage-templates']);

const savedTemplates = computed(() => {
    return [...props.templates.all()].sort((left, right) => {
        return Number(props.templates.isDefault(right)) - Number(props.templates.isDefault(left));
    });
});

function savedAt(template) {
    if (!template.tab.created_at) {
        return 'Saved template';
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(template.tab.created_at));
}
</script>
