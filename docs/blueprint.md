# DukkanApp MVP Blueprint

## Is hedefi

Iki subeli baharat dukkanlari icin web tabanli siparis sistemi.

## Kesinlesen urun kurallari

- Musteri urunu sepete ekler.
- Teslimat adresi yoktur, sadece subeden teslim vardir.
- Musteri siparis sirasinda teslim alacagi subeyi secer.
- Ortak stok mantigi vardir.
- Hazirlama zamani kullanici tarafinda secilmez.
- Sistem siparisi `hazir oldugu en kisa sure` mantigi ile olusturur.
- Misafir siparis desteklenir.
- Uye kullanici favori urunleri kaydedebilir.
- Siparis takibi `siparis no` veya `telefon no` ile yapilabilir.
- Ilk surumde iki admin de tum urunleri ve siparisleri gorur.

## Fazlar

### Faz 1

- Urun listeleme
- Arama
- Kategori
- Misafir checkout
- Musteri uyelik
- Favoriler
- Sube secimi
- Dukkanda odeme
- Siparis no olusturma
- Siparis takip
- Admin paneli

### Faz 2

- iyzico online odeme
- Siparis odeme durumlari
- Play Store'a uygun mobil strateji

## Veri modeli

### `branches`

- id
- name
- slug
- address
- working_hours_start
- working_hours_end
- is_active

### `categories`

- id
- name
- slug
- is_active
- sort_order

### `products`

- id
- category_id
- name
- slug
- description
- image_url
- is_available
- is_active

### `product_options`

- id
- product_id
- label
- detail
- price
- is_default
- sort_order

Admin bu tabloda `Normal Paket`, `Buyuk Paket`, `1 Demet`, `250 g`, `1 Adet`
gibi serbest secenekler tanimlar.

### `customer_accounts`

- id
- phone
- full_name
- password_hash veya Supabase phone-password auth referansi
- created_at

### `favorites`

- id
- customer_id
- product_id

### `guest_profiles`

- id
- full_name
- phone

### `orders`

- id
- order_no
- customer_id nullable
- guest_profile_id nullable
- branch_id
- status
- payment_method
- payment_status
- note
- policy_snapshot
- created_at

### `order_items`

- id
- order_id
- product_id
- product_option_id
- product_name_snapshot
- option_label_snapshot
- unit_price_snapshot
- quantity

### `admin_profiles`

- id
- email
- display_name
- role

## Siparis durumlari

- Alindi
- Hazirlaniyor
- Hazir
- Teslim edildi
- Iptal edildi

## Politika

- Gorunur metin: `Iade yoktur, degisim vardir.`
- Ilk surumde fis / fatura yazilimi entegrasyonu yok.
- Gerekirse magaza ici manuel cozum uygulanir.

## Auth karari

- Musteri arayuzu: telefon + sifre + ad soyad
- Supabase auth: sistem icinde uretilen gizli email + sifre
- Admin auth: email + sifre

Bu model SMS saglayicisi olmadan telefon odakli bir deneyim verir.

## Sifre unutma

- Ilk surumde otomatik SMS veya email reset yok.
- Admin paneli tarafinda destekli sifre yenileme akisi planlanacak.

## Sonraki teknik isler

1. Supabase projesini olustur
2. SQL schema ve RLS politikalarini yaz
3. Seed verileri ekle
4. Frontend formlarini gercek veriyle bagla
5. Faz 1 siparis akisini bitir
