# 📱 Alışkanlık Takip Uygulaması

> Günlük alışkanlıklarını takip etmene, hatırlatıcı kurmanı ve ilerlemenizi görmenizi sağlayan minimalist bir mobil uygulama.

---

## 🗂️ İçindekiler

- [Proje Genel Bakış](#-proje-genel-bakış)
- [Kullanılan Teknolojiler](#-kullanılan-teknolojiler)
- [Özellikler](#-özellikler)
- [Proje Yapısı](#-proje-yapısı)
- [Ekranlar](#-ekranlar)
- [Veri Modeli](#-veri-modeli)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [Mağazaya Gönderme](#-mağazaya-gönderme)
- [Yapım Aşamaları](#-yapım-aşamaları)

---

## 📌 Proje Genel Bakış

**Alışkanlık Takip**, kullanıcıların günlük alışkanlıklarını oluşturabileceği, takip edebileceği ve özelleştirilmiş bildirimler ayarlayabileceği bir React Native / Expo uygulamasıdır.

| Özellik | Detay |
|---|---|
| Platform | iOS & Android (+ Web önizleme) |
| Dil | TypeScript |
| Framework | React Native + Expo SDK 54 |
| Navigasyon | Expo Router (file-based) |
| Veri Depolama | AsyncStorage (yerel, çevrimdışı) |
| Bildirimler | expo-notifications (günlük tekrarlayan) |
| Tema | Açık / Koyu / Sistem |

---

## 🛠️ Kullanılan Teknolojiler

### Ana Framework & Dil
| Araç | Sürüm | Açıklama |
|---|---|---|
| **TypeScript** | ~5.9.2 | Tip güvenli JavaScript |
| **React Native** | 0.81.5 | Çapraz platform mobil UI |
| **Expo SDK** | ~54.0.27 | React Native üstü geliştirme platformu |
| **Expo Router** | ~6.0.17 | Dosya tabanlı navigasyon (Next.js tarzı) |

### Veri & State Yönetimi
| Araç | Sürüm | Açıklama |
|---|---|---|
| **AsyncStorage** | 2.2.0 | Kalıcı yerel depolama |
| **React Context API** | — | Global state yönetimi (HabitsContext, ThemeContext) |

### UI & Tasarım
| Araç | Sürüm | Açıklama |
|---|---|---|
| **expo-linear-gradient** | ~15.0.8 | Header ve butonlarda gradyan renk geçişleri |
| **@expo/vector-icons** | ^15.0.3 | Feather ikon seti |
| **@expo-google-fonts/inter** | ^0.4.0 | Inter yazı ailesi (Regular, Medium, SemiBold, Bold) |
| **react-native-safe-area-context** | ~5.6.0 | Çentik/home bar güvenli alan yönetimi |
| **react-native-gesture-handler** | ~2.28.0 | Gesture desteği |
| **react-native-reanimated** | ~4.1.7 | Yüksek performanslı animasyonlar |

### Bildirimler
| Araç | Sürüm | Açıklama |
|---|---|---|
| **expo-notifications** | ^0.32.17 | Günlük tekrarlayan push bildirimleri |
| **@react-native-community/datetimepicker** | ^8.4.4 | Saat seçici (TimePicker) |

### Diğer
| Araç | Sürüm | Açıklama |
|---|---|---|
| **expo-haptics** | ~15.0.8 | Dokunsal geri bildirim (titreşim) |
| **expo-splash-screen** | ~31.0.12 | Uygulama açılış ekranı |
| **react-native-keyboard-controller** | 1.18.5 | Klavye açılış/kapanış yönetimi |

### Build & Deploy
| Araç | Açıklama |
|---|---|
| **EAS Build** | Expo Application Services — mağaza için derleme |
| **EAS Submit** | Otomatik mağaza gönderimi |
| **pnpm** | Paket yöneticisi (workspace monorepo) |

---

## ✨ Özellikler

### Temel Özellikler
- ✅ Alışkanlık oluşturma (isim + emoji)
- ✅ Checkbox ile tamamlama işaretleme
- ✅ Kalıcı veri saklama (uygulama kapanınca kaybolmaz)
- ✅ Gün değişince checkbox'ların otomatik sıfırlanması
- ✅ Uzun basınca alışkanlık silme

### Bildirim Sistemi
- ✅ Her alışkanlık için birden fazla hatırlatma saati
- ✅ Günlük tekrarlayan bildirimler
- ✅ Alışkanlık silinince bildirim de otomatik iptal

### Motivasyon & Geri Bildirim
- ✅ Toast mesajları: "Helal! Devam et 🔥" / "Hadi tekrar dene 😅"
- ✅ Hepsini tamamlayınca: "Bugünü fulledin! 🎉🔥"
- ✅ İlerleme çubuğu (progress bar)
- ✅ Tamamlanma sayacı (2/5 gibi)
- ✅ Dokunsal geri bildirim (haptic feedback)

### Tasarım
- ✅ Gradyan header (indigo → mor)
- ✅ Renkli accent barlar (her alışkanlık farklı renk)
- ✅ Emoji badge'ler
- ✅ Açık / Koyu / Sistem teması
- ✅ Tarih göstergesi ("Pazartesi, 4 May")
- ✅ Animasyonlu checkbox (spring + rotation)

---

## 📁 Proje Yapısı

```
artifacts/mobile/
│
├── app/                        # Ekranlar (Expo Router)
│   ├── _layout.tsx             # Root layout, provider'lar buraya
│   ├── index.tsx               # Ana ekran (alışkanlık listesi)
│   ├── add-habit.tsx           # Yeni alışkanlık ekleme ekranı
│   ├── settings.tsx            # Ayarlar ekranı (tema seçimi)
│   └── +not-found.tsx          # 404 sayfası
│
├── components/                 # Yeniden kullanılabilir bileşenler
│   ├── Toast.tsx               # Özel toast mesaj sistemi
│   ├── ErrorBoundary.tsx       # Hata sınırı
│   └── ErrorFallback.tsx       # Hata ekranı
│
├── context/                    # Global state (React Context)
│   ├── HabitsContext.tsx       # Alışkanlık CRUD + AsyncStorage
│   └── ThemeContext.tsx        # Tema tercihi (açık/koyu/sistem)
│
├── hooks/                      # Özel React hook'ları
│   ├── useColors.ts            # Tema renklerini döndüren hook
│   └── useNotifications.ts     # Bildirim planlama/iptal etme
│
├── constants/
│   └── colors.ts               # Renk paleti (light + dark)
│
├── assets/
│   └── images/
│       └── icon.png            # Uygulama ikonu (AI oluşturuldu)
│
├── app.json                    # Expo konfigürasyonu
├── eas.json                    # EAS Build/Submit konfigürasyonu
├── metro.config.js             # Metro bundler ayarları
├── babel.config.js             # Babel konfigürasyonu
├── tsconfig.json               # TypeScript ayarları
└── package.json                # Bağımlılıklar
```

---

## 📱 Ekranlar

### 1. Ana Ekran (`app/index.tsx`)
- Gradyan header (tarih + başlık + ayarlar butonu)
- Tamamlanma istatistikleri ve progress bar
- Alışkanlık listesi (emoji badge + isim + saat + checkbox)
- Boş durum mesajı
- Sağ alt köşede gradyan FAB (+) butonu

### 2. Alışkanlık Ekleme (`app/add-habit.tsx`)
- Gradyan header
- Emoji girişi (klavyeden herhangi bir emoji)
- Alışkanlık adı text input
- Birden fazla hatırlatma saati ekleme
- Kaydet butonu

### 3. Ayarlar (`app/settings.tsx`)
- Tema seçimi: ☀️ Açık / 🌙 Koyu / 📱 Sistem
- Hızlı dark mode toggle
- Bildirim bilgi kartı

---

## 🗃️ Veri Modeli

```typescript
interface Habit {
  id: string;           // Benzersiz kimlik (timestamp + random)
  name: string;         // Alışkanlık adı
  emoji: string;        // Seçilen emoji
  isDone: boolean;      // Bugün tamamlandı mı?
  doneDate: string | null;     // Tamamlanma tarihi "YYYY-MM-DD"
  reminderTimes: string[];     // Hatırlatma saatleri ["08:00", "20:00"]
  notificationIds: string[];   // Expo bildirim ID'leri
}
```

**Depolama:**
- AsyncStorage key: `@habits_v3`
- Tema tercihi key: `@theme_mode_v1`

**Günlük sıfırlama mantığı:**
```
Uygulama açılınca:
  her alışkanlık için → doneDate !== bugün ise → isDone = false
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Expo Go uygulaması (telefonda test için)

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/KULLANICI_ADIN/aliskanlik-takip.git
cd aliskanlik-takip

# 2. Bağımlılıkları yükle
pnpm install

# 3. Uygulamayı başlat
cd artifacts/mobile
pnpm dev
```

QR kodu Expo Go ile tara → uygulama telefonunda açılır.

### Web Önizleme
```bash
# Tarayıcıda açmak için
pnpm exec expo start --web
```

---

## 🏪 Mağazaya Gönderme

### Ön Gereksinimler
| Platform | Gereksinim | Ücret |
|---|---|---|
| Google Play | Google Play Developer hesabı | $25 (tek seferlik) |
| App Store | Apple Developer Program | $99/yıl |
| Her ikisi | Expo hesabı (expo.dev) | Ücretsiz |

### Adımlar

```bash
# EAS CLI kur
npm install -g eas-cli

# Expo hesabına giriş yap
eas login

# Projeyi başlat (projectId alırsın)
eas init

# app.json içindeki YOUR_EAS_PROJECT_ID'yi güncelle

# Android için build
eas build --platform android --profile production

# iOS için build
eas build --platform ios --profile production

# Mağazalara gönder
eas submit --platform android
eas submit --platform ios
```

### Mağaza Listesi İçin Gerekenler
- [ ] Uygulama açıklaması (Türkçe + İngilizce)
- [ ] En az 3 ekran görüntüsü (her boyut için)
- [ ] Gizlilik politikası URL'si (zorunlu)
- [ ] Uygulama kategorisi: "Health & Fitness" / "Productivity"

---

## 🔨 Yapım Aşamaları

### Aşama 1 — Temel Altyapı
- Expo + Expo Router kurulumu
- Dosya tabanlı navigasyon (Stack: index → add-habit)
- AsyncStorage ile veri katmanı
- `HabitsContext` ile global state (addHabit, toggleHabit, deleteHabit)
- Günlük otomatik sıfırlama mantığı

### Aşama 2 — Temel Ekranlar
- **Ana Ekran:** Alışkanlık listesi, checkbox, boş durum mesajı
- **Ekleme Ekranı:** TextInput + Kaydet butonu
- Uzun basınca silme (Alert dialog)
- İlerleme çubuğu

### Aşama 3 — Emoji + Bildirim Sistemi
- Emoji seçimi klavyeden (TextInput tabanlı, herhangi emoji destekler)
- `expo-notifications` entegrasyonu
- Günlük tekrarlayan bildirim planlama
- Birden fazla hatırlatma saati desteği
- Alışkanlık silinince otomatik bildirim iptali
- `@react-native-community/datetimepicker` ile saat seçici

### Aşama 4 — Motivasyon & UX İyileştirmeleri
- Özel Toast bileşeni (slide-up animasyon)
- "Helal! Devam et 🔥" / "Hadi tekrar dene 😅" mesajları
- "Bugünü fulledin! 🎉🔥" kutlama mesajı
- Haptic feedback (dokunsal geri bildirim)
- Spring animasyonlu checkbox (scale + rotation)

### Aşama 5 — Dark Mode & Tema Sistemi
- `ThemeContext` ile tema state'i
- AsyncStorage'a tema tercihi kaydetme
- `constants/colors.ts` içinde `light` ve `dark` palet tanımları
- `useColors()` hook'u ile tema-aware renk kullanımı
- Ayarlar ekranı: ☀️ Açık / 🌙 Koyu / 📱 Sistem seçenekleri

### Aşama 6 — Görsel Tasarım Yenileme
- `expo-linear-gradient` ile gradyan header (indigo → mor)
- Her alışkanlık kartına farklı accent rengi (hash ile belirlenir)
- Sol kenarda renkli dikey çizgi (accent bar)
- Emoji yuvarlak renkli badge içinde
- Gradyan FAB butonu
- Inter yazı ailesi (4 ağırlık)
- Tarih göstergesi ("Pazartesi, 4 May")
- Ayarlar ve Ekleme ekranlarına da gradyan header

### Aşama 7 — Mağaza Hazırlığı
- `app.json` tam konfigürasyonu (bundleIdentifier, package, permissions)
- `eas.json` oluşturulması (development / preview / production profilleri)
- iOS bildirim izni açıklaması (`NSUserNotificationsUsageDescription`)
- Android izinleri (`POST_NOTIFICATIONS`, `SCHEDULE_EXACT_ALARM`)
- Adaptif ikon (Android)

---

## 🤝 GitHub'a Yükleme

```bash
# 1. GitHub'da yeni repo oluştur (github.com → New repository)
# Repo adı: aliskanlik-takip

# 2. Lokal klasörde git başlat
cd /proje/klasörün
git init
git add .
git commit -m "ilk commit: Alışkanlık Takip uygulaması"

# 3. GitHub reposunu bağla
git remote add origin https://github.com/KULLANICI_ADIN/aliskanlik-takip.git
git branch -M main
git push -u origin main
```

---

## 📄 Lisans

MIT License — istediğin gibi kullanabilirsin.

---

*Replit Agent ile geliştirildi — Mayıs 2026*
