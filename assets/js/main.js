// Script for the interactive glow effect on cards (for both Projects and About sections)
const syncPointer = ({ x, y }) => {
    document.documentElement.style.setProperty('--px', x.toFixed(2));
    document.documentElement.style.setProperty('--py', y.toFixed(2));
    const posX = x;
    const posY = y;
    document.documentElement.style.setProperty('--x', `${posX}px`);
    document.documentElement.style.setProperty('--y', `${posY}px`);
};
document.body.addEventListener('pointermove', syncPointer);

// Function to scroll to a specific section
function showSection(sectionId) {
    let targetElement = null;

    if (sectionId === 'about-hero-content') {
        targetElement = document.getElementById('about-hero-content');
    } else if (sectionId === 'about-me-details') {
        targetElement = document.getElementById('detailed-about-content');
    } else if (sectionId === 'projects-section') {
        targetElement = document.getElementById('projects-section');
    } else if (sectionId === 'client-companies-section') {
        targetElement = document.getElementById('client-companies-section');
    } else if (sectionId === 'contact-section') {
        targetElement = document.getElementById('contact-section');
    }

    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize glow effects on nav links (called after sections are loaded)
function initNavGlow() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.target.style.setProperty('--x', `${x}px`);
            e.target.style.setProperty('--y', `${y}px`);
            e.target.style.setProperty('--spotlight-size', '100px');
            e.target.style.setProperty('--bg-spot-opacity', '0.2');
            e.target.style.setProperty('--border-spot-opacity', '0.5');
            e.target.style.setProperty('--border-light-opacity', '0.6');
            e.target.style.setProperty('--hue', '270');
            e.target.classList.add('data-glow-active');
        });
        link.addEventListener('mouseleave', (e) => {
            e.target.classList.remove('data-glow-active');
        });
    });
}
