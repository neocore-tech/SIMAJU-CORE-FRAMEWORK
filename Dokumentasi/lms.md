# Dokumentasi Lengkap Modul LMS: Spesifikasi Fitur & Arsitektur UI/UX

Dokumen ini merupakan panduan utama (Master Document) untuk pembangunan Modul LMS (Learning Management System). Dokumen ini membagi spesifikasi menjadi dua bagian: **Bagian I** menguraikan fungsionalitas inti untuk manajemen pembelajaran, dan **Bagian II** menjelaskan implementasi antarmuka (UI) dan pengalaman pengguna (UX) untuk memastikan proses belajar yang fokus dan terukur.

## BAGIAN I: Spesifikasi Fitur Modul (Fungsionalitas)

### 1. Manajemen Pengguna & Peran (User & Role Management)

*Sistem harus membedakan hak akses berdasarkan peran dalam ekosistem pembelajaran.*

* **Tingkat Akses (RBAC):** Pemisahan peran antara *Admin* (pengelola sistem), *Instruktur/Pengajar* (pembuat materi), dan *Siswa/Peserta* (pengguna akhir).
* **Grup/Cohort Belajar:** Pengelompokan peserta ke dalam angkatan ( *batch* ) atau departemen tertentu untuk memudahkan penugasan materi secara massal.
* **Profil Pembelajar:** Menampilkan informasi biodata, riwayat penyelesaian kursus, dan sertifikat yang telah diraih.

### 2. Manajemen Kursus & Kurikulum (Course Management)

*Alat bagi instruktur untuk membuat dan menyusun materi pembelajaran.*

* **Pembuat Kursus (Course Builder):** Antarmuka *drag-and-drop* untuk menyusun struktur silabus: Kursus -> Modul -> Topik/Materi.
* **Dukungan Multimedia:** Kemampuan mengunggah berbagai format materi seperti Video (MP4/YouTube embed), Dokumen (PDF, Word), Presentasi, dan Artikel Teks.
* **Prasyarat Kursus (Prerequisites):** Aturan yang mewajibkan peserta menyelesaikan "Kursus A" terlebih dahulu sebelum bisa membuka "Kursus B".
* **Katalog Kursus:** Halaman etalase ( *storefront* ) internal tempat peserta bisa mencari dan mendaftar ke kursus yang tersedia.

### 3. Evaluasi & Penugasan (Assessment & Assignments)

*Sistem untuk menguji pemahaman peserta terhadap materi.*

* **Kuis Interaktif:** Pembuatan soal dengan berbagai tipe (Pilihan Ganda, Benar/Salah, Jawaban Singkat) dengan sistem penilaian otomatis ( *auto-grading* ).
* **Manajemen Tugas (Assignments):** Fitur bagi peserta untuk mengunggah file tugas (dokumen/gambar) dan antarmuka bagi instruktur untuk memberikan nilai serta ulasan (  *feedback* ).
* **Bank Soal:** Repositori pertanyaan yang bisa diacak (randomize) setiap kali peserta mengambil kuis untuk mencegah kecurangan.

### 4. Pelacakan Progres & Gamifikasi (Progress Tracking)

*Menjaga motivasi belajar dan memberikan data terukur mengenai perkembangan peserta.*

* **Indikator Progres:** Persentase (%) penyelesaian kursus yang diperbarui secara otomatis setiap kali peserta menyelesaikan satu materi.
* **Pembuat Sertifikat (Certificate Generator):** Penerbitan sertifikat digital otomatis (PDF) dengan nama peserta dan tanggal lulus ketika kursus selesai 100%.
* **Aturan Kelulusan:** Penentuan nilai ambang batas ( *passing grade* ) pada kuis agar peserta bisa lanjut ke modul berikutnya.

### 5. Komunikasi & Interaksi (Communication)

*Membangun lingkungan belajar yang interaktif antara pengajar dan peserta.*

* **Ruang Diskusi (Forum):** Kolom komentar atau forum khusus di setiap kursus untuk tanya jawab seputar materi.
* **Pengumuman (Announcements):** Sistem *broadcast* bagi instruktur untuk mengirimkan pesan ke seluruh peserta di suatu kursus (misal: perubahan jadwal materi).
* **Notifikasi Sistem:** Peringatan otomatis melalui email/sistem (Contoh: "Tugas Anda telah dinilai", atau "Anda memiliki kursus baru yang belum diselesaikan").

### 6. Laporan & Analitik (Reporting Dashboard)

*Dasbor khusus bagi manajemen atau admin untuk memantau efektivitas pembelajaran.*

* **Laporan Aktivitas Peserta:** Data kapan peserta login terakhir, durasi menonton video, dan skor rata-rata kuis.
* **Laporan Tingkat Penyelesaian (Completion Rate):** Analisis kursus mana yang memiliki tingkat kelulusan tinggi dan mana yang banyak ditinggalkan di tengah jalan ( *drop-off* ).

## BAGIAN II: Arsitektur & Struktur UI/UX

Tujuan utama dari arsitektur UI/UX LMS adalah meminimalisir distraksi visual (mode fokus) saat proses belajar berlangsung dan memberikan navigasi silabus yang sangat intuitif.

