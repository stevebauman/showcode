<template>
    <Toggle
        v-bind="$attrs"
        v-on="$listeners"
        popover-title="Social Badge Properties"
        settings-tooltip="Configure Social Badge"
    >
        <template #popover>
            <div class="flex flex-col divide-y divide-ui-gray-800 w-80">
                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Type </Label>

                    <Select
                        :value="socialType"
                        :options="types"
                        @input="$emit('update:social-type', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Position </Label>

                    <Select
                        :value="socialPosition"
                        :options="positions"
                        @input="$emit('update:social-position', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Username </Label>

                    <Input
                        size="sm"
                        type="text"
                        autocomplete="off"
                        :value="socialUsername"
                        @input="$emit('update:social-username', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Display Name </Label>

                    <Input
                        size="sm"
                        type="text"
                        autocomplete="off"
                        :value="socialDisplayName"
                        @input="$emit('update:social-display-name', $event)"
                    />
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script>
import useSocials from '@/composables/useSocials';

export default {
    props: {
        socialType: String,
        socialPosition: String,
        socialUsername: String,
        socialDisplayName: String,
    },

    setup: () => useSocials(),
};
</script>
