<template>
    <Dialog :open="Boolean(project)" @update:open="handleOpenChange">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>Save project before closing?</DialogTitle>
                <DialogDescription>
                    Save it to keep it available from Open..., discard it to close only this tab, or
                    cancel to keep working.
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
