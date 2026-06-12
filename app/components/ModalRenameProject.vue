<template>
    <Dialog :open="Boolean(project)" @update:open="handleOpenChange">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>Rename project</DialogTitle>
                <DialogDescription>
                    Update the project name shown in tabs and saved projects.
                </DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="rename">
                <Input ref="input" v-model="name" />

                <DialogFooter>
                    <Button type="button" variant="ghost" @click="$emit('cancel')">Cancel</Button>
                    <Button type="submit">Rename</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';

const props = defineProps({
    project: { type: Object, default: null },
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
