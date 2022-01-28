import { computed, ref, useContext } from '@nuxtjs/composition-api';

export default function () {
    const templates = ref([]);

    const { $memory, $config } = useContext();

    const sortedTemplates = computed(() =>
        templates.value.sort(
            (aTemplate, bTemplate) =>
                new Date(aTemplate.get('tab.created_at')) -
                new Date(bTemplate.get('tab.created_at'))
        )
    );

    const canAddNewTemplate = computed(() => $config.isDesktop || templates.value.length < 3);

    const fetchTemplates = async () => await $memory.templates.all();

    const loadTemplates = async () => (templates.value = await fetchTemplates());

    const removeTemplate = async (template) => {
        if (confirm('Delete Template?')) {
            await $memory.templates.remove(template.get('tab.id'));

            loadTemplates();
        }
    };

    return {
        loadTemplates,
        fetchTemplates,
        removeTemplate,
        canAddNewTemplate,
        templates: sortedTemplates,
    };
}
