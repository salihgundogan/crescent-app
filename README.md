# DukkanApp

Iki subeli baharat dukkanlari icin gelistirilen siparis ve admin yonetim projesi.

## Urun karari

- Musteri urunleri gorur, arar, sepete ekler ve siparis olusturur.
- Teslimat sadece dukkanlardan yapilir.
- Musteri siparis sirasinda sube secmezse ilerleyemez.
- Siparisler `hazir oldugu en kisa sure` mantigiyla olusur.
- Misafir siparis desteklenir.
- Favoriler sadece uye kullanicida vardir.
- Faz 1 odeme tipi: `dukkanda odeme`
- Faz 2 odeme tipi: `iyzico ile online odeme`
- Musteri girisi: `telefon + sifre + ad soyad`
- Supabase auth tarafinda kullanicinin gormedigi `email + sifre` kaydi uretilir.

## Teknoloji karari

- Frontend: Next.js App Router + TypeScript + Tailwind CSS
- Backend: Next.js server actions / route handlers
- Database: Supabase Postgres
- Auth:
  - Musteri: telefon + sifre arayuzu, Supabase'de gizli email auth
  - Admin: email + sifre
- Dosya yukleme: Supabase Storage
- Odeme entegrasyonu: Faz 2'de iyzico Checkout Form

## Sayfalar

- `/` vitrin ana sayfasi
- `/giris` musteri giris sayfasi
- `/kayit` musteri kayit sayfasi
- `/hesabim` aktif musteri oturumu ozeti
- `/siparis-takip` siparis no veya telefonla siparis durumu sorgulama
- `/admin` admin paneli ilk taslak

## Gelistirme sirasi

1. Supabase proje kurulumu
2. Tablo ve RLS tasarimi
3. Urun listeleme ve kategori yapisi
4. Misafir checkout
5. Musteri uyelik ve favoriler
6. Admin paneli
7. Siparis takip
8. iyzico entegrasyonu
9. Android / Play Store asamasi

## Calistirma

```bash
npm install
npm run dev
```

Sonra [http://localhost:3000](http://localhost:3000) adresini ac.

## Notlar

- Ilk surumde fis/fatura entegrasyonu yok.
- Politika metni: `Iade yoktur, degisim vardir.`
- WhatsApp otomasyonu ilk surumde zorunlu degil; admin panelinde mesaj baslatma daha guvenli.

## Supabase kurulum

- Gizli bilgiler `.env.local` dosyasinda tutulur.
- Ornek degiskenler `.env.example` icindedir.
- Ilk tablo ve policy kurulumu icin [docs/supabase-schema.sql](/C:/dosyalar_desktop/codex-dukkanapp/docs/supabase-schema.sql) dosyasini Supabase SQL Editor'da calistir.
- SMS provider gerekmeden musteri auth akisi icin telefon numarasini sistem icinde gizli bir auth email'ine donusturuyoruz.
