<template>
    <div class="flex items-stretch shadow group overflow-hidden rounded-lg">
        <Button
            size="xs"
            class="rounded-l-lg"
            dusk="button-fit-to-window"
            :rounded="false"
            @click.native="$emit('apply')"
        >
            <MinimizeIcon class="w-4 h-4" />
            <span class="hidden md:inline">Fit to Window</span>
        </Button>

        <ButtonLock
            size="xs"
            dusk="button-lock-fit-to-window"
            :rounded="false"
            :locked="lockWindowSize"
            :class="{ 'rounded-r-lg': !lockWindowSize }"
            v-tooltip="lockWindowSize ? 'Unlock Fit to Window' : 'Lock Fit to Window'"
            @click.native="$emit('update:lock-window-size', !lockWindowSize)"
        />

        <Popover title="Fitting Properties">
            <template #trigger>
                <Button
                    v-if="lockWindowSize"
                    size="xs"
                    class="rounded-r-lg"
                    dusk="button-lock-fit-to-window-settings"
                    :rounded="false"
                >
                    <SettingsIcon class="w-4 h-4" />
                </Button>
            </template>

            <div dusk="popover-fit-to-window" class="flex flex-col divide-y divide-ui-gray-800">
                <div class="grid grid-cols-2 gap-2 divide-x divide-ui-gray-800">
                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Padding X </Label>

                        <Input
                            size="sm"
                            type="number"
                            class="w-16 text-center"
                            :value="lockWindowPaddingX"
                            dusk="input-fit-to-window-padding-x"
                            @input="$emit('update:lock-window-padding-x', $event)"
                        />
                    </div>

                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Padding Y </Label>

                        <Input
                            size="sm"
                            type="number"
                            class="w-16 text-center"
                            :value="lockWindowPaddingY"
                            dusk="input-fit-to-window-padding-y"
                            @input="$emit('update:lock-window-padding-y', $event)"
                        />
                    </div>
                </div>
            </div>
        </Popover>
    </div>
</template>

<script>
import { MinimizeIcon, SettingsIcon } from 'vue-feather-icons';

export default {
    props: {
        lockWindowSize: {
            type: Boolean,
            required: true,
        },
        lockWindowPaddingX: {
            type: Number,
            required: true,
        },
        lockWindowPaddingY: {
            type: Number,
            required: true,
        },
    },

    components: { MinimizeIcon, SettingsIcon },
};
</script>
