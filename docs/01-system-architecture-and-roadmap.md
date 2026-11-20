# 01 — Arsitektur Sistem & Roadmap (`@se.lab.filkom`)

Dokumen ini memetakan solusi menyeluruh untuk memenuhi 3 kebutuhan utama pengelolaan media sosial **Software Engineering Laboratory (FILKOM UB)**:
1. **Sistem Manajemen Konten Harian** yang konsisten, terpantau, dan adil bagi tim mahasiswa.
2. **Alur Produksi Konten End-to-End** mulai dari ideasi, pembuatan draft/naskah, hingga eksekusi editing.
3. **Sistem & Framework Automasi** agar alur operasional berjalan berkelanjutan tanpa membebani anggota secara manual.

---

## 1. Arsitektur Sistem Keseluruhan

Sistem dirancang dengan memisahkan **Lapisan Kolaborasi Tim** (mudah diakses semua anggota tanpa perlu skill teknis) dan **Lapisan Mesin Automasi & Video 3D** (berjalan otomatis di balik layar):

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ 1. IDEASI (Semua Anggota / Aslab)                                         │
│    Google Form / Bank Ide ---> Tab [Bank_Ide_&_Evaluasi]                  │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 2. MANAJEMEN HARIAN & DRAFTING (Google Workspace - Single Source of Truth)│
│    - Tab [Master_Kalender_Harian]: Slot Reels + Feeds + Snapgram per hari │
│    - Tab [Pipeline_Produksi]: Status, PIC, Deadline, Script, Assets       │
│    - Google Apps Script:                                                  │
│        • Auto-create folder Drive + Google Docs Brief                     │
│        • Generate Morning Brief harian untuk grup WhatsApp                │
│        • Export JSON Props untuk konten Reels berstatus Ready_To_Render   │
└───────────────┬───────────────────────────────────────────┬───────────────┘
                │ (Feeds & Snapgram)                        │ (Reels 3D)
                ▼                                           ▼
┌───────────────────────────────┐         ┌─────────────────────────────────┐
│ 3A. EKSEKUSI FEEDS & SNAPGRAM │         │ 3B. REMOTION 3D VIDEO ENGINE    │
│     Mengikuti Template Figma  │         │     Node.js + @remotion/three   │
│     (1080x1350 & 1080x1920)   │         │     • Terima JSON Props         │
│                               │         │     • Tema Light / Dark adaptif │
│                               │         │     • Render 1080x1920 MP4      │
└───────────────┬───────────────┘         └─────────────────┬───────────────┘
                │                                           │
                └───────────────────┬───────────────────────┘
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ 4. REVIEW, PENJADWALAN & EVALUASI                                         │
│    Final Assets di Google Drive -> Meta Business Suite (Gratis & Resmi)   │
│    -> Evaluasi Insight Mingguan -> Iterasi Sistem                         │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mengapa Pendekatan Hybrid Iteratif (Opsi C)?

Alih-alih langsung membangun sistem kompleks yang memakan waktu berminggu-minggu sebelum ada konten tayang, sistem dibangun secara **bertahap layaknya siklus SDLC / Agile**:

### Fase 1 — MVP Operasional (Minggu 1)
- **Fokus:** Operasional harian langsung berjalan dengan **biaya Rp 0**.
- **Komponen:**
  - Google Sheets (`Master_Kalender_Harian`, `Pipeline_Produksi`, `Bank_Ide_&_Evaluasi`).
  - Google Form untuk setor ide cepat.
  - Google Drive terstruktur untuk aset mentah & hasil akhir.
  - Google Apps Script (`Code.gs`) untuk automasi folder, brief, Morning Brief WhatsApp, dan export JSON.
  - Standar Design System dari Figma (`se-lab-tokens.json`).

### Fase 2 — Evaluasi & Custom Automation Engine (Minggu 2–4+)
- **Pemicu:** Evaluasi data nyata dari 1–2 minggu berjalannya Fase 1 (mengidentifikasi tahap mana yang paling sering menjadi *bottleneck*).
- **Upgrade Sistem Lokal (Node.js):**
  1. **Remotion 3D Storytelling Studio (`video-studio/`):** Membangun template video 3D edukasi menggunakan `@remotion/three` (React Three Fiber) yang membaca `props.json` dari Google Sheets.
  2. **AI Co-Pilot Drafter:** Script lokal yang mengubah ide singkat menjadi draft cerita 4 babak + `props.json` menggunakan Gemini API (free tier).
  3. **WhatsApp Automation Bot (Opsional):** Script bot lokal Node.js untuk mengirim *Morning Brief* dan pengingat deadline otomatis ke grup WhatsApp tim, serta menangkap `/ide` langsung dari chat.

---

## 3. Prinsip Desain Framework

1. **Zero Lock-in & Rp 0 Cost:** Seluruh pipeline menggunakan Google Workspace, Figma, Meta Business Suite, dan Node.js/Remotion open-source.
2. **Modular & Terdokumentasi:** Jika kepengurusan tim medsos berganti di semester berikutnya, sistem mudah diwariskan karena SOP, token desain, dan script terdokumentasi di satu repositori.
3. **Human-Friendly Front, Automation-Ready Back:** Anggota tim non-teknis cukup mengisi form/sheet, sementara struktur kolomnya sudah kompatibel untuk dibaca mesin (*machine-readable*) oleh Remotion.
