---
title: "The Cyber Resilience Act: what changes for products"
description: "The EU makes cybersecurity a condition for selling products with digital elements. What the CRA covers, what it requires from manufacturers, and what it means for the teams that handle vulnerabilities."
date: 2026-11-26
order: 1
---

For a long time, the security of a product sold in the EU was mostly left to the manufacturer's goodwill. Some vendors had a PSIRT, published advisories and kept fixing their products for years; others shipped a product and never updated it. The Cyber Resilience Act (CRA) ends that difference: cybersecurity becomes a condition for putting a product on the EU market, in the same way as electrical safety, with the CE marking to show it.

This article covers what the CRA is, which products it applies to, what it requires from manufacturers, and the part that concerns a PSIRT most: handling vulnerabilities and reporting them to the authorities.

## What the CRA is

The CRA is [Regulation (EU) 2024/2847](https://eur-lex.europa.eu/eli/reg/2024/2847/oj). As a regulation, not a directive, it applies directly in every member state, with no national transposition. It entered into force on December 10, 2024, but its obligations apply in stages:

- **June 11, 2026**: the rules for the bodies that will assess products (conformity assessment bodies).
- **September 11, 2026**: the obligation to report actively exploited vulnerabilities and severe incidents.
- **December 11, 2027**: everything else, including the security requirements for the products themselves.

So since September 2026, manufacturers already have to report to the authorities, more than a year before their products have to meet the rest of the regulation.

## Which products it covers

The CRA applies to "products with digital elements" made available on the EU market: hardware and software, and the remote data processing solutions they need to work, such as the cloud backend of a connected camera. A standalone online service (SaaS) is not a product in this sense; it falls under other rules, such as the NIS2 directive.

Some products are left out because sector-specific rules already cover them: medical devices, motor vehicles, civil aviation and marine equipment. Products developed only for national security or defense are also excluded.

Open source gets special treatment. Free and open-source software developed or supplied outside any commercial activity is not covered. Foundations and other organizations that support open-source projects intended for commercial use, called open-source software stewards, have a lighter set of obligations. But a company that builds open-source components into a product it sells is responsible for them like for the rest of its product.

## Categories and conformity assessment

Before placing a product on the market, the manufacturer must show that it meets the CRA's requirements. How it does so depends on the product's category:

| Category | Examples | Conformity assessment |
|---|---|---|
| Default (most products) | Photo editors, games, most consumer software | Self-assessment by the manufacturer |
| Important, class I ([Annex III](https://eur-lex.europa.eu/eli/reg/2024/2847/oj)) | Password managers, VPNs, operating systems, routers, browsers, SIEMs | Self-assessment only if harmonized standards are fully applied; otherwise a third party |
| Important, class II (Annex III) | Hypervisors and container runtimes, firewalls, intrusion detection and prevention systems | Third-party assessment, or a European cybersecurity certification |
| Critical ([Annex IV](https://eur-lex.europa.eu/eli/reg/2024/2847/oj)) | Smart meter gateways, smart cards, secure elements | A European cybersecurity certification, where one is required; otherwise as class II |

Whatever the category, the manufacturer then writes an EU declaration of conformity and affixes the CE marking.

## What manufacturers must do

[Annex I](https://eur-lex.europa.eu/eli/reg/2024/2847/oj) lists the essential requirements. Its first part concerns the product itself. Among other things, a product must:

- be made available without known exploitable vulnerabilities;
- come with a secure default configuration;
- receive security updates, automatic by default where that makes sense;
- protect the confidentiality and integrity of its data, and limit the data it processes;
- limit its attack surface, and the impact of an incident;
- record security-relevant activity, and let users delete their data.

The manufacturer must also set a support period, during which it fixes vulnerabilities. It must be at least five years, unless the product is expected to be used for less time. Security updates must be free, and each one must stay available for at least ten years after its release, or for the rest of the support period if that is longer.

## Vulnerability handling: the PSIRT's part

The second part of Annex I is about vulnerability handling, which is most of what a [PSIRT](/en/blog/psirt-vs-csirt/) does. The manufacturer must:

- **identify the product's components**, and document them in a software bill of materials (SBOM), in a commonly used machine-readable format, covering at least the top-level dependencies;
- **fix vulnerabilities without delay**, with security updates, kept separate from feature updates where possible;
- **test and review** the product's security regularly;
- **publish information about fixed vulnerabilities**: a description, the affected products, the impact and severity, and how to fix them;
- **have a coordinated vulnerability disclosure policy**, and a contact address for reporting vulnerabilities;
- **distribute updates securely**, without delay and free of charge, with advisories explaining what to do.

Under [Article 13(6)](https://eur-lex.europa.eu/eli/reg/2024/2847/oj), a manufacturer that finds a vulnerability in a component it uses, open source included, must also report it to the person or organization that maintains that component.

None of this is new for a mature PSIRT: these are the practices described by the [FIRST PSIRT Services Framework](https://www.first.org/standards/frameworks/psirts/psirt_services_framework_v1.1) and by ISO/IEC 29147 and 30111. What changes is that they are no longer good practice, but a legal requirement.

## Reporting to the authorities

[Article 14](https://eur-lex.europa.eu/eli/reg/2024/2847/oj) is the obligation that already applies. The manufacturer must report two kinds of events through a single reporting platform run by ENISA, which forwards them to the national CSIRT designated as coordinator.

**An actively exploited vulnerability** in one of its products:

1. an early warning within 24 hours of becoming aware of it;
2. a vulnerability notification within 72 hours, with what is known about the vulnerability, its exploitation and the measures taken;
3. a final report no later than 14 days after a fix or mitigation is available.

**A severe incident having an impact on the security of the product**: an early warning within 24 hours, a notification within 72 hours, and a final report within one month.

The manufacturer must also inform the product's users, and tell them how to protect themselves.

### Exploited, not exploitable

A common misreading is that every serious vulnerability has to be reported within 24 hours. That is not the case: the obligation applies to vulnerabilities that are **exploited**, not to those that are merely **exploitable**. The CRA defines an actively exploited vulnerability as one for which there is reliable evidence that a malicious actor has exploited it in a system without the owner's permission. A vulnerability found in good faith, by a researcher or during testing, does not count.

A few examples help:

- **A researcher reports a critical remote code execution flaw**, with a CVSS score of 9.8, through the vendor's contact address. There is no sign that anyone has used it. This is a vulnerability to fix and disclose under Annex I, but it does not trigger an Article 14 report.
- **The researcher publishes a working proof of concept.** The vulnerability is now easier to exploit, but a public exploit is not, on its own, evidence that a malicious actor has used it. Still no report, but the fix becomes even more urgent, and the situation must be watched closely.
- **A customer finds that attackers got into one of their devices through that flaw.** Now there is reliable evidence of exploitation, in the customer's system. The 24-hour clock starts when the manufacturer becomes aware of it.
- **Attackers compromise the manufacturer's update server and push a malicious update.** No product vulnerability may be involved, but this is a severe incident having an impact on the security of the product, and it must be reported.

The second side of the same point: the exploitation does not have to happen in the manufacturer's own information system. In most cases, it will happen at a customer's site. And an attack on the manufacturer's own systems only has to be reported under the CRA if it affects the security of its products.

## Timeline and penalties

| Date | What applies |
|---|---|
| December 10, 2024 | Entry into force |
| June 11, 2026 | Rules for conformity assessment bodies |
| September 11, 2026 | Reporting obligations (Article 14) |
| December 11, 2027 | All other obligations |

Fines can reach €15 million or 2.5% of worldwide annual turnover, whichever is higher, for breaches of the essential requirements and of the manufacturer's obligations, including reporting. Authorities can also order a non-compliant product to be withdrawn from the market.

## What it changes in practice

In my work in a PSIRT, the CRA did not turn things upside down: handling vulnerabilities, fixing them and publishing advisories was already the job. Learning the regulation in detail was useful in itself. What it changes most is speed. A 24-hour deadline leaves no time to find out which products contain a given component, or to write an advisory by hand.

That is why automation and standard formats are no longer optional. A PSIRT that keeps an up-to-date SBOM for each product can tell in minutes whether it is affected by a new vulnerability; one that publishes advisories in a machine-readable format such as CSAF lets customers process them as fast. This is what I am working on now.

The pressure is also growing from the other side. AI tools now help find vulnerabilities at a pace that was not possible a few years ago, for defenders and attackers alike. In my own work, I have seen the number of vulnerabilities and alerts to go through rise sharply, a good part of them found with the help of AI. More vulnerabilities found faster means more to triage, and the CRA's deadlines do not stretch with the volume.

## In short

The CRA makes product security a legal requirement in the EU: secure by default, maintained for years, with vulnerabilities handled and disclosed properly. Most obligations apply from December 2027, but reporting actively exploited vulnerabilities is already required since September 2026. For many manufacturers, meeting it will mean having a real PSIRT, with tools fast enough for the deadlines.
