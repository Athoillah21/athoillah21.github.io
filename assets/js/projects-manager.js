// Projects Manager - JSON-based project management
const ProjectsManager = {
    projects: [],
    drafts: [],
    isAdmin: false,

    // Initialize the manager
    init() {
        this.isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';
        this.loadDrafts();
        this.loadProjects();
        this.setupEventListeners();
    },

    // Load projects from JSON file
    async loadProjects() {
        try {
            const response = await fetch('../data/projects.json');
            const data = await response.json();
            this.projects = data.projects.filter(p => p.status === 'published');
            this.renderProjects();

            if (this.isAdmin) {
                this.showAdminControls();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.renderError();
        }
    },

    // Load drafts from localStorage
    loadDrafts() {
        const saved = localStorage.getItem('projectDrafts');
        if (saved) {
            this.drafts = JSON.parse(saved);
        }
    },

    // Save drafts to localStorage
    saveDrafts() {
        localStorage.setItem('projectDrafts', JSON.stringify(this.drafts));
    },

    // Render all projects
    renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        // Combine published projects and drafts (for admin)
        let allProjects = [...this.projects];
        if (this.isAdmin) {
            allProjects = [...allProjects, ...this.drafts];
        }

        if (allProjects.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center col-span-2">No projects yet. Add your first project!</p>';
            return;
        }

        container.innerHTML = allProjects.map(project => this.renderProjectCard(project)).join('');

        // Initialize Lucide icons after rendering
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    // Render a single project card
    renderProjectCard(project) {
        const isDraft = project.status === 'draft';
        const tagsHtml = project.tags.map(tag =>
            `<span class="px-3 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700/50">${tag}</span>`
        ).join('');

        // Determine image section content
        let imageSection;
        if (project.image) {
            imageSection = `<img src="${project.image}" alt="${project.title}" class="h-full w-auto object-contain" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'text-4xl font-bold text-purple-400\\'>${project.imageText || project.title}</div>'">`;
        } else if (project.icon) {
            imageSection = `<i data-lucide="${project.icon}" class="w-20 h-20 text-purple-400"></i>`;
        } else {
            imageSection = `<div class="text-4xl font-bold text-purple-400">${project.imageText || project.title}</div>`;
        }

        return `
            <div class="bg-gray-900 bg-opacity-80 rounded-xl border ${isDraft ? 'border-yellow-600' : 'border-gray-800'} overflow-hidden backdrop-blur-sm hover:transform hover:scale-[1.02] transition-all duration-300 relative"
                data-glow style="--base: 260; --sat: 80;">
                ${isDraft ? '<div class="absolute top-2 right-2 bg-yellow-600 text-black text-xs px-2 py-1 rounded font-medium">DRAFT</div>' : ''}
                <div class="w-full h-56 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                    ${imageSection}
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-medium mb-3 text-white">${project.title}</h3>
                    <p class="text-gray-400 mb-4 leading-relaxed">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${tagsHtml}
                    </div>
                    <div class="flex space-x-4">
                        ${project.mediumUrl ? `
                            <a href="${project.mediumUrl}" target="_blank"
                                class="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                                <span class="material-symbols-outlined mr-1 text-sm">open_in_new</span>
                                View Project
                            </a>
                        ` : ''}
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" target="_blank"
                                class="flex items-center text-gray-400 hover:text-white transition-colors">
                                <i class="fab fa-github mr-1"></i>
                                Source Code
                            </a>
                        ` : ''}
                        ${this.isAdmin && isDraft ? `
                            <button onclick="ProjectsManager.deleteDraft('${project.id}')"
                                class="flex items-center text-red-400 hover:text-red-300 transition-colors ml-auto">
                                <span class="material-symbols-outlined mr-1 text-sm">delete</span>
                                Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    // Show admin controls
    showAdminControls() {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.classList.remove('hidden');
        }
    },

    // Open add project modal
    openModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('project-form').reset();
            document.getElementById('project-id').value = '';
        }
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    // Save project (as draft or published)
    saveProject(asDraft = false) {
        const form = document.getElementById('project-form');
        const formData = new FormData(form);

        const project = {
            id: document.getElementById('project-id').value || this.generateId(),
            title: formData.get('title'),
            description: formData.get('description'),
            image: formData.get('image'),
            imageText: formData.get('imageText'),
            tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t),
            githubUrl: formData.get('githubUrl'),
            mediumUrl: formData.get('mediumUrl'),
            status: asDraft ? 'draft' : 'published'
        };

        if (asDraft) {
            // Save to drafts
            const existingIndex = this.drafts.findIndex(d => d.id === project.id);
            if (existingIndex >= 0) {
                this.drafts[existingIndex] = project;
            } else {
                this.drafts.push(project);
            }
            this.saveDrafts();
        } else {
            // Add to projects for export
            const existingDraftIndex = this.drafts.findIndex(d => d.id === project.id);
            if (existingDraftIndex >= 0) {
                this.drafts.splice(existingDraftIndex, 1);
                this.saveDrafts();
            }
            this.projects.push(project);
        }

        this.renderProjects();
        this.closeModal();

        if (!asDraft) {
            alert('Project saved! Click "Export JSON" to copy the data for your projects.json file.');
        }
    },

    // Delete a draft
    deleteDraft(id) {
        if (confirm('Delete this draft?')) {
            this.drafts = this.drafts.filter(d => d.id !== id);
            this.saveDrafts();
            this.renderProjects();
        }
    },

    // Generate unique ID
    generateId() {
        return 'project-' + Date.now().toString(36);
    },

    // Export all projects as JSON
    exportJSON() {
        const allProjects = [...this.projects, ...this.drafts.map(d => ({ ...d, status: 'published' }))];
        const exportData = {
            projects: allProjects
        };
        const jsonStr = JSON.stringify(exportData, null, 2);

        navigator.clipboard.writeText(jsonStr).then(() => {
            alert('JSON copied to clipboard! Paste it into data/projects.json');
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback: show in textarea
            const textarea = document.createElement('textarea');
            textarea.value = jsonStr;
            textarea.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:60%;z-index:9999;';
            document.body.appendChild(textarea);
            textarea.select();
            alert('Copy the JSON from the textarea that appeared, then press Escape to close');
            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    textarea.remove();
                    document.removeEventListener('keydown', handler);
                }
            });
        });
    },

    // Render error state
    renderError() {
        const container = document.getElementById('projects-container');
        if (container) {
            container.innerHTML = '<p class="text-red-400 text-center col-span-2">Error loading projects. Please try again.</p>';
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Close modal on outside click
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ProjectsManager.init();
});