### 1. Tata Letak Global (Global Layout)

Berbeda dengan CRM, LMS memiliki dua antarmuka utama yang sangat berbeda tergantung siapa yang  *login* :

* **Portal Admin/Instruktur:** Menggunakan layout *Enterprise Dashboard* standar (Sidebar Kiri, Topbar, Main Content) yang padat data.
* **Portal Peserta (Learner Portal):** Menggunakan desain yang lebih bersih, visual ( *card-based* ), dan memiliki **Mode Teater/Ruang Belajar** khusus saat membuka materi.

### 2. Hierarki Menu Navigasi (Sisi Peserta / Learner)

* 🏠 **Beranda (Dashboard):** Ringkasan progres belajar.
* 📚 **Katalog Kursus:** Mencari dan menemukan kursus baru.
* 🎓 **Kursus Saya:** Daftar kursus yang sedang atau sudah diikuti.
* 📝 **Tugas & Kuis:** Pengingat *deadline* tugas yang harus dikerjakan.
* 🏆 **Sertifikat:** Galeri pencapaian dan sertifikat untuk diunduh.

### 3. Struktur Halaman Utama (Page Layouts)

#### A. Dashboard Peserta (Learner Dashboard)

* **Tujuan:** Menyambut peserta dan menunjukkan apa yang harus mereka lakukan selanjutnya.
* **Komponen UX:**
  * **Hero Banner / Lanjutkan Belajar:** Tombol besar "Lanjutkan dari yang terakhir dilihat" (Auto-resume).
  * **Kartu Progres (Progress Cards):** Menampilkan kursus yang sedang diikuti beserta *progress bar* (misal: 60% Selesai).
  * **Kalender/Deadline:** Widget mini di sebelah kanan yang menampilkan tenggat waktu kuis atau tugas.

#### B. Halaman Detail Kursus (Course Landing Page)

* **Tujuan:** Memberikan informasi lengkap sebelum peserta memulai/mendaftar kursus.
* **Komponen UX:**
  * **Header Utama:** Judul kursus, nama instruktur, tingkat kesulitan, dan tombol "Mulai Belajar".
  * **Daftar Isi (Syllabus/Curriculum):** Menampilkan bab dan sub-bab materi secara *accordion* (bisa di- *expand/collapse* ). Ikon gembok (🔒) untuk materi yang belum bisa diakses.
  * **Tab InformasiTambahan:** Tab untuk "Tentang Kursus", "Ulasan", dan "Instruktur".

#### C. Ruang Belajar (Course Player Mode) - *Paling Penting*

* **Tujuan:** Antarmuka bebas distraksi saat peserta sedang membaca materi atau menonton video.
* **Komponen UX:**
  * **Tata Letak Khusus:** *Sidebar* diletakkan di sebelah kanan atau kiri khusus untuk menampilkan  **Daftar Isi Materi/Playlist** . Area konten mengambil porsi terbesar (70-80% layar).
  * **Konten Multimedia:** Area tengah untuk memutar Video MP4/YouTube atau membaca PDF.
  * **Navigasi Linier:** Tombol "Sebelumnya" dan "Selesai & Lanjutkan" di bagian bawah konten untuk memandu alur maju peserta secara bertahap.
  * **Distraction-Free:** Menu navigasi utama (Sidebar global) disembunyikan dalam mode ini agar peserta fokus.

#### D. Antarmuka Kuis (Quiz View)

* **Tujuan:** Memberikan pengalaman ujian yang kondusif.
* **Komponen UX:**
  * **Indikator Soal:** Peta nomor soal (1, 2, 3... 20) di area samping, menggunakan warna untuk membedakan soal yang sudah dijawab dan belum dijawab.
  * **Timer:** Waktu hitung mundur (jika kuis dibatasi waktu) di pojok atas yang menempel saat di- *scroll* .
  * **Konten Pertanyaan:** Ukuran huruf yang besar dan jelas untuk pertanyaan dan pilihan ganda.

### 4. Prinsip & Interaksi UX (UX Guidelines)

1. **Mikro-interaksi & Umpan Balik (Micro-feedback):**
   * Berikan animasi sukses (seperti konfeti atau centang hijau tebal) setiap kali peserta menyelesaikan satu modul atau lulus kuis untuk memicu hormon dopamin (gamifikasi psikologis).
2. **Kondisi Kosong (Empty States):**
   * Jika peserta belum memiliki kursus, jangan hanya tampilkan halaman kosong. Berikan ilustrasi menarik dan tombol "Jelajahi Katalog Kursus".
3. **Responsivitas (Mobile-First untuk Peserta):**
   * Portal peserta **wajib** sangat optimal di layar HP ( *smartphone* ), karena tren pembelajaran (terutama video) banyak diakses melalui perangkat genggam.
   * *Course player* video harus secara otomatis menyesuaikan aspek rasio (16:9).
4. **Ikonografi yang Jelas:**
   * Gunakan ikon universal untuk jenis materi: Ikon Play (▶) untuk Video, Ikon Dokumen (📄) untuk Teks/PDF, Ikon Tanda Tanya (❓) untuk Kuis.
