// Modern Galaxy Page Transition Loader
const GalaxyLoader = {
    loader: null,

    init() {
        this.loader = document.getElementById('galaxy-loader');
        if (!this.loader) return;

        this.createOrbitingParticles(6);
        this.createMicroStars(20);
        this.setupPageLoad();
        this.setupNavigationLinks();
    },

    // Create orbiting particles around the core
    createOrbitingParticles(count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const angle = (360 / count) * i;
            const radius = 25 + (i % 2) * 10;
            particle.style.setProperty('--start-angle', `${angle}deg`);
            particle.style.setProperty('--orbit-radius', `${radius}px`);
            particle.style.animationDuration = `${1.5 + (i * 0.15)}s`;
            particle.style.width = `${2 + (i % 2)}px`;
            particle.style.height = `${2 + (i % 2)}px`;
            this.loader.appendChild(particle);
        }
    },

    // Create subtle background stars
    createMicroStars(count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            star.style.animationDuration = `${1.5 + Math.random()}s`;
            this.loader.appendChild(star);
        }
    },

    setupPageLoad() {
        const minDisplayTime = 800;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDisplayTime - elapsed);
            setTimeout(() => this.hide(), remaining);
        });
    },

    setupNavigationLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');

            if (!href ||
                href.startsWith('http') ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                link.getAttribute('target') === '_blank') {
                return;
            }

            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.show();
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            });
        });
    },

    show() {
        if (!this.loader) return;
        this.loader.classList.remove('fade-out');
        this.loader.style.display = 'flex';
    },

    hide() {
        if (!this.loader) return;
        this.loader.classList.add('fade-out');
        setTimeout(() => {
            this.loader.style.display = 'none';
        }, 500);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GalaxyLoader.init();
});
