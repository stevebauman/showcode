<template>
    <Modal v-bind="$attrs" v-on="$listeners" size="sm" class="space-y-4">
        <ModalTitle>Preferences</ModalTitle>

        <div class="mt-4 space-y-4">
            <div class="grid items-center grid-cols-3 gap-4">
                <Label> Editor Position </Label>

                <Select
                    dusk="select-orientation"
                    v-model="preferences.editorOrientation"
                    :options="['top', 'left', 'bottom', 'right']"
                />
            </div>

            <div class="grid items-center grid-cols-3 gap-4">
                <Label> Editor Language </Label>

                <Select
                    :options="languages"
                    dusk="select-language"
                    v-model="preferences.editorLanguage"
                />
            </div>

            <div class="grid items-center grid-cols-3 gap-4">
                <Label> Editor Tab Size </Label>

                <Select
                    :options="[2, 4]"
                    dusk="select-tab-size"
                    v-model="preferences.editorTabSize"
                />
            </div>

            <div class="grid items-center grid-cols-3 gap-4">
                <Label> Strip Initial PHP Tag </Label>

                <div class="flex items-center">
                    <Toggle v-model="preferences.stripIntialPhpTag" />

                    <div class="ml-2 text-sm text-ui-gray-500">
                        ({{ preferences.stripIntialPhpTag ? 'Yes' : 'No' }})
                    </div>
                </div>
            </div>

            <div class="h-0.5 -mx-6 bg-ui-gray-800"></div>

            <div>
                <Label> Initial Editor Value </Label>

                <div class="overflow-hidden rounded-lg">
                    <Monaco
                        :height="200"
                        :tab-size="preferences.editorTabSize"
                        :language="preferences.editorLanguage"
                        v-model="preferences.editorInitialValue"
                    />
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import { orderBy } from 'lodash';
import usePreferences from '../composables/usePreferences';
import { computed, useContext } from '@nuxtjs/composition-api';

export default {
    setup() {
        const { preferences } = usePreferences();

        const { $shiki } = useContext();

        const languages = computed(() => orderBy($shiki.languages()));

        return { languages, preferences };
    },
};
</script>
