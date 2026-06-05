# Privacy Policy for Link Preloader

Last updated: June 5, 2026

This Privacy Policy explains how the Link Preloader Chrome extension ("Link Preloader", "the Extension", "we", or "us") handles information when you install and use the Extension.

Link Preloader is designed to improve browsing speed by detecting links on webpages, preloading selected links in background tabs or iframes, reducing duplicate tabs, and providing optional tab-management and favorite-site features.

## Summary

Link Preloader does not sell your data, does not show advertising, and does not use third-party analytics or tracking services. The Extension does not send your browsing data, settings, statistics, favorites, or tab information to the developer's servers.

Some information is processed locally in your browser so the Extension can provide its features. Some settings may be stored with Chrome's storage sync feature, which is managed by Google Chrome and your browser account settings.

## Information the Extension Processes

The Extension may process the following information in your browser:

- Current page URL, links, and nearby link text, so the Extension can detect links that may be preloaded and show preload status.
- Open tab information, such as tab URLs, titles, favicons, window IDs, and tab IDs, so the Extension can manage preloaded tabs, reduce duplicate tabs, and provide the Tab-out tab-management view.
- Extension settings, such as preload enablement, hover delay, maximum preload count, preload mode, theme, language, network-aware mode, indicator settings, mute-preload setting, smart tab deduplication, Tab-out enablement, and shortcut preferences.
- Site rules, such as domains where preloading is enabled or disabled.
- Local usage statistics, such as total preload count, preload hit count, estimated saved time, and session start time.
- Favorites or saved-tab data that you choose to create, such as saved URLs, titles, domains, favicons, and custom icon data.
- Temporary preload state, such as URLs currently being preloaded and their loading status.

The Extension does not intentionally collect names, email addresses, passwords, payment information, health information, authentication tokens, personal communications, or form entries.

## How Information Is Used

The Extension uses information only to provide or improve its stated features:

- Detecting and preloading links when you hover over or interact with them.
- Opening a preloaded page when you click the corresponding link.
- Avoiding duplicate tabs by finding an already-open matching page.
- Showing preload status and basic preload statistics in the Extension UI.
- Saving your settings and site rules.
- Displaying and managing open tabs and favorites in the Tab-out page.
- Caching small favicon images locally so the Extension UI can load faster.

The Extension does not use your information for advertising, profiling, credit decisions, or sale to data brokers.

## Storage and Retention

The Extension uses Chrome extension storage:

- `chrome.storage.sync` may store settings, site rules, and UI language so they can sync across Chrome browsers where Chrome Sync is enabled.
- `chrome.storage.local` may store local statistics, favorites, theme preference, cached favicon data, and temporary Extension state.
- Temporary preload lists and nearby-link data are generally kept in memory and are cleared when the page changes, the feature is disabled, preloads expire, or you clear preloads.

Stored settings, rules, favorites, cached icon data, and statistics remain in your browser until you change or delete them, reset them in the Extension, clear extension data, or uninstall the Extension.

## Network Activity and Third Parties

Link Preloader does not transmit your Extension data to a developer-operated server.

When the Extension preloads a link, your browser may request the target webpage in a background tab or iframe. This is similar to visiting that page directly: the target website may receive standard request information such as your IP address, browser information, cookies for that website, and the requested URL, depending on your browser settings and the website's own behavior.

When the Tab-out favorites view displays favicons, the Extension may request favicon images from the websites you saved or visited. Favicon fetches are made without credentials where possible, and small favicon images may be cached locally.

Websites you visit or preload are governed by their own privacy policies. Chrome Sync, if enabled, is governed by Google's Chrome and account settings.

## Data Sharing

We do not sell, rent, or share your information with advertisers, analytics providers, data brokers, or other third parties.

Information may be disclosed only if required by applicable law, legal process, or to protect the security and integrity of the Extension and its users.

## Chrome Permissions

The Extension requests permissions only to support its browsing and tab-management features:

- `activeTab`: to interact with the current tab when needed for user-facing Extension features.
- `storage`: to save settings, site rules, statistics, favorites, and UI preferences.
- `tabs`: to create, query, focus, move, mute, close, and manage tabs for preloading, duplicate-tab detection, and Tab-out.
- `contextMenus`: to provide right-click actions such as preloading a link, toggling a site rule, or saving a page/link.
- `favicon`: to display favicons in Extension UI.
- Host permissions for `http://*/*` and `https://*/*`: to run the content script on webpages, detect links, apply site rules, and preload webpages across sites.

## Remote Code

The Extension does not load or execute remotely hosted code. Extension logic is included in the packaged extension files.

## User Controls

You can control the Extension by:

- Enabling or disabling preloading globally.
- Enabling or disabling preloading for specific sites.
- Changing preload limits, hover delay, preload mode, network-aware mode, indicators, muting, smart tab deduplication, Tab-out, and shortcut settings.
- Clearing current preloads.
- Resetting local statistics.
- Removing favorites or saved entries.
- Uninstalling the Extension, which removes extension data stored by Chrome for this Extension.

You can also manage Chrome Sync through your Chrome browser and Google account settings.

## Children's Privacy

The Extension is not directed to children and does not knowingly collect personal information from children.

## Limited Use Statement

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Changes to This Policy

We may update this Privacy Policy if the Extension's functionality, data handling, or legal requirements change. The "Last updated" date will be revised when this policy is updated.

## Contact

If you have questions about this Privacy Policy or the Extension's data practices, contact the developer at:

likanglin2001@qq.com
