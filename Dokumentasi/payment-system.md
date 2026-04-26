# Payment System (Bab 14)

Modul pembayaran di Simaju Core dirancang untuk fleksibilitas metode pembayaran dan pelacakan invoice yang akurat.

## 💳 Komponen Utama
- **Invoice Generator**: Pembuatan nomor invoice unik otomatis.
- **Payment Methods**: Mendukung berbagai tipe (Transfer, E-Wallet, Cash).
- **Status Tracking**: Alur status pembayaran (`pending`, `success`, `failed`).

## 🔄 Alur Integrasi
Sistem ini terintegrasi langsung dengan modul **Sales** (Penjualan). Setiap transaksi penjualan akan men-trigger pembuatan record di tabel `payments`.

## 🛠️ Service
`PaymentService` menyediakan method untuk:
- `createInvoice(saleId, amount, method)`
- `updateStatus(paymentId, status)`
