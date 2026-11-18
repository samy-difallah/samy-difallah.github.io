{
    // A missing page under /fr/ or /en/ tells which site the visitor was on;
    // otherwise, same order as the root page: their own FR/EN choice, then the browser's language
    let lang = location.pathname.match(/^\/(en|fr)\//)?.[1];
    if (!lang) {
        try {
            lang = localStorage.getItem('lang');
        } catch {}
    }
    if (lang !== 'en' && lang !== 'fr') {
        lang = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    }
    if (lang === 'fr') {
        const french = document.querySelector('[data-lang="fr"]');
        document.querySelector('[data-lang="en"]').hidden = true;
        french.hidden = false;
        document.documentElement.lang = 'fr';
        document.title = french.dataset.title;
    }
}
