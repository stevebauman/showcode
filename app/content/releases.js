import workspaceRefresh from './releases/workspace-refresh.md?raw';
import workspacePreview from '@/assets/images/workspace-refresh.svg';

// Keep the newest release first. Set announce to false for maintenance releases.
export default [
    {
        id: 'workspace-refresh',
        version: '3.0.0',
        date: 'November 3, 2026',
        title: 'A refreshed workspace',
        description: 'More room for your code, with your tools close at hand.',
        announce: true,
        image: workspacePreview,
        imageAlt: 'The refreshed workspace with floating toolbars and a collapsible inspector.',
        content: workspaceRefresh,
    },
];
