import type { Page } from '../types';

export const generatePageUrl = (page: Page, pages: Page[]): string => {
    const urlParts: string[] = [];
    let currentPage: Page | undefined = page;

    while (currentPage) {
        // Only add to URL if not a dummy page
        if (!currentPage.isDummy) {
            urlParts.unshift(currentPage.urlPrefix || currentPage.slug);
        }
        currentPage = pages.find(p => p.id === currentPage?.parentId);
    }

    return '/' + urlParts.join('/');
};

export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export const validateSlug = (slug: string, existingSlugs: string[]): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && !existingSlugs.includes(slug);
};

export const generateBreadcrumbs = (page: Page, pages: Page[]): Array<{
    id: string;
    title: string;
    url: string;
    isDummy: boolean;
}> => {
    const breadcrumbs = [];
    let currentPage: Page | undefined = page;

    while (currentPage) {
        breadcrumbs.unshift({
            id: currentPage.id,
            title: currentPage.title,
            url: generatePageUrl(currentPage, pages),
            isDummy: currentPage.isDummy
        });
        currentPage = pages.find(p => p.id === currentPage?.parentId);
    }

    return breadcrumbs;
};