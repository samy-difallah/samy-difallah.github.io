---
title: "SBOM : savoir ce que contiennent ses produits"
description: "Un SBOM liste les composants dont un produit est fait. Ce que contient un SBOM, pourquoi il est devenu une exigence, comment en générer un avec Syft, et quelles sont ses limites."
date: 2026-11-27
order: 2
---

Quand la vulnérabilité Log4Shell a été rendue publique en décembre 2021, la première question pour chaque éditeur était simple : lesquels de nos produits sont impactés par Log4j, et dans quelles versions ? Pour beaucoup d'entre eux, y répondre a pris des jours. Log4j était rarement une dépendance directe : la bibliothèque était tirée par d'autres dépendances, parfois plusieurs niveaux plus bas, ou intégrée dans un composant tiers. Un [PSIRT](/fr/blog/psirt-vs-csirt/) ne peut pas qualifier une vulnérabilité sur un produit avant de savoir si ce produit est impacté.

Un SBOM (Software Bill of Materials, ou nomenclature logicielle) doit permettre de répondre en quelques minutes. Cet article présente ce que contient un SBOM, pourquoi il est devenu une exigence en quelques années, comment en générer un, et quelles sont ses limites.

## Ce qu'est un SBOM

Un SBOM est un inventaire des composants dont un logiciel est fait : bibliothèques open source, composants commerciaux et modules développés par l'organisation elle-même, avec leurs versions et les relations entre eux. On le compare souvent à la liste des ingrédients sur un emballage alimentaire : elle ne dit pas si le produit est bon, mais elle dit ce qu'il contient.

En 2021, la NTIA américaine a défini les [éléments minimaux](https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom) qu'un SBOM devrait contenir pour chaque composant :

- **le nom du fournisseur** : qui fabrique le composant ;
- **le nom du composant** et **sa version** ;
- **d'autres identifiants uniques**, comme un PURL ou un CPE, pour retrouver le composant dans les bases de vulnérabilités ;
- **les relations de dépendance** : quel composant en inclut quel autre ;
- **l'auteur des données du SBOM** et **un horodatage** : qui a produit le SBOM, et quand.

Un SBOM est aussi fait pour être lu par des machines, pas par des personnes. Il est écrit dans un format standard, principalement CycloneDX ou SPDX, pour que des outils puissent le générer, l'échanger et le corréler avec les bases de vulnérabilités.

## Un petit exemple

Voici un SBOM raccourci au format CycloneDX pour une application web fictive, `example-app`, qui utilise le framework Flask. Flask dépend lui-même de Jinja2, le moteur de templates :

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

Les éléments minimaux sont tous là : l'auteur et l'horodatage dans `metadata`, le nom, la version et le PURL de chaque composant, et les relations dans `dependencies`. C'est ce dernier bloc qui indique que Jinja2 n'est pas utilisé directement par l'application, mais arrive par Flask. Si une vulnérabilité est publiée demain dans Jinja2, ce SBOM montre qu'`example-app` 1.4.0 embarque la version vulnérable, et par quelle chaîne de dépendances.

Un vrai SBOM contient beaucoup plus de composants et de champs, comme les licences ou les empreintes cryptographiques. Les formats eux-mêmes, CycloneDX et SPDX, méritent un article à part.

## Pourquoi maintenant

L'idée n'est pas nouvelle : les outils d'analyse de composition logicielle (SCA) inventorient les dépendances depuis des années. Ce qui a changé, c'est que quelques événements ont fait passer le SBOM de bonne pratique à exigence :

- **L'attaque SolarWinds**, révélée en décembre 2020, a montré comment la compromission d'un fournisseur, une attaque sur la chaîne d'approvisionnement logicielle, peut toucher des milliers de clients par une seule mise à jour.
- **L'Executive Order 14028** américain, en mai 2021, a demandé aux éditeurs qui vendent des logiciels à l'administration fédérale américaine de fournir un SBOM. Les éléments minimaux de la NTIA ont été publiés deux mois plus tard.
- **Log4Shell**, en décembre 2021, a montré à grande échelle ce qui se passe quand les éditeurs ne maîtrisent pas les composants de leurs produits.
- **Le [Cyber Resilience Act](/fr/blog/cyber-resilience-act/)** impose aux fabricants d'identifier les composants de leurs produits et de les documenter dans un SBOM, dans un format couramment utilisé et lisible par machine, couvrant au minimum les dépendances de premier niveau. Le SBOM fait partie de la documentation technique : il n'a pas à être publié, mais doit être fourni aux autorités sur demande.
- En Allemagne, la directive technique [TR-03183](https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/Technische-Richtlinien/TR-nach-Thema-sortiert/tr03183/TR-03183_node.html) du BSI décrit plus en détail ce qu'un SBOM devrait contenir pour répondre au CRA.

