{
    const tabs = [...document.querySelectorAll('#skills [role="tab"]')];

    const select = (tab) => {
        tabs.forEach((other) => {
            const selected = other === tab;
            other.setAttribute('aria-selected', selected);
            other.tabIndex = selected ? 0 : -1;
            document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
        });
        try {
            sessionStorage.setItem('skillsTab', tabs.indexOf(tab));
        } catch {}
    };

    // The selected tab is kept for the tab session, so it survives a refresh or a language switch.
    // Restored before the scroll position, so the page lands on the right spot.
    let savedTab = null;
    try {
        savedTab = tabs[parseInt(sessionStorage.getItem('skillsTab'))];
    } catch {}
    if (savedTab) {
        select(savedTab);
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => select(tab));

        // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern
        tab.addEventListener('keydown', (event) => {
            const next = {
                ArrowRight: tabs[(index + 1) % tabs.length],
                ArrowLeft: tabs[(index - 1 + tabs.length) % tabs.length],
                Home: tabs[0],
                End: tabs[tabs.length - 1],
            }[event.key];
            if (next) {
                event.preventDefault();
                select(next);
                next.focus();
            }
        });
    });
}
