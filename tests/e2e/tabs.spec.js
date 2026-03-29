import { test, expect } from '@playwright/test';

const selectors = {
    tab: '[data-tab-id]',
    project: '[data-project-id]',
};

/**
 * Get all visible tabs from the page.
 */
function getTabs(page) {
    return page.evaluate((sel) => {
        return Array.from(document.querySelectorAll(sel)).map((tab) => ({
            id: tab.dataset.tabId,
            text: tab.textContent?.trim(),
            width: tab.offsetWidth,
            height: tab.offsetHeight,
            opacity: window.getComputedStyle(tab).opacity,
        }));
    }, selectors.tab);
}

/**
 * Get all visible projects from the page.
 */
function getProjects(page) {
    return page.evaluate((sel) => {
        return Array.from(document.querySelectorAll(sel)).map((project) => ({
            id: project.dataset.projectId,
            display: window.getComputedStyle(project).display,
            width: project.offsetWidth,
            height: project.offsetHeight,
        }));
    }, selectors.project);
}

/**
 * Click the add new tab button.
 */
async function addTab(page) {
    const addButton = page.locator('button:has(svg)', { hasText: '' }).filter({
        has: page.locator('.h-3\\.5.w-3\\.5'),
    });

    // Fallback: find the button next to the draggable container
    const button = page.locator('.flex.items-center.gap-0\\.5 > button').last();

    await button.click();

    await page.waitForTimeout(300);
}

/**
 * Close a tab by its index.
 */
async function closeTab(page, index) {
    const tab = page.locator(selectors.tab).nth(index);

    await tab.hover();

    // The close button has the `shrink-0 rounded-full` classes.
    const closeButton = tab.locator('button.shrink-0');

    await closeButton.click();

    await page.waitForTimeout(300);
}

test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh.
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1000);
});

test('displays one tab by default', async ({ page }) => {
    const tabs = await getTabs(page);

    expect(tabs).toHaveLength(1);
    expect(Number(tabs[0].opacity)).toBe(1);
    expect(tabs[0].width).toBeGreaterThan(0);
});

test('displays one project by default', async ({ page }) => {
    const projects = await getProjects(page);

    expect(projects).toHaveLength(1);
    expect(projects[0].width).toBeGreaterThan(0);
    expect(projects[0].height).toBeGreaterThan(0);
});

test('adds a new tab', async ({ page }) => {
    await addTab(page);

    const tabs = await getTabs(page);

    expect(tabs).toHaveLength(2);
    expect(tabs[0].id).not.toBe(tabs[1].id);
});

test('closes a tab and keeps the remaining tab visible', async ({ page }) => {
    await addTab(page);

    const tabsBefore = await getTabs(page);

    expect(tabsBefore).toHaveLength(2);

    await closeTab(page, 0);

    const tabsAfter = await getTabs(page);

    expect(tabsAfter).toHaveLength(1);
    expect(tabsAfter[0].id).toBe(tabsBefore[1].id);
    expect(Number(tabsAfter[0].opacity)).toBe(1);
    expect(tabsAfter[0].width).toBeGreaterThan(0);
});

test('keeps project content visible after closing a tab', async ({ page }) => {
    await addTab(page);

    await closeTab(page, 0);

    const projects = await getProjects(page);

    expect(projects).toHaveLength(1);
    expect(projects[0].width).toBeGreaterThan(0);
    expect(projects[0].height).toBeGreaterThan(0);
});

test('auto-creates a new tab when closing the only tab', async ({ page }) => {
    const tabsBefore = await getTabs(page);

    expect(tabsBefore).toHaveLength(1);

    await closeTab(page, 0);

    const tabsAfter = await getTabs(page);

    expect(tabsAfter).toHaveLength(1);
    expect(tabsAfter[0].id).not.toBe(tabsBefore[0].id);
    expect(Number(tabsAfter[0].opacity)).toBe(1);
});

test('switches to the next tab when closing the active tab', async ({ page }) => {
    await addTab(page);

    const tabs = await getTabs(page);

    // Click the first tab to make it active.
    await page.locator(selectors.tab).first().click();
    await page.waitForTimeout(300);

    await closeTab(page, 0);

    const tabsAfter = await getTabs(page);

    expect(tabsAfter).toHaveLength(1);
    expect(tabsAfter[0].id).toBe(tabs[1].id);
});

test('switches between tabs', async ({ page }) => {
    await addTab(page);

    const tabs = await getTabs(page);

    // Click the first tab.
    await page.locator(selectors.tab).first().click();
    await page.waitForTimeout(300);

    const activeProject = await page.evaluate((sel) => {
        const projects = document.querySelectorAll(sel);
        for (const p of projects) {
            if (window.getComputedStyle(p).display !== 'none' && p.offsetHeight > 0) {
                return p.dataset.projectId;
            }
        }
        return null;
    }, selectors.project);

    expect(activeProject).toBeTruthy();

    // Click the second tab.
    await page.locator(selectors.tab).nth(1).click();
    await page.waitForTimeout(300);

    const activeProjectAfter = await page.evaluate((sel) => {
        const projects = document.querySelectorAll(sel);
        for (const p of projects) {
            if (window.getComputedStyle(p).display !== 'none' && p.offsetHeight > 0) {
                return p.dataset.projectId;
            }
        }
        return null;
    }, selectors.project);

    expect(activeProjectAfter).toBeTruthy();
    expect(activeProjectAfter).not.toBe(activeProject);
});