Il y a aussi une raison plus simple : la plus grande partie du code d'un produit moderne n'est pas écrite par l'éditeur. Les composants open source et tiers en représentent une large part, et chacun élargit la surface d'attaque avec ses propres vulnérabilités.

## Profondeur et types

Deux SBOM d'un même produit peuvent être très différents, selon leur profondeur et le moment où ils sont produits.

**La profondeur.** Les dépendances de premier niveau sont celles que le produit utilise directement, comme Flask dans l'exemple. Les dépendances transitives sont celles que ces composants apportent à leur tour, comme Jinja2. Le CRA demande au minimum celles de premier niveau, mais les vulnérabilités se cachent souvent plus bas : avec Log4Shell, Log4j était souvent une dépendance transitive. Un SBOM qui s'arrête au premier niveau l'aurait manquée.

**Les types.** La CISA décrit [six types de SBOM](https://www.cisa.gov/resources-tools/resources/types-software-bill-materials-sbom), selon le moment de la vie du produit où il est généré :

- **design** : pour un produit qui n'existe pas encore, à partir des composants prévus ;
- **source** : à partir du code source et de ses fichiers de dépendances ;
- **build** : pendant la compilation, à partir des composants réellement inclus ;
- **analyzed** : à partir d'un artefact fini, comme un binaire ou une image de conteneur, analysé par un outil ;
- **deployed** : à partir du logiciel tel qu'il est installé sur un système, avec sa configuration ;
- **runtime** : à partir de ce qui est réellement chargé et exécuté.

Chaque type voit des choses différentes. Un SBOM source peut lister des dépendances de développement qui n'arrivent jamais dans le produit ; un SBOM analyzed ne trouve que ce qui laisse des traces reconnaissables dans l'artefact. Savoir comment un SBOM a été produit aide à savoir quelle confiance lui accorder.

## En générer un avec Syft

[Syft](https://github.com/anchore/syft) est un outil open source d'Anchore qui génère des SBOM à partir d'images de conteneurs, de répertoires et de fichiers. C'est un bon moyen de voir à quoi ressemble un SBOM pour un vrai logiciel, et il suffit d'une commande :

```shell
# Lister les paquets d'une image de conteneur, sous forme de tableau
syft alpine:3.20

# Écrire un SBOM CycloneDX de l'image dans un fichier
syft alpine:3.20 -o cyclonedx-json=sbom.cdx.json

# Même chose pour un répertoire de projet, au format SPDX
syft dir:. -o spdx-json=sbom.spdx.json
```

Syft cherche les traces que laissent les gestionnaires de paquets : les bases des paquets système (apk, dpkg, rpm), et les manifestes et fichiers de verrouillage des écosystèmes de langages comme npm, pip, Maven ou les modules Go. Pour chaque paquet trouvé, il enregistre le nom, la version et la licence, et génère un PURL et des CPE, dont les scanners de vulnérabilités ont besoin pour le corréler avec les vulnérabilités connues.

Le SBOM peut ensuite être transmis à un scanner. [Grype](https://github.com/anchore/grype), du même éditeur, le lit directement :

```shell
grype sbom:./sbom.cdx.json
```

Séparer les deux étapes a un vrai avantage : le SBOM est généré une fois, à la compilation, et peut être rescanné chaque jour pour détecter les nouvelles vulnérabilités, sans accès au produit lui-même.

La limite découle de son fonctionnement : Syft trouve ce que les gestionnaires de paquets déclarent. Une bibliothèque copiée dans l'arborescence des sources, du code compilé statiquement dans un binaire, ou un composant installé à la main sans métadonnées de paquet peuvent ne pas apparaître du tout.

## Ce qu'en fait un PSIRT

Pour un PSIRT, un SBOM est avant tout un moyen de répondre vite à la question « sommes-nous impactés ? ». Quand une nouvelle vulnérabilité est publiée, le PSIRT recherche le composant vulnérable dans les SBOM de tous ses produits et de toutes leurs versions, au lieu de solliciter chaque équipe de développement. Les mêmes SBOM servent à répondre aux clients, qui les demandent de plus en plus, et à respecter les délais de notification du CRA.

Mais un SBOM ne donne qu'un point de départ :

- **Un composant vulnérable n'est pas toujours une vulnérabilité exploitable.** Le produit peut ne pas utiliser la fonction vulnérable, ou ne pas l'exposer. La corrélation des SBOM avec les bases de vulnérabilités génère beaucoup de faux positifs, et chacun doit être analysé. Les documents VEX (Vulnerability Exploitability eXchange) existent pour indiquer aux clients quelles vulnérabilités n'impactent pas le produit.
- **La corrélation dépend des identifiants.** Sans PURL ou CPE correct, un composant ne peut pas être retrouvé de façon fiable dans les bases de vulnérabilités : soit il est manqué, soit il est confondu avec un autre. Ces identifiants méritent un article à part.
- **Un SBOM ne vaut que ce que vaut sa source.** Un SBOM incomplet donne un faux sentiment de sécurité, ce qui peut être pire que pas de SBOM du tout.

## Encore plus nécessaire avec l'IA

Les outils d'IA aident désormais à découvrir des vulnérabilités plus vite qu'avant, et 2026 en a donné plusieurs exemples. En octobre, deux vulnérabilités dans l'interpréteur PHP lui-même, CVE-2026-109618 et CVE-2026-109619, surnommées PHP2Shell, ont été rendues publiques avec un score CVSS 4.0 de 9,2. Elles permettent une exécution de code à distance et impactent PHP de la version 5.4 jusqu'aux versions correctives 8.2.35, 8.3.36, 8.4.27 et 8.5.12. Plusieurs des équipes créditées de leur découverte [ont indiqué avoir utilisé des modèles d'IA](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote) dans leurs recherches. La CISA les a ajoutées toutes les deux à son [catalogue Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) le 26 octobre. Un mois plus tard, le 19 novembre, PHP a corrigé 18 autres vulnérabilités, dont sept jugées critiques.

PHP fait tourner une large part des sites web, mais aussi les interfaces web de nombreux produits IT, comme les consoles d'administration d'équipements réseau et de sécurité. Pour leurs éditeurs, la première question était la même qu'avec Log4Shell, et PHP2Shell illustre plusieurs points de cet article :

- **L'environnement d'exécution est aussi un composant.** PHP n'apparaît pas dans le `composer.json` d'une application : c'est l'interpréteur sur lequel elle tourne. Un SBOM généré uniquement à partir des fichiers de dépendances de l'application le manque ; un SBOM du produit complet, système d'exploitation compris, le voit.
- **Le numéro de version ne suffit pas.** Les distributions Linux rétroportent souvent les correctifs sans changer le numéro de version amont : le paquet PHP 8.2 d'une distribution peut être corrigé alors que sa version semble vulnérable. L'identifiant doit indiquer d'où vient le paquet, ce que fait un PURL comme `pkg:deb/debian/php8.2`.
- **Les versions en fin de vie restent vulnérables.** Les branches antérieures à 8.2 n'ont reçu aucune version corrective officielle. Un SBOM montre quels produits embarquent encore une telle version, et nécessitent plus qu'une simple mise à jour.
- **Ce qui est installé n'est pas toujours ce qui s'exécute.** Mettre à jour le paquet sur le disque ne change pas les processus PHP-FPM déjà lancés : il [faut les redémarrer](https://cloud.google.com/blog/products/identity-security/responding-to-core-php-vulnerabilities-cve-2026-109618-cve-2026-109619). Seule une vue runtime le montre.

Plus tôt dans l'année, Copy Fail, Dirty Frag et Fragnesia, trois vulnérabilités d'élévation de privilèges dans le noyau Linux, ont été rendues publiques en quelques semaines, dont au moins deux découvertes avec des outils d'IA. Pour un produit qui embarque Linux, le SBOM donne la version du noyau, mais pas les modules compilés, et c'est souvent ce qui détermine si le produit est exploitable.

Plus de vulnérabilités découvertes plus vite, c'est moins de temps pour qualifier chacune d'elles. Un PSIRT qui doit vérifier ses produits à la main ne peut pas suivre ; un PSIRT qui dispose de SBOM complets et fiables peut au moins répondre vite à la première question, et consacrer son temps à l'analyse.

## En pratique

J'ai moi-même généré des SBOM, surtout pour des tests, avec des outils comme Syft. En produire un est facile ; en produire un bon ne l'est pas. Les difficultés que j'ai rencontrées sont surtout celles-ci :

- **La qualité.** Deux outils peuvent donner des résultats différents pour le même produit, et un SBOM peut sembler complet tout en manquant des composants, ou lister des composants qui ne sont pas dans le produit.
- **Les identifiants manquants.** Les composants sans PURL ni CPE, ou avec un identifiant faux, ne peuvent pas être corrélés avec les bases de vulnérabilités, et la correction doit souvent se faire à la main.
- **Les firmwares et produits matériels.** Les outils sont faits pour des écosystèmes logiciels avec des gestionnaires de paquets. Un firmware contient souvent des binaires fournis par des tiers, sans métadonnées, et le SBOM dépend alors de ce que les fournisseurs veulent et peuvent fournir.
- **La gestion des dépendances.** Les plages de versions, plusieurs versions de la même bibliothèque dans un produit, le code tiers copié dans les sources ou les dépendances de développement mélangées à celles d'exécution rendent plus difficile de savoir ce qui est réellement livré.

## En bref

Un SBOM liste ce dont un produit est fait : ses composants, leurs versions, leurs identifiants et leurs dépendances entre eux. Depuis SolarWinds, Log4Shell et maintenant le CRA, il n'est plus optionnel pour les fabricants. En générer un prend une commande avec un outil comme Syft, mais sa valeur dépend de sa qualité : complet, avec des identifiants corrects, et tenu à jour pour chaque version du produit.
