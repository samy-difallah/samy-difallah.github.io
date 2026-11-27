---
title: "SBOM: knowing what's inside your products"
description: "A software bill of materials lists the components a product is made of. What an SBOM contains, why it became a requirement, how to generate one with Syft, and where it gets difficult."
date: 2026-11-27
order: 2
---

When Log4Shell was disclosed in December 2021, the first question for every vendor was simple: which of our products contain Log4j, and in which version? For many of them, answering it took days. Log4j was rarely a direct dependency: it came in through other libraries, sometimes several levels down, or was bundled inside a third-party component. A [PSIRT](/en/blog/psirt-vs-csirt/) cannot assess a vulnerability in a product before it knows the product is affected.

A software bill of materials (SBOM) is meant to make that answer take minutes. This article explains what an SBOM contains, why it became a requirement in a few years, how to generate one, and where it gets difficult.

## What an SBOM is

An SBOM is an inventory of the components a piece of software is made of: open-source libraries, commercial components, and the organization's own modules, with their versions and the relationships between them. It is often compared to the ingredient list on food packaging: it does not say whether the product is good, but it says what is in it.

In 2021, the US NTIA defined the [minimum elements](https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom) an SBOM should contain for each component:

- **supplier name**: who makes the component;
- **component name** and **version**;
- **other unique identifiers**, such as a PURL or a CPE, to find the component in vulnerability databases;
- **dependency relationship**: which component includes which;
- **author of the SBOM data** and a **timestamp**: who produced the SBOM, and when.

An SBOM is also meant to be read by machines, not by people. It is written in a standard format, mainly CycloneDX or SPDX, so that tools can generate it, exchange it and compare it against vulnerability databases.

## A small example

Here is a shortened SBOM in CycloneDX format for a made-up web application, `example-app`, which uses the Flask framework. Flask itself depends on Jinja2, the template engine:

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.6",
  "metadata": {
    "timestamp": "2026-11-26T10:00:00Z",
    "authors": [{ "name": "Example Corp build pipeline" }],
    "component": {
      "type": "application",
      "bom-ref": "example-app",
      "name": "example-app",
      "version": "1.4.0",
      "supplier": { "name": "Example Corp" }
    }
  },
  "components": [
    {
      "type": "library",
      "bom-ref": "pkg:pypi/flask@3.0.3",
      "name": "flask",
      "version": "3.0.3",
      "purl": "pkg:pypi/flask@3.0.3"
    },
    {
      "type": "library",
      "bom-ref": "pkg:pypi/jinja2@3.1.4",
      "name": "jinja2",
      "version": "3.1.4",
      "purl": "pkg:pypi/jinja2@3.1.4"
    }
  ],
  "dependencies": [
    { "ref": "example-app", "dependsOn": ["pkg:pypi/flask@3.0.3"] },
    { "ref": "pkg:pypi/flask@3.0.3", "dependsOn": ["pkg:pypi/jinja2@3.1.4"] },
    { "ref": "pkg:pypi/jinja2@3.1.4", "dependsOn": [] }
  ]
}
```

The minimum elements are all there: the author and the timestamp in `metadata`, the name, version and PURL of each component, and the relationships in `dependencies`. The last block is what tells us that Jinja2 is not used directly by the application, but comes in through Flask. If a vulnerability is published in Jinja2 tomorrow, this SBOM shows that `example-app` 1.4.0 contains the affected version, and through which path.

A real SBOM contains many more components and fields, such as licenses or hashes. The formats themselves, CycloneDX and SPDX, deserve an article of their own.

## Why now

The idea is not new: software composition analysis tools have listed dependencies for years. What changed is that a few events turned SBOMs from good practice into a requirement:

- **The SolarWinds attack**, disclosed in December 2020, showed how a compromised supplier can reach thousands of customers through a single update.
- **US Executive Order 14028**, in May 2021, asked vendors selling software to the US federal government to provide an SBOM. The NTIA minimum elements were published two months later.
- **Log4Shell**, in December 2021, showed on a large scale what happens when vendors do not know what their products contain.
- **The [Cyber Resilience Act](/en/blog/cyber-resilience-act/)** requires manufacturers to identify their products' components and document them in an SBOM, in a commonly used machine-readable format, covering at least the top-level dependencies. The SBOM is part of the technical documentation: it does not have to be published, but it must be provided to the authorities on request.
- In Germany, the BSI's [TR-03183](https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/Technische-Richtlinien/TR-nach-Thema-sortiert/tr03183/TR-03183_node.html) technical guideline describes in more detail what an SBOM should contain to meet the CRA.

There is also a simpler reason: most of the code in a modern product is not written by the vendor. Open-source and third-party components make up a large part of it, and each of them can bring its own vulnerabilities.

## Depth and types

Two SBOMs of the same product can be very different, depending on how deep they go and when they are produced.

**Depth.** Top-level dependencies are the ones the product uses directly, like Flask in the example. Transitive dependencies are the ones those components bring in, like Jinja2. The CRA asks for the top-level ones at least, but vulnerabilities often hide further down: in Log4Shell, Log4j was often a transitive dependency. An SBOM that stops at the first level would have missed it.

**Types.** CISA describes [six types of SBOM](https://www.cisa.gov/resources-tools/resources/types-software-bill-materials-sbom), depending on when in the product's life it is generated:

- **design**: for a product that does not exist yet, from its planned components;
- **source**: from the source code and its dependency files;
- **build**: during the build, from the components actually included;
- **analyzed**: from a finished artifact, such as a binary or a container image, analyzed by a tool;
- **deployed**: from the software as it is installed on a system, with its configuration;
- **runtime**: from what is actually loaded and running.

Each type sees different things. A source SBOM may list development dependencies that never reach the product; an analyzed SBOM only finds what leaves recognizable traces in the artifact. Knowing how an SBOM was produced helps to know how much to trust it.

## Generating one with Syft

[Syft](https://github.com/anchore/syft) is an open-source tool from Anchore that generates SBOMs from container images, directories and files. It is a good way to see what an SBOM looks like for real software, and it takes a single command:

```shell
# List the packages in a container image, as a table
syft alpine:3.20

