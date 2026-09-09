// Native scrolling works without JavaScript; these controls progressively enhance it.
(() => {
    const shelf = document.querySelector('.currently');
    if (!shelf) return;

    const track = shelf.querySelector('.currently-track');
    const cards = [...track.querySelectorAll('.currently-card')];
    const controls = shelf.querySelector('.currently-controls');
    const previous = controls.querySelector('[data-direction="-1"]');
    const next = controls.querySelector('[data-direction="1"]');
    const status = shelf.querySelector('[role="status"]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    let announcement;

    function update() {
        if (window.matchMedia('(max-width: 540px)').matches) {
            // Keep the hint close to the visible card, even when other reviews are longer.
            const bounds = track.getBoundingClientRect();
            const visible = cards.filter(card => {
                const box = card.getBoundingClientRect();
                return box.right > bounds.left + 2 && box.left < bounds.right - 2;
            });
            if (visible.length) {
                const height = Math.max(...visible.map(card => card.getBoundingClientRect().height));
                const style = getComputedStyle(track);
                track.style.height = `${Math.ceil(height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom))}px`;
            }
        } else {
            track.style.removeProperty('height');
        }
        const maximum = track.scrollWidth - track.clientWidth;
        controls.hidden = maximum <= 2;
        previous.setAttribute('aria-disabled', String(track.scrollLeft <= 2));
        next.setAttribute('aria-disabled', String(track.scrollLeft >= maximum - 2));
    }

    function move(direction) {
        const button = direction < 0 ? previous : next;
        if (button.getAttribute('aria-disabled') === 'true') return;
        const step = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
        track.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }

    controls.addEventListener('click', event => {
        const button = event.target.closest('[data-direction]');
        if (button) move(Number(button.dataset.direction));
    });

    track.addEventListener('keydown', event => {
        // Do not override keyboard behavior on the cards' links.
        if (event.target !== track) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowLeft' ? -1 : 1);
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
        }
    });

    track.addEventListener('scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
        clearTimeout(announcement);
        announcement = setTimeout(() => {
            const bounds = track.getBoundingClientRect();
            const visible = cards.filter(card => {
                const box = card.getBoundingClientRect();
                return box.left >= bounds.left - 2 && box.right <= bounds.right + 2;
            });
            status.textContent = visible.length ? `Showing: ${visible.map(card => card.querySelector('h3').textContent).join(', ')}.` : '';
        }, 200);
    }, { passive: true });

    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(update);
        observer.observe(track);
        cards.forEach(card => observer.observe(card));
    }
    else window.addEventListener('resize', update);
    update();
})();
