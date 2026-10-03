const translations = require("./translations.json");

// Maps each project's PyPI package name to its latest released version.
// Never fails the build: unreachable packages are skipped with a warning.
module.exports = async function() {
    const packages = translations.en.projects
        .map((project) => project.pypi)
        .filter(Boolean);
    const versions = {};

    await Promise.all(packages.map(async (name) => {
        try {
            const response = await fetch(`https://pypi.org/pypi/${encodeURIComponent(name)}/json`, {
                signal: AbortSignal.timeout(10000),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            versions[name] = data.info.version;
            console.log(`[pypi] ${name}: v${versions[name]}`);
        } catch (error) {
            console.warn(`[pypi] Could not fetch version for ${name}: ${error.message}`);
        }
    }));

    return versions;
};
