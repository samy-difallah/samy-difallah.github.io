---
title: "PSIRT et CSIRT : qui fait quoi ?"
description: "Les deux équipes répondent à des problèmes de sécurité, mais pas aux mêmes. Ce que fait un PSIRT, ce qui le distingue d'un CSIRT, et où les deux se rejoignent."
date: 2026-11-26
---

PSIRT et CSIRT ne diffèrent que d'une lettre, et on les confond souvent. Ce sont deux équipes de sécurité, toutes deux font de la « réponse », et toutes deux traitent des vulnérabilités. Mais elles ne répondent pas de la même chose : un CSIRT protège les systèmes de sa propre organisation, tandis qu'un PSIRT répond des produits que cette organisation livre à ses clients.

Cet article présente le rôle de chaque équipe, suit le parcours d'une vulnérabilité au sein d'un PSIRT, et montre, avec l'exemple de Log4Shell, comment un même événement occupe les deux équipes de manière différente.

## Le CSIRT : protéger l'organisation

Un CSIRT (Computer Security Incident Response Team) traite les incidents de sécurité qui touchent un périmètre défini, appelé sa communauté. Le plus souvent, ce périmètre est l'organisation elle-même : son réseau, ses serveurs, ses postes de travail et ses comptes. Certains CSIRT couvrent un périmètre plus large : un secteur, un réseau de recherche, ou tout un pays. En France, le CSIRT national est le [CERT-FR](https://cert.cyber.gouv.fr/), opéré par l'ANSSI.

