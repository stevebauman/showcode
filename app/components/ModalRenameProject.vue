<template>
    <Dialog :open="Boolean(project)" @update:open="handleOpenChange">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>
                    {{ description }}
                </DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="rename">
                <Input ref="input" v-model="name" />

                <DialogFooter>
                    <Button type="button" variant="ghost" @click="$emit('cancel')">Cancel</Button>
                    <Button type="submit">{{ action }}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';

const props = defineProps({
    project: { type: Object, default: null },
    title: { type: String, default: 'Rename Project' },
    description: {
        type: String,
        default: 'Update the project name shown in tabs and saved projects.',
    },
    action: { type: String, default: 'Rename' },
});

const emit = defineEmits(['cancel', 'rename']);

const input = ref(null);
const name = ref('');

watch(
    () => props.project,
    (project) => {
        name.value = project?.tab?.name || '';

        if (project) {
            nextTick(() => input.value?.$el?.focus?.());
        }
    }
);

function rename() {
    const newName = name.value.trim();

    if (newName) {
        emit('rename', newName);
    }
}

function handleOpenChange(open) {
    if (!open) {
        emit('cancel');
    }
}
</script>
