import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fileDialog } from 'file-select-dialog';
import { toast } from 'vue-sonner';
import useProjectStores from '~/composables/useProjectStores';

vi.mock('file-select-dialog', () => ({ fileDialog: vi.fn() }));
vi.mock('vue-sonner', () => ({ toast: { error: vi.fn() } }));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('project imports', () => {
    it('opens an older configuration with complete editor and preview settings', async () => {
        const source = {
            tab: { name: 'Imported project' },
            page: { orientation: 'landscape', editors: [{ value: 'imported code' }] },
            settings: { fontSize: 24 },
        };
        fileDialog.mockResolvedValue([JSON.stringify(source)]);
        const { projects, importNewProject } = useProjectStores();

        await importNewProject();

        expect(projects.value).toHaveLength(1);
        expect(projects.value[0].tab.kind).toBe('project');
        expect(projects.value[0].tab.name).toBe('Imported project');
        expect(projects.value[0].page.orientation).toBe('left');
        expect(projects.value[0].page.editors[0]).toMatchObject({
            id: expect.any(String),
            value: 'imported code',
            added: [],
            removed: [],
            focused: [],
        });
        expect(projects.value[0].settings.fontSize).toBe(24);
        expect(projects.value[0].settings.borderColor).toBeDefined();
        expect(toast.error).not.toHaveBeenCalled();
        projects.value[0].$dispose();
    });

    it.each(['{', '{"page":{}}', '{"tab":{},"page":{"editors":"invalid"},"settings":{}}'])(
        'rejects invalid input without creating a tab: %s',
        async (content) => {
            fileDialog.mockResolvedValue([content]);
            const { projects, importNewProject } = useProjectStores();

            await importNewProject();

            expect(projects.value).toHaveLength(0);
            expect(toast.error).toHaveBeenCalledOnce();
        }
    );
});
