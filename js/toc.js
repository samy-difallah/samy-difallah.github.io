// Highlight, in an article's table of contents, the section being read: the last one
// whose heading has passed a third of the viewport, or the last one once the page is
// scrolled to the bottom, since a short final section never gets that far up
(function() {
    const links = [...document.querySelectorAll('.toc-link')];
    if (!links.length) {
        return;
    }
    const headings = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))));
    let ticking = false;
    // Index of the link clicked, kept highlighted while the page scrolls to its section,
    // so the links in between don't light up one after the other, and afterwards until
    // the reader scrolls: a section near the end can't reach the top of the viewport
    let clickedIndex = null;
    let clickScrolling = false;
    let clickTimer;

    function highlight(current) {
        links.forEach((link, i) => {
            if (i === current) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function update() {
        ticking = false;
        if (clickedIndex !== null) {
            return;
        }
        let current = -1;
        headings.forEach((heading, i) => {
            if (heading && heading.getBoundingClientRect().top <= window.innerHeight / 3) {
                current = i;
            }
        });
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom && current !== -1) {
            current = headings.length - 1;
        }
        highlight(current);
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
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

    links.forEach((link, i) => link.addEventListener('click', () => {
        clickedIndex = i;
        highlight(i);
        clickScrolling = true;
        endClickScrollLater();
    }));

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
        if (!clickScrolling) {
            releaseClickedLink();
        }
    });
    requestUpdate();
})();
