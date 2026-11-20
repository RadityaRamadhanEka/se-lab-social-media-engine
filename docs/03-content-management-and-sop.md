# 03 — Sistem Manajemen Konten Harian & SOP Tim 5 Orang

Dokumen ini menjadi pedoman operasional harian bagi tim medsos **SE Lab FILKOM UB** (**Raditya, Bagas, Hanifah, Lidia, Aurel**) agar target konten harian dosen tercapai secara konsisten tanpa bentrok dengan jadwal kuliah.

---

## 1. Content Pillars `@se.lab.filkom`

Agar tidak kehabisan ide setiap hari, semua konten dikelompokkan ke dalam **4 Pilar Utama**:

| Kode | Nama Pillar | Fokus Topik | Rekomendasi Format & Tema 3D |
| :--- | :--- | :--- | :--- |
| `P1` | **Tech & RPL Bites** | Software engineering, Git, clean code, arsitektur API, Docker, AI engineering, UI/UX. | **Reels 3D Storytelling** (Light/Dark adaptif) atau Carousel Feeds. |
| `P2` | **Lab Life & Culture** | Suasana ngelab di F8.3 & F8.5, aktivitas aslab, POV mahasiswa RPL, rapat lab. | **Reels Raw Footage + Wrapper** & **Snapgram harian**. |
| `P3` | **Project & Riset Showcase** | Demo aplikasi tugas/skripsi/riset lab, hasil *Sharing Session*, bedah *tech stack*. | **Reels 3D/Mockup** & **Feeds Carousel**. |
| `P4` | **Info & Engagement** | Pengumuman lab, jadwal praktikum/event, oprec aslab, meme relate RPL, polling/Q&A. | **Feeds** (sesuai Figma) & **Snapgram Interaktif**. |

---

## 2. Pembagian Kerja Tim 5 Orang (Content Ownership Model)

Tim beranggotakan 5 orang (**Raditya, Bagas, Hanifah, Lidia, Aurel**) tanpa sekat role kaku. Sistemnya memakai **Rotasi Ownership**: setiap orang menjadi **Content Owner** untuk jatah kontennya dari tahap *Draft* hingga *Ready*, sementara **Raditya** mengelola sistem automasi & engine Remotion 3D-nya.

### Pola Jadwal Mingguan (Target Harian Realistis)

| Hari | Slot Utama (Feed / Reels) | Slot Harian (Snapgram) | Penanggung Jawab (Contoh Rotasi) |
| :--- | :--- | :--- | :--- |
| **Senin** | **Reels Edukasi 3D** (`P1` Tech Bites) | Activity / Poll Pembuka Minggu | **Raditya** (Reels) + **Bagas** (Snapgram) |
| **Selasa** | **Feeds** (`P3`/`P4` Info / Sharing Session) — *Placeholder Tim* | Behind the scenes praktikum/lab | **Hanifah** (Feeds) + **Lidia** (Snapgram) |
| **Rabu** | **Reels Edukasi / Story** (`P1`/`P2`) | Q&A / Tech Trivia Story | **Bagas** (Reels/Draft) + **Aurel** (Snapgram) |
| **Kamis** | **Feeds Carousel** (`P1` Tech / `P3` Showcase) — *Placeholder Tim* | Repost / Lab F8.3 & F8.5 Vibes | **Lidia** (Feeds) + **Raditya** (Snapgram) |
| **Jumat** | **Reels Showcase / Lab Life** (`P2`/`P3`) | Teaser Reels / Meme RPL | **Aurel** (Reels/Draft) + **Hanifah** (Snapgram) |
| **Sabtu** | *Opsional: Recap / Light Reels* | Recap Mingguan / Interaktif | Rotasi Mingguan |

> **Kunci Anti-Keteteran (Sistem Batching):**
> - Setiap **Minggu Sore / Senin Pagi**, tim menentukan topik 1 minggu ke depan di Google Sheets.
> - **Raditya** merender batch video 3D Remotion dari script yang sudah berstatus `Ready_To_Render`.
> - Konten **Reels & Feeds** dijadwalkan minimal **H-1** lewat **Meta Business Suite** (gratis & resmi).

---

## 3. Struktur Google Sheets (`SE_Lab_Content_Hub`)

Buat 1 file Google Sheets bernama **`SE_Lab_Content_Hub`** dengan **3 Tab** berikut:

### Tab 1: `Master_Kalender_Harian` (Dashboard Pantauan Harian & Dosen)
| Kolom | Nama Header | Tipe / Keterangan |
| :--- | :--- | :--- |
| A | `Tanggal` | Format `YYYY-MM-DD` (urutan harian) |
| B | `Hari` | `=TEXT(A2,"dddd")` |
| C | `ID_Utama` | Referensi ke `Pipeline_Produksi` (misal `RPL-001`) |
| D | `Format_Utama` | `Reels` / `Feeds` / `Libur_Utama` |
| E | `Judul_Utama` | Otomatis ditarik pakai `XLOOKUP` / `VLOOKUP` dari `Pipeline_Produksi` |
| F | `Status_Utama` | Otomatis ditarik dari `Pipeline_Produksi` |
| G | `PIC_Utama` | Nama Content Owner |
| H | `Tema_Snapgram` | Placeholder topik IG Story hari itu |
| I | `Elemen_Snapgram` | `Poll` / `Q&A` / `Foto Lab` / `Repost Reels` / `Link` |
| J | `PIC_Snapgram` | Salah satu dari 5 anggota |
| K | `Status_Snapgram` | `Planned` / `Ready` / `Posted` |

