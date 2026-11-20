# SE Lab FILKOM UB — Social Media Management & 3D Content Engine

Sistem manajemen konten harian, pipeline produksi konten terstandar, dan kerangka kerja automasi (*automation framework*) untuk akun Instagram **[@se.lab.filkom](https://www.instagram.com/se.lab.filkom/)** (**Software Engineering Laboratory — FILKOM UB**).

Proyek ini dirancang menggunakan pendekatan **Hybrid Iteratif (Opsi C)**:
- **Fase 1 (MVP Operasional — Rp 0):** Manajemen konten harian berbasis **Google Workspace** (`Google Sheets`, `Google Form`, `Google Drive`, `Google Apps Script`) + koordinasi tim lewat **WhatsApp** + standarisasi *Design System* dari Figma.
- **Fase 2 (Custom Automation & 3D Video Engine):** Evaluasi hasil Fase 1, lalu berkembang ke **Remotion 3D Storytelling Engine** (`@remotion/three`), AI *Script-to-Props* generator, dan bot/dashboard automasi lokal berbasis Node.js.

---

## Struktur Proyek

```text
SOCIAL MEDIA MANAGEMENT LAB RPL/
├── README.md                                  # Ringkasan proyek & panduan cepat
├── design-tokens/
│   └── se-lab-tokens.json                     # Token warna, font, dan aturan format dari Figma
├── docs/
│   ├── 01-system-architecture-and-roadmap.md  # Blueprint arsitektur sistem & roadmap (untuk dosen/tim)
│   ├── 02-design-system.md                    # Design System resmi (@se.lab.filkom) + aturan 3D Light/Dark
│   ├── 03-content-management-and-sop.md       # SOP manajemen harian, rotasi 5 orang, & skema Google Sheets
│   ├── 04-audit-v1-and-training-standards.md  # Hasil audit teknis v1 & standar kualitas 3D
│   ├── 05-content-creation-playbook.md        # Master Playbook produksi konten baru (Read-First!)
│   ├── 06-team-remotion-setup-guide.md        # Panduan setup & penggunaan Remotion untuk tim & PC Lab
│   └── AUDIT-LOG.md                           # Catatan permanen seluruh temuan audit (wajib dipatuhi)
├── templates/
│   └── reels-3d-story-brief.md                # Template naskah cerita 3D (4 babak) + skema JSON props
├── sheets-templates/
│   ├── 01-Master_Kalender_Harian.csv          # Template tab Kalender Harian (siap import ke Google Sheets)
│   ├── 02-Pipeline_Produksi.csv               # Template tab Pipeline Produksi (RPL-001 s.d. RPL-005)
│   ├── 03-Bank_Ide_&_Evaluasi.csv             # Template tab Bank Ide & Evaluasi Mingguan
│   └── IMPORT-GUIDE.md                        # Panduan setup kilat Google Sheets (3 menit)
├── apps-script/
│   └── Code.gs                                # Google Apps Script (Auto-Drive, Auto-Brief, WA Morning Brief, JSON Export)
├── automation/
│   ├── batch-render.mjs                       # Pipeline lokal JSON-to-Video (batch render Remotion)
│   ├── sample-queue.json                      # Contoh payload antrean render
│   └── README.md                              # Panduan automasi batch lokal
└── video-studio/                              # Engine Video 3D Remotion (@remotion/three + VO + Audio Kit)
```

---

## Tim Pengelola (5 Orang — Content Ownership Model)

- **Raditya** — PIC Video Reels & System/Automation Builder
- **Bagas** — Content Owner (Rotasi Mingguan & Snapgram)
- **Hanifah** — Content Owner (Rotasi Mingguan & Snapgram)
- **Lidia** — Content Owner (Rotasi Mingguan & Snapgram)
- **Aurel** — Content Owner (Rotasi Mingguan & Snapgram)

---

## Cara Mulai Fase 1 (Quick Start)

1. Baca [01-system-architecture-and-roadmap.md](docs/01-system-architecture-and-roadmap.md) untuk melihat gambaran utuh sistem yang menjawab 3 target dari dosen.
2. Pelajari [02-design-system.md](docs/02-design-system.md) sebagai acuan visual bersama (Reels 3D, Feeds, Snapgram).
3. Siapkan Google Sheets mengikuti skema di [03-content-management-and-sop.md](docs/03-content-management-and-sop.md), lalu pasang [Code.gs](apps-script/Code.gs) ke **Extensions → Apps Script** di Google Sheets tersebut.
4. Setelah sistem harian berjalan 1–2 minggu, lanjut ke **Fase 2**: membangun prototype video cerita 3D dengan **Remotion (`@remotion/three`)** di folder `video-studio/`.
