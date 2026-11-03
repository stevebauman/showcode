<template>
    <div class="property-field">
        <Label :for="id">{{ label }}</Label>
        <div class="property-field-control">
            <slot :id="id" />
        </div>
    </div>
</template>

<script setup>
import { useId } from 'vue';

defineProps({ label: { type: String, required: true } });

const id = useId();
</script>
