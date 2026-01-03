// Notes Manager - Handle notes CRUD operations
const NotesManager = {
    notes: [],
    currentNoteId: null,
    isEditing: false,

    // Initialize
    async init() {
        await this.loadFromJSON();
        this.loadNotes();
        this.renderNotesList();
    },

    // Load notes from JSON file (repo)
    async loadFromJSON() {
        try {
            const response = await fetch('../data/notes.json');
            if (response.ok) {
                const data = await response.json();
                if (data.notes && data.notes.length > 0) {
                    // Merge with localStorage (localStorage takes priority for newer updates)
                    const localNotes = JSON.parse(localStorage.getItem('portfolio-notes') || '[]');
                    const localIds = new Set(localNotes.map(n => n.id));

                    // Add JSON notes that don't exist in localStorage
                    data.notes.forEach(jsonNote => {
                        if (!localIds.has(jsonNote.id)) {
                            localNotes.push(jsonNote);
                        }
                    });

                    this.notes = localNotes;
                    this.saveToStorage();
                }
            }
        } catch (e) {
            console.log('No notes.json found or error loading:', e);
        }
    },

    // Load notes from localStorage
    loadNotes() {
        const saved = localStorage.getItem('portfolio-notes');
        if (saved) {
            this.notes = JSON.parse(saved);
        }
    },

    // Save notes to localStorage
    saveToStorage() {
        localStorage.setItem('portfolio-notes', JSON.stringify(this.notes));
    },

    // Export notes to JSON (for saving to repo)
    exportToJSON() {
        const exportData = {
            notes: this.notes
        };
        const jsonStr = JSON.stringify(exportData, null, 2);

        navigator.clipboard.writeText(jsonStr).then(() => {
            this.showToast('JSON copied! Paste into data/notes.json', 'success');
        }).catch(err => {
            // Fallback: show in textarea
            const textarea = document.createElement('textarea');
            textarea.value = jsonStr;
            textarea.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:60%;z-index:9999;background:#1a1a2e;color:#fff;padding:1rem;border-radius:8px;font-family:monospace;';
            document.body.appendChild(textarea);
            textarea.select();
            this.showToast('Copy the JSON, then press Escape to close', 'success');
            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    textarea.remove();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    },

    // Generate unique ID
    generateId() {
        return 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    // Render notes list in sidebar
    renderNotesList() {
        const container = document.getElementById('notes-list-items');
        const countEl = document.getElementById('notes-count');

        if (!container) return;

        countEl.textContent = this.notes.length;

        if (this.notes.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">No notes yet</p>';
            return;
        }

        container.innerHTML = this.notes.map((note, index) => `
            <div onclick="NotesManager.viewNote('${note.id}')" 
                 class="note-item group flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${this.currentNoteId === note.id ? 'bg-purple-600/30 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent hover:border-white/10'}"
                 style="animation: fadeInUp 0.3s ease-out ${index * 0.05}s both;">
                <span class="material-symbols-outlined text-purple-400 text-lg mt-0.5">article</span>
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-white truncate">${this.escapeHtml(note.title)}</h4>
                    <p class="text-xs text-gray-500 truncate mt-0.5">${this.getPreview(note.content)}</p>
                    <span class="text-xs text-gray-600 mt-1 block">${this.formatDate(note.updatedAt)}</span>
                </div>
            </div>
        `).join('');
    },

    // Get preview text from markdown
    getPreview(content) {
        const text = content.replace(/[#*_`\[\]]/g, '').trim();
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
    },

    // Format date
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // View a note
    viewNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.currentNoteId = noteId;
        this.isEditing = false;

        // Hide other views
        document.getElementById('notes-empty-state').classList.add('hidden');
        document.getElementById('note-edit-mode').classList.add('hidden');

        // Show view mode
        const viewMode = document.getElementById('note-view-mode');
        viewMode.classList.remove('hidden');

        // Populate content
        document.getElementById('view-note-title').textContent = note.title;
        document.getElementById('view-note-content').innerHTML = marked.parse(note.content);
        document.getElementById('view-note-date').textContent = `Last updated: ${new Date(note.updatedAt).toLocaleString()}`;

        // Update sidebar selection
        this.renderNotesList();
    },

    // Open editor (new or edit)
    openEditor(noteId = null) {
        this.isEditing = true;

        // Hide other views
        document.getElementById('notes-empty-state').classList.add('hidden');
        document.getElementById('note-view-mode').classList.add('hidden');

        // Show edit mode
        const editMode = document.getElementById('note-edit-mode');
        editMode.classList.remove('hidden');

        if (noteId) {
            // Edit existing note
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                this.currentNoteId = noteId;
                document.getElementById('edit-note-title').value = note.title;
                document.getElementById('edit-note-content').value = note.content;
            }
        } else {
            // New note
            this.currentNoteId = null;
            document.getElementById('edit-note-title').value = '';
            document.getElementById('edit-note-content').value = '';
        }

        // Reset to write tab
        this.switchTab('write');

        // Focus title
        document.getElementById('edit-note-title').focus();
    },

    // Edit current note
    editNote() {
        if (this.currentNoteId) {
            this.openEditor(this.currentNoteId);
        }
    },

    // Save note
    saveNote() {
        const title = document.getElementById('edit-note-title').value.trim();
        const content = document.getElementById('edit-note-content').value.trim();

        if (!title) {
            this.showToast('Please enter a title', 'error');
            return;
        }

        const now = Date.now();

        if (this.currentNoteId) {
            // Update existing note
            const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
            if (noteIndex !== -1) {
                this.notes[noteIndex].title = title;
                this.notes[noteIndex].content = content;
                this.notes[noteIndex].updatedAt = now;
            }
        } else {
            // Create new note
            const newNote = {
                id: this.generateId(),
                title,
                content,
                createdAt: now,
                updatedAt: now
            };
            this.notes.unshift(newNote);
            this.currentNoteId = newNote.id;
        }

        this.saveToStorage();
        this.renderNotesList();
        this.viewNote(this.currentNoteId);
        this.showToast('Note saved successfully!', 'success');
    },

    // Cancel editing
    cancelEdit() {
        if (this.currentNoteId) {
            this.viewNote(this.currentNoteId);
        } else {
            document.getElementById('note-edit-mode').classList.add('hidden');
            document.getElementById('notes-empty-state').classList.remove('hidden');
        }
        this.isEditing = false;
    },

    // Delete note
    deleteNote() {
        if (!this.currentNoteId) return;

        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
            this.saveToStorage();
            this.currentNoteId = null;
            this.renderNotesList();

            // Show empty state or first note
            if (this.notes.length > 0) {
                this.viewNote(this.notes[0].id);
            } else {
                document.getElementById('note-view-mode').classList.add('hidden');
                document.getElementById('notes-empty-state').classList.remove('hidden');
            }

            this.showToast('Note deleted', 'success');
        }
    },

    // Switch editor tabs
    switchTab(tab) {
        const writeTab = document.getElementById('tab-write');
        const previewTab = document.getElementById('tab-preview');
        const writePanel = document.getElementById('editor-write');
        const previewPanel = document.getElementById('editor-preview');

        if (tab === 'write') {
            writeTab.classList.add('text-white', 'bg-white/5', 'border-b-2', 'border-purple-500');
            writeTab.classList.remove('text-gray-400');
            previewTab.classList.remove('text-white', 'bg-white/5', 'border-b-2', 'border-purple-500');
            previewTab.classList.add('text-gray-400');
            writePanel.classList.remove('hidden');
            previewPanel.classList.add('hidden');
        } else {
            previewTab.classList.add('text-white', 'bg-white/5', 'border-b-2', 'border-purple-500');
            previewTab.classList.remove('text-gray-400');
            writeTab.classList.remove('text-white', 'bg-white/5', 'border-b-2', 'border-purple-500');
            writeTab.classList.add('text-gray-400');
            previewPanel.classList.remove('hidden');
            writePanel.classList.add('hidden');

            // Render markdown preview
            const content = document.getElementById('edit-note-content').value;
            previewPanel.innerHTML = content ? marked.parse(content) : '<p class="text-gray-500 italic">Nothing to preview</p>';
        }
    },

    // Import TXT/MD file
    importFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const title = file.name.replace(/\.(txt|md)$/i, '');

            const now = Date.now();
            const newNote = {
                id: this.generateId(),
                title,
                content,
                createdAt: now,
                updatedAt: now
            };

            this.notes.unshift(newNote);
            this.saveToStorage();
            this.renderNotesList();
            this.viewNote(newNote.id);
            this.showToast(`Imported "${title}"`, 'success');
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    },

    // Show toast notification
    showToast(message, type = 'success') {
        // Remove existing toast
        const existing = document.getElementById('notes-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'notes-toast';
        toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-scale-in ${type === 'success' ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'
            }`;
        toast.innerHTML = `
            <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'scale(0.9)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    NotesManager.init();
});
