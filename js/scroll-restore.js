const scrollPosition = localStorage.getItem('scrollPosition');
if (scrollPosition) {
    window.scrollTo({
        top: parseInt(scrollPosition),
        behavior: 'instant'
    });
    localStorage.removeItem('scrollPosition');
}

// The browser's own restoration on refresh is animated by scroll-behavior: smooth,
// so restore the position ourselves, instantly
history.scrollRestoration = 'manual';
const navigationType = performance.getEntriesByType('navigation')[0]?.type;
const reloadScrollKey = `reloadScroll:${location.pathname}`;
try {
    const reloadScroll = sessionStorage.getItem(reloadScrollKey);
    if (!scrollPosition && reloadScroll && (navigationType === 'reload' || navigationType === 'back_forward')) {
        window.scrollTo({
            top: parseInt(reloadScroll),
            behavior: 'instant'
        });
    }
} catch {}

window.addEventListener('pagehide', function() {
    try {
        sessionStorage.setItem(reloadScrollKey, window.scrollY);
    } catch {}
});
