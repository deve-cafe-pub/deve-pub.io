# DeVe Coffee & Pub - Web Menü

## 📁 Klasör Yapısı
```
DeVe-Menu/
├── index.html          # Ana sayfa
├── css/
│   └── style.css       # Tasarım dosyası
├── js/
│   ├── firebase-config.js  # Firebase bağlantısı
│   ├── menu-data.js        # Menü verileri
│   └── app.js              # Uygulama mantığı
└── images/             # Ürün görselleri
```

## 🚀 Kullanım

### Yerel Test
1. `index.html` dosyasını tarayıcıda aç
2. Kategorilere tıkla, ürünleri gör
3. Fiyatlar Firebase'den otomatik yüklenir

### GitHub Pages'de Yayınlama
1. GitHub'da yeni repository oluştur
2. Bu klasörü repository'ye yükle:
   ```bash
   git init
   git add .
   git commit -m "DeVe Menu"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADI.git
   git push -u origin main
   ```
3. GitHub → Settings → Pages → Source: main branch
4. Site adresi: `https://KULLANICI_ADIN.github.io/REPO_ADI/`

## 🔄 Nasıl Çalışır?
- Admin panelinden fiyat değiştir → Firebase'e kaydedilir
- Web menüsü açılır → Firebase'den güncel fiyatları çeker
- Telefon/bilgisayar/tablet hepsi aynı fiyatları görür

## 🔗 Firebase Bağlantısı
Electron uygulamasıyla aynı Firebase veritabanını kullanır.
Değişiklikler anında senkronize olur.
