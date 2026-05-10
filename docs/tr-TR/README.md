<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Bağlantı Ön Yükleyici

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**Sıfır Gecikme Tarayıcı Deneyimi | Akıllı Ön Yükleme | Sorunsuz Geçiş**

[Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Kullanım](#-kullanım) • [Nasıl Çalışır](#️-nasıl-çalışır) • [SSS](#-sss)

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

## 📖 Giriş

Webpremium, akıllı ön yükleme teknolojisi ile **sıfır gecikme** web tarayıcı deneyimi sunan devrim niteliğinde bir Chrome uzantısıdır. Farenizi bir bağlantının üzerine getirdiğinizde, uzantı sayfayı arka planda ön yükleme penceresinde önceden açar. Bağlantıya gerçekten tıkladığınızda, ön yüklenmiş sekme ana pencereye sorunsuz bir şekilde taşınır ve herhangi bir bekleme süresi hissetmezsiniz.

### ✨ Temel Özellikler

- 🎯 **Sıfır Gecikme Deneyimi** - Fareyle üzerine gelince ön yükleme, tıklayınca anında açılma
- 🪟 **Ön Yükleme Penceresi Teknolojisi** - Bağımsız pencerede ön yükleme, ana pencereye müdahale yok
- 🔄 **Akıllı Sekme Yineleme Önleme** - Yinelenen sekmeleri otomatik algılar ve tıklandığında mevcuda atlar
- 🏠 **Tab-out Yeni Sekme Sayfası** - Favoriler ve sekme düzenleme ile güzel yeni sekme yönetim paneli
- 📊 **Gerçek Zamanlı İstatistikler** - Ön yükleme etkisini ve tasarruf edilen zamanı takip eder
- 🎨 **Modern Arayüz** - Karanlık mod desteği, temiz ve güzel arayüz
- ⚙️ **Yüksek Özelleştirilebilir** - Kişisel ihtiyaçları karşılamak için zengin yapılandırma seçenekleri
- 🌐 **Çok Dilli Destek** - Basitleştirilmiş Çince, Geleneksel Çince, İngilizce ve daha fazlasını destekler

---

## 🎯 Özellikler

### Temel İşlevler

#### 1. Akıllı Ön Yükleme
- **Fare Üzerine Gelme Tetikleyicisi** - Bağlantıların üzerine fare geldiğinde otomatik ön yükleme
- **Ayarlanabilir Gecikme Süresi** - 0-1000ms fare üzerine gelme gecikmesi yapılandırmasını destekler
- **Yakın Bağlantı Tahmini** - Fare yakınındaki bağlantıları akıllıca tanır ve ön yükler
- **Ön Yükleme Miktarı Kontrolü** - Maksimum eşzamanlı ön yükleme sayısını ayarlayabilir (1-10)
- **LRU Önbellek Tahliyesi** - Sınır aşıldığında en az kullanılan ön yüklemeleri otomatik olarak kaldırır

#### 2. Ön Yükleme Modları
- **Ön Yükleme Penceresi Modu (Önerilen)** - Bağımsız küçültülmüş pencerede ön yükleme, tam sayfa yükleme, ana pencereye müdahale yok
- **iframe Ön Yükleme Modu** - Hafif ön yükleme yöntemi, iyi uyumluluk

#### 3. Akıllı Sekme Yineleme Önleme & Atlama (Smart Tab Dedup)
- **Yinelenen Sekme Algılama** - Ön yülkemeden önce hedef sayfanın mevcut pencerede zaten açık olup olmadığını algılar
- **Otomatik Atlama** - Zaten açık bağlantılara tıklandığında mevcut sekmeye otomatik atlar, yinelemeyi önler
- **Ön Yüklemeyi Atla** - Hedef sayfa zaten açıksa ön yüklemeyi atlar ve doğrudan geçer
- **Sorunsuz Deneyim** - Hedef sekme ve pencereye otomatik olarak odaklanır

#### 4. Tab-out Yeni Sekme Sayfası Yönetimi
- **Güzel Yeni Sekme Sayfası** - Varsayılan yeni sekme sayfasını zengin özellikli yönetim paneliyle değiştirir
- **Üç Sütunlu Düzen** - Solda favoriler, ortada açık sekmeler, sağda sonra oku
- **Etki Alanına Göre Gruplama** - Açık sekmeleri etki alanına göre otomatik gruplar
- **Favoriler İşlevi** - Özel simgelerle sık kullanılan siteler için uzun süreli favoriler
- **Sekme Sayısı Rozeti** - Araç çubuğu simgesi mevcut açık sekme sayısını gösterir
- **Yinelenen Sekme Algılama** - Yinelenen yeni sekme sayfalarını algılar ve kapatmayı ister
- **Hızlı Eylemler** - Sekme kapatma, sabitleme, favorilere ekleme vb. tek tıklamayla
- **Karanlık Mod** - Açık/karanlık tema geçişi desteği
- **Çok Dilli** - Çince/İngilizce arayüz geçişi desteği

#### 5. Ağ Farkındalığı
- **Akıllı Algılama** - Ağ durumunu otomatik algılar
- **Uyarlanabilir Strateji** - Yavaş ağlarda otomatik olarak ön yüklemeyi azaltır
- **Veri Tasarrufu** - Zayıf ağ ortamlarında veri israfını önler

#### 6. Ön Yükleme Sessizleştirme
- **Varsayılan Olarak Sessiz** - Ön yüklenmiş sekmeler video/canlı yayın otomatik oynatmasını önlemek için varsayılan olarak sessizdir
- **Manuel Sesi Açma** - Etkinleştirildikten sonra sesi açmak için adres çubuğuna tıklayın

#### 7. Görsel Gösterge
- **Ön Yükleme Durumu Gösterimi** - Bağlantının yanında ön yükleme durumunu gösteren küçük nokta
- **Yükleme Animasyonu** - Turuncu nokta yükleme devam ediyor anlamına gelir
- **Yükleme Tamamlandı İşareti** - Yeşil nokta ön yükleme tamamlandı anlamına gelir

#### 8. Site Kuralları Yönetimi
- **Özel Kurallar** - Belirli siteler için ön yüklemeyi etkinleştirir veya devre dışı bırakır
- **Alan Adı Seviyesi Kontrolü** - Alan adına göre hassas ön yükleme kontrolü
- **Sağ Tık Menüsü** - Mevcut sitenin ön yükleme durumunu hızlıca değiştirir
- **Varsayılan Kurallar** - Douyin gibi video siteleri için ön yükleme varsayılan olarak devre dışı

#### 9. İstatistikler ve Analiz
- **Ön Yükleme Sayısı** - Toplam ön yükleme sayısını kaydeder
- **İsabet Oranı İstatistikleri** - Ön yüklemenin etkili kullanım oranını hesaplar
- **Zaman Tasarrufu** - Tasarruf edilen toplam zamanı istatistikler
- **Oturum Süresi** - Mevcut oturumun kullanım süresini gösterir

### Kısayol Tuşları

- `Alt + P` - Ön yükleme işlevini hızlıca aç/kapat (ayarlardan etkinleştirilmelidir)
- `Alt + C` - Tüm ön yükleme önbelleğini temizle (ayarlardan etkinleştirilmelidir)
- Kısayol tuşları, sistem veya diğer uzantılarla çatışmayı önlemek için varsayılan olarak devre dışıdır

### Sağ Tık Menüsü

- **Bu bağlantıyı ön yükle** - Seçili bağlantıyı manuel olarak ön yükle
- **Bu sitede ön yüklemeyi etkinleştir/devre dışı bırak** - Mevcut sitenin ön yükleme durumunu hızlıca değiştir
- **Sayfayı favorilere ekle** - Mevcut sayfayı Tab-out favorilerine ekler
- **Bağlantıyı favorilere ekle** - Bağlantıyı Tab-out favorilerine ekler

---

## 📦 Kurulum

### Yöntem 1: Geliştirici Modunda Kurulum

1. **Kaynak kodunu indir**
   [Releases](https://github.com/Yikumasai/Webpremium/releases) sayfasından indir
   
   veya
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

2. **Chrome uzantılar sayfasını aç**
   - Adres çubuğuna `chrome://extensions/` gir
   - Veya menü → Diğer araçlar → Uzantılar

3. **Geliştirici modunu etkinleştir**
   - Sağ üst köşedeki "Geliştirici modu" anahtarını aç

4. **Uzantıyı yükle**
   - "Paketlenmemiş uzantı yükle"ye tıkla
   - İndirilen `webpremium` klasörünü seç

5. **Kurulumu tamamla**
   - Uzantı simgesi tarayıcı araç çubuğunda görünecek
   - Ayarlar panelini açmak için simgeye tıkla

### Yöntem 2: Chrome Web Mağazası
> Yakında

---

## 🎮 Kullanım

### Temel Kullanım

1. **Uzantıyı etkinleştir**
   - Kurulumdan sonra uzantı varsayılan olarak etkindir
   - Durumu kontrol etmek için araç çubuğu simgesine tıkla

2. **Ön yüklemeyi deneyimle**
   - Herhangi bir bağlantının üzerine fareyi getir
   - Yapılandırılmış gecikme süresini bekle (varsayılan 100ms)
   - Ön yükleme tamamlandığında bağlantının yanında yeşil nokta görünecek
   - Anında açmak için bağlantıya tıkla

3. **Akıllı Sekme Atlama**
   - Hedef sayfa mevcut pencerede zaten açıkken
   - Bağlantıya tıklamak otomatik olarak mevcut sekmeye atlar
   - Aynı sayfayı iki kez açmayı önler

4. **İstatistikleri görüntüle**
   - Uzantı simgesine tıkla
   - "İstatistikler" sekmesine geç
   - Ön yükleme etkisini ve tasarruf edilen zamanı gör

### Tab-out Yeni Sekme Sayfası

1. **Tab-out'u Etkinleştir**
   - Ayarlar panelini aç
   - "Gelişmiş Özellikler" altında "Tab-out Yeni Sekme Sayfası"nı etkinleştir
   - Yönetim panelini görmek için yeni bir sekme aç

2. **Favorileri Kullan**
   - Favorileri eklemek için sol üst köşedeki "+" düğmesine tıkla
   - Bir sekmeye sağ tıklayıp "Favorilere ekle"yi seç
   - Favoriler hızlı erişim için kalıcı olarak saklanır

3. **Sekmeleri Yönet**
   - Orta sütun tüm açık sekmeleri gösterir (etki alanına göre gruplandırılmış)
   - Sayfasına atlamak için bir sekmeye tıkla
   - Bir sekmeyi veya tüm bir etki alanı grubunu kapatmak için "×"e tıkla

### Gelişmiş Ayarlar

#### Fare Üzerine Gelme Gecikmesini Ayarla
- Ayarlar panelini aç
- "Fare üzerine gelme gecikmesi" kaydırıcısını sürükle
- Önerilen değer: 100-300ms

#### Ön Yükleme Sayısını Ayarla
- Ayarlar panelini aç
- "Maksimum ön yükleme sayısı" kaydırıcısını sürükle
- Önerilen değer: 3-5

#### Ön Yükleme Modunu Seç
- **Ön Yükleme Penceresi Modu**: Tam ön yükleme, en iyi deneyim (önerilen)
- **iframe Modu**: Hafif, iyi uyumluluk

#### Kısayolları Etkinleştir
- Ayarlar panelini aç
- "Kısayolları etkinleştir" seçeneğini aç
- Ön yüklemeyi değiştirmek için `Alt+P`, önbelleği temizlemek için `Alt+C` kullan
- Chrome kısayol ayarlarında kısayolları özelleştir

#### Site Kuralları Yönetimi
1. "Site kuralları" sekmesine geç
2. "Kural ekle" düğmesine tıkla
3. Alan adını gir (örn: example.com)
4. Etkin veya devre dışı durumunu ayarla

---

## ⚙️ Nasıl Çalışır

### Ön Yükleme Akışı

```
Kullanıcı bağlantının üzerine gelir
    ↓
Gecikme süresini bekle
    ↓
Ağ durumunu kontrol et
    ↓
Site kurallarını kontrol et
    ↓
Ön yükleme penceresi oluştur
    ↓
Ön yükleme penceresinde sekme aç
    ↓
Ön yükleme penceresini küçült
    ↓
Kullanıcı bağlantıya tıklar
    ↓
Sekmeyi ana pencereye taşı
    ↓
Sekmeyi etkinleştir
    ↓
Tamamlandı!
```

### Teknik Mimari

- **Content Script** - Sayfa bağlantı olaylarını dinler, ön yüklemeyi tetikler
- **Background Service Worker** - Ön yükleme penceresini ve sekmeleri yönetir
- **Popup UI** - Ayarlar arayüzü ve istatistik bilgileri sağlar
- **Chrome Storage API** - Ayarları ve istatistik verilerini kalıcı hale getirir

### Ön Yükleme Penceresi Teknolojisi

Uzantı, sayfaları ön yüklemek için bağımsız bir ön yükleme penceresi kullanır:

1. Küçük bir normal tip pencere oluşturur
2. Bu pencereyi hemen küçültür
3. Pencerede ön yükleme sekmesi oluşturur
4. Kullanıcı tıkladığında sekmeyi ana pencereye taşır
5. Sekmeyi etkinleştirir ve ana pencereye odaklanır

Bu yöntemin avantajları:
- ✅ Sayfayı tamamen ön yükler (JavaScript, CSS, resimler vb. dahil)
- ✅ Ana pencere hiç etkilenmez
- ✅ Sekmeler sorunsuz taşınabilir
- ✅ Tüm siteleri ve karmaşık sayfaları destekler

---

## 🎨 Arayüz Önizlemesi

### Ayarlar Paneli
- Basit anahtar kontrolü
- Sezgisel kaydırıcı ayarı
- Gerçek zamanlı ön yükleme listesi
- Yakın bağlantı gösterimi

### İstatistik Paneli
- Toplam ön yükleme sayısı
- İsabet oranı yüzdesi
- Zaman tasarrufu istatistiği
- Oturum süresi gösterimi

### Site Kuralları
- Alan adı listesi yönetimi
- Etkin/Devre dışı durumu
- Hızlı ekleme/silme

---

## 🔧 Yapılandırma Seçenekleri

| Seçenek | Açıklama | Varsayılan Değer | Önerilen Değer |
|------|------|--------|--------|
| Ön yüklemeyi etkinleştir | Ana anahtar | Açık | Açık |
| Fare üzerine gelme gecikmesi | Fare üzerine geldikten sonra ön yükleme tetiklenene kadar geçen süre | 100ms | 100-300ms |
| Maksimum ön yükleme sayısı | Eşzamanlı ön yükleme maksimum miktarı | 5 | 3-5 |
| Ön yükleme modu | Ön yükleme yöntemi | Ön yükleme penceresi | Ön yükleme penceresi |
| Ağ farkındalığı | Ağ durumuna göre ayarla | Açık | Açık |
| Göstergeyi göster | Ön yükleme durumu noktasını göster | Açık | Açık |
| Ön yükleme sessizleştirme | Ön yüklenmiş sekmeleri varsayılan olarak sessize al | Açık | Açık |
| Sekme yineleme önleme | Açık sekmelere algıla ve atla | Açık | Açık |
| Tab-out Yeni Sekme Sayfası | Yönetim panelini etkinleştir | Kapalı | İhtiyaca göre |
| Kısayollar | Alt+P / Alt+C'yi etkinleştir | Kapalı | İhtiyaca göre |

---

## ❓ SSS

### S: Ön yükleme çok fazla veri tüketir mi?
C: Uzantı ağ durumunu akıllıca algılar ve yavaş ağlarda otomatik olarak ön yüklemeyi azaltır. "Maksimum ön yükleme sayısı"nı ayarlayarak veri tüketimini de kontrol edebilirsiniz.

### S: Ön yükleme tarayıcı performansını etkiler mi?
C: Ön yükleme bağımsız bir pencere kullanır, bu nedenle ana pencere performansına etkisi minimumdur. Ayrıca uzantı, süresi dolmuş ön yükleme içeriğini otomatik olarak temizler.

### S: Bazı sitelerde ön yükleme neden başarısız oluyor?
C: Bazı sitelerde koruma mekanizmaları olabilir. Bu siteler için "Site kuralları"nda ön yüklemeyi devre dışı bırakabilirsiniz.

### S: Bir bağlantının ön yüklendiğini nasıl anlarım?
C: "Göstergeyi göster"i etkinleştirdikten sonra, ön yüklenmiş bağlantıların yanında yeşil nokta görünecektir.

### S: Ön yükleme penceresi görüntülenecek mi?
C: Hayır. Ön yükleme penceresi hemen küçültülür ve tarayıcı deneyiminizi hiç etkilemez.

### S: Belirli siteler için ön yüklemeyi devre dışı bırakabilir miyim?
C: Evet. "Site kuralları" sekmesinde alan adı kuralları ekleyin veya sayfaya sağ tıklayıp "Bu sitede ön yüklemeyi etkinleştir/devre dışı bırak"ı seçin.

### S: Akıllı Sekme Yineleme Önleme nedir?
C: Tıklamak üzere olduğunuz bağlantı mevcut pencerede zaten açık olduğunda, uzantı yeni bir sekme açmak yerine otomatik olarak mevcut sekmeye atlar. Bu, yinelenen sekmeleri önler ve bellek tasarrufu sağlar.

### S: Tab-out nedir?
C: Tab-out, tüm açık sekmelerinizi (etki alanına göre gruplandırılmış), sık kullanılan siteler için favorileri, sonra oku yönetimini ve daha fazlasını gösteren güzel bir yeni sekme yönetim panelidir.

### S: Ön yüklenmiş sekmeler ses çalacak mı?
C: Hayır. Ön yüklenmiş sekmeler video veya canlı yayın sitelerinden gelen sesin otomatik oynatılmasını önlemek için varsayılan olarak sessize alınır. Etkinleştirildikten sonra sesi açmak için adres çubuğuna tıklayabilirsiniz.

### S: Kısayollarım neden çalışmıyor?
C: Kısayollar varsayılan olarak devre dışıdır ve ayarlardan manuel olarak etkinleştirilmelidir. Bu, sistem veya diğer uzantı kısayollarıyla çatışmayı önler.

---

## 🚀 Sürüm Geçmişi

### v2.1.0 (Mevcut Sürüm)
- ✨ **Akıllı Sekme Yineleme Önleme & Atlama** - Ön yülkemeden önce hedef sayfanın mevcut pencerede açık olup olmadığını algılar; tıklamada mevcut sekmeye atlar
- ✨ **Tab-out Yeni Sekme Sayfası Yönetimi** - Etki alanı gruplama, favoriler ve sayı rozeti ile güzel yeni sekme paneli
- ✨ **Ön Yükleme Sessizleştirme** - Ön yüklenmiş sekmeler otomatik ses oynatmayı önlemek için varsayılan olarak sessize alınır
- ✨ **Kısayol Çatışma Algılama** - Kısayol çatışmalarını otomatik olarak algılar ve uyarır
- ✨ **Çok Dilli Destek** - Basitleştirilmiş Çince, Geleneksel Çince ve İngilizce arayüzleri destekler
- ✨ **LRU Önbellek Tahliyesi** - Ön yükleme sınırı aşıldığında en az kullanılan içeriği otomatik olarak kaldırır
- ✨ **Varsayılan Site Kuralları** - Douyin gibi video siteleri için ön yükleme varsayılan olarak devre dışı
- 🔧 Çoklu pencere yeniden kullanımı ile optimize edilmiş ön yükleme penceresi yönetimi
- 🔧 Optimize edilmiş sekme izleme ve temizleme mantığı

### v2.0.0
- ✨ Yeni ön yükleme penceresi teknolojisi
- ✨ Akıllı sekme yönetimi
- ✨ Site kuralları sistemi
- ✨ İstatistik ve analiz işlevleri
- ✨ Ağ farkındalığı optimizasyonu
- ✨ Görsel gösterge
- ✨ Karanlık mod desteği
- ✨ Kısayol tuşu desteği
- ✨ Sağ tık menüsü entegrasyonu

### v1.4.6
- 🔧 Yinelenen sekme algılama
- 🔧 Otomatik atlama işlevi

---

## 🤝 Katkıda Bulunma

Issue ve Pull Request'ler memnuniyetle karşılanır!



### Proje Yapısı

```
webpremium/
├── manifest.json          # Uzantı yapılandırma dosyası
├── background.js          # Arka plan servis betiği giriş noktası
├── content.js             # İçerik betiği giriş noktası
├── popup.html             # Popup penceresi HTML
├── popup.js               # Popup penceresi betiği giriş noktası
├── popup.css              # Popup penceresi stili
├── index.html             # Tab-out Yeni Sekme Sayfası HTML
├── app.js                 # Tab-out Yeni Sekme Sayfası mantığı
├── style.css              # Tab-out Yeni Sekme Sayfası stili
├── icons/                 # Simge dosyaları
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── src/                   # Modüler kaynak kodu
│   ├── background/        # Arka plan modülleri
│   │   ├── preload-window.js   # Ön yükleme penceresi yönetimi
│   │   ├── router.js           # Mesaj yönlendirme
│   │   ├── settings-store.js   # Ayarlar deposu
│   │   ├── site-rules.js       # Site kuralları
│   │   ├── stats.js            # İstatistikler
│   │   ├── tab-deduper.js      # Sekme yineleme önleyici
│   │   ├── tab-out.js          # Tab-out işlevi
│   │   └── tab-tracker.js      # Sekme izleyici
│   ├── content/           # İçerik betiği modülleri
│   │   ├── indicator.js        # Görsel gösterge
│   │   ├── link-tracker.js     # Bağlantı izleyici
│   │   ├── main.js             # Ana giriş noktası
│   │   ├── network-aware.js    # Ağ farkındalığı
│   │   ├── preloader.js        # Ön yükleyici
│   │   └── settings.js         # Ayar yönetimi
│   ├── popup/             # Popup modülleri
│   │   ├── api.js              # API sarıcısı
│   │   ├── dom.js              # DOM yardımcıları
│   │   ├── i18n.js             # Uluslararasılaştırma
│   │   ├── rules-view.js       # Kurallar görünümü
│   │   ├── settings-view.js    # Ayarlar görünümü
│   │   ├── stats-view.js       # İstatistik görünümü
│   │   ├── tabs.js             # Sekme değiştirme
│   │   ├── theme.js            # Tema
│   │   └── toast.js            # Toast mesajları
│   └── shared/            # Paylaşılan modüller
│       ├── constants.js        # Sabitler
│       ├── logger.js           # Günlüklendirme
│       └── url-utils.js        # URL yardımcıları
└── README.md              # Dokümantasyon
```

---

## 📄 Lisans

Mozilla Public License Version 2.0

Bu proje MPL-2.0 lisansını benimser. Ayrıntılar için [LICENSE](../../LICENSE) dosyasına bakın.

---

## 💬 Geri Bildirim ve Destek

- 🐛 [Hata Bildir](https://github.com/Yikumasai/webpremium/issues)
- 💡 [Özellik Önerileri](https://github.com/Yikumasai/webpremium/issues)
- 📧 E-posta: likanglin2001@qq.com

---

## 🌟 Teşekkürler

Webpremium'u kullanan ve destekleyen tüm kullanıcılara teşekkürler!

Bu proje size yardımcı olduysa, lütfen bize bir ⭐️ Star verin!

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

**Daha hızlı tarama, daha iyi deneyim**

Made with ❤️ by Webpremium

</div>


