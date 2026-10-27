// One-time entrances and small responses; native links and shelf scrolling stay intact.
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const entrances = document.querySelectorAll('#hero .hero-content, .featured-project .section-heading-row, .featured-project-grid, .currently-heading-row');
    const doodles = document.querySelectorAll('.section-doodle');
    const covers = document.querySelectorAll('.currently-cover');
    let observer;

    function clearMotion() {
        observer?.disconnect();
        document.querySelectorAll('.motion-enter, .motion-ready, .motion-drawing, .motion-bounce, .motion-image-reveal').forEach(element => {
            element.classList.remove('motion-enter', 'motion-ready', 'motion-drawing', 'motion-bounce', 'motion-image-reveal');
        });
    }

    function startEntrances() {
        if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
        doodles.forEach(doodle => {
            let delay = 0;
            doodle.querySelectorAll('path').forEach(path => {
                const duration = Math.max(140, Math.min(480, path.getTotalLength() * 6));
                path.setAttribute('pathLength', '1');
                path.style.setProperty('--draw-delay', `${delay}ms`);
                path.style.setProperty('--draw-duration', `${duration}ms`);
                delay += duration + 65;
            });
            doodle.classList.add('motion-ready');
        });
        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const element = entry.target;
                const effect = element.classList.contains('section-doodle') ? 'motion-drawing'
                    : 'motion-enter';
                element.classList.add(effect);
                observer.unobserve(entry.target);
            });
        }, { threshold: .35, rootMargin: '0px 0px -15% 0px' });
        [...entrances, ...doodles].forEach(element => observer.observe(element));
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
