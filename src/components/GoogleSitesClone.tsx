import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Search } from 'lucide-react';

// Components
import Navbar from './Navbar/Editor';
import { EditorPlate } from './BlockEditor/EditorPlate';
import { ThemeEditor } from './ThemeEditor';
import { PageSettingsEditor } from './PageSettings';
import { BlockLibrary } from './BlockLibrary';

// Hooks and Utils
import { useToast } from '../hooks/useToast';
import { useSiteData } from '../hooks/useSiteData';
import { useAuth } from '../hooks/useAuth';
import { useEditor } from './integration/hooks/useEditor';
import { defaultValue } from './defaultValues';
import { createBlockFromTemplate } from './BlockEditor/blockTemplates';
import { createBlocksFromCombination } from './BlockEditor/blockCombination';
import { pageToPageSettings } from '../types';

// Types
import type { Site, Page, Theme, PageSettings } from '../types';

const defaultSite: Site = {
    id: '1',
    name: 'Untitled Site',
    pages: [],
    theme: {
        id: '1',
        name: 'Default',
        colors: {
            primary: '#3B82F6',
            secondary: '#6B7280',
            accent: '#10B981',
            background: {
                primary: '#FFFFFF',
                secondary: '#F3F4F6',
                accent: '#F0FDF4'
            },
            text: {
                primary: '#1F2937',
                secondary: '#4B5563',
                accent: '#059669',
                inverse: '#FFFFFF'
            }
        },
        fonts: {
            heading: 'Inter',
            body: 'Inter'
        }
    }
};

export const GoogleSitesClone: React.FC = () => {
    // Core state
    const [site, setSite] = useState<Site>(defaultSite);
    const [currentPage, setCurrentPage] = useState<Page | null>(defaultValue);
    const [activeTab, setActiveTab] = useState<'insert' | 'pages' | 'themes'>('insert');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [rightPanelOpen] = useState(true);

    // Hooks
    const { toast } = useToast();
    const { user } = useAuth();
    const { getSiteData, saveSite } = useSiteData();

    // Editor state handlers
    const handleSiteUpdate = useCallback((updates: Partial<Site>) => {
        setSite(prev => ({ ...prev, ...updates }));
    }, []);

    const handlePageUpdate = useCallback((pageId: string, updates: Partial<Page>) => {
        setSite(prev => ({
            ...prev,
            pages: prev.pages.map(p =>
                p.id === pageId ? { ...p, ...updates } : p
            )
        }));
    }, []);

    // Block handlers
    const handleBlockSelect = useCallback((templateId: string) => {
        if (!currentPage) return;
        const newBlock = createBlockFromTemplate(templateId);
        if (!newBlock) return;

        handlePageUpdate(currentPage.id, {
            content: [...(currentPage.content || []), newBlock],
            updatedAt: new Date()
        });
    }, [currentPage, handlePageUpdate]);

    const handleCombinationSelect = useCallback((combinationId: string) => {
        if (!currentPage) return;
        const newBlocks = createBlocksFromCombination(combinationId);
        if (!newBlocks.length) return;

        handlePageUpdate(currentPage.id, {
            content: [...(currentPage.content || []), ...newBlocks],
            updatedAt: new Date()
        });
    }, [currentPage, handlePageUpdate]);

    // Page settings handlers
    const handlePageSettingsUpdate = useCallback((newPageSettings: PageSettings[]) => {
        const updatedPages = newPageSettings.map(setting => {
            const existingPage = site.pages.find(p => p.id === setting.id);
            if (existingPage) {
                return {
                    ...existingPage,
                    title: setting.title,
                    urlPrefix: setting.urlPrefix,
                    showInNav: setting.showInNav,
                    parentId: setting.parentId,
                    isDummy: setting.isDummy,
                    order: setting.order,
                    children: setting.children,
                    headerConfig: setting.headerConfig,
                    footerConfig: setting.footerConfig
                };
            }
            // Create new page
            return {
                ...setting,
                slug: setting.urlPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                content: [],
                isPublished: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        handleSiteUpdate({ pages: updatedPages });
    }, [site.pages, handleSiteUpdate]);

    const handlePageDelete = useCallback((pageId: string) => {
        if (!window.confirm('Are you sure you want to delete this page?')) return;

        setSite(prev => ({
            ...prev,
            pages: prev.pages.filter(p => p.id !== pageId)
        }));

        if (currentPage?.id === pageId) {
            setCurrentPage(null);
        }
    }, [currentPage]);

    // Theme handler
    const handleThemeChange = useCallback((theme: Theme) => {
        handleSiteUpdate({ theme });
    }, [handleSiteUpdate]);

    // Render tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'insert':
                return (
                    <BlockLibrary
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onBlockSelect={handleBlockSelect}
                        onCombinationSelect={handleCombinationSelect}
                    />
                );
            case 'pages':
                if (!site) return null;
                return (
                    <PageSettingsEditor
                        pages={site.pages
                            .filter(page => page.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(pageToPageSettings)}
                        onUpdate={handlePageSettingsUpdate}
                        onDeletePage={handlePageDelete}
                        currentPage={currentPage}
                        onPageSelect={setCurrentPage}
                    />
                );
            case 'themes':
                if (!site) return null;
                return (
                    <ThemeEditor
                        currentTheme={site.theme}
                        onThemeChange={handleThemeChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen bg-white">
                <Navbar />

                {/* Main Content Area */}
                <div className="flex-1 mt-16">
                    <EditorPlate
                        blocks={currentPage?.content || []}
                        onBlocksChange={(newBlocks) => {
                            if (!currentPage) return;
                            handlePageUpdate(currentPage.id, {
                                content: newBlocks,
                                updatedAt: new Date()
                            });
                        }}
                        isDragging={isDragging}
                        onDraggingChange={setIsDragging}
                    />
                </div>

                {/* Right Sidebar */}
                <div className={`fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 
                    transform transition-transform duration-300 ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Tab Buttons */}
                        <div className="border-b border-gray-200">
                            <div className="flex p-2 space-x-1">
                                {['insert', 'pages', 'themes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as typeof activeTab)}
                                        className={`flex-1 px-4 py-2 text-sm rounded transition-colors capitalize 
                                            ${activeTab === tab ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search and Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search blocks and pages"
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded"
                                    />
                                </div>
                            </div>
                            {renderTabContent()}
                        </div>
                    </div>
                </div>

                {/* Toast Container */}
                <div className="fixed bottom-4 right-4 z-50" />
            </div>
        </DndProvider>
    );
};