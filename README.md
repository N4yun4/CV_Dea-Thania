# Dea Thania — Portofolio

Web portofolio satu halaman untuk Dea Thania, Social Media & Visual Content Designer.

**Live:** https://n4yun4.github.io/CV_Dea-Thania/

## Isi

- Hero + unduh CV (PDF)
- Karya: 4 cuplikan desain Instagram Sutarman Dental Care + PDF portofolio lengkap
- Pengalaman & pelatihan, pendidikan, keahlian, bahasa, kontak

## Struktur

```
index.html
assets/
  css/style.css
  js/main.js
  img/            # karya (WebP), foto, og.jpg, favicon
  CV-Dea-Thania.pdf
  Portofolio-Dea-Thania.pdf
```

HTML/CSS/JS statis tanpa build step. Font dari Google Fonts (Fraunces + Archivo).

## Menjalankan lokal

```bash
python -m http.server 8000
# buka http://localhost:8000
```

## Deploy ke GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.

## Mengganti konten

- Teks: langsung di `index.html`.
- Cuplikan karya: simpan gambar WebP di `assets/img/`, lalu salin satu `<li>` di dalam `<ul class="works">`.
- PDF portofolio: ganti `assets/Portofolio-Dea-Thania.pdf` dengan nama file yang sama, lalu sesuaikan jumlah halaman dan ukurannya di kartu PDF.
- CV: ganti `assets/CV-Dea-Thania.pdf` dengan nama file yang sama.
