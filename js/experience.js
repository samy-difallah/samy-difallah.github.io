{
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Open experiences are kept for the tab session, so they survive a refresh or a language switch.
    // Restored before the scroll position, so the page lands on the right spot.
    let openJobs = [];
    try {
        openJobs = JSON.parse(sessionStorage.getItem('openJobs') || '[]');
    } catch {}
    openJobs.forEach((job) => {
        const details = document.querySelector(`details.group[data-job="${job}"]`);
        if (details) {
            details.open = true;
            details.classList.add('is-open');
        }
    });

    // is-open reflects the target state, even mid-animation
    const saveOpenJobs = () => {
        const jobs = [...document.querySelectorAll('details.group.is-open')].map((details) => details.dataset.job);
        try {
            sessionStorage.setItem('openJobs', JSON.stringify(jobs));
        } catch {}
    };

    document.querySelectorAll('details.group').forEach((details) => {
        const summary = details.querySelector('summary');
        const content = details.querySelector('[data-details-content]');
        let animation = null;
        let closing = false;

        summary.addEventListener('click', (event) => {
            const opening = !details.open || closing;
            details.classList.toggle('is-open', opening);
            saveOpenJobs();

            if (reduceMotion.matches) {
                return;
            }
            event.preventDefault();

            // Start from the current height so a click mid-animation reverses smoothly
            const from = details.open ? content.offsetHeight : 0;
            animation?.cancel();
            closing = !opening;
            details.open = true;
            const to = opening ? content.scrollHeight : 0;

            content.style.overflow = 'hidden';
            animation = content.animate(
                [
                    { height: `${from}px`, opacity: from ? 1 : 0 },
                    { height: `${to}px`, opacity: to ? 1 : 0 },
                ],
                { duration: 300, easing: 'ease-in-out' }
            );
            animation.onfinish = () => {
                if (closing) {
                    details.open = false;
                    closing = false;
                }
                content.style.overflow = '';
                animation = null;
            };
        });
    });
}
