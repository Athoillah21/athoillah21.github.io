# Athoillah's Portfolio

A modern, animated portfolio website with 3D Spline background, interactive glow effects, and multi-page structure.

## 🚀 Quick Start

**Option 1: VS Code Live Server**
1. Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → "Open with Live Server"

**Option 2: Python**
```bash
python -m http.server 3000
# Open http://localhost:3000
```

**Option 3: Node.js**
```bash
npx serve . -l 3000
```

---

## 📁 File Structure

```
atho-porto/
├── index.html              # Landing page (hero)
├── pages/
│   ├── about.html          # About Me + Resume
│   ├── projects.html       # Project showcase
│   ├── clients.html        # Client companies
│   └── contact.html        # Contact form
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles
│   ├── js/
│   │   ├── main.js         # Interactive effects
│   │   └── projects-manager.js  # Project management
│   └── images/             # Client logos
├── data/
│   └── projects.json       # Project data (JSON)
└── README.md
```

---

## ✏️ How to Update Data

### Update Personal Info
Edit `index.html`:
```html
<span>Athoillah's</span> Portfolio  <!-- Change name -->
<p>Database Administrator at Telkomsigma</p>  <!-- Change role -->
```

### Update About Me & Resume
Edit `pages/about.html`:
- **About text**: Modify the `<p>` tags in About Me section
- **Skills**: Add/remove `<span>` tags in "Areas of Expertise"
- **Work Experience**: Edit job entries in Resume section
- **CV Link**: Update the Google Drive URL

---

## 📂 Project Management

Projects are stored in `data/projects.json` and loaded dynamically.

### Project Data Structure

Each project object has the following fields:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier (e.g., `pg-growth`, `project-abc123`) |
| `title` | ✅ | Display name of the project |
| `description` | ✅ | Brief summary of the project |
| `image` | ❌ | URL to project image/screenshot |
| `icon` | ❌ | Lucide icon name (e.g., `database`, `cloud`, `mail`) |
| `imageText` | ❌ | Fallback text if no image/icon |
| `tags` | ✅ | Array of technology tags |
| `githubUrl` | ❌ | Link to GitHub repository |
| `mediumUrl` | ❌ | Link to article, demo, or live site |
| `status` | ✅ | Must be `"published"` to display |

### Available Icons

Icons use the [Lucide](https://lucide.dev/icons) library. Popular choices:
- `database`, `server`, `cloud`, `shield-check`
- `mail`, `send`, `code`, `terminal`
- `user`, `heart`, `sparkles`, `globe`

---

### ➕ How to Add a New Project

**Method 1: Edit JSON Directly**

1. Open `data/projects.json`
2. Add a new project object at the desired position:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "description": "A brief description of what this project does.",
  "image": "",
  "icon": "code",
  "tags": ["Python", "PostgreSQL", "Automation"],
  "githubUrl": "https://github.com/username/repo",
  "mediumUrl": "https://example.com/demo",
  "status": "published"
}
```

3. Save the file and refresh the projects page

**Method 2: Using Admin Panel**

1. Open `http://localhost:3000/pages/projects.html?admin=true`
2. Click "Add Project" button
3. Fill in the form and click "Publish"
4. Click "Export JSON" to copy the updated data
5. Paste into `data/projects.json`

---

### ❌ How to Delete a Project

1. Open `data/projects.json`
2. Find the project you want to delete
3. Remove the entire project object (including the curly braces `{}`)
4. Make sure there are no trailing commas after the last project
5. Save and refresh

**Example - Deleting a project:**

Before:
```json
{
  "projects": [
    { "id": "project-1", ... },
    { "id": "project-to-delete", ... },
    { "id": "project-3", ... }
  ]
}
```

After:
```json
{
  "projects": [
    { "id": "project-1", ... },
    { "id": "project-3", ... }
  ]
}
```

---

### 🔄 How to Reorder Projects

Projects display in the order they appear in `data/projects.json`. To reorder:

1. Open `data/projects.json`
2. Cut the project object you want to move
3. Paste it at the desired position
4. Save and refresh

---

### Add a Client Company
Edit `pages/clients.html`, copy a client card:
```html
<div class="bg-gray-900 ... " data-glow style="--base: 240; --sat: 80;">
  <img src="../assets/images/company.svg" alt="Company Name" 
       class="max-w-[80%] max-h-[80%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300">
</div>
```

Client logos should be placed in the `assets/images/` folder.

### Update Contact Email
Edit `pages/contact.html`:
```html
<form action="mailto:YOUR_EMAIL@example.com" ...>
```

---

## 🗑️ How to Delete Data

| Item | File | Action |
|------|------|--------|
| Project | `data/projects.json` | Remove project object |
| Client | `pages/clients.html` | Remove the client `<div>` |
| Skill | `pages/about.html` | Remove the `<span>` tag |
| Work Experience | `pages/about.html` | Remove the job `<div>` block |

---

## 🎨 Customization

### Change Glow Colors
Modify `--base` (hue) on `data-glow` elements:
- **Purple**: `--base: 270`
- **Blue**: `--base: 240`
- **Green**: `--base: 150`
- **Red**: `--base: 0`

### Change Theme Colors
Edit CSS variables in `assets/css/styles.css`:
```css
:root {
  --accent-purple: #5E6AD2;
  --surface: #101219;
}
```

---

## 📦 Dependencies (CDN)

- [Tailwind CSS](https://tailwindcss.com/)
- [Material Symbols](https://fonts.google.com/icons)
- [Font Awesome](https://fontawesome.com/)
- [Spline 3D](https://spline.design/)

---

## 📄 License

© 2025 Muhammad Atho'illah. All rights reserved.