### Tab 2: `Pipeline_Produksi` (Detail Ideasi → Draft → Editing)
| Kolom | Nama Header | Keterangan |
| :--- | :--- | :--- |
| A | `ID` | Kode unik, misal `RPL-001`, `RPL-002` |
| B | `Tanggal_Tayang` | Target tanggal publish (`YYYY-MM-DD`) |
| C | `Format` | `Reels` / `Feeds` |
| D | `Pillar` | `P1 - Tech Bites` / `P2 - Lab Life` / `P3 - Showcase` / `P4 - Info` |
| E | `Judul_Topik` | Judul singkat konten |
| F | `PIC_Owner` | `Raditya` / `Bagas` / `Hanifah` / `Lidia` / `Aurel` |
| G | `Status` | `Ide` → `Drafting` → `Aset_Shooting` → `Ready_To_Render` → `Editing_Review` → `Scheduled` → `Published` |
| H | `Tema_Visual` | `light` / `dark` (untuk Reels 3D Remotion & konsistensi Feeds) |
| I | `Hook_3_Detik` | Kalimat pembuka / teks hook utama |
| J | `Isi_Cerita_Ringkas` | Alur 3–4 babak cerita (untuk Reels 3D) atau poin slide (untuk Feeds) |
| K | `CTA` | Ajakan akhir (save, komen, daftar, dll.) |
| L | `Caption_IG` | Draft caption + hashtag `#selab #selabfilkom #filkomub` |
| M | `Link_Folder_Drive` | **Terisi otomatis** oleh Google Apps Script |
| N | `Link_Brief_Doc` | **Terisi otomatis** oleh Google Apps Script |
| O | `Catatan_Revisi` | Catatan review dari tim / dosen |

### Tab 3: `Bank_Ide_&_Evaluasi` (Input Form + Evaluasi Mingguan)
- **Baris Ide (terhubung ke Google Form):** `Timestamp`, `Pengusul`, `Pillar`, `Format_Saran`, `Ide_Mentah`, `Referensi_Link`, `Status_Seleksi` (`Pending` / `Dipilih` / `Arsip`).
- **Catatan Evaluasi Mingguan (Kolom tambahan setelah tayang):** `ID_Konten`, `Reach`, `Likes`, `Saves`, `Shares`, `Kendala_Produksi`, `Ide_Perbaikan_Sistem`.

---

## 4. SOP Alur Produksi Konten (End-to-End)

1. **Tahap 1 — Ideasi (Kapan Saja):**
   - Anggota lab mengisi **Google Form Bank Ide** (30 detik) setiap kali ada topik kuliah menarik, bug lucu di lab, atau event lab.
2. **Tahap 2 — Seleksi & Provisioning (Setiap Awal Minggu):**
   - Ide terpilih dipindahkan ke `Pipeline_Produksi` dengan status `Drafting`.
   - Klik menu **`SE Lab Engine → 1. Provision Folder & Brief`** di Google Sheets → folder Drive (`01_Raw_Assets`, `02_Audio_VO`, `03_Final_Output`) dan Google Docs Brief otomatis terbuat.
3. **Tahap 3 — Drafting / Storyboarding:**
   - **Untuk Reels 3D:** Content Owner mengisi template 4 babak cerita (lihat [reels-3d-story-brief.md](../templates/reels-3d-story-brief.md)) termasuk menentukan mode **`light`** atau **`dark`**.
   - **Untuk Feeds:** Content Owner mengisi teks per slide di Brief Doc lalu mendesainnya di Figma `Figma-Instagram-RPL-Lab`.
4. **Tahap 4 — Eksekusi / Rendering:**
   - Jika **Reels 3D Remotion:** Status diubah ke `Ready_To_Render`, klik **`SE Lab Engine → 3. Export JSON Props Reels`**, lalu render via Remotion lokal.
   - Jika **Reels Footage / Feeds:** Upload aset ke `01_Raw_Assets` → edit/desain → taruh hasil final di `03_Final_Output`.
5. **Tahap 5 — Review, Schedule & Evaluasi:**
   - Minimal 1 anggota lain mengecek typo, *safe-zone*, dan kesesuaian Design System.
   - Jadwalkan di **Meta Business Suite**, ubah status ke `Scheduled`, dan setiap pagi gunakan **`SE Lab Engine → 2. Generate Morning Brief WA`** untuk dikirim ke grup WhatsApp.
