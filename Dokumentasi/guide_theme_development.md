# 🎨 Panduan Pengembangan Tema (Theme)

**SIMAJU Core Framework** tidak hanya menyediakan REST API (Backend), tetapi juga dilengkapi kemampuan *Server-Side Rendering* (SSR) mumpuni menggunakan mesin EJS/Pug yang dimotori oleh arsitektur **Theme Engine**.

Tema bertugas mengatur seluruh elemen UI/UX, tata letak (*layout*), dan aset publik (*CSS/JS*) yang akan dilihat langsung oleh klien atau pelanggan di peramban web.

---

## 1. Konsep Tema di SIMAJU

Alih-alih mencampur-adukkan kode HTML di dalam *Core* atau *Module*, Anda memisahkan semua desain visual ke dalam folder `resources/views/themes/`.
Framework ini mendukung sistem **Switchable Themes** layaknya CMS modern. Anda bisa mengubah tampilan aplikasi Anda secara instan hanya dengan mengubah nama tema yang aktif di pengaturan!

---

## 2. Struktur Direktori Tema

Sebuah tema memiliki kumpulan *View* dan sebuah manifest pendamping. Struktur standarnya seperti ini:

```text
resources/
├── views/
│   └── themes/
│       └── corporate-modern/      # <--- Nama Tema
│           ├── theme.json         # Metadata tema (Wajib)
│           ├── layout.ejs         # Template induk (Header, Footer, Nav)
│           ├── index.ejs          # Halaman beranda utama
│           ├── auth/
│           │   ├── login.ejs      # Tampilan halaman login
│           │   └── register.ejs   # Tampilan halaman pendaftaran
│           └── partials/          # Potongan kode (Sidebar, Modal)
└── assets/
    └── themes/
        └── corporate-modern/      # <--- Aset Publik Tema
            ├── css/style.css
            ├── js/app.js
            └── img/logo.png
```

---

## 3. Cara Membangun Tema

### Langkah 1: Buat Direktori dan File `theme.json`
`theme.json` wajib berada di akar folder tema Anda. File ini memberitahukan identitas tema kepada SIMAJU.

```json
{
  "name": "corporate-modern",
  "displayName": "Corporate Modern UI",
  "author": "Nama Anda",
  "version": "1.0.0",
  "description": "Tema perusahaan dengan tampilan modern yang responsif."
}
```

### Langkah 2: Membangun Layout Induk (`layout.ejs`)
Agar Anda tidak perlu menulis kode HTML `<html><head>` berulang-ulang, buatlah satu layout master yang memuat fungsi bawaan EJS, contoh: `<%- body %>`.

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title><%= pageTitle || 'Selamat Datang' %></title>
    <!-- Meload CSS publik secara otomatis dari folder public/assets -->
    <link rel="stylesheet" href="/assets/themes/corporate-modern/css/style.css">
</head>
<body>
    
    <header>
        <%- include('partials/navbar') %>
    </header>

    <main>
        <!-- Konten spesifik halaman akan dirender di bawah ini -->
        <%- body %>
    </main>

    <footer>
        <p>&copy; 2026 Perusahaan Anda</p>
    </footer>

</body>
</html>
```

### Langkah 3: Menulis Konten Spesifik Halaman (`index.ejs`)
Halaman lain bisa menggunakan layout induk tersebut:

```html
<% layout('layout') %>

<div class="hero">
    <h1>Halo, <%= user ? user.name : 'Tamu' %>!</h1>
    <p>Ini adalah halaman utama menggunakan tema Corporate Modern.</p>
</div>
```

---

## 4. Cara Mengaktifkan Tema

Sistem tema di SIMAJU Core dapat diubah via CLI `mji` atau konfigurasi `simaju.json`.

**Menggunakan CLI:**
```bash
mji theme:use corporate-modern
```
Perintah ini akan secara otomatis memindahkan *pointer* rendering engine untuk menggunakan folder `corporate-modern` dan mengekspos `resources/assets/themes/corporate-modern/` ke dalam folder statik `public/`.

---

## 5. Standar Penulisan Aset (CSS & JS)
Semua aset (*CSS, JavaScript, Images, Fonts*) yang berkaitan dengan tampilan tema secara visual **DILARANG** dimasukkan ke dalam folder `views`. 
Semua aset harus diletakkan terpisah di folder `resources/assets/themes/<nama-tema>/` dan nantinya dapat di-build atau di-*publish* secara otomatis ke folder `public/` oleh framework SIMAJU saat deployment.
