// One-time entrances and small responses; native links and shelf scrolling stay intact.
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const entrances = document.querySelectorAll('#hero .hero-content, .featured-project .section-heading-row, .featured-project-grid, .currently-heading-row');
    const doodles = document.querySelectorAll('.section-doodle');
    let observer;

    function clearMotion() {
        observer?.disconnect();
        document.querySelectorAll('.motion-enter, .motion-ready, .motion-drawing').forEach(element => {
            element.classList.remove('motion-enter', 'motion-ready', 'motion-drawing');
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

    reducedMotion.addEventListener('change', () => {
        clearMotion();
        startEntrances();
    });
    startEntrances();
})();
