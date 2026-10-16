const postcss = require("postcss");
const tailwindcss = require("@tailwindcss/postcss");
const icons = require("./_data/icons.js");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");

    eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

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

    // Inline SVG icon, sized like a Font Awesome glyph: 1em tall, colored by currentColor
    eleventyConfig.addShortcode("icon", function(name, classes = "") {
        const icon = icons[name];
        if (!icon) {
            throw new Error(`Unknown icon: ${name}`);
        }
        const width = +(icon.width / 512).toFixed(4);
        const classAttr = classes ? ` class="${classes}"` : "";
        return `<svg${classAttr} viewBox="0 0 ${icon.width} 512" width="${width}em" height="1em" fill="currentColor" style="vertical-align: -0.125em" aria-hidden="true" focusable="false"><path d="${icon.path}"/></svg>`;
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
