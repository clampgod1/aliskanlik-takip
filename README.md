# 📱 Alışkanlık Takip

Günlük alışkanlıklarını takip etmeni sağlayan, Türkçe arayüzlü bir mobil uygulama. Expo / React Native ile geliştirildi.

---

## 🌐 Canlı Web Linki

```
https://a121493e-3f8d-4412-a21c-56be670506c8-00-377pnlb4rvdlw.pike.replit.dev
```

---

## ✨ Özellikler

- ✅ Alışkanlık oluşturma (isim + emoji)
- ✅ Checkbox ile tamamlama işaretleme
- ✅ Her alışkanlık için birden fazla günlük hatırlatma bildirimi
- ✅ Kalıcı veri saklama (uygulama kapanınca kaybolmaz)
- ✅ Gün değişince otomatik sıfırlama
- ✅ Motivasyon toast mesajları 🔥
- ✅ İlerleme çubuğu
- ✅ Haptic (titreşim) geri bildirimi
- ✅ Açık / Koyu / Sistem teması
- ✅ Gradyan tasarım + Inter yazı ailesi
- ✅ Animasyonlu checkbox

---

## 🛠️ Kullanılan Teknolojiler

| Araç | Açıklama |
|---|---|
| **React Native 0.81** | Çapraz platform mobil UI |
| **Expo SDK 54** | Mobil uygulama çatısı |
| **TypeScript** | Tip güvenli JavaScript |
| **Expo Router** | Dosya tabanlı navigasyon |
| **AsyncStorage** | Kalıcı yerel depolama |
| **expo-notifications** | Günlük hatırlatma bildirimleri |
| **expo-linear-gradient** | Gradyan tasarım |
| **expo-haptics** | Titreşim geri bildirimi |
| **React Native Reanimated** | Akıcı animasyonlar |
| **Inter (Google Fonts)** | Yazı ailesi |
| **EAS Build / Update** | Mağaza build ve OTA güncelleme |
| **pnpm workspace** | Monorepo yönetimi |

---

## 📱 Ekranlar

| Ekran | Açıklama |
|---|---|
| **Ana Ekran** | Alışkanlık listesi, progress bar, FAB butonu |
| **Alışkanlık Ekleme** | İsim, emoji, birden fazla hatırlatma saati |
| **Ayarlar** | Açık / Koyu / Sistem tema seçimi |

---

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# Uygulamayı başlat
pnpm --filter @workspace/mobile run dev
```

---

## 🏪 Mağazaya Gönderme

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
eas build --platform ios --profile production
```

---

## 🗺 Yol Haritası

- [ ] App Store yayını (iOS)
- [ ] Play Store yayını (Android)
- [ ] Streak (gün serisi) takibi 🔥
- [ ] İstatistik ekranı
- [ ] Widget desteği

---
