// One-time entrances and small responses; native links and shelf scrolling stay intact.
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const entrances = document.querySelectorAll('#hero .hero-content, .featured-project .section-heading-row, .featured-project-grid, .currently-heading-row');
    const doodles = document.querySelectorAll('.section-doodle');
    const projectImages = document.querySelectorAll('.featured-project .gallery-item img');
    const covers = document.querySelectorAll('.currently-cover');
    let observer;

    function clearMotion() {
        observer?.disconnect();
        document.querySelectorAll('.motion-enter, .motion-drawing, .motion-bounce, .motion-image-reveal').forEach(element => {
            element.classList.remove('motion-enter', 'motion-drawing', 'motion-bounce', 'motion-image-reveal');
        });
    }

    function startEntrances() {
        if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
        doodles.forEach(doodle => {
            doodle.querySelectorAll('path').forEach((path, index) => {
                path.setAttribute('pathLength', '1');
                path.style.setProperty('--draw-delay', `${index * 120}ms`);
            });
        });
        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const element = entry.target;
                const effect = element.classList.contains('section-doodle') ? 'motion-drawing'
                    : element.matches('.gallery-item img') ? 'motion-image-reveal' : 'motion-enter';
                element.classList.add(effect);
                observer.unobserve(entry.target);
            });
        }, { threshold: .35, rootMargin: '0px 0px -15% 0px' });
        [...entrances, ...doodles, ...projectImages].forEach(element => observer.observe(element));
    }

    function bounce(cover) {
        if (reducedMotion.matches || cover.classList.contains('motion-bounce')) return;
        cover.classList.add('motion-bounce');
    }

    covers.forEach(cover => {
        let press;
        cover.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse' && finePointer.matches) bounce(cover);
        });
        cover.addEventListener('pointerdown', event => {
            press = event.isPrimary && event.button === 0 ? { x: event.clientX, y: event.clientY } : null;
        });
        cover.addEventListener('pointermove', event => {
            if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) press = null;
        }, { passive: true });
        cover.addEventListener('pointerup', event => {
            if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) <= 10) bounce(cover);
            press = null;
        });
        cover.addEventListener('pointercancel', () => { press = null; });
        cover.addEventListener('click', event => {
            if (event.detail === 0) bounce(cover);
        });
        cover.addEventListener('animationend', event => {
            if (event.animationName === 'cover-bounce') cover.classList.remove('motion-bounce');
        });
    });

    reducedMotion.addEventListener('change', () => {
        clearMotion();
        startEntrances();
    });
    startEntrances();
})();
