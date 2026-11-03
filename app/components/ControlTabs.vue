<template>
    <aside
        class="border-ui-line bg-ui-chrome flex min-h-0 flex-col border-l"
        aria-label="Inspector"
    >
        <div
            :id="`${id}-panel`"
            role="tabpanel"
            :aria-labelledby="`${id}-${active}`"
            class="ui-tab-content flex min-h-0 flex-1 flex-col"
            :key="active"
        >
            <slot :active="active" />
        </div>

        <div class="inspector-footer bg-ui-chrome relative z-10 shrink-0 p-3">
            <div
                role="group"
                aria-label="Inspector controls"
                class="floating-toolbar inspector-dock border-ui-line bg-ui-chrome flex items-center gap-0.5 rounded-full border p-1"
            >
                <div
                    role="tablist"
                    aria-label="Inspector panels"
                    class="flex min-w-0 flex-1 gap-0.5"
                    @keydown="navigateTabs"
                >
                    <ControlTab
                        v-for="{ name, title, disabled, locked } in tabs"
                        :key="name"
                        :id="`${id}-${name}`"
                        :aria-controls="`${id}-panel`"
                        :tabindex="active === name ? 0 : -1"
                        :active="active === name"
                        :disabled="disabled"
                        :title="title"
                        class="min-w-0 flex-1"
                        @click="active = name"
                    >
                        <span class="min-w-0 truncate">{{ title }}</span>
                        <LockIcon v-if="locked" class="size-3 flex-none" />
                    </ControlTab>
                </div>
                <button
                    ref="closeButton"
                    type="button"
                    aria-label="Hide inspector"
                    class="text-ui-muted hover:bg-ui-hover hover:text-ui-text focus-visible:outline-ui-focus flex size-7 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1"
                    v-tooltip="'Hide inspector'"
                    @click="$emit('close')"
                >
                    <PanelRightCloseIcon class="size-4" />
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { head } from 'lodash';
import { ref, watch, toRefs, useId } from 'vue';
import { PanelRightCloseIcon, LockIcon } from 'lucide-vue-next';

const props = defineProps({ tabs: Array });
const emit = defineEmits(['changed', 'close']);
const { tabs } = toRefs(props);
const id = useId();
const active = ref(head(tabs.value).name);
const closeButton = ref(null);

function focusToggle() {
    closeButton.value?.focus({ preventScroll: true });
}

defineExpose({ focusToggle });

function navigateTabs(event) {
    const buttons = [...event.currentTarget.querySelectorAll('[role="tab"]:not(:disabled)')];
    const index = buttons.indexOf(event.target);
    let next;

    switch (event.key) {
        case 'ArrowRight':
            next = (index + 1) % buttons.length;
            break;
        case 'ArrowLeft':
            next = (index - 1 + buttons.length) % buttons.length;
            break;
        case 'Home':
            next = 0;
            break;
        case 'End':
            next = buttons.length - 1;
            break;
        default:
            return;
    }

    event.preventDefault();
    buttons[next].focus();
    buttons[next].click();
}

watch(active, (value) => emit('changed', value));

watch(
    tabs,
    (value) => {
        if (!value.find((tab) => tab.name === active.value && !tab.disabled)) {
            active.value = value.find((tab) => !tab.disabled)?.name ?? head(value).name;
        }
    },
    { deep: true }
);
</script>

<style scoped>
.inspector-dock {
    box-shadow: 0 4px 16px rgb(0 0 0 / 16%);
}

.inspector-footer::before {
    content: '';
    position: absolute;
    inset: auto 0 100%;
    height: 16px;
    pointer-events: none;
    background: linear-gradient(to top, var(--ui-chrome), transparent);
}
</style>