# Write a CycloneDX SBOM of the image to a file
syft alpine:3.20 -o cyclonedx-json=sbom.cdx.json

# Same for a project directory, in SPDX format
syft dir:. -o spdx-json=sbom.spdx.json
```

Syft looks for the traces that package managers leave behind: the databases of the system packages (apk, dpkg, rpm), and the manifests and lock files of language ecosystems such as npm, pip, Maven or Go modules. For each package found, it records the name, version and license, and generates a PURL and CPEs, which vulnerability scanners need to match it.

The SBOM can then be passed to a scanner. [Grype](https://github.com/anchore/grype), from the same vendor, reads it directly:

```shell
grype sbom:./sbom.cdx.json
```

Separating the two steps has a real advantage: the SBOM is generated once, at build time, and can be scanned again every day against new vulnerabilities, without access to the product itself.

The limit follows from how it works: Syft finds what package managers declare. A library copied into the source tree, code compiled statically into a binary, or a component installed by hand without package metadata may not appear at all.

## What a PSIRT does with it

For a PSIRT, an SBOM is above all a way to answer "are we affected?" quickly. When a new vulnerability is published, the PSIRT looks for the affected component across the SBOMs of all its products and versions, instead of asking each development team. The same SBOMs are useful to answer customers, who increasingly ask for them, and to meet the CRA's deadlines.

But an SBOM only gives a starting point:

- **A vulnerable component is not always an exploitable vulnerability.** The product may not use the affected function, or may not expose it. Matching SBOMs against vulnerability databases produces many results that do not apply, and each one has to be analyzed. VEX (Vulnerability Exploitability eXchange) documents exist to tell customers which ones do not.
- **The matching depends on identifiers.** Without a correct PURL or CPE, a component cannot be found reliably in vulnerability databases: it is either missed, or confused with another one. These identifiers deserve an article of their own.
- **An SBOM is only as good as its source.** An incomplete SBOM gives a false sense of security, which can be worse than no SBOM at all.

## Even more necessary with AI

AI tools now help find vulnerabilities faster than before, and 2026 gave several examples. In October, two vulnerabilities in the PHP interpreter itself, CVE-2026-109618 and CVE-2026-109619, nicknamed PHP2Shell, were disclosed with a CVSS 4.0 score of 9.2. They allow remote code execution and affect PHP from version 5.4 up to the fixed releases 8.2.35, 8.3.36, 8.4.27 and 8.5.12. Several of the teams credited with finding them [said they used AI models](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote) in their research. CISA added both to its [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) on October 26. A month later, on November 19, PHP fixed 18 more vulnerabilities, seven of them rated critical.

PHP runs a large share of websites, but also the web interfaces of many IT products, such as the management consoles of network and security appliances. For their vendors, the first question was the same as with Log4Shell, and PHP2Shell illustrates several points of this article:

- **The runtime is a component too.** PHP does not appear in an application's `composer.json`: it is the interpreter the application runs on. An SBOM generated only from the application's dependency files misses it; an SBOM of the whole product, operating system included, does not.
- **The version number is not enough.** Linux distributions often backport fixes without changing the upstream version number, so a distribution's PHP 8.2 package can be fixed while its version looks vulnerable. The identifier has to say where the package comes from, which is what a PURL such as `pkg:deb/debian/php8.2` does.
- **End-of-life versions stay vulnerable.** Branches older than 8.2 received no official release. An SBOM shows which products still ship such a version, and need more than a simple update.
- **What is installed is not always what is running.** Updating the package on disk does not change the PHP-FPM workers already running: they [have to be restarted](https://cloud.google.com/blog/products/identity-security/responding-to-core-php-vulnerabilities-cve-2026-109618-cve-2026-109619). Only a runtime view shows it.

Earlier in the year, Copy Fail, Dirty Frag and Fragnesia, three privilege escalation vulnerabilities in the Linux kernel, were disclosed within a few weeks, at least two of them found with AI tools. For a product that ships Linux, the SBOM gives the kernel version, but not which modules are built in, and that is often what decides whether the product is exploitable.

More vulnerabilities found faster means less time for each one. A PSIRT that has to check its products by hand cannot keep up; one with complete and accurate SBOMs can at least answer the first question quickly, and spend its time on the analysis.

## In practice

I have generated SBOMs myself, mostly for tests, with tools like Syft. Producing one is easy; producing a good one is not. The difficulties I have run into are mostly these:

- **Quality.** Two tools can give different results for the same product, and an SBOM can look complete while missing components, or list components that are not in the product.
- **Missing identifiers.** Components without a PURL or a CPE, or with a wrong one, cannot be matched against vulnerability databases, and fixing that often has to be done by hand.
- **Firmware and hardware products.** Tools are made for software ecosystems with package managers. Firmware often contains binaries supplied by third parties, without metadata, and the SBOM then depends on what suppliers are willing and able to provide.
- **Dependency management.** Version ranges, several versions of the same library in one product, vendored code, or development dependencies mixed with runtime ones all make it harder to know what actually ships.

## In short

An SBOM lists what a product is made of: its components, their versions, their identifiers and how they depend on each other. Since SolarWinds, Log4Shell and now the CRA, it is no longer optional for manufacturers. Generating one takes a single command with a tool like Syft, but its value depends on its quality: complete, with correct identifiers, and kept up to date for every version of the product.
