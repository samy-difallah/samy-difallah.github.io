---
title: "Cyber Resilience Act : ce qui change pour les produits"
description: "L'UE fait de la cybersécurité une condition pour vendre des produits comportant des éléments numériques. Ce que couvre le CRA, ce qu'il exige des fabricants, et ce qu'il implique pour les équipes qui traitent les vulnérabilités."
date: 2026-11-26
order: 1
---

Pendant longtemps, la sécurité d'un produit vendu dans l'UE a surtout reposé sur la bonne volonté du fabricant. Certains éditeurs avaient un PSIRT, publiaient des bulletins et corrigeaient leurs produits pendant des années ; d'autres livraient un produit et ne le mettaient plus jamais à jour. Le Cyber Resilience Act (CRA) met fin à cette différence : la cybersécurité devient une condition de mise sur le marché européen, au même titre que la sécurité électrique, avec le marquage CE pour l'attester.

Cet article présente ce qu'est le CRA, les produits auxquels il s'applique, ce qu'il exige des fabricants, et la partie qui concerne le plus un PSIRT : le traitement des vulnérabilités et leur signalement aux autorités.

## Ce qu'est le CRA

Le CRA est le [règlement (UE) 2024/2847](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2847). Comme c'est un règlement et non une directive, il s'applique directement dans tous les États membres, sans transposition nationale. Il est entré en vigueur le 10 décembre 2024, mais ses obligations s'appliquent par étapes :

