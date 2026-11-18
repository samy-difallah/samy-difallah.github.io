// Send visitors to their language: their own FR/EN choice first, then the browser's language.
// replace() keeps this page out of the history, so Back doesn't bounce forward again.
{
    let lang = null;
    try {
        lang = localStorage.getItem('lang');
    } catch {}
    if (lang !== 'en' && lang !== 'fr') {
        lang = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    }
    location.replace(`/${lang}/${location.search}${location.hash}`);
}
