<template>
    <Modal v-bind="$attrs" v-on="$listeners" size="sm" class="space-y-4" header="Preferences">
        <div class="overflow-y-scroll max-h-[40rem] rounded-lg">
            <div class="mt-4 space-y-4">
                <FormGroup>
                    <Label>Editor Position</Label>

                    <Select
                        dusk="select-orientation"
                        v-model="preferences.editorOrientation"
                        :options="['top', 'left', 'bottom', 'right']"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Language</Label>

                    <Select
                        :options="languages"
                        dusk="select-language"
                        v-model="preferences.editorLanguage"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Editor Tab Size</Label>

                    <Select
                        :options="[2, 4]"
                        dusk="select-tab-size"
                        v-model="preferences.editorTabSize"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Strip Initial PHP Tag</Label>

                    <div class="flex items-center">
                        <Toggle v-model="preferences.stripIntialPhpTag" />

                        <div class="ml-2 text-sm text-ui-gray-500">
                            ({{ preferences.stripIntialPhpTag ? 'Yes' : 'No' }})
                        </div>
                    </div>
                </FormGroup>

                <FormDivider />

                <FormGroup>
                    <Label>Preview Theme</Label>

                    <Select v-model="preferences.previewThemeName" :options="$shiki.themes()" />
                </FormGroup>

                <FormGroup>
                    <Label>Preview Font Size</Label>

                    <Select v-model="preferences.previewFontSize" :options="fontSizes" />
                </FormGroup>

                <FormGroup>
                    <Label>Preview Font Family</Label>

                    <Select v-model="preferences.previewFontFamily" :options="fontFamilies" />
                </FormGroup>

                <FormGroup>
                    <Label>Line Height</Label>

                    <Select v-model="preferences.previewLineHeight" :options="lineHeights" />
                </FormGroup>

                <FormDivider />

                <FormGroup>
                    <Label>
                        Export Pixel Ratio
                        <br />
                        <span class="text-xs font-normal text-ui-gray-500">
                            Higher means larger export
                        </span>
                    </Label>

                    <Select v-model="preferences.exportPixelRatio" :options="[1, 2, 3, 4, 5]" />
                </FormGroup>

                <FormDivider />

                <FormGroup>
                    <Label>Reset All</Label>

                    <div>
                        <Button
                            variant="secondary"
                            size="xs"
                            class="border border-ui-gray-500"
                            @click.native="preferences.reset()"
                        >
                            Reset
                        </Button>
                    </div>
                </FormGroup>

                <FormDivider />

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
        </div>
    </Modal>
</template>

<script>
import { orderBy } from 'lodash';
import { computed, useContext } from '@nuxtjs/composition-api';
import { lineHeights, fontSizes, fontFamilies } from '../composables/usePreview';
import { default as usePreferencesStore, defaults } from '../composables/usePreferencesStore';

export default {
    setup() {
        const preferences = usePreferencesStore();

        const { $shiki } = useContext();

        const languages = computed(() => orderBy($shiki.languages()));

        return { languages, preferences, lineHeights, fontSizes, fontFamilies, defaults };
    },
};
</script>
