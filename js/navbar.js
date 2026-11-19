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
    // a third of the viewport, or the last one once the footer comes into view, since
    // a short final section never gets that far up on tall screens. Nothing is highlighted
    // once the footer is fully in view or fills half of it
    const sectionLinks = [...document.querySelectorAll('.section-link')];
    let ticking = false;
    // Index of the link clicked, kept highlighted while the page scrolls to its section,
    // so the links in between don't light up one after the other, and afterwards until
    // the visitor scrolls: the last section can't reach the top of the viewport, so the
    // page stops with the footer in view, which would otherwise clear the highlight
    let clickedIndex = null;
    let clickScrolling = false;
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
        let current = -1;
        sections.forEach((section, i) => {
            if (section && section.getBoundingClientRect().top <= window.innerHeight / 3) {
                current = i;
            }
        });
        const footer = document.querySelector('footer');
        if (footer) {
            const { top, bottom } = footer.getBoundingClientRect();
            if (bottom <= window.innerHeight + 2 || top <= window.innerHeight / 2) {
                current = -1;
            } else if (top < window.innerHeight) {
                current = sections.length - 1;
            }
        }
        highlight(current);
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateCurrentSection);
        }
    }

    // The scroll to the clicked section counts as finished once no scroll event has come
    // for a short while (scrollend isn't supported everywhere yet)
    function endClickScrollLater() {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickScrolling = false;
        }, 150);
    }

    function releaseClickedLink() {
        clickedIndex = null;
        requestUpdate();
    }

    // Scroll to the section without adding #section to the URL, from the navbar or the footer
    // (looked up once the footer is parsed)
    function scrollToSection(e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            clickedIndex = sectionLinks.findIndex(link => link.getAttribute('href') === href);
            highlight(clickedIndex);
            clickScrolling = true;
            endClickScrollLater();
            target.scrollIntoView();
        }
    }

    sectionLinks.forEach(link => link.addEventListener('click', scrollToSection));
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.footer-section-link').forEach(link => link.addEventListener('click', scrollToSection));
    });

    window.addEventListener('scroll', () => {
        if (clickScrolling) {
            endClickScrollLater();
        } else if (clickedIndex !== null) {
            releaseClickedLink();
        } else {
            requestUpdate();
        }
    }, { passive: true });
    window.addEventListener('resize', () => {
        if (clickScrolling) {
            return;
        }
        if (clickedIndex !== null) {
            releaseClickedLink();
        } else {
            requestUpdate();
        }
    });
    document.addEventListener('DOMContentLoaded', requestUpdate);
    window.addEventListener('load', requestUpdate);
})();
