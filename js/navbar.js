(function() {
    const currentLang = document.documentElement.lang;
    const langLinks = document.querySelectorAll('.lang-option');

    langLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remembered so the root page sends the visitor to this language next time
            try {
                localStorage.setItem('lang', this.dataset.lang);
            } catch {}
            if (this.dataset.lang === currentLang) {
                e.preventDefault();
            } else {
                localStorage.setItem('scrollPosition', window.scrollY);
            }
        });
    });

    // Highlight the link of the section being read: the last one whose top has passed
    // a third of the viewport, or the last one once the bottom of the page is reached,
    // since a short final section never gets that far up
    const sectionLinks = [...document.querySelectorAll('.section-link')];
    let ticking = false;
    // Index of the link clicked, kept highlighted while the page scrolls to its section,
    // so the links in between don't light up one after the other
    let clickedIndex = null;
    let clickTimer;

    function highlight(current) {
        sectionLinks.forEach((link, i) => {
            if (i === current) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function updateCurrentSection() {
        ticking = false;
        if (clickedIndex !== null) {
            return;
        }
        // Looked up here, as this script runs before the sections below the navbar are parsed
        const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        let current = -1;
        sections.forEach((section, i) => {
            if (section && section.getBoundingClientRect().top <= window.innerHeight / 3) {
                current = i;
            }
        });
        if (atBottom) {
            current = sections.length - 1;
        }
        highlight(current);
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateCurrentSection);
        }
    }

    // The scroll counts as finished once no scroll event has come for a short while
    // (scrollend isn't supported everywhere yet)
    function releaseClickedLinkLater() {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickedIndex = null;
            requestUpdate();
        }, 150);
    }

    // Scroll to the section without adding #section to the URL
    sectionLinks.forEach((link, i) => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                clickedIndex = i;
                highlight(i);
                releaseClickedLinkLater();
                target.scrollIntoView();
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (clickedIndex !== null) {
            releaseClickedLinkLater();
        } else {
            requestUpdate();
        }
    }, { passive: true });
    window.addEventListener('resize', requestUpdate);
    document.addEventListener('DOMContentLoaded', requestUpdate);
    window.addEventListener('load', requestUpdate);
})();
