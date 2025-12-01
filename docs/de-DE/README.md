# 🚀 Webpremium - Link-Preloader

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**Null-Latenz-Browsing-Erlebnis | Intelligentes Preloading | Nahtloser Wechsel**

[Funktionen](#-funktionen) • [Installation](#-installation) • [Verwendung](#-verwendung) • [Funktionsweise](#️-funktionsweise) • [FAQ](#-faq)

</div>

---
<p align="center">
  <a href=".docs/en-US/README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="./docs/zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="./README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="./docs/ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="./docs/es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="./docs/fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="./docs/tlh/README.md"><img alt="README tlhIngan Hol" src="https://img.shields.io/badge/Klingon-d9d9d9"></a>
  <a href="./docs/ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="./docs/ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="./docs/tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="./docs/vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="./docs/de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="./docs/bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>

## 📖 Einführung

Webpremium ist eine revolutionäre Chrome-Erweiterung, die durch intelligente Preloading-Technologie ein **Null-Latenz**-Web-Browsing-Erlebnis ermöglicht. Wenn Sie mit der Maus über einen Link fahren, öffnet die Erweiterung die Seite im Voraus in einem Hintergrund-Preload-Fenster. Wenn Sie tatsächlich auf den Link klicken, wird der vorgeladene Tab nahtlos in das Hauptfenster verschoben, sodass Sie keine Wartezeit spüren.

### ✨ Hauptmerkmale

- 🎯 **Null-Latenz-Erlebnis** - Preload beim Hover, sofortiges Öffnen beim Klick
- 🪟 **Preload-Fenster-Technologie** - Preload in unabhängigem Fenster, keine Störung des Hauptfensters
- 🔄 **Intelligente Tab-Verwaltung** - Erkennt automatisch bereits geöffnete Tabs und springt dorthin
- 📊 **Echtzeit-Statistiken** - Verfolgt Preload-Effekte und eingesparte Zeit
- 🎨 **Modernes Interface** - Dark-Mode-Unterstützung, sauberes und schönes Interface
- ⚙️ **Hochgradig anpassbar** - Umfangreiche Konfigurationsoptionen für individuelle Bedürfnisse

---

## 🎯 Funktionen

### Kernfunktionen

#### 1. Intelligentes Preloading
- **Hover-Trigger** - Automatisches Preloading beim Überfahren von Links
- **Einstellbare Verzögerungszeit** - Unterstützt Hover-Verzögerung von 0-1000ms
- **Vorhersage naher Links** - Erkennt intelligent Links in der Nähe des Cursors und lädt sie vor
- **Preload-Mengen-Kontrolle** - Konfigurierbare maximale Anzahl gleichzeitiger Preloads (1-10)

#### 2. Preload-Modi
- **Preload-Fenster-Modus (Empfohlen)** - Preload in unabhängigem minimierten Fenster, vollständiges Laden der Seite, keine Störung des Hauptfensters
- **iframe-Preload-Modus** - Leichtgewichtige Preload-Methode, gute Kompatibilität

#### 3. Intelligente Tab-Verwaltung
- **Doppelte Tab-Erkennung** - Erkennt automatisch Tabs mit derselben URL
- **Automatischer Sprung** - Beim Klicken auf bereits geöffnete Links automatischer Sprung zum vorhandenen Tab
- **Nahtlose Bewegung** - Vorgeladene Tabs bewegen sich nahtlos zum Hauptfenster
- **Speicher-Optimierung** - Reduziert doppelte Tabs, verringert Speichernutzung

#### 4. Netzwerk-Bewusstsein
- **Intelligente Erkennung** - Erkennt automatisch den Netzwerkstatus
- **Adaptive Strategie** - Reduziert automatisch Preloading bei langsamen Netzwerken
- **Daten-Einsparung** - Vermeidet Datenverschwendung in schwachen Netzwerkumgebungen

#### 5. Visueller Indikator
- **Preload-Status-Anzeige** - Zeigt kleinen Punkt neben dem Link zur Anzeige des Preload-Status
- **Lade-Animation** - Orangefarbener Punkt zeigt laufendes Laden an
- **Lade-Abschluss-Markierung** - Grüner Punkt zeigt abgeschlossenes Preloading an

#### 6. Website-Regelverwaltung
- **Benutzerdefinierte Regeln** - Aktiviert oder deaktiviert Preloading für bestimmte Websites
- **Domain-Level-Kontrolle** - Präzise Preload-Kontrolle auf Domain-Ebene
- **Kontextmenü** - Schnelles Umschalten des Preload-Status der aktuellen Website

#### 7. Statistiken und Analyse
- **Preload-Anzahl** - Zeichnet Gesamtzahl der Preloads auf
- **Trefferquoten-Statistik** - Berechnet effektive Nutzungsrate des Preloadings
- **Zeitersparnis** - Statistik der insgesamt eingesparten Zeit
- **Sitzungsdauer** - Zeigt Nutzungsdauer der aktuellen Sitzung an

### Tastenkombinationen

- `Alt + P` - Preload-Funktion schnell ein-/ausschalten
- `Alt + C` - Alle Preload-Caches löschen

### Kontextmenü

- **Diesen Link vorladen** - Ausgewählten Link manuell vorladen
- **Preloading auf dieser Website aktivieren/deaktivieren** - Preload-Status der aktuellen Website schnell umschalten

---

## 📦 Installation

### Methode 1: Installation im Entwicklermodus

1. **Quellcode herunterladen**
   Von der [Release](https://github.com/Yikumasai/Webpremium/releases)-Seite herunterladen
   
   oder
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

2. **Chrome-Erweiterungsseite öffnen**
   - `chrome://extensions/` in die Adressleiste eingeben
   - Oder Menü → Weitere Tools → Erweiterungen

3. **Entwicklermodus aktivieren**
   - Schalter "Entwicklermodus" oben rechts aktivieren

4. **Erweiterung laden**
   - "Entpackte Erweiterung laden" klicken
   - Heruntergeladenen `webpremium`-Ordner auswählen

5. **Installation abschließen**
   - Erweiterungssymbol erscheint in der Browser-Symbolleiste
   - Symbol klicken, um Einstellungspanel zu öffnen

### Methode 2: Chrome Web Store
> Demnächst verfügbar

---

## 🎮 Verwendung

### Grundlegende Verwendung

1. **Erweiterung aktivieren**
   - Nach der Installation ist die Erweiterung standardmäßig aktiviert
   - Symbolleisten-Symbol klicken, um Status zu überprüfen

2. **Preloading erleben**
   - Maus über beliebigen Link bewegen
   - Konfigurierte Verzögerungszeit abwarten (Standard 100ms)
   - Grüner Punkt erscheint neben dem Link, wenn Preloading abgeschlossen ist
   - Link klicken, um sofort zu öffnen

3. **Statistiken anzeigen**
   - Erweiterungssymbol klicken
   - Zum Tab "Statistiken" wechseln
   - Preload-Effekt und eingesparte Zeit anzeigen

### Erweiterte Einstellungen

#### Hover-Verzögerung anpassen
- Einstellungspanel öffnen
- Schieberegler "Hover-Verzögerung" ziehen
- Empfohlener Wert: 100-300ms

#### Preload-Anzahl einstellen
- Einstellungspanel öffnen
- Schieberegler "Maximale Preload-Anzahl" ziehen
- Empfohlener Wert: 3-5

#### Preload-Modus auswählen
- **Preload-Fenster-Modus**: Vollständiges Preloading, beste Erfahrung (empfohlen)
- **iframe-Modus**: Leichtgewichtig, gute Kompatibilität

#### Website-Regelverwaltung
1. Zum Tab "Website-Regeln" wechseln
2. Button "Regel hinzufügen" klicken
3. Domain eingeben (z.B.: example.com)
4. Aktiviert- oder Deaktiviert-Status einstellen

---

## ⚙️ Funktionsweise

### Preload-Ablauf

```
Benutzer fährt über Link
    ↓
Verzögerungszeit abwarten
    ↓
Netzwerkstatus prüfen
    ↓
Website-Regeln prüfen
    ↓
Preload-Fenster erstellen
    ↓
Tab im Preload-Fenster öffnen
    ↓
Preload-Fenster minimieren
    ↓
Benutzer klickt auf Link
    ↓
Tab zum Hauptfenster verschieben
    ↓
Tab aktivieren
    ↓
Fertig!
```

### Technische Architektur

- **Content Script** - Überwacht Seiten-Link-Events, löst Preloading aus
- **Background Service Worker** - Verwaltet Preload-Fenster und Tabs
- **Popup UI** - Bietet Einstellungsinterface und Statistikinformationen
- **Chrome Storage API** - Persistiert Einstellungen und Statistikdaten

### Preload-Fenster-Technologie

Die Erweiterung verwendet ein unabhängiges Preload-Fenster zum Vorladen von Seiten:

1. Erstellt ein kleines Fenster vom Typ normal
2. Minimiert dieses Fenster sofort
3. Erstellt Preload-Tab im Fenster
4. Verschiebt Tab zum Hauptfenster, wenn Benutzer klickt
5. Aktiviert Tab und fokussiert Hauptfenster

Vorteile dieser Methode:
- ✅ Vollständiges Vorladen der Seite (einschließlich JavaScript, CSS, Bilder usw.)
- ✅ Hauptfenster wird überhaupt nicht beeinträchtigt
- ✅ Tabs können nahtlos verschoben werden
- ✅ Unterstützt alle Websites und komplexe Seiten

---

## 🎨 Interface-Vorschau

### Einstellungspanel
- Einfache Schaltersteuerung
- Intuitive Schieberegler-Anpassung
- Echtzeit-Preload-Liste
- Anzeige naher Links

### Statistik-Panel
- Gesamtzahl der Preloads
- Trefferquote in Prozent
- Zeitersparnis-Statistik
- Sitzungsdauer-Anzeige

### Website-Regeln
- Domain-Listenverwaltung
- Aktiviert/Deaktiviert-Status
- Schnelles Hinzufügen/Löschen

---

## 🔧 Konfigurationsoptionen

| Option | Beschreibung | Standardwert | Empfohlener Wert |
|------|------|--------|--------|
| Preloading aktivieren | Hauptschalter | Ein | Ein |
| Hover-Verzögerung | Zeit nach Hover bis Preload-Trigger | 100ms | 100-300ms |
| Maximale Preload-Anzahl | Maximale Anzahl gleichzeitiger Preloads | 5 | 3-5 |
| Preload-Modus | Preload-Methode | Preload-Fenster | Preload-Fenster |
| Netzwerk-Bewusstsein | Anpassung nach Netzwerkstatus | Ein | Ein |
| Indikator anzeigen | Preload-Status-Punkt anzeigen | Ein | Ein |

---

## ❓ FAQ

### F: Verbraucht Preloading viele Daten?
A: Die Erweiterung erkennt intelligent den Netzwerkstatus und reduziert automatisch Preloading bei langsamen Netzwerken. Sie können auch den Datenverbrauch durch Anpassung der "Maximalen Preload-Anzahl" kontrollieren.

### F: Beeinflusst Preloading die Browser-Leistung?
A: Preloading verwendet ein unabhängiges Fenster, daher ist der Einfluss auf die Hauptfenster-Leistung minimal. Außerdem bereinigt die Erweiterung automatisch abgelaufene Preload-Inhalte.

### F: Warum schlägt Preloading auf einigen Websites fehl?
A: Einige Websites können Schutzmechanismen haben. Sie können Preloading für diese Websites in "Website-Regeln" deaktivieren.

### F: Wie erkenne ich, ob ein Link vorgeladen wurde?
A: Nach Aktivierung von "Indikator anzeigen" erscheint ein grüner Punkt neben vorgeladenen Links.

### F: Wird das Preload-Fenster angezeigt?
A: Nein. Das Preload-Fenster wird sofort minimiert und beeinträchtigt Ihr Browsing-Erlebnis überhaupt nicht.

### F: Kann ich Preloading für bestimmte Websites deaktivieren?
A: Ja. Fügen Sie Domain-Regeln im Tab "Website-Regeln" hinzu oder klicken Sie mit der rechten Maustaste auf die Seite und wählen Sie "Preloading auf dieser Website aktivieren/deaktivieren".

---

## 🚀 Versionshistorie

### v2.0.0 (Aktuelle Version)
- ✨ Neue Preload-Fenster-Technologie
- ✨ Intelligente Tab-Verwaltung
- ✨ Website-Regelsystem
- ✨ Statistik- und Analysefunktionen
- ✨ Netzwerk-Bewusstseins-Optimierung
- ✨ Visueller Indikator
- ✨ Dark-Mode-Unterstützung
- ✨ Tastenkombinations-Unterstützung
- ✨ Kontextmenü-Integration

### v1.4.6
- 🔧 Doppelte Tab-Erkennung
- 🔧 Automatische Sprungfunktion

---

## 🤝 Beitragen

Issues und Pull Requests sind willkommen!

### Entwicklungsumgebung einrichten

```bash
# Repository klonen
git clone https://github.com/Yikumasai/webpremium.git

# Verzeichnis wechseln
cd webpremium

# Erweiterung in Chrome laden
# chrome://extensions/ → Entwicklermodus → Entpackte Erweiterung laden
```

### Projektstruktur

```
webpremium/
├── manifest.json          # Erweiterungs-Konfigurationsdatei
├── background.js          # Hintergrund-Service-Skript
├── content.js            # Content-Skript
├── popup.html            # Popup-Fenster HTML
├── popup.js              # Popup-Fenster Skript
├── popup.css             # Popup-Fenster Stil
├── icons/                # Icon-Dateien
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Dokumentation
```

---

## 📄 Lizenz

Mozilla Public License Version 2.0

Dieses Projekt verwendet die MPL-2.0-Lizenz. Weitere Details finden Sie in der [LICENSE](../../LICENSE)-Datei.

---

## 💬 Feedback und Support

- 🐛 [Bug melden](https://github.com/Yikumasai/webpremium/issues)
- 💡 [Feature-Vorschläge](https://github.com/Yikumasai/webpremium/issues)
- 📧 E-Mail: likanglin2001@qq.com

---

## 🌟 Danksagungen

Vielen Dank an alle Benutzer, die Webpremium verwenden und unterstützen!

Wenn Ihnen dieses Projekt hilft, geben Sie uns bitte einen ⭐️ Star!

---

<div align="center">

**Schnelleres Browsen, bessere Erfahrung**

Made with ❤️ by Webpremium

</div>
