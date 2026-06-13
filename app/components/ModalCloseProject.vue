<template>
    <Dialog :open="Boolean(project)" @update:open="handleOpenChange">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>Save project before closing?</DialogTitle>
                <DialogDescription>
                    This project has unsaved changes. Save it to reopen later, discard the changes,
                    or keep it open.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <Button variant="ghost" @click="$emit('cancel')">Cancel</Button>
                <Button variant="outline" @click="$emit('discard')">Discard</Button>
                <Button @click="$emit('save')">Save Project</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
defineProps({
    project: { type: Object, default: null },
});

const emit = defineEmits(['cancel', 'discard', 'save']);

function handleOpenChange(open) {
    if (!open) {
        emit('cancel');
    }
}
</script>
