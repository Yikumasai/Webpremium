<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Bağlantı Ön Yükleyici

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
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
- 🔄 **Akıllı Sekme Yönetimi** - Zaten açık sekmeleri otomatik algılar ve oraya atlar
- 📊 **Gerçek Zamanlı İstatistikler** - Ön yükleme etkisini ve tasarruf edilen zamanı takip eder
- 🎨 **Modern Arayüz** - Karanlık mod desteği, temiz ve güzel arayüz
- ⚙️ **Yüksek Özelleştirilebilir** - Kişisel ihtiyaçları karşılamak için zengin yapılandırma seçenekleri

---

## 🎯 Özellikler

### Temel İşlevler

#### 1. Akıllı Ön Yükleme
- **Fare Üzerine Gelme Tetikleyicisi** - Bağlantıların üzerine fare geldiğinde otomatik ön yükleme
- **Ayarlanabilir Gecikme Süresi** - 0-1000ms fare üzerine gelme gecikmesi yapılandırmasını destekler
- **Yakın Bağlantı Tahmini** - Fare yakınındaki bağlantıları akıllıca tanır ve ön yükler
- **Ön Yükleme Miktarı Kontrolü** - Maksimum eşzamanlı ön yükleme sayısını ayarlayabilir (1-10)

#### 2. Ön Yükleme Modları
- **Ön Yükleme Penceresi Modu (Önerilen)** - Bağımsız küçültülmüş pencerede ön yükleme, tam sayfa yükleme, ana pencereye müdahale yok
- **iframe Ön Yükleme Modu** - Hafif ön yükleme yöntemi, iyi uyumluluk

#### 3. Akıllı Sekme Yönetimi
- **Yinelenen Sekme Algılama** - Aynı URL'ye sahip sekmeleri otomatik algılar
- **Otomatik Atlama** - Zaten açık bağlantılara tıklandığında mevcut sekmeye otomatik atlar
- **Sorunsuz Hareket** - Ön yüklenmiş sekmeler ana pencereye sorunsuz taşınır
- **Bellek Optimizasyonu** - Yinelenen sekmeleri azaltır, bellek kullanımını düşürür

#### 4. Ağ Farkındalığı
- **Akıllı Algılama** - Ağ durumunu otomatik algılar
- **Uyarlanabilir Strateji** - Yavaş ağlarda otomatik olarak ön yüklemeyi azaltır
- **Veri Tasarrufu** - Zayıf ağ ortamlarında veri israfını önler

#### 5. Görsel Gösterge
- **Ön Yükleme Durumu Gösterimi** - Bağlantının yanında ön yükleme durumunu gösteren küçük nokta
- **Yükleme Animasyonu** - Turuncu nokta yükleme devam ediyor anlamına gelir
- **Yükleme Tamamlandı İşareti** - Yeşil nokta ön yükleme tamamlandı anlamına gelir

#### 6. Site Kuralları Yönetimi
- **Özel Kurallar** - Belirli siteler için ön yüklemeyi etkinleştirir veya devre dışı bırakır
- **Alan Adı Seviyesi Kontrolü** - Alan adına göre hassas ön yükleme kontrolü
- **Sağ Tık Menüsü** - Mevcut sitenin ön yükleme durumunu hızlıca değiştirir

#### 7. İstatistikler ve Analiz
- **Ön Yükleme Sayısı** - Toplam ön yükleme sayısını kaydeder
- **İsabet Oranı İstatistikleri** - Ön yüklemenin etkili kullanım oranını hesaplar
- **Zaman Tasarrufu** - Tasarruf edilen toplam zamanı istatistikler
- **Oturum Süresi** - Mevcut oturumun kullanım süresini gösterir

### Kısayol Tuşları

- `Alt + P` - Ön yükleme işlevini hızlıca aç/kapat
- `Alt + C` - Tüm ön yükleme önbelleğini temizle

### Sağ Tık Menüsü

- **Bu bağlantıyı ön yükle** - Seçili bağlantıyı manuel olarak ön yükle
- **Bu sitede ön yüklemeyi etkinleştir/devre dışı bırak** - Mevcut sitenin ön yükleme durumunu hızlıca değiştir

---

## 📦 Kurulum

### Yöntem 1: Chrome Web Mağazası

[Chrome Web Mağazası](https://chromewebstore.google.com/detail/link-preloader/ajfjclgcglnjglkjgjcenkjjmipddnhj) sayfasına gidin ve tek tıkla kurmak için "Chrome'a Ekle"ye tıklayın.

### Yöntem 2: Geliştirici Modunda Kurulum

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

3. **İstatistikleri görüntüle**
   - Uzantı simgesine tıkla
   - "İstatistikler" sekmesine geç
   - Ön yükleme etkisini ve tasarruf edilen zamanı gör

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

---

## 🚀 Sürüm Geçmişi

### v2.0.0 (Mevcut Sürüm)
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

### Geliştirme Ortamı Kurulumu

```bash
# Depoyu klonla
git clone https://github.com/Yikumasai/webpremium.git

# Dizine gir
cd webpremium

# Chrome'da uzantıyı yükle
# chrome://extensions/ → Geliştirici modu → Paketlenmemiş uzantı yükle
```

### Proje Yapısı

```
webpremium/
├── manifest.json          # Uzantı yapılandırma dosyası
├── background.js          # Arka plan servis betiği
├── content.js            # İçerik betiği
├── popup.html            # Popup penceresi HTML
├── popup.js              # Popup penceresi betiği
├── popup.css             # Popup penceresi stili
├── icons/                # Simge dosyaları
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Dokümantasyon
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

<div align="center">

**Daha hızlı tarama, daha iyi deneyim**

Made with ❤️ by Webpremium

</div>


