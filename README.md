# NovaDent — Refactor edilmiş tek sayfa klinik sitesi

Vanilla HTML, CSS ve JavaScript ile hazırlanmıştır.

## Dosyalar

- `index.html` — semantik içerik, SEO ve JSON-LD
- `style.css` — full-bleed responsive tasarım, dark mode ve erişilebilir durumlar
- `script.js` — filtreler, slider, carousel, form doğrulama ve çerez tercihi
- `robots.txt` / `sitemap.xml` — arama motoru başlangıç dosyaları

## Yerel çalıştırma

```bash
python3 -m http.server 8080
```

Ardından `http://localhost:8080/nova-dis-klinigi/` adresini açın.

## Yayına almadan önce

1. Telefon, adres, e-posta ve sosyal medya URL'lerini güncelleyin.
2. Unsplash placeholder görsellerini lisanslı klinik WebP görselleriyle değiştirin.
3. Formdaki `/api/appointment` placeholder'ını gerçek endpoint'e bağlayın.
4. KVKK, gizlilik ve çerez sayfalarının gerçek bağlantılarını ekleyin.
5. Google Maps konumunu ve `example.com` alan adını değiştirin.
6. GA4 / Meta Pixel kodlarını yalnızca kullanıcı rızası sonrası yükleyin.
7. Üretim ortamında Lighthouse ve gerçek cihaz testini yeniden çalıştırın.

## Kontrol edilen kırılımlar

360, 480, 768, 1024, 1280 ve 1440 px. Bu genişliklerde yatay taşma bulunmamaktadır.