- **11 juin 2026** : les règles applicables aux organismes qui évalueront les produits (organismes d'évaluation de la conformité).
- **11 septembre 2026** : l'obligation de signaler les vulnérabilités activement exploitées et les incidents graves.
- **11 décembre 2027** : tout le reste, y compris les exigences de sécurité des produits eux-mêmes.

Depuis septembre 2026, les fabricants doivent donc déjà faire des signalements aux autorités, plus d'un an avant que leurs produits ne doivent respecter le reste du règlement.

## Les produits concernés

Le CRA s'applique aux « produits comportant des éléments numériques » mis à disposition sur le marché européen : le matériel et le logiciel, ainsi que les solutions de traitement de données à distance dont ils ont besoin pour fonctionner, comme le backend cloud d'une caméra connectée. Un service en ligne autonome (SaaS) n'est pas un produit au sens du CRA ; il relève d'autres textes, comme la directive NIS2.

Certains produits sont exclus parce que des règles sectorielles les couvrent déjà : les dispositifs médicaux, les véhicules à moteur, l'aviation civile et les équipements marins. Les produits développés exclusivement pour la sécurité nationale ou la défense sont aussi exclus.

L'open source fait l'objet d'un traitement particulier. Les logiciels libres et open source développés ou fournis en dehors de toute activité commerciale ne sont pas concernés. Les fondations et autres organisations qui soutiennent des projets open source destinés à un usage commercial, appelées gestionnaires de logiciels open source, ont des obligations allégées. En revanche, une entreprise qui intègre des composants open source dans un produit qu'elle vend en est responsable comme du reste de son produit.

## Catégories et évaluation de la conformité

Avant de mettre un produit sur le marché, le fabricant doit montrer qu'il respecte les exigences du CRA. La manière de le faire dépend de la catégorie du produit :

| Catégorie | Exemples | Évaluation de la conformité |
|---|---|---|
| Par défaut (la plupart des produits) | Logiciels de retouche photo, jeux, la plupart des logiciels grand public | Auto-évaluation par le fabricant |
| Important, classe I ([annexe III](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2847)) | Gestionnaires de mots de passe, VPN, systèmes d'exploitation, routeurs, navigateurs, SIEM | Auto-évaluation seulement si les normes harmonisées sont entièrement appliquées ; sinon un tiers |
| Important, classe II (annexe III) | Hyperviseurs et environnements d'exécution de conteneurs, pare-feu, systèmes de détection et de prévention d'intrusion | Évaluation par un tiers, ou certification européenne de cybersécurité |
| Critique ([annexe IV](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2847)) | Passerelles de compteurs intelligents, cartes à puce, éléments sécurisés | Certification européenne de cybersécurité, lorsqu'elle est exigée ; sinon comme la classe II |

Quelle que soit la catégorie, le fabricant rédige ensuite une déclaration UE de conformité et appose le marquage CE.

## Ce que doivent faire les fabricants

L'[annexe I](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2847) liste les exigences essentielles. Sa première partie concerne le produit lui-même. Entre autres, un produit doit :

- être mis à disposition sans vulnérabilité exploitable connue ;
- être livré avec une configuration sécurisée par défaut ;
- recevoir des mises à jour de sécurité, automatiques par défaut lorsque c'est pertinent ;
- protéger la confidentialité et l'intégrité de ses données, et limiter les données qu'il traite ;
- limiter sa surface d'attaque, ainsi que l'impact d'un incident ;
- enregistrer l'activité utile à la sécurité, et permettre aux utilisateurs de supprimer leurs données.

Le fabricant doit aussi fixer une période d'assistance, pendant laquelle il corrige les vulnérabilités. Elle doit durer au moins cinq ans, sauf si le produit est destiné à être utilisé moins longtemps. Les mises à jour de sécurité doivent être gratuites, et chacune doit rester disponible au moins dix ans après sa publication, ou jusqu'à la fin de la période d'assistance si celle-ci est plus longue.

## Le traitement des vulnérabilités : la part du PSIRT

La seconde partie de l'annexe I porte sur le traitement des vulnérabilités, c'est-à-dire l'essentiel du travail d'un [PSIRT](/fr/blog/psirt-vs-csirt/). Le fabricant doit :

- **identifier les composants du produit**, et les documenter dans une nomenclature logicielle (SBOM), dans un format couramment utilisé et lisible par une machine, couvrant au moins les dépendances de premier niveau ;
- **corriger les vulnérabilités sans délai**, par des mises à jour de sécurité, distinctes des mises à jour fonctionnelles lorsque c'est possible ;
- **tester et examiner** régulièrement la sécurité du produit ;
- **publier des informations sur les vulnérabilités corrigées** : une description, les produits concernés, l'impact et la gravité, et la manière d'y remédier ;
- **avoir une politique de divulgation coordonnée des vulnérabilités**, et une adresse de contact pour les signaler ;
- **diffuser les mises à jour de manière sécurisée**, sans délai et gratuitement, avec des bulletins expliquant quoi faire.

En vertu de l'[article 13, paragraphe 6](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2847), un fabricant qui trouve une vulnérabilité dans un composant qu'il utilise, open source compris, doit aussi la signaler à la personne ou à l'organisation qui maintient ce composant.

Rien de tout cela n'est nouveau pour un PSIRT mature : ce sont les pratiques décrites par le [PSIRT Services Framework du FIRST](https://www.first.org/standards/frameworks/psirts/psirt_services_framework_v1.1) (en anglais) et par les normes ISO/IEC 29147 et 30111. Ce qui change, c'est qu'elles ne sont plus de bonnes pratiques, mais une obligation légale.

## Le signalement aux autorités

L'[article 14](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2847) est l'obligation qui s'applique déjà. Le fabricant doit signaler deux types d'événements via une plateforme unique de signalement gérée par l'ENISA, qui les transmet au CSIRT national désigné comme coordinateur.

**Une vulnérabilité activement exploitée** dans l'un de ses produits :

1. une alerte précoce dans les 24 heures après en avoir eu connaissance ;
2. une notification de la vulnérabilité dans les 72 heures, avec ce que l'on sait de la vulnérabilité, de son exploitation et des mesures prises ;
3. un rapport final au plus tard 14 jours après la mise à disposition d'un correctif ou d'une mesure d'atténuation.

**Un incident grave ayant un impact sur la sécurité du produit** : une alerte précoce dans les 24 heures, une notification dans les 72 heures, et un rapport final dans un délai d'un mois.

Le fabricant doit aussi informer les utilisateurs du produit, et leur indiquer comment se protéger.

### Exploitée, pas exploitable

Une erreur de lecture fréquente consiste à penser que toute vulnérabilité grave doit être signalée sous 24 heures. Ce n'est pas le cas : l'obligation vise les vulnérabilités **exploitées**, et non celles qui sont seulement **exploitables**. Le CRA définit une vulnérabilité activement exploitée comme une vulnérabilité pour laquelle il existe des éléments de preuve fiables qu'un acteur malveillant l'a exploitée dans un système sans l'autorisation de son propriétaire. Une vulnérabilité découverte de bonne foi, par un chercheur ou lors de tests, n'en fait pas partie.

Quelques exemples aident à y voir clair :

- **Un chercheur signale une faille critique d'exécution de code à distance**, avec un score CVSS de 9,8, via l'adresse de contact de l'éditeur. Rien n'indique que quelqu'un l'a utilisée. C'est une vulnérabilité à corriger et à divulguer au titre de l'annexe I, mais elle ne déclenche pas de signalement au titre de l'article 14.
- **Le chercheur publie une preuve de concept fonctionnelle.** La vulnérabilité est désormais plus facile à exploiter, mais un exploit public n'est pas, à lui seul, la preuve qu'un acteur malveillant l'a utilisée. Toujours pas de signalement, mais le correctif devient encore plus urgent, et la situation doit être surveillée de près.
- **Un client découvre que des attaquants sont entrés dans l'un de ses équipements par cette faille.** Il existe maintenant une preuve fiable d'exploitation, dans le système du client. Le délai de 24 heures commence quand le fabricant en a connaissance.
- **Des attaquants compromettent le serveur de mises à jour du fabricant et diffusent une mise à jour malveillante.** Aucune vulnérabilité du produit n'est forcément en cause, mais c'est un incident grave ayant un impact sur la sécurité du produit, et il doit être signalé.

L'autre face du même point : l'exploitation n'a pas besoin d'avoir lieu dans le système d'information du fabricant. Le plus souvent, elle aura lieu chez un client. Et une attaque contre les propres systèmes du fabricant ne doit être signalée au titre du CRA que si elle affecte la sécurité de ses produits.

## Calendrier et sanctions

| Date | Ce qui s'applique |
|---|---|
| 10 décembre 2024 | Entrée en vigueur |
| 11 juin 2026 | Règles applicables aux organismes d'évaluation de la conformité |
| 11 septembre 2026 | Obligations de signalement (article 14) |
| 11 décembre 2027 | Toutes les autres obligations |

Les amendes peuvent atteindre 15 millions d'euros ou 2,5 % du chiffre d'affaires annuel mondial, le montant le plus élevé étant retenu, en cas de non-respect des exigences essentielles et des obligations du fabricant, signalement compris. Les autorités peuvent aussi ordonner le retrait du marché d'un produit non conforme.

## Ce que cela change en pratique

Dans mon travail au sein d'un PSIRT, le CRA n'a pas tout bouleversé : traiter les vulnérabilités, les corriger et publier des bulletins faisait déjà partie du métier. Apprendre le règlement en détail a été utile en soi. Ce qu'il change surtout, c'est la vitesse. Un délai de 24 heures ne laisse pas le temps de chercher quels produits contiennent un composant donné, ni de rédiger un bulletin à la main.

C'est pourquoi l'automatisation et les formats standards ne sont plus optionnels. Un PSIRT qui tient à jour une SBOM pour chaque produit peut savoir en quelques minutes s'il est concerné par une nouvelle vulnérabilité ; un PSIRT qui publie ses bulletins dans un format lisible par une machine, comme CSAF, permet à ses clients de les traiter aussi vite. C'est ce sur quoi je travaille aujourd'hui.

La pression augmente aussi de l'autre côté. Les outils d'IA aident désormais à trouver des vulnérabilités à un rythme qui n'était pas possible il y a quelques années, pour les défenseurs comme pour les attaquants. Dans mon propre travail, j'ai vu le nombre de vulnérabilités et d'alertes à traiter augmenter fortement, une bonne partie d'entre elles ayant été trouvées avec l'aide de l'IA. Plus de vulnérabilités trouvées plus vite, c'est plus de tri à faire, et les délais du CRA ne s'allongent pas avec le volume.

## En bref

Le CRA fait de la sécurité des produits une obligation légale dans l'UE : sécurisés par défaut, maintenus pendant des années, avec des vulnérabilités traitées et divulguées correctement. La plupart des obligations s'appliquent à partir de décembre 2027, mais le signalement des vulnérabilités activement exploitées est déjà obligatoire depuis septembre 2026. Pour beaucoup de fabricants, s'y conformer passera par un vrai PSIRT, avec des outils assez rapides pour tenir les délais.