Son travail porte surtout sur des événements en cours ou tout juste passés : détecter une activité suspecte, l'analyser, contenir une attaque, évincer l'attaquant, restaurer les systèmes, et en tirer des enseignements. Le [CSIRT Services Framework du FIRST](https://www.first.org/standards/frameworks/csirts/csirt_services_framework_v2.1) regroupe ces activités en domaines de service, comme la gestion des événements de sécurité, la gestion des incidents, la gestion des vulnérabilités, la connaissance de la situation et le transfert de connaissances.

La question à laquelle répond un CSIRT : **sommes-nous attaqués, et comment l'arrêter ?**

## Le PSIRT : répondre des produits

Un PSIRT (Product Security Incident Response Team) traite les vulnérabilités des produits qu'une organisation développe et vend : logiciels, matériel, firmware, services cloud. Ses interlocuteurs sont surtout à l'extérieur de l'entreprise : les clients qui utilisent les produits, et les chercheurs en sécurité qui y trouvent des failles.

Le [PSIRT Services Framework du FIRST](https://www.first.org/standards/frameworks/psirts/psirt_services_framework_v1.1) décrit six domaines de service :

- **La gestion de l'écosystème des parties prenantes** : connaître et travailler avec tous les acteurs concernés, des équipes de développement aux clients, en passant par les chercheurs et les fournisseurs.
- **La découverte des vulnérabilités** : recevoir des signalements, et trouver des vulnérabilités par des tests ou en surveillant les composants tiers.
- **Le tri et l'analyse des vulnérabilités** : vérifier un signalement, le reproduire, et évaluer son impact et sa gravité.
- **La remédiation** : faire développer et publier un correctif ou un contournement avec les équipes de développement.
- **La divulgation des vulnérabilités** : informer les clients et le public, au bon moment et sous la bonne forme.
- **La formation et la sensibilisation** : aider les équipes à éviter les mêmes failles à l'avenir.

La question à laquelle répond un PSIRT : **notre produit est-il concerné, et que doivent faire nos clients ?**

## Le parcours d'une vulnérabilité dans un PSIRT

Chaque PSIRT a son propre processus, mais la plupart suivent les mêmes grandes étapes, décrites dans deux normes : [ISO/IEC 30111](https://www.iso.org/fr/standard/69725.html) pour le traitement interne des vulnérabilités, et [ISO/IEC 29147](https://www.iso.org/fr/standard/72311.html) pour leur divulgation.

1. **Signalement.** Une vulnérabilité arrive : d'un chercheur via une adresse de contact ou un fichier `security.txt`, d'un programme de bug bounty, de tests internes, ou d'un bulletin concernant un composant tiers utilisé par le produit.
2. **Tri.** Le PSIRT vérifie que le signalement est valide et identifie les produits et versions concernés.
3. **Analyse.** La vulnérabilité est reproduite et sa gravité évaluée, souvent avec un score CVSS, pour pouvoir la prioriser.
4. **Remédiation.** Les équipes de développement produisent un correctif, ou au moins un contournement, et le testent.
5. **Divulgation coordonnée.** Le PSIRT convient d'une date de publication avec la personne qui a fait le signalement, pour qu'un correctif soit disponible avant que les détails ne deviennent publics.
6. **Bulletin.** Le PSIRT publie un bulletin de sécurité : versions concernées, gravité, correctif ou contournement, et un identifiant CVE. De plus en plus de bulletins sont aussi publiés dans un format lisible par une machine, comme CSAF, pour que les clients puissent les traiter automatiquement.

Par rapport à un CSIRT, l'échelle de temps est différente. Un incident se compte en heures ou en jours ; une vulnérabilité produit prend souvent des semaines, parfois des mois, entre le premier signalement et le bulletin, car le correctif doit passer par le développement, les tests et la publication d'une version.

## Côte à côte

| | CSIRT | PSIRT |
|---|---|---|
| Protège | Les systèmes de l'organisation (ou de sa communauté) | Les produits livrés par l'organisation |
| Déclenché par | Un incident : une attaque, une compromission, une activité suspecte | Le signalement d'une vulnérabilité dans un produit |
| Principaux interlocuteurs | Les équipes IT et sécurité internes, la direction | Les clients, les chercheurs en sécurité, les équipes de développement |
| Résultat principal | Un incident maîtrisé, des systèmes restaurés, des enseignements | Un correctif, un bulletin de sécurité, une CVE |
| Échelle de temps | Des heures à quelques jours | Des semaines à quelques mois |
| Cadres de référence | CSIRT Services Framework du FIRST | PSIRT Services Framework du FIRST, ISO/IEC 29147 et 30111 |

## Un même événement, deux équipes : Log4Shell

En décembre 2021, une vulnérabilité critique a été rendue publique dans Apache Log4j, une bibliothèque de journalisation Java utilisée presque partout : [CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228), surnommée Log4Shell. Elle permettait d'exécuter du code à distance, parfois avec une simple chaîne de caractères bien choisie, et les attaques ont commencé presque aussitôt.

Dans une entreprise qui fabrique aussi des logiciels, les deux équipes ont vécu des semaines très différentes.

Le **CSIRT** a regardé vers l'intérieur : quels serveurs internes utilisaient Log4j, lesquels étaient exposés sur internet, y avait-il des traces d'exploitation dans les journaux ? Puis il a appliqué des correctifs ou des mesures de contournement, en s'appuyant sur des recommandations comme celles de la [CISA](https://www.cisa.gov/news-events/news/apache-log4j-vulnerability-guidance) (en anglais), et surveillé les attaques.

Le **PSIRT** s'est penché sur les produits : lesquels embarquaient Log4j, dans quelles versions, parfois enfoui à plusieurs niveaux dans leurs dépendances ? Pour chaque produit concerné, il a fallu faire publier une version corrigée et un bulletin. Et il a fallu répondre aux clients, qui voulaient savoir rapidement s'ils étaient exposés, y compris pour les produits qui ne l'étaient pas. C'est pour cette raison que de nombreux éditeurs ont publié des déclarations « non concerné ».

Même vulnérabilité, mêmes jours, mais une équipe protégeait l'entreprise et l'autre répondait de ce que l'entreprise avait vendu.

## Là où ils se rejoignent

Les deux équipes sont distinctes, mais elles travaillent ensemble :

- **Des signalements qui arrivent à la mauvaise équipe.** Un chercheur peut signaler au PSIRT une faille sur le site web de l'entreprise, alors qu'elle concerne un système interne et non un produit : le PSIRT la transmet au CSIRT, et inversement.
- **Des sources communes.** Les deux suivent les flux de vulnérabilités, le renseignement sur les menaces et les bulletins de leurs propres fournisseurs.
- **Des produits utilisés en interne.** Quand l'entreprise utilise ses propres produits, une vulnérabilité trouvée par le PSIRT concerne aussi le CSIRT.
- **La réglementation.** Le [Cyber Resilience Act](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2847) (CRA) européen ajoute un lien formel. Depuis le 11 septembre 2026, en vertu de son article 14, les fabricants de produits comportant des éléments numériques doivent signaler les vulnérabilités activement exploitées dans leurs produits à un CSIRT national désigné comme coordinateur et à l'ENISA : une alerte précoce sous 24 heures, une notification sous 72 heures, et un rapport final au plus tard 14 jours après la mise à disposition d'un correctif. Le travail du PSIRT alimente désormais directement les CSIRT nationaux.

## En bref

Un CSIRT protège une organisation contre les attaques visant ses propres systèmes ; un PSIRT veille à ce que les produits qu'elle vend soient dignes de confiance, et indique aux clients quoi faire quand ce n'est pas le cas. Avec des logiciels construits à partir de nombreux composants, et des réglementations comme le CRA, le PSIRT devient un élément aussi courant d'une entreprise qui fabrique des produits que le CSIRT l'est pour son informatique.
