<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Préchargeur de Liens

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**Expérience de Navigation à Latence Zéro | Préchargement Intelligent | Transition Fluide**

[Fonctionnalités](#-fonctionnalités) • [Installation](#-installation) • [Utilisation](#-utilisation) • [Fonctionnement](#️-fonctionnement) • [FAQ](#-faq)

</div>

---
<p align="center">
  <a href="../en-US/README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="../../README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="../ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="../es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="../fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="../ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="../ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="../vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="../de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="../bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>

## 📖 Introduction

Webpremium est une extension Chrome révolutionnaire qui offre une expérience de navigation web à **latence zéro** grâce à une technologie de préchargement intelligent.
Lorsque vous survolez un lien avec votre souris, l'extension ouvre la page à l'avance dans une fenêtre de préchargement en arrière-plan. Lorsque vous cliquez réellement sur le lien, l'onglet préchargé se déplace de manière transparente vers la fenêtre principale, sans aucun temps d'attente perceptible.

### ✨ Points Forts

- 🎯 **Expérience à Latence Zéro** - Préchargement au survol, ouverture au clic
- 🪟 **Technologie de Fenêtre de Préchargement** - Préchargement dans une fenêtre indépendante, sans interférence avec la fenêtre principale
- 🔄 **Déduplication Intelligente d'Onglets** - Détecte automatiquement les onglets dupliqués et saute vers l'existant au clic
- 🏠 **Page Tab-out de Nouvel Onglet** - Beau panneau de gestion de nouvel onglet avec favoris et organisation
- 📊 **Statistiques en Temps Réel** - Suit l'effet du préchargement et le temps économisé
- 🎨 **Interface Moderne** - Support du mode sombre, interface épurée et élégante
- ⚙️ **Hautement Personnalisable** - Options de configuration riches pour répondre aux besoins personnalisés
- 🌐 **Support Multilingue** - Prend en charge le chinois simplifié, chinois traditionnel, anglais et plus

---

## 🎯 Fonctionnalités

### Fonctions Principales

#### 1. Préchargement Intelligent
- **Déclenchement au Survol** - Préchargement automatique lors du survol des liens
- **Délai Ajustable** - Support de configuration de délai de survol de 0-1000ms
- **Prédiction des Liens Proches** - Identifie intelligemment les liens proches du curseur et les précharge
- **Contrôle de la Quantité** - Configure le nombre maximum de préchargements simultanés (1-10)
- **Éviction de Cache LRU** - Évince automatiquement les préchargements les moins récemment utilisés lorsque la limite est dépassée

#### 2. Modes de Préchargement
- **Mode Fenêtre de Préchargement (Recommandé)** - Préchargement dans une fenêtre minimisée indépendante, chargement complet de la page
- **Mode Préchargement iframe** - Méthode de préchargement légère, bonne compatibilité

#### 3. Déduplication Intelligente d'Onglets et Saut (Smart Tab Dedup)
- **Détection des Onglets Dupliqués** - Détecte si la page cible est déjà ouverte dans la fenêtre actuelle avant le préchargement
- **Saut Automatique** - Saute automatiquement vers l'onglet existant au clic sur des liens déjà ouverts, évite les doublons
- **Saut du Préchargement** - Saute le préchargement et bascule directement si la page cible est déjà ouverte
- **Expérience Fluide** - Met automatiquement le focus sur l'onglet et la fenêtre cible

#### 4. Gestion de la Page Tab-out de Nouvel Onglet
- **Belle Page de Nouvel Onglet** - Remplace la page de nouvel onglet par défaut par un panneau de gestion riche en fonctionnalités
- **Disposition à Trois Colonnes** - Favoris à gauche, onglets ouverts au centre, lecture ultérieure à droite
- **Regroupement par Domaine** - Regroupe automatiquement les onglets ouverts par domaine
- **Fonction de Favoris** - Favoris à long terme pour les sites fréquemment utilisés avec des icônes personnalisées
- **Badge de Compteur d'Onglets** - L'icône de la barre d'outils affiche le nombre actuel d'onglets ouverts
- **Détection d'Onglets Dupliqués** - Détecte et invite à fermer les pages de nouvel onglet dupliquées
- **Actions Rapides** - Fermer l'onglet, épingler, ajouter aux favoris, etc. en un clic
- **Mode Sombre** - Prise en charge du basculement entre les thèmes clair/sombre
- **Multilingue** - Prise en charge du basculement d'interface en chinois/anglais

#### 5. Conscience du Réseau
- **Détection Intelligente** - Détecte automatiquement l'état du réseau
- **Stratégie Adaptative** - Réduit automatiquement le préchargement sur les réseaux lents
- **Économie de Données** - Évite de gaspiller des données dans des environnements réseau faibles

#### 6. Mise en Sourdine du Préchargement
- **Mis en Sourdine par Défaut** - Les onglets préchargés sont mis en sourdine par défaut pour éviter la lecture automatique de vidéos/diffusions en direct
- **Activer le Son Manuellement** - Cliquez sur la barre d'adresse après l'activation pour activer le son

#### 7. Indicateur Visuel
- **Affichage de l'État** - Affiche un petit point à côté du lien indiquant l'état du préchargement
- **Animation de Chargement** - Point orange indique le chargement en cours
- **Marque de Chargement Complet** - Point vert indique le préchargement terminé

#### 8. Gestion des Règles de Sites
- **Règles Personnalisées** - Active ou désactive le préchargement pour des sites spécifiques
- **Contrôle au Niveau du Domaine** - Contrôle précis du préchargement par domaine
- **Menu Contextuel** - Change rapidement l'état du préchargement du site actuel
- **Règles par Défaut** - Préchargement désactivé par défaut pour les sites vidéo tels que Douyin

#### 9. Statistiques et Analyse
- **Nombre de Préchargements** - Enregistre le nombre total de préchargements
- **Statistiques de Taux de Réussite** - Calcule le taux d'utilisation efficace du préchargement
- **Temps Économisé** - Statistiques du temps total économisé
- **Durée de Session** - Affiche la durée d'utilisation de la session actuelle

### Raccourcis Clavier

- `Alt + P` - Activer/désactiver rapidement la fonction de préchargement (doit être activé dans les paramètres)
- `Alt + C` - Effacer tout le cache de préchargement (doit être activé dans les paramètres)
- Les raccourcis sont désactivés par défaut pour éviter les conflits avec le système ou d'autres extensions

### Menu Contextuel

- **Précharger ce lien** - Précharge manuellement le lien sélectionné
- **Activer/Désactiver le préchargement sur ce site** - Change rapidement l'état du préchargement du site actuel
- **Ajouter la page aux favoris** - Ajoute la page actuelle aux favoris Tab-out
- **Ajouter le lien aux favoris** - Ajoute le lien aux favoris Tab-out

---

## 📦 Installation

### Méthode 1 : Installation en Mode Développeur

1. **Télécharger le code source**
   Télécharger depuis la page [releases](https://github.com/Yikumasai/Webpremium/releases)
   
   ou
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

2. **Ouvrir la page des extensions Chrome**
   - Entrez `chrome://extensions/` dans la barre d'adresse
   - Ou cliquez sur menu → Plus d'outils → Extensions

3. **Activer le mode développeur**
   - Activez l'interrupteur "Mode développeur" en haut à droite

4. **Charger l'extension**
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `webpremium` téléchargé

5. **Terminer l'installation**
   - L'icône de l'extension apparaîtra dans la barre d'outils du navigateur
   - Cliquez sur l'icône pour ouvrir le panneau de configuration

### Méthode 2 : Chrome Web Store
> À venir

---

## 🎮 Utilisation

### Utilisation de Base

1. **Activer l'extension**
   - L'extension est activée par défaut après l'installation
   - Cliquez sur l'icône de la barre d'outils pour voir l'état

2. **Expérimenter le préchargement**
   - Survolez n'importe quel lien avec votre souris
   - Attendez le délai configuré (100ms par défaut)
   - Un point vert apparaîtra à côté du lien indiquant le préchargement terminé
   - Cliquez sur le lien pour l'ouvrir instantanément

3. **Saut Intelligent d'Onglets**
   - Lorsque la page cible est déjà ouverte dans la fenêtre actuelle
   - Cliquer sur le lien saute automatiquement vers l'onglet existant
   - Évite d'ouvrir la même page deux fois

4. **Voir les statistiques**
   - Cliquez sur l'icône de l'extension
   - Passez à l'onglet "Statistiques"
   - Voir l'effet du préchargement et le temps économisé

### Page Tab-out de Nouvel Onglet

1. **Activer Tab-out**
   - Ouvrir le panneau de configuration
   - Activez "Page Tab-out de Nouvel Onglet" sous "Fonctionnalités Avancées"
   - Ouvrez un nouvel onglet pour voir le panneau de gestion

2. **Utiliser les Favoris**
   - Cliquez sur le bouton "+" en haut à gauche pour ajouter des favoris
   - Faites un clic droit sur un onglet et sélectionnez "Ajouter aux favoris"
   - Les favoris persistent pour un accès rapide

3. **Gérer les Onglets**
   - La colonne centrale affiche tous les onglets ouverts (regroupés par domaine)
   - Cliquez sur un onglet pour basculer vers sa page
   - Cliquez sur "×" pour fermer un onglet ou un groupe de domaine entier

### Configuration Avancée

#### Ajuster le Délai de Survol
- Ouvrir le panneau de configuration
- Faites glisser le curseur "Délai de survol"
- Valeur recommandée : 100-300ms

#### Configurer le Nombre de Préchargements
- Ouvrir le panneau de configuration
- Faites glisser le curseur "Nombre maximum de préchargements"
- Valeur recommandée : 3-5

#### Sélectionner le Mode de Préchargement
- **Mode Fenêtre de Préchargement** : Préchargement complet, meilleure expérience (recommandé)
- **Mode iframe** : Léger, bonne compatibilité

#### Activer les Raccourcis
- Ouvrir le panneau de configuration
- Activez l'option "Activer les raccourcis"
- Utilisez `Alt+P` pour basculer le préchargement, `Alt+C` pour effacer le cache
- Personnalisez les raccourcis dans les paramètres de raccourcis Chrome

#### Gestion des Règles de Sites
1. Passer à l'onglet "Règles de sites"
2. Cliquer sur le bouton "Ajouter une règle"
3. Entrer le domaine (ex : example.com)
4. Configurer l'état activé ou désactivé

---

## ⚙️ Fonctionnement

### Flux de Préchargement

```
L'utilisateur survole le lien
    ↓
Attendre le délai
    ↓
Vérifier l'état du réseau
    ↓
Vérifier les règles du site
    ↓
Créer la fenêtre de préchargement
    ↓
Ouvrir l'onglet dans la fenêtre de préchargement
    ↓
Minimiser la fenêtre de préchargement
    ↓
L'utilisateur clique sur le lien
    ↓
Déplacer l'onglet vers la fenêtre principale
    ↓
Activer l'onglet
    ↓
Terminé !
```

### Architecture Technique

- **Content Script** - Écoute les événements de liens de page, déclenche le préchargement
- **Background Service Worker** - Gère la fenêtre de préchargement et les onglets
- **Popup UI** - Fournit l'interface de configuration et les informations statistiques
- **Chrome Storage API** - Persiste la configuration et les données statistiques

### Technologie de Fenêtre de Préchargement

L'extension utilise une fenêtre de préchargement indépendante pour précharger les pages :

1. Crée une petite fenêtre de type normal
2. Minimise immédiatement cette fenêtre
3. Crée un onglet de préchargement dans la fenêtre
4. Déplace l'onglet vers la fenêtre principale lorsque l'utilisateur clique
5. Active l'onglet et met le focus sur la fenêtre principale

Avantages de cette approche :
- ✅ Préchargement complet de la page (incluant JavaScript, CSS, images, etc.)
- ✅ La fenêtre principale n'est pas du tout affectée
- ✅ Les onglets peuvent être déplacés de manière transparente
- ✅ Prend en charge tous les sites et pages complexes

---

## 🎨 Aperçu de l'Interface

### Panneau de Configuration
- Contrôle simple par interrupteur
- Ajustement intuitif par curseur
- Liste de préchargement en temps réel
- Affichage des liens proches

### Panneau de Statistiques
- Nombre total de préchargements
- Pourcentage de taux de réussite
- Statistiques de temps économisé
- Affichage de durée de session

### Règles de Sites
- Gestion de liste de domaines
- État activé/désactivé
- Ajout/suppression rapide

---

## 🔧 Options de Configuration

| Option | Description | Valeur par Défaut | Valeur Recommandée |
|------|------|--------|--------|
| Activer le préchargement | Interrupteur principal | Activé | Activé |
| Délai de survol | Temps après le survol pour déclencher le préchargement | 100ms | 100-300ms |
| Nombre maximum | Quantité maximale de préchargements simultanés | 5 | 3-5 |
| Mode de préchargement | Méthode de préchargement | Fenêtre | Fenêtre |
| Conscience du réseau | Ajuster selon l'état du réseau | Activé | Activé |
| Afficher l'indicateur | Afficher le point d'état | Activé | Activé |
| Mise en sourdine | Mettre en sourdine les onglets préchargés par défaut | Activé | Activé |
| Déduplication d'onglets | Détecter et basculer vers les onglets ouverts | Activé | Activé |
| Page Tab-out de Nouvel Onglet | Activer le panneau de gestion | Désactivé | Selon les besoins |
| Raccourcis | Activer Alt+P / Alt+C | Désactivé | Selon les besoins |

---

## ❓ FAQ

### Q : Le préchargement consomme-t-il beaucoup de données ?
R : L'extension détecte intelligemment l'état du réseau et réduit automatiquement le préchargement sur les réseaux lents. Vous pouvez également contrôler la consommation de données en ajustant le "Nombre maximum de préchargements".

### Q : Le préchargement affecte-t-il les performances du navigateur ?
R : Le préchargement utilise une fenêtre indépendante, donc l'impact sur les performances de la fenêtre principale est minime. De plus, l'extension nettoie automatiquement le contenu de préchargement expiré.

### Q : Pourquoi le préchargement échoue-t-il sur certains sites ?
R : Certains sites peuvent avoir des mécanismes de protection. Vous pouvez désactiver le préchargement pour ces sites dans "Règles de sites".

### Q : Comment savoir si un lien a été préchargé ?
R : Après avoir activé "Afficher l'indicateur", un point vert apparaîtra à côté des liens préchargés.

### Q : La fenêtre de préchargement sera-t-elle affichée ?
R : Non. La fenêtre de préchargement est immédiatement minimisée et n'affecte pas du tout votre expérience de navigation.

### Q : Puis-je désactiver le préchargement pour des sites spécifiques ?
R : Oui. Ajoutez des règles de domaine dans l'onglet "Règles de sites", ou faites un clic droit sur la page et sélectionnez "Activer/Désactiver le préchargement sur ce site".

### Q : Qu'est-ce que la Déduplication Intelligente d'Onglets ?
R : Lorsque le lien sur lequel vous êtes sur le point de cliquer est déjà ouvert dans la fenêtre actuelle, l'extension saute automatiquement vers l'onglet existant au lieu d'en ouvrir un nouveau. Cela évite les onglets dupliqués et économise la mémoire.

### Q : Qu'est-ce que Tab-out ?
R : Tab-out est un beau panneau de gestion de nouvel onglet qui affiche tous vos onglets ouverts (regroupés par domaine), les favoris pour les sites fréquemment utilisés, la gestion de la lecture ultérieure et plus encore.

### Q : Les onglets préchargés émettront-ils du son ?
R : Non. Les onglets préchargés sont mis en sourdine par défaut pour éviter la lecture automatique du son des sites vidéo ou de diffusion en direct. Après l'activation, vous pouvez cliquer sur la barre d'adresse pour activer le son.

### Q : Pourquoi mes raccourcis ne fonctionnent-ils pas ?
R : Les raccourcis sont désactivés par défaut et doivent être activés manuellement dans les paramètres. Cela évite les conflits avec les raccourcis système ou d'autres extensions.

---

## 🚀 Historique des Versions

### v2.1.0 (Version Actuelle)
- ✨ **Déduplication Intelligente d'Onglets et Saut** - Détecte si la page cible est déjà ouverte dans la fenêtre actuelle avant le préchargement ; saute vers l'onglet existant au clic
- ✨ **Gestion de la Page Tab-out de Nouvel Onglet** - Beau panneau de nouvel onglet avec regroupement par domaine, favoris et badge de compteur
- ✨ **Mise en Sourdine du Préchargement** - Onglets préchargés mis en sourdine par défaut pour éviter la lecture automatique du son
- ✨ **Détection de Conflits de Raccourcis** - Détecte et avertit automatiquement des conflits de raccourcis
- ✨ **Support Multilingue** - Prend en charge les interfaces en chinois simplifié, chinois traditionnel et anglais
- ✨ **Éviction de Cache LRU** - Évince automatiquement le contenu le moins récemment utilisé lorsque la limite de préchargement est dépassée
- ✨ **Règles de Site par Défaut** - Préchargement désactivé par défaut pour les sites vidéo tels que Douyin
- 🔧 Gestion optimisée de la fenêtre de préchargement avec réutilisation de plusieurs fenêtres
- 🔧 Logique optimisée de suivi et de nettoyage des onglets

### v2.0.0
- ✨ Nouvelle technologie de fenêtre de préchargement
- ✨ Gestion intelligente des onglets
- ✨ Système de règles de sites
- ✨ Fonctions de statistiques et d'analyse
- ✨ Optimisation de la conscience du réseau
- ✨ Indicateur visuel
- ✨ Support du mode sombre
- ✨ Support des raccourcis clavier
- ✨ Intégration du menu contextuel

### v1.4.6
- 🔧 Détection des onglets dupliqués
- 🔧 Fonction de saut automatique

---

## 🤝 Contribution

Les Issues et Pull Requests sont les bienvenues !



### Structure du Projet

```
webpremium/
├── manifest.json          # Fichier de configuration de l'extension
├── background.js          # Point d'entrée du script de service en arrière-plan
├── content.js             # Point d'entrée du script de contenu
├── popup.html             # HTML de la fenêtre popup
├── popup.js               # Point d'entrée du script de la fenêtre popup
├── popup.css              # Style de la fenêtre popup
├── index.html             # HTML de la page Tab-out de nouvel onglet
├── app.js                 # Logique de la page Tab-out de nouvel onglet
├── style.css              # Style de la page Tab-out de nouvel onglet
├── icons/                 # Fichiers d'icônes
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── src/                   # Code source modulaire
│   ├── background/        # Modules en arrière-plan
│   │   ├── preload-window.js   # Gestion de la fenêtre de préchargement
│   │   ├── router.js           # Routage des messages
│   │   ├── settings-store.js   # Stockage des paramètres
│   │   ├── site-rules.js       # Règles de sites
│   │   ├── stats.js            # Statistiques
│   │   ├── tab-deduper.js      # Déduplication d'onglets
│   │   ├── tab-out.js          # Fonctionnalité Tab-out
│   │   └── tab-tracker.js      # Suivi d'onglets
│   ├── content/           # Modules de script de contenu
│   │   ├── indicator.js        # Indicateur visuel
│   │   ├── link-tracker.js     # Suivi de liens
│   │   ├── main.js             # Point d'entrée principal
│   │   ├── network-aware.js    # Conscience du réseau
│   │   ├── preloader.js        # Préchargeur
│   │   └── settings.js         # Gestion des paramètres
│   ├── popup/             # Modules popup
│   │   ├── api.js              # Wrapper API
│   │   ├── dom.js              # Utilitaires DOM
│   │   ├── i18n.js             # Internationalisation
│   │   ├── rules-view.js       # Vue des règles
│   │   ├── settings-view.js    # Vue des paramètres
│   │   ├── stats-view.js       # Vue des statistiques
│   │   ├── tabs.js             # Changement d'onglets
│   │   ├── theme.js            # Thème
│   │   └── toast.js            # Messages toast
│   └── shared/            # Modules partagés
│       ├── constants.js        # Constantes
│       ├── logger.js           # Journalisation
│       └── url-utils.js        # Utilitaires URL
└── README.md              # Documentation
```

---

## 📄 Licence

Mozilla Public License Version 2.0

Ce projet adopte la licence MPL-2.0. Pour plus de détails, consultez le fichier [LICENSE](../../LICENSE).

---

## 💬 Commentaires et Support

- 🐛 [Signaler un Bug](https://github.com/Yikumasai/webpremium/issues)
- 💡 [Suggestions de Fonctionnalités](https://github.com/Yikumasai/webpremium/issues)
- 📧 Email : likanglin2001@qq.com

---

## 🌟 Remerciements

Merci à tous les utilisateurs qui utilisent et soutiennent Webpremium !

Si ce projet vous aide, donnez-nous une ⭐️ Star !

---
## Star History

<a href="https://www.star-history.com/#Yikumasai/Webpremium&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&legend=top-left" />
 </picture>
</a>

---
<div align="center">

**Navigation plus rapide, meilleure expérience**

Made with ❤️ by Webpremium

</div>


