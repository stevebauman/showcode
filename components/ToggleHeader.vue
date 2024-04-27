<template>
    <Toggle
        v-bind="$attrs"
        v-on="$listeners"
        popover-title="Header Properties"
        settings-tooltip="Configure Header"
    >
        <template #popover>
            <div class="grid grid-cols-2 grid-rows-2">
                <div class="flex items-center justify-between border-r border-b gap-2 p-2">
                    <Label> Title </Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-title"
                            :value="showTitle"
                            @input="$emit('update:show-title', $event)"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between border-b gap-2 p-2">
                    <Label> Accent </Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-header-accent"
                            :value="showHeaderAccent"
                            @input="$emit('update:show-header-accent', $event)"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between border-r gap-2 p-2">
                    <Label class="whitespace-nowrap"> Menu </Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-color-menu"
                            :value="showMenu"
                            @input="$emit('update:show-menu', $event)"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between gap-2 p-2">
                    <Label class="whitespace-nowrap"> Menu Color </Label>

                    <div class="flex items-center">
                        <Toggle
                            dusk="toggle-color-menu"
                            :value="showColorMenu"
                            @input="$emit('update:show-color-menu', $event)"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script>
export default {
    props: {
        showTitle: {
            type: Boolean,
            required: true,
        },
        showMenu: {
            type: Boolean,
            required: true,
        },
        showColorMenu: {
            type: Boolean,
            required: true,
        },
        showHeaderAccent: {
            type: Boolean,
            required: true,
        },
    },
};
</script>
