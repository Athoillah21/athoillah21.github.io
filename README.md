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

### Method 1: Using the Admin Panel (Recommended)

1. **Open Admin Mode**:
   ```
   http://localhost:3000/pages/projects.html?admin=true
   ```

2. **Add a Project**:
   - Click "Add Project" button
   - Fill in the form:
     - **Title** - Project name
     - **Description** - Brief summary
     - **Image URL** - Logo or screenshot URL
     - **Fallback Text** - Text shown if no image
     - **GitHub URL** - Repository link
     - **Medium URL** - Article/demo link
     - **Tags** - Comma-separated (e.g., `Python, Flask, PostgreSQL`)
   - Click "Save as Draft" or "Publish"

3. **Export & Deploy**:
   - Click "Export JSON" → JSON copied to clipboard
   - Paste into `data/projects.json`
   - Commit and push to GitHub

### Method 2: Edit JSON Directly

Edit `data/projects.json`:
```json
{
  "projects": [
    {
      "id": "unique-id",
      "title": "Project Title",
      "description": "Brief description of the project",
      "image": "https://example.com/image.png",
      "imageText": "Fallback Text",
      "tags": ["Tag1", "Tag2", "Tag3"],
      "githubUrl": "https://github.com/...",
      "mediumUrl": "https://medium.com/...",
      "status": "published"
    }
  ]
}
```

### Delete a Project

1. Open `data/projects.json`
2. Remove the project object from the `projects` array
3. Save and deploy

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
