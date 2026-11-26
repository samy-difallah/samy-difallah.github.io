---
title: "PSIRT and CSIRT: who handles what?"
description: "Both teams respond to security issues, but not to the same ones. What a PSIRT does, how it differs from a CSIRT, and where the two meet."
date: 2026-11-26
---

PSIRT and CSIRT differ by one letter, and the two are often mixed up. Both are security teams, both "respond", and both deal with vulnerabilities. But they don't answer for the same thing: a CSIRT protects an organization's own systems, while a PSIRT answers for the products that organization ships to its customers.

This article explains what each team does, follows a vulnerability through a PSIRT, and shows, with Log4Shell as an example, how the same event keeps both teams busy in different ways.

## CSIRT: protecting the organization

A CSIRT (Computer Security Incident Response Team) handles security incidents affecting a defined group, called its constituency. Most of the time, that group is the organization itself: its network, servers, workstations and accounts. Some CSIRTs cover wider groups: a sector, a research network, or a whole country. In France, the national CSIRT is [CERT-FR](https://cert.cyber.gouv.fr/), run by ANSSI.

Its work is mostly about events that are happening or have just happened: detecting suspicious activity, analyzing it, containing an attack, removing the attacker, restoring systems, and drawing lessons from it. The [FIRST CSIRT Services Framework](https://www.first.org/standards/frameworks/csirts/csirt_services_framework_v2.1) groups these activities into service areas such as information security event management, incident management, vulnerability management, situational awareness and knowledge transfer.

The question a CSIRT answers is: **are we under attack, and how do we stop it?**

## PSIRT: answering for the products

A PSIRT (Product Security Incident Response Team) handles vulnerabilities in the products an organization develops and sells: software, hardware, firmware, cloud services. Its stakeholders are mostly outside the company: the customers who run the products, and the security researchers who find flaws in them.

The [FIRST PSIRT Services Framework](https://www.first.org/standards/frameworks/psirts/psirt_services_framework_v1.1) describes six service areas:

- **Stakeholder ecosystem management**: knowing and working with everyone involved, from development teams to customers, researchers and suppliers.
- **Vulnerability discovery**: receiving reports, and finding vulnerabilities through testing or by monitoring third-party components.
- **Vulnerability triage and analysis**: checking a report, reproducing it, and assessing its impact and severity.
- **Remediation**: getting a fix or a workaround built and released with the development teams.
- **Vulnerability disclosure**: telling customers and the public, at the right time and in the right form.
- **Training and education**: helping teams avoid the same flaws in the future.

The question a PSIRT answers is: **is our product affected, and what should our customers do?**

## A vulnerability's path through a PSIRT

Every PSIRT has its own process, but most follow the same main steps, described in two standards: [ISO/IEC 30111](https://www.iso.org/standard/69725.html) for handling vulnerabilities internally, and [ISO/IEC 29147](https://www.iso.org/standard/72311.html) for disclosing them.

1. **Report.** A vulnerability comes in: from a researcher through a contact address or a `security.txt` file, from a bug bounty program, from internal testing, or from an advisory about a third-party component the product uses.
2. **Triage.** The PSIRT checks that the report is valid and finds which products and versions are affected.
3. **Analysis.** The vulnerability is reproduced and its severity assessed, often with a CVSS score, so that it can be prioritized.
4. **Remediation.** Development teams build a fix, or at least a workaround, and test it.
5. **Coordinated disclosure.** The PSIRT agrees on a publication date with the reporter, so that a fix is available before the details become public.
6. **Advisory.** The PSIRT publishes a security advisory: affected versions, severity, fix or workaround, and a CVE identifier. More and more advisories also come in a machine-readable format such as CSAF, so customers can process them automatically.

Compared with a CSIRT, the timescale is different. An incident is measured in hours or days; a product vulnerability often takes weeks, sometimes months, between the first report and the advisory, because a fix has to go through development, testing and release.

## Side by side

| | CSIRT | PSIRT |
|---|---|---|
| Protects | The organization's own systems (or its constituency) | The products the organization ships |
| Triggered by | An incident: an attack, a compromise, suspicious activity | A vulnerability report about a product |
| Main stakeholders | Internal IT and security teams, management | Customers, security researchers, development teams |
| Main output | A contained incident, restored systems, lessons learned | A fix, a security advisory, a CVE |
| Timescale | Hours to days | Weeks to months |
| Reference frameworks | FIRST CSIRT Services Framework | FIRST PSIRT Services Framework, ISO/IEC 29147 and 30111 |

## One event, two teams: Log4Shell

In December 2021, a critical vulnerability in Apache Log4j, a Java logging library used almost everywhere, was made public: [CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228), known as Log4Shell. It allowed remote code execution, sometimes with a single crafted string, and attacks started almost immediately.

In a company that also makes software, the two teams had very different weeks.

The **CSIRT** looked inward: which internal servers ran Log4j, which of them were exposed to the internet, were there signs of exploitation in the logs? Then it applied patches or mitigations, following guidance such as [CISA's](https://www.cisa.gov/news-events/news/apache-log4j-vulnerability-guidance), and watched for attacks.

The **PSIRT** looked at the products: which of them bundled Log4j, in which versions, sometimes buried several levels deep in their dependencies? For each affected product, it had to get a fixed version released and publish an advisory. And it had to answer customers, who wanted to know quickly whether they were exposed, including for products that were not. Many vendors published "not affected" statements for that reason.

Same vulnerability, same days, but one team protected the company and the other answered for what the company had sold.

## Where they meet

The two teams are distinct, but they work together:

- **Reports that reach the wrong team.** A researcher may report a flaw in the company's website to the PSIRT, when it concerns an internal system, not a product: the PSIRT forwards it to the CSIRT, and the other way around.
- **Shared sources.** Both follow vulnerability feeds, threat intelligence and the advisories of their own suppliers.
- **Products used internally.** When the company runs its own products, a vulnerability found by the PSIRT also concerns the CSIRT.
- **Regulation.** The EU [Cyber Resilience Act](https://eur-lex.europa.eu/eli/reg/2024/2847/oj) (CRA) adds a formal link. Since 11 September 2026, under its Article 14, manufacturers of products with digital elements must report actively exploited vulnerabilities in their products to a national CSIRT designated as coordinator and to ENISA: an early warning within 24 hours, a notification within 72 hours, and a final report within 14 days after a fix is available. The PSIRT's work now feeds national CSIRTs directly.

## In short

A CSIRT protects an organization from attacks on its own systems; a PSIRT makes sure the products that organization sells can be trusted, and tells customers what to do when they can't. With software built from many components, and with regulations like the CRA, the PSIRT is becoming as standard a part of a product company as the CSIRT is of its IT.
