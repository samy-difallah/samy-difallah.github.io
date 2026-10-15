const postcss = require("postcss");
const tailwindcss = require("@tailwindcss/postcss");
const icons = require("./_data/icons.js");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");

    eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

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
