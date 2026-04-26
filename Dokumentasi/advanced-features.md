# Fitur Lanjutan (Advanced Features)

Simaju Core dilengkapi dengan modul-modul canggih untuk kebutuhan bisnis yang kompleks.

## 🧩 Custom Field System (Bab 28)
Memungkinkan penambahan field dinamis pada modul apapun tanpa perlu migrasi database.
- **Service**: `CustomFieldService`
- **Kegunaan**: Menambah spesifikasi teknis pada produk, atau hobi pada profil user.

## 🕵️ Audit Trail (Bab 21)
Sistem logging yang lebih dalam dibandingkan activity log biasa. Mencatat data sebelum (`data_before`) dan sesudah (`data_after`) perubahan.
- **Service**: `AuditService`

## 🔄 Workflow & Approval (Bab 29)
Mengelola alur kerja transaksi yang membutuhkan persetujuan berjenjang (Step-by-step approval).
- **Service**: `WorkflowService`
- **Kegunaan**: Approval pembelian barang mahal oleh Manajer.

## 📝 CMS & Content (Bab 30)
Sistem manajemen konten terintegrasi untuk blog, artikel, dan halaman statis.
- **Service**: `CMSService`
- **Fitur**: Auto-slug, Draft/Publish system, Featured images.

## ⭐ Feedback & Rating (Bab 25)
Memungkinkan user memberikan penilaian dan ulasan pada produk atau layanan.
- **Service**: `FeedbackService`
