// One-time entrances and small responses; native links and shelf scrolling stay intact.
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const entrances = document.querySelectorAll('#hero .hero-content, .featured-project .section-heading-row, .featured-project-copy, .currently-heading-row');
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
            const paths = [...doodle.querySelectorAll('path')];
            const isSprout = Boolean(doodle.closest('.featured-project'));
            const pause = isSprout ? 120 : 65;
            const durations = paths.map(path => Math.max(140, Math.min(480, path.getTotalLength() * 6)));
            // Give the sprout 4.8 seconds overall, preserving sequential strokes.
            const scale = isSprout
                ? (4800 - pause * (paths.length - 1)) / durations.reduce((sum, duration) => sum + duration, 0)
                : 1;
            let delay = 0;
            paths.forEach((path, index) => {
                const duration = durations[index] * scale;
                path.setAttribute('pathLength', '1');
                path.style.setProperty('--draw-delay', `${delay}ms`);
                path.style.setProperty('--draw-duration', `${duration}ms`);
                delay += duration + pause;
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
