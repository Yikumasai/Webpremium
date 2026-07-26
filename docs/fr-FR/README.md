<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Préchargeur de Liens

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
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
- 🔄 **Gestion Intelligente des Onglets** - Détecte automatiquement et saute vers les onglets déjà ouverts
- 📊 **Statistiques en Temps Réel** - Suit l'effet du préchargement et le temps économisé
- 🎨 **Interface Moderne** - Support du mode sombre, interface épurée et élégante
- ⚙️ **Hautement Personnalisable** - Options de configuration riches pour répondre aux besoins personnalisés

---

## 🎯 Fonctionnalités

### Fonctions Principales

#### 1. Préchargement Intelligent
- **Déclenchement au Survol** - Préchargement automatique lors du survol des liens
- **Délai Ajustable** - Support de configuration de délai de survol de 0-1000ms
- **Prédiction des Liens Proches** - Identifie intelligemment les liens proches du curseur et les précharge
- **Contrôle de la Quantité** - Configure le nombre maximum de préchargements simultanés (1-10)

#### 2. Modes de Préchargement
- **Mode Fenêtre de Préchargement (Recommandé)** - Préchargement dans une fenêtre minimisée indépendante, chargement complet de la page
- **Mode Préchargement iframe** - Méthode de préchargement légère, bonne compatibilité

#### 3. Gestion Intelligente des Onglets
- **Détection des Onglets Dupliqués** - Détecte automatiquement les onglets avec la même URL
- **Saut Automatique** - Lors du clic sur des liens déjà ouverts, saute automatiquement vers l'onglet existant
- **Déplacement Fluide** - Les onglets préchargés se déplacent de manière transparente vers la fenêtre principale
- **Optimisation de la Mémoire** - Réduit les onglets dupliqués, diminue l'utilisation de la mémoire

#### 4. Conscience du Réseau
- **Détection Intelligente** - Détecte automatiquement l'état du réseau
- **Stratégie Adaptative** - Réduit automatiquement le préchargement sur les réseaux lents
- **Économie de Données** - Évite de gaspiller des données dans des environnements réseau faibles

#### 5. Indicateur Visuel
- **Affichage de l'État** - Affiche un petit point à côté du lien indiquant l'état du préchargement
- **Animation de Chargement** - Point orange indique le chargement en cours
- **Marque de Chargement Complet** - Point vert indique le préchargement terminé

#### 6. Gestion des Règles de Sites
- **Règles Personnalisées** - Active ou désactive le préchargement pour des sites spécifiques
- **Contrôle au Niveau du Domaine** - Contrôle précis du préchargement par domaine
- **Menu Contextuel** - Change rapidement l'état du préchargement du site actuel

#### 7. Statistiques et Analyse
- **Nombre de Préchargements** - Enregistre le nombre total de préchargements
- **Statistiques de Taux de Réussite** - Calcule le taux d'utilisation efficace du préchargement
- **Temps Économisé** - Statistiques du temps total économisé
- **Durée de Session** - Affiche la durée d'utilisation de la session actuelle

### Raccourcis Clavier

- `Alt + P` - Activer/désactiver rapidement la fonction de préchargement
- `Alt + C` - Effacer tout le cache de préchargement

### Menu Contextuel

- **Précharger ce lien** - Précharge manuellement le lien sélectionné
- **Activer/Désactiver le préchargement sur ce site** - Change rapidement l'état du préchargement du site actuel

---

## 📦 Installation

### Méthode 1 : Chrome Web Store

Rendez-vous sur la page [Chrome Web Store](https://chromewebstore.google.com/detail/link-preloader/ajfjclgcglnjglkjgjcenkjjmipddnhj) et cliquez sur « Ajouter à Chrome » pour l'installer en un clic.

### Méthode 2 : Installation en Mode Développeur

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

3. **Voir les statistiques**
   - Cliquez sur l'icône de l'extension
   - Passez à l'onglet "Statistiques"
   - Voir l'effet du préchargement et le temps économisé

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

---

## 🚀 Historique des Versions

### v2.0.0 (Version Actuelle)
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

<div align="center">

**Navigation plus rapide, meilleure expérience**

Made with ❤️ by Webpremium

</div>


