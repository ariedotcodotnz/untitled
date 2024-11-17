import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Block } from '../../../types';

@customElement('site-embed-block')
export class EmbedBlock extends LitElement {
    @property({ type: Object }) block!: Block;
    @state() private isEditing = false;
    @state() private error: string | null = null;

    static styles = css`
        :host {
            display: block;
        }
        .embed-wrapper {
            position: relative;
            width: 100%;
        }
        .embed-content {
            width: 100%;
            min-height: 100px;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            overflow: hidden;
        }
        .embed-editor {
            width: 100%;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            font-family: monospace;
            min-height: 100px;
            resize: vertical;
        }
        .error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        .toolbar {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        button {
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
        }
        button:hover {
            background: #e5e7eb;
        }
    `;

    private validateHTML(html: string): boolean {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return !doc.querySelector('parsererror');
    }

    private handleSave() {
        const content = this.block.content;
        if (!this.validateHTML(content)) {
            this.error = 'Invalid HTML. Please check your code.';
            return;
        }

        this.error = null;
        this.isEditing = false;
        this.dispatchEvent(new CustomEvent('block-update', {
            detail: { ...this.block },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.isEditing) {
            return html`
                <div class="embed-wrapper">
                    <textarea
                        class="embed-editor"
                        .value=${this.block.content}
                        @input=${(e: InputEvent) => {
                const textarea = e.target as HTMLTextAreaElement;
                this.block = {
                    ...this.block,
                    content: textarea.value
                };
            }}
                    ></textarea>
                    ${this.error ? html`<div class="error">${this.error}</div>` : null}
                    <div class="toolbar">
                        <button @click=${this.handleSave}>Save</button>
                        <button @click=${() => this.isEditing = false}>Cancel</button>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="embed-wrapper">
                <div 
                    class="embed-content"
                    @click=${() => this.isEditing = true}
                >
                    <div .innerHTML=${this.block.content}></div>
                </div>
            </div>
        `;
    }
}