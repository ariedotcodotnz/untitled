import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { Block } from '../../../types';

interface GalleryImage {
    url: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
}

export interface GalleryBlockContent {
    images: GalleryImage[];
    layout: 'grid' | 'masonry' | 'carousel';
    columnCount?: number;
    gap?: number;
}

@customElement('site-gallery-block')
export class GalleryBlock extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        .gallery {
            position: relative;
            width: 100%;
        }
        .gallery-grid {
            display: grid;
            gap: var(--gallery-gap, 1rem);
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
        .gallery-masonry {
            column-count: var(--gallery-columns, 3);
            column-gap: var(--gallery-gap, 1rem);
        }
        .gallery-carousel {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: var(--gallery-gap, 1rem);
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }
        .gallery-carousel.dragging {
            scroll-behavior: auto;
        }
        .gallery-item {
            position: relative;
            cursor: pointer;
            overflow: hidden;
            border-radius: 0.375rem;
            break-inside: avoid;
        }
        .gallery-carousel .gallery-item {
            flex: 0 0 300px;
            scroll-snap-align: start;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        .gallery-item:hover img {
            transform: scale(1.05);
        }
        .gallery-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 0.875rem;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .gallery-item:hover .gallery-caption {
            opacity: 1;
        }
    `;

    @property({ type: Object })
    block!: Block;

    @state()
    private selectedImageIndex = -1;

    @state()
    private isDragging = false;

    @state()
    private startX = 0;

    public scrollLeft = 0;

    private handleDragStart(e: MouseEvent): void {
        const gallery = this.shadowRoot?.querySelector('.gallery-carousel') as HTMLElement;
        if (!gallery) return;

        this.isDragging = true;
        const rect = gallery.getBoundingClientRect();
        this.startX = e.pageX - rect.left;
        this.scrollLeft = gallery.scrollLeft;
    }

    private handleDragMove(e: MouseEvent): void {
        if (!this.isDragging) return;

        const gallery = this.shadowRoot?.querySelector('.gallery-carousel') as HTMLElement;
        if (!gallery) return;

        const rect = gallery.getBoundingClientRect();
        const x = e.pageX - rect.left;
        const walk = (x - this.startX) * 2;
        gallery.scrollLeft = this.scrollLeft - walk;
    }

    private handleDragEnd(): void {
        this.isDragging = false;
    }

    private renderImage(image: GalleryImage, index: number) {
        return html`
            <div 
                class="gallery-item"
                @click=${() => this.selectedImageIndex = index}
            >
                <img 
                    src=${image.url} 
                    alt=${image.alt}
                    loading="lazy"
                    width=${image.width || 'auto'}
                    height=${image.height || 'auto'}
                />
                ${image.caption ? html`
                    <div class="gallery-caption">${image.caption}</div>
                ` : null}
            </div>
        `;
    }

    override render() {
        const content = this.block.content as GalleryBlockContent;
        const images = content?.images || [];
        const layout = content?.layout || 'grid';
        const columnCount = content?.columnCount || 3;
        const gap = content?.gap || 1;

        const galleryStyles = {
            '--gallery-columns': `${columnCount}`,
            '--gallery-gap': `${gap}rem`
        };

        return html`
            <div class="gallery">
                <div 
                    class=${`gallery-${layout} ${this.isDragging ? 'dragging' : ''}`}
                    style=${styleMap(galleryStyles)}
                    @mousedown=${this.handleDragStart}
                    @mousemove=${this.handleDragMove}
                    @mouseup=${this.handleDragEnd}
                    @mouseleave=${this.handleDragEnd}
                >
                    ${images.map((image, index) =>
            this.renderImage(image, index)
        )}
                </div>
                ${this.selectedImageIndex >= 0 ? html`
                    <div 
                        class="lightbox"
                        @click=${() => this.selectedImageIndex = -1}
                    >
                        <div class="lightbox-content">
                            <img 
                                src=${images[this.selectedImageIndex].url}
                                alt=${images[this.selectedImageIndex].alt}
                            />
                            ${images[this.selectedImageIndex].caption ? html`
                                <div class="lightbox-caption">
                                    ${images[this.selectedImageIndex].caption}
                                </div>
                            ` : null}
                        </div>
                    </div>
                ` : null}
            </div>
        `;
    }
}