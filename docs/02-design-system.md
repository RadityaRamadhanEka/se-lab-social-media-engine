# 02 — Design System Resmi `@se.lab.filkom`

Dokumen ini menstandarkan identitas visual **Software Engineering Laboratory (FILKOM UB)** berdasarkan file Figma `Figma-Instagram-RPL-Lab` agar seluruh output (**Video 3D Remotion, Instagram Feeds, dan Snapgram**) konsisten dan mudah diotomasi.

> Token mesin untuk kode Remotion tersimpan di [se-lab-tokens.json](../design-tokens/se-lab-tokens.json).

---

## 1. Palet Warna Resmi (Dari Page `Color Pallete` Figma)

| Token | Light | Light Hover | Light Active | **Normal (Utama)** | Dark | Darker | Peran Visual |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Blue** | `#e6f0fb` | `#dae9f9` | `#b2d1f2` | **`#086ad4`** | `#06509f` | `#03254a` | Warna primer lab, kubus SE, komponen 3D utama, background terang/gelap. |
| **Orange** | `#fef5ed` | `#fdf1e3` | `#fbe1c6` | **`#f29f47`** | `#b67735` | `#553819` | Diamond atas kubus SE, highlight fokus cerita, paket data/energi 3D, CTA. |
| **Purple** | `#ede6fb` | `#e4d9fa` | `#c8b0f4` | **`#4d00db`** | `#3a00a4` | `#1b004d` | Gradien card, efek *ambient glow* 3D, topik AI/riset/inovasi. |

### Warna Pendukung dari Page `FEED`
- **Wordmark Blue (`#1b4e8a`):** Teks `SOFTWARE ENGINEERING` pada logo header.
- **Deep Navy Bar (`#00024f`):** Footer bar IG & kotak *keyword highlight pill*.
- **Dark Surface (`#1b174f` / `#16153c`):** Latar gelap mode malam / topik teknis berat.
- **Glass Pill Surface:** `rgba(219, 223, 226, 0.2)` dengan border `rgba(186, 186, 186, 0.5)`.

---

## 2. Tipografi Resmi

- **Headline & Body (Feeds + Reels):** **`Plus Jakarta Sans`** (`Medium`, `SemiBold`, `Bold`). Untuk judul besar, gunakan *letter-spacing* sedikit rapat (`-0.02em` s.d. `-0.03em`) dan kombinasikan dengan **Keyword Highlight Pill** (`#00024f` + teks putih).
- **Brand Wordmark:** **`Days One`** (khusus tulisan `SOFTWARE ENGINEERING LABORATORY` pada header/outro).
- **UI & Label Teknis:** `Inter` atau font monospace untuk potongan kode di dalam scene 3D.

---

## 3. Aturan Video Edukasi 3D Storytelling (Remotion)

### A. Dual-Theme Adaptif (Light & Dark Bergantian)
Tema video dipilih menyesuaikan konsep dan suasana cerita konten:

| Mode | Latar & Pencahayaan | Warna Objek 3D & Aksen | Cocok Untuk Topik |
| :--- | :--- | :--- | :--- |
| **Clean Lab Stage (`light`)** | Background `#e6f0fb` ke putih `#ffffff`, lantai 3D grid halus, *soft studio light*. | Objek `#086ad4` & `#4d00db`, aksen `#f29f47`, teks `#03254a` & pill `#00024f`. | Tips produktivitas, alur kerja tim, pengenalan konsep dasar, tutorial UI/UX, info lab. |
| **Deep Tech Stage (`dark`)** | Background `#03254a` → `#1b004d`, glow lembut `#4d00db`, lantai grid bercahaya tipis. | Objek `#086ad4` & kaca transparan, paket data/highlight menyala `#f29f47`, teks putih `#ffffff`. | Arsitektur sistem, API & jaringan, database, Git branching, Docker, topik AI & performa. |

### B. Penempatan Logo & Layout Lega (1080 × 1920)
1. **Selama Cerita Utama (Hook → Penjelasan → Solusi):**
   - Layar dibuat **seleluasa mungkin** untuk panggung ilustrasi 3D dan teks cerita.
   - Tidak perlu menaruh 3 logo institusi sekaligus di atas; cukup watermark ringan ikon kubus SE atau penanda episode kecil agar tidak mengganggu visual 3D.
2. **Bagian Outro Bumper (2–3 Detik Terakhir):**
   - Tampilkan **3 Logo Lengkap (UB + FILKOM + SE Lab)** dalam *Institutional Pill* + logo kubus 3D SE + wordmark `SOFTWARE ENGINEERING LABORATORY` + footer strip `@se.lab.filkom`.

### C. Safe-Zone Instagram Reels (1080 × 1920)
Agar teks/objek penting tidak tertutup UI Instagram (nama akun di bawah, tombol Like/Komen/Share di kanan, dan kamera/status bar di atas):
- **Margin Atas:** Minimal `220px` bebas dari elemen teks penting.
- **Margin Bawah:** Minimal `340px` bebas dari teks/subtitle utama.
- **Margin Kanan:** Minimal `140px` bebas dari label penting.
- **Margin Kiri:** Minimal `72px`.

---

## 4. Aturan Feeds & Snapgram
- **Feeds (1080 × 1350 / Rasio 4:5)** dan **Snapgram (1080 × 1920 / Rasio 9:16)** tetap menggunakan template dan komponen yang sudah ada di file Figma **`Figma-Instagram-RPL-Lab`**.
- **Catatan Koreksi Typo:** Pastikan username pada seluruh template footer terbaru tertulis **`se.lab.filkom`** (bukan `se.lab.fiilkom`), serta periksa ejaan `Software Engineering Laboratory` sebelum ekspor.
