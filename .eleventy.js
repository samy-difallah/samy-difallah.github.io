const postcss = require("postcss");
const tailwindcss = require("@tailwindcss/postcss");
const icons = require("./_data/icons.js");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("js");
    // Google Search Console ownership check: copied as is, and not rendered as a template
    // (which would also output googleca52e9b12bfefd25/index.html)
    eleventyConfig.addPassthroughCopy("googleca52e9b12bfefd25.html");
    eleventyConfig.ignores.add("googleca52e9b12bfefd25.html");
    // Public PGP key for encrypted security reports, linked from security.txt (Encryption:)
    eleventyConfig.addPassthroughCopy("pgp-key.txt");

    eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

    // Appended to the stylesheet URL so each deploy gets a new URL: browsers and the
    // GitHub Pages cache (10 min) then never serve the old CSS with the new HTML
    eleventyConfig.addGlobalData("buildTime", () => Date.now());

    // security.txt must say when it stops being valid (RFC 9116 advises less than a year
    // ahead); counting from the build date renews it with each deploy
    eleventyConfig.addGlobalData("securityTxtExpires", () => {
        const expires = new Date();
        expires.setUTCDate(expires.getUTCDate() + 360);
        expires.setUTCHours(0, 0, 0, 0);
        return expires.toISOString().replace(".000Z", "Z");
    });

    // Length of a role from "YYYY-MM" months, both counted, as LinkedIn does ("1 yr 4 mos").
    // An ongoing role (no end) runs to the build date, so it grows with each deploy.
    eleventyConfig.addFilter("duration", function(start, end, lang) {
        const [startYear, startMonth] = start.split("-").map(Number);
        const now = new Date();
        const [endYear, endMonth] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
        const total = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
        const years = Math.floor(total / 12);
        const months = total % 12;
        const units = lang === "fr"
            ? { year: ["an", "ans"], month: ["mois", "mois"] }
            : { year: ["yr", "yrs"], month: ["mo", "mos"] };
        const parts = [];
        if (years) {
            parts.push(`${years} ${units.year[years > 1 ? 1 : 0]}`);
        }
        if (months) {
            parts.push(`${months} ${units.month[months > 1 ? 1 : 0]}`);
        }
        return parts.join(" ");
    });

    // Blog articles per language, newest first; articles published the same day are
    // ordered by their optional "order" front matter, the publication sequence within that day
    // (0 by default, highest first, so the article written last comes first)
    for (const lang of ["en", "fr"]) {
        eleventyConfig.addCollection(`posts_${lang}`, collectionApi =>
            collectionApi.getFilteredByGlob(`${lang}/blog/*.md`).sort((a, b) =>
                b.date - a.date || (b.data.order ?? 0) - (a.data.order ?? 0)));
    }

    // Minutes to read a rendered article, at 200 words a minute, rounded up
    eleventyConfig.addFilter("readingTime", function(html) {
        const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(words / 200));
    });

    // Article date in words, in the page's language ("November 26, 2026", "26 novembre 2026").
    // Front matter dates are midnight UTC, so they are read in UTC to keep the same day
    eleventyConfig.addFilter("longDate", function(date, lang) {
        return new Date(date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
            day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
        });
    });

    // Article headings (h2, h3) get an id from their text, so the table of contents can link
    // to them: "Exploité, pas exploitable" -> "exploite-pas-exploitable". A repeated text
    // gets a number ("in-short-2") to keep the ids unique within the article
    eleventyConfig.amendLibrary("md", md => {
        md.core.ruler.push("heading_ids", state => {
            const used = new Map();
            state.tokens.forEach((token, i) => {
                if (token.type !== "heading_open" || !["h2", "h3"].includes(token.tag)) {
                    return;
                }
                const slug = state.tokens[i + 1].content
                    .normalize("NFD").replace(/[̀-ͯ]/g, "")
                    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                const count = (used.get(slug) ?? 0) + 1;
                used.set(slug, count);
                token.attrSet("id", count > 1 ? `${slug}-${count}` : slug);
            });
        });
    });

    // Table of contents of a rendered article: its h2 and h3 headings, with their id and text
    eleventyConfig.addFilter("toc", html =>
        [...html.matchAll(/<h([23]) id="([^"]+)">(.*?)<\/h\1>/g)].map(([, level, id, text]) =>
            ({ level: Number(level), id, text: text.replace(/<[^>]*>/g, "") })));

    // Machine-readable date for <time datetime>
    eleventyConfig.addFilter("isoDate", date => new Date(date).toISOString().slice(0, 10));

    // Same page in the other language: articles keep the same slug in /en/ and /fr/
    eleventyConfig.addFilter("otherLangUrl", (url, otherLang) => `/${otherLang}/${url.split("/").slice(2).join("/")}`);

    // Inline SVG icon, sized like a Font Awesome glyph: 1em tall, colored by currentColor
    eleventyConfig.addShortcode("icon", function(name, classes = "") {
        const icon = icons[name];
        if (!icon) {
            throw new Error(`Unknown icon: ${name}`);
        }
        const height = icon.height || 512;
        const width = +(icon.width / height).toFixed(4);
        const classAttr = ` class="${["icon", classes].filter(Boolean).join(" ")}"`;
        return `<svg${classAttr} viewBox="0 0 ${icon.width} ${height}" width="${width}em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="${icon.path}"/></svg>`;
    });

    // Compile Tailwind at build time; templates are scanned for class names
    eleventyConfig.addTemplateFormats("css");
    eleventyConfig.addExtension("css", {
        outputFileExtension: "css",
        compile: async function(inputContent, inputPath) {
            return async () => {
                const result = await postcss([
                    tailwindcss({ optimize: { minify: true } }),
                ]).process(inputContent, { from: inputPath });
                return result.css;
            };
        },
    });

    return {
        dir: {
            input: ".",
            output: "_site"
        }
    };
};
